(function () {
  d3.queue()
    .defer(d3.json, "india.json")
    .defer(d3.csv, "2017data.csv")
    .defer(d3.csv, "2013data.csv")
    .defer(d3.csv, "postmonsoon.csv")
    .defer(d3.csv, "premonsoon.csv")
    .defer(d3.csv, "statedata2017.csv")
    .defer(d3.csv, "districtdata2017.csv")
    .await(function (
      error,
      topoMap,
      data2017,
      data2013,
      postmonsoon,
      premonsoon,
      statedata2017,
      districtdata2017
    ) {
      if (error) throw error;

      var karnatakadata = data2017.filter(
        (element) => element["Name of State"] === "KARNATAKA"
      );
      var karnatakadata13 = data2013.filter(
        (element) => element["Name of State"] === "KARNATAKA"
      );
      var tamilnadudata = data2017.filter(
        (element) => element["Name of State"] === "TAMILNADU"
      );
      var tamilnadudata13 = data2013.filter(
        (element) => element["Name of State"] === "TAMILNADU"
      );
      var keraladata = data2017.filter(
        (element) => element["Name of State"] === "KERALA"
      );
      var keraladata13 = data2013.filter(
        (element) => element["Name of State"] === "KERALA"
      );
      var goadata = data2017.filter(
        (element) => element["Name of State"] === "GOA"
      );
      var goadata13 = data2013.filter(
        (element) => element["Name of State"] === "GOA"
      );
      var andhrapradeshdata = data2017.filter(
        (element) => element["Name of State"] === "ANDHRA PRADESH"
      );
      var andhrapradeshdata13 = data2013.filter(
        (element) => element["Name of State"] === "ANDHRA PRADESH"
      );

      
      localStorage.setItem("andhrapradeshdata13", JSON.stringify(andhrapradeshdata13));
      localStorage.setItem("andhrapradeshdata", JSON.stringify(andhrapradeshdata));
      localStorage.setItem("goadata", JSON.stringify(goadata));
      localStorage.setItem("goadata13", JSON.stringify(goadata13));
      localStorage.setItem("keraladata", JSON.stringify(keraladata));
      localStorage.setItem("keraladata13", JSON.stringify(keraladata13));
      localStorage.setItem("data2017", JSON.stringify(data2017));
      localStorage.setItem("data2013", JSON.stringify(data2013));
      localStorage.setItem("tamilnadudata13", JSON.stringify(tamilnadudata13));
      localStorage.setItem("karnatakadata13", JSON.stringify(karnatakadata13));
      localStorage.setItem("tamilnadudata", JSON.stringify(tamilnadudata));
      localStorage.setItem("karnatakadata", JSON.stringify(karnatakadata));
      localStorage.setItem("postmonsoon", JSON.stringify(postmonsoon));
      localStorage.setItem("premonsoon", JSON.stringify(premonsoon));

      data2017And2013Creator(
        data2017,
        data2013,
        statedata2017,
        districtdata2017
      );

      var states = topojson.feature(
        topoMap,
        topoMap.objects.states
        // topoMap.objects.india
      );

      var districts = topojson.feature(
        topoMap,
        topoMap.objects.districts
        // topoMap.objects.india
      );

      console.log(states);
      console.log(districts);

      // Map render
      var map = stateMap(states.features).width(800).height(700).scale(1200);
      var mapdist = districtMap(districts.features)
        .width(800)
        .height(700)
        .scale(1200);
      d3.select("#map").call(map);
      d3.select("#map-dist").call(mapdist);
    });
})();

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function getSum(total, num) {
  return total + Math.round(num);
}

let selected2017statedata = {};
let allstate2017data = {};
let alldist2017data = {};
let allstate2013data = {};
let groundWater2017 = 0;
let groundWater2013 = 0;
let extractWater2017 = 0;
let extractWater2013 = 0;
let extractPercent2017 = 0;
let extractPercent2013 = 0;
function data2017And2013Creator(
  data2017,
  data2013,
  statedata2017,
  districtdata2017
) {
  allstate2017data = groupBy(data2017, "Name of State");
  alldist2017data = groupBy(data2017, "Name of District");
  allstate2013data = groupBy(data2013, "Name of State");
  onlystate2017data = groupBy(statedata2017, "State");
  onlydistrict2017data = groupBy(districtdata2017, "District");
}

