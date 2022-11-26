const colorChosen = [
  "#FFBF00",
  "#FF7F50",
  "#DE3163",
  "#9FE2BF",
  "#40E0D0",
  "#6495ED",
  "#CCCCFF",
  "#800000",
  "#F4A460",
  "#B8860B",
  "#32CD32",
  "#20B2AA",
  "#0000CD",
  "#9400D3",
  "#FFDEAD",
  "#F0E68C",
  "#808080",
  "#FFB6C1",
  "#7FFFD4",
];
const colorHashmap = {
  black: "#000000",
  pink: "#ca80ff",
  blue: "#474aff",
  default: "#739600",
};
const gapHashmap = {
  small: "2px",
  medium: "6px",
  large: "10px",
};
const valuePositionMap = {
  top: "start",
  center: "center",
  bottom: "end",
};
const sizeHash = {
  small: "2rem",
  medium: "2.4rem",
  large: "2.7rem",
};

let drawBarArr = [];
let largest = 0;
let labelColor = colorHashmap["default"];
let barColor = colorHashmap["default"];
let barGap = "2px";
let valPosition = "start";
let barChartTitle = "Bar Chart";
let titleColor = colorHashmap["default"];
let titleSize = sizeHash["medium"];
let colorWheel = colorChosen.length - 1;

$("document").ready(function () {
  // Draw the bar
  $(".bar-data").keyup((e) => drawBarChart(e.target.value));

  // Change color of the bar
  $(".bar-black").click(() => func1("black"));
  $(".bar-pink").click(() => func1("pink"));
  $(".bar-blue").click(() => func1("blue"));
  $(".bar-default").click(() => func1("default"));
  function func1(color) {
    barColor = colorHashmap[color];
    $(".dropbtn-bar").text(color);
    drawBarChart(drawBarArr);
  }

  // Change the gap between the bars
  $(".bar-gap-small").click(() => func2("small"));
  $(".bar-gap-medium").click(() => func2("medium"));
  $(".bar-gap-large").click(() => func2("large"));
  function func2(gap) {
    barGap = gapHashmap[gap];
    $(".dropbtn-space").text(gap);
    drawBarChart(drawBarArr);
  }

  // Change the value position within the bars
  $(".bar-position-top").click(() => func3("top"));
  $(".bar-position-center").click(() => func3("center"));
  $(".bar-position-bottom").click(() => func3("bottom"));
  function func3(pos) {
    valPosition = valuePositionMap[pos];
    $(".dropbtn-position").text(pos);
    drawBarChart(drawBarArr);
  }

  // Edit Tile
  $(".title").dblclick(function () {
    $(".title").removeClass("active");
    $(".title-div").addClass("active");
  });

  $(".title-div").keyup(function (e) {
    barChartTitle = e.target.value !== "" ? e.target.value : barChartTitle;
    if (e.keyCode == 13) {
      $(".title-div").removeClass("active");
      $(".title").text(barChartTitle).addClass("active");
    }
  });

  $(".title-black").click(() => func4("black"));
  $(".title-pink").click(() => func4("pink"));
  $(".title-blue").click(() => func4("blue"));
  $(".title-default").click(() => func4("default"));
  function func4(color) {
    titleColor = colorHashmap[color];
    $(".input-title").css("color", titleColor);
    $(".title").css("color", titleColor);
    $(".dropbtn-title-color").text(color);
  }

  $(".title-small").click(() => func5("small"));
  $(".title-medium").click(() => func5("medium"));
  $(".title-large").click(() => func5("large"));
  function func5(size) {
    titleSize = sizeHash[size];
    $(".input-title").css("font-size", titleSize);
    $(".title").css("font-size", titleSize);
    $(".dropbtn-title-size").text(size);
  }

  // Change label and colors
  $(".label-black").click(() => func6("black"));
  $(".label-pink").click(() => func6("pink"));
  $(".label-blue").click(() => func6("blue"));
  $(".label-default").click(() => func6("default"));
  function func6(color) {
    labelColor = colorHashmap[color];
    $(".x-axis").css("color", labelColor);
    $(".last-row-grid").css("border-top", "2px solid " + labelColor);
    $(".bottom-right-cell-grid").css("border-top", "2px solid " + labelColor);
    $(".left-grid").css("border-right", "2px solid " + labelColor);
    $(".dropbtn-label").text(color);
    buildVerticalAxis(labelColor);
  }
});

