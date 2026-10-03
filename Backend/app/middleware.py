import logging
from time import perf_counter
from uuid import uuid4

from starlette.responses import JSONResponse

logger = logging.getLogger("shark_tank.requests")


class RequestContextMiddleware:
    """Bound request bodies even without Content-Length and attach server request IDs."""

    def __init__(self, app, max_request_bytes: int):
        self.app = app
        self.max_request_bytes = max_request_bytes

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        request_id = str(uuid4())
        scope.setdefault("state", {})["request_id"] = request_id
        start = perf_counter()
        status = 500

        async def send_with_headers(message):
            nonlocal status
            if message["type"] == "http.response.start":
                status = message["status"]
                headers = list(message.get("headers", []))
                headers.extend(
                    [
                        (b"x-request-id", request_id.encode()),
                        (b"x-content-type-options", b"nosniff"),
                        (b"cache-control", b"no-store"),
                    ]
                )
                message = {**message, "headers": headers}
            await send(message)

        body = bytearray()
        try:
            while True:
                message = await receive()
                if message["type"] == "http.disconnect":
                    return
                body.extend(message.get("body", b""))
                if len(body) > self.max_request_bytes:
                    response = JSONResponse(
                        status_code=413,
                        content={
                            "error": {
                                "code": "request_too_large",
                                "message": f"Request body exceeds {self.max_request_bytes} bytes",
                                "details": None,
                            },
                            "request_id": request_id,
                        },
                    )
                    return await response(scope, receive, send_with_headers)
                if not message.get("more_body", False):
                    break
            sent_body = False

            async def bounded_receive():
                nonlocal sent_body
                if not sent_body:
                    sent_body = True
                    return {"type": "http.request", "body": bytes(body), "more_body": False}
                return await receive()

            await self.app(scope, bounded_receive, send_with_headers)
        finally:
            route = getattr(scope.get("route"), "path", "/unmatched")
            logger.info(
                "request_id=%s method=%s route=%s status=%s duration_ms=%.1f",
                request_id,
                scope["method"],
                route,
                status,
                (perf_counter() - start) * 1000,
            )
