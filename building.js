import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MathUtils } from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Smooth shadows
document.body.appendChild(renderer.domElement);




// Create a plane (Ground)
const textureLoader1 = new THREE.TextureLoader();
const grassTexture = textureLoader1.load('grass.jpg');

grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(4, 4);

const geometry = new THREE.PlaneGeometry(70, 70);
const material = new THREE.MeshStandardMaterial({
    map: grassTexture,
    color: 0x00aa00, 
    side: THREE.DoubleSide
});
//const material = new THREE.MeshStandardMaterial({ map: grassTexture, side: THREE.DoubleSide });
const plane = new THREE.Mesh(geometry, material);
plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;
scene.add(plane);
// Set camera position for full scene visibility
camera.position.set(0, -20, 450);
camera.lookAt(0, 0, 0); 

// Add OrbitControls (though we will update controls programmatically)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;
controls.dampingFactor = 0.3;
controls.rotateSpeed = 4;
controls.enableZoom = true;
controls.enablePan = false; // Disable panning to lock plane in center
//controls.target.set(0, 100, -60);
controls.update();

// Add Sky
const sky = new Sky();
sky.scale.setScalar(450000);
scene.add(sky);

// Sky properties
const skyUniforms = sky.material.uniforms;
skyUniforms["turbidity"].value = 6;
skyUniforms["rayleigh"].value = 1.5;
skyUniforms["mieCoefficient"].value = 0.005;
skyUniforms["mieDirectionalG"].value = 0.7;

// Set sun position
const phi = MathUtils.degToRad(90);
const theta = MathUtils.degToRad(180);
const sunPosition = new THREE.Vector3().setFromSphericalCoords(1, phi, theta);
skyUniforms["sunPosition"].value.copy(sunPosition);

// Add Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Shadow settings (Optimized for better performance)
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 200;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;

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
door.position.set(0, -0.8, 3.01);
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

/* Create ground
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -2;
cottageGroup.add(ground);*/

// Position the cottage in the scene
cottageGroup.position.set(6, 2.6, 32);
cottageGroup.scale.set(.5, 0.8, .5); 
cottageGroup.rotation.y = Math.PI / 2; 


scene.add(cottageGroup);



// Load First Model
const loader = new GLTFLoader().setPath('model8/');
loader.load('scene.gltf', (gltf) => {
    console.log('Model 8 loaded successfully');
    const mesh = gltf.scene;

    mesh.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
        }
    });

    mesh.scale.set(1.5, 1.5, 1.5);
    mesh.position.set(19.5, 1.8, 25.0);
    scene.add(mesh);

    // Adjust camera focus
    //controls.target.copy(mesh.position);
    //controls.update();
}, (xhr) => {
    console.log(`Loading: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
}, (error) => {
    console.error('Error loading model:', error);
});

// Load Second Model (Building)
/*let buildingModel;
const loader1 = new GLTFLoader().setPath('model1/');
loader1.load('scene.gltf', (gltf) => {
    console.log('Building model (model1) loaded successfully');
    const mesh = gltf.scene;
    mesh.name = "model1"; // Name it for reference in animation
    buildingModel = mesh; // Store the model reference

    mesh.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    mesh.scale.set(0.38, 0.36, 0.5);
    mesh.position.set(-23.9, -0.2, -9.8);
    scene.add(mesh);

    // Adjust camera focus
    controls.target.copy(mesh.position);
    controls.update();
}, (xhr) => {
    console.log(`Loading: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
}, (error) => {
    console.error('Error loading model:', error);
});*/

