precision highp float;
attribute vec4 tangent;

varying vec3 fNormal;
varying vec3 fPosition;
varying vec2 vUv;
varying vec3 vTangent;
varying vec3 vBinormal;
varying vec3 vNormal;
varying vec3 vU;
varying vec2 vN;
varying vec3 vEye;

varying vec4 vPosition;
varying vec4 vOPosition;
varying vec3 vONormal;



void main()
{
    vN = vec2( 0. );
    vUv = uv;
    
    
    vOPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * vOPosition;
    
    vU = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );
    
    vPosition = vec4( position, 1.0 );
    vNormal = normalMatrix * normal;
    vONormal = normal;
    
    
    vTangent = normalize( normalMatrix * tangent.xyz );
    vBinormal = normalize( cross( vNormal, vTangent ) * tangent.w );
    fNormal = normalize(normalMatrix * normal);
    
    vec4 pos = modelViewMatrix * vec4(position, 1.0);
    fPosition = pos.xyz;
    gl_Position = projectionMatrix * pos;
    
}