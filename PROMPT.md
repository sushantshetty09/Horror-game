# MASTER AGENT PROMPT: YouTube Horror Game ("Spectrum of Fear")

> **Instruction for the AI Agent:** You are tasked with building a complete, production-ready, interactive YouTube-native horror game engine and playable prototype titled **"Spectrum of Fear"**. Follow the exact technical architecture, file structure, and step-by-step implementation plan detailed below.

---

## 🎯 Executive Overview & Game Concept

The project **"Spectrum of Fear"** is a playable horror game operating within the constraints of YouTube's native video player (and simulated locally via a custom HTML5/Three.js web player). Rather than executing traditional executable code on YouTube, the game repurposes core video player features into active game mechanics:

1. **Video Quality Settings as Spectral Vision / Visibility:**
   - **`144p` (Dark Spectral Vision / Thermal Mode):** Low resolution and severe compression artifacts reveal infrared spectral entities, glowing runes, and hidden monster positions that are invisible in high definition.
   - **`720p` (Normal Human Vision):** Standard ambient light. The room appears normal, but shadow distortions and deceptive quiet conceal threats.
   - **`1080p` (High-Exposure Flashlight Mode):** Crisp lighting reveals tripwires, key codes, and fine details. *Caution:* High definition illumination angers the monster, triggering aggressive movement.
2. **Subtitle (CC) Track Selection as Inventory & Paranormal Equipment:**
   - `English` → **EMF Meter & Audio Logs** (shows real-time electro-magnetic readings and transcriptions).
   - `English (US)` → **UV / Blacklight Scanner** (reveals bloodstains, fingerprints, and door codes in subtitles).
   - `English (Canada)` → **Sanity & Heartbeat Monitor** (displays player pulse, warning messages, and jump-scare alerts).
   - `English (India)` → **Cryptic Journal / Clue Solver** (decodes puzzle hints based on video timestamp).
3. **Playback Speed as Adrenaline / Time-Dilation:**
   - `0.25x / 0.5x` → **Adrenaline Slow-Mo:** Slows down time during monster attacks, allowing precise inspection and evasion.
   - `1.0x` → **Real-Time Survival.**
   - `1.5x / 2.0x` → **Nightmare Fast-Forward:** Fast-forwards tedious sequences but drastically speeds up monster approach velocity.
4. **360° Equirectangular Video as Camera & Viewport Control:**
   - Native 360° panning (WASD / Mouse drag) allows full panoramic inspection of the haunted room/corridor.

---

## 🏗️ Technical Architecture & File Structure

Generate the following project structure:

```
youtube-horror-game/
├── README.md
├── PROMPT.md
├── requirements.txt
├── package.json
├── generator/
│   ├── __init__.py
│   ├── render_360_video.py      # Python script generating 360° equirectangular video frames
│   ├── render_vtt_subtitles.py   # Python script generating .vtt subtitle tracks for CC hacks
│   ├── assets/                  # Textures, audio synth triggers, 3D room definitions
│   └── output/                  # Generated .mp4 and .vtt files
├── web_simulator/
│   ├── index.html               # Main interactive web simulator & player
│   ├── styles.css               # Styling for game HUD, CRT horror overlay, and controls
│   ├── game_logic.js            # Video quality listener, state machine, win/loss logic
│   └── three_player.js          # Three.js 360° video sphere renderer with quality shader simulation
└── tests/
    └── test_gameplay.py         # Automated pytest/playwright verification suite
```

---

## 🛠️ Detailed Implementation Requirements

### 1. Video Generator Engine (`generator/render_360_video.py`)
- Write a standalone Python script using `opencv-python`, `numpy`, and `Pillow` (or `moviepy` / `manim` / `pyglet`).
- **360° Equirectangular Frame Rendering:**
  - Generate a 360° panoramic haunted room scene (equirectangular 2:1 aspect ratio, e.g., 1920x960 or 3840x1920).
  - Include 4 camera zones: Front (Door/Keypad), Left (Haunted Mirror), Right (Dark Closet/Monster Spawn), Back (Escape Window).
- **Quality-Dependent Visual Encoding Trick:**
  - *144p spectral layer:* Embed low-frequency high-contrast thermal patterns into the image. When downsampled/blurred to 144p, these patterns merge into a visible, glowing monster silhouette and glowing wall runes.
  - *1080p physical detail layer:* Embed high-frequency fine lines (tripwires, 4-digit keypad numbers on the front door) that are only readable when rendered at 1080p.
- **Dynamic Timeline (60 seconds loop):**
  - **0s - 15s:** Exploration phase. Player inspects room.
  - **15s - 35s:** Monster manifests in Right Closet zone. Visible ONLY in 144p.
  - **35s - 50s:** Keypad clue becomes active on Front Door zone. Visible ONLY in 1080p.
  - **50s - 60s:** Monster jumpscare / climax sequence if code is not cracked.
- Output an encoded `.mp4` file (`generator/output/horror_360_game.mp4`) with spatial stereo audio (creaking doors, whispers, heavy breathing).

