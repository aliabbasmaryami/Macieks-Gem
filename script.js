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
#define TT pow(fract(T),.25)
#define rot(a) mat2(cos(a-vec4(0,11,33,0)))

vec3 palette(in float t) {
    vec3
    a = vec3(.2),
    b = vec3(.4),
    c = vec3(.55),
    d = vec3(.12,.14,.16);
    
    return a+b*cos(6.3*(c*t+d));
}

float rnd(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898,78.233))+floor(T))*345678.);
}

float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p), u = smoothstep(.0,1.,f);
    
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

float map(vec3 p) {
    return max(
        max(
            length(p.yz)-1.,
            length(p.xz)-1.
        ),
        length(p.xy)-1.
    );
}

vec3 norm(vec3 p) {
    float h = 1e-3;
    vec2 k = vec2(-1,1);
    
    return normalize(
        k.xyy*map(p+k.xyy*h)+
        k.yxy*map(p+k.yxy*h)+
        k.yyx*map(p+k.yyx*h)+
        k.xxx*map(p+k.xxx*h)
    );
}

vec3 pattern(vec2 uv) {
    vec3 col = vec3(0);
    float d = 1.;
    
    for (int i=0; i<3; i++) {
        uv *= 2.;
        float
        a = fbm(uv*d),
        b = fbm(uv*d+1.);
        
        d = mix(a,b,TT);
        
        col += palette(.5/d);
    }
    
    return col;
}

vec3 mat(vec2 p) {
    float s = S(.55,.45,abs(sin(5.*max(abs(p.x),abs(p.y)))));
    
    return mix(vec3(s,.8,.0),vec3(s,.2,.0),TT);
}

void cam(inout vec3 p) {
    if (P > 0) {
        p.yz *= rot(-mouse.y*3.141592+1.5707);
        p.xz *= rot(1.5707-mouse.x*3.141592);
    } else {
        p.yz *= rot(sin(mix(T,T-1.,TT)));
        p.xz *= rot(mix(T, T+1., TT));
    }
}

void main(void) {
    vec2 uv = (FC-.5*R)/min(R.x, R.y);
    vec3 col = vec3(0);
    
    vec3 p = vec3(0,0,-4),
    rd = normalize(vec3(uv,1));

    cam(p);
    cam(rd);
    
    const float steps = 400., maxd = 12.;
    float dd = .0;
    
    for (float i=.0; i<steps; i++) {
        float d = map(p);
        
        if (d < 1e-3) {
            vec3 n = norm(p),
            l = normalize(vec3(.1,.2,-1));

            col += mat(p.yz)*abs(n.x);
            col += mat(p.xz)*abs(n.y);
            col += mat(p.xy)*abs(n.z);
            col = max(col, .4*vec3(max(.0,dot(l,n))));
            col = max(col, col+.2*vec3(pow(max(.0,dot(-rd,n)),64.)));
            
            break;
        }
        
        if (d > maxd) {
            col = pattern(uv);
            
            break;
        }
        
        p += rd*d;
        dd += d;
    }
    col = tanh(col*col*col*col)*1.4;
    col = pow(col, vec3(.4545));
    
    O = vec4(col,1.0);
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