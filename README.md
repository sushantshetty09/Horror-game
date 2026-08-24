# Spectrum of Fear: YouTube Horror Game Specification & Agent Master Prompt

This repository contains the full prompt and architecture specification to build **"Spectrum of Fear"**, a playable interactive horror game native to YouTube features (Video Quality, Subtitles/CC, Playback Speed, and 360° Video Controls).

---

## 🎮 Concept Summary

Following the innovation of 360° YouTube games (such as *Mario Kart on YouTube* by Atlas Arcade), **Spectrum of Fear** repurposes YouTube player settings into active game mechanics:

| YouTube Feature | Game Mechanic | In-Game Effect |
| :--- | :--- | :--- |
| **Video Quality (144p)** | Dark Spectral Vision / Thermal | Downsampling reveals hidden infrared entities, monster silhouettes, and glowing room runes. |
| **Video Quality (720p)** | Normal Human Vision | Ambient atmospheric dark lighting. Shadow distortions. |
| **Video Quality (1080p)** | High-Exposure Flashlight | Crisp high definition reveals door lock codes and tripwires, but angers nearby monsters. |
| **Subtitle Tracks (CC)** | Paranormal Equipment | `EN` = EMF Reader<br>`EN-US` = UV Light Scanner<br>`EN-CA` = Sanity/Heartbeat Monitor<br>`EN-IN` = Cryptic Guide |
| **Playback Speed** | Time-Dilation / Adrenaline | `0.25x / 0.5x` = Adrenaline Slow-Mo (evade jumpscares & type key codes)<br>`1.5x / 2.0x` = Fast-Forward |
| **360° Viewport** | Mouse / WASD Steering | Pan camera 360° across 4 key zones (Front Door Keypad, Left Mirror, Right Closet, Back Window). |

---

## 📄 Prompt Usage Guide

To use this project prompt with AI coding agents:

1. Open `PROMPT.md`.
2. Copy the contents of `PROMPT.md` into your AI agent environment (or pass it as context).
3. The agent will execute the multi-step build instructions to generate:
   - Python video generator (`generator/render_360_video.py`) producing equirectangular `.mp4`.
   - Python WebVTT generator (`generator/render_vtt_subtitles.py`) producing `.vtt` tracks.
   - HTML5 / Three.js local interactive simulator player (`web_simulator/`).
   - Automated pytest verification pipeline (`tests/test_gameplay.py`).

---

## 🛠️ File Structure

- `PROMPT.md` - Complete master prompt for automated build agents.
- `README.md` - Documentation overview.
