// Game State Machine & YouTube Feature Listener Logic
let gameState = {
    quality: '720p',
    cc: 'OFF',
    speed: 1.0,
    currentTime: 0,
    status: 'PLAYING', // PLAYING, WON, DEAD
    keypadInput: '',
    timeIn1080pNearMonster: 0
};

const CORRECT_CODE = "7394";

// Subtitle Track Content Mapping
const SUBTITLES = {
    'OFF': {
        0: '', 15: '', 35: '', 50: ''
    },
    'EMF': {
        0: '[EMF METER]: 1.2 mG - AMBIENT NORMAL. Scanning...',
        15: '[EMF METER]: |||||||||| 9.8 mG - EXTREME DANGER! Monster in Right Closet!',
        35: '[EMF METER]: 4.5 mG - HIGH SIGNAL NEAR FRONT DOOR. Check 1080p keypad!',
        50: '[EMF METER]: 99.9 mG - CRITICAL FREQUENCY! Jumpscare imminent! Slow time!'
    },
    'UV': {
        0: '[UV SCANNER]: No fluorescent traces found.',
        15: '[UV SCANNER]: Bloodstain: "ONLY 144P SPECTRAL CAN REVEAL THE MONSTER"',
        35: '[UV SCANNER]: Door lock trace active: CODE DIGITS = 7 - 3 - 9 - 4',
        50: '[UV SCANNER]: WARNING! Blood splatter on ceiling! ESCAPE NOW!'
    },
    'SANITY': {
        0: '[SANITY MONITOR]: Heartbeat: 72 BPM | Sanity: 100% | Status: CALM',
        15: '[SANITY MONITOR]: Heartbeat: 135 BPM | Sanity: 62% | Cold spot detected!',
        35: '[SANITY MONITOR]: Heartbeat: 110 BPM | Sanity: 48% | Focus on exit keypad!',
        50: '[SANITY MONITOR]: Heartbeat: 195 BPM | CRITICAL PANIC! USE ADRENALINE (0.5x)'
    },
    'GUIDE': {
        0: '[CRYPTIC GUIDE]: YouTube features are your survival tools.',
        15: '[CRYPTIC GUIDE]: Low quality (144p) downsamples light and exposes spectral entity.',
        35: '[CRYPTIC GUIDE]: High quality (1080p) renders sharp keypad digits on front door.',
        50: '[CRYPTIC GUIDE]: Slow speed (0.5x) grants reaction time to enter code 7394!'
    }
};

// Controls & Menus UI
function toggleDropdown(id) {
    const menus = ['cc-menu', 'speed-menu', 'quality-menu'];
    menus.forEach(m => {
        if (m !== id) document.getElementById(m).classList.remove('show');
    });
    document.getElementById(id).classList.toggle('show');
}

function triggerStaticFlash() {
    const staticOverlay = document.getElementById('static-overlay');
    staticOverlay.classList.add('active');
    setTimeout(() => {
        staticOverlay.classList.remove('active');
    }, 200);
}

function selectQuality(quality) {
    gameState.quality = quality;
    triggerStaticFlash();
    applyQualityEffect(quality);
    updateDropdownActive('quality-menu', quality);
    document.getElementById('quality-menu').classList.remove('show');
}

function selectCC(ccTrack) {
    gameState.cc = ccTrack;
    updateSubtitleDisplay();
    updateDropdownActive('cc-menu', ccTrack);
    document.getElementById('cc-menu').classList.remove('show');
}

function selectSpeed(speed) {
    gameState.speed = speed;
    if (videoElement) {
        videoElement.playbackRate = speed;
    }
    updateDropdownActive('speed-menu', speed + 'x');
    document.getElementById('speed-menu').classList.remove('show');
}

