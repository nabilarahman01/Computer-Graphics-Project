import * as THREE from 'three';

// Create a group for the cottage
const cottageGroup = new THREE.Group();

// Load textures
const textureLoader = new THREE.TextureLoader();

// Initial textures
const wallTextures = [
    textureLoader.load('texture/wall-texture.jpg'),
    textureLoader.load('texture/wall-texture1.JPG'),
    textureLoader.load('texture/wall-texture2.jpg'),
    textureLoader.load('texture/wall-texture3.jpg'),
    textureLoader.load('texture/wall-texture4.jpg')
];

const roofTextures = [
    textureLoader.load('texture/roof2.jpeg'),
    textureLoader.load('texture/roof.png'),
    textureLoader.load('texture/roof3.avif')
];

const doorTextures = [
    textureLoader.load('texture/door_texture.jpg'),
    textureLoader.load('texture/door_texture1.jpg'),
    textureLoader.load('texture/door_texture2.jpg')
];

const windowTextures = [
    textureLoader.load('texture/window-texture.jpeg'),
    textureLoader.load('texture/window-texture1.jpeg'),
    textureLoader.load('texture/window-texture2.jpeg')
];

const chimneyTextures = [
    textureLoader.load('texture/chimney-texture.avif'),
    textureLoader.load('texture/chimney.jpeg'),
    textureLoader.load('texture/chimneyy.jpg')
];

const groundTexture = textureLoader.load('texture/grass_texture.jpg');
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(5, 5);

// Function to get a random texture from a list
const getRandomTexture = (textures) => textures[Math.floor(Math.random() * textures.length)];

// Create walls
const wallGeometry = new THREE.BoxGeometry(8, 5, 6);
const wallMaterial = new THREE.MeshStandardMaterial({ map: getRandomTexture(wallTextures), side: THREE.DoubleSide });
const walls = new THREE.Mesh(wallGeometry, wallMaterial);
walls.position.set(0, 0, 0);
cottageGroup.add(walls);

// Create roof
const roofGeometry = new THREE.ConeGeometry(6, 4, 4);
const roofMaterial = new THREE.MeshStandardMaterial({ map: getRandomTexture(roofTextures), side: THREE.DoubleSide });
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.y = 4.5;
roof.rotation.y = Math.PI / 4;
cottageGroup.add(roof);

// Create door
const doorGeometry = new THREE.BoxGeometry(2, 3.5, 0.1);
const doorMaterial = new THREE.MeshStandardMaterial({ map: getRandomTexture(doorTextures), side: THREE.DoubleSide });
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.set(0, -1.25, 3.01);
cottageGroup.add(door);

// Create windows
const windowGeometry = new THREE.BoxGeometry(2, 1.5, 0.1);
const windowMaterial = new THREE.MeshStandardMaterial({ map: getRandomTexture(windowTextures), side: THREE.DoubleSide });

const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
leftWindow.position.set(-4, 1, 0);
leftWindow.rotation.y = Math.PI / 2;
cottageGroup.add(leftWindow);

const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
rightWindow.position.set(4, 1, 0);
rightWindow.rotation.y = -Math.PI / 2;
cottageGroup.add(rightWindow);

// Create chimney
const chimneyGeometry = new THREE.BoxGeometry(0.8, 2.5, 0.8);
const chimneyMaterial = new THREE.MeshStandardMaterial({ map: getRandomTexture(chimneyTextures), side: THREE.DoubleSide });
const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
chimney.position.set(-1.5, 6, -1);
cottageGroup.add(chimney);

// Create ground
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -2;
cottageGroup.add(ground);

// Position the cottage in the scene
cottageGroup.position.set(0, 4.0, 0);

// Add the cottage to the main scene
document.addEventListener('DOMContentLoaded', () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 6, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene.add(cottageGroup);

    // Lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Change texture on mouse click
    document.addEventListener('click', () => {
        console.log("Changing textures...");
        walls.material.map = getRandomTexture(wallTextures);
        roof.material.map = getRandomTexture(roofTextures);
        door.material.map = getRandomTexture(doorTextures);
        leftWindow.material.map = getRandomTexture(windowTextures);
        rightWindow.material.map = getRandomTexture(windowTextures);
        chimney.material.map = getRandomTexture(chimneyTextures);

        walls.material.needsUpdate = true;
        roof.material.needsUpdate = true;
        door.material.needsUpdate = true;
        leftWindow.material.needsUpdate = true;
        rightWindow.material.needsUpdate = true;
        chimney.material.needsUpdate = true;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        scene.rotation.y += 0.01;

        renderer.render(scene, camera);
    }

    animate();
});
