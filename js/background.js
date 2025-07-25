let parameters = {
    speed: 0.044,
    density: 0.5,
    displacement: 0.66
  };
  
  let world;
  class World {
    constructor(width, height) {
      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(width, height);
      this.container = document.querySelector(".world");
      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  
      this.container.appendChild(this.renderer.domElement);
      this.timer = 0;
      this.mousePos = { x: 0, y: 0 };
      this.targetMousePos = { x: 0, y: 0 };
      this.createPlane();
      this.render();
    }
    createPlane() {
      this.material = new THREE.RawShaderMaterial({
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent,
        uniforms: {
          uTime: { type: 'f', value: 0 },
          uDensity: { type: 'f', value: parameters.density },
          uDisplacement: { type: 'f', value: parameters.displacement },
          uMousePosition: { type: 'v2', value: new THREE.Vector2(0.5, 0.5) },
          uColor1: { value: new THREE.Color('#eb2627') }, // red
          uColor2: { value: new THREE.Color('#2a232c') }, // dark
          uColor3: { value: new THREE.Color('#f1e5e6') }  // light
        }
      });
      this.planeGeometry = new THREE.PlaneBufferGeometry(2, 2);
      this.plane = new THREE.Mesh(this.planeGeometry, this.material);
      this.scene.add(this.plane);
    }
    render() {
      this.timer += parameters.speed;
      this.plane.material.uniforms.uTime.value = this.timer;
      this.mousePos.x += (this.targetMousePos.x - this.mousePos.x) * 0.1;
      this.mousePos.y += (this.targetMousePos.y - this.mousePos.y) * 0.1;
      if (this.plane) {
        this.plane.material.uniforms.uMousePosition.value = new THREE.Vector2(
          this.mousePos.x,
          this.mousePos.y
        );
      }
      this.renderer.render(this.scene, this.camera);
    }
    loop() {
      this.render();
      requestAnimationFrame(this.loop.bind(this));
    }
    updateSize(w, h) {
      this.renderer.setSize(w, h);
    }
    mouseMove(mousePos) {
      this.targetMousePos.x = mousePos.px;
      this.targetMousePos.y = mousePos.py;
    }
  }
  
  function initBackground() {
    world = new World(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', () => world.updateSize(window.innerWidth, window.innerHeight), false);
    document.addEventListener('mousemove', function(e) {
      const mousePos = {
        x: e.clientX,
        y: e.clientY,
        px: e.clientX / window.innerWidth,
        py: 1.0 - e.clientY / window.innerHeight
      };
      world.mouseMove(mousePos);
    }, false);
    world.loop();
  }
  
  document.addEventListener('DOMContentLoaded', initBackground);
  
  function resizeWorld() {
  const height = Math.max(document.body.scrollHeight, window.innerHeight);
  const world = document.querySelector('.world');
  if (world) world.style.height = height + 'px';

  // If you use canvas:
  const canvas = world.querySelector('canvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = height;
  }

  // Or if you use three.js:
  if (window.renderer) {
    window.renderer.setSize(window.innerWidth, height);
  }
}
window.addEventListener('resize', resizeWorld);
window.addEventListener('DOMContentLoaded', resizeWorld);
window.addEventListener('load', resizeWorld);
