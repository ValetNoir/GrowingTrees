const canvas = document.querySelector("canvas");

const SCREEN_WIDTH = canvas.width; // 3000;
const SCREEN_HEIGHT = canvas.height; // 1500;
const HALF_SCREEN_WIDTH = SCREEN_WIDTH / 2;
const HALF_SCREEN_HEIGHT = SCREEN_HEIGHT / 2;

const LITTLE_SQUARE_SIZE = 50;  
const BIG_SQUARE_SIZE = 250;
const AXIS_NUMBER_FREQUENCY = 250;


const myCircles = [
  {center: {x: 0, y: 0}, radius: 200},
  {center: {x: 200, y: 0}, radius: 200},
  {center: {x: 0, y: 200}, radius: 200},
  {center: {x: 200, y: 200}, radius: 200},
  // {center: {x: -100, y: 100}, radius: 100},
];

// console.log(
//   getIntersectionPoint(
//     {
//       a: {x: 0, y: 0},
//       b: {x: 200, y: 200}
//     },
//     {
//       a: {x: -173.20508075688772, y: 100},
//       b: {x: 100, y: 100}
//     },
//   ),
//   getIntersectionPoint(
//     {
//       a: {x: -173.20508075688772, y: 100},
//       b: {x: 99.99999999999997, y: 100}
//     },
//     {
//       a: {x: 0, y: 0},
//       b: {x: 200, y: 200}
//     },
//   )
// )

const ctx = canvas.getContext("2d");
ctx.translate(HALF_SCREEN_WIDTH, HALF_SCREEN_HEIGHT);
ctx.imageSmoothingEnabled = false;

var SELECTED_CIRCLE = 0;
var SELECTING = false;
var MOUSE_POS = {x: 0, y: 0};
window.addEventListener("keypress", selectCircle);
window.addEventListener("mousedown", selectCircle);
canvas.addEventListener("mousemove", handleMouse);
canvas.addEventListener("touchstart", handleMouse);
canvas.addEventListener("touchmove", handleMouse);
canvas.addEventListener("touchend", handleMouse);

function handleMouse(e) {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y

  MOUSE_POS.x = (e.clientX - rect.left) * scaleX - HALF_SCREEN_WIDTH,   // scale mouse coordinates after they have
  MOUSE_POS.y = (e.clientY - rect.top ) * scaleY - HALF_SCREEN_HEIGHT     // been adjusted to be relative to element
}

function selectCircle(e) {  
  if(SELECTING) {
    SELECTING = false;
  }
  else {
    SELECTED_CIRCLE++;
    if(SELECTED_CIRCLE >= myCircles.length) SELECTED_CIRCLE = 0;
    SELECTING = true;  
  }
}

function draw() {
  clear();
  ctx.globalAlpha = 1;
  drawGrid();
  ctx.globalAlpha = 0.5;

  if(!SELECTING) myCircles[SELECTED_CIRCLE].center = JSON.parse(JSON.stringify(MOUSE_POS))    ;

  ctx.lineWidth = 3;
  ctx.strokeStyle = "blue";
  let a = 360 / myCircles.length - 1;
  for(let i = 0; i < myCircles.length; i++) {
    ctx.strokeStyle = "hsl(" + a * i + ",100%,50%)";
    ctx.fillStyle = "hsl(" + a * i + ",50%,50%)";
    let shape = bubble(myCircles, i);
    ctx.fill(shape, "nonzero");
    ctx.stroke(shape);
    // drawShape(bubble(myCircles, i));
    // console.log("\n\n\n\n\n");
  }

  ctx.globalAlpha = 0.3;
  for(let i = 0; i < P.length; i ++) {
    ctx.fillStyle = ctx.strokeStyle = "hsl(" + a * P[i].index + ",100%,50%)";;
    drawPoint(P[i].point);
  }
  P = [];
}

function clear() {
  ctx.clearRect(-HALF_SCREEN_WIDTH, -HALF_SCREEN_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function drawGrid() {

  // little grid
  ctx.strokeStyle = "#CCC8C0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  let nw = HALF_SCREEN_WIDTH / LITTLE_SQUARE_SIZE;
  for(let i = -nw; i < nw; i++) {
    ctx.moveTo(i*LITTLE_SQUARE_SIZE,-HALF_SCREEN_HEIGHT);
    ctx.lineTo(i*LITTLE_SQUARE_SIZE, HALF_SCREEN_HEIGHT);
  } 
  let nh = HALF_SCREEN_HEIGHT / LITTLE_SQUARE_SIZE;
  for(let i = -nh; i < nh; i++) {
    ctx.moveTo(-HALF_SCREEN_WIDTH, i*LITTLE_SQUARE_SIZE);
    ctx.lineTo( HALF_SCREEN_WIDTH, i*LITTLE_SQUARE_SIZE);
  }
  ctx.stroke();


  // big grid
  ctx.strokeStyle = "#A3A09A";
  ctx.lineWidth = 2;
  ctx.beginPath();
  nw = HALF_SCREEN_WIDTH / BIG_SQUARE_SIZE;
  for(let i = -nw; i < nw; i++) {
    ctx.moveTo(i*BIG_SQUARE_SIZE,-HALF_SCREEN_HEIGHT);
    ctx.lineTo(i*BIG_SQUARE_SIZE, HALF_SCREEN_HEIGHT);
  } 
  nh = HALF_SCREEN_HEIGHT / BIG_SQUARE_SIZE;
  for(let i = -nh; i < nh; i++) {
    ctx.moveTo(-HALF_SCREEN_WIDTH, i*BIG_SQUARE_SIZE);
    ctx.lineTo( HALF_SCREEN_WIDTH, i*BIG_SQUARE_SIZE);
  }
  ctx.stroke();


  //axis
  ctx.strokeStyle = "#82807B";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-HALF_SCREEN_WIDTH, 0);
  ctx.lineTo( HALF_SCREEN_WIDTH, 0);
  ctx.moveTo(0,-HALF_SCREEN_HEIGHT);
  ctx.lineTo(0, HALF_SCREEN_HEIGHT);
  ctx.stroke();


  // axis number
  ctx.fillStyle = "#82807B";
  ctx.font = "36px serif";

  ctx.textBaseline = "hanging";
  ctx.textAlign = "center";
  nw = HALF_SCREEN_WIDTH / AXIS_NUMBER_FREQUENCY;
  for(let i = -nw; i <= nw; i++) {
    ctx.fillRect(i*AXIS_NUMBER_FREQUENCY-2, -15, 4, 30);
    ctx.fillText(`${i*AXIS_NUMBER_FREQUENCY}`, i*AXIS_NUMBER_FREQUENCY, 15);
  }
  ctx.textBaseline = "middle";
  ctx.textAlign = "end";
  nh = HALF_SCREEN_HEIGHT / AXIS_NUMBER_FREQUENCY;
  for(let i = -nh; i <= nh; i++) {
    ctx.fillRect(-15, i*AXIS_NUMBER_FREQUENCY-2, 30, 4);
    ctx.fillText(`${i*AXIS_NUMBER_FREQUENCY}`, -15, i*AXIS_NUMBER_FREQUENCY);
  }

}

function drawPoint(point) {
  ctx.fillRect(point.x - 10, point.y - 2, 20, 4);
  ctx.fillRect(point.x - 2, point.y - 10, 4, 20);
}

function drawShape(paths) {
  // let a = 360 / paths.length;
  for(let i = 0; i < paths.length; i++) {
    // ctx.strokeStyle = "hsl(" + a * i + ",100%,50%)";
    ctx.stroke(paths[i]);
  }
}

// draw();
setInterval(draw, 30);