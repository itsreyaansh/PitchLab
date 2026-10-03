# PITCHROOM AI — Frontend Design System & Complete UI Specification

**Document Type:** Product UI/UX Design Specification  
**Version:** 1.1  
**Design Direction:** Premium dark AI investor-room interface  
**Primary Experience:** Real-time voice startup pitch inside an immersive virtual investor boardroom  
**Primary Theme:** Black / charcoal / gray / white with one restrained accent color  
**Design Principle:** Serious, cinematic, human, immersive, minimal, intelligent, calm, responsive

---

## 1. Product Overview

### 1.1 Product concept

PITCHROOM AI is a real-time startup pitching and evaluation platform. A founder uploads a short TXT startup brief, enters a live AI investor room, gives the pitch through a microphone, answers dynamic questions from a coordinated AI panel, and receives a final evidence-based evaluation.

The frontend must communicate one clear mental model:

> **Walk into an AI investor room → present → defend → receive structured feedback → improve → pitch again.**

The product should not feel like a generic chatbot, admin dashboard, or game. It should feel like a premium digital investor room.

### 1.2 Core frontend goals

1. Make starting a pitch extremely simple.
2. Make the live voice room feel immersive and real-time.
3. Make it obvious which AI agent is currently speaking.
4. Make live transcript and session state easy to follow without clutter.
5. Make evaluation understandable and evidence-backed.
6. Allow founders to review previous sessions and improvement over time.
7. Maintain a cohesive visual system across every screen.

---

# 2. Information Architecture

## 2.1 Primary navigation

Desktop navigation should use a compact left sidebar.

```text
PITCHROOM AI
│
├── Home
├── New Pitch
├── Sessions
├── Insights
└── Settings
```

At the bottom of the sidebar:

```text
Founder Avatar
Founder Name
Account menu
```

### Navigation behavior

- Sidebar is expanded on desktop.
- Sidebar can collapse to icon-only mode.
- On tablet/mobile it becomes a drawer.
- During a live pitch, normal navigation is minimized and session controls take priority.
- The live room should not expose distracting navigation links.

---

# 3. Sitemap

```text
Landing / App Entry
        │
        ▼
     Dashboard
     ├───────────────┐
     │               │
     ▼               ▼
 New Pitch        Sessions
     │               │
     ▼               └── Session Detail
 Upload Brief             ├── Summary
     │                     ├── Transcript
     ▼                     ├── Agent Insights
 Brief Review              └── Evaluation
     │
     ▼
 Pitch Setup
     │
     ▼
 Immersive Live Investor Room
     │
     ├── Virtual Judge Boardroom
     ├── Live Voice / Lip-Sync
     ├── Compact Transcript
     ├── Panel Status
     └── Session Controls
             │
             ▼
      Evaluation Processing
             │
             ▼
      Final Evaluation
             │
             ├── Score Overview
             ├── Category Breakdown
             ├── Strengths
             ├── Improvement Areas
             ├── Critical Concerns
             ├── Contradictions
             ├── Unanswered Questions
             └── Improvement Plan
```

---

# 4. Design Principles

## 4.1 Visual principles

### Premium dark

Use near-black as the dominant surface. Use charcoal layers to create depth rather than relying on large gradients.

### Rounded system

The visual language should consistently use rounded geometry:

- 16px radius for compact cards
- 20px radius for standard cards
- 24px radius for major panels
- pill shapes for controls and tags
- circular controls for voice interaction

### Calm hierarchy

White is reserved for primary information. Gray is used heavily for secondary information. Accent color is used sparingly for active state, progress, live state, and primary CTAs.

### Cinematic, not flashy

Animations should feel like a premium AI system, not a gaming interface.

### Information density

Live pitch screens may be data-rich, but every region must have a clear purpose.

---

# 5. Color System

The app should be nearly monochrome.

## 5.1 Core colors

```text
Background / Base      #080808
Background / Elevated  #0D0D0D
Surface / Card         #121212
Surface / Raised       #171717
Surface / Hover        #1C1C1C
Border / Subtle        #242424
Border / Strong        #333333
Text / Primary         #F5F5F5
Text / Secondary       #A3A3A3
Text / Muted           #737373
Text / Disabled        #4A4A4A
```

## 5.2 Semantic states

Use one restrained accent color for product identity. The implementation may define it as a CSS variable so it can be changed globally.

```text
Accent / Primary       var(--accent)
Accent / Hover         var(--accent-hover)
Accent / Soft          var(--accent-soft)

Success                #4ADE80
Warning                #FACC15
Critical               #F87171
Info                   #60A5FA
```

Semantic colors are used only where meaning requires them.

---

# 6. Typography

Use a modern sans-serif family with excellent UI readability.

Recommended options:

- Inter
- Geist
- SF Pro equivalent

## 6.1 Type scale

```text
Display XL       48–56px / 600–700
Display L        40–48px / 600–700
Heading 1        32px / 600
Heading 2        24px / 600
Heading 3        18px / 600
Body Large       16px / 400–500
Body             14px / 400–500
Body Small       13px / 400
Caption          12px / 400–500
Metric           48–72px / 600–700
```

Use tight letter spacing for very large headings and normal tracking for body copy.

---

# 7. Spacing System

Use a 4px base unit.

```text
4   8   12   16   20   24   32   40   48   64   80   96
```

Primary rules:

- Page padding: 24–40px desktop
- Major section gap: 32–48px
- Standard card padding: 20–24px
- Dense utility card padding: 16px
- Button horizontal padding: 16–20px

---

# 8. Border Radius & Shape

```text
XS     8px
SM     12px
MD     16px
LG     20px
XL     24px
Pill   9999px
```

