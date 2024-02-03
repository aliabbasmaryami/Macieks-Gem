const canvas = document.createElement("canvas")
const gl = canvas.getContext("webgl2")

document.title = "🤖";
document.body.innerHTML = "";
document.body.appendChild(canvas);
document.body.style = "margin:0;touch-action:none;overflow:hidden;";
canvas.style.width = "100%";
canvas.style.height = "auto";
canvas.style.userSelect = "none";

const dpr = Math.max(1, .5*window.devicePixelRatio)

function resize() {
    const {
        innerWidth: width,
        innerHeight: height
    } = window
  
    canvas.width = width * dpr
    canvas.height = height * dpr
  
    gl.viewport(0, 0, width * dpr, height * dpr)
}
window.onresize = resize
    
const vertexSource = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

in vec4 position;

void main(void) {
    gl_Position = position;
}
`

const fragmentSource = `#version 300 es
/*********
* made by Matthias Hurrle (@atzedent)
*/
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec2 touch;
uniform int pointerCount;
#define mouse (touch/resolution)
#define P pointerCount
#define FC gl_FragCoord.xy
#define R resolution
#define S smoothstep
#define T mod(time*.25, 180.)
#define rot(a) mat2(cos(a-vec4(0,11,33,0)))

float rnd(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898,78.233)))*345678.);
}

float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p), u = S(.0, 1., f);
    
    float
    a = rnd(i),
    b = rnd(i+vec2(1,0)),
    c = rnd(i+vec2(0,1)),
    d = rnd(i+1.);
    
    return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}

float fbm(vec2 p) {
    float t = .0, a = 1.;
    
    for (int i=0; i<5; i++) {
        t += a*noise(p);
        p *= 2.;
        a *= .5;
    }
    
    return t;
}

vec3 palette(float t) {
    vec3
    a = vec3(.5),
    b = vec3(.5),
    c = vec3(1),
    d = vec3(.2,.3,.4);
    
    return a+b*cos(6.3*(c*d+t));
}

vec3 pattern(vec2 uv) {
    vec3 col = vec3(0);
    vec2 p=uv;
    float d=1.;

    for (float i=.0; i<3.; i++) {
        p = vec2(cos(.25*sin(uv.x)),cos(uv.y)*.25);
        float a=fbm(T*.25+2.*uv*length(p)*d);
        d = a;
        uv *= .25;
        col += palette(d)*.5;
    }

    col = mix(col, vec3(.5),.5);
    col = mix(col, col*col*col*col, col);
    col = S(.0, 1., col);
    col = pow(col, vec3(.4545));

    return col;
}

float box(vec3 p, vec3 s, float r) {
    p = abs(p) - (s-r);
    
    return length(max(p, .0))+
        min(.0, max(max(p.x,p.y),p.z))-r;
}

float dsc(vec2 e, float r) {
    return length(max(e,.0))+
        min(.0, max(e.x, e.y))-r;
}

float smin(float a, float b, float k) {
    float h = clamp(
        .5+.5*(b-a)/k,
        .0,
        1.
    );
    
    return mix(b,a,h)-k*h*(1.-h);
}

float bod(vec3 p, float r) {
    return smin(
      smin(
        length(p.xy)-r,
        length(p.yz)-r,
        -.01
      ),
      length(p.xz)-r,
      -.01
    );
}

vec2 map(vec3 p) {
    vec3 q = p;
    if (P > 0) {
        p.yz *= rot(-mouse.y*3.14+1.57);
        p.xz *= rot(3.14-mouse.x*6.3);
    } else {
        float t = T*.2;
        p.yz *= rot(-t*.5);
        p.xz *= rot(t);
    }

    vec2
    a = vec2(bod(p, .7), 1),
    b = vec2(-box(q, vec3(14, 14, 4), .05), 0),
    s = vec2(.25,1.5)*(.95);

    float r = .5, a45 = .7853981634, rr=.05, d=5e5;
    vec3 st = abs(p);
    st.yz*= rot(a45);
    d = min(d, dsc(vec2(length(st.xy),abs(st.z))-s,rr));
    st = abs(p);
    st.xy*= rot(a45);
    st = abs(p);
    st.xz*= rot(a45);
    d = min(d, dsc(vec2(length(st.xy),abs(st.z))-s,rr));
    st = abs(p);
    st.xy*= rot(a45);
    d = min(d, dsc(vec2(length(st.xz),abs(st.y))-s,rr));
    a.x = smin(a.x,d, .05);
    a = a.x < b.x ? a: b;

    return a;
}

