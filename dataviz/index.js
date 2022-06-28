drawLolly();
drawline();
drawheatMap();
drawbar();

//lollypop
function drawLolly() {
  //set the dimensions and margins of the graph
  var margin = { top: 50, right: 30, bottom: 50, left: 50 }
  let width = 625 - margin.left - margin.right
  let height = 500 - margin.top - margin.bottom;

  
  if (window.innerWidth < 1280) {
    width = 525;
  }if (window.innerWidth < 980) {
    width = 425;
  }if (window.innerWidth < 840) {
    width = 325;
  }if (window.innerWidth < 736) {
    width = 225;
  }

  //append the svg object to the body of the page
  var svg = d3.select("#lolly")
    .append("svg")
    .attr("class", "lolly")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //X axis that extends max chart width by x axis highest value
  var x = d3
    .scaleLinear()
    //.domain([0, 8000])
    //.domain([0, d3.max(data, function(d) { return Math.max(d.Amount); })])
    //.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ])
    .range([0, width]);
  
  var xAxis = svg.append("g").attr("transform", "translate(0," + height + ")");
    //.call(d3.axisBottom(x))
    //.selectAll("text")
    //.attr("transform", "rotate(-45)")
    //.style("text-anchor", "end");

  //Y axis
  var y = d3
    .scaleBand()
    .range([0, height])
    //.domain(data.map(function(d) { return d.City; }))
    .padding(1);
  var yAxis = svg.append("g").call(d3.axisLeft(y));

  //text label y axis
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -10 - margin.top / 2)
    .attr("dy", "1em")
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .style("text-transform", "uppercase")
    .style("font-weight", "bold")
    .text("Year Rain(mm)");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 20)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .text("1981-2015 period");

  //text label x axis
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.bottom) + ")"
    )
    .style("text-anchor", "middle")
    .style("text-decoration", "underline")
    .style("text-transform", "uppercase")
    .style("font-size", "10px")
    .text("(mm)");

  //A function that create / update the plot for a given variable
  function update(selectedVar) {
    //Parse the Data
    d3.csv("lolly.csv").then((data) => {

      //sorts data works in v4
      data.sort(function (b, a) {
        return a.value - b.value;
      });
      
    /*https://stackoverflow.com/questions/30480981/d3-js-sorting-by-rollup-field
    //sort function works in v5
    var city = d3.nest()
      .key(function(d) { return d.Amount; })
      .rollup(function(a){return a.length;})
      .entries(data)
      .sort(function(b, a){ return d3.ascending(a.Values - b.Values); })
    */

      //adds y axis
      y.domain(data.map(function (d) {return d.City;}));
      yAxis.transition().duration(1000).call(d3.axisLeft(y));

      //adds x axis
      x.domain([0,d3.max(data, function (d) {return +d[selectedVar];}),]);
      xAxis.transition().duration(1000).call(d3.axisBottom(x));

      //variable u: map data to existing circle
      var j = svg.selectAll(".myLine").data(data);
      //update lines
      j.enter()
        .append("line")
        .attr("class", "myLine")
        .merge(j)
        .transition()
        .duration(1000)
        .attr("x1", function (d) {return x(d[selectedVar]);})
        .attr("x2", x(0))
        .attr("y1", function (d) {return y(d.City);})
        .attr("y2", function (d) {return y(d.City);})
        .attr("stroke", "grey");

      //maps data to existing circles -> start at X=0
      var u = svg.selectAll("circle").data(data);
      //update bars
      u.enter()
        .append("circle")
        .merge(u)
        .transition()
        .duration(1000)
        .attr("cx", function (d) {return x(d[selectedVar]);})
        .attr("cy", function (d) {return y(d.City);})
        .attr("r", 6)
        .attr("stroke", "black")
        //.style("fill", "#59bfff")

        //if statement if the dots are over x amount
        .style("fill", function (d) {
          if (d[selectedVar] > 1000) {
            return "#59bfff";
          }else {
            return "#ca0020";
          }
        })

        //mousehover circle effect
        u.on('mouseover', function(d) {
          //console.log("Your mouse went over", d);
          d3.select(this)
          .transition()
          .duration(100)
          .attr('r', 12)
          //https://stackoverflow.com/questions/38684597/cannot-use-attr-with-an-object-in-d3-v4
          //Specify where to put label of text
          svg.append("text").attrs({
             id: "t" + d[selectedVar] + "-" + d.City, 
              x: function() { return x(d[selectedVar]) +15; },
              y: function() { return y(d.City); }
          })
          //Value of the text
          .text(function() {
            return [d[selectedVar], d.City];  
          });
        })

        //change size back to normal
        u.on('mouseout', function(d, i) {
          //console.log("Your mouse went off", this);
          d3.select(this)
          .transition()
          .duration(100)
          .attr('r', 6)
          //Select text by id and then remove
          d3.selectAll("#t" + d[selectedVar] + "-" + d.City).remove();  
         
        })

    });
  }

  //initializes plot
  update("Amount");
  d3.select(".var1").on("click", () => {
    update("Amount");
  });
  d3.select(".var2").on("click", () => {
    update("Total");
  });

}