Major visual anchors such as the microphone control can use circles.

---

# 9. Shadows and Depth

Avoid heavy shadows.

Use:

- subtle border contrast
- low-opacity elevation shadows
- inner highlights for active controls
- soft glow only for the microphone / active AI speaker when needed

The base UI should still look premium with shadows disabled.

---

# 10. Iconography

Use a modern outline icon library such as Lucide, Phosphor, or another consistent line-icon system.

Never mix multiple unrelated icon styles.

Core icons:

```text
Home
Plus
FileText
Upload
Mic
MicOff
Waveform
Volume2
VolumeX
MessageSquare
Clock
Users
Brain
ChartNoAxesCombined
Target
Wallet / Finance
Megaphone / Growth
Server / Operations
ShieldAlert / Risk
ChevronRight
ArrowLeft
ArrowUpRight
Download
Search
Filter
MoreHorizontal
Settings
LogOut
Check
AlertTriangle
Info
X
```

---

# 11. Global Layout

Desktop application shell:

```text
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  SIDEBAR                 MAIN CONTENT                        │
│                                                              │
│  Logo                    Topbar                              │
│  Home                    ────────────────────────────         │
│  New Pitch               Page Content                        │
│  Sessions                                                    │
│  Insights                Footer / contextual actions        │
│  Settings                                                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

Suggested desktop widths:

- Sidebar: 240px expanded
- Sidebar: 72px collapsed
- Main content: flexible
- Maximum content width for standard pages: 1440px

---

# 12. PAGE 01 — DASHBOARD / HOME

## 12.1 Purpose

The dashboard is the founder's command center.

The user should instantly see:

- Start a new pitch
- Recent pitch sessions
- Current average score
- Improvement trend
- Latest feedback

## 12.2 Layout

```text
┌──────────────────────────────────────────────────────────────────┐
│ Home                                            [Profile]        │
│ Welcome back, Founder                                           │
│ Practice your startup before the real room.                    │
│                                                                  │
│ ┌───────────────────────────────┐  ┌──────────────────────────┐ │
│ │                               │  │ PERFORMANCE              │ │
│ │       + Start New Pitch       │  │                          │ │
│ │                               │  │  Avg Score       78      │ │
│ │ Upload your idea and enter    │  │  Sessions       12       │ │
│ │ the AI investor room.         │  │  Best Score      89      │ │
│ │                               │  │                          │ │
│ │        [ New Pitch → ]        │  │  Improvement  ↗ +11      │ │
│ └───────────────────────────────┘  └──────────────────────────┘ │
│                                                                  │
│ Recent Sessions                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Startup       Score      Duration      Date       →          │ │
│ │ WatchAI       78         09:42         Oct 03                │ │
│ │ ShopFlow      72         11:08         Sep 29                │ │
│ └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## 12.3 Hero card

Large premium card.

Contents:

- small eyebrow: `NEW SESSION`
- heading: `Ready for the room?`
- supporting text
- CTA
- subtle waveform decoration

Do not use excessive decorative graphics.

## 12.4 Performance card

Show three compact metrics:

- Average score
- Sessions completed
- Best score

Then a small trend label.

---

# 13. PAGE 02 — NEW PITCH

## 13.1 Purpose

Start the startup intake flow.

## 13.2 Upload panel

Large centered card:

```text
CREATE YOUR PITCH

Upload your startup brief

┌─────────────────────────────────────────┐
│                                         │
│              ↑                          │
│        Drop TXT file here               │
│                                         │
│     or click to browse                  │
│                                         │
│       .TXT • max file size              │
│                                         │
└─────────────────────────────────────────┘

                      [ Continue → ]
```

## 13.3 File selected state

Show:

```text
✓ startup-idea.txt
54 KB

[ Replace ]
```

CTA changes from disabled to active after successful parsing.

---

# 14. PAGE 03 — STARTUP BRIEF REVIEW

## 14.1 Purpose

Show what the system extracted from the TXT brief before starting the live session.

This step builds trust and prevents incorrect context from silently entering the interview.

## 14.2 Layout

Two-column desktop layout.

Left: structured startup summary.  
Right: original brief preview.

Structured fields:

```text
Startup Name
Problem
Solution
Target Customer
Market
Business Model
Revenue Model
Pricing
Traction
Competition
Competitive Advantage
Team
Funding Ask
Use of Funds
Growth Strategy
```

Each field is editable.

## 14.3 Missing information state

When something is not found:

```text
Not provided
```

Never invent missing values in UI.

A small prompt can say:

`You can add this before entering the room.`

---

# 15. PAGE 04 — PITCH SETUP

## 15.1 Purpose

Allow the founder to prepare the live room.

Controls:

```text
Microphone             [Connected ●]
Speaker                [Default Device]
Pitch Duration         [2 min]
Difficulty             [Adaptive]
Question Intensity     [Balanced]
Pressure Round         [On / Off]
```

### Default recommendation

Keep advanced controls behind an `Advanced settings` accordion so first-time founders are not overwhelmed.

## 15.2 Agent panel preview

Show six agent cards in muted form.

```text
Market
Product & Tech
Finance
Growth
Operations
Investor & Risk
```

Each card contains:

- icon
- role name
- one-line responsibility

CTA:

`Enter Pitch Room →`

---

# 16. PAGE 05 — LIVE INVESTOR BOARDROOM

This screen must NOT resemble a chat application.

The founder should feel as though they are physically sitting across a table from a panel of six investors who are listening, reacting, and speaking in real time. The transcript is a secondary accessibility/debugging layer, not the primary visual experience.

## 16.1 Core experience statement