function select2017statedata(statename) {
  console.log(allstate2017data);
  console.log(statename);
  groundWater2017 = allstate2017data[statename.toUpperCase()].sum(
    "Total Annual Ground Water Recharge(Ham)"
  );
  extractWater2017 = allstate2017data[statename.toUpperCase()].sum(
    "Total Current Annual Ground Water Extraction(Ham)"
  );
  extractPercent2017 =
    allstate2017data[statename.toUpperCase()].sum(
      "Stage of Ground Water Development (%)"
    ) / allstate2017data[statename.toUpperCase()].length;

  groundWater2013 = allstate2013data[statename.toUpperCase()].sum(
    "Total Annual Ground Water Recharge(Ham)"
  );
  extractWater2013 = allstate2013data[statename.toUpperCase()].sum(
    "Total Current Annual Ground Water Extraction(Ham)"
  );
  extractPercent2013 =
    allstate2013data[statename.toUpperCase()].sum(
      "Stage of Ground Water Development (%)"
    ) / allstate2013data[statename.toUpperCase()].length;

  groundWaterChart(groundWater2013, groundWater2017, statename.toUpperCase());
  extractWaterChart(
    extractWater2013,
    extractWater2017,
    statename.toUpperCase()
  );
  extractPercentChart(
    extractPercent2013,
    extractPercent2017,
    statename.toUpperCase()
  );
}

function groundWaterChart(groundWater2013, groundWater2017, statename) {
  chart = new Highcharts.Chart({
    chart: {
      renderTo: "groundWaterdonut",
      type: "pie",
    },
    title: {
      text: statename + " Total Annual Ground Water Recharge(Ham)",
    },
    exporting: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    yAxis: {
      title: {
        text: "Total percent market share",
      },
    },
    plotOptions: {
      pie: {
        shadow: false,
      },
    },
    tooltip: {
      formatter: function () {
        return "<b>" + this.point.name + "</b>: " + this.y;
      },
    },
    series: [
      {
        name: "Browsers",
        data: [
          ["2013", groundWater2013],
          ["2017", groundWater2017],
        ],
        size: "100%",
        innerSize: "60%",
        showInLegend: true,
        dataLabels: {
          enabled: false,
        },
      },
    ],
  });
}

function extractWaterChart(extractWater2013, extractWater2017, statename) {
  chart = new Highcharts.Chart({
    chart: {
      renderTo: "extractWaterdonut",
      type: "pie",
    },
    title: {
      text: statename + " Total Current Annual Ground Water Extraction(Ham)",
    },
    exporting: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    yAxis: {
      title: {
        text: "Total percent market share",
      },
    },
    plotOptions: {
      pie: {
        shadow: false,
      },
    },
    tooltip: {
      formatter: function () {
        return "<b>" + this.point.name + "</b>: " + this.y;
      },
    },
    series: [
      {
        name: "Browsers",
        data: [
          ["2013", extractWater2013],
          ["2017", extractWater2017],
        ],
        size: "100%",
        innerSize: "60%",
        showInLegend: true,
        dataLabels: {
          enabled: false,
        },
      },
    ],
  });
}

function extractPercentChart(
  extractPercent2013,
  extractPercent2017,
  statename
) {
  chart = new Highcharts.Chart({
    chart: {
      renderTo: "extractPercentdonut",
      type: "pie",
    },
    title: {
      text: statename + " Stage of Ground Water Development (%)",
    },
    exporting: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    yAxis: {
      title: {
        text: "Total percent market share",
      },
    },
    plotOptions: {
      pie: {
        shadow: false,
      },
    },
    tooltip: {
      formatter: function () {
        return "<b>" + this.point.name + "</b>: " + this.y;
      },
    },
    series: [
      {
        name: "Browsers",
        data: [
          ["2013", extractPercent2013],
          ["2017", extractPercent2017],
        ],
        size: "100%",
        innerSize: "60%",
        showInLegend: true,
        dataLabels: {
          enabled: false,
        },
      },
    ],
  });
}

