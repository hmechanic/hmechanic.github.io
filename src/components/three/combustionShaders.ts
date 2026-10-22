// GLSL for the hero combustion scene. All three materials share the same
// depth fog (fading toward the page background) so near/far molecules read as
// layers without needing real scene fog or lights.

const FOG = /* glsl */ `
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  float fogFactor(float depth) { return smoothstep(uFogNear, uFogFar, depth); }
`;

// --- Atoms + bonds: instanced, per-instance colour, key light + neon rim ---
export const MOLECULE_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vColor;
  varying float vDepth;

  void main() {
    vec4 mv = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * mat3(instanceMatrix) * normal);
    vView = -mv.xyz;
    vDepth = -mv.z;
    #ifdef USE_INSTANCING_COLOR
      vColor = instanceColor;
    #else
      vColor = vec3(1.0);
    #endif
    gl_Position = projectionMatrix * mv;
  }
`;

export const MOLECULE_FRAGMENT = /* glsl */ `
  ${FOG}
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vColor;
  varying float vDepth;

  const vec3 KEY = normalize(vec3(0.45, 0.7, 0.55));

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vView);
    float diffuse = max(dot(n, KEY), 0.0);
    float rim = pow(1.0 - max(dot(n, v), 0.0), 2.4);
    float spec = pow(max(dot(reflect(-KEY, n), v), 0.0), 28.0);
    vec3 color = vColor * (0.3 + 0.62 * diffuse) + vColor * rim * 1.25 + spec * 0.35;
    gl_FragColor = vec4(mix(color, uFogColor, fogFactor(vDepth)), 1.0);
    #include <colorspace_fragment>
  }
`;

// --- Additive glow sprites: halos, flashes, shock rings, sparks and dust ---
// aKind: 0 = soft blob, 1 = ring, 2 = hot spark (bright core)
export const GLOW_VERTEX = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aAlpha;
  attribute float aKind;
  uniform float uScale;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vKind;
  varying float vDepth;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uScale / -mv.z;
    vColor = aColor;
    vAlpha = aAlpha;
    vKind = aKind;
    vDepth = -mv.z;
  }
`;

export const GLOW_FRAGMENT = /* glsl */ `
  ${FOG}
  varying vec3 vColor;
  varying float vAlpha;
  varying float vKind;
  varying float vDepth;

  void main() {
    float r = length(gl_PointCoord * 2.0 - 1.0);
    if (r > 1.0) discard;
    float a;
    if (vKind < 0.5) {
      a = pow(1.0 - r, 2.2);
    } else if (vKind < 1.5) {
      a = smoothstep(0.62, 0.86, r) * smoothstep(1.0, 0.9, r);
    } else {
      float falloff = 1.0 - r;
      a = falloff * falloff * falloff + smoothstep(0.3, 0.0, r);
    }
    gl_FragColor = vec4(vColor, a * vAlpha * (1.0 - fogFactor(vDepth)));
    #include <colorspace_fragment>
  }
`;

// --- Formula labels: point sprites sampling one cell of a glyph atlas ---
export const LABEL_VERTEX = /* glsl */ `
  attribute float aGlyph;
  attribute float aAlpha;
  attribute float aSize;
  uniform float uScale;
  varying float vGlyph;
  varying float vAlpha;
  varying float vDepth;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uScale / -mv.z;
    vGlyph = aGlyph;
    vAlpha = aAlpha;
    vDepth = -mv.z;
  }
`;

export const LABEL_FRAGMENT = /* glsl */ `
  ${FOG}
  uniform sampler2D uAtlas;
  uniform float uCells;
  varying float vGlyph;
  varying float vAlpha;
  varying float vDepth;

  void main() {
    vec2 uv = vec2((vGlyph + gl_PointCoord.x) / uCells, 1.0 - gl_PointCoord.y);
    vec4 texel = texture2D(uAtlas, uv);
    gl_FragColor = vec4(texel.rgb, texel.a * vAlpha * (1.0 - fogFactor(vDepth)));
    #include <colorspace_fragment>
  }
`;
