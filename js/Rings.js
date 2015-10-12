const SATURN_RINGS_INNER = 1.5 * SATURN_RADIUS,
	  SATURN_RINGS_OUTER = 2.5 * SATURN_RADIUS,
	  URANUS_RINGS_INNER = 1.5 * URANUS_RADIUS,
	  URANUS_RINGS_OUTER = 2.0 * URANUS_RADIUS;

//RING OBJECT
function Rings(name, tilt) {
	this.name = name;
	this.tilt = tilt;

	this.mesh = null;
}

Rings.getMesh = function(texture, inner, outer, tilt) {


	material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true } );

	r = new THREE.Mesh( new THREE.RingGeometry (
								inner,
								outer,
								48,
								48),
								material);


	r.rotation.x = Math.PI / 2;
	r.rotation.y = (tilt) * Math.PI / 180;

	return r;

}