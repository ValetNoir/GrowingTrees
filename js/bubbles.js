const HALF_PI = Math.PI / 2;
const TWO_PI = 2 * Math.PI;

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
  if(center.x == target.x && center.y == target.y) return null;
  let theta = Math.atan2(target.x - center.x, center.y - target.y);
  if(theta < 0.0) theta += TWO_PI;
  return theta - HALF_PI;
}


class Bubble {
  constructor(circles, circleIndex) {

    this.center = circles[circleIndex].center;
    this.radius = circles[circleIndex].radius;
    
    let angles = [];
    for(let i = 0; i < circles.length; i++) {
      if(i == circleIndex) continue;
      const points = getIntersectionPoints(circles[circleIndex], circles[i]);
      if(points.length == 2) {
        angles.push({point: points[0], angle: bearing(this.center, points[0]), id: i});
        angles.push({point: points[1], angle: bearing(this.center, points[1]), id: i});
      }
    }

    // create draw path

    let final_path = new Path2D();

    if(angles.length == 0) {
      final_path.arc(this.center.x, this.center.y, this.radius, 0, TWO_PI);
    }
    else {
      angles.sort((a, b) => a.angle - b.angle);
      angles.unshift({point: angles[0].point, angle: angles[0].angle, id: -1});
      let last = angles.length-1;
      if(angles[last].id == angles[0].id) {
        final_path.moveTo(angles[last].point.x, angles[last].point.y);
        final_path.lineTo(angles[0].point.x, angles[0].point.y);
      }
      else {
        final_path.arc(this.center.x, this.center.y, this.radius, angles[last].angle, angles[0].angle);
      }
      for(let i = 0; i < last; i++) {
        if(angles[i].id == angles[i+1].id) {
          final_path.moveTo(angles[i].point.x, angles[i].point.y);
          final_path.lineTo(angles[i+1].point.x, angles[i+1].point.y);
        }
        else {
          final_path.arc(this.center.x, this.center.y, this.radius, angles[i].angle, angles[i+1].angle);
        }
      }
    }

    this.path = final_path;
  }
}