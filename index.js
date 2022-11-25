$("document").ready(function () {
  let drawBarArr = [];

  // Change color of the bar
  let colorHashmap = {
    black: "#000000",
    pink: "#ca80ff",
    blue: "#474aff",
    default: "#739600",
  };
  let barColor = colorHashmap["default"];

  $(".bar-black").click(() => func1("black"));
  $(".bar-pink").click(() => func1("pink"));
  $(".bar-blue").click(() => func1("blue"));
  $(".bar-default").click(() => func1("default"));

  function func1(color) {
    barColor = colorHashmap[color];
    drawBarChart(drawBarArr);
  }

  // Change the gap between the bars
  let gapHashmap = {
    small: "2px",
    medium: "6px",
    large: "10px",
  };
  let barGap = "2px";

  $(".bar-gap-small").click(() => func2("small"));
  $(".bar-gap-medium").click(() => func2("medium"));
  $(".bar-gap-large").click(() => func2("large"));

  function func2(gap) {
    barGap = gapHashmap[gap];
    drawBarChart(drawBarArr);
  }

  // Change the value position within the bars
  let valuePositionMap = {
    top: "start",
    center: "center",
    bottom: "end",
  };
  let valPosition = "start";

  $(".bar-position-top").click(() => func3("top"));
  $(".bar-position-center").click(() => func3("center"));
  $(".bar-position-bottom").click(() => func3("bottom"));

  function func3(pos) {
    valPosition = valuePositionMap[pos];
    drawBarChart(drawBarArr);
  }

  // Draw the bar
  $(".bar-data").keyup((e) => drawBarChart(e.target.value));

  const drawBarChart = function (event) {
    drawBarArr = event;
    let ogValArr = event.split(",");
    let sum = 0;
    let largest = 0;

    // Resize bars by finding the largest number in the array and finding total sum
    for (let i = 0; i < ogValArr.length; i++) {
      let newVal = parseFloat(ogValArr[i]);
      sum += newVal;
      if (largest < newVal) {
        largest = newVal;
      }
    }

    // Empty all child of grid
    $(".cols-container").empty();
    $(".last-row-grid").empty();

    // Drawing the bar at the right size
    ogValArr.forEach((element, index) => {
      if (element !== "") {
        $(".cols-container").append(
          '<div class="bar" style="--bar-value:' +
            ((parseFloat(element) * 90) / largest).toString() +
            "%;--bar-color:" +
            barColor +
            ";--bar-gap:" +
            barGap +
            ";--bar-text-position:" +
            valPosition +
            '" ><p class="text-position">' +
            parseFloat(element) +
            "</p></div>"
        );
        $(".last-row-grid").append(
          '<div class="x-axis">' + (index + 1) + "</div>"
        );
      }
    });
  };
});
