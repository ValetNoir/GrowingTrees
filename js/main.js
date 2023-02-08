const canvas = document.querySelector("canvas");

const SCREEN_WIDTH = canvas.width; // 3000;
const SCREEN_HEIGHT = canvas.height; // 1500;
const HALF_SCREEN_WIDTH = SCREEN_WIDTH / 2;
const HALF_SCREEN_HEIGHT = SCREEN_HEIGHT / 2;

const LITTLE_SQUARE_SIZE = 50;  
const BIG_SQUARE_SIZE = 250;
const AXIS_NUMBER_FREQUENCY = 250;


const myCircles = [
  {center: {x: 0, y: 0}, radius: 300},
  {center: {x: 500, y: 0}, radius: 200},
  {center: {x: 300, y: 200}, radius: 300},
  {center: {x: -200, y: -100}, radius: 150},
];

const ctx = canvas.getContext("2d");
ctx.translate(HALF_SCREEN_WIDTH, HALF_SCREEN_HEIGHT);
ctx.imageSmoothingEnabled = false;

var MOUSE_POS = {x: 0, y: 0};
canvas.addEventListener("mousemove", (e) => {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y

    MOUSE_POS.x = (e.clientX - rect.left) * scaleX - HALF_SCREEN_WIDTH,   // scale mouse coordinates after they have
    MOUSE_POS.y = (e.clientY - rect.top ) * scaleY - HALF_SCREEN_HEIGHT     // been adjusted to be relative to element
})

function draw() {
  clear();
  drawGrid();

  myCircles[0].center = MOUSE_POS;

  ctx.lineWidth = 3;
  ctx.strokeStyle = 'blue';
  for(let i = 0; i < myCircles.length; i++) {
    ctx.stroke((new Bubble(myCircles, i)).path);
  }
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

setInterval(draw, 10);