//linechart
function drawline() {
  //sets the dimensions and margins of the graph
  var margin = { top: 70, right: 30, bottom: 70, left: 70 },
    width = 625 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    if (window.innerWidth < 1280) {
      width = 525;
    }if (window.innerWidth < 980) {
      width = 425;
    }if (window.innerWidth < 840) {
      width = 325;
    }if (window.innerWidth < 736) {
      width = 225;
    }

  //parses the date & time by format
  var parseTime = d3.timeParse("%d-%b-%y");
  var formatTime = d3.timeFormat("%b");

  //sets ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);


  //appends the svg obgect to the body of the page
  //appends a group element to svg
  //moves the group element to the top left margin
  var svg = d3
    .select("#line")
    .append("svg")
    .attr("width", width + margin.left + margin.right )
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "svg")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //gridlines in x axis function
  function make_x_gridlines() {
    return d3.axisBottom(x).ticks(1);
  }
  //gridlines in y axis function
  function make_y_gridlines() {
    return d3.axisLeft(y).ticks(10);
  }

  //obtains the data file
  d3.csv("data.csv").then(function (data) {
    d3.csv("datapresent.csv").then(function (dataTwo) {
      ///////////////////////////////////////////////////////////////////////////////dropdown button1

      //List of groups dropdown passed
      var allGroup = [
        "Kaitaia",
        "Whangarei",
        "Auckland",
        "Tauranga",
        "Hamilton",
        "Rotorua",
        "Gisborne",
        "Taupo",
        "Plymouth",
        "Napier",
        "Wanganui",
        "Palmerston",
        "Masterton",
        "Wellington",
        "Nelson",
        "Blenheim",
        "Westport",
        "Kaikoura",
        "Hokitika",
        "Christchurch",
        "Cook",
        "Tekapo",
        "Timaru",
        "Milford",
        "Queenstown",
        "Alexandra",
        "Manapouri",
        "Dunedin",
        "Invercargill",
        "Chatham",
      ];

      //A color scale, one color for each group
      var myColor = d3
        .scaleOrdinal()
        .domain(allGroup)
        .range(d3.schemeRdBu[(0, 5)]);

      //Initializes line with group
      var line = svg
        .append("g")
        .append("path")
        .datum(data)
        /*.attr("d", d3.line()
          .x(function(d) { return x(d.month) })
          .y(function(d) { return y(d.value) }))
        */
        .attr("stroke", function (d) {
          return myColor(d);
        })
        .style("stroke-width", 2)
        .style("fill", "none");

      //adds the options to the button
      d3.select("#selectButton")
        .selectAll("myOptions")
        .data(allGroup)
        .enter()
        .append("option")
        .text(function (d) {
          return d;
        }) //text showed in the menu
        .attr("value", function (d) {
          return d;
        }); //corresponding value returned by the button

      //A function that update the chart
      function update(selectedGroup) {
        //Create new data with the selection?
        var dataFilter = data.map(function (d) {
          return { month: d.month, value: d[selectedGroup] };
        });

        //Gives these new data to update line
        line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr(
            "d",
            d3
              .line()
              .x(function (d) {
                return x(+d.month);
              })
              .y(function (d) {
                return y(+d.value);
              })
          );
      }

      //When the button is changed, run the updateChart function
      d3.select("#selectButton").on("change", function (d) {
        //recover the option that has been chosen
        var selectedOption = d3.select(this).property("value");
        //runs the updateChart function with this selected option
        update(selectedOption);
      });

      //////////////////////////////////////////////////////////////////////////////////dropdown button1
      ///////////////////////////////////////////////////////////////////////////////dropdown button2

      //List of groups dropdown passed
      var allGroupTwo = [
        "hamilton",
        "auckland",
        "whangarei",
        "tauranga",
        "rotorua",
        "gisborne",
        "taupo",
        "plymouth",
        "napier",
        "wanganui",
        "palmerston",
        "masterton",
        "wellington",
        "nelson",
        "blenheim",
        "kaikoura",
        "hokitika",
        "christchurch",
        "cook",
        "tekapo",
        "timaru",
        "milford",
        "queenstown",
        "alexandra",
        "manapouri",
        "dunedin",
        "invercargill",
        "chatham",
      ];

      //A color scale, one color for each group
      var myColorTwo = d3
        .scaleOrdinal()
        .domain(allGroupTwo)
        .range(d3.schemeRdBu[(0, 6)]);

      //Initializes line with group
      var lineTwo = svg
        .append("g")
        .append("path")
        .datum(dataTwo)
        /*.attr("d", d3.line()
          .x(function(d) { return x(d.month) })
          .y(function(d) { return y(d.value) }))
        */
        .attr("stroke", function (d) {
          return myColorTwo(d);
        })
        .style("stroke-width", 2)
        .style("fill", "none");

      //adds the options to the button
      d3.select("#selectButtonTwo")
        .selectAll("myOptions")
        .data(allGroupTwo)
        .enter()
        .append("option")
        .text(function (d) {
          return d;
        }) //text showed in the menu
        .attr("value", function (d) {
          return d;
        }); //corresponding value returned by the button

      //A function that update the chart
      function updateChart(selectedGroupTwo) {
        //Create new data with the selection?
        var dataTwoFilter = dataTwo.map(function (d) {
          return { month: d.month, value: d[selectedGroupTwo] };
        });

        //Gives these new data to update line
        lineTwo
          .datum(dataTwoFilter)
          .transition()
          .duration(1000)
          .attr(
            "d",
            d3
              .line()
              .x(function (d) {
                return x(+d.month);
              })
              .y(function (d) {
                return y(+d.value);
              })
          );
      }

      d3.select("#selectButtonTwo").on("change", function (d) {
        selectedGroup = this.value;
        updateChart(selectedGroup);
      });

      //////////////////////////////////////////////////////////////////////////////////dropdown button2

      //formats the data, ensuring data to be treated as a number or string
      data.forEach(function (d) {
        d.month = parseTime(d.month);
      });
      dataTwo.forEach(function (d) {
        d.month = parseTime(d.month);
      });

      //displays negative/positive numbers on y axis that dont exceed chart, selected field by highest & lowerest data
      const tempMin = d3.min(data, function (d) {
        return Math.min(d.Tekapo);
      });
      const tempMax = d3.max(data, function (d) {
        return Math.max(d.Whangarei);
      });

      //scales the range of the data, returns the maximum of x,y without exceeding the domain (chart)
      x.domain(d3.extent(data, function (d) {return d.month;}));
      y.domain([0,d3.max(data, function (d) {return Math.max(d.value);}),]);

      //displays negative/positive numbers on y axis
      y.domain([Math.floor(tempMin), Math.ceil(tempMax)]);

      //displays a gridline by mouse hover with shape object, showing date by xaxis.
      svg.call(hover);

      function hover() {
        var bisect = d3.bisector((d) => d.month).left,
          format = d3.format("+.0%"),
          dateFormat = d3.timeFormat("%b");

        var focus = svg
          .append("g")
          .attr("class", "focus")
          .style("display", "none");

        focus
          .append("line")
          .attr("stroke", "lightgrey")
          .attr("stroke-width", 0)
          .attr("y1", -height)
          .attr("y2", 0);

        focus.append("text").attr("text-anchor", "middle").attr("dy", ".35em");

        var overlay = svg
          .append("rect")
          .attr("class", "overlay")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", width)
          .attr("height", height)
          .on("mouseover", () => focus.style("display", null))
          .on("mouseout", () => focus.style("display", "none"))
          .on("mousemove", mousemove);

        function mousemove() {
          var x0 = x.invert(d3.mouse(this)[0]);

          var i = bisect(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.month > d1.month - x0 ? d1 : d0;

          focus
            .select("line")
            .attr("transform", "translate(" + x(d.month) + "," + height + ")");

          focus
            .select("text")
            .attr(
              "transform",
              "translate(" +
                x(d.month) +
                "," +
                (height - margin.bottom + 37) +
                ")"
            )
            .text(dateFormat(d.month));
        }
      }

      //adds the X gridlines
      svg
        .append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines().tickSize(-height).tickFormat(""));
      //adds the Y gridlines
      svg
        .append("g")
        .attr("class", "grid")
        .call(make_y_gridlines().tickSize(-width).tickFormat(""));

      //adds the X Axis
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
       

      //adds the Y Axis
      svg.append("g").call(d3.axisLeft(y));


      //chart title middle
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", 0 - margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .style("text-transform", "uppercase")
        .style("font-weight", "bold")
        .text("Mean monthly temp (°C)");

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", 25 - margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .text("1981-2015 Period");

      //adds the X Axis
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      //text label x axis
      svg
        .append("text")
        .attr(
          "transform",
          "translate(" + width / 2 + " ," + (height + margin.top - 25) + ")"
        )
        .style("text-anchor", "middle")
        .style("text-decoration", "underline")
        .style("text-transform", "uppercase")
        .text("Date");

      //adds the Y Axis
      svg.append("g").call(d3.axisLeft(y));

      //text label y axis
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 15 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("text-decoration", "underline")
        .style("text-transform", "uppercase")
        .text("Temp °C");

    });
  });
}