> **The founder sees people first, conversation second, transcript third.**

The main viewport is a cinematic virtual boardroom containing the founder's viewpoint and six visible AI judge personas. When a judge speaks, the interface visually and audibly makes it obvious that that specific person is speaking.

## 16.2 Recommended visual composition

Use a wide 16:9-style room composition.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ PITCHROOM AI                                  LIVE ●       08:42           │
│                                                                            │
│                  VIRTUAL INVESTOR BOARDROOM                                │
│                                                                            │
│        [MARKET]      [PRODUCT]      [FINANCE]                             │
│         judge          judge          judge                               │
│                                                                            │
│                                                                            │
│        [GROWTH]     [OPERATIONS]      [RISK]                              │
│         judge          judge          judge                               │
│                                                                            │
│                     ───────── TABLE ─────────                              │
│                                                                            │
│                 CURRENT SPEAKER: FINANCE                                   │
│              “What is your customer acquisition cost?”                     │
│                                                                            │
│                         ●  VOICE ACTIVITY                                  │
│                                                                            │
│                  [ Mute ]      [ End Pitch ]                              │
└────────────────────────────────────────────────────────────────────────────┘
```

The exact room arrangement may change based on viewport size, but the experience must always maintain a clear sense of physical space and panel presence.

## 16.3 Boardroom environment

The scene should use a restrained premium investor-room aesthetic:

- dark charcoal walls
- matte black conference table
- subtle practical lighting
- soft depth-of-field
- controlled reflections
- minimal background decoration
- no cyberpunk/neon gaming aesthetic
- no cartoonish avatars
- no floating chat bubbles as the main interaction

The room is there to establish presence, not to distract.

## 16.4 Judge presence

Each judge must have a persistent visual presence during the session.

Recommended representation hierarchy:

**Preferred:** realistic 3D human avatar or high-quality pre-rendered human bust with real-time animation.

**Acceptable fallback:** high-quality photographic/illustrated portrait with procedural head/eye/mouth animation.

**Avoid:** circular profile pictures, emoji avatars, cartoon mascots, generic AI glowing blobs, or static cards that make the experience look like a chatbot.

Each judge representation should include:

- head and shoulders or upper-body framing
- visible face
- natural eye position
- subtle breathing / idle movement
- facial expression states
- speaking animation
- mouth/lip synchronization
- occasional blink
- slight head movement
- active/inactive lighting state

The six judges should visually appear seated around the same table or in a consistent boardroom composition.

## 16.5 Human-like realism rule

The objective is **believable presence**, not artificial hyperactivity.

When an agent is idle, it should not continuously move. Use subtle natural idle loops.

When an agent speaks:

1. The judge becomes visually active.
2. Their mouth synchronizes with generated speech.
3. Their eyes face toward the founder/camera.
4. Their head makes very small natural movements.
5. Their expression matches the conversational intent.
6. Their name/role appears discreetly.
7. The generated voice starts.
8. A subtle voice waveform or audio indicator appears near that judge.

The interface must not make it look like an audio clip is merely playing beside a picture. The animation, facial movement, voice, and UI state must feel like one speaking event.

---

# 17. JUDGE PERSONA VISUAL SYSTEM

Every judge receives a visual identity. The identity should communicate their role without becoming a stereotype.

## 17.1 Persona data

Each judge object should conceptually contain:

```text
agentId
name
role
avatarAsset
voiceId
accent / language settings
visualTheme
expressionState
speakingState
attentionState
position
```

## 17.2 Persona examples

```text
Aarav — Market Analyst
Maya — Product & Technology
Rohan — Finance & Business
Naina — Growth & Marketing
Kabir — Operations & Scale
Vikram — Investor & Risk
```

The names should be configurable; they are illustrative only.

## 17.3 Role labels

When the judge is speaking, show a compact label such as:

```text
FINANCE
Business & Unit Economics
```

Never place long explanatory descriptions over the face.

---

# 18. SPEAKING ANIMATION SYSTEM

This is a critical product requirement.

## 18.1 Judge idle state

When another judge or founder is speaking, the other judges should:

- listen quietly
- blink occasionally
- make very subtle breathing movement
- maintain natural posture
- avoid exaggerated reactions

## 18.2 Judge listening state

The currently attentive judge may have a slightly brighter face light or subtle focus treatment.

Example:

```text
     [JUDGE]   ← subtle focus ring
      listening
```

No large pulsing border should dominate the screen.

## 18.3 Judge speaking state

When speaking, animate multiple coordinated signals:

```text
Face animation
      +
Lip sync
      +
Voice audio
      +
Small head movement
      +
Eye contact
      +
