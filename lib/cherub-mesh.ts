/**
 * Renderer cánh thiên thần của kit Cherub Reveal V5 (brand/Cherub-Reveal-V5).
 *
 * Mỗi thiên thần là MỘT texture liền, vẽ lên một lưới tam giác liên tục; cánh
 * đập bằng cách xoay các đỉnh lưới quanh khớp vai với trọng số rơi mềm, nên
 * không có mảnh cánh nào bị cắt rời và mặt / tay không méo. WebGL là đường
 * chính, Canvas 2D là đường dự phòng dùng cùng lưới đó.
 *
 * Port thẳng từ cherub-mesh.js của kit — đổi số ở đây là đổi chuyển động
 * đã được duyệt, nên đừng chỉnh nếu không có kit mới.
 */

export type CherubSide = "left" | "right";

type Wing = {
  pivot: [number, number];
  center: [number, number];
  radius: [number, number];
  angle: number;
};

type Rig = { phase: number; wings: [Wing, Wing] };

const SPRITE_W = 800;
const SPRITE_H = 960;
/** Chu kỳ đập cánh, giây. */
const WING_PERIOD = 1.6;

const RIGS: Record<CherubSide, Rig> = {
  left: {
    phase: 0,
    wings: [
      { pivot: [380, 375], center: [260, 375], radius: [175, 130], angle: 24 },
      { pivot: [510, 325], center: [560, 285], radius: [75, 65], angle: -15 },
    ],
  },
  right: {
    phase: 0.58,
    wings: [
      { pivot: [477, 375], center: [577, 375], radius: [160, 130], angle: -24 },
      { pivot: [295, 325], center: [241, 285], radius: [80, 68], angle: 15 },
    ],
  },
};

function smoothstep(a: number, b: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function deform(x0: number, y0: number, time: number, rig: Rig): [number, number] {
  let x = x0;
  let y = y0;
  const wave = Math.sin((time * Math.PI * 2) / WING_PERIOD + rig.phase);
  for (const wing of rig.wings) {
    const d = Math.hypot((x0 - wing.center[0]) / wing.radius[0], (y0 - wing.center[1]) / wing.radius[1]);
    const weight = 1 - smoothstep(0.36, 1.08, d);
    const angle = ((wave * wing.angle * Math.PI) / 180) * weight;
    const dx = x0 - wing.pivot[0];
    const dy = y0 - wing.pivot[1];
    x += dx * Math.cos(angle) - dy * Math.sin(angle) - dx;
    y += dx * Math.sin(angle) + dy * Math.cos(angle) - dy;
  }
  return [x, y];
}

export class CherubMesh {
  private rig: Rig;
  private image: HTMLImageElement;
  private gl: WebGLRenderingContext | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private points: [number, number][] = [];
  private indices: number[] = [];
  private positions: WebGLBuffer | null = null;
  private frame: Float32Array | null = null;

  constructor(canvas: HTMLCanvasElement, image: HTMLImageElement, side: CherubSide) {
    this.rig = RIGS[side];
    this.image = image;
    canvas.width = SPRITE_W;
    canvas.height = SPRITE_H;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
      });
    } catch {
      gl = null;
    }

    if (gl) {
      try {
        this.gl = gl;
        this.initGL();
        return;
      } catch {
        this.gl = null;
      }
    }
    this.ctx = canvas.getContext("2d");
    this.initGrid(14, 18);
  }

  private initGrid(nx = 36, ny = 44) {
    this.points = [];
    this.indices = [];
    for (let j = 0; j <= ny; j++)
      for (let i = 0; i <= nx; i++) this.points.push([(i * SPRITE_W) / nx, (j * SPRITE_H) / ny]);
    for (let j = 0; j < ny; j++)
      for (let i = 0; i < nx; i++) {
        const a = j * (nx + 1) + i;
        const b = a + 1;
        const c = a + nx + 1;
        const d = c + 1;
        this.indices.push(a, b, c, b, d, c);
      }
  }

  private initGL() {
    const gl = this.gl!;
    const shader = (kind: number, src: string) => {
      const s = gl.createShader(kind)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(
      program,
      shader(
        gl.VERTEX_SHADER,
        "attribute vec2 position;attribute vec2 uv;varying vec2 tex;void main(){tex=uv;gl_Position=vec4(position.x/400.0-1.0,1.0-position.y/480.0,0.0,1.0);}",
      ),
    );
    gl.attachShader(
      program,
      shader(
        gl.FRAGMENT_SHADER,
        "precision mediump float;varying vec2 tex;uniform sampler2D image;void main(){gl_FragColor=texture2D(image,tex);}",
      ),
    );
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "link");
    gl.useProgram(program);
    this.initGrid();

    this.positions = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positions);
    gl.bufferData(gl.ARRAY_BUFFER, this.points.length * 8, gl.DYNAMIC_DRAW);
    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uv = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uv);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.points.flatMap(([x, y]) => [x / SPRITE_W, y / SPRITE_H])),
      gl.STATIC_DRAW,
    );
    const at = gl.getAttribLocation(program, "uv");
    gl.enableVertexAttribArray(at);
    gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);

    const ix = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ix);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    this.frame = new Float32Array(this.points.length * 2);
  }

  /** Vẽ một khung tại thời điểm `time` (giây, tính từ lúc thiên thần xuất hiện). */
  draw(time: number) {
    const moved = this.points.map(([x, y]) => deform(x, y, time, this.rig));

    if (this.gl && this.frame) {
      const gl = this.gl;
      for (let i = 0; i < moved.length; i++) {
        this.frame[2 * i] = moved[i][0];
        this.frame[2 * i + 1] = moved[i][1];
      }
      gl.viewport(0, 0, SPRITE_W, SPRITE_H);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.positions);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.frame);
      gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
      return;
    }

    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, SPRITE_W, SPRITE_H);
    // Dự phòng Canvas: biến dạng affine từng tam giác của cùng lưới liền.
    for (let k = 0; k < this.indices.length; k += 3) {
      const ids = [this.indices[k], this.indices[k + 1], this.indices[k + 2]];
      const [a, b, c] = ids.map((i) => this.points[i]);
      const [A, B, C] = ids.map((i) => moved[i]);
      const den = a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]);
      const calc = (j: 0 | 1) => [
        (A[j] * (b[1] - c[1]) + B[j] * (c[1] - a[1]) + C[j] * (a[1] - b[1])) / den,
        (A[j] * (c[0] - b[0]) + B[j] * (a[0] - c[0]) + C[j] * (b[0] - a[0])) / den,
        (A[j] * (b[0] * c[1] - c[0] * b[1]) + B[j] * (c[0] * a[1] - a[0] * c[1]) + C[j] * (a[0] * b[1] - b[0] * a[1])) /
          den,
      ];
      const u = calc(0);
      const v = calc(1);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(A[0], A[1]);
      ctx.lineTo(B[0], B[1]);
      ctx.lineTo(C[0], C[1]);
      ctx.closePath();
      ctx.clip();
      ctx.setTransform(u[0], v[0], u[1], v[1], u[2], v[2]);
      ctx.drawImage(this.image, 0, 0, SPRITE_W, SPRITE_H);
      ctx.restore();
    }
  }

  dispose() {
    this.gl?.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
