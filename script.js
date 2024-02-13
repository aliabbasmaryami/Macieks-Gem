const $card = document.querySelector(".card");

/**
 * return a value that has been rounded to a set precision
 * @param {Number} value the value to round
 * @param {Number} precision the precision (decimal places), default: 3
 * @returns {Number}
 */
const round = (value, precision = 3) => parseFloat(value.toFixed(precision));

/**
 * return a value that has been limited between min & max
 * @param {Number} value the value to clamp
 * @param {Number} min minimum value to allow, default: 0
 * @param {Number} max maximum value to allow, default: 100
 * @returns {Number}
 */
const clamp = (value, min = 0, max = 100) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * return a value that has been re-mapped according to the from/to
 * - for example, adjust(10, 0, 100, 100, 0) = 90
 * @param {Number} value the value to re-map (or adjust)
 * @param {Number} fromMin min value to re-map from
 * @param {Number} fromMax max value to re-map from
 * @param {Number} toMin min value to re-map to
 * @param {Number} toMax max value to re-map to
 * @returns {Number}
 */
const adjust = (value, fromMin, fromMax, toMin, toMax) => {
  return round(
    toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin)
  );
};

const cardUpdate = (e) => {
  // normalise touch/mouse
  var pos = [e.clientX, e.clientY];
  e.preventDefault();
  if (e.type === "touchmove") {
    pos = [e.touches[0].clientX, e.touches[0].clientY];
  }
  var dimensions = $card.getBoundingClientRect();
  var l = pos[0] - dimensions.left;
  var t = pos[1] - dimensions.top;
  var h = dimensions.height;
  var w = dimensions.width;
  var px = clamp(Math.abs((100 / w) * l), 0, 100);
  var py = clamp(Math.abs((100 / h) * t), 0, 100);

  $card.setAttribute(
    "style",
    `
      --pointer-x: ${px}%;
      --pointer-y: ${py}%;
    `
  );
};

$card.addEventListener("mousemove", cardUpdate);
$card.addEventListener("touchmove", cardUpdate);
