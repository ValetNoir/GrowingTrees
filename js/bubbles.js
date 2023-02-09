// with the contributions of pretty much the entire Gabe's server

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

function getIntersectionPoint(line1, line2) {
  // http://paulbourke.net/geometry/pointlineplane/

  // Check if none of the lines are of length 0
	if ((line1.a.x === line1.b.x && line1.a.y === line1.b.y) || (line2.a.x === line2.b.x && line2.a.y === line2.b.y)) {
		return false
	}

	denominator = ((line2.b.y - line2.a.y) * (line1.b.x - line1.a.x) - (line2.b.x - line2.a.x) * (line1.b.y - line1.a.y))

  // Lines are parallel
	if (denominator === 0) {
		return false
	}

	let ua = ((line2.b.x - line2.a.x) * (line1.a.y - line2.a.y) - (line2.b.y - line2.a.y) * (line1.a.x - line2.a.x)) / denominator
	let ub = ((line1.b.x - line1.a.x) * (line1.a.y - line2.a.y) - (line1.b.y - line1.a.y) * (line1.a.x - line2.a.x)) / denominator

  // Is the intersection along the segments
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		return false
	}

  // Return a object with the x and y coordinates of the intersection
	let final = {
    x: line1.a.x + ua * (line1.b.x - line1.a.x),
    y: line1.a.y + ua * (line1.b.y - line1.a.y)
  }

  return final;
}

function bearing(center, target) {
  // https://math.stackexchange.com/questions/1596513/find-the-bearing-angle-between-two-points-in-a-2d-space
  if(center.x == target.x && center.y == target.y) return null;
  let theta = Math.atan2(target.x - center.x, center.y - target.y);
  if(theta < 0.0) theta += TWO_PI;
  return theta - HALF_PI;
}

function intersectLines(lines, lineIndex, center) {
  let current_line = lines[lineIndex];
  for(let i = 0; i < lines.length; i++) {
    if(i == lineIndex) continue;
    let intersection = getIntersectionPoint(current_line, lines[i]);
    if(intersection == false) continue;
    if(isLineAngleAllowed(lines, lineIndex, false)) {current_line.a = intersection; current_line.angle_a = bearing(center, intersection)}
    else if(isLineAngleAllowed(lines, lineIndex, true)) {current_line.b = intersection; current_line.angle_b = bearing(center, intersection)}
    else {console.log("impossible:", current_line)}
  }
  return current_line;
}

function isLineAngleAllowed(lines, lineIndex, isB) {
  let allowed = true;
  let angle = isB? lines[lineIndex].angle_b : lines[lineIndex].angle_a;
  for(let i = 0; i < lines.length; i++) {
    if(i == lineIndex) continue;
    if(lines[i].angle_a > angle && lines[i].angle_b < angle)
      allowed = false;
  }
  return allowed;
}

function bubble(circles, circleIndex) {
  let center = circles[circleIndex].center;
  let radius = circles[circleIndex].radius;
  
  let lines = [];
  let angles = [];
  let paths = [];

  // check intersections between circles
  for(let i = 0; i < circles.length; i++) {
    if(i == circleIndex) continue;
    const points = getIntersectionPoints(circles[circleIndex], circles[i]);
    if(points.length == 2)
      lines.push({
        a: points[0],
        b: points[1],
        angle_a: bearing(center, points[0]),
        angle_b: bearing(center, points[1])
      });
  }

  // let intersectedLines = [];
  // check intersections between lines
  for(let i = 0; i < lines.length; i++) {
    let line = intersectLines(lines, i, center);
    // let line = lines[i];
    angles.push(
      {point: line.a, angle: line.angle_a, id: i, line: true},
      {point: line.b, angle: line.angle_b, id: i, line: false},
    );
  }

  // create draw path
  if(angles.length == 0) {
    let path = new Path2D();
    path.arc(center.x, center.y, radius, 0, TWO_PI);
    paths.push(path);
  }
  else {
    // angles.sort((a, b) => a.angle - b.angle)
    let last = angles.length - 1;
    if(angles[last].id == angles[0].id && angles[last].line) {
      let path = new Path2D();
      path.moveTo(angles[last].point.x, angles[last].point.y);
      path.lineTo(angles[0].point.x, angles[0].point.y);
      paths.push(path);
    }
    else {
      let path = new Path2D();
      path.arc(center.x, center.y, radius, angles[last].angle, angles[0].angle);
      paths.push(path);
    }
    for(let i = 0; i < last; i++) {
      if(angles[i].id == angles[i + 1].id && angles[i].line) {
        let path = new Path2D();
        path.moveTo(angles[i].point.x, angles[i].point.y);
        path.lineTo(angles[i + 1].point.x, angles[i + 1].point.y);
        paths.push(path);
      }
      else {
        let path = new Path2D();
        path.arc(center.x, center.y, radius, angles[i].angle, angles[i + 1].angle);
        paths.push(path);
      }
    }
  }

  return paths;
}