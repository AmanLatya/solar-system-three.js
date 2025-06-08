// --------------IMPORT DEPENDENCIES--------------
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as lil from 'lil-gui';

// --------------SCENE--------------
const scene = new THREE.Scene();
scene.background = new THREE.Color("black");

// --------------CAMERA--------------
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 50);

// --------------RENDERER--------------
const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// --------------CONTROLS--------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.dampingFactor = 0.05;
controls.zoomSpeed = 5;

// --------------LIGHTING--------------
scene.add(new THREE.AmbientLight("white", 0.04));
scene.add(new THREE.PointLight("white", 30, 0, 1));

// --------------TEXTURES--------------
const loader = new THREE.TextureLoader();
const textures = {
    sun: loader.load('./Textures/sun.jpg'),
    mercury: loader.load('./Textures/mercury.jpg'),
    venus: loader.load('./Textures/venus.jpg'),
    earth: loader.load('./Textures/earth.jpg'),
    mars: loader.load('./Textures/mars.jpg'),
    jupiter: loader.load('./Textures/jupiter.jpg'),
    saturn: loader.load('./Textures/saturn.jpg'),
    uranus: loader.load('./Textures/uranus.jpg'),
    neptune: loader.load('./Textures/neptune.jpg'),
    saturnRing: loader.load('./Textures/saturn_ring.jpg')
};

// --------------SUN--------------
const sunRadius = 4.25;
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(sunRadius, 64, 64),
    new THREE.MeshBasicMaterial({
        map: textures.sun,
        emissive: new THREE.Color("yellow"),
        emissiveIntensity: 1
    })
);
scene.add(sun);

// --------------SUN LABEL--------------
const sunCanvas = document.createElement('canvas');
sunCanvas.width = 256;
sunCanvas.height = 128;
const sunContext = sunCanvas.getContext('2d');
sunContext.font = 'Bold 60px Arial';
sunContext.fillStyle = 'white';
sunContext.textAlign = 'center';
sunContext.fillText("Sun", sunCanvas.width / 2, 80);
const sunTexture = new THREE.CanvasTexture(sunCanvas);
const sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTexture }));
sunSprite.scale.set(10, 5, 1);
sunSprite.position.set(0, sunRadius + 1.5, 0);
sun.add(sunSprite);

// --------------PLANETS DATA--------------
const planetsData = [
    { name: "Mercury", color: 0xb1b1b1, radius: 0.383, distance: 10, orbitSpeed: 0.0000172, rotSpeed: 0.0004, texture: textures.mercury },
    { name: "Venus", color: 0xf5deb3, radius: 0.949, distance: 15, orbitSpeed: 0.0000115, rotSpeed: -0.0002, texture: textures.venus },
    { name: "Earth", color: 0x1e90ff, radius: 1.0, distance: 22, orbitSpeed: 0.00001, rotSpeed: 0.001, texture: textures.earth },
    { name: "Mars", color: 0xff4500, radius: 0.532, distance: 30, orbitSpeed: 0.000008, rotSpeed: 0.00097, texture: textures.mars },
    { name: "Jupiter", color: 0xd2b48c, radius: 2.21, distance: 40, orbitSpeed: 0.0000043, rotSpeed: 0.0024, texture: textures.jupiter },
    { name: "Saturn", color: 0xf4a460, radius: 1.45, distance: 50, orbitSpeed: 0.0000032, rotSpeed: 0.0023, texture: textures.saturn },
    { name: "Uranus", color: 0xadd8e6, radius: 2.0, distance: 60, orbitSpeed: 0.0000023, rotSpeed: 0.0014, texture: textures.uranus },
    { name: "Neptune", color: 0x4169e1, radius: 0.88, distance: 70, orbitSpeed: 0.0000015, rotSpeed: 0.0015, texture: textures.neptune }
];

const planets = [];

// --------------CREATE PLANETS AND PLACE THEM IN THE SCENE--------------
planetsData.forEach(data => {
    const group = new THREE.Group();

    const planet = new THREE.Mesh(
        new THREE.SphereGeometry(data.radius, 32, 32),
        new THREE.MeshStandardMaterial({ map: data.texture })
    );
    group.add(planet);

    // --------------LABEL--------------
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 256;
    labelCanvas.height = 64;
    const labelCtx = labelCanvas.getContext('2d');
    labelCtx.font = 'Bold 50px Arial';
    labelCtx.fillStyle = 'white';
    labelCtx.textAlign = 'center';
    labelCtx.fillText(data.name, 128, 50);
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTexture }));
    label.scale.set(6, 3, 1);
    label.position.set(0, data.radius + 1.2, 0);
    label.userData = { type: 'label' };
    group.add(label);

    // --------------SATURN RING--------------
    if (data.name === "Saturn") {
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(data.radius * 1.5, data.radius * 2.2, 64),
            new THREE.MeshBasicMaterial({ map: textures.saturn, side: THREE.DoubleSide, transparent: true })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.01;
        group.add(ring);
    }
    // -------------- NEPTUNE RING--------------
    if (data.name === "Neptune") {
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(data.radius * 1.5, data.radius * 2.2, 64),
            new THREE.MeshBasicMaterial({ map: textures.neptune, side: THREE.DoubleSide, transparent: true, opacity: 0.079 })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.01;
        group.add(ring);
    }
    // -------------- URANUS RING--------------
    if (data.name === "Uranus") {
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(data.radius * 1.5, data.radius * 2.2, 64),
            new THREE.MeshBasicMaterial({ map: textures.uranus, side: THREE.DoubleSide, transparent: true, opacity: 0.079 })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.01;
        group.add(ring);
    }

    // --------------ORBIT--------------
    const orbit = new THREE.RingGeometry(data.distance - 0.05, data.distance + 0.05, 64);
    const orbitMat = new THREE.MeshBasicMaterial({ color: data.color, side: THREE.DoubleSide });
    const orbitMesh = new THREE.Mesh(orbit, orbitMat);
    orbitMesh.rotation.x = Math.PI / 2;
    scene.add(orbitMesh);

    // --------------GOUPING THE PLANET , ORBIT AND ITS DATA--------------
    group.userData = {
        name: data.name,
        angle: Math.random() * Math.PI * 2,
        distance: data.distance,
        speed: data.orbitSpeed,
        rotSpeed: data.rotSpeed,
        planet,
        orbitMesh,
        color: data.color
    };

    scene.add(group);
    // --------------ADDING THE PLANET TO THE PLANETS ARRAY--------------
    planets.push(group);
});

