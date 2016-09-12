'use strict';




let margin = {top: 30, right: 50, bottom: 100, left: 50},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;



let parseDate = d3.time.format("%Y").parse;



// Set the ranges
let x = d3.time.scale().range([0, width]);
let y = d3.scale.linear().range([height, 0]);



// create x, y axis functions
// ticks sets data points
let xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(10);
let yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(10);




// Define the line
let line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.rate); });





// creates svg container and inner drawing space
let svg = d3.select("#cdc-1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");





// Get the data
// d3.csv function calls callback function and passes two arguments, error and data, callback in anonymous function
let chart1 = d3.csv("death-rate.csv", function(error, data) {
               callBackError = error;
               callbackData = data;
    });

callbackData;
callBackError;

callbackData[0];


    callbackData.forEach(function(d) {
    d.date = parseDate(d.date);
    d.rate = +d.rate;
});

callbackData[0];


typeof(callbackData[0]['date']);
typeof(callbackData[0]['rate']);



    // once data is loaded, we need to set domain
    // domain rep­re­sents the bound­aries within which this data lies
    x.domain(d3.extent(callbackData, function(d) { return d.date; }));

    y.domain(d3.extent(callbackData, function(d) { return d.rate; }));


d3.extent(callbackData, function(d) { return d.date; });
d3.extent(callbackData, function(d) { return d.rate; });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);


    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Rate per 100,000");




    // Nest the entries by symbol
    // used for large group of data, grouping by symbols (leading cause)
    let dataNest = d3.nest()
        .key(function(d) {return d.symbol;})
        .entries(callbackData);

        dataNest;



    let color = d3.scale.category10();  // set the color scale




// d3 path generator
    // Loop through each symbol / key
    dataNest.forEach(function(d) {
         svg.append("path")
            .attr("class", "line")
            .style("stroke", function() { // Add dynamically
                return d.color = color(d.key); })
            .attr("d", line(d.values));
    });
