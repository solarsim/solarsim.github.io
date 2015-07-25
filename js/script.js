const WIDTH = window.innerWidth, 
	  HEIGHT = window.innerHeight;

const DEFAULT_CAMERA_POS = new THREE.Vector3(0, 300, 800);

const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

const VIEW_ANGLE = 45,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1,
	  FAR = 10000;

var sunMesh, sunLight;
var mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto;
var planets;

var segments = 16,
	rings = 16;

var container, renderer, camera, scene;
var cameraTarget = new THREE.Vector3();
var stats, controls;

var backgroundTexture, backgroundMesh;
var backgroundScene, backgroundCamera;

var tweening = false;

$(document).ready(function() {

	$('.planetbutton').click(function() {
		handleClick($(this).attr('id'));
	});

});

function handleClick( planetName ) {
	var p;
	for(var i=0; i<planets.length; i++) {
		p = planets[i];
		if(p.name.toLowerCase() === planetName.toLowerCase() ) {

				target = p;

	    		updateInfoBox(p);
	    		
	    		var viewpoint = p.getViewpoint();
	    		//console.log("before: "+viewpoint.x+" "+viewpoint.y+" "+viewpoint.z);
	    		var duration = getDuration(viewpoint);
	    		tweenTo(viewpoint, duration, p.parent.position);

		}
	}
}

init();
initBackground();
createPlanetMeshes();
createRingMeshes();
createSunMesh();


function init() {

	//INIT PLANETS
	mercury = new Planet("mercury");
	venus = new Planet("venus");
	earth = new Planet("earth");
	mars = new Planet("mars");
	jupiter = new Planet("jupiter");
	saturn = new Planet("saturn");
	uranus = new Planet("uranus");
	neptune = new Planet("neptune");
	pluto = new Planet("pluto");



	planets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto];

	//INIT SCENE
	container = $("#container");

	renderer = new THREE.WebGLRenderer();
	camera = new THREE.PerspectiveCamera( 
					VIEW_ANGLE,
					ASPECT,
					NEAR,
					FAR );
	scene = new THREE.Scene();
	scene.add(camera);

	camera.position.copy(DEFAULT_CAMERA_POS);

	cameraTarget.copy(DEFAULT_TARGET);

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.noPan = true;
	controls.noZoom = true;


	renderer.setSize( WIDTH, HEIGHT );
	document.body.appendChild( renderer.domElement );

	$("#container").hide();

}

function initBackground() {
	backgroundTexture = THREE.ImageUtils.loadTexture( 'img/bg.jpg' );

	backgroundMesh = new THREE.Mesh(
		new THREE.SphereGeometry(1000, 32, 32),
		new THREE.MeshBasicMaterial( { map: backgroundTexture } )
	);

	backgroundMesh.scale.x = -1;

	scene.add(backgroundMesh);
}

function createPlanetMeshes() {

	var texture, material, p;
	for(var i=0; i<planets.length; i++) {
		texture = THREE.ImageUtils.loadTexture('img/'+planets[i].name.toLowerCase()+".jpg", {}, function() {
			renderer.render(scene, camera);
		});
		texture.needsUpdate = true;
		material = new THREE.MeshPhongMaterial( { map: texture });

		p = new THREE.Mesh( new THREE.SphereGeometry (
								planets[i].radius,
								segments,
								rings),
								material
							);

		planets[i].mesh = p;
		planets[i].parent = new THREE.Object3D();

		planets[i].parent.rotation.z = (planets[i].tilt) * Math.PI / 180; // rotate parent and add mesh to parent
		planets[i].parent.add(planets[i].mesh);
		
		

		scene.add(planets[i].parent);
	}
}

function createRingMeshes() {

	var sTexture = THREE.ImageUtils.loadTexture('img/saturnrings.png', {}, function() {
			renderer.render(scene, camera);
	});

	var uTexture = THREE.ImageUtils.loadTexture('img/uranusrings.jpg', {}, function() {
			renderer.render(scene, camera);
	});

	saturn.ringMesh = Rings.getMesh(sTexture, SATURN_RINGS_INNER, SATURN_RINGS_OUTER, SATURN_TILT);
	uranus.ringMesh = Rings.getMesh(uTexture, URANUS_RINGS_INNER, URANUS_RINGS_OUTER, URANUS_TILT);

	scene.add(saturn.ringMesh);
	scene.add(uranus.ringMesh);

}

function createSunMesh() {

	var texture, material;

	texture = THREE.ImageUtils.loadTexture('img/sun.jpg', {}, function() {
		renderer.render(scene, camera);
	});
	material = new THREE.MeshBasicMaterial( { map: texture });

	sunMesh = new THREE.Mesh( new THREE.SphereGeometry(
									Planet.SUN_RADIUS,
									segments,
									rings),
									material
							);

	scene.add(sunMesh);


	//SUN LIGHT SOURCE
	sunLight = new THREE.PointLight(0xFFFFFF, 2.2);
	scene.add(sunLight);

	//AMBIENT BACKGROUND LIGHT
	var ambient = new THREE.AmbientLight(0x404040);
	scene.add(ambient);

}

//ROTATE & ORBIT PLANETS
function updatePlanets( toMove ) {
	for(var i=0; i<planets.length; i++) {
		planets[i].update( toMove );
	}
}

function spinPlanets() {
	for(var i=0; i<planets.length; i++) {
		planets[i].spin();
	}
}

function getDuration( destination ) {
	return 1000;
}

//PICK OBJECTS
var target = null;
var ray = new THREE.Raycaster();
var projector = new THREE.Projector();
var directionVector = new THREE.Vector3();
 
var clickInfo = {
  x: 0,
  y: 0,
  userHasClicked: false
};