// Process raw data from user and draw bar chart
function drawBarChart(event) {
  largest = 0;
  drawBarArr = event;

  // Check if it is a stack bar chart or just a normal bar chart
  if (event.includes("[")) {
    let temp = event.split("],");
    let sumAllBarData = [];
    let convertedData = [];

    for (const i of temp) {
      let newDataArr = i
        .replace("[", "")
        .replace("]", "")
        .split(",")
        .filter((a) => a !== "")
        .map((a) => parseFloat(a));
      sumAllBarData.push(newDataArr.reduce((acc, prev) => acc + prev, 0.0));
      convertedData.push([...newDataArr]);
    }

    buildStackedBarChart(convertedData, sumAllBarData);
  } else {
    let ogValArr = event.split(",").filter((a) => a !== "");

    buildSingleBarChart(ogValArr);
  }
}

// Finding the largest value in the column/bar
function setLargestValue(values) {
  for (let i = 0; i < values.length; i++) {
    let newVal = parseFloat(values[i]);
    if (largest < newVal) {
      largest = newVal;
    }
  }
}

// Build single bar chart
function buildSingleBarChart(data) {
  setLargestValue(data);

  // Empty all child of grid
  $(".cols-container").empty();

  // Drawing the bar at the right size
  data.forEach((element) => {
    $(".cols-container").append(
      '<div class="bar" style="--bar-value:' +
        ((parseFloat(element) * 90 - 7) / largest).toString() +
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
  });

  buildHorizontalAxis(data.length);
  buildVerticalAxis(labelColor);
}

// Build stacked bar chart
function buildStackedBarChart(data, sumAllBarData) {
  setLargestValue(sumAllBarData);

  // Empty all child of grid
  $(".cols-container").empty();

  // Drawing the stack bar at the right size
  data.forEach((elements, index) => {
    if (elements !== [] && elements[0] !== "") {
      let miniBars = "";
      for (let i = 0; i < elements.length; i++) {
        miniBars +=
          '<div class="mini-bar element-' +
          index +
          "-" +
          i +
          '" style="--bar-mini-value:' +
          (
            (parseFloat(elements[i]) * 90 - 7 / elements.length) /
            largest
          ).toString() +
          "%;--bar-mini-color:" +
          colorChosen[i] +
          ";--bar-mini-text-position:" +
          valPosition +
          '" ondblclick="changeMiniBarColor(' +
          index +
          "," +
          i +
          ')"><p class="text-position">' +
          parseFloat(elements[i]) +
          "</p></div>";
      }

      $(".cols-container").append(
        '<div class="bar-container" style="--bar-mini-gap:' +
          barGap +
          '">' +
          miniBars +
          "</div>"
      );
    }
  });

  buildHorizontalAxis(data.length);
  buildVerticalAxis(labelColor);
}

// Build y-axis
function buildVerticalAxis(color) {
  $(".inner-left-grid").empty();
  const largestTickMark = (100 * largest) / 90;
  for (let i = 5; i >= 1; i--) {
    $(".inner-left-grid").append(
      '<div class="unit" style="--color-tick-mark:' +
        color +
        '">' +
        ((i * largestTickMark) / 5).toFixed(1) +
        "</div>"
    );
  }
}

// Build x-axis
function buildHorizontalAxis(numberIndexes) {
  $(".last-row-grid").empty();
  for (let i = 0; i < numberIndexes; i++) {
    $(".last-row-grid").append(
      '<div class="x-axis" style="--x-axis-color:' +
        labelColor +
        '">' +
        (i + 1) +
        "</div>"
    );
  }
}

function changeMiniBarColor(index, i) {
  let stringQuery = ".element-" + index + "-" + i;
  $(stringQuery).css("background-color", colorChosen[colorWheel]);
  colorWheel--;
  colorWheel = colorWheel == -1 ? colorChosen.length - 1 : colorWheel;
}
