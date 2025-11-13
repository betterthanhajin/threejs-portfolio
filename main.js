import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';


export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

	// Scene
	const scene = new THREE.Scene();

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.y = 1.5;
	camera.position.z = 4;
	scene.add(camera);

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	

	// Mesh
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const positionAttribute = sphereGeometry.attributes.position;

  // 1) '구면(기본 형태)' 좌표를 복제해 별도 배열로 보관 (레퍼런스가 아닌 값)
  const sphereBaseArray = Array.from(positionAttribute.array);

  // 랜덤 타겟 좌표 미리 생성
  const randomPositionArray = [];
  for (let i = 0; i < positionAttribute.array.length; i++) {
    randomPositionArray.push((Math.random() - 0.5) * 10);
  }

  const material = new THREE.PointsMaterial({ size: 0.02 });
  const points = new THREE.Points(sphereGeometry, material);
  scene.add(points);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		controls.update();

		renderer.render(scene, camera);
		window.requestAnimationFrame(draw);
	}




  function setShape(e) {
  // 2) 이벤트 가드: 버튼만 처리
  const btn = e.target.closest('button');
  if (!btn) return;

  const type = btn.dataset.type;
  const positionAttribute = points.geometry.attributes.position;

  let targetArray;
  switch (type) {
    case 'random':
      targetArray = randomPositionArray;
      break;
    case 'sphere':
      targetArray = sphereBaseArray; // 복제한 '고정' 배열을 타겟으로 사용
      break;
    default:
      return; // 타입 없으면 무시
  }

  // 현재 position을 스냅샷(값 복사)
  const startArray = Array.from(positionAttribute.array);

  // 길이 일치 가드 (혹시라도 차이 나면 리턴)
  if (targetArray.length !== startArray.length) return;

  gsap.to({ progress: 0 }, {
    progress: 1,
    duration: 2,
    ease: 'sine.inOut',
    onUpdate: function () {
      const p = this.targets()[0].progress;
      const arr = positionAttribute.array; // 성능 위해 로컬 참조
      for (let i = 0; i < arr.length; i++) {
        arr[i] = startArray[i] + (targetArray[i] - startArray[i]) * p;
      }
      positionAttribute.needsUpdate = true;
    }
  });
}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}




	// 버튼
	const btnWrapper = document.createElement('div');
	btnWrapper.classList.add('btns');

	const randomBtn = document.createElement('button');
	randomBtn.dataset.type = 'random';
	randomBtn.style.cssText = 'position: absolute; left: 20px; top: 20px';
	randomBtn.innerHTML = 'Random';
	btnWrapper.append(randomBtn);

	const sphereBtn = document.createElement('button');
	sphereBtn.dataset.type = 'sphere';
	sphereBtn.style.cssText = 'position: absolute; left: 20px; top: 50px';
	sphereBtn.innerHTML = 'Sphere';
	btnWrapper.append(sphereBtn);

	document.body.append(btnWrapper);

	// 이벤트
	btnWrapper.addEventListener('click', setShape);
  

	// 이벤트
	window.addEventListener('resize', setSize);

	draw();
}

example();