Subtle speaking indicator
```

The speaking agent should visually become the focal point without obscuring the rest of the boardroom.

## 18.4 Speaking indicator

Use a small waveform or audio-reactive halo around the active judge, driven by actual TTS audio amplitude where possible.

Do not use a generic looping animation disconnected from the audio.

## 18.5 Expression states

Keep expressions subtle. Suggested states:

```text
neutral
listening
curious
concerned
interested
challenging
acknowledging
```

Expression selection should be driven by conversation intent, not randomly.

---

# 19. CAMERA / COMPOSITION BEHAVIOR

The founder should feel that the panel is looking at them.

## 19.1 Default camera

Use a stable founder-facing camera perspective. The panel remains visible simultaneously.

## 19.2 Speaker emphasis

When an agent is selected to speak, use a restrained visual reframe:

- subtle scale emphasis
- slightly brighter subject lighting
- lower background contrast around the speaker
- speaker name/role
- audio activity indicator

Do not use aggressive zooms or camera shakes.

## 19.3 Optional speaker focus mode

Provide a user preference for:

**Panel View** — all six judges remain prominent.

**Speaker Focus** — the current judge receives larger visual emphasis while the other five remain visible in a smaller supporting arrangement.

The default should be Panel View.

---

# 20. FOUNDER / CAMERA PRESENCE

The first implementation does not require a live founder video feed, but the room should visually imply the founder is physically present.

Recommended default:

- first-person / over-the-shoulder boardroom perspective
- microphone interaction in foreground
- optional camera-preview toggle

If founder video is enabled, show a small, non-dominant preview rather than replacing the investor room.

---

# 21. CONVERSATION DISPLAY — NOT A CHAT UI

The live conversation must NOT use:

- chat bubbles
- left/right message alignment
- messaging-style timestamps beside every line
- avatar + text bubble layouts
- endless scrolling as the primary experience

Instead, spoken dialogue should appear as a **live subtitle / caption layer**.

## 21.1 Active dialogue caption

When a judge speaks, show the current sentence or short rolling caption at the lower center of the room:

```text
FINANCE · BUSINESS EXPERT

“What is your actual customer acquisition cost?”
```

The caption should update with the streaming TTS/STT text.

## 21.2 Founder captions

When the founder speaks:

```text
YOU

“Our current acquisition cost is around ₹250...”
```

Keep the caption close to the bottom safe area.

## 21.3 Transcript drawer

The complete transcript should be hidden behind a drawer or expandable panel by default.

This preserves the immersive experience.

```text
                    [ Transcript ]
                              ↓
          ┌───────────────────────────────┐
          │ Full Conversation             │
          │ 12:42 You: ...                │
          │ 12:48 Finance: ...            │
          │ 12:57 You: ...                │
          └───────────────────────────────┘
```

The founder can open it when they need accessibility, verification, or review.

---

# 22. AUDIO EXPERIENCE

The voice system is part of the visual experience.

## 22.1 AI voice behavior

Each judge should have a persistent voice identity.

Voice differences should be meaningful but subtle:

- voice timbre
- pace
- confidence
- speaking style

Do not make judges caricatures through exaggerated accents or personalities.

## 22.2 Founder barge-in

If the founder begins speaking while an AI judge is talking:

```text
AI Speaking
     ↓
Founder Voice Detected
     ↓
Immediately stop TTS
     ↓
Judge returns to listening state
     ↓
Founder becomes active speaker
```

The judge visual should also stop mouth animation at the same moment the audio stops.

## 22.3 Silence / pause behavior

Natural pauses should not trigger unnecessary AI interruptions.

Use voice activity detection and turn-end logic.

## 22.4 Audio status

The room should always show a subtle connection/audio status:

```text
● LIVE
Mic connected
Audio stable
```

Warnings should appear only when meaningful.

---

# 23. AGENT STATES IN THE BOARDROOM

The visible judge state model should be:

```text
IDLE
LISTENING
ANALYZING
SELECTED
SPEAKING
INTERRUPTED
COMPLETED
```

Map these states to realistic visual behavior.

### IDLE
Neutral posture and low emphasis.

### LISTENING
Face directed toward founder; subtle attention indicator.

### ANALYZING
Very subtle focus treatment; no “thinking robot” animation.

### SELECTED
Prepare the visual focus before TTS starts.

### SPEAKING
Lip-sync + audio-reactive indicator + subtle head movement.

### INTERRUPTED
Immediately stop speaking animation and return to attentive posture.

### COMPLETED
Return to neutral/listening state.

---

# 24. VIRTUAL BOARDROOM LAYOUTS

## 24.1 Large desktop

Use a wide 6-judge composition with three judges in the back row and three in the front row, or a shallow semicircle around the table.

Do not arrange them as six equal dashboard cards.

## 24.2 Medium desktop / tablet

Use a semicircular composition with the active judge larger and the remaining judges visible as smaller seated figures.

## 24.3 Mobile

Do not attempt to squeeze six full-size judges onto the screen.

Use:

- one primary active speaker
- two small neighboring judges
- compact horizontal panel roster showing all six roles
- swipe/tap access to the remaining judges

The conversation must remain immersive even on a narrow display.

---

# 25. OLD CHAT-BASED LIVE ROOM → NEW EXPERIENCE

The previous concept used a central text message area with agent cards. That should be replaced for the live experience.

### Do not build:

```text
[Finance]
What is your CAC?

[You]
Our CAC is...
```

### Build instead:

```text
                 VIRTUAL BOARDROOM

      [Market]       [Product]       [Finance]
        judge          judge          SPEAKING
                                      ◉~~~~~

      [Growth]     [Operations]        [Risk]
        judge          judge            judge

              ───── Conference Table ─────

                    FINANCE
              “What is your CAC?”

                  ◉ Listening
