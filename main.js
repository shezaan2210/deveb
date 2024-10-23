import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'


// Initialize a new Lenis instance for smooth scrolling
const lenis = new Lenis({
  duration: 2
});

// Listen for the 'scroll' event and log the event data to the console
lenis.on('scroll', (e) => {
  console.log(e);
});

// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on('scroll', ScrollTrigger.update);

// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
// This ensures Lenis's smooth scroll animation updates on each GSAP tick
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convert time from seconds to milliseconds
});

// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);



gsap.registerPlugin(ScrollTrigger)

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// Create icosahedron geometry
const geometry = new THREE.IcosahedronGeometry(2, 32, 32);

// Create shader material
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
   uniforms : {
    uTime: { value: 0 },
    uNoiseFrequency: { value: 1.5 }, // Adjust this for noise scale
    uNoiseAmplitude: { value: 0.35 }, // Height of the blob deformation
    uColor: { value: new THREE.Color('#FFC1E3') }, // Base pink color
    uHighlightColor: { value: new THREE.Color('#FFF5FB') }, // Highlight color
    uShadowColor: { value: new THREE.Color('#F48FB1') }, // Shadow colornk
}
  // wireframe: true
});

// Create mesh and add to scene
const icosahedron = new THREE.Mesh(geometry, material);
icosahedron.position.y = -2
icosahedron.scale.set(.8, .8, .8)
scene.add(icosahedron);

// Position camera
camera.position.z = 15;

// Gsap 
var tl = gsap.timeline({
  scrollTrigger:{
    trigger: '.landing',
    start: 'top top',
    end: '150% top',
    scrub: true,
    markers: true
  },

})

gsap.to('.landing', {
  scrollTrigger:{
    trigger: '.landing',
    start: 'top top',
    end: '200% top',
    scrub: 2,
    pin: true,
    // markers: true
  },
})

tl.to(icosahedron.position, {
  y: 0,
  ease: 'circ.inOut',
}, 'a')

.to(icosahedron.scale, {
  x: 1,   // Set target scale for the x-axis
  y: 1,   // Set target scale for the y-axis
  z: 1,   // Set target scale for the z-axis
  ease: 'circ.inOut',
}, 'a')


// Create a Three.js clock
const clock = new THREE.Clock();



// Animation loop
function animate() {
  requestAnimationFrame(animate);

 // Get the elapsed time from the clock and pass it to the uTime uniform
 const elapsedTime = clock.getElapsedTime();
 material.uniforms.uTime.value = elapsedTime;

 // Optionally, rotate the icosahedron
 icosahedron.rotation.x += 0.01;
 icosahedron.rotation.y += 0.01;

  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

// Start animation loop
animate();
