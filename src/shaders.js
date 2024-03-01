
class Shaders {
    constructor() {
        this.rasengan = {
            aura: {
                fragment: `
                uniform vec3 color;

                varying vec3 vertexNormal; 

                void main() {
                    float intensity = pow(1.0 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 1.0);
                    gl_FragColor = vec4(0.5, 0.75, 1.0, 1.0) * intensity;
                }

`, 
                vertex: `
                varying vec3 vertexNormal; 

                void main() {
                    vertexNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
                }
`
            }, 
            outer: {
                vertex: `
                varying vec3 vertexNormal; 

                void main() {
                    vertexNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
                }
`,             
                fragment: `
                uniform vec3 color;

                varying vec3 vertexNormal; 

                void main() {
                    float intensity = pow(1.6 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(0.5, 0.75, 1.0, 1.0) * intensity;
                }
`
            }, 
            particles: {
                vertex: `
                attribute float size;
                uniform vec3 color;
                varying vec3 vColor;
                varying vec3 vPosition;
                void main() {
                    vColor = color;
                    vPosition = position;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = 3.0;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `, 
                fragment: `
                varying vec3 vColor;
                varying vec3 vPosition;

                void main() {
                    float distance = length(vPosition);
                    vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), distance);
                    gl_FragColor = vec4(color, 1.0);
                }
            `
            }
        }
    }
}

export default Shaders