### 2. Subtitle Track Compiler (`generator/render_vtt_subtitles.py`)
- Generate WebVTT (`.vtt`) subtitle files corresponding to YouTube CC choices:
  - `subtitles_en.vtt` (EMF Meter): Outputs ASCII progress bars `[EMF: |||||... LOW]` progressing to `[EMF: |||||||||| DANGER!]` when monster is nearby.
  - `subtitles_en-US.vtt` (UV Scanner): Displays hidden bloodstain letters (e.g., `[UV LIGHT]: CODE DIGIT 1 = '7' (Look at door in 1080p)`).
  - `subtitles_en-CA.vtt` (Sanity Monitor): Displays heart rate `[BPM: 72 -> 140]` and panic warnings.
  - `subtitles_en-IN.vtt` (Cryptic Guide): Displays lore and riddle solutions.
- Save output `.vtt` files in `generator/output/`.

### 3. Local Web Simulator (`web_simulator/`)
Build a client-side HTML5/Three.js interactive web app that emulates the YouTube 360° player experience and allows full offline playability.

- **`index.html`:**
  - CRT monitor frame aesthetic with scanlines, noise overlay, and retro horror styling.
  - Three.js 360° equirectangular viewport canvas.
  - Custom UI controls matching YouTube player controls:
    - **Quality Selector Dropdown:** `144p (Spectral Vision)`, `720p (Normal)`, `1080p (Flashlight/HD)`.
    - **CC / Subtitle Selector Dropdown:** Off, EMF Reader, UV Scanner, Sanity Monitor, Guide.
    - **Playback Speed Selector Dropdown:** `0.25x`, `0.5x`, `1.0x`, `1.5x`, `2.0x`.
  - Interactive Keypad Modal overlay (pops up when looking at the door at timestamp 35s-50s).
- **`three_player.js`:**
  - Sets up a Three.js `PerspectiveCamera`, `Scene`, and `SphereGeometry` (inward facing) with texture mapped from the video element.
  - Enables mouse drag & WASD keys to look around the 360° sphere seamlessly.
  - Applies custom GLSL shaders or canvas post-processing filters to dynamically simulate video quality switching:
    - `144p`: Severe pixelation filter, thermal palette overlay, exposes hidden spectral layer.
    - `720p`: Standard video pass-through with subtle dark vignette.
    - `1080p`: Enhanced brightness/contrast, sharp texture mapping, exposes physical tripwire layer.
- **`game_logic.js`:**
  - Tracks player state: `currentQuality`, `activeCC`, `playbackSpeed`, `cameraYaw`, `cameraPitch`, `sanityLevel`, `gameStatus` (`PLAYING`, `WON`, `DEAD`).
  - **Mechanics & Win/Loss Conditions:**
    1. Player must pan to Right Closet in `144p` mode between 15s-35s to spot the monster and gain the 1st code digit.
    2. Player must switch to `1080p` mode and pan to Front Door between 35s-50s to read the 2nd and 3rd code digits.
    3. Player must set Playback Speed to `0.5x` during the climax (50s-60s) to slow down time and enter the 4-digit code into the interactive door keypad.
    4. If code is correct → Trigger Escape Victory Screen (`YOU SURVIVED`).
    5. If player stays in `1080p` for more than 10 seconds while monster is near, or fails code → Trigger Jumpscare Death Screen (`GAME OVER`).

### 4. Setup, Run & Verification Pipeline
- Provide `requirements.txt` (including `opencv-python`, `numpy`, `pillow`, `pytest`) and `package.json` (if node/playwright needed).
- Provide CLI commands to execute the build end-to-end:
  ```bash
  python generator/render_360_video.py
  python generator/render_vtt_subtitles.py
  ```
- Include an automated Python test script `tests/test_gameplay.py` that verifies:
  1. Video frame generation produces valid equirectangular `.mp4` file.
  2. Subtitle files `.vtt` are generated and valid WebVTT format.
  3. Web files (`index.html`, `game_logic.js`, `three_player.js`) exist and contain valid syntax.

---

## ⚡ Step-by-Step Instructions for Build Agents

1. **Environment Setup:** Create virtual environment, install requirements (`opencv-python-headless`, `numpy`, `pillow`).
2. **Build Video Renderer:** Implement `generator/render_360_video.py` to programmatically draw a 360° horror room with steganographic 144p spectral vs 1080p HD layers. Generate `generator/output/horror_360_game.mp4`.
3. **Build VTT Subtitle Compiler:** Implement `generator/render_vtt_subtitles.py` generating 4 subtitle files.
4. **Build Web Simulator:** Implement `web_simulator/index.html`, `styles.css`, `game_logic.js`, and `three_player.js` using Three.js (via CDN).
5. **Add Automated Verification:** Write `tests/test_gameplay.py` and execute `pytest` to ensure all components compile, generate assets, and pass validation checks.
6. **Deliver:** Ensure both YouTube upload instructions and local web simulator usage are fully documented in `README.md`.
