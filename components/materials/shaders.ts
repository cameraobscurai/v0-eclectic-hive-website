// GLSL Fragment Shaders for Material Swatches
// Each shader simulates the optical properties of a material

export const MATERIAL_SHADERS = {
  // Velvet: Anisotropic fiber scattering - fibers catch light at grazing angles
  velvet: `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec3 u_baseColor;
    uniform vec3 u_lightPos;
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      vec2 center = vec2(0.5);
      vec2 toCenter = uv - center;
      
      // Fiber direction simulation
      float angle = atan(toCenter.y, toCenter.x) + u_time * 0.3;
      float fiber = sin(angle * 40.0) * 0.5 + 0.5;
      
      // Anisotropic highlight - bright at grazing angles
      vec3 viewDir = normalize(vec3(uv - 0.5, 1.0));
      vec3 lightDir = normalize(u_lightPos - vec3(uv, 0.0));
      float fresnel = pow(1.0 - abs(dot(viewDir, vec3(0.0, 0.0, 1.0))), 3.0);
      
      // Combine base color with fiber sheen
      vec3 sheen = mix(u_baseColor, u_baseColor * 1.8, fresnel * fiber);
      
      // Soft vignette for depth
      float vignette = 1.0 - length(toCenter) * 0.6;
      
      gl_FragColor = vec4(sheen * vignette, 1.0);
    }
  `,

  // Leather: Subtle grain texture with specular highlights
  leather: `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec3 u_baseColor;
    uniform vec3 u_lightPos;
    
    // Simple noise function
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      
      // Leather grain - multi-octave noise
      float grain = noise(uv * 80.0) * 0.5 + noise(uv * 160.0) * 0.25;
      grain = grain * 0.15 + 0.85;
      
      // Specular highlight
      vec3 lightDir = normalize(u_lightPos - vec3(uv, 0.0));
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      vec3 halfVec = normalize(lightDir + viewDir);
      float spec = pow(max(dot(vec3(0.0, 0.0, 1.0), halfVec), 0.0), 32.0);
      
      // Combine
      vec3 color = u_baseColor * grain + vec3(1.0) * spec * 0.3;
      
      // Subtle edge darkening
      float edge = 1.0 - length(uv - 0.5) * 0.4;
      
      gl_FragColor = vec4(color * edge, 1.0);
    }
  `,

  // Linen: Woven texture with subtle thread variation
  linen: `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec3 u_baseColor;
    uniform vec3 u_lightPos;
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      
      // Weave pattern - horizontal and vertical threads
      float warpThread = sin(uv.x * 200.0) * 0.5 + 0.5;
      float weftThread = sin(uv.y * 200.0) * 0.5 + 0.5;
      float weave = mix(warpThread, weftThread, 0.5);
      weave = weave * 0.08 + 0.92;
      
      // Thread color variation
      float variation = sin(uv.x * 50.0 + uv.y * 30.0) * 0.03;
      
      // Soft diffuse lighting
      vec3 lightDir = normalize(u_lightPos - vec3(uv, 0.0));
      float diffuse = max(dot(vec3(0.0, 0.0, 1.0), lightDir), 0.0) * 0.2 + 0.8;
      
      vec3 color = u_baseColor * weave * diffuse + variation;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,

  // Wood: Grain lines with subtle depth
  wood: `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec3 u_baseColor;
    uniform vec3 u_lightPos;
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      
      // Wood grain - flowing lines
      float grain = sin((uv.y + sin(uv.x * 8.0) * 0.1) * 60.0);
      grain = smoothstep(-0.2, 0.2, grain);
      
      // Ring variation
      float ring = sin(length(uv - vec2(0.3, 0.5)) * 30.0) * 0.5 + 0.5;
      
      // Color variation between grain lines
      vec3 darkGrain = u_baseColor * 0.7;
      vec3 lightGrain = u_baseColor * 1.1;
      vec3 color = mix(darkGrain, lightGrain, grain * 0.5 + ring * 0.3);
      
      // Subtle sheen
      float sheen = pow(1.0 - abs(uv.x - 0.5) * 2.0, 2.0) * 0.1;
      color += sheen;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,

  // Metal: Brushed finish with anisotropic reflections
  metal: `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec3 u_baseColor;
    uniform vec3 u_lightPos;
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      
      // Brushed metal lines (horizontal brush direction)
      float brush = sin(uv.y * 400.0) * 0.5 + 0.5;
      brush = brush * 0.1 + 0.9;
      
      // Anisotropic highlight - stretched horizontally
      vec2 lightUV = u_lightPos.xy;
      float highlightX = exp(-pow((uv.x - lightUV.x) * 2.0, 2.0) * 8.0);
      float highlightY = exp(-pow((uv.y - lightUV.y) * 8.0, 2.0) * 2.0);
      float highlight = highlightX * highlightY;
      
      // Fresnel rim
      float rim = pow(max(abs(uv.x - 0.5), abs(uv.y - 0.5)) * 2.0, 3.0) * 0.3;
      
      vec3 color = u_baseColor * brush + vec3(1.0) * highlight * 0.5 + rim;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,

  // Marble: Veined stone with translucent depth
  marble: `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec3 u_baseColor;
    uniform vec3 u_lightPos;
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      
      // Marble veins - turbulent noise
      float vein = 0.0;
      float amp = 0.5;
      vec2 p = uv * 4.0;
      for (int i = 0; i < 4; i++) {
        vein += noise(p) * amp;
        p *= 2.0;
        amp *= 0.5;
      }
      vein = sin(uv.x * 10.0 + vein * 8.0) * 0.5 + 0.5;
      vein = smoothstep(0.4, 0.6, vein);
      
      // Vein color (darker)
      vec3 veinColor = u_baseColor * 0.4;
      vec3 color = mix(u_baseColor, veinColor, vein * 0.6);
      
      // Subsurface scattering simulation - soft glow
      float sss = 1.0 - length(uv - 0.5) * 0.5;
      color += u_baseColor * 0.1 * sss;
      
      // Polished surface reflection
      float gloss = pow(max(0.0, 1.0 - length(uv - u_lightPos.xy)), 8.0) * 0.2;
      color += gloss;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,
} as const

// Vertex shader (same for all materials)
export const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

export type MaterialType = keyof typeof MATERIAL_SHADERS