vec3 norm(vec3 p) {
    float h = 1e-3;
    vec2 k = vec2(-1,1);
    return normalize(
        k.xyy*map(p+k.xyy*h).x+
        k.yxy*map(p+k.yxy*h).x+
        k.yyx*map(p+k.yyx*h).x+
        k.xxx*map(p+k.xxx*h).x
    );
}

void main(void) {
    vec2 uv = (FC-.5*R)/min(R.x,R.y);
    vec3 col = vec3(0),
    p = vec3(0,0,-3),
    rd = normalize(vec3(uv, 1));
    
    const float steps = 300.;
    float dd = .0, bnz = .0;
    
    for (float i=.0; i<steps; i++) {
        vec2 d = map(p);
        
        if (d.x < 1e-3) {
            vec3 n = norm(p);
            
            if (d.y == .0) {
                col += pattern(p.xy)*abs(n.z);
                col += pattern(p.xz)*abs(n.y);
                col += pattern(p.yz)*abs(n.x);
                
                break;
            } else {
                rd = reflect(rd, n);
                d.x = .1;
                float mat = cos(uv.y);
                col += mat*n.z;
                col += mat*n.y;
                col += mat*n.x;
                col += palette(dot(rd,n));
                
                if (bnz++ > 1.) break;
            }
        }
        
        dd += d.x;
        p += rd*d.x;
    }
    
    col = mix(vec3(1), col, exp(-125e-6*dd*dd*dd));
    
    O = vec4(col, 1);
}
`
    
function compile(shader, source) {
    gl.shaderSource(shader, source)
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader))
    }
}

let program
    
function setup() {
    const vs = gl.createShader(gl.VERTEX_SHADER)
    const fs = gl.createShader(gl.FRAGMENT_SHADER)
    
    compile(vs, vertexSource)
    compile(fs, fragmentSource)

    program = gl.createProgram()
    
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program))
    }
}

let vertices, buffer

function init() {
    vertices = [
        -1.,-1., 1.,
        -1.,-1., 1.,
        -1., 1., 1.,
        -1., 1., 1.,
    ]

    buffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    const position = gl.getAttribLocation(program, "position")

    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    program.resolution = gl.getUniformLocation(program, "resolution")
    program.time = gl.getUniformLocation(program, "time")
    program.touch = gl.getUniformLocation(program, "touch")
    program.pointerCount = gl.getUniformLocation(program, "pointerCount")
}

const mouse = {
  x: 0, y: 0, touches: new Set(),
  update: function(x, y, pointerId) {
    this.x = x*dpr; this.y = canvas.height-y*dpr; this.touches.add(pointerId)
  },
  remove: function(pointerId) { this.touches.delete(pointerId) }
}

function loop(now) {
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.uniform2f(program.resolution, canvas.width, canvas.height)
    gl.uniform1f(program.time, now*1e-3)
    gl.uniform2f(program.touch, mouse.x, mouse.y)
    gl.uniform1i(program.pointerCount, mouse.touches.size)
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length * .5)
    requestAnimationFrame(loop)
}

setup()
init()
resize()
loop(0)

window.addEventListener("pointerdown", e => mouse.update(e.clientX, e.clientY, e.pointerId))
window.addEventListener("pointerup", e => mouse.remove(e.pointerId))
window.addEventListener("pointermove", e => {
  if (mouse.touches.has(e.pointerId))
    mouse.update(e.clientX, e.clientY, e.pointerId)
})