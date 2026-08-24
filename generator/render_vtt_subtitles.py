import os

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")

SUBTITLE_TRACKS = {
    "subtitles_en.vtt": [
        ("00:00.000", "00:15.000", "[EMF METER]: 1.2 mG - AMBIENT NORMAL\nScanning frequency 144.1 MHz..."),
        ("00:15.000", "00:35.000", "[EMF METER]: |||||||||| 9.8 mG - EXTREME DANGER!\nEntity anomaly detected in Right Closet! Switch vision!"),
        ("00:35.000", "00:50.000", "[EMF METER]: 4.5 mG - HIGH SIGNAL NEAR FRONT DOOR\nInspect keypad in high exposure HD!"),
        ("00:50.000", "01:00.000", "[EMF METER]: 99.9 mG - CRITICAL FREQUENCY!\nJUMPSCARE IMMINENT! SLOW DOWN TIME NOW!"),
    ],
    "subtitles_en-US.vtt": [
        ("00:00.000", "00:15.000", "[UV SCANNER]: No fluorescent traces found in general room area."),
        ("00:15.000", "00:35.000", "[UV SCANNER]: Bloodstain detected! Text reads: 'ONLY SPECTRAL 144P CAN REVEAL THE MONSTER'"),
        ("00:35.000", "00:50.000", "[UV SCANNER]: Door lock trace active: CODE DIGITS = 7 - 3 - 9 - 4 (Look at keypad in 1080p)"),
        ("00:50.000", "01:00.000", "[UV SCANNER]: WARNING! Blood splatter expanding on ceiling! ESCAPE NOW!"),
    ],
    "subtitles_en-CA.vtt": [
        ("00:00.000", "00:15.000", "[SANITY MONITOR]: Heartbeat: 72 BPM | Sanity: 100% | Status: CALM"),
        ("00:15.000", "00:35.000", "[SANITY MONITOR]: Heartbeat: 135 BPM | Sanity: 62% | WARNING: Cold spot detected!"),
        ("00:35.000", "00:50.000", "[SANITY MONITOR]: Heartbeat: 110 BPM | Sanity: 48% | Focus on exit lock code!"),
        ("00:50.000", "01:00.000", "[SANITY MONITOR]: Heartbeat: 195 BPM | Sanity: 5% | CRITICAL PANIC! USE ADRENALINE (0.5x)"),
    ],
    "subtitles_en-IN.vtt": [
        ("00:00.000", "00:15.000", "[CRYPTIC GUIDE]: Welcome, seeker. YouTube features are your survival tools."),
        ("00:15.000", "00:35.000", "[CRYPTIC GUIDE]: Low quality (144p) downsamples light and exposes hidden spectral entities."),
        ("00:35.000", "00:50.000", "[CRYPTIC GUIDE]: High quality (1080p) renders sharp keypad numbers on the front door."),
        ("00:50.000", "01:00.000", "[CRYPTIC GUIDE]: Slow play speed (0.5x) grants reaction time to type keycode '7394'!"),
    ]
}

def generate_vtt_file(filename, cues):
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("WEBVTT\n\n")
        for start, end, text in cues:
            f.write(f"{start} --> {end}\n")
            f.write(f"{text}\n\n")
    print(f"Generated WebVTT file: {filepath}")

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for filename, cues in SUBTITLE_TRACKS.items():
        generate_vtt_file(filename, cues)

if __name__ == "__main__":
    main()
