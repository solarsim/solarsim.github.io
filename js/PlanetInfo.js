
function PlanetInfo() {}

PlanetInfo.setSunMass = function( mass ) {
	this.sunMass = mass;
}

PlanetInfo.getSunMass = function() {
	return this.sunMass;
}

PlanetInfo.setRotationSpeed = function( speed ) {
	this.rotation = speed;
}

PlanetInfo.getRotationSpeed = function() {
	return this.rotation;
}

PlanetInfo.setSunMass ( 1.989 * Math.pow(10, 25)); //not accurate, scaled down
PlanetInfo.setRotationSpeed( 0.05 );

//CONSTANTS
const G                       =  6.67*Math.pow(10, -11);

const MERCURY_ECCENTRICITY    =  0.2100,
	  VENUS_ECCENTRICITY      =  0.0067,
	  EARTH_ECCENTRICITY      =  0.0167,
	  MARS_ECCENTRICITY       =  0.0934,
	  JUPITER_ECCENTRICITY    =  0.0489,
	  SATURN_ECCENTRICITY     =  0.0565,
	  URANUS_ECCENTRICITY     =  0.0473,
	  NEPTUNE_ECCENTRICITY    =  0.0113,
	  PLUTO_ECCENTRICITY      =  0.2488;

const MERCURY_TILT            =  0.03,
	  VENUS_TILT              =  177.36,
	  EARTH_TILT              =  23.44,
	  MARS_TILT               =  25.19,
	  JUPITER_TILT            =  3.13,
	  SATURN_TILT             =  26.73,
	  URANUS_TILT             =  97.77,
	  NEPTUNE_TILT            =  28.32,
	  PLUTO_TILT              =  122.53;

const SUN_RADIUS_REAL         =  695800;
const MERCURY_RADIUS_REAL     =  2439.7,
	  VENUS_RADIUS_REAL       =  6051.8,
	  EARTH_RADIUS_REAL       =  6371.0,
	  MARS_RADIUS_REAL        =  3389.5,
	  JUPITER_RADIUS_REAL     =  "69,911",
	  SATURN_RADIUS_REAL      =  "58,232",
	  URANUS_RADIUS_REAL      =  "25,362",
	  NEPTUNE_RADIUS_REAL     =  "24,622",
	  PLUTO_RADIUS_REAL       =  1185;


const DISTANCE_ORDER          =  6;
const MERCURY_PERIHELION	  =  46.00,
	  VENUS_PERIHELION   	  =  107.48,
	  EARTH_PERIHELION   	  =  147.09,
	  MARS_PERIHELION   	  =  206.62,
	  JUPITER_PERIHELION	  =  740.52,
	  SATURN_PERIHELION 	  =  1352.55,
	  URANUS_PERIHELION  	  =  2741.30,
	  NEPTUNE_PERIHELION 	  =  4444.45,
	  PLUTO_PERIHELION   	  =  4436.82;

const MERCURY_APHELION  	  =  69.82,
	  VENUS_APHELION  		  =  108.94,
	  EARTH_APHELION     	  =  152.10,
	  MARS_APHELION      	  =  249.23,
	  JUPITER_APHELION   	  =  816.62,
	  SATURN_APHELION   	  =  1514.50,
	  URANUS_APHELION    	  =  3003.62,
	  NEPTUNE_APHELION   	  =  4545.67,
	  PLUTO_APHELION     	  =  7375.93;

// const MERCURY_RADIUS          =  MERCURY_RADIUS_REAL / 2000,
// 	  VENUS_RADIUS            =  VENUS_RADIUS_REAL / 2000,
// 	  EARTH_RADIUS            =  EARTH_RADIUS_REAL / 2000,
// 	  MARS_RADIUS             =  MARS_RADIUS_REAL / 2000,
// 	  JUPITER_RADIUS          =  parseInt(JUPITER_RADIUS_REAL.replace(',', '')) / 2000,
// 	  SATURN_RADIUS           =  parseInt(SATURN_RADIUS_REAL.replace(',', '')) / 2000,
// 	  URANUS_RADIUS           =  parseInt(NEPTUNE_RADIUS_REAL.replace(',', '')) / 2000,
// 	  NEPTUNE_RADIUS          =  parseInt(URANUS_RADIUS_REAL.replace(',', '')) / 2000,
// 	  PLUTO_RADIUS            =  PLUTO_RADIUS_REAL / 2000,
// 	  SUN_RADIUS 			  =  SUN_RADIUS_REAL / 2000;

const SUN_RADIUS              =  75,
	  MERCURY_RADIUS          =  5,
	  VENUS_RADIUS            =  10,
	  EARTH_RADIUS            =  10,
	  MARS_RADIUS             =  5,
	  JUPITER_RADIUS          =  20,
	  SATURN_RADIUS           =  15,
	  URANUS_RADIUS           =  15,
	  NEPTUNE_RADIUS          =  17,
	  PLUTO_RADIUS            =  5;

const DISTANCE_FACTOR    	  =  1 + (SUN_RADIUS - MERCURY_PERIHELION + 2 * MERCURY_RADIUS) / MERCURY_PERIHELION;

const MASS_ORDER              =  24;
const MERCURY_MASS            =  0.33,
	  VENUS_MASS              =  4.87,
	  EARTH_MASS              =  5.97,
	  MARS_MASS               =  0.64,
	  JUPITER_MASS            =  1898.30,
	  SATURN_MASS             =  568.36,
	  URANUS_MASS             =  86.81,
	  NEPTUNE_MASS            =  102.42,
	  PLUTO_MASS              =  0.0146;

const MERCURY_DAY             =  4222,
	  VENUS_DAY               =  2802,
	  EARTH_DAY               =  24,
	  MARS_DAY                =  24,
	  JUPITER_DAY             =  9,
	  SATURN_DAY              =  10,
	  URANUS_DAY              =  17,
	  NEPTUNE_DAY             =  16,
	  PLUTO_DAY               =  153;

const MERCURY_YEAR            =  88,
	  VENUS_YEAR              =  225,
	  EARTH_YEAR              =  365,
	  MARS_YEAR               =  687,
	  JUPITER_YEAR            =  4333,
	  SATURN_YEAR             =  "10,759",
	  URANUS_YEAR             =  "30,685", 
	  NEPTUNE_YEAR            =  "60,189",
	  PLUTO_YEAR              =  "90,560";















