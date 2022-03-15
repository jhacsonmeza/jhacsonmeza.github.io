import * as THREE from '../../js/three/three.module.js';
import { PLYLoader } from '../../js/three/PLYLoader.js';
import { OrbitControls } from '../../js/three/OrbitControls.js';
import { GUI } from '../../js/three/lil-gui.module.min.js';


const canvas = document.getElementById( 'c' );
const pha_container = document.getElementById( 'phantom' );
const cyl_container = document.getElementById( 'cylinders' );

const renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
renderer.setClearColor( 0xffffff, 1 );
renderer.setPixelRatio( window.devicePixelRatio );

const manager = new THREE.LoadingManager();



// ----------------------------------------------------------------------------------------------
// --------------------------------------- breast phantom ---------------------------------------
// ----------------------------------------------------------------------------------------------
const pha_scene = new THREE.Scene();
const pha_camera = new THREE.PerspectiveCamera( 35, pha_container.clientWidth / pha_container.clientHeight, 0.1, 1000 );
pha_camera.position.set( 0, 1.5, 3 );

const pha_group = new THREE.Group();

const loader1 = new PLYLoader(manager);
loader1.load( 'data/phantom.ply', function ( geometry ) {
    const material = new THREE.PointsMaterial( {size: 0.01, vertexColors: true, transparent: true, opacity: 0.1} );
    const pc = new THREE.Points( geometry, material );
    pha_scene.userData.ext = pc;

    pc.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(90));
    pc.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(90));
    pc.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(45+10));
    pc.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(30));

    pc.scale.multiplyScalar(0.01);

    pha_group.add( pc );
} );

const loader2 = new PLYLoader(manager);
loader2.load( 'data/tumors.ply', function ( geometry ) {
    const material = new THREE.PointsMaterial( {size: 0.008, vertexColors: true} );
    const pc = new THREE.Points( geometry, material );
    pha_scene.userData.int = pc;

    pc.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(90));
    pc.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(90));
    pc.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(45+10));
    pc.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(30));

    pc.scale.multiplyScalar(0.01);

    pha_group.add( pc );
} );

pha_scene.add( pha_group );


// ----------------- OrbitControls
const pha_controls = new OrbitControls(pha_camera, pha_container);
pha_controls.autoRotate = true;



// ----------------- Phantom Panel
const pha_panel = new GUI();
document.getElementById( 'pantom-cont' ).appendChild( pha_panel.domElement );
pha_panel.domElement.style = 'position:absolute;z-index:0';

pha_panel.add( {'rotate': true}, 'rotate' ).onChange(function ( rot ) {
    pha_controls.autoRotate = rot;
} );

const folder1p = pha_panel.addFolder('External surface');
const folder2p = pha_panel.addFolder('Internal tumors');

folder1p.add( {'show phantom': true}, 'show phantom' ).onChange(function ( visibility ) {
    pha_scene.userData.ext.visible = visibility;
} );
folder1p.add( {'opacity': 0.1}, 'opacity', 0.1, 1, 0.1 ).onChange( function ( o ) {
    pha_scene.userData.ext.material.opacity = o;
} );

folder2p.add( {'show tumors': true}, 'show tumors' ).onChange(function ( visibility ) {
    pha_scene.userData.int.visible = visibility;
} );

pha_panel.open();
folder1p.open();
folder2p.open();




// ---------------------------------------------------------------------------------------------
// ----------------------------------------- cylinders -----------------------------------------
// ---------------------------------------------------------------------------------------------
const cyl_scene = new THREE.Scene();
const cyl_camera = new THREE.PerspectiveCamera( 35, cyl_container.clientWidth / cyl_container.clientHeight, 0.1, 1000 );
cyl_camera.position.set( 0, 1, 2.5 );

const cyl_group = new THREE.Group();

