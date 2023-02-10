/*
With the contributions of:
- Arkonny
- OmniSudo
- Valor
- Gerk
- Gabe Rundlett
- Saky
- dottedboxguy
- Exsolotus
*/

function log(label, value) {
  console.log(label, " -> ", JSON.parse(JSON.stringify(value)));
}

const HALF_PI = Math.PI / 2;
const TWO_PI = 2 * Math.PI;
var P = [];

function getIntersectionPoints(myCircle, otherCircle) {
  // after 5 hours of struggling to solve an equation, used the internet
  // https://www.petercollingridge.co.uk/tutorials/computational-geometry/circle-circle-intersections/

  let dx = otherCircle.center.x - myCircle.center.x;
  let dy = otherCircle.center.y - myCircle.center.y;
  const d = Math.sqrt(dx * dx + dy * dy);

  // Circles too far apart
  if (d > myCircle.radius + otherCircle.radius) { return false; }

  // One circle completely inside the other
  if (d < Math.abs(myCircle.radius - otherCircle.radius)) { return false; }

  dx /= d;
  dy /= d;

  const a = (myCircle.radius * myCircle.radius - otherCircle.radius * otherCircle.radius + d * d) / (2 * d);
  const px = myCircle.center.x + a * dx;
  const py = myCircle.center.y + a * dy;

  const h = Math.sqrt(myCircle.radius * myCircle.radius - a * a);

  let point1 = {x: px + h * dy, y: py - h * dx};
  let point2 = {x: px - h * dy, y: py + h * dx};
  
  // order the point so we can use them (ESSENTIAL !!!) // apparently not
  
  // A needs to always be at the right of the other circle's center
  let side = directionOfPoint(otherCircle.center, myCircle.center, point1);
  if(side == 1)       {return {a: point1, b: point2};}
  else if(side == -1) {return {a: point2, b: point1};}
  else return false; // would mean that there is only one point of intersection, and I don't want to handle that
}

function directionOfPoint(center, direction, point) {
  // https://www.geeksforgeeks.org/direction-point-line-segment/
  // https://www.youtube.com/watch?v=VMVuKpj_RQQ

  // subtracting co-ordinates of point A
  // from B and P, to make A as origin
  let a = {x: direction.x - center.x, y: direction.y - center.y};
  let b = {x: point.x - center.x, y: point.y - center.y};

  // Determining cross Product
  let cross_product = a.x * b.y - a.y * b.x;

  // Right if positive, Left is negative
  return Math.sign(cross_product);
}

function getIntersectionPoint(line1, line2) {
  // http://paulbourke.net/geometry/pointlineplane/

  // Check if none of the lines are of length 0
	if ((line1.a.x === line1.b.x && line1.a.y === line1.b.y) || (line2.a.x === line2.b.x && line2.a.y === line2.b.y)) {
		return false;
	}

	let denominator = ((line2.b.y - line2.a.y) * (line1.b.x - line1.a.x) - (line2.b.x - line2.a.x) * (line1.b.y - line1.a.y))

  // Lines are parallel
	if (denominator === 0) {
		return false;
	}

	let ua = ((line2.b.x - line2.a.x) * (line1.a.y - line2.a.y) - (line2.b.y - line2.a.y) * (line1.a.x - line2.a.x)) / denominator
	let ub = ((line1.b.x - line1.a.x) * (line1.a.y - line2.a.y) - (line1.b.y - line1.a.y) * (line1.a.x - line2.a.x)) / denominator

  // Is the intersection along the segments
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		return false;
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
  // log("lineIndex", lineIndex);
  let currentLine = JSON.parse(JSON.stringify(lines[lineIndex])); // avoid changing the value inside the array because fuck pointers in javascript
  for(let i = 0; i < lines.length; i++) {
    if(i == lineIndex) continue;
    let intersection = getIntersectionPoint(currentLine, lines[i]);
    // log("currentLine", currentLine);
    // log("lines[i]", lines[i]);
    // log("intersection", intersection);
    if(intersection == false) continue;
    // log("isAngleBetween", isAngleBetween(currentLine.angle_b, lines[i].angle_a, lines[i].angle_b));
    // log("minAngle", lines[i].angle_a);
    // log("angle", currentLine.angle_a);
    // log("maxAngle", lines[i].angle_b);
    if(isAngleBetween(currentLine.angle_b, lines[i].angle_a, lines[i].angle_b)) {currentLine.b = intersection; currentLine.angle_b = bearing(center, intersection)}
    else {currentLine.a = intersection; currentLine.angle_a = bearing(center, intersection)}
  }
  return currentLine;
}

