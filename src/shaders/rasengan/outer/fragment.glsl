uniform vec3 color;

varying vec3 vertexNormal; 

void main() {
    float intensity = pow(1.6 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(0.5, 0.75, 1.0, 1.0) * intensity;
}
