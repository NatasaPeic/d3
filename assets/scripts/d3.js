'use strict';






// Set the dimensions of the canvas / graph
let margin = {top: 30, right: 50, bottom: 100, left: 50},
    width = 800 - margin.left - margin.right, // width = 800-100, for the graph
    height = 600 - margin.top - margin.bottom; // height = 600 - 130 for the graph


// Parse the date / time
let parseDate = d3.time.format("%Y").parse;



// Set the ranges
// x axis matches the time in this dataset
// y axis matches number of people and it is linear
let x = d3.time.scale().range([0, width]);
let y = d3.scale.linear().range([height, 0]);



// Define the axes
let xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(10);

let yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(10);




// Define the line
let line = d3.svg.line()

    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.rate); });



// Adds the svg canvas
// Select div tag and appends it
let svg = d3.select("#cdc-1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        // append group element, the groups are lines for the entire chart
        .append("g")
       // transform, translate attribute
       // the element is moved by a relative value in the x,y direction.
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");





// Get the data
let chart1 = d3.csv("death-rate.csv", function(error, data) {
    data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.rate = +d.rate;
    });


    // Scale the range of the data to fit avaiable space
    // we have two different types of data (date/time and numeric values), and they need to be treated separately
    // domain rep­re­sents the bound­aries within which this data lies
    // domain for the x axis values will be determined by the d3.extent function which in turn is acting on a separate function which looks through all the 'date' values that occur in the 'data' array. In thins case the .extent function returns the minimum and maximum value in the given array.

    // because the range of values desired on the y axis goes from 0 to the maximum in the data range, that's exactly what we tell D3. The '0' in the .domain function is the starting point and the finishing point is found by employing a separate function that sorts through all the 'rate' values in the 'data' array and returns the largest one. Therefore the domain is from 0 to 636.23.
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.rate; })]);




    // Nest the entries by symbol
    // used for large group of data, grouping by symbols (leading cause)
    let dataNest = d3.nest()
        // key is individual step that data goes through
        // data is rearanged
        .key(function(d) {return d.symbol;})
        // acitvate the data, data is grouped by symbol (leading cause)
        .entries(data);


    // Constructs a new ordinal scale with a range of ten categorical colors
    let color = d3.scale.category10();  // set the color scale


    // Loop through each symbol / key
    dataNest.forEach(function(d) {

        svg.append("path")
            .attr("class", "line")
            .style("stroke", function() { // Add dynamically
                return d.color = color(d.key); })
            .attr("d", line(d.values));
    });


    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);


    // Add the Y Axis
    // append another group
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        // styling for text
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Rate per 100,000");

});


d3.select("#cdc-1").append("h4").html("Looking at this plot, we can see the number of is decreasing for all causes of deaths except for one, and that is cancer.")

d3.select("#cdc-1").append("h4").html("Now, how might we explain this?")

d3.select("#cdc-1").append("text").html("One possible explanation is that death rates due to cancer are increasing because these other causes are diminishing in frequency. Due to constantly improving health care and technology, life expectancy has been increasing for the past century. As people tend to live longer these days than they did in the past, cancer is more likely to occur because cancer is a type of disease that tends to affect older people.")






let svg1 = d3.select("#cdc-1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")")


// Get the data
let chart2 = d3.csv("life-expectancy.csv", function(error, data) {
    data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.rate = +d.rate;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.rate; })]);

    // Nest the entries by symbol
    let dataNest = d3.nest()
        .key(function(d) {return d.symbol;})
        .entries(data);

    // Loop through each symbol / key
    dataNest.forEach(function(d) {
       //The line SVG Path we draw
        svg1.append("path")
            .attr("class", "line")
            .attr("d", line(d.values));
    });


    // Add the X Axis
    svg1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg1.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Life expectancy");
});
