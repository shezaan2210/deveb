// Vertex Shader (vertex.glsl)
uniform float uTime;
uniform float uNoiseFrequency;
uniform float uNoiseAmplitude;

// Varying to pass the calculated displacement to fragment shader
varying float vDisplacement;

#include "../includes/simplexNoise3d.glsl"

void main() {
    // Calculate the model position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Create slow, smooth noise motion based on time and frequency
    float noise = snoise(vec3(modelPosition.xyz * uNoiseFrequency + uTime * 0.1));

    // Apply noise as a displacement along the normal direction
    float displacement = noise * uNoiseAmplitude;

    modelPosition.xyz += normal * displacement;

    // Pass the displacement to the fragment shader
    vDisplacement = displacement;

    // Output the final vertex position
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
