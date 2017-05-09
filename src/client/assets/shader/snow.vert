uniform float size;
attribute float alpha;
varying float vAlpha;

void main() {
  vAlpha = alpha;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_PointSize = 1.0 * ( 1000.0 / length( mvPosition.xyz ) );
  gl_Position = projectionMatrix * mvPosition;
}
