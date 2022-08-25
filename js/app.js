import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
import fragmentParticle from "./shaders/fragmentParticles.glsl";
import vertexParticle from "./shaders/vertexParticles.glsl";

export default class sketch {
  constructor(options) {
    this.time = 0;
    this.scene = new THREE.Scene();
    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      10
    );
    this.camera.position.z = 2;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);

    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.play();
    this.setupResize();
    this.addObjects();
    this.addParticles();
    this.render();
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        time: { value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: { value: new THREE.Vector2(1, 1) },
        progress: { value: 0 },
      },
      side: THREE.DoubleSide,
      // wireframe: true,
    });

    this.geometry = new THREE.SphereBufferGeometry(0.4, 162, 162);

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  addParticles() {
    let that = this;
    // this.particleGeometry = new THREE.SphereBufferGeometry(0.1, 162, 162);
    this.particleMaterial = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      fragmentShader: fragmentParticle,
      vertexShader: vertexParticle,
      uniforms: {
        time: { value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: { value: new THREE.Vector2(1, 1) },
      },
      side: THREE.DoubleSide,
      // wireframe: true,
    });

    let N = 8000;
    let positions = new Float32Array(N * 3);
    let redi = 0.7;

    this.particleGeometry = new THREE.BufferGeometry();

    let inc = Math.PI * (3 - Math.sqrt(5));
    let off = 2 / N;
    for (let i = 0; i < N; i++) {
      let y = i * off - 1 + off / 2;
      let r = Math.sqrt(1 - y * y);
      let phi = i * inc;

      positions[3 * i] = redi * Math.cos(phi) * r;
      positions[3 * i + 1] = redi * y;
      positions[3 * i + 2] = redi * Math.sin(phi) * r;
    }

    this.particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    this.points = new THREE.Points(
      this.particleGeometry,
      this.particleMaterial
    );
    this.scene.add(this.points);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;

    this.time += 0.05;
    // this.mesh.rotation.x = this.time / 2000;
    // this.mesh.rotation.y = this.time / 1000;

    this.points.rotation.y = this.time / 100;
    this.material.uniforms.time.value = this.time;
    this.particleMaterial.uniforms.time.value = this.time;
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new sketch({
  dom: document.getElementById("container"),
});

// funnel shape particles

// let N = 1000;
//     let positions = new Float32Array(N * 3);

//     this.particleGeometry = new THREE.BufferGeometry();

//     let inc = Math.PI * (3 - Math.sqrt(5));
//     let off = 2 / N;
//     for (let i = 0; i < N; i++) {
//       let y = i * off - 1 + off / 2;
//       let r = Math.sqrt(1 - y * y) - 2;
//       let phi = i * inc;

//       positions[3 * i] = Math.cos(phi) * r;
//       positions[3 * i + 1] = y;
//       positions[3 * i + 2] = Math.sin(phi) * r;
//     }
