'use strict';



// Set the dimensions of the canvas / graph
// margin convention specifies what margin the inner drawing space will have
let margin = {top: 30, right: 50, bottom: 100, left: 50},
    width = 800 - margin.left - margin.right, // width = 800 (svg container)-100, for the graph
    height = 600 - margin.top - margin.bottom; // height = 600 (svg container)- 130 for the graph


// Parse the date / time
// Takes string and converts it into js object
let parseDate = d3.time.format("%Y").parse;



// Set the ranges
// time scale funcion for x axis data. x axis matches the time in this dataset. it creates scaling function where range goes from 0 to the width of inner drawing space. we set domain later when we load the data
// scale linear function for y axis. it creates scaling function where the range goes from the height of the inner drawing space to 0. y axis matches number of people and it is linear. it is backwards because it inverts the svg coordinate space along y axis. origin point will be at the bottom left instead of top left.
let x = d3.time.scale().range([0, width]);
let y = d3.scale.linear().range([height, 0]);



// create x, y axis functions. we pass in x scale function that was created earlier, and give axis the orientation which means that text will be on the lower line.
// ticks sets data points
let xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(10);
// text appears on the left of the line
let yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(10);




// Define the line
// ticks (sets data points), orient (setting the orientation of data, line (new line chart based on svg)
// it defines d3 path generation function. it uses d3 path data generation functionality
// for x and y the code defines accessor functions. it complies the date and the rate in our dataset which means that x values access the date from the data passed through anonymous function
let line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.rate); });



// Adds the svg canvas
// Select div tag and appends it
// cdc-1 is id that can be styled
// creates svg container and inner drawing space
// variable that will be used as a reference drawing space
let svg = d3.select("#cdc-1")
        .append("svg")
        // it defines width and height attribues of the svg container in terms of inner drawing space width and height and relevant margin
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        // append svg group element which will be inner drawing space
        // g stands for svg group that contains visualization
        .append("g")
       // inner drawing space is transformed translated to the down by the relevant margins
       // the element is moved by a relative value in the x,y direction.
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");





// Get the data
// code where d3 does  XHR call to the server to get the death-rate.csv file
// once server responds with the file, d3.csv function calls callback function and passes two arguments, error and data, callback in anonymous function
let chart1 = d3.csv("death-rate.csv", function(error, data) {
  // it iterates throuhg array of javascript objects
  // it redefines the values of the same key of the same object
    data.forEach(function(d) {
      // it does two things. to convert data into more usable type of data. first it converts date string into javascript object
		d.date = parseDate(d.date);
    // converts string rate to a number
		d.rate = +d.rate;
    });


    // Scale the range of the data to fit avaiable space
    // we have two different types of data (date/time and numeric values), and they need to be treated separately
    // domain rep­re­sents the bound­aries within which this data lies
    // domain for the x axis values will be determined by the d3.extent function which in turn is acting on a separate function which looks through all the 'date' values that occur in the 'data' array. In thins case the .extent function returns the minimum and maximum value in the given array.

    // because the range of values desired on the y axis goes from 0 to the maximum in the data range, that's exactly what we tell D3. The '0' in the .domain function is the starting point and the finishing point is found by employing a separate function that sorts through all the 'rate' values in the 'data' array and returns the largest one. Therefore the domain is from 0 to 636.23.

    // when we have data we can set domain for x, y scale function
    // extend returns array containg the minimum and maximum dates, it uses anonymous function to get the date of the data object
    x.domain(d3.extent(data, function(d) { return d.date; }));
    // y.domain([0, d3.max(data, function(d) { return d.rate; })]);
    y.domain(d3.extent(data, function(d) { return d.rate; }));



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
    // call d3 operator for the x axis
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

    // Loop through each symbol / key
    dataNest.forEach(function(d) {
       //Draw lines that is a graph of data. it is a d3 pattern. we define drawing space, we append path, use datum(data) since there is only one piece of data
       // path will be generated by d3 path generator functionality using the array
        svg1.append("path")
            // add class of line to style it
            .attr("class", "line")
            // add attribute d which is the d3 path generator function, it will take data that is passed to datum and generate path
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
