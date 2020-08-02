(function () {
  d3.queue()
    .defer(d3.json, "ne_10m_admin_1_India_Official.json")
    .defer(d3.csv, "2017data.csv")
    .defer(d3.csv, "2013data.csv")
    .defer(d3.csv, "postmonsoon.csv")
    .defer(d3.csv, "premonsoon.csv")
    .await(function (
      error,
      topoMap,
      data2017,
      data2013,
      postmonsoon,
      premonsoon
    ) {
      if (error) throw error;

      var karnatakadata = data2017.filter(element => element['Name of State'] === 'KARNATAKA')
      var karnatakadata13 = data2013.filter(element => element['Name of State'] === 'KARNATAKA')
      var tamilnadudata = data2017.filter(element => element['Name of State'] === 'TAMILNADU')
      var tamilnadudata13 = data2013.filter(element => element['Name of State'] === 'TAMILNADU')
      var keraladata = data2017.filter(element => element['Name of State'] === 'KERALA')
      var keraladata13 = data2013.filter(element => element['Name of State'] === 'KERALA')
      var goadata = data2017.filter(element => element['Name of State'] === 'GOA')
      var goadata13 = data2013.filter(element => element['Name of State'] === 'GOA')

      localStorage.setItem("goadata", JSON.stringify(goadata))
      localStorage.setItem("goadata13", JSON.stringify(goadata13))
      localStorage.setItem("keraladata", JSON.stringify(keraladata))
      localStorage.setItem("keraladata13", JSON.stringify(keraladata13))
      localStorage.setItem("data2017", JSON.stringify(data2017))
      localStorage.setItem("data2013", JSON.stringify(data2013))
      localStorage.setItem("tamilnadudata13", JSON.stringify(tamilnadudata13))
      localStorage.setItem("karnatakadata13", JSON.stringify(karnatakadata13))
      localStorage.setItem("tamilnadudata", JSON.stringify(tamilnadudata))
      localStorage.setItem("karnatakadata", JSON.stringify(karnatakadata))
      localStorage.setItem("postmonsoon", JSON.stringify(postmonsoon));
      localStorage.setItem("premonsoon", JSON.stringify(premonsoon));

      data2017And2013Creator(data2017, data2013);

      var states = topojson.feature(
        topoMap,
        topoMap.objects.ne_10m_admin_1_India_Official
        // topoMap.objects.india
      );

      // Map render
      var map = stateMap(states.features).width(800).height(700).scale(1200);
      d3.select("#map").call(map);
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
let allstate2013data = {};
let groundWater2017 = 0;
let groundWater2013 = 0;
let extractWater2017 = 0;
let extractWater2013 = 0;
let extractPercent2017 = 0;
let extractPercent2013 = 0;
function data2017And2013Creator(data2017, data2013) {
  allstate2017data = groupBy(data2017, "Name of State");
  allstate2013data = groupBy(data2013, "Name of State");
}

function select2017statedata(statename) {
  groundWater2017 = allstate2017data[statename].sum(
    "Total Annual Ground Water Recharge(Ham)"
  );
  extractWater2017 = allstate2017data[statename].sum(
    "Total Current Annual Ground Water Extraction(Ham)"
  );
  extractPercent2017 =
    allstate2017data[statename].sum("Stage of Ground Water Distribution (%)") /
    allstate2017data[statename].length;

  groundWater2013 = allstate2013data[statename].sum(
    "Total Annual Ground Water Recharge(Ham)"
  );
  extractWater2013 = allstate2013data[statename].sum(
    "Total Current Annual Ground Water Extraction(Ham)"
  );
  extractPercent2013 =
    allstate2013data[statename].sum("Stage of Ground Water Distribution (%)") /
    allstate2013data[statename].length;

  groundWaterChart(groundWater2013, groundWater2017, statename);
  extractWaterChart(extractWater2013, extractWater2017, statename);
  extractPercentChart(extractPercent2013, extractPercent2017, statename);
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
      text: statename + " Stage of Ground Water Distribution (%)",
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
          return color[Math.floor(Math.random() * 5)];
        })
        .attr("d", path)
        .on("mousedown", function (d) {
          const url = d.properties.name.toLowerCase().split(' ').join('-');
          window.location = `/${url}.html`
          //alert(d.properties.name);
          console.log(d);
        })
        .on("mouseover", function (d) {
          //   document.querySelector(".stats").innerHTML = `
          //   <ul>
          //   <li>Name: ${d.properties.name}</li>
          //   <li>Population: ${d.properties.population}</li>
          //   <li>Area: ${d.properties.area}</li>
          // </ul>
          //   `;
          console.log(d3.event.pageY);
          select2017statedata(d.properties.name);
          div.transition().duration(200).style("opacity", 0.9);
          div
            .html(d.properties.name + "<br/>Area: " + d.properties.area)
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
        .attr("dy", ".35em")
        .text(function (d) {
          return d.properties.name;
        });
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