```

The text is supplementary. The people are the primary interface.

---

# 26. LIVE ROOM UI COMPONENTS

Create reusable components instead of page-specific implementations.

### `InvestorRoom`
Owns the room composition and scene.

### `JudgeAvatar`
Renders human-like judge presence.

Props/state should support:
- idle
- listening
- speaking
- interrupted
- expression
- voice activity

### `JudgeSeat`
Places a judge in the virtual room and controls focus/selection.

### `SpeakingIndicator`
Audio-reactive indicator synchronized with actual voice playback.

### `LiveCaption`
Displays current speaker and streaming dialogue.

### `RoomHeader`
Live status, phase, timer, exit.

### `VoiceControlDock`
Microphone, connection state, mute, end session.

### `TranscriptDrawer`
Secondary full transcript.

### `PhaseProgress`
Compact interview phase indicator.

### `PanelRoster`
Compact six-agent list for responsive layouts.

### `SpeakerFocus`
Handles active-speaker emphasis.

---

# 27. LIVE ROOM MOTION RULES

Motion should communicate state, not decoration.

## Speaking
- lip movement follows TTS timing
- subtle facial micro-movements
- audio-reactive speaking ring
- short focus transition

## Listening
- minimal breathing / blinking
- no continuous large animations

## Agent switching
- 250–450ms visual focus transition
- no hard cut unless necessary for performance

## Founder speaking
- room remains stable
- current caption updates smoothly
- active microphone indicator reacts to actual volume

## Evaluation transition
- room gently fades into evaluation state
- do not use flashy success animation

Respect `prefers-reduced-motion`.

---

# 28. ACCESSIBILITY FOR IMMERSIVE VOICE UI

The experience must remain usable even if the founder cannot rely on animation or audio alone.

Provide:

- live captions
- full transcript
- visible speaker name
- visible speaker role
- clear microphone state
- keyboard-accessible controls
- high contrast labels
- reduced-motion mode

Never communicate “who is speaking” only through a glow or color change.

---

# 29. PERFORMANCE REQUIREMENTS FOR THE BOARDROOM

Because the room may render multiple human-like avatars, performance must be treated as a first-class frontend concern.

Recommended strategy:

- preload the active speaker assets first
- lazy-load low-priority judge assets
- keep inactive judges at lower animation frequency
- avoid six simultaneous expensive video streams
- prefer a shared scene/composition over six independent heavy video elements
- pause or reduce animation for judges outside the visible viewport

The visual quality should degrade gracefully on weaker devices.

Fallback hierarchy:

```text
Real-time 3D / high-quality animated avatar
              ↓
High-quality 2D animated portrait
              ↓
High-quality static portrait + speaking waveform
```

The fallback must still preserve the feeling of a panel rather than reverting to chat cards.

---


# 30. PITCH PHASE INDICATOR

At the top of the room, use a compact step indicator.

```text
Pitch  →  Discovery  →  Cross Exam  →  Pressure  →  Final
```

Current step uses the accent.

Completed steps use a check.

Future steps remain muted.

Do not let this dominate the room.

---

# 31. LIVE SESSION STATES

The interface needs explicit states.

## State A — Connecting

`Connecting to pitch room...`

## State B — Ready

`You're live.`

## State C — Founder speaking

`Listening`

## State D — STT processing

`Transcribing`

## State E — Panel analyzing

`Panel analyzing`

## State F — Agent speaking

`Finance is asking`

## State G — Founder interruption

Immediately stop TTS and return to listening.

## State H — Connection degraded

Show a compact warning:

`Connection unstable — recovering...`

## State I — Session complete

`Pitch complete.`

---

# 32. END SESSION MODAL

When the founder chooses to end:

```text
┌──────────────────────────────────────────┐
│ End this pitch?                          │
│                                          │
│ The panel will evaluate the conversation│
│ after you end the live session.          │
│                                          │
│ [ Continue Pitch ]  [ End & Evaluate ]   │
└──────────────────────────────────────────┘
```

If the session has not reached enough interaction depth, the interface may show a neutral note:

`Ending early may reduce the amount of feedback available in the final report.`

---

# 33. PAGE 06 — EVALUATION PROCESSING

After session end, transition to a full-screen evaluation state.

```text
FINALIZING YOUR PITCH

✓ Reviewing startup brief
✓ Analyzing market discussion
✓ Reviewing product answers
✓ Reviewing financial answers
✓ Reviewing growth strategy
✓ Reviewing operational answers
✓ Checking contradictions
✓ Building final score

                 [ animated processing indicator ]

Your conversation is being converted into an
investor-style feedback report.
```

Avoid fake percentage progress unless the backend provides actual progress.

Use checklist progression instead.

---

# 34. PAGE 07 — FINAL EVALUATION / OVERVIEW

This is the second most important screen after the pitch room.

## 26.1 Top section

```text
YOUR PITCH
WatchAI

AI PANEL EVALUATION

             78
            /100

12:42 session
6 agents • 34 questions
```

The main score is large but should not be the only focus.

## 26.2 Category score cards

Grid of 2–4 columns depending on width.

Each card:

```text
FINANCE
61 / 100
████████████░░░░

Key issue:
Unit economics need stronger evidence.
```

Categories:

- Problem & Market Need
- Solution & Product
- Market & Competition
- Business Model & Revenue
- Financial Understanding
- Go-To-Market
- Scalability & Execution
- Founder Communication

---

# 27. FINAL REPORT — STRENGTHS

Section header:

`What you did well`

Use compact cards.

Example:

```text
✓ Clear customer pain
Strong explanation of the problem and target customer.
```

```text
✓ Confident communication
Answers were direct and easy to follow.
```

Only use observations supported by session evidence.

---

# 28. FINAL REPORT — IMPROVEMENT AREAS

Section header:

`What needs work`

Use a priority-based list without visually implying unsupported certainty.

Each item:

```text
FINANCE
Customer acquisition assumptions need validation.

Evidence
Your stated CAC and later acquisition numbers did not align.

Improve by
Prepare actual customer acquisition data before your next pitch.
```

---

# 29. CONTRADICTION UI

This should be one of the strongest product features.

```text
CONTRADICTION DETECTED

Earlier
"Our CAC is ₹100."

Later
"We spent ₹50,000 to acquire 200 customers."

System calculation
₹50,000 / 200 = ₹250

Why it matters
The investor panel needs one consistent CAC figure.

[ View Transcript ]
```

Use critical semantic color only on the warning icon and small metadata.

