/* One intact texture and continuous mesh per cherub. No cut wing layers. */
const CherubMath = {
  smooth(a,b,x){const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)},
  deform(x,y,t,rig){
    const original=[x,y],wave=Math.sin(t*Math.PI*2/1.6+rig.phase);
    for(let i=0;i<2;i++){
      const q=rig.wings[i],d=Math.hypot((original[0]-q.center[0])/q.radius[0],(original[1]-q.center[1])/q.radius[1]);
      const weight=1-this.smooth(.36,1.08,d),angle=wave*q.angle*Math.PI/180*weight;
      const dx=original[0]-q.pivot[0],dy=original[1]-q.pivot[1];
      x+=dx*Math.cos(angle)-dy*Math.sin(angle)-dx;
      y+=dx*Math.sin(angle)+dy*Math.cos(angle)-dy;
    }
    return [x,y];
  },
  rigs:{
    left:{phase:0,wings:[{pivot:[380,375],center:[260,375],radius:[175,130],angle:24},{pivot:[510,325],center:[560,285],radius:[75,65],angle:-15}]},
    right:{phase:.58,wings:[{pivot:[477,375],center:[577,375],radius:[160,130],angle:-24},{pivot:[295,325],center:[241,285],radius:[80,68],angle:15}]}
  }
};
class CherubMesh{
  constructor(canvas,image,side){
    this.canvas=canvas;this.image=image;this.rig=CherubMath.rigs[side];this.width=800;this.height=960;
    canvas.width=800;canvas.height=960;
    this.gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:true,preserveDrawingBuffer:true});
    if(this.gl)this.initGL();else{this.ctx=canvas.getContext('2d');this.initGrid(14,18);}
  }
  initGrid(nx=36,ny=44){this.points=[];this.indices=[];for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++)this.points.push([i*800/nx,j*960/ny]);for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;this.indices.push(a,b,c,b,d,c);}}
  initGL(){const gl=this.gl;
    const shader=(kind,src)=>{const s=gl.createShader(kind);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s};
    const p=gl.createProgram();gl.attachShader(p,shader(gl.VERTEX_SHADER,'attribute vec2 position;attribute vec2 uv;varying vec2 tex;void main(){tex=uv;gl_Position=vec4(position.x/400.0-1.0,1.0-position.y/480.0,0.0,1.0);}'));
    gl.attachShader(p,shader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec2 tex;uniform sampler2D image;void main(){gl_FragColor=texture2D(image,tex);}'));
    gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));gl.useProgram(p);this.program=p;this.initGrid();
    this.positions=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.positions);gl.bufferData(gl.ARRAY_BUFFER,this.points.length*8,gl.DYNAMIC_DRAW);const pos=gl.getAttribLocation(p,'position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
    const uv=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,uv);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.points.flatMap(([x,y])=>[x/800,y/960])),gl.STATIC_DRAW);const at=gl.getAttribLocation(p,'uv');gl.enableVertexAttribArray(at);gl.vertexAttribPointer(at,2,gl.FLOAT,false,0,0);
    const ix=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ix);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.indices),gl.STATIC_DRAW);
    this.texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,this.image);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);this.frame=new Float32Array(this.points.length*2);
  }
  draw(time){
    const moved=this.points.map(([x,y])=>CherubMath.deform(x,y,time,this.rig));
    if(this.gl){const gl=this.gl;for(let i=0;i<moved.length;i++){this.frame[2*i]=moved[i][0];this.frame[2*i+1]=moved[i][1];}gl.viewport(0,0,800,960);gl.clear(gl.COLOR_BUFFER_BIT);gl.bindBuffer(gl.ARRAY_BUFFER,this.positions);gl.bufferSubData(gl.ARRAY_BUFFER,0,this.frame);gl.drawElements(gl.TRIANGLES,this.indices.length,gl.UNSIGNED_SHORT,0);return;}
    const ctx=this.ctx;ctx.clearRect(0,0,800,960);
    // Canvas fallback deforms the same connected triangles.
    for(let k=0;k<this.indices.length;k+=3){const ids=this.indices.slice(k,k+3),s=ids.map(i=>this.points[i]),d=ids.map(i=>moved[i]);const [a,b,c]=s,[A,B,C]=d,den=a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]);
      const calc=j=>[(A[j]*(b[1]-c[1])+B[j]*(c[1]-a[1])+C[j]*(a[1]-b[1]))/den,(A[j]*(c[0]-b[0])+B[j]*(a[0]-c[0])+C[j]*(b[0]-a[0]))/den,(A[j]*(b[0]*c[1]-c[0]*b[1])+B[j]*(c[0]*a[1]-a[0]*c[1])+C[j]*(a[0]*b[1]-b[0]*a[1]))/den];const u=calc(0),v=calc(1);
      ctx.save();ctx.beginPath();ctx.moveTo(...A);ctx.lineTo(...B);ctx.lineTo(...C);ctx.closePath();ctx.clip();ctx.setTransform(u[0],v[0],u[1],v[1],u[2],v[2]);ctx.drawImage(this.image,0,0,800,960);ctx.restore();
    }
  }
  dispose(){if(this.gl){const ext=this.gl.getExtension('WEBGL_lose_context');if(ext)ext.loseContext();}}
}
if(typeof window!=='undefined'){window.CherubMath=CherubMath;window.CherubMesh=CherubMesh;}
if(typeof module!=='undefined')module.exports={CherubMath};