let buildingModel;
const loader1 = new GLTFLoader().setPath('model1/');
loader1.load('scene.gltf', (gltf) => {
    console.log('Building model (model1) loaded successfully');
    const mesh = gltf.scene;
    mesh.name = "model1"; // Name it for reference in animation
    buildingModel = mesh; // Store the model reference

    mesh.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Keep existing texture and apply custom shader effects
            child.material = new THREE.ShaderMaterial({
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec2 vUv;
                    uniform sampler2D textureMap;
                    void main() {
                        vec4 texColor = texture2D(textureMap, vUv);
                        gl_FragColor = texColor; // Keep original texture
                    }
                `,
                uniforms: {
                    textureMap: { value: child.material.map } // Use original texture
                }
            });
        }
    });

    mesh.scale.set(0.38, 0.36, 0.5);
    mesh.position.set(-23.9, -0.2, -9.8);
    scene.add(mesh);

    // Adjust camera focus
    //controls.target.copy(mesh.position);
    //controls.update();
}, (xhr) => {
    console.log(`Loading: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
}, (error) => {
    console.error('Error loading model:', error);
});



// Maple tree model data
const modelData = [
    { position: [-3.0, 0.001, -11.5], scale: [11, 11, 11] },
    { position: [-3.0, 0.001, -17.5], scale: [11, 11, 11] },
    { position: [-3.0, 0.001, -23.5], scale: [9, 9, 9] },
    { position: [-32, 0.001, -23.5], scale: [9, 9, 9] },
    { position: [-32, 0.001, -17.5], scale: [9, 9, 9] },
    { position: [-32, 0.001, -11.5], scale: [9, 9, 9] },
    { position: [6.1, 0.003, 23.5], scale: [9, 9, 9] },
    { position: [6.1, 0.003, 17.5], scale: [9, 9, 9] },
    { position: [10.0, 0.001, -11.5], scale: [6, 6, 6] },
    { position: [10.0, 0.001, -17.5], scale: [6, 6, 6] },
    { position: [10.0, 0.001, -23.5], scale: [9, 9, 9] }
];

// 2nd Gach model data
const modelData1 = [
    { position: [-16, 0.0, 0.0], scale: [1.5, 1.9, 1.5] },
    { position: [-20, 0.0, 0.0], scale: [1.5, 1.9, 1.5] },
    { position: [-12, 0.0, 0.0], scale: [1.5, 1.9, 1.5] },
    { position: [32, 0.0, 15.0], scale: [1.5, 1.9, 1.5] }
];

// Model data for rotation and positioning
const modelData4 = [
    { position: [-4.3, 0, -3.0], scale: [1.5, 1.5, 1.5], rotation: [0, 0, 0] },
    { position: [2.8, 0, -27.0], scale: [1.5, 1.5, 1.5], rotation: [0, Math.PI / 2, 0] }
];

// Loader function
function loadModels(modelData, path, loader) {
    modelData.forEach(({ position, scale, rotation = [0, 0, 0] }, index) => {
        loader.load('scene.gltf', (gltf) => {
            console.log(`Model ${index + 1} loaded successfully`);
            const mesh = gltf.scene;
            mesh.name = `model${index + 1}`;

            mesh.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = false;
                    child.receiveShadow = false;
                }
            });

            mesh.scale.set(...scale);
            mesh.position.set(...position);
            mesh.rotation.set(...rotation);
            scene.add(mesh);

            // Adjust camera focus (optional)
            //controls.target.copy(mesh.position);
            //ontrols.update();
        }, (xhr) => {
            console.log(`Loading model ${index + 1}: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
        }, (error) => {
            console.error(`Error loading model ${index + 1}:`, error);
        });
    });
}

// Maple tree models
const loader2 = new GLTFLoader().setPath('model2/');
loadModels(modelData, 'model2/', loader2);

// 2nd Gach models
const loader3 = new GLTFLoader().setPath('model3/');
loadModels(modelData1, 'model3/', loader3);

// Additional models
const loader4 = new GLTFLoader().setPath('model4/');
loadModels(modelData4, 'model4/', loader4);

// Loader for model5
const loader5 = new GLTFLoader().setPath('model5/');
loader5.load('scene.gltf', (gltf) => {
    console.log('Model 8 loaded successfully');
    const mesh = gltf.scene;

    mesh.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
        }
    });

    mesh.scale.set(0.0048, 0.008, 0.006);
    mesh.position.set(28.9, 0.8, -5.0);
    mesh.rotation.y = Math.PI / 2;
    scene.add(mesh);

    // Adjust camera focus
    //controls.target.copy(mesh.position);
    //controls.update();
}, (xhr) => {
    console.log(`Loading: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
}, (error) => {
    console.error('Error loading model:', error);
});

// Loader for model8
const loader6 = new GLTFLoader().setPath('model8/');
loader6.load('scene.gltf', (gltf) => {
    console.log('Model 8 loaded successfully');
    const mesh = gltf.scene;

    mesh.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
        }
    });

    mesh.scale.set(2.2, 1.5, 1.5);
    mesh.position.set(-12.5, 1.8, 20.5);
    mesh.rotation.y = -Math.PI;
    scene.add(mesh);

    // Adjust camera focus
    //controls.target.copy(mesh.position);
    //controls.update();
}, (xhr) => {
    console.log(`Loading: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
}, (error) => {
    console.error('Error loading model:', error);
});

/*const model9Data = [
    { position: [0, 35, 0], scale: [2.5, 1.5, 2.5] },
    { position: [5, 35, 2], scale: [2.5, 1.5, 2.5] },
    { position: [5, 35, 6], scale: [3.5, 1.5, 2.5] }
];

const loader9 = new GLTFLoader().setPath('model9/');
model9Data.forEach(({ position, scale }) => {
    loader9.load('scene.gltf', (gltf) => {
        console.log('Model 9 loaded successfully');
        const mesh = gltf.scene;

        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = false;
                child.receiveShadow = false;
            }
        });

        mesh.scale.set(...scale);
        mesh.position.set(...position);
        mesh.rotation.y = -Math.PI;
        scene.add(mesh);
    }, (xhr) => {
        console.log(`Loading: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
    }, (error) => {
        console.error('Error loading model:', error);
    });
});*/
const model9Data = [
    { position: [0, 35, 0], scale: [2.5, 1.5, 2.5] },
    { position: [5, 35, 2], scale: [2.5, 1.5, 2.5] },
    { position: [5, 35, 6], scale: [3.5, 1.5, 2.5] }
];

