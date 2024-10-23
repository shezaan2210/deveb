uniform vec3 uColor;          // Base color
uniform vec3 uHighlightColor; // Highlight color
uniform vec3 uShadowColor;    // Shadow color

// Varying from the vertex shader
varying float vDisplacement;  // Displacement value passed from vertex shader

void main() {
    // Smoothstep to adjust how highlight and shadow are blended
    float intensity = smoothstep(-0.2, 0.8, vDisplacement);

    // Blend between the shadow and base color based on intensity
    vec3 baseBlend = mix(uShadowColor, uColor, intensity);

    // Further blend between the base blend and the highlight color
    vec3 finalColor = mix(baseBlend, uHighlightColor, intensity);

    // Output the final color
    gl_FragColor = vec4(finalColor, 1.0);
}
