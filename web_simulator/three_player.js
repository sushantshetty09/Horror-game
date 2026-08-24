// Three.js 360° Video Equirectangular Renderer
let scene, camera, renderer, sphereMesh, canvasElement;
let videoElement, videoTexture;
let isUserInteracting = false, onMouseDownMouseX = 0, onMouseDownMouseY = 0;
let lon = 0, onMouseDownLon = 0, lat = 0, onMouseDownLat = 0;
let phi = 0, theta = 0;

function init360Player() {
    canvasElement = document.getElementById('canvas360');
    const container = document.getElementById('player-container');

    // Create Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);

    // Create Sphere Geometry (Inward facing)
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    // HTML5 Video element
    videoElement = document.createElement('video');
    videoElement.src = '../generator/output/horror_360_game.mp4';
    videoElement.loop = true;
    videoElement.muted = true; // allow autoplay
    videoElement.playsInline = true;
    videoElement.load();

    videoTexture = new THREE.VideoTexture(videoElement);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    const material = new THREE.MeshBasicMaterial({ map: videoTexture });
    sphereMesh = new THREE.Mesh(geometry, material);
    scene.add(sphereMesh);

    // WebGL Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvasElement, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Event Listeners for 360 Camera Dragging
    canvasElement.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    window.addEventListener('resize', onWindowResize);

    // Keyboard Controls WASD
    document.addEventListener('keydown', (e) => {
        if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') lon -= 5;
        if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') lon += 5;
        if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') lat = Math.min(85, lat + 5);
        if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') lat = Math.max(-85, lat - 5);
    });

    animate();
}

function onWindowResize() {
    const container = document.getElementById('player-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function onPointerDown(event) {
    isUserInteracting = true;
    onMouseDownMouseX = event.clientX;
    onMouseDownMouseY = event.clientY;
    onMouseDownLon = lon;
    onMouseDownLat = lat;
}

function onPointerMove(event) {
    if (!isUserInteracting) return;
    lon = (onMouseDownMouseX - event.clientX) * 0.1 + onMouseDownLon;
    lat = (event.clientY - onMouseDownMouseY) * 0.1 + onMouseDownLat;
}

function onPointerUp() {
    isUserInteracting = false;
}

function updateCamera() {
    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);

    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.cos(phi);
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(camera.target);
}

function animate() {
    requestAnimationFrame(animate);
    updateCamera();
    renderer.render(scene, camera);
}

// Shader / Canvas Quality Visual Effects Simulation
function applyQualityEffect(quality) {
    const canvas = document.getElementById('canvas360');
    if (quality === '144p') {
        canvas.style.filter = 'contrast(2.2) brightness(0.7) hue-rotate(320deg) saturate(3.0) blur(2px)';
    } else if (quality === '1080p') {
        canvas.style.filter = 'contrast(1.2) brightness(1.3) saturate(1.1) blur(0px)';
    } else { // 720p
        canvas.style.filter = 'contrast(1.0) brightness(0.9) saturate(0.9) blur(0px)';
    }
}

window.addEventListener('DOMContentLoaded', init360Player);