Do not make the entire UI red.

---

# 30. UNANSWERED QUESTIONS

Show questions the founder could not answer clearly.

```text
QUESTIONS TO PREPARE

01
What is your actual CAC?

02
What prevents a larger competitor from copying this?

03
What happens to your margins if acquisition costs double?
```

This section is action-oriented and should link to transcript timestamps when possible.

---

# 31. IMPROVEMENT PLAN

Final report should end with:

`Your next pitch checklist`

Example:

```text
□ Validate CAC with real customer data
□ Prepare competitor comparison
□ Clarify pricing logic
□ Explain defensibility in one sentence
□ Prepare a response to price-war scenarios
```

Allow `Mark as complete` on each item if persistent improvement tracking is implemented.

---

# 32. AGENT INSIGHTS PAGE

## 32.1 Purpose

Show a concise summary of what each agent noticed.

Do not reveal hidden model reasoning.

## 32.2 Layout

```text
AI PANEL INSIGHTS

[Market] [Product] [Finance] [Growth] [Operations] [Risk]

FINANCE

Score: 61

Strengths
Revenue model was explained clearly.

Concerns
Customer acquisition assumptions were weakly supported.

Key questions
3 high-value questions were triggered.
```

Each agent tab has:

- Score
- Evidence-backed strengths
- Concerns
- Questions asked
- Important missing information

---

# 33. SESSIONS PAGE

A searchable pitch history.

## 33.1 Header

```text
SESSIONS

[ Search startups... ]    [ Filter ]
```

## 33.2 Session cards

```text
┌────────────────────────────────────────────────┐
│ WatchAI                               78 /100 │
│ AI retail assistant                            │
│ Oct 03 • 09:42                                 │
│                                                │
│ Finance      61   Market       72              │
│ Product      80   Communication 91            │
│                                                │
│                              View report →     │
└────────────────────────────────────────────────┘
```

Sorting options:

- Newest
- Oldest
- Highest score
- Lowest score

Filtering options:

- Date
- Startup
- Score range

---

# 34. SESSION DETAIL PAGE

Tabs:

```text
Overview | Transcript | Panel Insights | Improvements
```

Overview:

- score
- category breakdown
- major strengths
- major concerns

Transcript:

- full conversation
- timestamps
- agent names

Panel Insights:

- per-agent findings

Improvements:

- recommendations
- unresolved questions
- contradiction history

---

# 35. INSIGHTS PAGE

This page focuses on progress across multiple sessions.

## 35.1 Score trend

Use a clean line chart.

Example concept:

```text
Score
90 |
80 |                 ●
70 |       ●     ●
60 |  ●
50 |
   +------------------------
      P1  P2  P3  P4
```

## 35.2 Category trends

Track repeated weakness areas:

```text
Finance             54 → 61 → 70
Market              68 → 72 → 75
Communication      82 → 87 → 91
```

## 35.3 Recurring issues

Show the issues that repeatedly appear across sessions.

Example:

`Unit economics`
`Competitive moat`
`Customer validation`

---

# 36. SETTINGS PAGE

Sections:

## Account

- Name
- Email
- Profile image

## Voice

- Microphone
- Speaker
- Voice preference
- TTS speed

## Pitch Defaults

- Default pitch duration
- Default difficulty
- Pressure round default

## Appearance

- Dark theme
- Compact / comfortable density
- Motion preference

## Privacy

- Transcript retention
- Delete session history
- Clear all data

Danger actions must be visually separated.

---

# 37. MOBILE DESIGN

The live pitch room must be redesigned rather than merely squeezed.

## 37.1 Mobile room structure

```text
┌───────────────────────────────┐
│ ←  LIVE ●          08:42      │
├───────────────────────────────┤
│                               │
│      FINANCE                  │
│   BUSINESS EXPERT             │
│                               │
│           ◉                   │
│                               │
│  "What is your CAC?"          │
│                               │
│      Speaking...              │
│                               │
├───────────────────────────────┤
│      LIVE TRANSCRIPT           │
│      collapsed drawer         │
├───────────────────────────────┤
│                               │
│            ◉                  │
│         Listening             │
│                               │
├───────────────────────────────┤
│       [ End Session ]         │
└───────────────────────────────┘
```

On mobile:

- AI panel becomes a horizontal scroll or bottom sheet.
- Transcript becomes a collapsible drawer.
- Main focus stays on current speaker and microphone.

---

# 38. TABLET DESIGN

Use a two-column approach.

```text
Left / center:
Active speaker + microphone

Right:
Transcript

Agent panel:
Horizontal strip above active speaker
```

---

# 39. RESPONSIVE BREAKPOINTS

Suggested implementation:

```text
Mobile      < 768px
Tablet      768–1100px
Desktop     1100–1440px
Wide        > 1440px
```

Do not depend only on breakpoints. Use fluid sizing and flexible grids.

---

# 40. BUTTON SYSTEM

Primary CTA:

```text
[ Start New Pitch → ]
```

Secondary:

```text
[ View Report ]
```

Tertiary:

```text
[ Cancel ]
```

Destructive:

```text
[ End Session ]
```

Buttons must have:

- hover
- focus
- pressed
- disabled
- loading

states.

---

# 41. INPUT SYSTEM

All text inputs should:

- use dark surfaces
- use subtle border
- have rounded corners
- show clear focus state
- have readable placeholders
- support keyboard navigation

Do not use pure black input backgrounds against pure black page backgrounds without a border or elevation difference.

---

# 42. TOASTS / NOTIFICATIONS

Use compact bottom-right toasts on desktop.

Examples:

`TXT uploaded successfully`

`Microphone connected`

`Session saved`

