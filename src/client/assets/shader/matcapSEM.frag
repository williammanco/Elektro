
precision highp float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D textureVideo;
uniform sampler2D texture;
uniform sampler2D tNormal;


uniform float noise_value;

uniform vec3 lightDir_value;
uniform vec3 viewDir_value;
uniform float exponent_value;
uniform float fresnelCoef_value;
//uniform float exposition_value;

uniform vec3 rim_color;
uniform float rim_start;
uniform float rim_end;
uniform float rim_coef;

uniform float normalScale;
uniform float texScale;
uniform float normalCoef;

varying vec3 fPosition;
varying vec3 fNormal;

varying vec2 vUv;
varying vec3 vTangent;
varying vec3 vBinormal;
varying vec3 vNormal;
varying vec3 vU;
varying vec2 vN;

varying vec4 vPosition;
varying vec4 vOPosition;
varying vec3 vONormal;
varying vec3 vEye;


float random(vec3 scale,float seed)
{return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}

vec3 rim(vec3 rim_color,float start, float end,float coef)
{
	//http://roxlu.com/2014/037/opengl-rim-shader
	 vec3 n = normalize(fNormal);      // convert normal to view space, u_vm (view matrix), is a rigid body transform.
  vec3 p = vec3(fPosition);                   // position in view space
  vec3 v = normalize(-p);                       // eye vector
  float vdn = coef - max(dot(v, n), 0.0);        // the rim contribution
  return vec3(smoothstep(start, end, vdn))*(rim_color/vec3(255,255,255));
	
}

float fresnel(float costheta, float fresnelCoef)
{
    return fresnelCoef + (1. - fresnelCoef) * pow(1. - costheta, 5.);
}

//http://sunandblackcat.com/tipFullView.php?l=eng&topicid=30&topic=Phong-Lighting

vec2 normal_map(float normalScale,float normalCoef,float texScale)
{
    //www.clicktorelease.com/code/bumpy-metaballs/
    
    vec3 n = normalize( vONormal.xyz );
    vec3 blend_weights = abs( n );
    blend_weights = ( blend_weights - 0.2 ) * 7.;
    blend_weights = max( blend_weights, 0. );
    blend_weights /= ( blend_weights.x + blend_weights.y + blend_weights.z );
    
    vec2 coord1 = vPosition.yz * texScale;
    vec2 coord2 = vPosition.zx * texScale;
    vec2 coord3 = vPosition.xy * texScale;
    
    vec3 bump1 = texture2D( tNormal, coord1 ).rgb;
    vec3 bump2 = texture2D( tNormal, coord2 ).rgb;
    vec3 bump3 = texture2D( tNormal, coord3 ).rgb;
    
    vec3 blended_bump = bump1 * blend_weights.xxx +
    bump2 * blend_weights.yyy +
    bump3 * blend_weights.zzz;
    
    vec3 tanX = vec3( vNormal.x, -vNormal.z, vNormal.y);
    vec3 tanY = vec3( vNormal.z, vNormal.y, -vNormal.x);
    vec3 tanZ = vec3(-vNormal.y, vNormal.x, vNormal.z);
    vec3 blended_tangent = tanX * blend_weights.xxx +
    tanY * blend_weights.yyy +
    tanZ * blend_weights.zzz;
    
    // vec3 normalTex = blended_bump * 2.0 - 1.0;
    vec3 normalTex = texture2D( tNormal, vUv  ).xyz * 2.0 - 1.0;
    normalTex.xy *= normalScale;
    // normalTex.y *= -1.;
    normalTex = normalize( normalTex );
    mat3 tsb = mat3( normalize( blended_tangent ), normalize( cross( vNormal, blended_tangent ) ), normalize( vNormal ) );
    vec3 finalNormal = tsb * normalTex;
    
    vec3 r = reflect( normalize( vU ), normalize( finalNormal ) );
    float m = normalCoef * sqrt( r.x * r.x + r.y * r.y + ( r.z + 1.0 ) * ( r.z + 1.0 ) );
    vec2 calculatedNormal = vec2( r.x / m + 0.5,  r.y / m + 0.5 );
    
    return calculatedNormal;
}

void main()
{
    float noise = noise_value;
    vec2 position = vUv;
    vec3 color = texture2D( texture,  normal_map(normalScale,normalCoef, texScale) ).rgb;
    
		color += fresnel(dot(fNormal,lightDir_value), fresnelCoef_value)*exponent_value;
    color += rim(rim_color,rim_start, rim_end,rim_coef);
    color += noise * ( .5 - random( vec3( 1. ), length( gl_FragCoord ) ) );
		//color += mix(color, vNormal, 0.5);
//	vec3 t = texture2D(textureVideo,position).rgb;
//		color += mix(color,t,0.4);
	
    gl_FragColor = vec4(color, 1.0);
}