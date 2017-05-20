precision highp float;
attribute vec4 tangent;

varying vec3 fNormal;
varying vec3 fPosition;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vU;

varying vec4 vPosition;
varying vec3 vONormal;



void main()
{
    vec2 vN = vec2( 0. );
    vUv = uv;


    vec4 vOPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * vOPosition;

    vU = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );

    vPosition = vec4( position, 1.0 );
    vNormal = normalMatrix * normal;
    vONormal = normal;


    fNormal = normalize(normalMatrix * normal);

    vec4 pos = modelViewMatrix * vec4(position, 1.0);
    fPosition = pos.xyz;
    gl_Position = projectionMatrix * pos;

}
