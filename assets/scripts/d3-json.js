'use strict';



let lineColumn = "symbol";

     function render(data){

       let nested = d3.nest()
         .key(function (d){ return d[lineColumn]; })
         .entries(data);

       d3.select("#cdc-2").append("pre")
         .text(JSON.stringify(nested, null, 2));
     }

     function type(d){
       d.date = new Date(d.date);
       d.rate = +d.rate;
       return d;
     }

     d3.csv("death-rate-reduced.csv", type, render);