`Report generated`

Use inline messages for important live-room errors rather than relying only on toasts.

---

# 43. EMPTY STATES

## No sessions

```text
NO PITCHES YET

Your first investor room starts here.

[ Create New Pitch ]
```

## No insights

```text
INSIGHTS WILL APPEAR HERE

Complete at least one pitch session.
```

---

# 44. ERROR STATES

Errors must be human-readable.

Bad:

`WebSocketError 1006`

Good:

`Your live connection dropped. We're reconnecting now.`

Provide a recovery action when possible.

Examples:

- retry
- reconnect microphone
- reload session
- return to dashboard

---

# 45. AUDIO DEVICE STATES

### Microphone disconnected

`Microphone disconnected`

### Permission denied

`Microphone permission is required to start the pitch.`

### Speaker unavailable

`Audio output is unavailable. Check your device.`

### TTS loading

`Preparing voice...`

Never leave the founder guessing whether the system is frozen.

---

# 46. LOADING SYSTEM

Use skeleton loaders for page content.

Use explicit state messaging for AI operations.

Do not show indefinite spinners without text.

Examples:

`Reading your startup brief...`

`Preparing the investor panel...`

`Generating your evaluation...`

---

# 47. MOTION DESIGN

Animation should reinforce state changes.

Use:

- 180–250ms micro-interactions
- 250–400ms panel transitions
- subtle scale on button press
- pulse around active microphone
- smooth score count-up after report loads
- waveform movement only while audio is active

Respect `prefers-reduced-motion`.

---

# 48. ACCESSIBILITY

Minimum requirements:

- WCAG-conscious contrast
- keyboard navigation
- visible focus state
- semantic buttons
- accessible labels for icon buttons
- transcript readable without animation
- do not convey state only through color
- support reduced motion
- microphone state must include text label

Voice interaction is primary but must not be the only way to navigate the product.

---

# 49. FRONTEND COMPONENT INVENTORY

Build reusable components instead of one-off page markup.

## Shell

```text
AppShell
Sidebar
Topbar
MobileDrawer
PageContainer
```

## Navigation

```text
NavItem
ProfileMenu
Breadcrumbs
Tabs
```

## Data display

```text
MetricCard
ScoreCard
SessionCard
AgentCard
InsightCard
IssueCard
RecommendationCard
```

## Form

```text
FileDropzone
TextInput
Textarea
Select
Toggle
Slider
SearchInput
```

## Pitch room

```text
PitchRoom
AgentPanel
AgentCard
ActiveSpeaker
VoiceOrb
Waveform
TranscriptPanel
TranscriptMessage
PhaseIndicator
SessionTimer
ConnectionStatus
```

## Evaluation

```text
EvaluationHeader
OverallScore
CategoryScoreGrid
StrengthList
ConcernList
ContradictionCard
UnansweredQuestionCard
ImprovementChecklist
AgentInsightTabs
```

## Feedback

```text
Toast
InlineAlert
ConfirmModal
LoadingState
EmptyState
ErrorState
```

---

# 50. COMPONENT STATE CONTRACT

Every interactive component should define:

```text
Default
Hover
Focus
Pressed
Disabled
Loading
Success
Error
```

Live components additionally define:

```text
Idle
Listening
Processing
Speaking
Interrupted
Disconnected
Reconnecting
Completed
```

---

# 51. FRONTEND STATE MODEL

The frontend should maintain a clear session state.

```text
session.status
session.phase
session.timer
session.connection
session.audio
session.currentSpeaker
session.currentMessage
session.transcript
session.agents[]
session.evaluationStatus
```

Example:

```json
{
  "status": "live",
  "phase": "cross_exam",
  "connection": "connected",
  "audio": "listening",
  "currentSpeaker": "finance",
  "evaluationStatus": "idle"
}
```

The frontend should render from state rather than duplicating business logic in many components.

---

# 52. LIVE AGENT STATUS MODEL

Each agent should expose UI-safe state:

```text
idle
analyzing
selected
speaking
completed
```

Do not expose private model reasoning.

Display:

```text
Analyzing your response...
Panel reviewing...
Question selected...
```

---

# 53. ACCESSIBILITY COPY FOR LIVE STATE

All visual live states require corresponding text.

Examples:

Visual pulse + text:

`Listening`

Visual speaker highlight + text:

`Finance is speaking`

Visual spinner + text:

`Panel analyzing your answer`

---

# 54. UX MICROCOPY

## New pitch

`Bring your idea into the room.`

## Upload

`Upload a short TXT brief so the panel can understand your startup.`

## Pitch room

`Take your time. The panel is listening.`

## Thinking

`Panel reviewing your response...`

## Question

`Finance is asking`

## Completion

`Pitch complete. Your investor-style report is ready.`

## Contradiction

`The panel found a possible inconsistency.`

Avoid aggressive or insulting language.

---

# 55. DESIGN FOR TRUST

Because the system is making evaluative judgments, the UI should clearly distinguish:

### Founder-provided

```text
Founder stated
```

### System calculation

```text
Calculated from your answers
```

### AI observation

```text
Panel observation
```

### Missing information

```text
Not provided
```

This prevents the report from appearing to invent facts.

---

# 56. REPORT EXPORT

The evaluation page should offer:

```text
[ Download Report ]
[ Copy Summary ]
```

Optional future feature:

`Export PDF`

The UI should make this secondary to the main report, not the primary CTA.

---

# 57. DESIGN TOKENS

Example CSS variables:

