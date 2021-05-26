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

    vec3 p = position;

    p.y += 0.1*(sin(p.y*20. + time) * 0.5 + 0.5);
    p.yz += 0.05*(sin(p.y*10. + time) * 0.5 + 0.5);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
    gl_PointSize = 3. * (.4 / - mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}