Array.prototype.sum = function (prop) {
  var total = 0;
  for (var i = 0, _len = this.length; i < _len; i++) {
    total += parseInt(this[i][prop]);
  }
  return total;
};

function stateMap(states) {
  var width = 800,
    height = 700,
    scale = 1200;
  var color = ["#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3"];

  // Define the div for the tooltip
  var div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  function render(selection) {
    selection.each(function () {
      d3.select(this).select("svg").remove();
      var svg = d3
        .select(this)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      var projection = d3.geo
        .mercator()
        .center([83, 23])
        .scale(scale)
        .translate([width / 2, height / 2]);

      var path = d3.geo.path().projection(projection);
      var selectState = svg
        .selectAll("g")
        .data(states)
        .enter()
        .append("g")
        .attr("class", "state");

      selectState
        .append("path")
        .style("fill", function (d) {
          renderStatesStats();
          return paintState(d.properties.st_nm.toUpperCase());
        })
        .style("stroke", function (d) {
          return "#ffffff";
        })
        .style("stroke-width", function (d) {
          return "1.5px";
        })
        .attr("d", path)
        .on("mousedown", function (d) {
          const url = d.properties.st_nm.toLowerCase().split(" ").join("");
          // alert(url)
          window.location = `/${url}.html`;
          //alert(d..properties.st_nm);
          console.log(d);
        })
        .on("mouseover", function (d) {
          //   document.querySelector(".stats").innerHTML = `
          //   <ul>
          //   <li>Name: ${d.properties.st_nm}</li>
          //   <li>Population: ${d.properties.population}</li>
          //   <li>Area: ${d.properties.area}</li>
          // </ul>
          //   `;
          console.log(d3.event.pageY);
          console.log(d);
          select2017statedata(d.properties.st_nm);
          div.transition().duration(200).style("opacity", 0.9).style('z-index', 100)
          div
            .html(d.properties.st_nm + "<br/> Stage of Ground Water Development (%):" + onlystate2017data[d.properties.st_nm.toUpperCase()][0]["Stage of Ground Water Development (%)"])
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 28 + "px");
        })
        .on("mouseout", function (d) {
          div.transition().duration(500).style("opacity", 0);
        });

      svg
        .selectAll("text")
        .data(states)
        .enter()
        .append("text")
        .attr("class", function (d) {
          return "label " + d.id;
        })
        .attr("transform", function (d) {
          return "translate(" + path.centroid(d) + ")";
        })
        .attr("dy", ".35em");
      // .text(function (d) {
      //   return d.properties.st_nm;
      // });
    });
  } // render
  render.height = function (value) {
    if (!arguments.length) return height;
    height = value;
    return render;
  };
  render.width = function (value) {
    if (!arguments.length) return width;
    width = value;
    return render;
  };
  render.scale = function (value) {
    if (!arguments.length) return scale;
    scale = value;
    return render;
  };

  return render;
}

function districtMap(states) {
  var width = 800,
    height = 700,
    scale = 1200;

  // Define the div for the tooltip
  var div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  function render(selection) {
    selection.each(function () {
      d3.select(this).select("svg").remove();
      var svg = d3
        .select(this)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      var projection = d3.geo
        .mercator()
        .center([83, 23])
        .scale(scale)
        .translate([width / 2, height / 2]);

      var path = d3.geo.path().projection(projection);
      var selectState = svg
        .selectAll("g")
        .data(states)
        .enter()
        .append("g")
        .attr("class", "state");

      selectState
        .append("path")
        .style("fill", function (d) {
          renderDistStats();
          return paintDistrict(d.properties.district);
        })
        .style("stroke", function (d) {
          return "rgba(255,255,255,.5)";
        })
        .style("stroke-width", function (d) {
          return "1px";
        })
        .attr("d", path)
        .on("mousedown", function (d) {
          const url = d.properties.st_nm.toLowerCase().split(" ").join("");
          // alert(url)
          window.location = `./${url}.html`;
          //alert(d..properties.st_nm);
          console.log(d);
        })
        .on("mouseover", function (d) {
          //   document.querySelector(".stats").innerHTML = `
          //   <ul>
          //   <li>Name: ${d.properties.st_nm}</li>
          //   <li>Population: ${d.properties.population}</li>
          //   <li>Area: ${d.properties.area}</li>
          // </ul>
          //   `;
          console.log(d3.event.pageY);
          console.log('OVERING',d);
          select2017statedata(d.properties.st_nm);
          console.log()

          div.transition().duration(200).style("opacity", 1).style('z-index', 100)
          div
            .html(d.properties.district + "<br/> Stage of Ground Water Development (%):" + onlydistrict2017data[d.properties.district][0]["Stage of Ground Water Development (%)"])
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 28 + "px");
        })
        .on("mouseout", function (d) {
          div.transition().duration(500).style("opacity", 0);
        });

      svg
        .selectAll("text")
        .data(states)
        .enter()
        .append("text")
        .attr("class", function (d) {
          return "label " + d.id;
        })
        .attr("transform", function (d) {
          return "translate(" + path.centroid(d) + ")";
        })
        .attr("dy", ".35em");
      // .text(function (d) {
      //   return d.properties.st_nm;
      // });
    });
  } // render
  render.height = function (value) {
    if (!arguments.length) return height;
    height = value;
    return render;
  };
  render.width = function (value) {
    if (!arguments.length) return width;
    width = value;
    return render;
  };
  render.scale = function (value) {
    if (!arguments.length) return scale;
    scale = value;
    return render;
  };
  return render;
}

