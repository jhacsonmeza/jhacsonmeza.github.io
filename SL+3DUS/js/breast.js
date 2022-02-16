import * as THREE from '../../js/three/three.module.js';
import { PLYLoader } from '../../js/three/PLYLoader.js';
import { OrbitControls } from '../../js/three/OrbitControls.js';
import { GUI } from '../../js/three/lil-gui.module.min.js';


const container = document.getElementById( 'breast' );

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild( renderer.domElement );


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 0.1, 1000 );
camera.position.set( 0, 1.5, 3 );


const group = new THREE.Group();
const manager = new THREE.LoadingManager();

const loader1 = new PLYLoader(manager);
let pc1;
loader1.load( 'data/phantom.ply', function ( geometry ) {
    const material = new THREE.PointsMaterial( {size: 0.02, vertexColors: true, transparent: true, opacity: 0.1} );
    pc1 = new THREE.Points( geometry, material );

    pc1.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(90));
    pc1.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(90));
    pc1.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(45+10));
    pc1.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(30));

    pc1.scale.multiplyScalar(0.01);

    group.add( pc1 );
} );

const loader2 = new PLYLoader(manager);
let pc2;
loader2.load( 'data/tumors.ply', function ( geometry ) {
    const material2 = new THREE.PointsMaterial( {size: 0.015, vertexColors: true} );
    pc2 = new THREE.Points( geometry, material2 );

    pc2.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(90));
    pc2.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(90));
    pc2.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(45+10));
    pc2.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(30));

    pc2.scale.multiplyScalar(0.01);

    group.add( pc2 );
} );

scene.add( group );


manager.onLoad = function(){
    const box3 = new THREE.Box3().setFromObject(group);
    box3.getCenter(group.position).multiplyScalar( -1 );
}



// ----------------- OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;



// ----------------- Panels
const panel = new GUI();
container.appendChild( panel.domElement );
panel.domElement.style = 'position:absolute';

panel.add( {'stop animation': false}, 'stop animation' ).onChange(function ( rot ) {
    controls.autoRotate = !rot;
} );

const folder1 = panel.addFolder('External surface');
const folder2 = panel.addFolder('Internal tumors');

folder1.add( {'show phantom': true}, 'show phantom' ).onChange(function ( visibility ) {
    pc1.visible = visibility;
} );
folder1.add( {'opacity': 0.1}, 'opacity', 0.1, 1, 0.1 ).onChange( function ( o ) {
    pc1.material.opacity = o;
} );

folder2.add( {'show tumors': true}, 'show tumors' ).onChange(function ( visibility ) {
    pc2.visible = visibility;
} );

panel.open();
folder1.open();
folder2.open();

const mediaQuery = window.matchMedia('(max-width: 1000px)');
if (mediaQuery.matches) {
    panel.close();
}




// ----------------- End
window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( container.clientWidth, container.clientHeight );

}


function animate() {
    requestAnimationFrame( animate );

    controls.update();
    renderer.render( scene, camera );
}


animate();