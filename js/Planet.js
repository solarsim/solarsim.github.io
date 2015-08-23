//PLANET OBJECT
function Planet(name) {
	this.name = name.toUpperCase();

	var radiusName = this.name+"_RADIUS";
	var eccentricityName = this.name+"_ECCENTRICITY";
	var perihelionName = this.name+"_PERIHELION";
	var aphelionName = this.name+"_APHELION";
	var tiltName = this.name+"_TILT";

	this.radius = window[radiusName];
	this.eccentricity = window[eccentricityName];
	this.perihelion = DISTANCE_FACTOR * window[perihelionName];
	this.aphelion = DISTANCE_FACTOR * window[aphelionName];
	this.tilt = window[tiltName];

	this.parent = null;
	this.mesh = null;
	this.angle = (2 * Math.PI) * Math.random();
	this.omega = 0;
	this.r = 0;

	this.ringMesh = null;

	this.X = 0;
	this.Z = 0;

	this.lastUpdated = Date.now();
}

Planet.prototype.getSemimajor = function() {
	return (this.perihelion + this.aphelion) / 2;
};

Planet.prototype.getYearPeriod = function() {
	return 2*Math.PI * Math.sqrt(Math.pow(this.getSemimajor(), 3) / (G * PlanetInfo.getSunMass()/Math.pow(10, 9))); // divide by 10^9 to convert m^3 to km^3
};


Planet.prototype.getR = function() {
	return (this.getSemimajor()*(1 - Math.pow(this.eccentricity, 2)))/(1+this.eccentricity*Math.cos(this.angle));
};

Planet.prototype.getViewpoint = function() {
	var x = this.X;
	var y = 1.1 * this.radius;
	var z = this.Z + 5 * this.radius;

	return new THREE.Vector3(x, y, z);
};

Planet.prototype.update = function( toMove ) {
	var now = Date.now();
	var delta = (now - this.lastUpdated) / 1000.0;

	var r = this.getR();


	if(toMove && update) { //update variable found in script.js, manipulated by play/pause
		this.X = r * Math.cos(this.angle);
		this.Z = r * Math.sin(this.angle);

		this.parent.position.set(this.X, 0, this.Z);

		this.omega = Math.sqrt(G*PlanetInfo.getSunMass()/Math.pow(10, 9) / Math.pow(r, 3));

		this.angle += this.omega * delta;

		if(this.angle >= 6.28) {
			this.angle = 0;
		}

		this.mesh.rotation.y += PlanetInfo.getRotationSpeed();
	}

	if(this.ringMesh != undefined) {
		this.ringMesh.position.copy(this.parent.position);
	}

	
	this.lastUpdated = Date.now();
	
};























