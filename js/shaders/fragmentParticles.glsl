uniform float time;
uniform float position;

uniform sampler2D texture1;
uniform sampler2D texture2;

uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition; 
varying vec3 vColor;
varying vec3 vNormal;


void main() {
    gl_FragColor = vec4(0.899, 0.999, 0.999, 0.5);
}