```css
:root {
  --bg: #080808;
  --surface-1: #0D0D0D;
  --surface-2: #121212;
  --surface-3: #171717;
  --surface-hover: #1C1C1C;

  --border-subtle: #242424;
  --border-strong: #333333;

  --text-primary: #F5F5F5;
  --text-secondary: #A3A3A3;
  --text-muted: #737373;
  --text-disabled: #4A4A4A;

  --success: #4ADE80;
  --warning: #FACC15;
  --danger: #F87171;
  --info: #60A5FA;

  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 20px;
  --radius-xl: 24px;
  --radius-pill: 9999px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

---

# 58. RECOMMENDED FRONTEND ROUTES

```text
/
/dashboard
/pitch/new
/pitch/:id/brief
/pitch/:id/setup
/pitch/:id/live
/pitch/:id/evaluation
/pitch/:id/transcript
/pitch/:id/insights
/sessions
/sessions/:id
/insights
/settings
```

If authentication is added:

```text
/login
/signup
/forgot-password
```

---

# 59. FRONTEND UX FLOW — FINAL

```text
                 DASHBOARD
                     │
                     ▼
               + NEW PITCH
                     │
                     ▼
             UPLOAD TXT BRIEF
                     │
                     ▼
              PARSE & EXTRACT
                     │
                     ▼
              REVIEW BRIEF
                     │
                     ▼
              PITCH SETUP
                     │
                     ▼
              ┌─────────────┐
              │  LIVE ROOM  │
              └──────┬──────┘
                     │
          ┌──────────┴───────────┐
          │                      │
     FOUNDER SPEAKS          AI SPEAKS
          │                      │
          ▼                      ▼
         STT                    TTS
          │                      │
          └──────────┬───────────┘
                     ▼
              PANEL ANALYZES
                     │
                     ▼
                ORCHESTRATOR
                     │
                     ▼
               NEXT QUESTION
                     │
                     └───────────────┐
                                     │
                                     ▼
                               REPEAT LOOP
                                     │
                                     ▼
                                END SESSION
                                     │
                                     ▼
                            EVALUATION ENGINE
                                     │
                                     ▼
                              FINAL REPORT
                                     │
                    ┌────────────────┼───────────────┐
                    ▼                ▼               ▼
                SCORECARD       CONTRADICTIONS    IMPROVEMENTS
```

---

# 60. FINAL VISUAL DIRECTION

The app should look like a premium combination of:

- modern AI workspace
- private investor room
- executive dashboard
- real-time voice interface

Reference the visual discipline of premium productivity software rather than gaming interfaces.

The final visual hierarchy should be:

```text
1. Current action
2. Current speaker
3. Conversation
4. AI panel state
5. Session progress
6. Secondary controls
```

During evaluation:

```text
1. Overall score
2. What caused the score
3. Category breakdown
4. Critical observations
5. Actionable improvements
6. Full transcript / detail
```

---

# 61. DESIGN DO / DON'T

## DO

- Use dark layered surfaces.
- Use rounded cards consistently.
- Keep typography large and readable.
- Make the active AI agent obvious.
- Make every live state explicit.
- Use subtle motion.
- Keep the transcript easy to follow.
- Show evidence behind evaluation results.
- Preserve a clean responsive layout.
- Reuse components and tokens.

## DON'T

- Do not make it look like a generic ChatGPT clone.
- Do not make it neon/gaming-like.
- Do not show all six agents talking simultaneously.
- Do not expose model chain-of-thought.
- Do not use invented startup facts in the UI.
- Do not rely on color alone for state.
- Do not overload the live room with analytics.
- Do not bury microphone status.
- Do not use random icon styles.
- Do not build page-specific components when a reusable system component is appropriate.

---

# 62. IMPLEMENTATION PRIORITY

Build the frontend in this order:

### Phase 1 — Design Foundation

1. Theme tokens
2. Typography
3. App shell
4. Sidebar
5. Buttons
6. Cards
7. Icon system
8. Inputs
9. Modals

### Phase 2 — Core Founder Flow

1. Dashboard
2. New Pitch
3. Upload TXT
4. Brief Review
5. Pitch Setup

### Phase 3 — Live Room

1. Pitch Room layout
2. Agent panel
3. Active speaker
4. Voice orb
5. Waveform
6. Transcript
7. Session controls
8. Live states

### Phase 4 — Evaluation

1. Evaluation processing
2. Score overview
3. Category scores
4. Strengths
5. Improvement areas
6. Contradictions
7. Unanswered questions
8. Improvement checklist

### Phase 5 — History & Analytics

1. Sessions
2. Session detail
3. Insights
4. Progress tracking

### Phase 6 — Polish

1. Responsive behavior
2. Accessibility
3. Motion
4. Loading states
5. Error handling
6. Empty states
7. Performance optimization

---

# 63. DEFINITION OF DONE — FRONTEND

The frontend is considered complete when:

- A founder can navigate from dashboard to live room without confusion.
- TXT startup brief can be represented in a clean review UI.
- The pitch room clearly identifies the current AI speaker.
- Microphone states are always visible.
- Live transcript updates in the intended layout.
- Agent states communicate collaboration without exposing private reasoning.
- End-session flow is clear and safe.
- Evaluation page explains the final score through evidence and category breakdown.
- Contradictions have a dedicated visual treatment.
- Session history is searchable and reviewable.
- The entire system works coherently on desktop, tablet, and mobile.
- All pages use the same theme, spacing, radius, typography, and iconography.

---

# 64. ONE-SENTENCE PRODUCT DESIGN BRIEF

> **Design PITCHROOM AI as a premium, dark, rounded, cinematic real-time AI investor room where the founder is always the center of attention and every interface state clearly communicates what the panel is doing, what the founder needs to do next, and how the final evaluation was formed.**
