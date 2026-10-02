import os
import pytest

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "generator", "output")
WEB_SIMULATOR_DIR = os.path.join(os.path.dirname(__file__), "..", "web_simulator")

def test_generated_video_exists():
    video_path = os.path.join(OUTPUT_DIR, "horror_360_game.mp4")
    assert os.path.exists(video_path), "360 Video file horror_360_game.mp4 does not exist."
    assert os.path.getsize(video_path) > 100000, "360 Video file is unexpectedly small."

def test_generated_subtitles_exist():
    vtt_files = [
        "subtitles_en.vtt",
        "subtitles_en-US.vtt",
        "subtitles_en-CA.vtt",
        "subtitles_en-IN.vtt"
    ]
    for filename in vtt_files:
        filepath = os.path.join(OUTPUT_DIR, filename)
        assert os.path.exists(filepath), f"Subtitle file {filename} does not exist."
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            assert content.startswith("WEBVTT"), f"Subtitle file {filename} missing WEBVTT header."

def test_web_simulator_files_exist():
    required_files = [
        "index.html",
        "styles.css",
        "game_logic.js",
        "three_player.js"
    ]
    for filename in required_files:
        filepath = os.path.join(WEB_SIMULATOR_DIR, filename)
        assert os.path.exists(filepath), f"Web simulator file {filename} does not exist."