function isLineAllowed(lines, lineIndex) {
  for(let i = 0; i < lines.length; i++) {
    if(i == lineIndex) continue;
    if(
      isAngleBetween(
        lines[lineIndex].angle_a,
        lines[i].angle_a,
        lines[i].angle_b) ||
      isAngleBetween(
        lines[lineIndex].angle_b,
        lines[i].angle_a,
        lines[i].angle_b)
      ) return false;
  }
  return true;
}

function isAngleBetween(angle, min_angle, max_angle) {
  // https://stackoverflow.com/questions/11406189/determine-if-angle-lies-between-2-other-angles

  // check if it passes through zero
  if (min_angle <= max_angle)
    return angle >= min_angle && angle <= max_angle;
  else
    return angle >= min_angle || angle <= max_angle;
}

function bubble(circles, circleIndex) {
  let center = circles[circleIndex].center;
  let radius = circles[circleIndex].radius;
  
  let lines = [];
  let intersectedLines = [];
  let points = [];
  let paths = [];

  // check intersections between circles
  for(let i = 0; i < circles.length; i++) {
    if(i == circleIndex) continue;
    const line = getIntersectionPoints(circles[circleIndex], circles[i]);
    if(line != false)
      lines.push({
        a: line.a,
        b: line.b,
        angle_a: bearing(center, line.a),
        angle_b: bearing(center, line.b)
      });
  }

  // check intersections between lines
  // log("circleIndex", circleIndex);
  // log("circleCenter", center);
  // log("lines", lines);
  for(let i = 0; i < lines.length; i++) {
    // console.log("\n");
    let line = intersectLines(lines, i, center);
    intersectedLines.push(line);
    // if(!isLineAllowed(lines, i)) continue;
    points.push(
      {x: line.a.x, y: line.a.y, angle: line.angle_a, lineId: i, pointId: "A"},
      {x: line.b.x, y: line.b.y, angle: line.angle_b, lineId: i, pointId: "B"}
    );
    // P.push(
    //   {point: line.a, index: circleIndex},
    //   {point: line.b, index: circleIndex}
    // )
  }

  // create draw path
  if(points.length == 0) {
    let path = new Path2D();
    path.arc(center.x, center.y, radius, 0, TWO_PI);
    paths.push(path);
  }
  else {
    // Arkonny's idea
    points.sort((a, b) => a.angle - b.angle)
    // log("points", points)
    let i = 0;
    let done = {};
    while(true) {
      // Valet's algorithm
      let wantedLineId = points[i].lineId;
      if(done[wantedLineId]) break;
      let aIndex = points.findIndex((element) => element.lineId == wantedLineId && element.pointId == "A");
      let bIndex = points.findIndex((element) => element.lineId == wantedLineId && element.pointId == "B");

      // draw line
      let path = new Path2D();
      path.moveTo(points[aIndex].x, points[aIndex].y);
      path.lineTo(points[bIndex].x, points[bIndex].y);
      paths.push(path);

      // draw arc to the new line
      path = new Path2D();
      let nextIndex = bIndex + 1 == points.length? 0 : bIndex + 1;
      path.arc(center.x, center.y, radius, points[bIndex].angle, points[points.findIndex((element) => element.lineId == points[nextIndex].lineId && element.pointId == "A")].angle);
      paths.push(path);

      done[wantedLineId] = true;
      i = nextIndex;
    }

    
    // let last = intersectedLines.length - 1;
    // for(let i = 0; i < last; i++) {
    //   // draw line
    //   let path = new Path2D();
    //   path.moveTo(intersectedLines[i].a.x, intersectedLines[i].a.y);
    //   path.lineTo(intersectedLines[i].b.x, intersectedLines[i].b.y);
    //   paths.push(path);

    //   // draw arc to the new line
    //   path = new Path2D();
    //   path.arc(center.x, center.y, radius, intersectedLines[i].angle_b, intersectedLines[i + 1].angle_a);
    //   paths.push(path);
    // }
    // // draw line
    // let path = new Path2D();
    // path.moveTo(intersectedLines[last].a.x, intersectedLines[last].a.y);
    // path.lineTo(intersectedLines[last].b.x, intersectedLines[last].b.y);
    // paths.push(path);

    // // draw arc to the new line
    // path = new Path2D();
    // path.arc(center.x, center.y, radius, intersectedLines[last].angle_b, intersectedLines[0].angle_a);
    // paths.push(path);
  }

  return paths;
}