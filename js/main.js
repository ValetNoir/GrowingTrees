const HALF_SCREEN_WIDTH = 1500;
const HALF_SCREEN_HEIGHT = 750;
const circles = [
  {center: {x: 0, y: 0}, radius: 350},
  {center: {x: 500, y: 0}, radius: 200},
  {center: {x: 300, y: 200}, radius: 300},
  {center: {x: -200, y: -100}, radius: 150},
];

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.translate(HALF_SCREEN_WIDTH, HALF_SCREEN_HEIGHT);
ctx.imageSmoothingEnabled = false;

draw();
function draw() {
  drawGrid();

  ctx.lineWidth = 3;
  for(let i = 0; i < circles.length; i++) {
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.arc(circles[i].center.x, circles[i].center.y, circles[i].radius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = 'blue';
    for(let j = 0; j < circles.length; j++) {
      const points = getIntersectionPoints(circles[i], circles[j]);
      let l = points.length;
      if(l == 0) continue;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for(let i2 = 1; i2 < points.length; i2++) {
        ctx.lineTo(points[i2].x, points[i2].y);
      }
      ctx.stroke();
    }
  }
}

function drawGrid() {

  
  // little grid
  const LITTLE_SQUARE_SIZE = 50;

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
  const BIG_SQUARE_SIZE = 250;

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

  const AXIS_NUMBER_FREQUENCY = 100;
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