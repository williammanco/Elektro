uniform vec3 color;
uniform sampler2D texture;
varying float vAlpha;

void main() {
  gl_FragColor = vec4( clamp(color,0.0,1.0), clamp(vAlpha, 0.0, 1.0)  ) * texture2D( texture, gl_PointCoord );
}
