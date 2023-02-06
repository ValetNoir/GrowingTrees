const circles = [
  {center: {x: 0.0, y: 0.0}, radius: 1.2},
  {center: {x: 1.0, y: 0.1}, radius: 1.2},
];

function getIntersectionPoints(c1, c2) {
  // after 5 hours of struggling to solve an equation, used the internet
  // https://www.petercollingridge.co.uk/tutorials/computational-geometry/circle-circle-intersections/

  let dx = c2.center.x - c1.center.x;
  let dy = c2.center.y - c1.center.y;
  const d = Math.sqrt(dx * dx + dy * dy);

  // Circles too far apart
  if (d > c1.radius + c2.radius) { return; }

  // One circle completely inside the other
  if (d < Math.abs(c1.radius - c2.radius)) { return; }

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