function updateDropdownActive(menuId, textKeyword) {
    const items = document.querySelectorAll(`#${menuId} .dropdown-item`);
    items.forEach(item => {
        if (item.innerText.includes(textKeyword)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function updateSubtitleDisplay() {
    const subOverlay = document.getElementById('subtitle-overlay');
    if (gameState.cc === 'OFF') {
        subOverlay.style.display = 'none';
        return;
    }
    subOverlay.style.display = 'block';

    const t = gameState.currentTime;
    let text = '';
    const track = SUBTITLES[gameState.cc];
    if (t < 15) text = track[0];
    else if (t < 35) text = track[15];
    else if (t < 50) text = track[35];
    else text = track[50];

    subOverlay.innerText = text;
}

// Keypad Modal Logic
function pressKey(num) {
    if (gameState.keypadInput.length < 4) {
        gameState.keypadInput += num;
        document.getElementById('keypad-display').innerText = gameState.keypadInput.padEnd(4, '_');
    }
}

function clearKeypad() {
    gameState.keypadInput = '';
    document.getElementById('keypad-display').innerText = '____';
}

function submitKeypad() {
    if (gameState.keypadInput === CORRECT_CODE) {
        triggerWin();
    } else {
        alert("INCORRECT KEYPAD CODE!");
        clearKeypad();
    }
}

function submitCommentCode() {
    const val = document.getElementById('comment-input').value.trim();
    if (val === CORRECT_CODE) {
        triggerWin();
    } else {
        alert("INCORRECT CODE IN COMMENTS!");
    }
}

function triggerWin() {
    gameState.status = 'WON';
    if (videoElement) videoElement.pause();
    const screen = document.getElementById('status-screen');
    screen.className = 'active win';
    document.getElementById('status-title').innerText = "YOU SURVIVED";
    document.getElementById('status-desc').innerText = "You unlocked the front door using the YouTube quality clues!";
}

function triggerDeath(reason) {
    gameState.status = 'DEAD';
    if (videoElement) videoElement.pause();
    const screen = document.getElementById('status-screen');
    screen.className = 'active dead';
    document.getElementById('status-title').innerText = "GAME OVER";
    document.getElementById('status-desc').innerText = reason || "The entity caught you in the dark.";
}

function restartGame() {
    gameState.status = 'PLAYING';
    gameState.currentTime = 0;
    gameState.timeIn1080pNearMonster = 0;
    document.getElementById('status-screen').className = '';
    document.getElementById('keypad-modal').style.display = 'none';
    clearKeypad();
    if (videoElement) {
        videoElement.currentTime = 0;
        videoElement.play();
    }
}

// Game Loop Listener (100ms interval)
setInterval(() => {
    if (gameState.status !== 'PLAYING' || !videoElement) return;

    gameState.currentTime = videoElement.currentTime;

    // Time display update
    const curMin = Math.floor(gameState.currentTime / 60);
    const curSec = Math.floor(gameState.currentTime % 60);
    document.getElementById('time-display').innerText =
        `${String(curMin).padStart(2, '0')}:${String(curSec).padStart(2, '0')} / 01:00`;

    updateSubtitleDisplay();

    // Check camera angle (lon normalized)
    const normLon = ((lon % 360) + 360) % 360; // 0..360
    // Front door is around 0° or 360°
    const isFacingDoor = (normLon >= 340 || normLon <= 20);
    // Right closet monster is around 90°
    const isFacingMonster = (normLon >= 70 && normLon <= 110);

    // Keypad modal auto-pop up when facing front door during active time (35s-50s)
    const keypadModal = document.getElementById('keypad-modal');
    if (isFacingDoor && gameState.currentTime >= 35 && gameState.currentTime <= 50) {
        keypadModal.style.display = 'flex';
    } else {
        keypadModal.style.display = 'none';
    }

    // Danger mechanic: If facing monster in 1080p mode for > 5 seconds, monster becomes enraged
    if (isFacingMonster && gameState.quality === '1080p' && gameState.currentTime >= 15 && gameState.currentTime <= 35) {
        gameState.timeIn1080pNearMonster += 0.1;
        if (gameState.timeIn1080pNearMonster >= 5.0) {
            triggerDeath("1080p Flashlight angered the monster in the closet!");
        }
    } else {
        gameState.timeIn1080pNearMonster = Math.max(0, gameState.timeIn1080pNearMonster - 0.1);
    }

    // Climax check at 50s-60s: Player must set speed to 0.5x or lower to react
    if (gameState.currentTime >= 55 && gameState.speed > 0.5 && gameState.status === 'PLAYING') {
        triggerDeath("You didn't slow down time with Playback Speed (0.5x) to evade the climax jumpscare!");
    }

}, 100);

// Play button handler
document.addEventListener('DOMContentLoaded', () => {
    const btnPlay = document.getElementById('btn-play');
    if (btnPlay) {
        btnPlay.addEventListener('click', () => {
            if (!videoElement) return;
            if (videoElement.paused) {
                videoElement.play();
                btnPlay.innerText = '⏸';
            } else {
                videoElement.pause();
                btnPlay.innerText = '▶';
            }
        });
    }
});
