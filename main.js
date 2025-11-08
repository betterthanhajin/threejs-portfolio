import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CameraHelper } from 'three';

// 1. Scene 생성 (무대)
const scene = new THREE.Scene();

// 2. Camera 생성 (카메라)
const camera = new THREE.PerspectiveCamera(
  75,                                    // FOV (시야각)
  window.innerWidth / window.innerHeight, // 화면 비율
  0.1,                                   // near (가까운 렌더링 경계)
  1000                                   // far (먼 렌더링 경계)
);
camera.position.z = 5;


const CameraHelp = new CameraHelper(camera);


// 빛 생성
const ambitionLight = new THREE.AmbientLight("white");
const directionLight = new THREE.DirectionalLight("white", 0.4);

scene.add(ambitionLight, directionLight);

// 3. Renderer 생성 (렌더러)
const renderer = new THREE.WebGLRenderer({ 
  antialias: true  // 안티앨리어싱
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // 레티나 디스플레이 대응
document.body.appendChild(renderer.domElement);

const cameraControl = new OrbitControls(camera, renderer.domElement);


// 4. Geometry + Material = Mesh (실제 오브젝트)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 'pink' });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 5. Animation Loop (애니메이션 루프)
function animate() {
  requestAnimationFrame(animate);
  
  // 큐브 회전
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}
animate();

// 6. 반응형 처리
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});