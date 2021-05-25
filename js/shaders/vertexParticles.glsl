uniform float time;

uniform sampler2D texture1;
uniform sampler2D texture2;

uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition; 
varying vec3 vColor;
varying vec3 vNormal;

void main() {
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
    gl_PointSize = 10. * (.2 / - mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}