let overexploitedStates = 0;
let criticalStates = 0;
let semicriticalStates = 0;
let safeStates = 0;

function paintState(name) {
  const area = onlystate2017data[name];
  let percent;
  if (area) {
    percent = area[0]["Stage of Ground Water Development (%)"];
    if (percent > 100) {
      overexploitedStates++;
      return "rgb(234, 51, 35)";
    }
    if (percent > 90) {
      criticalStates++;
      return "rgb(140, 28, 100)";
    }
    if (percent > 70) {
      semicriticalStates++;
      return "rgb(93, 21, 147)";
    }
    if (percent > 30) {
      safeStates++;
      return "rgb(44, 20, 196)";
    }
    if (percent > 20) {
      safeStates++;
      return "rgb(0, 24, 245)";
    }
    safeStates++;
    return "rgb(44, 20, 196)";
  }
  safeStates++;
  return "blue";
}

let overexploitedDist = 0;
let criticalDist = 0;
let semicriticalDist = 0;
let safeDist = 0;

function paintDistrict(name) {
  const area = onlydistrict2017data[name];
  let percent;
  if (area) {
    percent = area[0]["Stage of Ground Water Development (%)"];
    if (percent > 100) {
      overexploitedDist++;
      return "rgb(234, 51, 35)";
    }
    if (percent > 90) {
      criticalDist++;
      console.log(criticalDist);
      return "rgb(140, 28, 100)";
    }
    if (percent > 70) {
      semicriticalDist++;
      return "rgb(93, 21, 147)";
    }
    if (percent > 30) {
      safeDist++;
      return "rgb(44, 20, 196)";
    }
    if (percent > 20) {
      safeDist++;
      return "rgb(0, 24, 245)";
    }
    safeDist++;
    return "rgb(44, 20, 196)";
  }
  safeDist++;
  return "blue";
}

function renderDistStats() {
  document.getElementById("totalStages13").innerHTML = `
          <div class="stage over-exploited"><h2>Over Exploited</h2><p>${overexploitedDist}</p></div>
          <div class="stage critical"><h2>Critical</h2><p>${criticalDist}</p></div>
          <div class="stage semi-critical"><h2>Semi Ciritcal</h2><p>${semicriticalDist}</p></div>
          <div class="stage safe"><h2>Safe</h2><p>${safeDist}</p></div>
          `;
}

function renderStatesStats() {
  document.getElementById("totalStages").innerHTML = `
          <div class="stage over-exploited"><h2>Over Exploited</h2><p>${overexploitedStates}</p></div>
          <div class="stage critical"><h2>Critical</h2><p>${criticalStates}</p></div>
          <div class="stage semi-critical"><h2>Semi Ciritcal</h2><p>${semicriticalStates}</p></div>
          <div class="stage safe"><h2>Safe</h2><p>${safeStates}</p></div>
          `;
}

renderDistStats();
