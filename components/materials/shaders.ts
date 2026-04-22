// GLSL Fragment Shaders for Material Swatches
// Premium optical simulations - each material has authentic physical properties

export const MATERIAL_SHADERS = {
  // Velvet: Deep pile with directional sheen - light catches fiber tips
  velvet: `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec3 u_baseColor;
    uniform vec3 u_lightPos;
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      vec2 center = vec2(0.5);
      
      // Simulate fiber direction - radiating from center like brushed pile
      vec2 toCenter = uv - center;
      float dist = length(toCenter);
      float angle = atan(toCenter.y, toCenter.x);
      
      // Fiber micro-structure - creates that velvet "nap" look
      float fiberNoise = sin(angle * 60.0 + dist * 20.0) * 0.5 + 0.5;
      fiberNoise *= sin(angle * 80.0 - dist * 15.0) * 0.5 + 0.5;
      
      // Fresnel-like sheen - velvet is brightest at grazing angles
      float viewAngle = 1.0 - abs(dot(normalize(vec3(toCenter, 0.3)), vec3(0.0, 0.0, 1.0)));
      float sheen = pow(viewAngle, 2.5) * 0.6;
      
      // Light interaction - soft directional highlight
      vec2 lightDir = normalize(u_lightPos.xy - uv);
      float lightAngle = dot(normalize(toCenter), lightDir);
      float highlight = pow(max(lightAngle, 0.0), 3.0) * 0.15;
      
      // Deep, rich base with subtle variation
      vec3 deepColor = u_baseColor * 0.7;
      vec3 sheenColor = u_baseColor * 1.4 + vec3(0.1);
      vec3 color = mix(deepColor, sheenColor, sheen * fiberNoise + highlight);
      
      // Subtle vignette for depth
      float vignette = 1.0 - dist * 0.3;
      color *= vignette;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,

  // Leather: Natural grain with warm patina and soft specular
  leather: `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec3 u_baseColor;
    uniform vec3 u_lightPos;
    
    // Smooth noise for organic grain
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
      
      // Multi-scale grain - natural leather pebbling
      float grain = 0.0;
      grain += noise(uv * 40.0) * 0.5;
      grain += noise(uv * 80.0) * 0.25;
      grain += noise(uv * 160.0) * 0.125;
      grain = grain * 0.12 + 0.94; // Subtle, not overwhelming
      
      // Slight color variation in the grain
      float colorVar = noise(uv * 30.0) * 0.08;
      
      // Warm specular - leather has a soft, diffused highlight
      vec3 lightDir = normalize(vec3(u_lightPos.xy - uv, 0.5));
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      vec3 halfVec = normalize(lightDir + viewDir);
      float spec = pow(max(dot(vec3(0.0, 0.0, 1.0), halfVec), 0.0), 16.0);
      
      // Combine with natural patina look
      vec3 color = u_baseColor * grain;
      color += u_baseColor * colorVar;
      color += vec3(1.0, 0.95, 0.9) * spec * 0.2; // Warm highlight
      
      // Soft edge darkening - like natural wear
      float edge = 1.0 - pow(length(uv - 0.5) * 1.2, 2.0) * 0.15;
      color *= edge;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,

  // Linen: Woven crosshatch texture with natural fiber variation
  linen: `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec3 u_baseColor;
    uniform vec3 u_lightPos;
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      
      // Warp threads (vertical) with slight irregularity
      float warpFreq = 120.0;
      float warp = sin(uv.x * warpFreq + sin(uv.y * 8.0) * 0.3);
      warp = smoothstep(-0.3, 0.3, warp);
      
      // Weft threads (horizontal) interlacing
      float weftFreq = 100.0;
      float weft = sin(uv.y * weftFreq + sin(uv.x * 6.0) * 0.2);
      weft = smoothstep(-0.3, 0.3, weft);
      
      // Crosshatch weave pattern
      float weave = mix(warp, weft, 0.5);
      weave = weave * 0.06 + 0.97;
      
      // Natural fiber color variation - slubs
      float slub = hash(floor(uv * 50.0)) * 0.03;
      
      // Soft diffuse lighting
      vec3 lightDir = normalize(vec3(u_lightPos.xy - uv, 0.8));
      float diffuse = max(dot(vec3(0.0, 0.0, 1.0), lightDir), 0.0) * 0.15 + 0.85;
      
      vec3 color = u_baseColor * weave * diffuse;
      color += vec3(slub) * 0.5;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,

  // Wood: Flowing grain with depth and natural rings
  wood: `
    precision highp float;
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
      
      // Organic grain flow - curved lines like real wood
      float flow = noise(uv * 3.0) * 2.0;
      float grainY = uv.y + sin(uv.x * 6.0 + flow) * 0.08;
      
      // Main grain lines
      float grain = sin(grainY * 50.0 + noise(uv * 10.0) * 3.0);
      grain = smoothstep(-0.4, 0.0, grain) * smoothstep(0.4, 0.0, grain);
      
      // Growth ring simulation
      float rings = sin(length(uv - vec2(0.2, 0.6)) * 25.0) * 0.5 + 0.5;
      rings = pow(rings, 0.5) * 0.15;
      
      // Color variation
      vec3 darkGrain = u_baseColor * 0.75;
      vec3 lightGrain = u_baseColor * 1.1;
      vec3 color = mix(lightGrain, darkGrain, grain * 0.6 + rings);
      
      // Subtle surface sheen
      float sheen = pow(1.0 - abs(uv.x - 0.5) * 1.5, 3.0) * 0.08;
      color += vec3(sheen);
      
      // Natural depth
      float depth = 1.0 - length(uv - 0.5) * 0.15;
      color *= depth;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,

  // Metal: Brushed finish with controlled anisotropic highlight
  metal: `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec3 u_baseColor;
    uniform vec3 u_lightPos;
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      
      // Brushed texture - fine horizontal lines
      float brushFreq = 300.0;
      float brush = sin(uv.y * brushFreq) * 0.5 + 0.5;
      brush = brush * 0.04 + 0.98;
      
      // Secondary brush variation
      float brushVar = sin(uv.y * 150.0 + sin(uv.x * 20.0) * 2.0) * 0.02;
      
      // Anisotropic highlight - stretched in brush direction
      vec2 lightUV = u_lightPos.xy;
      float dx = uv.x - lightUV.x;
      float dy = (uv.y - lightUV.y) * 4.0; // Stretch vertically
      float highlight = exp(-(dx * dx * 3.0 + dy * dy * 0.3));
      highlight = pow(highlight, 1.5) * 0.35;
      
      // Fresnel rim reflection
      float rim = pow(max(abs(uv.x - 0.5), abs(uv.y - 0.5)) * 1.8, 4.0) * 0.12;
      
      vec3 color = u_baseColor * brush + brushVar;
      color += vec3(1.0) * highlight;
      color += u_baseColor * rim;
      
      // Subtle environment reflection gradient
      float envReflect = (1.0 - uv.y) * 0.05;
      color += vec3(envReflect);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,

  // Marble: Organic veining with translucent depth
  marble: `
    precision highp float;
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
    
    float fbm(vec2 p) {
      float value = 0.0;
      float amp = 0.5;
      for (int i = 0; i < 5; i++) {
        value += noise(p) * amp;
        p *= 2.0;
        amp *= 0.5;
      }
      return value;
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      
      // Turbulent veining - organic flow
      float turb = fbm(uv * 3.0);
      float vein = sin(uv.x * 8.0 + uv.y * 4.0 + turb * 6.0);
      vein = smoothstep(-0.1, 0.1, vein);
      
      // Secondary smaller veins
      float vein2 = sin(uv.x * 15.0 - uv.y * 8.0 + turb * 4.0);
      vein2 = smoothstep(-0.2, 0.2, vein2) * 0.3;
      
      // Combine veins
      float veining = vein * 0.4 + vein2;
      
      // Vein color (darker gray)
      vec3 veinColor = u_baseColor * 0.5;
      vec3 color = mix(u_baseColor, veinColor, veining);
      
      // Subsurface scattering - marble has depth
      float sss = (1.0 - length(uv - 0.5) * 0.8);
      color += u_baseColor * 0.08 * sss;
      
      // Polished surface - subtle gloss
      vec2 lightDir = normalize(u_lightPos.xy - uv);
      float gloss = pow(max(0.0, dot(lightDir, vec2(0.0, 1.0))), 8.0) * 0.1;
      color += vec3(gloss);
      
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
