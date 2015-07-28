//PLANET OBJECT
function Planet(name) {
	this.name = name.toUpperCase();

	var radiusName = this.name+"_RADIUS";
	var eccentricityName = this.name+"_ECCENTRICITY";
	var perihelionName = this.name+"_PERIHELION";
	var tiltName = this.name+"_TILT";

	this.radius = window[radiusName];
	this.eccentricity = window[eccentricityName];
	this.perihelion = SUN_RADIUS + window[perihelionName];
	this.tilt = window[tiltName];

	this.parent = null;
	this.mesh = null;
	this.angle = 0;
	this.omega = 0;
	this.r = 0;

	this.ringMesh = null;

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

		this.parent.position.set(this.X, 0, this.Z);

		this.omega = Math.sqrt(G*SUN_MASS / Math.pow(r, 3));

		this.angle += this.omega * delta;

		if(this.angle >= 6.28) {
			this.angle = 0;
		}
	}

	if(this.ringMesh != undefined) {
		this.ringMesh.position.copy(this.parent.position);
	}

	
	this.lastUpdated = Date.now();
	
};

Planet.prototype.spin = function() {
	
	var x = Math.sin( this.tilt * Math.PI / 180.0 );
	var y = Math.cos( this.tilt * Math.PI / 180.0 );

	//this.mesh.rotateOnAxis(new THREE.Vector3(x, y, 0), 0.05);
	this.mesh.rotation.y += 0.05;
}

























