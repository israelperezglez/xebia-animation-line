import { Renderer as OGLRenderer, Program, Mesh, Geometry, Texture } from 'ogl';
import type { OGLRenderingContext } from 'ogl';
import type { Polyline } from './types';
import type { ResolvedBackground } from './background';
import { buildGradientPixels } from './palette';
import { polylinesToSegments } from './lineGeometry';

const VERT = `
attribute vec2 position;
attribute float s;
varying float vS;
void main() { vS = s; gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform sampler2D uGradient;
uniform float uAlpha;
varying float vS;
void main() {
  vec3 c = texture2D(uGradient, vec2(vS, 0.5)).rgb;
  gl_FragColor = vec4(c, uAlpha);
}
`;

export class Renderer {
  private gl: OGLRenderingContext;
  private renderer: OGLRenderer;
  private program: Program;
  private gradient: Texture;
  private mesh: Mesh;
  private geometry: Geometry;
  private bg: ResolvedBackground = { clear: [0, 0, 0, 1], blend: 'add' };

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new OGLRenderer({ canvas, alpha: true, antialias: true, dpr: Math.min(devicePixelRatio || 1, 2) });
    this.gl = this.renderer.gl;
    this.gradient = new Texture(this.gl, { image: buildGradientPixels(['#000', '#fff']), width: 256, height: 1, generateMipmaps: false });
    this.program = new Program(this.gl, {
      vertex: VERT, fragment: FRAG, transparent: true,
      uniforms: { uGradient: { value: this.gradient }, uAlpha: { value: 0.85 } },
    });
    this.geometry = new Geometry(this.gl, {
      position: { size: 2, data: new Float32Array() },
      s: { size: 1, data: new Float32Array() },
    });
    this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program, mode: this.gl.LINES });
  }

  setPalette(palette: string[]): void {
    this.gradient.image = buildGradientPixels(palette);
    this.gradient.needsUpdate = true;
  }

  setBackground(bg: ResolvedBackground): void {
    this.bg = bg;
    this.program.uniforms.uAlpha.value = bg.blend === 'add' ? 0.85 : 1.0;
  }

  resize(): void {
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  get size(): { W: number; H: number } {
    return { W: this.canvas.clientWidth, H: this.canvas.clientHeight };
  }

  draw(polylines: Polyline[]): void {
    const { W, H } = this.size;
    const seg = polylinesToSegments(polylines, W, H);
    this.geometry = new Geometry(this.gl, {
      position: { size: 2, data: seg.position },
      s: { size: 1, data: seg.s },
    });
    this.mesh.geometry = this.geometry;

    const gl = this.gl;
    gl.clearColor(...this.bg.clear);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    if (this.bg.blend === 'add') gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    else gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.renderer.render({ scene: this.mesh });
  }

  destroy(): void {
    const ext = this.gl.getExtension('WEBGL_lose_context');
    ext?.loseContext();
  }
}
