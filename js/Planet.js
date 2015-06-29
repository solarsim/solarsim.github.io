const G = 6.67*Math.pow(10, -11);

const SUN_MASS = 6*Math.pow(10, 15);

const SUN_RADIUS = 75,
	  MERCURY_RADIUS = 5,
	  VENUS_RADIUS = 10,
	  EARTH_RADIUS = 10,
	  MARS_RADIUS = 5,
	  JUPITER_RADIUS = 20;

const MERCURY_ECCENTRICITY = 0.21,
	  VENUS_ECCENTRICITY = .0067,
	  EARTH_ECCENTRICITY = 0.0167,
	  MARS_ECCENTRICITY = 0.0934,
	  JUPITER_ECCENTRICITY = 0.0489;

const MERCURY_PERIHELION = 100,
	  VENUS_PERIHELION = 200,
	  EARTH_PERIHELION = 250,
	  MARS_PERIHELION = 300,
	  JUPITER_PERIHELION = 375;

const MERCURY_TILT = 0.03,
	  VENUS_TILT = 177.36,
	  EARTH_TILT = 23.44,
	  MARS_TILT = 25.19,
	  JUPITER_TILT = 3.13;


//PLANET OBJECT
function Planet(name, radius, eccentricity, perihelion, tilt) {
	this.name = name;
	this.radius = radius;
	this.eccentricity = eccentricity;
	this.perihelion = perihelion;
	this.tilt = tilt;

	this.mesh = null;
	this.angle = 0;
	this.omega = 0;
	this.r = 0;

	this.X = 0;
	this.Z = 0;

	this.lastUpdated = 0;
}

Planet.prototype.getSemimajor = function() {
	return this.perihelion / (1 - this.eccentricity);
};

Planet.prototype.getR = function() {
	return (this.getSemimajor()*(1 - Math.pow(this.eccentricity, 2)))/(1+this.eccentricity*Math.cos(this.angle));
};

Planet.prototype.getViewpoint = function() {
	var x = this.X;
	var y = 1.1 * this.radius;
	var z = this.Z - 5 * this.radius;

	return new THREE.Vector3(x, y, z);
};

Planet.prototype.update = function( toMove ) {
	var now = Date.now();
	var delta = (now - this.lastUpdated) / 1000.0;

	var r = this.getR();


	if(toMove) {
		this.X = r * Math.cos(this.angle);
		this.Z = r * Math.sin(this.angle);

		this.mesh.position.set(this.X, 0, this.Z);

		this.omega = Math.sqrt(G*SUN_MASS / Math.pow(r, 3));

		this.angle += this.omega * delta;

		if(this.angle >= 6.28) {
			this.angle = 0;
		}
	} else {
		console.log("not moving");
	}

	
	this.lastUpdated = Date.now();
	
};

Planet.prototype.spin = function() {
	
	var x = Math.sin( this.tilt * Math.PI / 180.0 );
	var y = Math.cos( this.tilt * Math.PI / 180.0 );

	this.mesh.rotateOnAxis( new THREE.Vector3(x, y, 0), 0.05); 


}





















