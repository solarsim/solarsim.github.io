const WIDTH = window.innerWidth, 
	  HEIGHT = window.innerHeight;

const DEFAULT_CAMERA_POS = new THREE.Vector3(0, 300, 800);

const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

const VIEW_ANGLE = 45,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1,
	  FAR = 1000000;

const TWEEN_DURATION = 3000;

var sunMesh, sunLight;
var mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto;
var planets;

var segments = 16,
	rings = 16;

var renderer, camera, scene;
var cameraTarget = new THREE.Vector3();
var stats, controls;

var backgroundTexture, backgroundMesh;
var backgroundScene, backgroundCamera;

var update = true;
var tweening = false;


$(document).ready(function() {

	$('.planetbutton').click(function() {
		handleClick($(this).attr('id'));
	});

	$('#rewind').click(function() {
		PlanetInfo.setSunMass( PlanetInfo.getSunMass() / 10 );
		PlanetInfo.setRotationSpeed( PlanetInfo.getRotationSpeed() / 2);
	});

	$('#forward').click(function() {
		PlanetInfo.setSunMass( PlanetInfo.getSunMass() * 10 );
		PlanetInfo.setRotationSpeed( PlanetInfo.getRotationSpeed() * 2);
	});

	$('#pause').click(function() {
		$(this).toggleClass('fa-pause');
		$(this).toggleClass('fa-play');

		update = !update;
	});
});

/*
	Initializes scene, camera, and all
	meshes.
*/
init();
initBackground();
createPlanetMeshes();
createRingMeshes();
createSunMesh();

/*
	Determines which planet button has been
	clicked and then updates the info box
	accordingly.
*/
function handleClick( planetName ) {
	var p;
	for(var i=0; i<planets.length; i++) {
		p = planets[i];
		if(p.name.toLowerCase() === planetName.toLowerCase()) {

			if(target == null || !(target.name === p.name)) {

				target = p;

	    		updateInfoBox(p);
	    		
	    		var viewpoint = p.getViewpoint();

	    		tweenTo(viewpoint, TWEEN_DURATION, p.parent.position);
		    }

		}
	}
}

/*
	Initializes scene, camera, and all Planets.
*/
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

	var size = getViewportSize();
	renderer.setSize( size.width, size.height );
	document.body.appendChild( renderer.domElement );

	$("#infocontainer").hide();

}

/*
	Initalizes the background sphere and mesh.
*/
function initBackground() {
	backgroundTexture = THREE.ImageUtils.loadTexture( 'img/bg.jpg' );
	backgroundTexture.minFilter = THREE.LinearFilter;

	backgroundMesh = new THREE.Mesh(
		new THREE.SphereGeometry(PLUTO_APHELION * DISTANCE_FACTOR + 100, 32, 32),
		new THREE.MeshBasicMaterial( { map: backgroundTexture } )
	);

	backgroundMesh.scale.x = -1;

	scene.add(backgroundMesh);
}

/*
	Creates all sphere meshes for each Planet
	and adds all meshes to scene in correct
	locations.
*/
function createPlanetMeshes() {

	var texture, material, p;
	for(var i=0; i<planets.length; i++) {
		texture = THREE.ImageUtils.loadTexture('img/'+planets[i].name.toLowerCase()+".jpg", {}, function() {
			renderer.render(scene, camera);
		});
		texture.needsUpdate = true;
		texture.minFilter = THREE.LinearFilter;
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
		planets[i].parent.add(planets[i].mesh);	// done to avoid problems with texture mapping and rotation
		
		

		scene.add(planets[i].parent);
	}
}

/*
	Creates all meshes for rings around Saturn and Uranus.
*/
function createRingMeshes() {

	var sTexture = THREE.ImageUtils.loadTexture('img/saturnrings.png', {}, function() {
			renderer.render(scene, camera);
	});

	var uTexture = THREE.ImageUtils.loadTexture('img/uranusrings.jpg', {}, function() {
			renderer.render(scene, camera);
	});

	sTexture.minFilter = THREE.LinearFilter;
	uTexture.minFilter = THREE.LinearFilter;

	saturn.ringMesh = Rings.getMesh(sTexture, SATURN_RINGS_INNER, SATURN_RINGS_OUTER, SATURN_TILT);
	uranus.ringMesh = Rings.getMesh(uTexture, URANUS_RINGS_INNER, URANUS_RINGS_OUTER, URANUS_TILT);

	scene.add(saturn.ringMesh);
	scene.add(uranus.ringMesh);

}

