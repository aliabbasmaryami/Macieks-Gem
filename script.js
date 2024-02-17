"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body = document.getElementsByTagName("body").item(0);
body.style.background = "#000";
const TP = 2 * Math.PI;
const CSIZE = 400;

const ctx = (() => {
  let d = document.createElement("div");
  d.style.textAlign = "center";
  body.append(d);
  let c = document.createElement("canvas");
  c.width = c.height = 2 * CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE, CSIZE);
ctx.lineCap = "round";

onresize = () => {
  let D = Math.min(window.innerWidth, window.innerHeight) - 40;
  ctx.canvas.style.width = ctx.canvas.style.height = D + "px";
};

const getRandomInt = (min, max, low) => {
  if (low) return Math.floor(Math.random() * Math.random() * (max - min)) + min;
  else return Math.floor(Math.random() * (max - min)) + min;
};

function Color() {
  const CBASE = 160;
  const CT = 255 - CBASE;
  this.getRGB = () => {
    let red = Math.round(
      CBASE +
        CT *
          (this.fr * Math.cos(this.RK2 + tt / this.RK1) +
            (1 - this.fr) * Math.cos(tt / this.RK3))
    );
    let grn = Math.round(
      CBASE +
        CT *
          (this.fg * Math.cos(this.GK2 + tt / this.GK1) +
            (1 - this.fg) * Math.cos(tt / this.GK3))
    );
    let blu = Math.round(
      CBASE +
        CT *
          (this.fb * Math.cos(this.BK2 + tt / this.BK1) +
            (1 - this.fb) * Math.cos(tt / this.BK3))
    );
    return "rgb(" + red + "," + grn + "," + blu + ")";
  };
  this.randomizeF = () => {
    this.RK3 = 1 + 5 * Math.random();
    this.GK3 = 1 + 5 * Math.random();
    this.BK3 = 1 + 5 * Math.random();
    this.fr = 1 - Math.pow(0.9 * Math.random(), 3);
    this.fg = 1 - Math.pow(0.9 * Math.random(), 3);
    this.fb = 1 - Math.pow(0.9 * Math.random(), 3);
  };
  this.randomize = () => {
    this.RK1 = 40 + 40 * Math.random();
    this.GK1 = 40 + 40 * Math.random();
    this.BK1 = 40 + 40 * Math.random();
    this.RK2 = TP * Math.random();
    this.GK2 = TP * Math.random();
    this.BK2 = TP * Math.random();
    this.randomizeF();
  };
  this.randomize();
}

var color = new Color();

var stopped = true;
var start = () => {
  if (stopped) {
    stopped = false;
    requestAnimationFrame(animate);
  } else {
    stopped = true;
  }
};
body.addEventListener("click", start, false);

var dur = 2000;
var tt = getRandomInt(0, 1000);
var pause = 0;
var trans = false;
var animate = (ts) => {
  if (stopped) return;
  tt++;
  draw();
  if (tt % dur == 0) {
    color.randomize();
    for (let i = 0; i < ca.length; i++) ca[i].randomize();
  }
  requestAnimationFrame(animate);
};

var Circle = function () {
  this.dir = false;
  this.randomize = () => {
    this.kr = TP * Math.random();
    this.kr2 = 300 + 600 * Math.random();
    this.ka = TP * Math.random();
    this.ka2 = 300 + 600 * Math.random();
    this.kf = Math.pow(0.9 * Math.random(), 4);
    this.k3 = 6 + 100 * Math.random();
  };
  this.randomize();
  this.r = 8 + 100 * Math.random();
  this.a2 = TP / 24 + ((5 * TP) / 12) * Math.random();
  this.setRA = () => {
    this.r =
      32 *
      (1 + Math.sin(this.kr + tt / this.kr2)) *
      (1 - Math.cos((TP * tt) / dur));
    this.a2 =
      TP / 48 +
      (((11 * TP) / 24) * (1 + Math.sin(this.ka + tt / this.ka2))) / 2 +
      (TP / 96) * this.kf * Math.sin(tt / this.k3);
    if (this.dir) this.a2 = -this.a2;
  };
  this.getRandomA = () => {
    return TP / 24 + ((5 * TP) / 12) * Math.random();
  };
  this.setPath = () => {
    this.path = new Path2D();
    this.path.arc(
      this.x,
      this.y,
      this.r,
      TP / 2 + this.a,
      this.a - this.a2,
      this.dir
    );
  };
};

onresize();

var ca = [];
var reset = () => {
  ca = [new Circle()];
  ca[0].a = 0; //TP*Math.random();
  ca[0].x = 0; //ca[0].r*Math.cos(ca[0].a);
  ca[0].y = 0; //ca[0].r*Math.sin(ca[0].a);
  ca[0].setPath();
};
reset();

var addPath = (c) => {
  let c2 = new Circle();
  c2.a = c.a - c.a2;
  c2.x = c.x + (c.r + c2.r) * Math.cos(c.a - c.a2);
  c2.y = c.y + (c.r + c2.r) * Math.sin(c.a - c.a2);
  c2.dir = !c.dir;
  if (c2.dir) c2.a2 = -c2.getRandomA();
  else c2.a2 = c2.getRandomA();
  c2.setPath();
  ca.push(c2);
};

var setPath = (c, c2) => {
  c2.a = c.a - c.a2;
  c2.x = c.x + (c.r + c2.r) * Math.cos(c.a - c.a2);
  c2.y = c.y + (c.r + c2.r) * Math.sin(c.a - c.a2);
  c2.setPath();
};

for (let i = 0; i < 8; i++) addPath(ca[i]);

const dmx = new DOMMatrix([-1, 0, 0, 1, 0, 0]);
const dmy = new DOMMatrix([1, 0, 0, -1, 0, 0]);

const getDualPath = (spath) => {
  let p = new Path2D(spath);
  p.addPath(p, dmy);
  p.addPath(p, dmx);
  return p;
};

const getHexPath = (spath) => {
  const dm1 = new DOMMatrix([0.5, 0.866, -0.866, 0.5, 0, 0]);
  const dm2 = new DOMMatrix([-0.5, 0.866, -0.866, -0.5, 0, 0]);
  let p = getDualPath(spath);
  let hpath = new Path2D(p);
  hpath.addPath(p, dm1);
  hpath.addPath(p, dm2);
  return hpath;
};

var draw = () => {
  for (let i = 0; i < ca.length; i++) ca[i].setRA();
  for (let i = 0; i < ca.length - 1; i++) setPath(ca[i], ca[i + 1]);
  let p = new Path2D();
  for (let i = 4; i < ca.length; i++) p.addPath(getHexPath(ca[i].path));
  ctx.setTransform(1, 0, 0, 1, CSIZE - 2, CSIZE + 2);
  ctx.strokeStyle = color.getRGB();
  ctx.lineWidth = 3;
  ctx.strokeStyle = color.getRGB();
  ctx.stroke(p);
  ctx.setTransform(1, 0, 0, 1, CSIZE, CSIZE);
  ctx.strokeStyle = "#00affef";
  ctx.lineWidth = 10;
  ctx.stroke(p);
};

start();
