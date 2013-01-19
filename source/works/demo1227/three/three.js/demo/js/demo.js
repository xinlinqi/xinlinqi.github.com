if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, renderer;
var projector, plane, cube;
var mouse2D, mouse3D, ray,
rollOveredFace, isShiftDown = false,
theta = 45, isCtrlDown = false;

var rollOverMesh, rollOverMaterial, voxelPosition = new THREE.Vector3(), tmpVec = new THREE.Vector3();
var cubeGeo, cubeMaterials = [], currentIndex = 0;
var i, intersector, furnitures=[];

var gui, voxelConfig = {
	orthographicProjection: false,
	textureChoice:"",
	texture_1:function(){
		currentIndex = 0;
	},
	texture_2:function(){
		currentIndex = 1;
	},
	texture_3:function(){
		currentIndex = 2;
	},
	texture_4:function(){
		currentIndex = 3;
	},
	texture_5:function(){
		currentIndex = 4;
	}
};

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.CombinedCamera( window.innerWidth, window.innerHeight, 45, 1, 10000, -2000, 10000 );
	camera.position.y = 800;

	scene = new THREE.Scene();

	// roll-over helpers

	rollOverGeo = new THREE.CubeGeometry( 50, 50, 50 );
	rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
	rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
	scene.add( rollOverMesh );

	// cubes

	cubeGeo = new THREE.CubeGeometry( 50, 50, 50 );
	initTextures();
	// picking

	projector = new THREE.Projector();

	// grid

	plane = new THREE.Mesh( new THREE.PlaneGeometry( 1000, 1000, 20, 20 ), new THREE.MeshBasicMaterial( { color: 0x555555, wireframe: true } ) );
	plane.rotation.x = - Math.PI / 2;
	scene.add( plane );

	mouse2D = new THREE.Vector3( 0, 10000, 0.5 );

	// Lights
	initLights();
	
	

	renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '50px';
	stats.domElement.style.left = window.innerWidth / 2 - 50 + 'px';
	container.appendChild( stats.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'keyup', onDocumentKeyUp, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );

	// add GUI
	initDatGUI();
	addImgHandler("img_0", 0);
	addImgHandler("img_1", 1);
	addImgHandler("img_2", 2);
	addImgHandler("img_3", 3);
	addFurnitureHandler("furniture_1", 'models/chair.dae');	

}

function onWindowResize() {

	camera.setSize( window.innerWidth, window.innerHeight );
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function getRealIntersector( intersects ) {

	for( i = 0; i < intersects.length; i++ ) {

		intersector = intersects[ i ];

		if ( intersector.object != rollOverMesh ) {

			return intersector;

		}

	}

	return null;

}

function setVoxelPosition( intersector ) {

	tmpVec.copy( intersector.face.normal );

	voxelPosition.add( intersector.point, intersector.object.matrixRotationWorld.multiplyVector3( tmpVec ) );

	voxelPosition.x = Math.floor( voxelPosition.x / 50 ) * 50 + 25;
	voxelPosition.y = Math.floor( voxelPosition.y / 50 ) * 50 + 25;
	voxelPosition.z = Math.floor( voxelPosition.z / 50 ) * 50 + 25;

}

function onDocumentMouseMove( event ) {

	event.preventDefault();

	mouse2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onDocumentMouseDown( event ) {

	event.preventDefault();

	var intersects = ray.intersectObjects( scene.children );

	if ( intersects.length > 0 ) {

		intersector = getRealIntersector( intersects );

		// delete cube

		if ( isCtrlDown ) {

			if ( intersector.object != plane ) {

				scene.remove( intersector.object );

			}

		// create cube

		} else {
			intersector = getRealIntersector( intersects );
			setVoxelPosition( intersector );
			var cubeMaterial = cubeMaterials[currentIndex];
			var voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
			voxel.position.copy( voxelPosition );
			voxel.matrixAutoUpdate = false;
			voxel.updateMatrix();
			scene.add( voxel );
			furnitures.push(voxel);
		}

	}
}

function onDocumentKeyDown( event ) {

	switch( event.keyCode ) {

		case 16: isShiftDown = true; break;
		case 17: isCtrlDown = true; break;

	}

}

function onDocumentKeyUp( event ) {

	switch( event.keyCode ) {

		case 16: isShiftDown = false; break;
		case 17: isCtrlDown = false; break;

	}
}

function initLights(){
	var ambientLight = new THREE.AmbientLight( 0x606060 );
	ambientLight = new THREE.AmbientLight( 0xFFFFFF );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
	scene.add( directionalLight );
}

function initDatGUI(){
	gui = new dat.GUI();
	gui.add( voxelConfig, 'orthographicProjection' ).onChange( function(){

		if ( voxelConfig.orthographicProjection ) {

			camera.toOrthographic();
			// camera.position.x = 1000;
   			// camera.position.y = 707.106;
    		// camera.position.z = 1000;
			theta = 90;

		} else {

			camera.toPerspective();
			camera.position.y = 800;

		}

	} );
	gui.add(voxelConfig, 'texture_1');
	gui.add(voxelConfig, 'texture_2');
	gui.add(voxelConfig, 'texture_3');
	gui.add(voxelConfig, 'texture_4');
	gui.add(voxelConfig, 'texture_5');
	// gui.close();
}

function initTextures(){
	addMaterial( "textures/default.png");
	addMaterial( "textures/water.png");
	addMaterial( "textures/detail_1.jpg");
	addMaterial( "textures/grass.jpg");
	addMaterial( "textures/grass_2.jpg");
}

function addMaterial(texttureImg){
	var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff80, ambient: 0x00ff80, shading: THREE.FlatShading, map: THREE.ImageUtils.loadTexture( texttureImg ) } );
	// cubeMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff80, ambient: 0x00ff80, shading: THREE.FlatShading, map: THREE.ImageUtils.loadTexture( "textures/water.png" ) } );
	cubeMaterial.color.setHSV( 0.1, 0.7, 1.0 );
	cubeMaterial.ambient = cubeMaterial.color;
	cubeMaterials.push(cubeMaterial);	
}

function addImgHandler( id, index ) {
	var el = document.getElementById( id );
	
	el.addEventListener( 'click', function () {
		// for ( var i = 0; i < materials.length; i ++ ) {
			// materials[ i ].map = currentMaps[ index ];
		// }
		currentIndex = index;
	} );

}

function addFurnitureHandler(id, modelName){
	var el = document.getElementById( id );
	el.addEventListener( 'click', function () {
		new THREE.ColladaLoader().load(modelName, function(collada) {
		        var model = collada.scene;
		        skin = collada.skins[0];
		        model.scale.set(4, 4, 4);
		        model.rotation.x = -Math.PI/2;
		        model.castShadow = model.receiveShadow = true;
		        scene.add(model);
		        furnitures.push(model);
	      });
		
	});
}

function save() {

	window.open( renderer.domElement.toDataURL('image/png'), 'mywindow' );

}

//

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

function render() {

	if ( isShiftDown ) {

		theta += mouse2D.x * 3;

	}

	ray = projector.pickingRay( mouse2D.clone(), camera );

	var intersects = ray.intersectObjects( scene.children );

	if ( intersects.length > 0 ) {

		intersector = getRealIntersector( intersects );
		if ( intersector ) {

			setVoxelPosition( intersector );
			rollOverMesh.position = voxelPosition;

		}

	}

	camera.position.x = 1400 * Math.sin( theta * Math.PI / 360 );
	camera.position.z = 1400 * Math.cos( theta * Math.PI / 360 );

	camera.lookAt( scene.position );

	renderer.render( scene, camera );

}
