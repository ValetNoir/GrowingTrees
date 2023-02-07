const circles = [
  {center: {x: 0, y: 0}, radius: 350},
  {center: {x: 500, y: 5}, radius: 200},
  {center: {x: 300, y: 200}, radius: 300},
  {center: {x: -200, y: -100}, radius: 150},
];

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.translate(1500, 750);

draw();
function draw() {
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