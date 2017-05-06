/**
 * [SparksDotShader description]
 * @type {Object}
 * @author William Manco
 */
THREE.SparksDotShader = {

	uniforms: {
		"time":       { value: 0.0 },
		"resolution": { value: new THREE.Vector2( 512, 512 ) },
		"iMouse" : { value: new THREE.Vector2( 0, 0 )}
	},

	vertexShader: [
		"void main() {",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"

	].join( "\n" ),

	fragmentShader: [

		"#define Thickness 0.003",
		"uniform float time;",
		"uniform vec2 resolution;",
		"uniform vec2 iMouse;",
		"float prng(in vec2 seed) { seed = fract (seed * vec2 (5.3983, 5.4427)); seed += dot (seed.yx, seed.xy + vec2 (21.5351, 14.3137)); return fract (seed.x * seed.y * 95.4337); }",
		"float PI = 3.1415926535897932384626433832795;",
		"void main() {",
		"vec2 drag = iMouse.xy; vec2 offset = iMouse.xy; float xpart = gl_FragCoord.x/resolution.x; float ypart = gl_FragCoord.y/resolution.y; float timeSpeed = 40.0; float realTime = timeSpeed*time;",
		"float sparkGridSize = 33.0;",
		"vec2 sparkCoord = gl_FragCoord.xy-vec2(2.0*offset.x,realTime);",
		"if (mod(sparkCoord.y/sparkGridSize,2.0)<1.0) sparkCoord.x += 0.5*sparkGridSize;",
		"vec2 sparkGridIndex = vec2(floor(sparkCoord/sparkGridSize)); float sparkRandom = prng(sparkGridIndex); float sparkLife = min(10.0*(1.0-min((sparkGridIndex.y+(realTime/sparkGridSize))/(24.0-20.0*sparkRandom),1.0)),1.0); vec3 sparks = vec3(0.0);",
		"if (sparkLife>0.0) {",
		"float sparkSize = sparkRandom*0.05; float sparkRadians = 999.0*sparkRandom*2.0*PI + 2.0*time; vec2 sparkCircular = vec2(sin(sparkRadians),cos(sparkRadians)); vec2 sparkOffset = (0.5-sparkSize)*sparkGridSize*sparkCircular; vec2 sparkModulus = mod(sparkCoord+sparkOffset,sparkGridSize) - 0.5*vec2(sparkGridSize); float sparkLength = length(sparkModulus); float sparksGray = max(0.0, 1.0 - sparkLength/(sparkSize*sparkGridSize));",
		"sparks = sparkLife*sparksGray*vec3(0.6,0.4,1.0);",
		"gl_FragColor = vec4(sparks,1.0);}",
		"}"

	].join( "\n" )

};
