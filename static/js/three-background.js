// Three.js Background Animation
let scene, camera, renderer, particles;

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('bgCanvas'),
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const sizes = [];
    const colors = [];

    // Color palette
    const palette = [
        new THREE.Color('#ffd7e7'),
        new THREE.Color('#ffe2e2'),
        new THREE.Color('#f6e5f5'),
        new THREE.Color('#e5e5f7')
    ];

    for (let i = 0; i < 1500; i++) {
        vertices.push(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );

        sizes.push(Math.random() * 2);

        const color = palette[Math.floor(Math.random() * palette.length)];
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 5;
}

function animateThree() {
    requestAnimationFrame(animateThree);

    particles.rotation.x += 0.0003;
    particles.rotation.y += 0.0005;

    // Subtle wave effect
    particles.geometry.attributes.position.array.forEach((value, index) => {
        if (index % 3 === 1) { // Only affect y-coordinates
            particles.geometry.attributes.position.array[index] += Math.sin(Date.now() * 0.001 + index) * 0.001;
        }
    });
    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize Three.js scene
window.addEventListener('load', () => {
    initThree();
    animateThree();
    window.addEventListener('resize', onWindowResize);
});