const loader3 = new PLYLoader(manager);
loader3.load( 'data/cylin_ext.ply', function ( geometry ) {
    const material = new THREE.PointsMaterial( {size: 0.01, vertexColors: true, transparent: true, opacity: 0.1} );
    const pc = new THREE.Points( geometry, material );
    cyl_scene.userData.ext = pc;

    pc.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(17));
    pc.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(90));
    pc.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(-30));

    pc.scale.multiplyScalar(0.01);

    cyl_group.add( pc );
} );

const loader4 = new PLYLoader(manager);
loader4.load( 'data/cylin_int.ply', function ( geometry ) {
    const material = new THREE.PointsMaterial( {size: 0.008, vertexColors: true} );
    const pc = new THREE.Points( geometry, material );
    cyl_scene.userData.int = pc;

    pc.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(17));
    pc.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(90));
    pc.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(-30));

    pc.scale.multiplyScalar(0.01);

    cyl_group.add( pc );
} );

cyl_scene.add( cyl_group );


// ----------------- OrbitControls
const cyl_controls = new OrbitControls(cyl_camera, cyl_container);
cyl_controls.autoRotate = true;


// ----------------- Cylinder Panel
const cyl_panel = new GUI();
document.getElementById( 'cylinders-cont' ).appendChild( cyl_panel.domElement );
cyl_panel.domElement.style = 'position:absolute;z-index:0';

cyl_panel.add( {'rotate': true}, 'rotate' ).onChange(function ( rot ) {
    cyl_controls.autoRotate = rot;
} );

const folder1c = cyl_panel.addFolder('External surface');
const folder2c = cyl_panel.addFolder('Internal structure');

folder1c.add( {'show outer cylinder': true}, 'show outer cylinder' ).onChange(function ( visibility ) {
    cyl_scene.userData.ext.visible = visibility;
} );
folder1c.add( {'opacity': 0.1}, 'opacity', 0.1, 1, 0.1 ).onChange( function ( o ) {
    cyl_scene.userData.ext.material.opacity = o;
} );

folder2c.add( {'show inner cylinder': true}, 'show inner cylinder' ).onChange(function ( visibility ) {
    cyl_scene.userData.int.visible = visibility;
} );

cyl_panel.open();
folder1c.open();
folder2c.open();




// -------------------------------- Centering point cloud groups --------------------------------
manager.onLoad = function(){
    // centering both external phantom surface and tumors:
    const box3p = new THREE.Box3().setFromObject(pha_group);
    box3p.getCenter(pha_group.position).multiplyScalar( -1 );

    // centering both outer and inner cylinders:
    const box3c = new THREE.Box3().setFromObject(cyl_group);
    box3c.getCenter(cyl_group.position).multiplyScalar( -1 );
}





// -------------------------------- close panel for width less than 1000px
const mediaQuery = window.matchMedia('(max-width: 1000px)');
if (mediaQuery.matches) {
    pha_panel.close();
    cyl_panel.close();
}




// -------------------------------- End --------------------------------
function updateSize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if ( canvas.width !== width || canvas.height !== height ) {
        renderer.setSize( width, height, false );
    }
}

function sceneRenderer(container, renderer, scene, camera) {
    const rect = container.getBoundingClientRect();

    // check if it's offscreen. If so skip it
    if ( rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
        rect.right < 0 || rect.left > renderer.domElement.clientWidth ) {

       return; // it's off screen
    }

    const bottom = renderer.domElement.clientHeight - rect.bottom;
    renderer.setViewport( rect.left, bottom, rect.width, rect.height );
    renderer.setScissor( rect.left, bottom, rect.width, rect.height );

    renderer.render( scene, camera );
}


function animate() {
    updateSize();
    
    canvas.style.transform = `translateY(${window.scrollY}px)`;

    renderer.setScissorTest(false);
    renderer.clear(true, true);
    renderer.setScissorTest(true);

    pha_controls.update();
    cyl_controls.update();

    // ------------- breast phantom
    sceneRenderer(pha_container, renderer, pha_scene, pha_camera);

    // ------------- cylinders
    sceneRenderer(cyl_container, renderer, cyl_scene, cyl_camera);


    requestAnimationFrame( animate );
}


animate();