// --------------INTERACTION--------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let currentTarget = new THREE.Vector3(0, 0, 0); // Track focus

// --------------MOUSEMOVE EVENT FOR THE CAMERA--------------
window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// --------------CLICK EVENT--------------
window.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera);

    const planetIntersects = raycaster.intersectObjects(planets.map(p => p.userData.planet));
    if (planetIntersects.length > 0) {
        const targetPlanet = planets.find(p => p.userData.planet === planetIntersects[0].object);
        if (targetPlanet) {
            currentTarget.copy(targetPlanet.position);
            camera.position.set(currentTarget.x + 10, currentTarget.y + 5, currentTarget.z + 10);
            controls.target.copy(currentTarget);
            controls.update();
            return;
        }
    }

    const sunIntersects = raycaster.intersectObject(sun, true);
    if (sunIntersects.length > 0) {
        currentTarget.copy(sun.position);
        camera.position.set(currentTarget.x + 10, currentTarget.y + 5, currentTarget.z + 10);
        controls.target.copy(currentTarget);
        controls.update();
    }
});

// --------------TIME CONTROLS--------------
const rateDisplay = document.createElement('div');
rateDisplay.innerHTML = `
  <div style="position: absolute; bottom: 50px; width: 100%; text-align: center; color: white; font-family: Arial; font-size: 24px;">
    <span id="date">REAL RATE</span><br>
    <button id="prev">&#9664;</button>
    <button id="pause">Pause</button>
    <button id="next">&#9654;</button>
    <span id="clock"></span><br>
    <span id="speed"></span>
  </div>`;
document.body.appendChild(rateDisplay);

let simulationSpeed = 1;
let paused = false;

const dateElement = document.getElementById('date');
const clockElement = document.getElementById('clock');
const speedElement = document.getElementById('speed');
const pauseButton = document.getElementById('pause');
const startTime = new Date();

// === Time Display Update Loop ===
setInterval(() => {
    if (!paused) {
        const now = new Date(startTime.getTime() + performance.now() * simulationSpeed);
        dateElement.textContent = now.toDateString();
        clockElement.textContent = `${now.toLocaleTimeString()}`;
        speedElement.textContent = `Speed: ${simulationSpeed.toFixed(3)}x`;
    }
}, 100);

// === Pause Button ===
pauseButton.onclick = () => {
    paused = !paused;
    pauseButton.textContent = paused ? 'Play' : 'Pause';
};

// === Next Button (Speed Up Forward) ===
document.getElementById('next').onclick = () => {
    if (simulationSpeed === 0) {
        simulationSpeed = 0.5;
    }
    else if (simulationSpeed === -0.5) {
        simulationSpeed = 0; // Restart from paused
    } else if (simulationSpeed > 0) {
        simulationSpeed *= 2;
    } else {
        simulationSpeed /= 2; // Make it less negative (closer to forward)
    }
};

// === Prev Button (Speed Up Reverse) ===
document.getElementById('prev').onclick = () => {
    if (simulationSpeed === 0) {
        simulationSpeed = -0.5;
    }
    else if (simulationSpeed === 0.5) {
        simulationSpeed = 0; // Start reverse from paused
    } else if (simulationSpeed < 0) {
        simulationSpeed *= 2;
    } else {
        simulationSpeed /= 2; // Make it less positive (closer to reverse)
    }
};



// --------------STARS--------------
const starsGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);


// --------------CREATE GUI control panel--------------

// --------------Add controls for each planet--------------
const gui = new lil.GUI();

planets.forEach((planetGroup) => {
    const folder = gui.addFolder(planetGroup.userData.name);

    folder.add(planetGroup.userData, 'speed', 0.00001, 1)
        .name('Orbit Speed')
        .onChange((value) => {
            planetGroup.userData.speed = value;
        });

    folder.add(planetGroup.userData, 'rotSpeed', 0.00001, 0.5)
        .name('Rotation Speed')
        .onChange((value) => {
            planetGroup.userData.rotSpeed = value;
        });

    folder.close();
});




// --------------ANIMATE--------------
function animate() {
    requestAnimationFrame(animate);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets.map(p => p.userData.planet));

    planets.forEach(group => {
        if (!paused) group.userData.angle += group.userData.speed * simulationSpeed;

        const angle = group.userData.angle;
        const distance = group.userData.distance;
        group.position.set(Math.cos(angle) * distance, 0, Math.sin(angle) * distance);

        group.userData.planet.rotation.y += group.userData.rotSpeed * simulationSpeed;


        group.userData.orbitMesh.material.color.set(
            intersects.some(i => i.object === group.userData.planet)
                ? group.userData.color
                : 0x888888
        );
    });

    const sunDist = camera.position.distanceTo(sun.position);
    sunSprite.scale.set(10 * sunDist / 50, 5 * sunDist / 50, 1);
    sun.rotation.y += 0.0001 * simulationSpeed;

    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