/*
	Creates a mesh for the Sun and initializes 
	the main light source as well as ambient
	background light.
*/
function createSunMesh() {

	var texture, material;

	texture = THREE.ImageUtils.loadTexture('img/sun.jpg', {}, function() {
		renderer.render(scene, camera);
	});
	texture.minFilter = THREE.LinearFilter;

	material = new THREE.MeshBasicMaterial( { map: texture });

	sunMesh = new THREE.Mesh( new THREE.SphereGeometry(
									SUN_RADIUS,
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

/*
	Updates all planets, orbiting
	them around the sun.
*/
function updatePlanets( toMove ) {
	for(var i=0; i<planets.length; i++) {
		planets[i].update( toMove );
	}
}


/*
	Casts a Ray and checks for intersections
	with meshes on mouse click. Used for determing
	if user has clicked on a planet.
*/
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

		$("#infocontainer").hide(500);

		tweenTo(DEFAULT_CAMERA_POS, TWEEN_DURATION, DEFAULT_TARGET);
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

	    		tweenTo(viewpoint, TWEEN_DURATION, p.parent.position);
	    	}
	    }
	    
	}
}

/*
	Moves camera smoothly from current location to 
	destination. Called when clicking on or away from
	a Planet.
*/
function tweenTo( destination, duration, lookAt) {
	camera.fov = VIEW_ANGLE;

	tweening = true;

	TWEEN.removeAll(); //remove all running tweens (if called before tweens complete)


	var pos = camera.position;
	var source = { x: pos.x, y: pos.y, z: pos.z };
	var sourceTarget = { x: cameraTarget.x, y: cameraTarget.y, z: cameraTarget.z };


	new TWEEN.Tween( source )
        .to( destination, duration )
        .easing( TWEEN.Easing.Quartic.InOut )
        .onUpdate ( function()
            {
                camera.position.copy( source );
            })
        .onComplete( function() {


        	if(!(areEqual(destination, DEFAULT_CAMERA_POS))) {
        		$("#infocontainer").show(500);
        	}
        		
        	tweening = false;
        })
        .start();

    new TWEEN.Tween(sourceTarget)
    	.to( lookAt, duration )
    	.easing(TWEEN.Easing.Quartic.InOut)
    	.onUpdate(function () {
    		cameraTarget.copy(sourceTarget);

		}).start();

	
}

/*
	Updates all text in info box with information
	about the specified Planet.
*/
function updateInfoBox(planet) {
	var name = planet.name;

	var radius = window[name + "_RADIUS_REAL"];
	var mass = window[name+"_MASS"];
	var day = window[name+"_DAY"];
	var year = window[name+"_YEAR"];
	var eccentricity = window[name+"_ECCENTRICITY"];
	var tilt = window[name+"_TILT"];
	var perihelion = window[name+"_PERIHELION"];
	var aphelion = window[name+"_APHELION"];

	$('#planetname').text(capitalize(name.toLowerCase()));
	$('#radius .info').text(radius + " km");
	$('#mass .info').text(mass + " x 10^" + MASS_ORDER + " kg");
	$('#day .info').text(day + " hrs");
	$('#year .info').text(year + " Earth days");
	$('#eccentricity .info').text(eccentricity);
	$('#tilt .info').text(tilt);
	$('#perihelion .info').text(perihelion + " x 10^" + DISTANCE_ORDER + " km");
	$('#aphelion .info').text(aphelion + " x 10^" + DISTANCE_ORDER + " km");
}

/*
	Functions for OrbitControls. Allows user to zoom
	in and out of the scene as well as pan camera on
	click.
*/
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


/*
	Main render loop. Contains calls to updatePlanets
	and checks for user clicks, as well as points
	camera in the direction of the cameraTarget.
*/
function render() {
	requestAnimationFrame( render );

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

	if(camera.position == DEFAULT_CAMERA_POS) {
		$('#infocontainer').hide(500);
	}
	
	camera.lookAt(cameraTarget);
	
	renderer.autoClear = false;
	renderer.clear();
	renderer.render( scene, camera );


	TWEEN.update();


}

/*
	Returns size of current viewport.
*/
function getViewportSize() {
    if(typeof(window.innerWidth) == 'number'){
        my_width = window.innerWidth;
        my_height = window.innerHeight;
    }else if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)){
        my_width = document.documentElement.clientWidth;
        my_height = document.documentElement.clientHeight;
    }else if(document.body && (document.body.clientWidth || document.body.clientHeight)){
        my_width = document.body.clientWidth;
        my_height = document.body.clientHeight;
    }
    return {width: my_width, height: my_height};
}

/*
	Capitalizes the specified string.
*/
function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.substring(1);
}

/*
	Determines if two vectors have equal components.
*/
function areEqual( vector1, vector2 ) {
	return vector1.x === vector2.x && vector1.y === vector2.y && vector1.z === vector2.z;
}

// begins the render loop
render();




