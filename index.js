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
// let labelColor = colorHashmap["default"];
// let barColor = colorHashmap["default"];
// let barGap = "2px";
// let valPosition = "start";
// let barChartTitle = "Bar Chart";
// let titleColor = colorHashmap["default"];
// let titleSize = sizeHash["medium"];
let colorWheel = colorChosen.length - 1;
let defaultOptions = {
  labelColor: "default",
  barColor: "default",
  barGap: "small",
  valPosition: "top",
  barChartTitle: "Bar Chart",
  titleColor: "default",
  titleSize: sizeHash["medium"],
  listStackColor: [],
};

$("document").ready(function () {
  // Draw the bar
  $(".bar-data").keyup((e) =>
    drawBarChart(e.target.value, { ...defaultOptions, listStackColor: [] })
  );

  // Change color of the bar
  $(".bar-black").click(() =>
    drawBarChart(drawBarArr, {
      ...defaultOptions,
      barColor: "black",
    })
  );
  $(".bar-pink").click(() =>
    drawBarChart(drawBarArr, {
      ...defaultOptions,
      barColor: "pink",
    })
  );
  $(".bar-blue").click(() =>
    drawBarChart(drawBarArr, {
      ...defaultOptions,
      barColor: "blue",
    })
  );
  $(".bar-default").click(() =>
    drawBarChart(drawBarArr, {
      ...defaultOptions,
      barColor: "default",
    })
  );

  // Change the gap between the bars
  $(".bar-gap-small").click(() =>
    drawBarChart(drawBarArr, {
      ...defaultOptions,
      barGap: "small",
    })
  );
  $(".bar-gap-medium").click(() =>
    drawBarChart(drawBarArr, {
      ...defaultOptions,
      barGap: "medium",
    })
  );
  $(".bar-gap-large").click(() =>
    drawBarChart(drawBarArr, {
      ...defaultOptions,
      barGap: "large",
    })
  );

  // Change the value position within the bars
  $(".bar-position-top").click(() =>
    drawBarChart(drawBarArr, {
      ...defaultOptions,
      valPosition: "top",
    })
  );
  $(".bar-position-center").click(() =>
    drawBarChart(drawBarArr, {
      ...defaultOptions,
      valPosition: "center",
    })
  );
  $(".bar-position-bottom").click(() =>
    drawBarChart(drawBarArr, {
      ...defaultOptions,
      valPosition: "bottom",
    })
  );

  // Change label and colors
  $(".label-black").click(() =>
    drawBarChart(drawBarArr, {
      ...defaultOptions,
      labelColor: "black",
    })
  );
  $(".label-pink").click(() =>
    drawBarChart(drawBarArr, {
      ...defaultOptions,
      labelColor: "pink",
    })
  );
  $(".label-blue").click(() =>
    drawBarChart(drawBarArr, {
      ...defaultOptions,
      labelColor: "blue",
    })
  );
  $(".label-default").click(() =>
    drawBarChart(drawBarArr, {
      ...defaultOptions,
      labelColor: "default",
    })
  );

  // Edit Tile
  $(".title").dblclick(function () {
    $(".title").removeClass("active");
    $(".title-div").addClass("active");
  });

  $(".title-div").keyup(function (e) {
    defaultOptions.barChartTitle =
      e.target.value !== "" ? e.target.value : defaultOptions.barChartTitle;
    if (e.keyCode == 13) {
      $(".title-div").removeClass("active");
      $(".title").text(defaultOptions.barChartTitle).addClass("active");
    }
  });

  $(".title-black").click(() => func4("black"));
  $(".title-pink").click(() => func4("pink"));
  $(".title-blue").click(() => func4("blue"));
  $(".title-default").click(() => func4("default"));
  function func4(color) {
    defaultOptions.titleColor = color;
    $(".input-title").css("color", colorHashmap[defaultOptions.titleColor]);
    $(".title").css("color", colorHashmap[defaultOptions.titleColor]);
    $(".dropbtn-title-color").text(color);
  }

  $(".title-small").click(() => func5("small"));
  $(".title-medium").click(() => func5("medium"));
  $(".title-large").click(() => func5("large"));
  function func5(size) {
    defaultOptions.titleSize = sizeHash[size];
    $(".title").css("font-size", defaultOptions.titleSize);
    $(".dropbtn-title-size").text(size);
  }
});

// Process raw data from user and draw bar chart
function drawBarChart(rawData, options) {
  defaultOptions = options;
  largest = 0;
  drawBarArr = rawData;

  if (rawData.includes("[")) {
    $(".dropdown-bar").css("display", "none");
  } else {
    $(".dropdown-bar").css("display", "block");
  }

  $(".dropbtn-bar").text(options.barColor);
  $(".dropbtn-space").text(options.barGap);
  $(".dropbtn-position").text(options.valPosition);

  // Check if it is a stack bar chart or just a normal bar chart
  if (rawData.includes("[")) {
    let temp = rawData.split("],");
    let sumAllBarData = [];
    let convertedData = [];

    for (const i of temp) {
      let newDataArr = i
        .replace("[", "")
        .replace("]", "")
        .split(",")
        .filter((a) => a !== "");
      newDataArr = newDataArr.map((a) => parseFloat(a));
      defaultOptions.listStackColor.push([
        ...newDataArr.map((a, index) => colorChosen[index]),
      ]);
      sumAllBarData.push(newDataArr.reduce((acc, prev) => acc + prev, 0.0));
      convertedData.push([...newDataArr]);
    }

    //console.log(defaultOptions.listStackColor);

    buildStackedBarChart(convertedData, sumAllBarData);
  } else {
    let ogValArr = rawData.split(",").filter((a) => a !== "");

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
        colorHashmap[defaultOptions.barColor] +
        ";--bar-gap:" +
        gapHashmap[defaultOptions.barGap] +
        ";--bar-text-position:" +
        valuePositionMap[defaultOptions.valPosition] +
        '" ><p class="text-position">' +
        parseFloat(element) +
        "</p></div>"
    );
  });

  buildHorizontalAxis(data.length);
  buildVerticalAxis(colorHashmap[defaultOptions.labelColor]);
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
          defaultOptions.listStackColor[index][i] +
          ";--bar-mini-text-position:" +
          valuePositionMap[defaultOptions.valPosition] +
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
          gapHashmap[defaultOptions.barGap] +
          '">' +
          miniBars +
          "</div>"
      );
    }
  });

  buildHorizontalAxis(data.length);
  buildVerticalAxis(colorHashmap[defaultOptions.labelColor]);
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
        colorHashmap[defaultOptions.labelColor] +
        '">' +
        (i + 1) +
        "</div>"
    );
  }

  $(".x-axis").css("color", colorHashmap[defaultOptions.labelColor]);
  $(".last-row-grid").css(
    "border-top",
    "2px solid " + colorHashmap[defaultOptions.labelColor]
  );
  $(".bottom-right-cell-grid").css(
    "border-top",
    "2px solid " + colorHashmap[defaultOptions.labelColor]
  );
  $(".left-grid").css(
    "border-right",
    "2px solid " + colorHashmap[defaultOptions.labelColor]
  );
  $(".dropbtn-label").text(defaultOptions.labelColor);
}

function changeMiniBarColor(index, i) {
  defaultOptions.listStackColor[index][i] = colorChosen[colorWheel];
  drawBarChart(drawBarArr, defaultOptions);
  colorWheel--;
  colorWheel = colorWheel == -1 ? colorChosen.length - 1 : colorWheel;
}