//heatmap
function drawheatMap() {
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "myTooltip")
    .style("visibility", "hidden")
    .html("a simple tooltip</br>hh");

  var geos = [
    "Kaitaia",
    "Auckland",
    "Tauranga",
    "Hamilton",
    "Rotorua",
    "Wellington",
    "Mt Cook",
    "Milford Sound",
    "Dunedin",
  ];
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  var height = 450,
    width = 455
    margin = { top: 50, right: 50, bottom: 100, left: 100 };

    if (window.innerWidth < 1280) {
      width = 400;
    }if (window.innerWidth < 980) {
      width = 350;
    }if (window.innerWidth < 840) {
      width = 300;
    }if (window.innerWidth < 736) {
      width = 250;
    }

  var cellSize = 50,
    legendElementWidth = cellSize - 15;

  var svg = d3
    .select("#heat")
    .attr("class", "heat")
    .append("svg")
    .attr("height", margin.top + height + margin.bottom)
    .attr("width", margin.left + width + margin.right);

   //chart title middle
   svg
   .append("text")
   .attr("x", width / 2 - margin.right)
   .attr("y", height / 18)
   .style("font-size", "16px")
   .style("text-decoration", "underline")
   .style("text-transform", "uppercase")
   .style("font-weight", "bold")
   .text("Mean monthly rainfall (mm)");
 
   svg
   .append("text")
   .attr("x", width / 2 + margin.left - 10)
   .attr("y", height / 10)
   .attr("text-anchor", "middle")
   .style("font-size", "10px")
   .text("1981-2015 period");

  var xScale = d3
    .scaleBand()
    .domain(months)
    .range([margin.left, margin.left + width]);

  var yScale = d3
    .scaleBand()
    .domain(geos)
    .range([margin.top + height, margin.top]);

  var colorScale = d3
    .scaleQuantile()
    .domain([0, 50, 100, 150, 200, 400, 800])
    .range(d3.schemeBlues[9]);

  var legend = svg
    .selectAll(".legend")
    .data([1].concat(colorScale.quantiles()), function (d) {
      return d;
    })
    .enter()
    .append("g")
    .attr("class", "legend");

  legend
    .append("rect")
    .attr("x", function (d, i) {
      return legendElementWidth * i + width / 3;
    })
    .attr("y", height + margin.top + 30)
    .attr("width", legendElementWidth)
    .attr("height", cellSize / 2)
    .style("fill", (d) => colorScale(d));

  legend
    .append("text")
    .attr("class", "mono")
    .text(function (d) {
      return "≥" + Math.round(d);
    })
    .attr("x", function (d, i) {
      return legendElementWidth * i + width / 2.6;
    })
    .attr("y", height + margin.top + cellSize + 20)
    .style("text-anchor", "middle")
    .style("font-size", 12);

  d3.csv("heat.csv").then((data) => {

    //console.log(data);
    var columns = svg
      .selectAll(".column")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", (d) => "translate(" + xScale(d.month) + ")")
      .each(function (d) {
        //console.log(d.month, xScale(d.month))
        geos.forEach((key) => {
          d3.select(this)
            .append("rect")
            .attr("width", 38)
            .attr("height", 38)
            .attr("x", xScale.bandwidth() / 2 - 19)
            .attr("y", yScale(key) + yScale.bandwidth() / 2 - 19)
            .style("fill", (d) => colorScale(d[key]))
            .style("stroke", "#666")
            .style("stroke-width", 0.6)
            .on("mouseover", function () {
              tooltip.html(
                "Month: " +
                  d.month +
                  "</br>Place: " +
                  key +
                  "</br>Rainfall: " +
                  d[key] +
                  "mm"
              );
              tooltip.style("visibility", "visible");
            })
            .on("mousemove", function () {
              tooltip
                .style("top", d3.event.pageY - 10 + "px")
                .style("left", d3.event.pageX + 10 + "px");
            })
            .on("mouseout", function () {
              tooltip.style("visibility", "hidden");
            })
            .on("click", (d) => console.log(d[key]));
        });
      });

    svg
      .append("g")
      .attr("transform", "translate(0," + (margin.top + height) + ")")
      .call(d3.axisBottom().scale(xScale));

    svg
      .append("g")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(d3.axisLeft().scale(yScale));

  });
}

