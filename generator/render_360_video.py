import os
import math
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "horror_360_game.mp4")

WIDTH = 1920
HEIGHT = 960
FPS = 15
DURATION_SEC = 60
TOTAL_FRAMES = FPS * DURATION_SEC

def create_base_room():
    """Generates a 360 equirectangular base background of a dark horror room."""
    img = Image.new("RGB", (WIDTH, HEIGHT), (10, 10, 15))
    draw = ImageDraw.Draw(img)

    # Ceiling & Floor divides
    draw.rectangle([0, 0, WIDTH, 240], fill=(5, 5, 10))       # Ceiling
    draw.rectangle([0, 720, WIDTH, HEIGHT], fill=(20, 15, 12)) # Wooden floor

    # Floor planks lines
    for x in range(0, WIDTH, 60):
        draw.line([(x, 720), (x, HEIGHT)], fill=(30, 22, 18), width=2)
    draw.line([(0, 720), (WIDTH, 720)], fill=(40, 30, 25), width=3)
    draw.line([(0, 240), (WIDTH, 240)], fill=(40, 30, 25), width=3)

    # Wall separators / Pillars
    for x_pos in [0, 480, 960, 1440, 1920]:
        draw.line([(x_pos, 240), (x_pos, 720)], fill=(35, 30, 40), width=6)

    # 1. Back Window (X: 0 - 240 and 1680 - 1920, centered around 0 / 1920)
    # Left part of window at X: 0..120, right part at X: 1800..1920
    draw.rectangle([1800, 320, 1920, 640], fill=(15, 20, 30), outline=(50, 60, 80), width=4)
    draw.rectangle([0, 320, 120, 640], fill=(15, 20, 30), outline=(50, 60, 80), width=4)
    # Moon glow outside window
    draw.ellipse([1840, 350, 1900, 410], fill=(180, 200, 220, 100))

    # 2. Left Mirror Zone (X: 480 center)
    mirror_left, mirror_right = 380, 580
    draw.rectangle([mirror_left, 300, mirror_right, 660], fill=(20, 25, 30), outline=(100, 90, 70), width=6)
    draw.text((430, 270), "HAUNTED MIRROR", fill=(120, 110, 90))

    # 3. Front Door & Keypad Zone (X: 960 center)
    door_left, door_right = 860, 1060
    draw.rectangle([door_left, 280, door_right, 720], fill=(25, 20, 18), outline=(80, 60, 40), width=8)
    draw.ellipse([880, 500, 895, 515], fill=(150, 130, 80)) # Door knob
    draw.text((910, 250), "EXIT DOOR", fill=(140, 120, 100))

    # 4. Right Closet Zone (X: 1440 center)
    closet_left, closet_right = 1340, 1540
    draw.rectangle([closet_left, 280, closet_right, 720], fill=(12, 10, 15), outline=(60, 50, 55), width=8)
    draw.line([1440, 280, 1440, 720], fill=(40, 35, 40), width=4) # Double door slit
    draw.text((1390, 250), "DARK CLOSET", fill=(100, 90, 110))

    return img

def render_frame(frame_num, base_img):
    """Renders a single frame with dynamic 144p spectral and 1080p HD layers."""
    t = frame_num / FPS  # Current time in seconds
    frame = base_img.copy()
    draw = ImageDraw.Draw(frame)

    # --- LAYER 1: 144p Spectral / Thermal Layer (Monster in Closet & Wall Runes) ---
    # Active during 15s - 35s and 50s - 60s
    if (15 <= t <= 35) or (50 <= t <= 60):
        # Spectral Monster silhouette in Right Closet (X: 1440, Y: 350..650)
        pulse = math.sin(t * 4) * 10
        monster_x, monster_y = 1440, 480
        # Thermal aura (large low-frequency glow)
        draw.ellipse([monster_x - 80 - pulse, monster_y - 120, monster_x + 80 + pulse, monster_y + 150], fill=(180, 20, 60))
        draw.ellipse([monster_x - 50, monster_y - 100, monster_x + 50, monster_y - 20], fill=(220, 40, 80)) # Head
        # Glowing red eyes
        draw.ellipse([monster_x - 20, monster_y - 70, monster_x - 5, monster_y - 55], fill=(255, 255, 0))
        draw.ellipse([monster_x + 5, monster_y - 70, monster_x + 20, monster_y - 55], fill=(255, 255, 0))

        # Spectral Wall Runes (Left & Right walls)
        draw.text((450, 400), "ᛏ ᚢ ᚱ ᚾ  144P", fill=(255, 50, 50))
        draw.text((1360, 670), "ENTITY DETECTED", fill=(255, 100, 50))

    # Jumpscare climax at 50s - 60s
    if 50 <= t <= 60:
        # Monster lunges forward across screen
        scale = (t - 50) * 20
        draw.ellipse([960 - 150 - scale*5, 480 - 200 - scale*5, 960 + 150 + scale*5, 480 + 200 + scale*5], fill=(200, 0, 30))
        draw.text((880, 450), "YOU ARE DEAD", fill=(255, 255, 255))

    # --- LAYER 2: 1080p Physical HD Layer (Keypad Code & Fine Details) ---
    # Active during 35s - 50s (Keypad clue active)
    # Keypad on Front Door (X: 960, Y: 420)
    keypad_box = [930, 400, 990, 480]
    draw.rectangle(keypad_box, fill=(40, 45, 50), outline=(200, 200, 200), width=2)
    draw.rectangle([940, 410, 980, 430], fill=(10, 30, 10)) # LCD screen

    if 35 <= t <= 50:
        # High resolution clear keypad text: Code 7394
        draw.text((945, 413), "7394", fill=(50, 255, 50))
        draw.text((915, 375), "CODE: 7394", fill=(220, 220, 220))
        # Tripwire fine lines across door
        draw.line([860, 680, 1060, 680], fill=(255, 0, 0), width=1)
        draw.line([860, 685, 1060, 685], fill=(255, 0, 0), width=1)
    else:
        draw.text((945, 413), "****", fill=(100, 100, 100))

    # Clock / Timestamp HUD embedded on ceiling (X: 960, Y: 80)
    time_str = f"TIME: {int(t):02d}s / 60s"
    draw.text((910, 80), time_str, fill=(180, 180, 180))

    return np.array(frame)

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Generating 360° Horror Game Video ({WIDTH}x{HEIGHT} @ {FPS} FPS, {DURATION_SEC}s)...")

    base_room = create_base_room()

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(OUTPUT_PATH, fourcc, FPS, (WIDTH, HEIGHT))

    for frame_num in range(TOTAL_FRAMES):
        frame_np = render_frame(frame_num, base_room)
        # Convert RGB (PIL) to BGR (OpenCV)
        frame_bgr = cv2.cvtColor(frame_np, cv2.COLOR_RGB2BGR)
        out.write(frame_bgr)

        if (frame_num + 1) % (FPS * 10) == 0:
            print(f" Rendered {(frame_num + 1) // FPS}s / {DURATION_SEC}s")

    out.release()
    print(f"Successfully generated 360° video at: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
