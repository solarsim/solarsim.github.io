const SATURN_RINGS_INNER = 1.5 * SATURN_RADIUS,
	SATURN_RINGS_OUTER = 2.5 * SATURN_RADIUS;

//RING OBJECT
function Rings(name, tilt) {
	this.name = name;
	this.tilt = tilt;

	this.mesh = null;
}

// Rings.prototype.setMesh(mesh) {

// 	this.mesh = mesh;
// 	this.mesh.rotation.x = Math.PI / 2;
// 	this.mesh.rotation.y = (180-tilt) * Math.PI / 180;
// }