//barplot
function drawbar() {

  var width = 600,
    height = 500,
    barHeight = height / 2.4;

    if (window.innerWidth < 1280) {
      width = 500;
      barHeight = height / 2.8;

    }if (window.innerWidth < 980) {
      width = 400;
      barHeight = height / 3.2;

    }if (window.innerWidth < 840) {
      width = 350;
      barHeight = height / 3.4;
    }

  var formatNumber = d3.format("S");

  var color = d3
    .scaleOrdinal()
    .range([
      "#8dd3c7",
      "#ffffb3",
      "#bebada",
      "#fb8072",
      "#80b1d3",
      "#fdb462",
      "#b3de69",
      "#fccde5",
      "#d9d9d9",
      "#bc80bd",
      "#ccebc5",
      "#ffed6f",
      "#e8ba8b",
      "#8be8d2",
      "#c29fed",
      "#84e3aa",
      "#cbe384",
      "#e3a484",
      "#99d7f0",
    ]);

  var svg = d3
    .select("#bar")
    .append("svg")
    .attr("class", "bar")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  d3.csv("CircularBarplot.csv").then((data) => {
    data.sort(function (a, b) {
      return b.value - a.value;
    });

    var extent = d3.extent(data, function (d) {
      return d.value;
    });
    var barScale = d3.scaleLinear().domain(extent).range([0, barHeight]);

    var keys = data.map(function (d, i) {
      return d.name;
    });
    var numBars = keys.length;

    var x = d3.scaleLinear().domain(extent).range([0, -barHeight]);

    //displays temp number on xAxis of the bar
    var xAxis = d3.axisLeft(x).ticks(5).tickFormat(formatNumber);

    //displays doted lines around main cicle radius
    var circles = svg
      .selectAll("circle")
      .data(x.ticks(5))
      .enter()
      .append("circle")
      .attr("r", function (d) {
        return barScale(d);
      })
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-dasharray", "2,2")
      .style("stroke-width", ".5px");

    var arc = d3
      .arc()
      .startAngle(function (d, i) {
        return (i * 2 * Math.PI) / numBars;
      })
      .endAngle(function (d, i) {
        return ((i + 1) * 2 * Math.PI) / numBars;
      })
      .innerRadius(0);

    var segments = svg
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .each(function (d) {
        d.outerRadius = 0;
      })
      .style("fill", function (d) {
        return color(d.name);
      })
      .attr("d", arc);

    segments
      .transition()
      //   .ease("elastic")
      .duration(1000)
      .delay(function (d, i) {
        return (25 - i) * 100;
      })
      .attrTween("d", function (d, index) {
        var i = d3.interpolate(d.outerRadius, barScale(+d.value));
        return function (t) {
          d.outerRadius = i(t);
          return arc(d, index);
        };
      });

    svg
      .append("circle")
      .attr("r", barHeight)
      .classed("outer", true)
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", "1.5px");

    var lines = svg
      .selectAll("line")
      .data(keys)
      .enter()
      .append("line")
      .attr("y2", -barHeight - 25)
      .style("stroke", "black")
      .style("stroke-width", ".5px")
      .attr("transform", function (d, i) {
        return "rotate(" + (i * 360) / numBars + ")";
      });

    svg.append("g").attr("class", "x axis").call(xAxis);

    var labelRadius = barHeight * 1.05;

    var labels = svg.append("g").classed("labels", true);

    labels
      .append("def")
      .append("path")
      .attr("id", "label-path")
      .attr(
        "d",
        "m0 " +
          -labelRadius +
          " a" +
          labelRadius +
          " " +
          labelRadius +
          " 0 1,1 -0.01 0"
      );

    labels
      .selectAll("text")
      .data(keys)
      .enter()
      .append("text")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("font-size", "9px")
      .style("fill", function (d, i) {
        return "#3e3e3e";
      })
      .append("textPath")
      .attr("xlink:href", "#label-path")
      .attr("startOffset", function (d, i) {
        return (i * 100) / numBars + 50 / numBars + "%";
      })
      .text(function (d) {
        return d.toUpperCase();
      });

    svg
      .append("text")
      .attr("x", 0)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-transform", "uppercase")
      .style("text-decoration", "underline")
      .style("font-weight", "bold")
      .text("Year Temp °C");


    svg
      .append("text")
      .attr("x", 0)
      .attr("y", 50)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .text("1981-2015 period");
  });
}
