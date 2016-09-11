'use strict';



// Set the dimensions of the canvas / graph
let margin = {top: 30, right: 50, bottom: 100, left: 50},
    width = 800 - margin.left - margin.right, // width = 800 (svg container)-100, for the graph
    height = 600 - margin.top - margin.bottom; // height = 600 (svg container)- 130 for the graph


// Parse the date / time
let parseDate = d3.time.format("%Y").parse;



// Set the ranges
// time scale funcion for x axis data. it creates scaling function where range goes from 0 to the width of inner drawing space.
// scale linear function for y axis. it creates scaling function where the range goes from the height of the inner drawing space to 0.
let x = d3.time.scale().range([0, width]);
let y = d3.scale.linear().range([height, 0]);



// create x, y axis functions
// ticks sets data points
let xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(10);
let yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(10);




// Define the line
// it complies the date and the rate in our dataset which means that x values access the date from the data passed through anonymous function
let line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.rate); });






// creates svg container and inner drawing space
let svg = d3.select("#cdc-1")
        .append("svg")
        // it defines width and height attribues of the svg container in terms of inner drawing space width and height and relevant margin
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        // append svg group element which will be inner drawing space
        .append("g")
       // the element is moved by a relative value in the x,y direction.
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");





// Get the data
// d3.csv function calls callback function and passes two arguments, error and data, callback in anonymous function
let chart1 = d3.csv("death-rate.csv", function(error, data) {
  // it iterates through array of javascript objects
  // it redefines the values
    data.forEach(function(d) {
      // converts date string into javascript object
		d.date = parseDate(d.date);
    // converts string rate to a number
		d.rate = +d.rate;
    });


    // once data is loaded, we need to set domain
    // domain rep­re­sents the bound­aries within which this data lies

    // domain for the x axis values will be determined by the d3.extent function which looks through all the 'date' values that occur in the 'data' array.


    // extend returns array containg the minimum and maximum values in the given array
    x.domain(d3.extent(data, function(d) { return d.date; }));

    y.domain(d3.extent(data, function(d) { return d.rate; }));




    // Add the X Axis
    // it appends the svg group elements to hold the x axis
    svg.append("g")
        // group is given the class "x axis"
        .attr("class", "x axis")
        // transform translated by the height of the inner drawing space
        .attr("transform", "translate(0," + height + ")")
        // function is called because we have x scaling function, domain and range
        .call(xAxis);


    // Add the Y Axis
    // it appends the svg group elements to hold the y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        // styling for text
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        // placed on the end
        .style("text-anchor", "end")
        .text("Rate per 100,000");




    // Nest the entries by symbol
    // used for large group of data, grouping by symbols (leading cause)
    let dataNest = d3.nest()
        // data is rearanged
        .key(function(d) {return d.symbol;})
        // acitvate the data, data is grouped by symbol (leading cause)
        .entries(data);


    // Constructs a new ordinal scale with a range of ten categorical colors
    let color = d3.scale.category10();  // set the color scale





    // Loop through each symbol / key
    dataNest.forEach(function(d) {
         // path will be generated by d3 path generator functionality
         svg.append("path")
            // add class of line to style it
            .attr("class", "line")
            .style("stroke", function() { // Add dynamically
                return d.color = color(d.key); })
            // add attribute d it will take data and generate path
            .attr("d", line(d.values));
    });
});



d3.select("#cdc-1").append("h4").html("Looking at this plot, we can see that leading causes of deaths 100 years ago were influenza, stroke and heart disease. Starting from 1950. we can see the death rates are decreasing for all causes of deaths except for one, and that is cancer.")

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

  
    dataNest.forEach(function(d) {
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