const loader9 = new GLTFLoader().setPath('model9/');
model9Data.forEach(({ position, scale }) => {
    loader9.load('scene.gltf', (gltf) => {
        console.log('Model 9 loaded successfully');
        const mesh = gltf.scene;

        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = false;
                child.receiveShadow = false;
            }
        });

        mesh.scale.set(...scale);
        mesh.position.set(...position);
        mesh.rotation.y = -Math.PI;
        scene.add(mesh);

        // Cloud movement animation
        let cloudPositionX = position[0];

        const animateCloud = () => {
            cloudPositionX += 0.3; // Speed of movement

            // Looping back from x = 30 to x = -30
            if (cloudPositionX > 30) {
                cloudPositionX = -30;
            }

            mesh.position.x = cloudPositionX;

            // Request the next frame
            requestAnimationFrame(animateCloud);
        };

        // Start the animation loop
        animateCloud();
    }, (xhr) => {
        console.log(`Loading: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
    }, (error) => {
        console.error('Error loading model:', error);
    });
});





// Animate function (Light moving around the building)
let lightAngle = 10;
const lightRadius = 25; // Radius around the building

function animate() {
    requestAnimationFrame(animate);

    // Ensure the model is loaded before accessing its position
    if (buildingModel) {
        const centerX = buildingModel.position.x;
        const centerZ = buildingModel.position.z;
        const centerY = buildingModel.position.y + 10; // Slightly above the building

        // Move light in a circular orbit around the building
        lightAngle += 0.02; // Speed of rotation
        const x = centerX + lightRadius * Math.cos(lightAngle);
        const z = centerZ + lightRadius * Math.sin(lightAngle);
        const y = centerY; // Keep light slightly above the building

        directionalLight.position.set(x, y, z);
        directionalLight.target.position.copy(buildingModel.position);
    }

    controls.update();
    renderer.render(scene, camera);
}

const rotationSpeed = 0.08; // Speed of rotation around Y-axis
const zoomSpeed = 2; // Speed of zooming along Z-axis
const minZoom = 10; // Minimum zoom distance
const maxZoom = 100; // Maximum zoom distance

// Define a fixed target point (center of the plane)
const target = new THREE.Vector3(0, 0, 0);
let angle = Math.PI / 2; // Start with the camera facing forward (around Y-axis)
let distance = 50; // Initial distance from the target
let pitch = Math.PI / 6; // Start with the camera looking slightly downward (around X-axis)

// Function to update camera position
function updateCameraPosition() {
    // Calculate the X and Z positions based on angle and distance
    camera.position.x = target.x + distance * Math.cos(angle) * Math.cos(pitch);
    camera.position.z = target.z + distance * Math.sin(angle) * Math.cos(pitch);

    // Ensure the Y position is always above the plane (ground level)
    const minHeight = 10; // Minimum height above the ground
    camera.position.y = Math.max(target.y + distance * Math.sin(pitch), minHeight); // Keep camera above the plane

    camera.lookAt(target); // Always look at the center of the plane
}

// Handle keyboard input for movement
document.addEventListener('keydown', (event) => {
    if (event.key === 'w' ) {
        // Move camera angle up (tilt up)
        pitch = Math.min(Math.PI / 2, pitch + rotationSpeed); // Limit pitch to avoid flipping over
    }
    if (event.key === 's' ) {
        // Move camera angle down (tilt down)
        pitch = Math.max(-Math.PI / 2, pitch - rotationSpeed); // Limit pitch to avoid flipping over
    }
    if (event.key === 'a' || event.key === 'ArrowLeft') {
        // Rotate camera left around Y-axis
        angle += rotationSpeed;
    }
    if (event.key === 'd' || event.key === 'ArrowRight') {
        // Rotate camera right around Y-axis
        angle -= rotationSpeed;
    }

    updateCameraPosition(); // Apply the updated camera position
});

// Handle zoom with Arrow Up/Down keys
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        // Zoom in (move closer along Z-axis)
        distance = Math.max(minZoom, distance - zoomSpeed);
    }
    if (event.key === 'ArrowDown') {
        // Zoom out (move away along Z-axis)
        distance = Math.min(maxZoom, distance + zoomSpeed);
    }
    updateCameraPosition(); // Apply the updated camera position
});
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

// Initialize camera position
updateCameraPosition();

// Initial call to animate
animate();

// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Renderer optimizations
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
