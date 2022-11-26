let colorChosen = [
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

$("document").ready(function () {
  let drawBarArr = [];

  let colorHashmap = {
    black: "#000000",
    pink: "#ca80ff",
    blue: "#474aff",
    default: "#739600",
  };
  let labelColor = colorHashmap["default"];
  let largest = 0;

  // Change color of the bar
  let barColor = colorHashmap["default"];

  $(".bar-black").click(() => func1("black"));
  $(".bar-pink").click(() => func1("pink"));
  $(".bar-blue").click(() => func1("blue"));
  $(".bar-default").click(() => func1("default"));

  function func1(color) {
    barColor = colorHashmap[color];
    // $(".dropbtn-bar").css("background-color", colorHashmap[color]);
    $(".dropbtn-bar").text(color);
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
    $(".dropbtn-space").text(gap);
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
    $(".dropbtn-position").text(pos);
    drawBarChart(drawBarArr);
  }

  // Edit Tile
  const sizeHash = {
    small: "2rem",
    medium: "2.4rem",
    large: "2.7rem",
  };
  let barChartTitle = "Bar Chart";
  let titleColor = colorHashmap["default"];
  let titleSize = sizeHash["medium"];
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
    // $(".dropbtn-title-color").css("background-color", colorHashmap[color]);
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

  // Draw the bar
  $(".bar-data").keyup((e) => drawBarChart(e.target.value));

  const drawBarChart = function (event) {
    if (event === "") largest = 0;
    drawBarArr = event;
    if (event.includes("[")) {
      let temp = event.split("],");

      let sumAllBarData = [];
      let convertedData = [];
      for (const i of temp) {
        let newDataArr = i
          .replace("[", "")
          .replace("]", "")
          .split(",")
          .map((a) => parseFloat(a));
        sumAllBarData.push(newDataArr.reduce((acc, prev) => acc + prev, 0.0));
        convertedData.push([...newDataArr]);
      }

      // Resize bars by finding the largest number in the array and finding total sum
      for (let i = 0; i < sumAllBarData.length; i++) {
        let newVal = parseFloat(sumAllBarData[i]);
        if (largest < newVal) {
          largest = newVal;
        }
      }

      // Empty all child of grid
      $(".cols-container").empty();
      $(".last-row-grid").empty();

      // Drawing the bar at the right size
      convertedData.forEach((elements, index) => {
        console.log(elements);
        if (elements !== "" && elements !== []) {
          let miniBars = "";
          for (let i = 0; i < elements.length; i++) {
            //console.log(element);
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
          console.log(miniBars);
          $(".cols-container").append(
            '<div class="bar-container">' + miniBars + "</div>"
          );
          $(".last-row-grid").append(
            '<div class="x-axis">' + (index + 1) + "</div>"
          );
        }
      });

      builtVerticalAxis(labelColor);
    } else {
      let ogValArr = event.split(",");

      // Resize bars by finding the largest number in the array and finding total sum
      for (let i = 0; i < ogValArr.length; i++) {
        let newVal = parseFloat(ogValArr[i]);
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
          $(".last-row-grid").append(
            '<div class="x-axis">' + (index + 1) + "</div>"
          );
        }
      });

      builtVerticalAxis(labelColor);
    }
  };

  function builtVerticalAxis(color) {
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
    // $(".dropbtn-label").css("background-color", colorHashmap[color]);
    $(".dropbtn-label").text(color);
    builtVerticalAxis(labelColor);
  }
});
let colorWheel = colorChosen.length - 1;
function changeMiniBarColor(index, i) {
  let stringQuery = ".element-" + index + "-" + i;
  $(stringQuery).css("background-color", colorChosen[colorWheel]);
  colorWheel--;
  colorWheel = colorWheel == -1 ? colorChosen.length - 1 : colorWheel;
}
