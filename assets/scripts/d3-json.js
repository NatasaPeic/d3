'use strict';


// it just running d3.nest to represent the data

     function render(data){
       // it calls  d3.nest
       let nested = d3.nest()
       // d.symbol loops through all symbols out of data
         .key(function (d){ return d.symbol; })
         .entries(data);

       d3.select("#cdc-2").append("pre")
         .text(JSON.stringify(nested, null, 2));
     }

     function type(d){
       d.date = new Date(d.date);
       d.rate = +d.rate;
       return d;
     }

    // when csv is loaded it gets passed to render function
     d3.csv("death-rate-reduced.csv", type, render);