renderer.domElement.addEventListener('click', function (evt) {
  clickInfo.userHasClicked = true;
  clickInfo.x = evt.clientX;
  clickInfo.y = evt.clientY;
}, false);

var x, y;

function checkClick() {


	if(target != null) {
		target = null;

		$("#container").toggle(500);

		var duration = 3 * getDuration(DEFAULT_CAMERA_POS);
		console.log("DEFAULT_TARGET: "+DEFAULT_TARGET.x+" "+DEFAULT_TARGET.y+" "+DEFAULT_TARGET.z);
		tweenTo(DEFAULT_CAMERA_POS, duration, DEFAULT_TARGET);
		return;
	}
	
	x = ( clickInfo.x / WIDTH ) * 2 - 1;
	y = -( clickInfo.y / HEIGHT ) * 2 + 1;

	directionVector.set(x, y, 1);
	directionVector.unproject(camera);
	directionVector.sub(camera.position);
	directionVector.normalize();

	ray.set(camera.position, directionVector);

	var objects = scene.children;

	var intersects = ray.intersectObjects(objects, true);

	if (intersects.length) {

	    var uuid = intersects[0].object.uuid;


	    for(var i=0; i<planets.length; i++) {
	    	var p = planets[i];

	    	if(p.mesh.uuid === uuid) {
	    		
	    		target = p;

	    		updateInfoBox(p);
	    		
	    		var viewpoint = p.getViewpoint();
	    		//console.log("before: "+viewpoint.x+" "+viewpoint.y+" "+viewpoint.z);
	    		var duration = 3 * getDuration(viewpoint);
	    		tweenTo(viewpoint, duration, p.parent.position);
	    	}
	    }
	    
	}
}

//ZOOM IN ON CLICKED PLANET & TWEEN CAMERA TARGET
function tweenTo( destination, duration, lookAt) {
	camera.fov = VIEW_ANGLE;

	tweening = true;
	console.log("lookAt: "+lookAt.x+" "+lookAt.y+" "+lookAt.z);

	var pos = camera.position;
	var source = { x: pos.x, y: pos.y, z: pos.z };
	var sourceTarget = { x: cameraTarget.x, y: cameraTarget.y, z: cameraTarget.z };
	console.log("camera target before: "+sourceTarget.x+" "+sourceTarget.y+" "+sourceTarget.z);

	new TWEEN.Tween( source )
        .to( destination, duration )
        .delay( 0 )
        .easing( TWEEN.Easing.Quartic.InOut )
        .onUpdate ( function()
            {
                camera.position.copy( source );
            })
        .onComplete( function() {

        	if(destination != DEFAULT_CAMERA_POS) {
        		$("#container").show(500);
        	}
        		
        	tweening = false;
        })
        .start();

    new TWEEN.Tween(sourceTarget)
    	.to(lookAt, duration)
    	.easing(TWEEN.Easing.Quartic.InOut)
    	.onUpdate(function () {
    		cameraTarget.copy(sourceTarget);
    		//console.log("updating");
		})
		.onComplete(function () {
		    console.log("camera target after: "+cameraTarget.x+" "+cameraTarget.y+" "+sourceTarget.z);
		}).start();

	
}

function updateInfoBox(planet) {
	var name = planet.name;

	var radius = window[name + "_RADIUS_REAL"];
	var mass = window[name+"_MASS"];
	var day = window[name+"_DAY"];
	var year = window[name+"_YEAR"];
	var eccentricity = window[name+"_ECCENTRICITY"];
	var tilt = window[name+"_TILT"];
	var perihelion = window[name+"_PERIHELION_REAL"];
	var aphelion = window[name+"_APHELION_REAL"];

	$('#planetname').text(capitalize(name.toLowerCase()));
	$('#radius .info').text(radius + " km");
	$('#mass .info').text(mass + " x 10^" + MASS_FACTOR + " kg");
	$('#day .info').text(day + " hrs");
	$('#year .info').text(year + " days");
	$('#eccentricity .info').text(eccentricity);
	$('#tilt .info').text(tilt);
	$('#perihelion .info').text(perihelion + " x 10^" + DISTANCE_FACTOR + " km");
	$('#aphelion .info').text(aphelion + " x 10^" + DISTANCE_FACTOR + " km");
}


function onMouseWheel(event) {
	if (event.wheelDeltaY) { // WebKit
		camera.fov -= event.wheelDeltaY * 0.05;
	} else if (event.wheelDelta) { // Opera / IE9
		camera.fov -= event.wheelDelta * 0.05;
	} else if (event.detail) { // Firefox
		camera.fov += event.detail * 1.0;
	}

	camera.fov = Math.max(20, Math.min(100, camera.fov));
	camera.updateProjectionMatrix();
}

document.addEventListener('mousewheel', onMouseWheel, false);
document.addEventListener('DOMMouseScroll', onMouseWheel, false);


//RENDER SCENE
function render() {
	requestAnimationFrame( render );

	spinPlanets();
	var toMove = !tweening || target == null; // only stop orbiting planets if 
											  // tweening TO a planet

	updatePlanets( toMove );

	if(!tweening) {

		if(target != null) {
			var viewpoint = target.getViewpoint();
			camera.position.set(viewpoint.x, viewpoint.y, viewpoint.z);
			cameraTarget.copy(target.parent.position);
		}

	}
	
	

	if(clickInfo.userHasClicked) {
		clickInfo.userHasClicked = false;
		checkClick();
	}
	
	camera.lookAt(cameraTarget);
	
	renderer.autoClear = false;
	renderer.clear();
	renderer.render( scene, camera );

	TWEEN.update();
	controls.update();


}

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.substring(1);
}
render();




