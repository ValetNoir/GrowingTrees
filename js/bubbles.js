function getIntersectionPoints(c1, c2) {
  // after 5 hours of struggling to solve an equation, used the internet
  // https://www.petercollingridge.co.uk/tutorials/computational-geometry/circle-circle-intersections/

  let dx = c2.center.x - c1.center.x;
  let dy = c2.center.y - c1.center.y;
  const d = Math.sqrt(dx * dx + dy * dy);

  // Circles too far apart
  if (d > c1.radius + c2.radius) { return []; }

  // One circle completely inside the other
  if (d < Math.abs(c1.radius - c2.radius)) { return []; }

  dx /= d;
  dy /= d;

  const a = (c1.radius * c1.radius - c2.radius * c2.radius + d * d) / (2 * d);
  const px = c1.center.x + a * dx;
  const py = c1.center.y + a * dy;

  const h = Math.sqrt(c1.radius * c1.radius - a * a);

  return [
    {
      x: px + h * dy,
      y: py - h * dx
    },
    {
      x: px - h * dy,
      y: py + h * dx
    }
  ];
}

function bearing(center, target) {
  // https://math.stackexchange.com/questions/1596513/find-the-bearing-angle-between-two-points-in-a-2d-space
  const TWO_PI = 2 * Math.PI;
  if(center.x == target.x && center.y == target.y) return null;
  let theta = Math.atan2(target.x - center.x, center.y - target.y);
  if(theta < 0.0) theta += TWO_PI;
  return theta;
}


class Bubble {
  constructor(circles, circleIndex) {
    const HALF_PI = Math.PI / 2;

    this.center = circles[circleIndex].center;
    this.radius = circles[circleIndex].radius;
    
    let final_lines = [];
    for(let i = 0; i < circles.length; i++) {
      if(i == circleIndex) continue;
      const points = getIntersectionPoints(circles[circleIndex], circles[i]);
      if(points.length != 2) continue;
      final_lines.push({a: points[0], b: points[1]});
    }

    this.lines = final_lines;

    // create draw path

    let final_path = new Path2D();

    for(let i = 0; i < this.lines.length; i++) {
      final_path.arc(this.center.x, this.center.y, this.radius, bearing(this.center, this.lines[i].b) - HALF_PI, bearing(this.center, this.lines[i].a) - HALF_PI, false);
      final_path.moveTo(this.lines[i].a.x, this.lines[i].a.y);
      final_path.lineTo(this.lines[i].b.x, this.lines[i].b.y);
    }

    this.path = final_path;
  }
}