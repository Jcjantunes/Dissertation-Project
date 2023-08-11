function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function loadAllData(data) {
    localStorage.setItem("CMUData", JSON.stringify(data));
}

/*global*/
function defineValues() {
    document.getElementById("citationsCount").innerHTML = numberWithCommas(JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.citations_count);
    document.getElementById("citationsCount5").innerHTML = numberWithCommas(JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.citations_count5);
    document.getElementById("hIndex").innerHTML = numberWithCommas(JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.h_index);
    document.getElementById("hIndex5").innerHTML = numberWithCommas(JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.h_index5);
    document.getElementById("i10Index").innerHTML = numberWithCommas(JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.i10_index);
    document.getElementById("i10Index5").innerHTML = numberWithCommas(JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.i10_index5);
    document.getElementById("nPublications").innerHTML = numberWithCommas(JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.number_of_publications);
    document.getElementById("nAuthors").innerHTML = numberWithCommas(JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.number_of_authors);
    document.getElementById("nCollab").innerHTML = numberWithCommas(JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.number_of_international_pubs);
    document.getElementById("nStudentCollab").innerHTML = numberWithCommas(JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.number_of_student_collabs);
}

function createBarChart() {
    // Step 1
    citations = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.citations_per_year;

    citationsYears = Object.keys(citations);
    citationsNumber = Object.values(citations);

    citationsYears.sort((a, b) => (a > b) ? 1 : -1)
    var dataset = [];

    for (let i = 0; i < citationsYears.length; i++) {
        dataset.push([citationsYears[i], citationsNumber[i]]);
    }

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#citationsPerYear")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container1", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
    // X axis
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(citationsYears)
    .padding(0.2);
    
    let xAxisGenerator = d3.axisBottom(xScale)
    if(citationsYears.length > 10) {
        xAxisGenerator.tickFormat(d => (d%2 != 0) ? "" : d)
    }
    
    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(citationsNumber)])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));

    // create tooltip element  
    const tooltip = d3.select("body")
      .append("div")
      .attr("class","d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "15px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("border-radius", "5px")
      .style("color", "#fff")
      .text("a simple tooltip");

    bar_color = "#69b3a2"
    // Bars
    svg.selectAll("mybar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("fill", bar_color)
    .attr("x", function(d) { return xScale(d[0]); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d[1]); })
    .on("mouseover", function(event, d) {
        tooltip.html(`${d[1]} citations`).style("visibility", "visible");
        d3.select(this)
          .attr("fill", shadeColor(bar_color, -15));
    })
    .on("mousemove", function(){
        tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
    })
    .on("mouseout", function() {
        tooltip.html(``).style("visibility", "hidden");
        d3.select(this).attr("fill", bar_color);
    });

    svg.append("g")
                .call(xAxisGenerator)
                .attr("transform", "translate(0," + height + ")")
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Citations Per Year");
}

function createBarChartNPubs() {
    // Step 1
    citations = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.pubs_per_year;

    citationsYears = Object.keys(citations);
    citationsNumber = Object.values(citations);

    citationsYears.sort((a, b) => (a > b) ? 1 : -1)
    var dataset = [];

    for (let i = 0; i < citationsYears.length; i++) {
        dataset.push([citationsYears[i], citationsNumber[i]]);
    }

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#citationsPerYear")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container2", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
        // X axis
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(citationsYears)
    .padding(0.2);
        
    let xAxisGenerator = d3.axisBottom(xScale)
    if(citationsYears.length > 10) {
        xAxisGenerator.tickFormat(d => (d%2 != 0) ? "" : d)
    }

    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(citationsNumber)])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));

    // create tooltip element  
    const tooltip = d3.select("body")
      .append("div")
      .attr("class","d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "15px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("border-radius", "5px")
      .style("color", "#fff")
      .text("a simple tooltip");

    bar_color = "#69b3a2"
    // Bars
    svg.selectAll("mybar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("fill", bar_color)
    .attr("x", function(d) { return xScale(d[0]); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d[1]); })
    .on("mouseover", function(event, d) {
        tooltip.html(`${d[1]} publications`).style("visibility", "visible");
        d3.select(this)
          .attr("fill", shadeColor(bar_color, -15));
    })
    .on("mousemove", function(){
        tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
    })
    .on("mouseout", function() {
        tooltip.html(``).style("visibility", "hidden");
        d3.select(this).attr("fill", bar_color);
    });

    svg.append("g")
            .call(xAxisGenerator)
            .attr("transform", "translate(0," + height + ")")
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Publications Per Year");
}

function createBarChartPubTypes() {
    // Step 1
    pubs = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.publications;

    pubs.sort((a, b) => (a.pub_type > b.pub_type) ? 1 : -1)
    
    pubTypes = {}
    for (let i = 0; i < pubs.length; i++) {
        if(!(pubs[i].pub_type in pubTypes)) {
            pubTypes[pubs[i].pub_type] = 1
        }
        else {
            pubTypes[pubs[i].pub_type] += 1
        }
    }    
    types = Object.keys(pubTypes);
    n_types = Object.values(pubTypes);

    var dataset = [];
    for (let i = 0; i < types.length; i++) {
        dataset.push([types[i], n_types[i]]);
    }

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#typerPerPub")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container1", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
    dataset.sort(function(a,b){return b[1] - a[1];}); 
    
    types = [];
    n_types = [];

    for (let i = 0; i < dataset.length; i++) {
        types.push(dataset[i][0])
        n_types.push(dataset[i][1])
    }
        // X axis
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(types)
    .padding(0.2);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "8px");

    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(n_types)])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));

    // create tooltip element  
    const tooltip = d3.select("body")
      .append("div")
      .attr("class","d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "15px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("border-radius", "5px")
      .style("color", "#fff")
      .text("a simple tooltip");

    bar_color = "#69b3a2"
    // Bars
    svg.selectAll("mybar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("fill", bar_color)
    .attr("x", function(d) { return xScale(d[0]); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d[1]); })
    .on("mouseover", function(event, d) {
        tooltip.html(`${d[1]} publications`).style("visibility", "visible");
        d3.select(this)
          .attr("fill", shadeColor(bar_color, -15));
    })
    .on("mousemove", function(){
        tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
    })
    .on("mouseout", function() {
        tooltip.html(``).style("visibility", "hidden");
        d3.select(this).attr("fill", bar_color);
    });

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Publications' Types");
}

function createBarChartPubTypesPerYear() {
    // Step 1
    pubs = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.publications;
    
    pubs.sort((a, b) => (a.pub_year > b.pub_year) ? 1 : -1)
    pubYearsList = []
    pubTypesList = []
    for (let i = 0; i < pubs.length; i++) {
        if(!(pubYearsList.includes(pubs[i].pub_year))) {
            pubYearsList.push(pubs[i].pub_year)
        }
        if(!(pubTypesList.includes(pubs[i].pub_type))) {
            pubTypesList.push(pubs[i].pub_type)
        }
    }

    pubYearsList.sort((a, b) => (a > b) ? 1 : -1)
    pubTypesList.sort()
    
    pubTypesCounter = {}
    pubTypesPerYear = {}

    for (let i = 0; i < pubYearsList.length; i++) {
        pubTypesPerYear[pubYearsList[i]] = {}
    }

    pubYearsListAux = []
    for (let i = 0; i < pubs.length; i++) {
        if(!(pubYearsListAux.includes(pubs[i].pub_year))) {
            pubTypesCounter = {}
            pubTypesCounter[pubs[i].pub_type] = 1
            pubYearsListAux.push(pubs[i].pub_year)
        }
        else {
            if(!(pubs[i].pub_type in pubTypesCounter)) {
                pubTypesCounter[pubs[i].pub_type] = 1
            }
            else {
                pubTypesCounter[pubs[i].pub_type] += 1
            }
        }
        pubTypesPerYear[pubs[i].pub_year] = pubTypesCounter
    }

    var pubTypesPerYearMerged = []
    for (let key in pubTypesPerYear) {
        d = {}
        d["year"] = key

        for (let i = 0; i < pubTypesList.length; i++) {
            d[pubTypesList[i]] = 0
        }
        for (let value in pubTypesPerYear[key]) {
            d[value] += pubTypesPerYear[key][value]
        }
        pubTypesPerYearMerged.push(d)
    }

    var dataset = []
    for (let i = 0; i < pubTypesPerYearMerged.length; i++) {
        entry = []
        for (let key in pubTypesPerYearMerged[i]) {
            entry.push(pubTypesPerYearMerged[i][key])
        }
        dataset.push(entry)   
    }

    var yPerYear = {}
    for (let i = 0; i < pubYearsList.length; i++) {
        yPerYear[pubYearsList[i]] = 0
    }  

    var yListPerType = []
    for (let i = 0; i < pubTypesList.length; i++) {
        yListPerType.push(yPerYear)
    }

    stackedData = []
    for (let i = 0; i < pubTypesList.length; i++) {
        l = []
        for (let j = 0; j < pubYearsList.length; j++) {
            l2 = []
            l2.push(yListPerType[i][pubYearsList[j]])
            yListPerType[i][pubYearsList[j]] += pubTypesPerYearMerged[j][pubTypesList[i]]
            l2.push(yListPerType[i][pubYearsList[j]])
            l2.pubType = pubTypesList[i]
            l2.data = pubTypesPerYearMerged[j]

            l.push(l2)
        }
        l.key = pubTypesList[i] 
        l.index = i 
        stackedData.push(l)
    }

    maxValue = -Number.MAX_VALUE;
    yListPerType.forEach(function (o) {
        Object.keys(o).forEach(function (k) {                
            maxValue = Math.max(maxValue, o[k]);
        });
    });

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#typerPerPub")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container2", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
        // X axis
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(pubYearsList)
    .padding(0.2);
        
    let xAxisGenerator = d3.axisBottom(xScale)
    if(pubYearsList.length > 10) {
        xAxisGenerator.tickFormat(d => (d%2 != 0) ? "" : d)
    }

    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));


    colors = ['#9b5fe0','#16a4d8','#60dbe8', '#8bd346', '#efdf48', '#f9a52c', '#d64e12']

    if(pubTypesList.length > colors.length) {
        for(let i = 0; i < pubTypesList.length - colors.length; i++) {
            c = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
            colors.push(c)
        }
    }

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
    .domain(pubTypesList)
    .range(colors)

   // create tooltip element  
   const tooltip = d3.select("body")
   .append("div")
   .attr("class","d3-tooltip")
   .style("position", "absolute")
   .style("z-index", "10")
   .style("visibility", "hidden")
   .style("padding", "15px")
   .style("background", "rgba(0,0,0,0.6)")
   .style("border-radius", "5px")
   .style("color", "#fff")
   .text("a simple tooltip");

   svg.append("g")
            .call(xAxisGenerator)
            .attr("transform", "translate(0," + height + ")")
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
   svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Publications By Type Per Year");

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(event, d) {
  var subgroupName = d3.select(this.parentNode).datum().key;
  var subgroupValue = d.data[subgroupName];
  tooltip.html("Publication Type: " + subgroupName + "<br>" + "Value: " + subgroupValue).style("visibility", "visible");
  d3.select(this).attr("fill", shadeColor(color(d.pubType), -15));
}
var mousemove = function(event, d) {
    tooltip
    .style("top", (event.pageY-10)+"px")
    .style("left",(event.pageX+10)+"px");
}
var mouseleave = function(event, d) {
    tooltip.html(``).style("visibility", "hidden");
    d3.select(this).attr("fill", color(d.pubType));
}

// Show the bars
svg.append("g")
  .selectAll("g")
  // Enter in the stack data = loop key per key = group per group
  .data(stackedData)
  .enter().append("g")
    .attr("fill", function(d) { return color(d.key); })
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d) { return xScale(d.data.year); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("stroke", "grey")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

    xCircleCoordinate = 310
    yCircleCoordinate = 10

    xTextCoordinate = 315
    yTextCoordinate = 10
    for (let i = 0; i < pubTypesList.length; i++) {

        svg.append("circle").attr("cx",xCircleCoordinate).attr("cy",yCircleCoordinate).attr("r", 2).style("fill", color(pubTypesList[i]))
        svg.append("text").attr("x", xTextCoordinate).attr("y", yTextCoordinate).text(pubTypesList[i]).style("font-size", "6px").attr("alignment-baseline","middle")

        yCircleCoordinate += 20
        yTextCoordinate += 20
    }
}

function createBarChartPubArea() {
    // Step 1
    pubs = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.pubAreaCount;
    
    // Step - 1
    // Create the array of key-value pairs
    var items = Object.keys(pubs).map(
    (key) => { return [key, pubs[key]] });
  
    // Step - 2
    // Sort the array based on the second element (i.e. the value)
    items.sort(
        (first, second) => { return second[1] - first[1] }
    );
  
    // Step - 3
    // Obtain the list of keys in sorted order of the values.
    var types = items.map(
        (e) => { return e[0] });
    
    var n_types = items.map(
        (e) => { return e[1] });
    
    var dataset = [];
    for (let i = 0; i < types.length; i++) {
        dataset.push([types[i], n_types[i]]);
    }

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#areaPerPub")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container1", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
    dataset.sort(function(a,b){return b[1] - a[1];}); 
    
    types = [];
    n_types = [];

    for (let i = 0; i < dataset.length; i++) {
        types.push(dataset[i][0])
        n_types.push(dataset[i][1])
    }
        // X axis
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(types)
    .padding(0.2);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "8px");

    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(n_types)])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));

    // create tooltip element  
    const tooltip = d3.select("body")
      .append("div")
      .attr("class","d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "15px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("border-radius", "5px")
      .style("color", "#fff")
      .text("a simple tooltip");

    bar_color = "#69b3a2"
    // Bars
    svg.selectAll("mybar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("fill", bar_color)
    .attr("x", function(d) { return xScale(d[0]); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d[1]); })
    .on("mouseover", function(event, d) {
        tooltip.html(`${d[1]} publications`).style("visibility", "visible");
        d3.select(this)
          .attr("fill", shadeColor(bar_color, -15));
    })
    .on("mousemove", function(){
        tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
    })
    .on("mouseout", function() {
        tooltip.html(``).style("visibility", "hidden");
        d3.select(this).attr("fill", bar_color);
    });

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Publications' Areas");
}

function createBarChartAuthorArea() {
    // Step 1
    pubs = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authorPubAreaCount;
    
    // Step - 1
    // Create the array of key-value pairs
    var items = Object.keys(pubs).map(
    (key) => { return [key, pubs[key]] });
  
    // Step - 2
    // Sort the array based on the second element (i.e. the value)
    items.sort(
        (first, second) => { return second[1] - first[1] }
    );
  
    // Step - 3
    // Obtain the list of keys in sorted order of the values.
    var types = items.map(
        (e) => { return e[0] });
    
    var n_types = items.map(
        (e) => { return e[1] });

    var dataset = [];
    for (let i = 0; i < types.length; i++) {
        dataset.push([types[i], n_types[i]]);
    }

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#areaPerPub2")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container1", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
    dataset.sort(function(a,b){return b[1] - a[1];}); 
    
    types = [];
    n_types = [];

    for (let i = 0; i < dataset.length; i++) {
        types.push(dataset[i][0])
        n_types.push(dataset[i][1])
    }
        // X axis
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(types)
    .padding(0.2);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "8px");

    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(n_types)])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));

    // create tooltip element  
    const tooltip = d3.select("body")
      .append("div")
      .attr("class","d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "15px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("border-radius", "5px")
      .style("color", "#fff")
      .text("a simple tooltip");

    bar_color = "#69b3a2"
    // Bars
    svg.selectAll("mybar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("fill", bar_color)
    .attr("x", function(d) { return xScale(d[0]); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d[1]); })
    .on("mouseover", function(event, d) {
        tooltip.html(`${d[1]} publications`).style("visibility", "visible");
        d3.select(this)
          .attr("fill", shadeColor(bar_color, -15));
    })
    .on("mousemove", function(){
        tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
    })
    .on("mouseout", function() {
        tooltip.html(``).style("visibility", "hidden");
        d3.select(this).attr("fill", bar_color);
    });

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Authors' Areas");
}

function createBarChartPubPerAuthorArea() {

    // Step 1
    pubs = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authorPubAreaRatioCount;
    
    // Step - 1
    // Create the array of key-value pairs
    var items = Object.keys(pubs).map(
    (key) => { return [key, pubs[key]] });
  
    // Step - 2
    // Sort the array based on the second element (i.e. the value)
    items.sort(
        (first, second) => { return second[1] - first[1] }
    );
    
    // Step - 3
    // Obtain the list of keys in sorted order of the values.
    var types = items.map(
        (e) => { return e[0] });
    
    var n_types = items.map(
        (e) => { return e[1] });

    var dataset = [];
    for (let i = 0; i < types.length; i++) {
        dataset.push([types[i], n_types[i]]);
    }

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#areaPerPub2")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container2", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
    dataset.sort(function(a,b){return b[1] - a[1];}); 
    
    types = [];
    n_types = [];

    for (let i = 0; i < dataset.length; i++) {
        types.push(dataset[i][0])
        n_types.push(dataset[i][1])
    }
        // X axis
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(types)
    .padding(0.2);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "8px");

    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(n_types)])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));

    // create tooltip element  
    const tooltip = d3.select("body")
      .append("div")
      .attr("class","d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "15px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("border-radius", "5px")
      .style("color", "#fff")
      .text("a simple tooltip");

    bar_color = "#69b3a2"
    // Bars
    svg.selectAll("mybar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("fill", bar_color)
    .attr("x", function(d) { return xScale(d[0]); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d[1]); })
    .on("mouseover", function(event, d) {
        tooltip.html(`${d[1]} publications`).style("visibility", "visible");
        d3.select(this)
          .attr("fill", shadeColor(bar_color, -15));
    })
    .on("mousemove", function(){
        tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
    })
    .on("mouseout", function() {
        tooltip.html(``).style("visibility", "hidden");
        d3.select(this).attr("fill", bar_color);
    });

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Publications Per Authors' Area Ratio");
}

function createBarChartPubAreaPerYear() {
    // Step 1
    pubs = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.publications;
    
    pubs.sort((a, b) => (a.pub_year > b.pub_year) ? 1 : -1)
    pubYearsList = []
    pubTypesList = []
    for (let i = 0; i < pubs.length; i++) {
        if(!(pubYearsList.includes(pubs[i].pub_year))) {
            pubYearsList.push(pubs[i].pub_year)
        }
        if(!(pubTypesList.includes(pubs[i].pub_area_tag_acronym))) {
            pubTypesList.push(pubs[i].pub_area_tag_acronym)
        }
    }

    pubYearsList.sort((a, b) => (a > b) ? 1 : -1)
    pubTypesList.sort()
    
    pubTypesCounter = {}
    pubTypesPerYear = {}

    for (let i = 0; i < pubYearsList.length; i++) {
        pubTypesPerYear[pubYearsList[i]] = {}
    }

    pubYearsListAux = []
    for (let i = 0; i < pubs.length; i++) {
        if(!(pubYearsListAux.includes(pubs[i].pub_year))) {
            pubTypesCounter = {}
            pubTypesCounter[pubs[i].pub_area_tag_acronym] = 1
            pubYearsListAux.push(pubs[i].pub_year)
        }
        else {
            if(!(pubs[i].pub_area_tag_acronym in pubTypesCounter)) {
                pubTypesCounter[pubs[i].pub_area_tag_acronym] = 1
            }
            else {
                pubTypesCounter[pubs[i].pub_area_tag_acronym] += 1
            }
        }
        pubTypesPerYear[pubs[i].pub_year] = pubTypesCounter
    }

    var pubTypesPerYearMerged = []
    for (let key in pubTypesPerYear) {
        d = {}
        d["year"] = key

        for (let i = 0; i < pubTypesList.length; i++) {
            d[pubTypesList[i]] = 0
        }
        for (let value in pubTypesPerYear[key]) {
            d[value] += pubTypesPerYear[key][value]
        }
        pubTypesPerYearMerged.push(d)
    }

    var dataset = []
    for (let i = 0; i < pubTypesPerYearMerged.length; i++) {
        entry = []
        for (let key in pubTypesPerYearMerged[i]) {
            entry.push(pubTypesPerYearMerged[i][key])
        }
        dataset.push(entry)   
    }

    var yPerYear = {}
    for (let i = 0; i < pubYearsList.length; i++) {
        yPerYear[pubYearsList[i]] = 0
    }  

    var yListPerType = []
    for (let i = 0; i < pubTypesList.length; i++) {
        yListPerType.push(yPerYear)
    }

    stackedData = []
    for (let i = 0; i < pubTypesList.length; i++) {
        l = []
        for (let j = 0; j < pubYearsList.length; j++) {
            l2 = []
            l2.push(yListPerType[i][pubYearsList[j]])
            yListPerType[i][pubYearsList[j]] += pubTypesPerYearMerged[j][pubTypesList[i]]
            l2.push(yListPerType[i][pubYearsList[j]])
            l2.pubType = pubTypesList[i]
            l2.data = pubTypesPerYearMerged[j]

            l.push(l2)
        }
        l.key = pubTypesList[i] 
        l.index = i 
        stackedData.push(l)
    }

    maxValue = -Number.MAX_VALUE;
    yListPerType.forEach(function (o) {
        Object.keys(o).forEach(function (k) {                
            maxValue = Math.max(maxValue, o[k]);
        });
    });

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#areaPerPub")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container2", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
        // X axis
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(pubYearsList)
    .padding(0.2);

    let xAxisGenerator = d3.axisBottom(xScale)
    if(pubYearsList.length > 10) {
        xAxisGenerator.tickFormat(d => (d%2 != 0) ? "" : d)
    }
    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));
    
    colors = ['#9b5fe0','#16a4d8','#60dbe8', '#8bd346', '#efdf48', '#f9a52c', '#d64e12', '#012a61', '#6c9336']

    if(pubTypesList.length > colors.length) {
        for(let i = 0; i < pubTypesList.length - colors.length; i++) {
            c = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
            colors.push(c)
        }
    }

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
    .domain(pubTypesList)
    .range(colors)

   // create tooltip element  
   const tooltip = d3.select("body")
   .append("div")
   .attr("class","d3-tooltip")
   .style("position", "absolute")
   .style("z-index", "10")
   .style("visibility", "hidden")
   .style("padding", "15px")
   .style("background", "rgba(0,0,0,0.6)")
   .style("border-radius", "5px")
   .style("color", "#fff")
   .text("a simple tooltip");

   svg.append("g")
            .call(xAxisGenerator)
            .attr("transform", "translate(0," + height + ")")
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
   svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Publications By Research Area Per Year");

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(event, d) {
  var subgroupName = d3.select(this.parentNode).datum().key;
  var subgroupValue = d.data[subgroupName];
  tooltip.html("Publication Type: " + subgroupName + "<br>" + "Value: " + subgroupValue).style("visibility", "visible");
  d3.select(this).attr("fill", shadeColor(color(d.pubType), -15));
}
var mousemove = function(event, d) {
    tooltip
    .style("top", (event.pageY-10)+"px")
    .style("left",(event.pageX+10)+"px");
}
var mouseleave = function(event, d) {
    tooltip.html(``).style("visibility", "hidden");
    d3.select(this).attr("fill", color(d.pubType));
}

// Show the bars
svg.append("g")
  .selectAll("g")
  // Enter in the stack data = loop key per key = group per group
  .data(stackedData)
  .enter().append("g")
    .attr("fill", function(d) { return color(d.key); })
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d) { return xScale(d.data.year); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("stroke", "grey")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

    xCircleCoordinate = 310
    yCircleCoordinate = 10

    xTextCoordinate = 315
    yTextCoordinate = 10
    for (let i = 0; i < pubTypesList.length; i++) {

        svg.append("circle").attr("cx",xCircleCoordinate).attr("cy",yCircleCoordinate).attr("r", 2).style("fill", color(pubTypesList[i]))
        svg.append("text").attr("x", xTextCoordinate).attr("y", yTextCoordinate).text(pubTypesList[i]).style("font-size", "6px").attr("alignment-baseline","middle")

        yCircleCoordinate += 20
        yTextCoordinate += 20
    }
}

function createBarChartNCollabPubs() {
    // Step 1
    citations = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.collabs_per_year;

    citationsYears = Object.keys(citations);
    citationsNumber = Object.values(citations);

    citationsYears.sort((a, b) => (a > b) ? 1 : -1)
    var dataset = [];

    for (let i = 0; i < citationsYears.length; i++) {
        dataset.push([citationsYears[i], citationsNumber[i]]);
    }

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#collabsPerYear")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container1", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
        // X axis
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(citationsYears)
    .padding(0.2);
    
    let xAxisGenerator = d3.axisBottom(xScale)
    if(citationsYears.length > 10) {
        xAxisGenerator.tickFormat(d => (d%2 != 0) ? "" : d)
    }

    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(citationsNumber)])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));

    // create tooltip element  
    const tooltip = d3.select("body")
      .append("div")
      .attr("class","d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "15px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("border-radius", "5px")
      .style("color", "#fff")
      .text("a simple tooltip");

    bar_color = "#69b3a2"
    // Bars
    svg.selectAll("mybar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("fill", bar_color)
    .attr("x", function(d) { return xScale(d[0]); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d[1]); })
    .on("mouseover", function(event, d) {
        tooltip.html(`${d[1]} publications`).style("visibility", "visible");
        d3.select(this)
          .attr("fill", shadeColor(bar_color, -15));
    })
    .on("mousemove", function(){
        tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
    })
    .on("mouseout", function() {
        tooltip.html(``).style("visibility", "hidden");
        d3.select(this).attr("fill", bar_color);
    });

    svg.append("g")
            .call(xAxisGenerator)
            .attr("transform", "translate(0," + height + ")")
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("International Collaborations Per Year");
}

function createBarChartNStudentCollabPubs() {
    // Step 1
    citations = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.student_collabs_per_year;

    citationsYears = Object.keys(citations);
    citationsNumber = Object.values(citations);

    citationsYears.sort((a, b) => (a > b) ? 1 : -1)
    var dataset = [];

    for (let i = 0; i < citationsYears.length; i++) {
        dataset.push([citationsYears[i], citationsNumber[i]]);
    }

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#collabsPerYear")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container2", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
        // X axis
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(citationsYears)
    .padding(0.2);
        
    let xAxisGenerator = d3.axisBottom(xScale)
    if(citationsYears.length > 10) {
        xAxisGenerator.tickFormat(d => (d%2 != 0) ? "" : d)
    }

    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(citationsNumber)])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));

    // create tooltip element  
    const tooltip = d3.select("body")
      .append("div")
      .attr("class","d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "15px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("border-radius", "5px")
      .style("color", "#fff")
      .text("a simple tooltip");

    bar_color = "#69b3a2"
    // Bars
    svg.selectAll("mybar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("fill", bar_color)
    .attr("x", function(d) { return xScale(d[0]); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d[1]); })
    .on("mouseover", function(event, d) {
        tooltip.html(`${d[1]} publications`).style("visibility", "visible");
        d3.select(this)
          .attr("fill", shadeColor(bar_color, -15));
    })
    .on("mousemove", function(){
        tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
    })
    .on("mouseout", function() {
        tooltip.html(``).style("visibility", "hidden");
        d3.select(this).attr("fill", bar_color);
    });

    svg.append("g")
            .call(xAxisGenerator)
            .attr("transform", "translate(0," + height + ")")
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Student Collaborations Per Year");
}

function listPublications() {
    publications = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.publications
  
    publications.sort((a, b) => (a.pub_year < b.pub_year) ? 1 : -1)
    
    var allGroup = ["Publication Year", "Citations Count", "Type", "Title", "Author", "Area Tag", "International Collaboration", "Student Collaboration"]

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    d3.select("#selectButton").on("change", function(d) {
        deleteChild("#tableBody")
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        if(selectedOption == "Publication Year") {
            publications.sort((a, b) => (a.pub_year < b.pub_year) ? 1 : -1)
        }
        if(selectedOption == "Citations Count") {
            publications.sort((a, b) => (a.citations_count < b.citations_count) ? 1 : -1)
        }
        if(selectedOption == "Type") {
            publications.sort((a, b) => (a.pub_type > b.pub_type) ? 1 : -1)
        }
        if(selectedOption == "Title") {
            publications.sort((a, b) => (a.title > b.title) ? 1 : -1)
        }
        if(selectedOption == "Author") {
            publications.sort((a, b) => (a.author > b.author) ? 1 : -1)
        }
        if(selectedOption == "Area Tag") {
            publications.sort((a, b) => (a.pub_area_tag > b.pub_area_tag) ? 1 : -1)
        }
        if(selectedOption == "International Collaboration") {
            publications.sort((a, b) => (a.inter_colab < b.inter_colab) ? 1 : -1)
        }
        if(selectedOption == "Student Collaboration") {
            publications.sort((a, b) => (a.collab_students < b.collab_students) ? 1 : -1)
        }

        for (let i = 0; i < publications.length; i++) {
            var item = document.createElement("tr");
    
            var number = document.createElement("td");
            number.setAttribute("class", "t-op-nextlvl");
            number.innerHTML = i + 1
            var title = document.createElement("td");
            title.setAttribute("class", "t-op-nextlvl");
            title.innerHTML = publications[i].title;
            var author = document.createElement("td");
            author.setAttribute("class", "t-op-nextlvl");
            author.innerHTML = publications[i].author;
            var year = document.createElement("td");
            year.setAttribute("class", "t-op-nextlvl");
            year.innerHTML = publications[i].pub_year;
            var area = document.createElement("td");
            area.setAttribute("class", "t-op-nextlvl");
            area.innerHTML = publications[i].pub_area_tag;
            var citations = document.createElement("td");
            citations.setAttribute("class", "t-op-nextlvl");
            citations.innerHTML = publications[i].citations_count;
            var type = document.createElement("td");
            type.setAttribute("class", "t-op-nextlvl");
            type.innerHTML = publications[i].pub_type;
            var collab = document.createElement("td");
            collab.setAttribute("class", "t-op-nextlvl");
            collab.innerHTML = publications[i].inter_colab;
            var studentCollab = document.createElement("td");
            studentCollab.setAttribute("class", "t-op-nextlvl");
            studentCollab.innerHTML = publications[i].collab_students;
    
            item.appendChild(number);
            item.appendChild(title);
            item.appendChild(author);
            item.appendChild(year);
            item.appendChild(area);
            item.appendChild(citations);
            item.appendChild(type);
            item.appendChild(collab);
            item.appendChild(studentCollab);
            
            item.onclick = function() {
                localStorage.setItem("selectedPublication", JSON.stringify(publications[i].title));
                window.location.href = "platform/web_pages/publicationsInfo.html";
            };

            document.getElementById("tableBody").appendChild(item);
        }
    })

    publications.sort((a, b) => (a.pub_year < b.pub_year) ? 1 : -1)
    for (let i = 0; i < publications.length; i++) {
        var item = document.createElement("tr");

        var number = document.createElement("td");
        number.setAttribute("class", "t-op-nextlvl");
        number.innerHTML = i + 1
        var title = document.createElement("td");
        title.setAttribute("class", "t-op-nextlvl");
        title.innerHTML = publications[i].title;
        var author = document.createElement("td");
        author.setAttribute("class", "t-op-nextlvl");
        author.innerHTML = publications[i].author;
        var year = document.createElement("td");
        year.setAttribute("class", "t-op-nextlvl");
        year.innerHTML = publications[i].pub_year;
        var area = document.createElement("td");
        area.setAttribute("class", "t-op-nextlvl");
        area.innerHTML = publications[i].pub_area_tag;
        var citations = document.createElement("td");
        citations.setAttribute("class", "t-op-nextlvl");
        citations.innerHTML = publications[i].citations_count;
        var type = document.createElement("td");
        type.setAttribute("class", "t-op-nextlvl");
        type.innerHTML = publications[i].pub_type;
        var collab = document.createElement("td");
        collab.setAttribute("class", "t-op-nextlvl");
        collab.innerHTML = publications[i].inter_colab;
        var studentCollab = document.createElement("td");
        studentCollab.setAttribute("class", "t-op-nextlvl");
        studentCollab.innerHTML = publications[i].collab_students;

        item.appendChild(number);
        item.appendChild(title);
        item.appendChild(author);
        item.appendChild(year);
        item.appendChild(area);
        item.appendChild(citations);
        item.appendChild(type);
        item.appendChild(collab);
        item.appendChild(studentCollab);
        
        item.onclick = function() {
            localStorage.setItem("selectedPublication", JSON.stringify(publications[i].title));
            window.location.href = "platform/web_pages/publicationsInfo.html";
        };

        document.getElementById("tableBody").appendChild(item);
    }
}

function listDashboardAuthors() {
    authors = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors
    
    authors.sort((a, b) => (a.start_research_year < b.start_research_year) ? 1 : -1)
    
    var allGroup = ["Start Research Year", "End Research Year", "Graduation Year", "Status", "Type", "Citations Count", "Nº of Publications", 
    "Citations/Publications Ratio", "Name", "Research Area", "Affiliation", "Nº of International Collaborations", "Nº of Student Collaborations"]

    // add the options to the button
    d3.select("#selectButtonAuthor")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    d3.select("#selectButtonAuthor").on("change", function(d) {
        deleteChild("#tableBody2")
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        if(selectedOption == "Start Research Year") {
            authors.sort((a, b) => (a.start_research_year < b.start_research_year) ? 1 : -1)
        }
        if(selectedOption == "End Research Year") {
            authors.sort((a, b) => (a.end_research_year < b.end_research_year) ? 1 : -1)
        }
        if(selectedOption == "Graduation Year") {
            authors.sort((a, b) => (a.graduation_year < b.graduation_year) ? 1 : -1)
        }
        if(selectedOption == "Status") {
            authors.sort((a, b) => (a.status > b.status) ? 1 : -1)
        }
        if(selectedOption == "Type") {
            authors.sort((a, b) => (a.type > b.type) ? 1 : -1)
        }
        if(selectedOption == "Citations Count") {
            authors.sort((a, b) => (a.citations_count < b.citations_count) ? 1 : -1)
        }
        if(selectedOption == "Nº of Publications") {
            authors.sort((a, b) => (a.number_of_publications < b.number_of_publications) ? 1 : -1)
        }
        if(selectedOption == "Citations/Publications Ratio") {
            authors.sort((a, b) => (a.citations_count/a.number_of_publications < b.citations_count/b.number_of_publications) ? 1 : -1)
        }
        if(selectedOption == "Research Area") {
            authors.sort((a, b) => (a.research_area > b.research_area) ? 1 : -1)
        }
        if(selectedOption == "Name") {
            authors.sort((a, b) => (a.author > b.author) ? 1 : -1)
        }
        if(selectedOption == "Nº of International Collaborations") {
            authors.sort((a, b) => (a.number_of_international_pubs < b.number_of_international_pubs) ? 1 : -1)
        }
        if(selectedOption == "Nº of Student Collaborations") {
            authors.sort((a, b) => (a.number_of_student_collabs < b.number_of_student_collabs) ? 1 : -1)
        }

        for (let i = 0; i < authors.length; i++) {
            var item = document.createElement("tr");
    
            var number = document.createElement("td");
            number.setAttribute("class", "t-op-nextlvl");
            number.innerHTML = i + 1
            var name = document.createElement("td");
            name.setAttribute("class", "t-op-nextlvl");
            name.innerHTML = authors[i].author;
            var affiliation = document.createElement("td");
            affiliation.setAttribute("class", "t-op-nextlvl");
            affiliation.innerHTML = authors[i].affiliation;
            var status = document.createElement("td");
            status.setAttribute("class", "t-op-nextlvl");
            status.innerHTML = authors[i].status;
            var type = document.createElement("td");
            type.setAttribute("class", "t-op-nextlvl");
            type.innerHTML = authors[i].type;
            var area = document.createElement("td");
            area.setAttribute("class", "t-op-nextlvl");
            area.innerHTML = authors[i].research_area;
            var citations = document.createElement("td");
            citations.setAttribute("class", "t-op-nextlvl");
            citations.innerHTML = authors[i].citations_count;
            var pubNumber = document.createElement("td");
            pubNumber.setAttribute("class", "t-op-nextlvl");
            pubNumber.innerHTML = authors[i].number_of_publications;
            var startYear = document.createElement("td");
            startYear.setAttribute("class", "t-op-nextlvl");
            startYear.innerHTML = authors[i].start_research_year;
            var endYear = document.createElement("td");
            endYear.setAttribute("class", "t-op-nextlvl");
            endYear.innerHTML = authors[i].end_research_year;
            var graduationYear = document.createElement("td");
            graduationYear.setAttribute("class", "t-op-nextlvl");
            graduationYear.innerHTML = authors[i].graduation_year;
            var internationalCollab = document.createElement("td");
            internationalCollab.setAttribute("class", "t-op-nextlvl");
            internationalCollab.innerHTML = authors[i].number_of_international_pubs;
            var studentCollab = document.createElement("td");
            studentCollab.setAttribute("class", "t-op-nextlvl");
            studentCollab.innerHTML = authors[i].number_of_student_collabs;
    
            item.appendChild(number);
            item.appendChild(name);
            item.appendChild(affiliation);
            item.appendChild(status);
            item.appendChild(type);
            item.appendChild(area);
            item.appendChild(citations);
            item.appendChild(pubNumber);
            item.appendChild(startYear);
            item.appendChild(endYear);
            item.appendChild(graduationYear);
            item.appendChild(internationalCollab);
            item.appendChild(studentCollab);
            
            item.onclick = function() {
                localStorage.setItem("selectedAuthor", JSON.stringify(authors[i].author));
                window.location.href = "platform/web_pages/authorInfo.html";
            };

            document.getElementById("tableBody2").appendChild(item);
        }
    })

    authors.sort((a, b) => (a.start_research_year < b.start_research_year) ? 1 : -1)
    for (let i = 0; i < authors.length; i++) {
        var item = document.createElement("tr");
        var number = document.createElement("td");
        number.setAttribute("class", "t-op-nextlvl");
        number.innerHTML = i + 1
        var name = document.createElement("td");
        name.setAttribute("class", "t-op-nextlvl");
        name.innerHTML = authors[i].author;
        var affiliation = document.createElement("td");
        affiliation.setAttribute("class", "t-op-nextlvl");
        affiliation.innerHTML = authors[i].affiliation;
        var status = document.createElement("td");
        status.setAttribute("class", "t-op-nextlvl");
        status.innerHTML = authors[i].status;
        var type = document.createElement("td");
        type.setAttribute("class", "t-op-nextlvl");
        type.innerHTML = authors[i].type;
        var area = document.createElement("td");
        area.setAttribute("class", "t-op-nextlvl");
        area.innerHTML = authors[i].research_area;
        var citations = document.createElement("td");
        citations.setAttribute("class", "t-op-nextlvl");
        citations.innerHTML = authors[i].citations_count;
        var pubNumber = document.createElement("td");
        pubNumber.setAttribute("class", "t-op-nextlvl");
        pubNumber.innerHTML = authors[i].number_of_publications;
        var startYear = document.createElement("td");
        startYear.setAttribute("class", "t-op-nextlvl");
        startYear.innerHTML = authors[i].start_research_year;
        var endYear = document.createElement("td");
        endYear.setAttribute("class", "t-op-nextlvl");
        endYear.innerHTML = authors[i].end_research_year;
        var graduationYear = document.createElement("td");
        graduationYear.setAttribute("class", "t-op-nextlvl");
        graduationYear.innerHTML = authors[i].graduation_year;
        var internationalCollab = document.createElement("td");
        internationalCollab.setAttribute("class", "t-op-nextlvl");
        internationalCollab.innerHTML = authors[i].number_of_international_pubs;
        var studentCollab = document.createElement("td");
        studentCollab.setAttribute("class", "t-op-nextlvl");
        studentCollab.innerHTML = authors[i].number_of_student_collabs;

        item.appendChild(number);
        item.appendChild(name);
        item.appendChild(affiliation);
        item.appendChild(status);
        item.appendChild(type);
        item.appendChild(area);
        item.appendChild(citations);
        item.appendChild(pubNumber);
        item.appendChild(startYear);
        item.appendChild(endYear);
        item.appendChild(graduationYear);
        item.appendChild(internationalCollab);
        item.appendChild(studentCollab);
        
        item.onclick = function() {
            localStorage.setItem("selectedAuthor", JSON.stringify(authors[i].author));
            window.location.href = "platform/web_pages/authorInfo.html";
        };

        document.getElementById("tableBody2").appendChild(item);
    }
}

function areaLabelsMeaning() {
    deleteChild("#tableBody3")
  
    areaLabels = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.research_areas
    
    var sorted_keys = Object.keys(areaLabels);
    sorted_keys.sort();
    
    for (let i = 0; i < sorted_keys.length; i++) {
        var item = document.createElement("tr");
        var number = document.createElement("td");
        number.setAttribute("class", "t-op-nextlvl");
        number.innerHTML = i + 1
        var title = document.createElement("td");
        title.setAttribute("class", "t-op-nextlvl");
        title.innerHTML = sorted_keys[i];
        var author = document.createElement("td");
        author.setAttribute("class", "t-op-nextlvl");
        author.innerHTML = areaLabels[sorted_keys[i]];

        item.appendChild(number);
        item.appendChild(title);
        item.appendChild(author);
        
        document.getElementById("tableBody3").appendChild(item);
    }
  
}

function topCitatedAuthors() {
    deleteChild("#topCitadedAuthors")
  
    authors = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors
    
    authors.sort((a, b) => (a.citations_count < b.citations_count) ? 1 : -1)
  
    for (let i = 0; i < authors.length; i++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        var span = document.createElement("span");
        span.setAttribute("class", "product")
        span.innerHTML = (i+1) + " - " + authors[i].author
  
        a.appendChild(span);
        li.appendChild(a);
  
        var span2 = document.createElement("span");
        span2.setAttribute("class", "product")
        span2.innerHTML = authors[i].citations_count + " Citations"
        li.appendChild(span2);
        
        document.getElementById("topCitadedAuthors").appendChild(li);
    }
  
}
  
function topCitatedAuthorsRatio() {
    deleteChild("#topCitadedAuthors")
  
    authors = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors
  
    authors.sort((a, b) => (a.citations_count/a.number_of_publications < b.citations_count/b.number_of_publications) ? 1 : -1)
    for (let i = 0; i < authors.length; i++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        var span = document.createElement("span");
        span.setAttribute("class", "product")
        span.innerHTML = (i+1) + " - " + authors[i].author
  
        a.appendChild(span);
        li.appendChild(a);
  
        var span2 = document.createElement("span");
        span2.setAttribute("class", "product")
        span2.innerHTML = authors[i].citations_count + " Citations/" + authors[i].number_of_publications + " Publications" 
        li.appendChild(span2);
        
        document.getElementById("topCitadedAuthors").appendChild(li);
    }
  
}

function topCitadedPublications() {
    publications = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.publications
  
    publications.sort((a, b) => (a.citations_count < b.citations_count) ? 1 : -1)

    for (let i = 0; i < publications.length; i++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        var span = document.createElement("span");
        span.setAttribute("class", "product")
        span.innerHTML = (i+1) + " - " + publications[i].title

        a.appendChild(span);
        li.appendChild(a);

        var span2 = document.createElement("span");
        span2.setAttribute("class", "product")
        span2.innerHTML = publications[i].citations_count + " Citations"
        li.appendChild(span2);
        
        document.getElementById("topCitadedPublications").appendChild(li);
    }
}

/*Authors*/
function filterAuthorsByName() {
    var input, filter, table, tr, td, i, txtValue, filterAsciiTntValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    filterAsciiTntValue = filter.normalize("NFD").replace(/[^\x00-\x7F]/g, "")
    table = document.getElementById("authorsList");
    tr = table.getElementsByTagName("div");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("div");
      for (j = 0; j < td.length; j++) {
        authorH2 = td[j].getElementsByTagName("h2")[0];
        if (td) {
            txtValue = authorH2.textContent || authorH2.innerText;
            asciiTntValue = txtValue.normalize("NFD").replace(/[^\x00-\x7F]/g, "")
            if (asciiTntValue.toUpperCase().indexOf(filterAsciiTntValue) > -1) {
                td[j].style.display = "";
            } else {
                td[j].style.display = "none";
            }
          }  
      }       
    }
}

function defineValuesAuthor() {

    selectedAuthor = JSON.parse(localStorage.getItem("selectedAuthor"));

    authors = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors;
    for (let i = 0; i < authors.length; i++) {
        if(authors[i].author == selectedAuthor) {
            document.getElementById("citationsCount").innerHTML = numberWithCommas(authors[i].citations_count);
            document.getElementById("citationsCount5").innerHTML = numberWithCommas(authors[i].citations_count5);
            document.getElementById("hIndex").innerHTML = numberWithCommas(authors[i].h_index);
            document.getElementById("hIndex5").innerHTML = numberWithCommas(authors[i].h_index5);
            document.getElementById("i10Index").innerHTML = numberWithCommas(authors[i].i10_index);
            document.getElementById("i10Index5").innerHTML = numberWithCommas(authors[i].i10_index5);
            document.getElementById("nPublications").innerHTML = numberWithCommas(authors[i].number_of_publications);
            document.getElementById("authorPageImg").src = authors[i].picture
            document.getElementById("name").innerHTML = selectedAuthor
            document.getElementById("researchArea").innerHTML = authors[i].research_area
            document.getElementById("affiliation").innerHTML = authors[i].affiliation
            document.getElementById("status").innerHTML = authors[i].status
            document.getElementById("type").innerHTML = authors[i].type
            document.getElementById("startYear").innerHTML = authors[i].start_research_year
            document.getElementById("endYear").innerHTML = authors[i].end_research_year
            document.getElementById("graduationYear").innerHTML = authors[i].graduation_year
            document.getElementById("cmuAdvisor").innerHTML = authors[i].cmu_advisor
            document.getElementById("ptAdvisor").innerHTML = authors[i].pt_advisor
            document.getElementById("googleLink").innerHTML = authors[i].google_scholar_link
            link = document.getElementById("googleLink") 
            url = "window.location.href = '" + authors[i].google_scholar_link + "';" 
            link.setAttribute("onclick", url)
            document.getElementById("nCollab").innerHTML = authors[i].number_of_international_pubs
            document.getElementById("nStudentCollab").innerHTML = authors[i].number_of_student_collabs
        }
    }
}

function createAuthorBarChart() {
    selectedAuthor = JSON.parse(localStorage.getItem("selectedAuthor"));

    authors = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors;
    var citations;
    var cmuPortugalYear;
    for (let i = 0; i < authors.length; i++) {
        if(authors[i].author == selectedAuthor) {
            citations = authors[i].citations_per_year;
            cmuPortugalYear = authors[i].start_research_year;
        }
    }
    // Step 1

    citationsYears = Object.keys(citations);
    citationsNumber = Object.values(citations);

    citationsYears.sort((a, b) => (a > b) ? 1 : -1)
    var dataset = [];

    for (let i = 0; i < citationsYears.length; i++) {
        dataset.push([citationsYears[i], citationsNumber[i]]);
    }

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#citationsPerYear")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container1", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
        // X axis
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(citationsYears)
    .padding(0.2);
        
    let xAxisGenerator = d3.axisBottom(xScale)
    if(citationsYears.length > 10) {
        xAxisGenerator.tickFormat(d => (d%2 != 0) ? "" : d)
    }

    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(citationsNumber)])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));

    // create tooltip element  
    const tooltip = d3.select("body")
      .append("div")
      .attr("class","d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "15px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("border-radius", "5px")
      .style("color", "#fff")
      .text("a simple tooltip");

    bar_color = "#69b3a2"
    // Bars
    svg.selectAll("mybar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("fill", bar_color)
    .attr("x", function(d) { return xScale(d[0]); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d[1]); })
    .on("mouseover", function(event, d) {
        tooltip.html(`${d[1]} citations`).style("visibility", "visible");
        d3.select(this)
          .attr("fill", shadeColor(bar_color, -15));
    })
    .on("mousemove", function(){
        tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
    })
    .on("mouseout", function() {
        tooltip.html(``).style("visibility", "hidden");
        d3.select(this).attr("fill", bar_color);
    });

    svg.append("g")
            .call(xAxisGenerator)
            .attr("transform", "translate(0," + height + ")")
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Citations Per Year");
}

function createAuthorBarChartNPubs() {

    selectedAuthor = JSON.parse(localStorage.getItem("selectedAuthor"));

    authors = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors;
    var citations;
    for (let i = 0; i < authors.length; i++) {
        if(authors[i].author == selectedAuthor) {
            citations = authors[i].pubs_per_year;
        }
    }
    // Step 1
    citationsYears = Object.keys(citations);
    citationsNumber = Object.values(citations);
    
    citationsYears.sort((a, b) => (a > b) ? 1 : -1)
    var dataset = [];

    for (let i = 0; i < citationsYears.length; i++) {
        dataset.push([citationsYears[i], citationsNumber[i]]);
    }

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#citationsPerYear")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container2", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
        // X axis
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(citationsYears)
    .padding(0.2);
        
    let xAxisGenerator = d3.axisBottom(xScale)
    if(citationsYears.length > 10) {
        xAxisGenerator.tickFormat(d => (d%2 != 0) ? "" : d)
    }

    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(citationsNumber)])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));

    // create tooltip element  
    const tooltip = d3.select("body")
      .append("div")
      .attr("class","d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "15px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("border-radius", "5px")
      .style("color", "#fff")
      .text("a simple tooltip");

    bar_color = "#69b3a2"
    // Bars
    svg.selectAll("mybar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("fill", bar_color)
    .attr("x", function(d) { return xScale(d[0]); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d[1]); })
    .on("mouseover", function(event, d) {
        tooltip.html(`${d[1]} publications`).style("visibility", "visible");
        d3.select(this)
          .attr("fill", shadeColor(bar_color, -15));
    })
    .on("mousemove", function(){
        tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
    })
    .on("mouseout", function() {
        tooltip.html(``).style("visibility", "hidden");
        d3.select(this).attr("fill", bar_color);
    });

    svg.append("g")
            .call(xAxisGenerator)
            .attr("transform", "translate(0," + height + ")")
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Publications Per Year");
}

function createLineChart() {

    // Step 1
    citations = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.citations_per_year;

    citationsYears = Object.keys(citations);
    citationsNumber = Object.values(citations);

    firstYear = parseInt(citationsYears[0]);
    cmuPortugalYear = 2006;
    cmuPortugalYearAux = cmuPortugalYear;
    while(cmuPortugalYearAux < firstYear) {
        citationsYears.unshift(cmuPortugalYearAux.toString());
        citationsNumber.unshift(0)
        cmuPortugalYearAux += 1;
    }

    var dataset = [];

    for (let i = 0; i < citationsYears.length; i++) {
        dataset.push([citationsYears[i], citationsNumber[i]]);
    }

    
    // Step 3
    var svg = d3.select("#citationsPerYear"),
        margin = 200,
        width = svg.attr("width") - margin, //300
        height = svg.attr("height") - margin //200

    // Step 4 
    var xScale = d3.scaleLinear().domain([d3.min(citationsYears), d3.max(citationsYears)]).range([0, width]),
        yScale = d3.scaleLinear().domain([d3.min(citationsNumber), d3.max(citationsNumber)]).range([height, 0]);
            
    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    // Step 5
    // Title
    svg.append('text')
    .attr('x', width/2 + 100)
    .attr('y', 100)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', 20)
    .text('Citations Per Year');
    
    // X label
    svg.append('text')
    .attr('x', width/2 + 100)
    .attr('y', height - 15 + 150)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', 12)
    .text('Years');
    
    // Y label
    svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(60,' + height + ')rotate(-90)')
    .style('font-family', 'Helvetica')
    .style('font-size', 12)
    .text('Citations #');

    // Step 6
    g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
        
    g.append("g")
         .call(d3.axisLeft(yScale));
    
    // Step 7
    svg.append('g')
    .selectAll("dot")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return xScale(d[0]); } )
    .attr("cy", function (d) { return yScale(d[1]); } )
    .attr("r", 3)
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .style("fill", "#CC0000");

    // Step 8        
    var line = d3.line()
    .x(function(d) { return xScale(d[0]); }) 
    .y(function(d) { return yScale(d[1]); }) 
    .curve(d3.curveMonotoneX)
    
    svg.append("path")
    .datum(dataset) 
    .attr("class", "line") 
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .attr("d", line)
    .style("fill", "none")
    .style("stroke", "#CC0000")
    .style("stroke-width", "2");
}

function deleteChild(id) {
  var e = document.querySelector(id);
  var first = e.firstElementChild;
  while (first) {
      first.remove();
      first = e.firstElementChild;
  }
}

function topCitadedAuthorPublications() {

    selectedAuthor = JSON.parse(localStorage.getItem("selectedAuthor"));

    authors = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors;
    var publications;
    for (let i = 0; i < authors.length; i++) {
        if(authors[i].author == selectedAuthor) {
            publications = authors[i].publications;
        }
    }
  
    publications.sort((a, b) => (a.citations_count < b.citations_count) ? 1 : -1)

    for (let i = 0; i < publications.length; i++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        var span = document.createElement("span");
        span.setAttribute("class", "product")
        span.innerHTML = (i+1) + " - " + publications[i].title

        a.appendChild(span);
        li.appendChild(a);

        var span2 = document.createElement("span");
        span2.setAttribute("class", "product")
        span2.innerHTML = publications[i].citations_count + " Citations"
        li.appendChild(span2);
        
        document.getElementById("topCitadedPublications").appendChild(li);
    }
}

function listAuthors() {
  authors = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors
  
  var allGroup = ["Name", "Research Area", "Status", "Type", "Start Research Year", "End Research Year", "Graduation Year"]

    // add the options to the button
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button

    d3.select("#selectButton").on("change", function(d) {
        input = document.getElementById("myInput");
        input.value = ""
        deleteChild("#authorsList")
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        if(selectedOption == "Name") {
            authors.sort((a, b) => (a.author > b.author) ? 1 : -1)
        }
        if(selectedOption == "Research Area") {
            authors.sort((a, b) => (a.research_area > b.research_area) ? 1 : -1)
        }
        if(selectedOption == "Status") {
            authors.sort((a, b) => (a.status > b.status) ? 1 : -1)
        }
        if(selectedOption == "Type") {
            authors.sort((a, b) => (a.type > b.type) ? 1 : -1)
        }
        if(selectedOption == "Start Research Year") {
            authors.sort((a, b) => (a.start_research_year > b.start_research_year) ? 1 : -1)
        }
        if(selectedOption == "End Research Year") {
            authors.sort((a, b) => (a.end_research_year > b.end_research_year) ? 1 : -1)
        }
        if(selectedOption == "Graduation Year") {
            authors.sort((a, b) => (a.graduation_year > b.graduation_year) ? 1 : -1)
        }

        var row;
        for (let i = 0; i < authors.length; i++) {
          var remainder = i % 3;
          if (remainder == 0){
              row = document.createElement("div")
              row.setAttribute("class", "row");
          } 
          
          var column = document.createElement("div")
          var card = document.createElement("div")
          var img = document.createElement("img");
          var container = document.createElement("div")
          var header = document.createElement("h2")
          var area = document.createElement("p");
          var status = document.createElement("p");
          var type = document.createElement("p");
          var starYear = document.createElement("p");
          var endYear = document.createElement("p");
          var graduationYear = document.createElement("p");
          var seeProfile = document.createElement("p");
          var button = document.createElement("button");
          
          img.setAttribute("class", "authorImg");
          column.setAttribute("class", "column");
          card.setAttribute("class", "card");
          container.setAttribute("class", "container");
          area.setAttribute("class", "title");
          button.setAttribute("class", "button");
      
          img.src = authors[i].picture;
          header.innerHTML = authors[i].author;
          area.innerHTML = authors[i].research_area;
          status.innerHTML += "Status: " + authors[i].status;
          type.innerHTML += "Type: " +authors[i].type
          starYear.innerHTML += "Start Researh Year: " + authors[i].start_research_year;
          endYear.innerHTML += "End Researh Year: " + authors[i].end_research_year;
          graduationYear.innerHTML += "Graduation Year: " + authors[i].graduation_year;
          button.innerHTML = "See Profile";
      
          button.onclick = function() {
              localStorage.setItem("selectedAuthor", JSON.stringify(authors[i].author));
              window.location.href = "authorInfo.html";
          };
      
          seeProfile.appendChild(button)
      
          container.appendChild(header)
          container.appendChild(area)
          container.appendChild(status)
          container.appendChild(type)
          container.appendChild(starYear)
          container.appendChild(endYear)
          container.appendChild(graduationYear)
          container.appendChild(seeProfile)
          
          card.appendChild(img)
          card.appendChild(container)
          column.appendChild(card)
      
          row.appendChild(column)
          document.getElementById("authorsList").appendChild(row);
        }
    })

  var row;
  for (let i = 0; i < authors.length; i++) {
    var remainder = i % 3;
    if (remainder == 0){
        row = document.createElement("div")
        row.setAttribute("class", "row");
    } 
    
    var column = document.createElement("div")
    var card = document.createElement("div")
    var img = document.createElement("img");
    var container = document.createElement("div")
    var header = document.createElement("h2")
    var area = document.createElement("p");
    var status = document.createElement("p");
    var type = document.createElement("p");
    var starYear = document.createElement("p");
    var endYear = document.createElement("p");
    var graduationYear = document.createElement("p");
    var seeProfile = document.createElement("p");
    var button = document.createElement("button");
    
    img.setAttribute("class", "authorImg");
    column.setAttribute("class", "column"); 
    card.setAttribute("class", "card");
    container.setAttribute("class", "container");
    area.setAttribute("class", "title");
    button.setAttribute("class", "button");

    img.src = authors[i].picture;
    header.innerHTML = authors[i].author;
    area.innerHTML = authors[i].research_area;
    status.innerHTML += "Status: " + authors[i].status;
    type.innerHTML += "Type: " +authors[i].type
    starYear.innerHTML += "Start Researh Year: " + authors[i].start_research_year;
    endYear.innerHTML += "End Researh Year: " + authors[i].end_research_year;
    graduationYear.innerHTML += "Graduation Year: " + authors[i].graduation_year;
    button.innerHTML = "See Profile";

    button.onclick = function() {
        localStorage.setItem("selectedAuthor", JSON.stringify(authors[i].author));
        window.location.href = "authorInfo.html";
    };

    seeProfile.appendChild(button)

    container.appendChild(header)
    container.appendChild(area)
    container.appendChild(status)
    container.appendChild(type)
    container.appendChild(starYear)
    container.appendChild(endYear)
    container.appendChild(graduationYear)
    container.appendChild(seeProfile)
    
    card.appendChild(img)
    card.appendChild(container)
    column.appendChild(card)

    row.appendChild(column)
    document.getElementById("authorsList").appendChild(row);
  }
}

function createAuthorBarChartPubTypes() {
    selectedAuthor = JSON.parse(localStorage.getItem("selectedAuthor"));

    authors = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors;
    var pubs;
    for (let i = 0; i < authors.length; i++) {
        if(authors[i].author == selectedAuthor) {
            pubs = authors[i].publications;
        }
    }
    // Step 1
    pubs.sort((a, b) => (a.pub_type > b.pub_type) ? 1 : -1)
    
    pubTypes = {}
    for (let i = 0; i < pubs.length; i++) {
        if(!(pubs[i].pub_type in pubTypes)) {
            pubTypes[pubs[i].pub_type] = 1
        }
        else {
            pubTypes[pubs[i].pub_type] += 1
        }
    }    
    types = Object.keys(pubTypes);
    n_types = Object.values(pubTypes);

    var dataset = [];
    for (let i = 0; i < types.length; i++) {
        dataset.push([types[i], n_types[i]]);
    }

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#typerPerPub")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container1", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
    dataset.sort(function(a,b){return b[1] - a[1];}); 
    
    types = [];
    n_types = [];

    for (let i = 0; i < dataset.length; i++) {
        types.push(dataset[i][0])
        n_types.push(dataset[i][1])
    }
        // X axis
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(types)
    .padding(0.2);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "8px");

    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(n_types)])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));

    // create tooltip element  
    const tooltip = d3.select("body")
      .append("div")
      .attr("class","d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "15px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("border-radius", "5px")
      .style("color", "#fff")
      .text("a simple tooltip");

    bar_color = "#69b3a2"
    // Bars
    svg.selectAll("mybar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("fill", bar_color)
    .attr("x", function(d) { return xScale(d[0]); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d[1]); })
    .on("mouseover", function(event, d) {
        tooltip.html(`${d[1]} publications`).style("visibility", "visible");
        d3.select(this)
          .attr("fill", shadeColor(bar_color, -15));
    })
    .on("mousemove", function(){
        tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
    })
    .on("mouseout", function() {
        tooltip.html(``).style("visibility", "hidden");
        d3.select(this).attr("fill", bar_color);
    });

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Publications' Types");
}

function createAuthorBarChartPubTypesPerYear() {
    // Step 1
    selectedAuthor = JSON.parse(localStorage.getItem("selectedAuthor"));

    authors = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors;
    var pubs;
    for (let i = 0; i < authors.length; i++) {
        if(authors[i].author == selectedAuthor) {
            pubs = authors[i].publications;
        }
    }
    
    pubs.sort((a, b) => (a.pub_year > b.pub_year) ? 1 : -1)
    pubYearsList = []
    pubTypesList = []
    for (let i = 0; i < pubs.length; i++) {
        if(!(pubYearsList.includes(pubs[i].pub_year))) {
            pubYearsList.push(pubs[i].pub_year)
        }
        if(!(pubTypesList.includes(pubs[i].pub_type))) {
            pubTypesList.push(pubs[i].pub_type)
        }
    }

    pubYearsList.sort((a, b) => (a > b) ? 1 : -1)
    pubTypesList.sort()
    
    pubTypesCounter = {}
    pubTypesPerYear = {}

    for (let i = 0; i < pubYearsList.length; i++) {
        pubTypesPerYear[pubYearsList[i]] = {}
    }

    pubYearsListAux = []
    for (let i = 0; i < pubs.length; i++) {
        if(!(pubYearsListAux.includes(pubs[i].pub_year))) {
            pubTypesCounter = {}
            pubTypesCounter[pubs[i].pub_type] = 1
            pubYearsListAux.push(pubs[i].pub_year)
        }
        else {
            if(!(pubs[i].pub_type in pubTypesCounter)) {
                pubTypesCounter[pubs[i].pub_type] = 1
            }
            else {
                pubTypesCounter[pubs[i].pub_type] += 1
            }
        }
        pubTypesPerYear[pubs[i].pub_year] = pubTypesCounter
    }

    var pubTypesPerYearMerged = []
    for (let key in pubTypesPerYear) {
        d = {}
        d["year"] = key

        for (let i = 0; i < pubTypesList.length; i++) {
            d[pubTypesList[i]] = 0
        }
        for (let value in pubTypesPerYear[key]) {
            d[value] += pubTypesPerYear[key][value]
        }
        pubTypesPerYearMerged.push(d)
    }

    var dataset = []
    for (let i = 0; i < pubTypesPerYearMerged.length; i++) {
        entry = []
        for (let key in pubTypesPerYearMerged[i]) {
            entry.push(pubTypesPerYearMerged[i][key])
        }
        dataset.push(entry)   
    }

    var yPerYear = {}
    for (let i = 0; i < pubYearsList.length; i++) {
        yPerYear[pubYearsList[i]] = 0
    }  

    var yListPerType = []
    for (let i = 0; i < pubTypesList.length; i++) {
        yListPerType.push(yPerYear)
    }

    stackedData = []
    for (let i = 0; i < pubTypesList.length; i++) {
        l = []
        for (let j = 0; j < pubYearsList.length; j++) {
            l2 = []
            l2.push(yListPerType[i][pubYearsList[j]])
            yListPerType[i][pubYearsList[j]] += pubTypesPerYearMerged[j][pubTypesList[i]]
            l2.push(yListPerType[i][pubYearsList[j]])
            l2.pubType = pubTypesList[i]
            l2.data = pubTypesPerYearMerged[j]

            l.push(l2)
        }
        l.key = pubTypesList[i] 
        l.index = i 
        stackedData.push(l)
    }
    
    maxValue = -Number.MAX_VALUE;
    yListPerType.forEach(function (o) {
        Object.keys(o).forEach(function (k) {                
            maxValue = Math.max(maxValue, o[k]);
        });
    });

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#typerPerPub")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container2", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
        // X axis
        
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(pubYearsList)
    .padding(0.2);
        
    let xAxisGenerator = d3.axisBottom(xScale)
    if(pubYearsList.length > 10) {
        xAxisGenerator.tickFormat(d => (d%2 != 0) ? "" : d)
    }

    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
    .domain(pubTypesList)
    .range(['#9b5fe0','#16a4d8','#60dbe8', '#8bd346', '#efdf48', '#f9a52c', '#d64e12'])

   // create tooltip element  
   const tooltip = d3.select("body")
   .append("div")
   .attr("class","d3-tooltip")
   .style("position", "absolute")
   .style("z-index", "10")
   .style("visibility", "hidden")
   .style("padding", "15px")
   .style("background", "rgba(0,0,0,0.6)")
   .style("border-radius", "5px")
   .style("color", "#fff")
   .text("a simple tooltip");

   svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Publications By Type Per Year");

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(event, d) {
  var subgroupName = d3.select(this.parentNode).datum().key;
  var subgroupValue = d.data[subgroupName];
  tooltip.html("Publication Type: " + subgroupName + "<br>" + "Value: " + subgroupValue).style("visibility", "visible");
  d3.select(this).attr("fill", shadeColor(color(d.pubType), -15));
}
var mousemove = function(event, d) {
    tooltip
    .style("top", (event.pageY-10)+"px")
    .style("left",(event.pageX+10)+"px");
}
var mouseleave = function(event, d) {
    tooltip.html(``).style("visibility", "hidden");
    d3.select(this).attr("fill", color(d.pubType));
}

svg.append("g")
            .call(xAxisGenerator)
            .attr("transform", "translate(0," + height + ")")
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
// Show the bars
svg.append("g")
  .selectAll("g")
  // Enter in the stack data = loop key per key = group per group
  .data(stackedData)
  .enter().append("g")
    .attr("fill", function(d) { return color(d.key); })
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d) { return xScale(d.data.year); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("stroke", "grey")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

    xCircleCoordinate = 310
    yCircleCoordinate = 10

    xTextCoordinate = 315
    yTextCoordinate = 10
    for (let i = 0; i < pubTypesList.length; i++) {

        svg.append("circle").attr("cx",xCircleCoordinate).attr("cy",yCircleCoordinate).attr("r", 2).style("fill", color(pubTypesList[i]))
        svg.append("text").attr("x", xTextCoordinate).attr("y", yTextCoordinate).text(pubTypesList[i]).style("font-size", "6px").attr("alignment-baseline","middle")

        yCircleCoordinate += 20
        yTextCoordinate += 20
    }
}

function createAuthorBarChartPubArea() {
    // Step 1
    selectedAuthor = JSON.parse(localStorage.getItem("selectedAuthor"));

    authors = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors;
    var pubs;
    for (let i = 0; i < authors.length; i++) {
        if(authors[i].author == selectedAuthor) {
            pubs = authors[i].publications;
        }
    }

    pubs.sort((a, b) => (a.pub_area_tag > b.pub_area_tag) ? 1 : -1)
    
    pubTypes = {}
    for (let i = 0; i < pubs.length; i++) {
        if(!(pubs[i].pub_area_tag in pubTypes)) {
            pubTypes[pubs[i].pub_area_tag] = 1
        }
        else {
            pubTypes[pubs[i].pub_area_tag] += 1
        }
    }    
    types = Object.keys(pubTypes);
    n_types = Object.values(pubTypes);

    var dataset = [];
    for (let i = 0; i < types.length; i++) {
        dataset.push([types[i], n_types[i]]);
    }

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#areaPerPub")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container1", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
    dataset.sort(function(a,b){return b[1] - a[1];}); 
    
    types = [];
    n_types = [];

    for (let i = 0; i < dataset.length; i++) {
        types.push(dataset[i][0])
        n_types.push(dataset[i][1])
    }
        // X axis
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(types)
    .padding(0.2);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "8px");

    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(n_types)])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));

    // create tooltip element  
    const tooltip = d3.select("body")
      .append("div")
      .attr("class","d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "15px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("border-radius", "5px")
      .style("color", "#fff")
      .text("a simple tooltip");

    bar_color = "#69b3a2"
    // Bars
    svg.selectAll("mybar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("fill", bar_color)
    .attr("x", function(d) { return xScale(d[0]); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d[1]); })
    .on("mouseover", function(event, d) {
        tooltip.html(`${d[1]} publications`).style("visibility", "visible");
        d3.select(this)
          .attr("fill", shadeColor(bar_color, -15));
    })
    .on("mousemove", function(){
        tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
    })
    .on("mouseout", function() {
        tooltip.html(``).style("visibility", "hidden");
        d3.select(this).attr("fill", bar_color);
    });

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Publications' Areas");
}

function createAuthorBarChartPubAreaPerYear() {
    // Step 1
    selectedAuthor = JSON.parse(localStorage.getItem("selectedAuthor"));

    authors = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors;
    var pubs;
    for (let i = 0; i < authors.length; i++) {
        if(authors[i].author == selectedAuthor) {
            pubs = authors[i].publications;
        }
    }
    
    pubs.sort((a, b) => (a.pub_year > b.pub_year) ? 1 : -1)
    pubYearsList = []
    pubTypesList = []
    for (let i = 0; i < pubs.length; i++) {
        if(!(pubYearsList.includes(pubs[i].pub_year))) {
            pubYearsList.push(pubs[i].pub_year)
        }

        for(let j = 0; j < pubs[i].pub_area_tag.length; j++) {
            if(!(pubTypesList.includes(pubs[i].pub_area_tag[j]))) {
                pubTypesList.push(pubs[i].pub_area_tag[j])
            }
        }
    }

    firstYear = parseInt(pubYearsList[0]);
    cmuPortugalYear = 2006;
    cmuPortugalYearAux = cmuPortugalYear;
    while(cmuPortugalYearAux < firstYear) {
        pubYearsList.unshift(cmuPortugalYearAux.toString());
        cmuPortugalYearAux += 1;
    }

    pubYearsList.sort((a, b) => (a > b) ? 1 : -1)
    pubTypesList.sort()
    
    pubTypesCounter = {}
    pubTypesPerYear = {}

    for (let i = 0; i < pubYearsList.length; i++) {
        pubTypesPerYear[pubYearsList[i]] = {}
    }

    pubYearsListAux = []
    for (let i = 0; i < pubs.length; i++) {
        if(!(pubYearsListAux.includes(pubs[i].pub_year))) {
            pubTypesCounter = {}
            pubTypesCounter[pubs[i].pub_area_tag] = 1
            pubYearsListAux.push(pubs[i].pub_year)
        }
        else {
            if(!(pubs[i].pub_area_tag in pubTypesCounter)) {
                pubTypesCounter[pubs[i].pub_area_tag] = 1
            }
            else {
                pubTypesCounter[pubs[i].pub_area_tag] += 1
            }
        }
        pubTypesPerYear[pubs[i].pub_year] = pubTypesCounter
    }

    var pubTypesPerYearMerged = []
    for (let key in pubTypesPerYear) {
        d = {}
        d["year"] = key

        for (let i = 0; i < pubTypesList.length; i++) {
            d[pubTypesList[i]] = 0
        }
        for (let value in pubTypesPerYear[key]) {
            d[value] += pubTypesPerYear[key][value]
        }
        pubTypesPerYearMerged.push(d)
    }

    var dataset = []
    for (let i = 0; i < pubTypesPerYearMerged.length; i++) {
        entry = []
        for (let key in pubTypesPerYearMerged[i]) {
            entry.push(pubTypesPerYearMerged[i][key])
        }
        dataset.push(entry)   
    }

    var yPerYear = {}
    for (let i = 0; i < pubYearsList.length; i++) {
        yPerYear[pubYearsList[i]] = 0
    }  

    var yListPerType = []
    for (let i = 0; i < pubTypesList.length; i++) {
        yListPerType.push(yPerYear)
    }

    stackedData = []
    for (let i = 0; i < pubTypesList.length; i++) {
        l = []
        for (let j = 0; j < pubYearsList.length; j++) {
            l2 = []
            l2.push(yListPerType[i][pubYearsList[j]])
            yListPerType[i][pubYearsList[j]] += pubTypesPerYearMerged[j][pubTypesList[i]]
            l2.push(yListPerType[i][pubYearsList[j]])
            l2.pubType = pubTypesList[i]
            l2.data = pubTypesPerYearMerged[j]

            l.push(l2)
        }
        l.key = pubTypesList[i] 
        l.index = i 
        stackedData.push(l)
    }

    maxValue = -Number.MAX_VALUE;
    yListPerType.forEach(function (o) {
        Object.keys(o).forEach(function (k) {                
            maxValue = Math.max(maxValue, o[k]);
        });
    });

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#areaPerPub")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container2", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
        // X axis
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(pubYearsList)
    .padding(0.2);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));
    
    colors = ['#9b5fe0','#16a4d8','#60dbe8', '#8bd346', '#efdf48', '#f9a52c', '#d64e12', '#012a61', '#6c9336']

    if(pubTypesList.length > colors.length) {
        for(let i = 0; i < pubTypesList.length - colors.length; i++) {
            c = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
            colors.push(c)
        }
    }
    
    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
    .domain(pubTypesList)
    .range(colors)

   // create tooltip element  
   const tooltip = d3.select("body")
   .append("div")
   .attr("class","d3-tooltip")
   .style("position", "absolute")
   .style("z-index", "10")
   .style("visibility", "hidden")
   .style("padding", "15px")
   .style("background", "rgba(0,0,0,0.6)")
   .style("border-radius", "5px")
   .style("color", "#fff")
   .text("a simple tooltip");

   svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Publications By Research Area Per Year");

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(event, d) {
  var subgroupName = d3.select(this.parentNode).datum().key;
  var subgroupValue = d.data[subgroupName];
  tooltip.html("Publication Type: " + subgroupName + "<br>" + "Value: " + subgroupValue).style("visibility", "visible");
  d3.select(this).attr("fill", shadeColor(color(d.pubType), -15));
}
var mousemove = function(event, d) {
    tooltip
    .style("top", (event.pageY-10)+"px")
    .style("left",(event.pageX+10)+"px");
}
var mouseleave = function(event, d) {
    tooltip.html(``).style("visibility", "hidden");
    d3.select(this).attr("fill", color(d.pubType));
}

// Show the bars
svg.append("g")
  .selectAll("g")
  // Enter in the stack data = loop key per key = group per group
  .data(stackedData)
  .enter().append("g")
    .attr("fill", function(d) { return color(d.key); })
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d) { return xScale(d.data.year); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("stroke", "grey")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

    xCircleCoordinate = 310
    yCircleCoordinate = 30

    xTextCoordinate = 320
    yTextCoordinate = 30
    for (let i = 0; i < pubTypesList.length; i++) {

        svg.append("circle").attr("cx",xCircleCoordinate).attr("cy",yCircleCoordinate).attr("r", 2).style("fill", color(pubTypesList[i]))
        svg.append("text").attr("x", xTextCoordinate).attr("y", yTextCoordinate).text(pubTypesList[i]).style("font-size", "6px").attr("alignment-baseline","middle")

        yCircleCoordinate += 30
        yTextCoordinate += 30
    }
}

function createBarChartNAuthorCollabPubs() {
    selectedAuthor = JSON.parse(localStorage.getItem("selectedAuthor"));

    authors = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors;
    var citations;
    for (let i = 0; i < authors.length; i++) {
        if(authors[i].author == selectedAuthor) {
            citations = authors[i].collabs_per_year;
        }
    }
    // Step 1
    citationsYears = Object.keys(citations);
    citationsNumber = Object.values(citations);
    
    citationsYears.sort((a, b) => (a > b) ? 1 : -1)
    var dataset = [];

    for (let i = 0; i < citationsYears.length; i++) {
        dataset.push([citationsYears[i], citationsNumber[i]]);
    }

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#collabsPerYear")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container1", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
        // X axis
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(citationsYears)
    .padding(0.2);
        
    let xAxisGenerator = d3.axisBottom(xScale)
    if(citationsYears.length > 10) {
        xAxisGenerator.tickFormat(d => (d%2 != 0) ? "" : d)
    }

    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(citationsNumber)])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));

    // create tooltip element  
    const tooltip = d3.select("body")
      .append("div")
      .attr("class","d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "15px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("border-radius", "5px")
      .style("color", "#fff")
      .text("a simple tooltip");

    bar_color = "#69b3a2"
    // Bars
    svg.selectAll("mybar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("fill", bar_color)
    .attr("x", function(d) { return xScale(d[0]); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d[1]); })
    .on("mouseover", function(event, d) {
        tooltip.html(`${d[1]} publications`).style("visibility", "visible");
        d3.select(this)
          .attr("fill", shadeColor(bar_color, -15));
    })
    .on("mousemove", function(){
        tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
    })
    .on("mouseout", function() {
        tooltip.html(``).style("visibility", "hidden");
        d3.select(this).attr("fill", bar_color);
    });

    svg.append("g")
            .call(xAxisGenerator)
            .attr("transform", "translate(0," + height + ")")
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("International Collaborations Per Year");
}

function createBarChartNAuthorStudentCollabPubs() {
    selectedAuthor = JSON.parse(localStorage.getItem("selectedAuthor"));

    authors = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors;
    var citations;
    
    for (let i = 0; i < authors.length; i++) {
        if(authors[i].author == selectedAuthor) {
            citations = authors[i].student_collabs_per_year;
        }
    }
    // Step 1
    citationsYears = Object.keys(citations);
    citationsNumber = Object.values(citations);
    
    citationsYears.sort((a, b) => (a > b) ? 1 : -1)
    var dataset = [];

    for (let i = 0; i < citationsYears.length; i++) {
        dataset.push([citationsYears[i], citationsNumber[i]]);
    }

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#collabsPerYear")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container2", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
        // X axis
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(citationsYears)
    .padding(0.2);
        
    let xAxisGenerator = d3.axisBottom(xScale)
    if(citationsYears.length > 10) {
        xAxisGenerator.tickFormat(d => (d%2 != 0) ? "" : d)
    }

    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(citationsNumber)])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));

    // create tooltip element  
    const tooltip = d3.select("body")
      .append("div")
      .attr("class","d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "15px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("border-radius", "5px")
      .style("color", "#fff")
      .text("a simple tooltip");

    bar_color = "#69b3a2"
    // Bars
    svg.selectAll("mybar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("fill", bar_color)
    .attr("x", function(d) { return xScale(d[0]); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d[1]); })
    .on("mouseover", function(event, d) {
        tooltip.html(`${d[1]} publications`).style("visibility", "visible");
        d3.select(this)
          .attr("fill", shadeColor(bar_color, -15));
    })
    .on("mousemove", function(){
        tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
    })
    .on("mouseout", function() {
        tooltip.html(``).style("visibility", "hidden");
        d3.select(this).attr("fill", bar_color);
    });

    svg.append("g")
            .call(xAxisGenerator)
            .attr("transform", "translate(0," + height + ")")
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Student Collaborations Per Year");
}

function listAuthorsPublications() {
    selectedAuthor = JSON.parse(localStorage.getItem("selectedAuthor"));

    authors = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors;
    var publications;
    for (let i = 0; i < authors.length; i++) {
        if(authors[i].author == selectedAuthor) {
            publications = authors[i].publications;
        }
    }
    
    var allGroup = ["Publication Year", "Citations Count", "Type", "Title", "Author", "Area Tag", "International Collaboration", "Student Collaboration"]

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    d3.select("#selectButton").on("change", function(d) {
        deleteChild("#tableBody")
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        if(selectedOption == "Publication Year") {
            publications.sort((a, b) => (a.pub_year < b.pub_year) ? 1 : -1)
        }
        if(selectedOption == "Citations Count") {
            publications.sort((a, b) => (a.citations_count < b.citations_count) ? 1 : -1)
        }
        if(selectedOption == "Type") {
            publications.sort((a, b) => (a.pub_type > b.pub_type) ? 1 : -1)
        }
        if(selectedOption == "Title") {
            publications.sort((a, b) => (a.title > b.title) ? 1 : -1)
        }
        if(selectedOption == "Author") {
            publications.sort((a, b) => (a.author > b.author) ? 1 : -1)
        }
        if(selectedOption == "Area Tag") {
            publications.sort((a, b) => (a.pub_area_tag > b.pub_area_tag) ? 1 : -1)
        }
        if(selectedOption == "International Collaboration") {
            publications.sort((a, b) => (a.inter_colab < b.inter_colab) ? 1 : -1)
        }
        if(selectedOption == "Student Collaboration") {
            publications.sort((a, b) => (a.collab_students < b.collab_students) ? 1 : -1)
        }

        for (let i = 0; i < publications.length; i++) {
            var item = document.createElement("tr");
    
            var number = document.createElement("td");
            number.setAttribute("class", "t-op-nextlvl");
            number.innerHTML = i + 1
            var title = document.createElement("td");
            title.setAttribute("class", "t-op-nextlvl");
            title.innerHTML = publications[i].title;
            var author = document.createElement("td");
            author.setAttribute("class", "t-op-nextlvl");
            author.innerHTML = publications[i].author;
            var year = document.createElement("td");
            year.setAttribute("class", "t-op-nextlvl");
            year.innerHTML = publications[i].pub_year;
            var area = document.createElement("td");
            area.setAttribute("class", "t-op-nextlvl");
            area.innerHTML = publications[i].pub_area_tag;
            var citations = document.createElement("td");
            citations.setAttribute("class", "t-op-nextlvl");
            citations.innerHTML = publications[i].citations_count;
            var type = document.createElement("td");
            type.setAttribute("class", "t-op-nextlvl");
            type.innerHTML = publications[i].pub_type;
            var collab = document.createElement("td");
            collab.setAttribute("class", "t-op-nextlvl");
            collab.innerHTML = publications[i].inter_colab;
            var studentCollab = document.createElement("td");
            studentCollab.setAttribute("class", "t-op-nextlvl");
            studentCollab.innerHTML = publications[i].collab_students;
    
            item.appendChild(number);
            item.appendChild(title);
            item.appendChild(author);
            item.appendChild(year);
            item.appendChild(area);
            item.appendChild(citations);
            item.appendChild(type);
            item.appendChild(collab);
            item.appendChild(studentCollab);
            
            item.onclick = function() {
                localStorage.setItem("selectedPublication", JSON.stringify(publications[i].title));
                window.location.href = "publicationsInfo.html";
            };

            document.getElementById("tableBody").appendChild(item);
        }
    })

    publications.sort((a, b) => (a.pub_year < b.pub_year) ? 1 : -1)
    for (let i = 0; i < publications.length; i++) {
        var item = document.createElement("tr");

        var number = document.createElement("td");
        number.setAttribute("class", "t-op-nextlvl");
        number.innerHTML = i + 1
        var title = document.createElement("td");
        title.setAttribute("class", "t-op-nextlvl");
        title.innerHTML = publications[i].title;
        var author = document.createElement("td");
        author.setAttribute("class", "t-op-nextlvl");
        author.innerHTML = publications[i].author;
        var year = document.createElement("td");
        year.setAttribute("class", "t-op-nextlvl");
        year.innerHTML = publications[i].pub_year;
        var area = document.createElement("td");
        area.setAttribute("class", "t-op-nextlvl");
        area.innerHTML = publications[i].pub_area_tag;
        var citations = document.createElement("td");
        citations.setAttribute("class", "t-op-nextlvl");
        citations.innerHTML = publications[i].citations_count;
        var type = document.createElement("td");
        type.setAttribute("class", "t-op-nextlvl");
        type.innerHTML = publications[i].pub_type;
        var collab = document.createElement("td");
        collab.setAttribute("class", "t-op-nextlvl");
        collab.innerHTML = publications[i].inter_colab;
        var studentCollab = document.createElement("td");
        studentCollab.setAttribute("class", "t-op-nextlvl");
        studentCollab.innerHTML = publications[i].collab_students;

        item.appendChild(number);
        item.appendChild(title);
        item.appendChild(author);
        item.appendChild(year);
        item.appendChild(area);
        item.appendChild(citations);
        item.appendChild(type);
        item.appendChild(collab);
        item.appendChild(studentCollab);
        
        item.onclick = function() {
            localStorage.setItem("selectedPublication", JSON.stringify(publications[i].title));
            window.location.href = "publicationsInfo.html";
        };

        document.getElementById("tableBody").appendChild(item);
    }
}

function listAuthorDashboardAuthors() {
    selectedAuthor = JSON.parse(localStorage.getItem("selectedAuthor"));

    authorsList = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors;
    var authorNames;
    for (let i = 0; i < authorsList.length; i++) {
        if(authorsList[i].author == selectedAuthor) {
            authorNames = authorsList[i].collab_students
        }
    }

    authors = []
    for (let i = 0; i < authorsList.length; i++) {
        for (let j = 0; j < authorNames.length; j++) {
            if(authorsList[i].author == authorNames[j]) {
                authors.push(authorsList[i])
            }
        }
    }

    authors.sort((a, b) => (a.start_research_year < b.start_research_year) ? 1 : -1)
    
    var allGroup = ["Start Research Year", "End Research Year", "Graduation Year", "Status", "Type", "Citations Count", "Nº of Publications", 
    "Citations/Publications Ratio", "Name", "Research Area", "Affiliation", "Nº of International Collaborations", "Nº of Student Collaborations"]

    // add the options to the button
    d3.select("#selectButtonAuthor")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    d3.select("#selectButtonAuthor").on("change", function(d) {
        deleteChild("#tableBody2")
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        if(selectedOption == "Start Research Year") {
            authors.sort((a, b) => (a.start_research_year < b.start_research_year) ? 1 : -1)
        }
        if(selectedOption == "End Research Year") {
            authors.sort((a, b) => (a.end_research_year < b.end_research_year) ? 1 : -1)
        }
        if(selectedOption == "Graduation Year") {
            authors.sort((a, b) => (a.graduation_year < b.graduation_year) ? 1 : -1)
        }
        if(selectedOption == "Status") {
            authors.sort((a, b) => (a.status > b.status) ? 1 : -1)
        }
        if(selectedOption == "Type") {
            authors.sort((a, b) => (a.type > b.type) ? 1 : -1)
        }
        if(selectedOption == "Citations Count") {
            authors.sort((a, b) => (a.citations_count < b.citations_count) ? 1 : -1)
        }
        if(selectedOption == "Publications Number") {
            authors.sort((a, b) => (a.number_of_publications < b.number_of_publications) ? 1 : -1)
        }
        if(selectedOption == "Citations/Publications Ratio") {
            authors.sort((a, b) => (a.citations_count/a.number_of_publications < b.citations_count/b.number_of_publications) ? 1 : -1)
        }
        if(selectedOption == "Research Area") {
            authors.sort((a, b) => (a.author > b.author) ? 1 : -1)
        }
        if(selectedOption == "Name") {
            authors.sort((a, b) => (a.author > b.author) ? 1 : -1)
        }
        if(selectedOption == "Nº of International Collaborations") {
            authors.sort((a, b) => (a.number_of_international_pubs < b.number_of_international_pubs) ? 1 : -1)
        }
        if(selectedOption == "Nº of Student Collaborations") {
            authors.sort((a, b) => (a.number_of_student_collabs < b.number_of_student_collabs) ? 1 : -1)
        }

        for (let i = 0; i < authors.length; i++) {
            var item = document.createElement("tr");
    
            var number = document.createElement("td");
            number.setAttribute("class", "t-op-nextlvl");
            number.innerHTML = i + 1
            var name = document.createElement("td");
            name.setAttribute("class", "t-op-nextlvl");
            name.innerHTML = authors[i].author;
            var affiliation = document.createElement("td");
            affiliation.setAttribute("class", "t-op-nextlvl");
            affiliation.innerHTML = authors[i].affiliation;
            var status = document.createElement("td");
            status.setAttribute("class", "t-op-nextlvl");
            status.innerHTML = authors[i].status;
            var type = document.createElement("td");
            type.setAttribute("class", "t-op-nextlvl");
            type.innerHTML = authors[i].type;
            var area = document.createElement("td");
            area.setAttribute("class", "t-op-nextlvl");
            area.innerHTML = authors[i].research_area;
            var citations = document.createElement("td");
            citations.setAttribute("class", "t-op-nextlvl");
            citations.innerHTML = authors[i].citations_count;
            var pubNumber = document.createElement("td");
            pubNumber.setAttribute("class", "t-op-nextlvl");
            pubNumber.innerHTML = authors[i].number_of_publications;
            var startYear = document.createElement("td");
            startYear.setAttribute("class", "t-op-nextlvl");
            startYear.innerHTML = authors[i].start_research_year;
            var endYear = document.createElement("td");
            endYear.setAttribute("class", "t-op-nextlvl");
            endYear.innerHTML = authors[i].end_research_year;
            var graduationYear = document.createElement("td");
            graduationYear.setAttribute("class", "t-op-nextlvl");
            graduationYear.innerHTML = authors[i].graduation_year;
            var internationalCollab = document.createElement("td");
            internationalCollab.setAttribute("class", "t-op-nextlvl");
            internationalCollab.innerHTML = authors[i].number_of_international_pubs;
            var studentCollab = document.createElement("td");
            studentCollab.setAttribute("class", "t-op-nextlvl");
            studentCollab.innerHTML = authors[i].number_of_student_collabs;
    
            item.appendChild(number);
            item.appendChild(name);
            item.appendChild(affiliation);
            item.appendChild(status);
            item.appendChild(type);
            item.appendChild(area);
            item.appendChild(citations);
            item.appendChild(pubNumber);
            item.appendChild(startYear);
            item.appendChild(endYear);
            item.appendChild(graduationYear);
            item.appendChild(internationalCollab);
            item.appendChild(studentCollab);
            
            item.onclick = function() {
                localStorage.setItem("selectedAuthor", JSON.stringify(authors[i].author));
                window.location.href = "authorInfo.html";
            };

            document.getElementById("tableBody2").appendChild(item);
        }
    })

    authors.sort((a, b) => (a.start_research_year < b.start_research_year) ? 1 : -1)
    for (let i = 0; i < authors.length; i++) {
        var item = document.createElement("tr");
        var number = document.createElement("td");
        number.setAttribute("class", "t-op-nextlvl");
        number.innerHTML = i + 1
        var name = document.createElement("td");
        name.setAttribute("class", "t-op-nextlvl");
        name.innerHTML = authors[i].author;
        var affiliation = document.createElement("td");
        affiliation.setAttribute("class", "t-op-nextlvl");
        affiliation.innerHTML = authors[i].affiliation;
        var status = document.createElement("td");
        status.setAttribute("class", "t-op-nextlvl");
        status.innerHTML = authors[i].status;
        var type = document.createElement("td");
        type.setAttribute("class", "t-op-nextlvl");
        type.innerHTML = authors[i].type;
        var area = document.createElement("td");
        area.setAttribute("class", "t-op-nextlvl");
        area.innerHTML = authors[i].research_area;
        var citations = document.createElement("td");
        citations.setAttribute("class", "t-op-nextlvl");
        citations.innerHTML = authors[i].citations_count;
        var pubNumber = document.createElement("td");
        pubNumber.setAttribute("class", "t-op-nextlvl");
        pubNumber.innerHTML = authors[i].number_of_publications;
        var startYear = document.createElement("td");
        startYear.setAttribute("class", "t-op-nextlvl");
        startYear.innerHTML = authors[i].start_research_year;
        var endYear = document.createElement("td");
        endYear.setAttribute("class", "t-op-nextlvl");
        endYear.innerHTML = authors[i].end_research_year;
        var graduationYear = document.createElement("td");
        graduationYear.setAttribute("class", "t-op-nextlvl");
        graduationYear.innerHTML = authors[i].graduation_year;
        var internationalCollab = document.createElement("td");
        internationalCollab.setAttribute("class", "t-op-nextlvl");
        internationalCollab.innerHTML = authors[i].number_of_international_pubs;
        var studentCollab = document.createElement("td");
        studentCollab.setAttribute("class", "t-op-nextlvl");
        studentCollab.innerHTML = authors[i].number_of_student_collabs;

        item.appendChild(number);
        item.appendChild(name);
        item.appendChild(affiliation);
        item.appendChild(status);
        item.appendChild(type);
        item.appendChild(area);
        item.appendChild(citations);
        item.appendChild(pubNumber);
        item.appendChild(startYear);
        item.appendChild(endYear);
        item.appendChild(graduationYear);
        item.appendChild(internationalCollab);
        item.appendChild(studentCollab);
        
        item.onclick = function() {
            localStorage.setItem("selectedAuthor", JSON.stringify(authors[i].author));
            window.location.href = "authorInfo.html";
        };

        document.getElementById("tableBody2").appendChild(item);
    }
}

function listAuthorsCollabStudents() {

    selectedAuthor = JSON.parse(localStorage.getItem("selectedAuthor"));

    authorsList = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors;
    var authorNames;
    for (let i = 0; i < authorsList.length; i++) {
        if(authorsList[i].author == selectedAuthor) {
            authorNames = authorsList[i].collab_students
        }
    }

    authors = []
    for (let i = 0; i < authorsList.length; i++) {
        for (let j = 0; j < authorNames.length; j++) {
            if(authorsList[i].author == authorNames[j]) {
                authors.push(authorsList[i])
            }
        }
    }

    authors.sort((a, b) => (a.start_research_year < b.start_research_year) ? 1 : -1)

    var allGroup = ["Name", "Research Area", "Status", "Type", "Start Research Year", "End Research Year", "Graduation Year"]
  
      // add the options to the button
      d3.select("#selectButton")
          .selectAll('myOptions')
          .data(allGroup)
          .enter()
          .append('option')
          .text(function (d) { return d; }) // text showed in the menu
          .attr("value", function (d) { return d; }) // corresponding value returned by the button
  
      d3.select("#selectButton").on("change", function(d) {
          deleteChild("#authorsList")
          // recover the option that has been chosen
          var selectedOption = d3.select(this).property("value")
          // run the updateChart function with this selected option
          if(selectedOption == "Name") {
              authors.sort((a, b) => (a.author > b.author) ? 1 : -1)
          }
          if(selectedOption == "Research Area") {
              authors.sort((a, b) => (a.research_area > b.research_area) ? 1 : -1)
          }
          if(selectedOption == "Status") {
              authors.sort((a, b) => (a.status > b.status) ? 1 : -1)
          }
          if(selectedOption == "Type") {
              authors.sort((a, b) => (a.type > b.type) ? 1 : -1)
          }
          if(selectedOption == "Start Research Year") {
              authors.sort((a, b) => (a.start_research_year > b.start_research_year) ? 1 : -1)
          }
          if(selectedOption == "End Research Year") {
              authors.sort((a, b) => (a.end_research_year > b.end_research_year) ? 1 : -1)
          }
          if(selectedOption == "Graduation Year") {
              authors.sort((a, b) => (a.graduation_year > b.graduation_year) ? 1 : -1)
          }
  
          var row;
          for (let i = 0; i < authors.length; i++) {
            var remainder = i % 3;
            if (remainder == 0){
                row = document.createElement("div")
                row.setAttribute("class", "row");
            } 
            
            var column = document.createElement("div")
            var card = document.createElement("div")
            var img = document.createElement("img");
            var container = document.createElement("div")
            var header = document.createElement("h2")
            var area = document.createElement("p");
            var status = document.createElement("p");
            var type = document.createElement("p");
            var starYear = document.createElement("p");
            var endYear = document.createElement("p");
            var graduationYear = document.createElement("p");
            var seeProfile = document.createElement("p");
            var button = document.createElement("button");
            
            img.setAttribute("class", "authorImg");
            column.setAttribute("class", "column");
            card.setAttribute("class", "card");
            container.setAttribute("class", "container");
            area.setAttribute("class", "title");
            button.setAttribute("class", "button");
        
            img.src = authors[i].picture;
            header.innerHTML = authors[i].author;
            area.innerHTML = authors[i].research_area;
            status.innerHTML += "Status: " + authors[i].status;
            type.innerHTML += "Type: " +authors[i].type
            starYear.innerHTML += "Start Researh Year: " + authors[i].start_research_year;
            endYear.innerHTML += "End Researh Year: " + authors[i].end_research_year;
            graduationYear.innerHTML += "Graduation Year: " + authors[i].graduation_year;
            button.innerHTML = "See Profile";
        
            button.onclick = function() {
                localStorage.setItem("selectedAuthor", JSON.stringify(authors[i].author));
                window.location.href = "authorInfo.html";
            };
        
            seeProfile.appendChild(button)
        
            container.appendChild(header)
            container.appendChild(area)
            container.appendChild(status)
            container.appendChild(type)
            container.appendChild(starYear)
            container.appendChild(endYear)
            container.appendChild(graduationYear)
            container.appendChild(seeProfile)
        
            card.appendChild(img)
            card.appendChild(container)
            column.appendChild(card)
        
            row.appendChild(column)
            document.getElementById("authorsList").appendChild(row);
          }
      })
  
    var row;
    for (let i = 0; i < authors.length; i++) {
      var remainder = i % 3;
      if (remainder == 0){
          row = document.createElement("div")
          row.setAttribute("class", "row");
      } 
      
      var column = document.createElement("div")
      var card = document.createElement("div")
      var img = document.createElement("img");
      var container = document.createElement("div")
      var header = document.createElement("h2")
      var area = document.createElement("p");
      var status = document.createElement("p");
      var type = document.createElement("p");
      var starYear = document.createElement("p");
      var endYear = document.createElement("p");
      var graduationYear = document.createElement("p");
      var seeProfile = document.createElement("p");
      var button = document.createElement("button");
      
      img.setAttribute("class", "authorImg");
      column.setAttribute("class", "column");
      card.setAttribute("class", "card");
      container.setAttribute("class", "container");
      area.setAttribute("class", "title");
      button.setAttribute("class", "button");
  
      img.src = authors[i].picture;
      header.innerHTML = authors[i].author;
      area.innerHTML = authors[i].research_area;
      status.innerHTML += "Status: " + authors[i].status;
      type.innerHTML += "Type: " +authors[i].type
      starYear.innerHTML += "Start Researh Year: " + authors[i].start_research_year;
      endYear.innerHTML += "End Researh Year: " + authors[i].end_research_year;
      graduationYear.innerHTML += "Graduation Year: " + authors[i].graduation_year;
      button.innerHTML = "See Profile";
  
      button.onclick = function() {
          localStorage.setItem("selectedAuthor", JSON.stringify(authors[i].author));
          window.location.href = "authorInfo.html";
      };
  
      seeProfile.appendChild(button)
  
      container.appendChild(header)
      container.appendChild(area)
      container.appendChild(status)
      container.appendChild(type)
      container.appendChild(starYear)
      container.appendChild(endYear)
      container.appendChild(graduationYear)
      container.appendChild(seeProfile)
  
      card.appendChild(img)
      card.appendChild(container)
      column.appendChild(card)
  
      row.appendChild(column)
      document.getElementById("authorsList").appendChild(row);
    }
}

function listAllAuthorPublications() {
    selectedAuthor = JSON.parse(localStorage.getItem("selectedAuthor"));

    authors = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors;
    var publications;
    for (let i = 0; i < authors.length; i++) {
        if(authors[i].author == selectedAuthor) {
            publications = authors[i].publications;
        }
    }
  
    publications.sort((a, b) => (a.pub_year < b.pub_year) ? 1 : -1)
    
    var allGroup = ["Publication Year", "Citations Count", "Type", "Title", "Author", "Area Tag", "International Collaboration", "Student Collaboration", 
    "CMU Advisor", "PT Advisor"]
    
    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    d3.select("#selectButton").on("change", function(d) {
        deleteChild("#tableBody")
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        if(selectedOption == "Publication Year") {
            publications.sort((a, b) => (a.pub_year < b.pub_year) ? 1 : -1)
        }
        if(selectedOption == "Citations Count") {
            publications.sort((a, b) => (a.citations_count < b.citations_count) ? 1 : -1)
        }
        if(selectedOption == "Type") {
            publications.sort((a, b) => (a.pub_type > b.pub_type) ? 1 : -1)
        }
        if(selectedOption == "Title") {
            publications.sort((a, b) => (a.title > b.title) ? 1 : -1)
        }
        if(selectedOption == "Author") {
            publications.sort((a, b) => (a.author > b.author) ? 1 : -1)
        }
        if(selectedOption == "Area Tag") {
            publications.sort((a, b) => (a.pub_area_tag > b.pub_area_tag) ? 1 : -1)
        }
        if(selectedOption == "International Collaboration") {
            publications.sort((a, b) => (a.inter_colab < b.inter_colab) ? 1 : -1)
        }
        if(selectedOption == "Student Collaboration") {
            publications.sort((a, b) => (a.collab_students < b.collab_students) ? 1 : -1)
        }
        if(selectedOption == "CMU Advisor") {
            publications.sort((a, b) => (a.cmu_advisor < b.cmu_advisor) ? 1 : -1)
        }
        if(selectedOption == "PT Advisor") {
            publications.sort((a, b) => (a.pt_advisor < b.pt_advisor) ? 1 : -1)
        }

        for (let i = 0; i < publications.length; i++) {
            var item = document.createElement("tr");
    
            var number = document.createElement("td");
            number.setAttribute("class", "t-op-nextlvl");
            number.innerHTML = i + 1
            var title = document.createElement("td");
            title.setAttribute("class", "t-op-nextlvl");
            title.innerHTML = publications[i].title;
            var author = document.createElement("td");
            author.setAttribute("class", "t-op-nextlvl");
            author.innerHTML = publications[i].author;
            var year = document.createElement("td");
            year.setAttribute("class", "t-op-nextlvl");
            year.innerHTML = publications[i].pub_year;
            var area = document.createElement("td");
            area.setAttribute("class", "t-op-nextlvl");
            area.innerHTML = publications[i].pub_area_tag;
            var authors = document.createElement("td");
            authors.setAttribute("class", "t-op-nextlvl");
            authors.innerHTML = publications[i].authors;
            var citations = document.createElement("td");
            citations.setAttribute("class", "t-op-nextlvl");
            citations.innerHTML = publications[i].citations_count;
            var type = document.createElement("td");
            type.setAttribute("class", "t-op-nextlvl");
            type.innerHTML = publications[i].pub_type;
            var collab = document.createElement("td");
            collab.setAttribute("class", "t-op-nextlvl");
            collab.innerHTML = publications[i].inter_colab;
            var cmuAdvisor = document.createElement("td");
            cmuAdvisor.setAttribute("class", "t-op-nextlvl");
            cmuAdvisor.innerHTML = publications[i].cmu_advisors;
            var ptAdvisor = document.createElement("td");
            ptAdvisor.setAttribute("class", "t-op-nextlvl");
            ptAdvisor.innerHTML = publications[i].pt_advisors;
            var studentCollab = document.createElement("td");
            studentCollab.setAttribute("class", "t-op-nextlvl");
            studentCollab.innerHTML = publications[i].collab_students;
    
            item.appendChild(number);
            item.appendChild(title);
            item.appendChild(author);
            item.appendChild(year);
            item.appendChild(area);
            item.appendChild(authors);
            item.appendChild(citations);
            item.appendChild(type);
            item.appendChild(collab);
            item.appendChild(cmuAdvisor);
            item.appendChild(ptAdvisor);
            item.appendChild(studentCollab);

            item.onclick = function() {
                localStorage.setItem("selectedPublication", JSON.stringify(publications[i].title));
                window.location.href = "publicationsInfo.html";
            };
            
            document.getElementById("tableBody").appendChild(item);
        }
    })

    publications.sort((a, b) => (a.pub_year < b.pub_year) ? 1 : -1)
    for (let i = 0; i < publications.length; i++) {
        var item = document.createElement("tr");

        var number = document.createElement("td");
        number.setAttribute("class", "t-op-nextlvl");
        number.innerHTML = i + 1
        var title = document.createElement("td");
        title.setAttribute("class", "t-op-nextlvl");
        title.innerHTML = publications[i].title;
        var author = document.createElement("td");
        author.setAttribute("class", "t-op-nextlvl");
        author.innerHTML = publications[i].author;
        var year = document.createElement("td");
        year.setAttribute("class", "t-op-nextlvl");
        year.innerHTML = publications[i].pub_year;
        var area = document.createElement("td");
        area.setAttribute("class", "t-op-nextlvl");
        area.innerHTML = publications[i].pub_area_tag;
        var authors = document.createElement("td");
        authors.setAttribute("class", "t-op-nextlvl");
        authors.innerHTML = publications[i].authors;
        var citations = document.createElement("td");
        citations.setAttribute("class", "t-op-nextlvl");
        citations.innerHTML = publications[i].citations_count;
        var type = document.createElement("td");
        type.setAttribute("class", "t-op-nextlvl");
        type.innerHTML = publications[i].pub_type;
        var collab = document.createElement("td");
        collab.setAttribute("class", "t-op-nextlvl");
        collab.innerHTML = publications[i].inter_colab;
        var cmuAdvisor = document.createElement("td");
        cmuAdvisor.setAttribute("class", "t-op-nextlvl");
        cmuAdvisor.innerHTML = publications[i].cmu_advisors;
        var ptAdvisor = document.createElement("td");
        ptAdvisor.setAttribute("class", "t-op-nextlvl");
        ptAdvisor.innerHTML = publications[i].pt_advisors;
        var studentCollab = document.createElement("td");
        studentCollab.setAttribute("class", "t-op-nextlvl");
        studentCollab.innerHTML = publications[i].collab_students;

        item.appendChild(number);
        item.appendChild(title);
        item.appendChild(author);
        item.appendChild(year);
        item.appendChild(area);
        item.appendChild(authors);
        item.appendChild(citations);
        item.appendChild(type);
        item.appendChild(collab);
        item.appendChild(cmuAdvisor);
        item.appendChild(ptAdvisor);
        item.appendChild(studentCollab);

        item.onclick = function() {
            localStorage.setItem("selectedPublication", JSON.stringify(publications[i].title));
            window.location.href = "publicationsInfo.html";
        };
        
        document.getElementById("tableBody").appendChild(item);
    }
}

/*Publications*/
function listAllPublications() {
    publications = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.publications
  
    publications.sort((a, b) => (a.pub_year < b.pub_year) ? 1 : -1)
    
    var allGroup = ["Publication Year", "Citations Count", "Type", "Title", "Author", "Area Tag", "International Collaboration", "Student Collaboration", 
    "CMU Advisor", "PT Advisor"]

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    d3.select("#selectButton").on("change", function(d) {
        deleteChild("#tableBody")
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        if(selectedOption == "Publication Year") {
            publications.sort((a, b) => (a.pub_year < b.pub_year) ? 1 : -1)
        }
        if(selectedOption == "Citations Count") {
            publications.sort((a, b) => (a.citations_count < b.citations_count) ? 1 : -1)
        }
        if(selectedOption == "Type") {
            publications.sort((a, b) => (a.pub_type > b.pub_type) ? 1 : -1)
        }
        if(selectedOption == "Title") {
            publications.sort((a, b) => (a.title > b.title) ? 1 : -1)
        }
        if(selectedOption == "Author") {
            publications.sort((a, b) => (a.author > b.author) ? 1 : -1)
        }
        if(selectedOption == "Area Tag") {
            publications.sort((a, b) => (a.pub_area_tag > b.pub_area_tag) ? 1 : -1)
        }
        if(selectedOption == "International Collaboration") {
            publications.sort((a, b) => (a.inter_colab < b.inter_colab) ? 1 : -1)
        }
        if(selectedOption == "Student Collaboration") {
            publications.sort((a, b) => (a.collab_students < b.collab_students) ? 1 : -1)
        }
        if(selectedOption == "CMU Advisor") {
            publications.sort((a, b) => (a.cmu_advisor < b.cmu_advisor) ? 1 : -1)
        }
        if(selectedOption == "PT Advisor") {
            publications.sort((a, b) => (a.pt_advisor < b.pt_advisor) ? 1 : -1)
        }

        for (let i = 0; i < publications.length; i++) {
            var item = document.createElement("tr");
    
            var number = document.createElement("td");
            number.setAttribute("class", "t-op-nextlvl");
            number.innerHTML = i + 1
            var title = document.createElement("td");
            title.setAttribute("class", "t-op-nextlvl");
            title.innerHTML = publications[i].title;
            var author = document.createElement("td");
            author.setAttribute("class", "t-op-nextlvl");
            author.innerHTML = publications[i].author;
            var year = document.createElement("td");
            year.setAttribute("class", "t-op-nextlvl");
            year.innerHTML = publications[i].pub_year;
            var area = document.createElement("td");
            area.setAttribute("class", "t-op-nextlvl");
            area.innerHTML = publications[i].pub_area_tag;
            var authors = document.createElement("td");
            authors.setAttribute("class", "t-op-nextlvl");
            authors.innerHTML = publications[i].authors;
            var citations = document.createElement("td");
            citations.setAttribute("class", "t-op-nextlvl");
            citations.innerHTML = publications[i].citations_count;
            var type = document.createElement("td");
            type.setAttribute("class", "t-op-nextlvl");
            type.innerHTML = publications[i].pub_type;
            var collab = document.createElement("td");
            collab.setAttribute("class", "t-op-nextlvl");
            collab.innerHTML = publications[i].inter_colab;
            var cmuAdvisor = document.createElement("td");
            cmuAdvisor.setAttribute("class", "t-op-nextlvl");
            cmuAdvisor.innerHTML = publications[i].cmu_advisors;
            var ptAdvisor = document.createElement("td");
            ptAdvisor.setAttribute("class", "t-op-nextlvl");
            ptAdvisor.innerHTML = publications[i].pt_advisors;
            var studentCollab = document.createElement("td");
            studentCollab.setAttribute("class", "t-op-nextlvl");
            studentCollab.innerHTML = publications[i].collab_students;
    
            item.appendChild(number);
            item.appendChild(title);
            item.appendChild(author);
            item.appendChild(year);
            item.appendChild(area);
            item.appendChild(authors);
            item.appendChild(citations);
            item.appendChild(type);
            item.appendChild(collab);
            item.appendChild(cmuAdvisor);
            item.appendChild(ptAdvisor);
            item.appendChild(studentCollab);

            item.onclick = function() {
                localStorage.setItem("selectedPublication", JSON.stringify(publications[i].title));
                window.location.href = "publicationsInfo.html";
            };
            
            document.getElementById("tableBody").appendChild(item);
        }
    })

    publications.sort((a, b) => (a.pub_year < b.pub_year) ? 1 : -1)
    for (let i = 0; i < publications.length; i++) {
        var item = document.createElement("tr");
    
        var number = document.createElement("td");
        number.setAttribute("class", "t-op-nextlvl");
        number.innerHTML = i + 1
        var title = document.createElement("td");
        title.setAttribute("class", "t-op-nextlvl");
        title.innerHTML = publications[i].title;
        var author = document.createElement("td");
        author.setAttribute("class", "t-op-nextlvl");
        author.innerHTML = publications[i].author;
        var year = document.createElement("td");
        year.setAttribute("class", "t-op-nextlvl");
        year.innerHTML = publications[i].pub_year;
        var area = document.createElement("td");
        area.setAttribute("class", "t-op-nextlvl");
        area.innerHTML = publications[i].pub_area_tag;
        var authors = document.createElement("td");
        authors.setAttribute("class", "t-op-nextlvl");
        authors.innerHTML = publications[i].authors;
        var citations = document.createElement("td");
        citations.setAttribute("class", "t-op-nextlvl");
        citations.innerHTML = publications[i].citations_count;
        var type = document.createElement("td");
        type.setAttribute("class", "t-op-nextlvl");
        type.innerHTML = publications[i].pub_type;
        var collab = document.createElement("td");
        collab.setAttribute("class", "t-op-nextlvl");
        collab.innerHTML = publications[i].inter_colab;
        var cmuAdvisor = document.createElement("td");
        cmuAdvisor.setAttribute("class", "t-op-nextlvl");
        cmuAdvisor.innerHTML = publications[i].cmu_advisors;
        var ptAdvisor = document.createElement("td");
        ptAdvisor.setAttribute("class", "t-op-nextlvl");
        ptAdvisor.innerHTML = publications[i].pt_advisors;
        var studentCollab = document.createElement("td");
        studentCollab.setAttribute("class", "t-op-nextlvl");
        studentCollab.innerHTML = publications[i].collab_students;

        item.appendChild(number);
        item.appendChild(title);
        item.appendChild(author);
        item.appendChild(year);
        item.appendChild(area);
        item.appendChild(authors);
        item.appendChild(citations);
        item.appendChild(type);
        item.appendChild(collab);
        item.appendChild(cmuAdvisor);
        item.appendChild(ptAdvisor);
        item.appendChild(studentCollab);

        item.onclick = function() {
            localStorage.setItem("selectedPublication", JSON.stringify(publications[i].title));
            window.location.href = "publicationsInfo.html";
        };
        
        document.getElementById("tableBody").appendChild(item);
    }
}

function defineValuesPublication() {

    selectedPublication = JSON.parse(localStorage.getItem("selectedPublication"));

    authors = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.publications;
    for (let i = 0; i < authors.length; i++) {
        if(authors[i].title == selectedPublication) {
            document.getElementById("citationsCount").innerHTML = numberWithCommas(authors[i].citations_count);
            document.getElementById("title").innerHTML = selectedPublication
            document.getElementById("pubYear").innerHTML = authors[i].pub_year
            document.getElementById("authorsList").innerHTML = authors[i].authors
            document.getElementById("pubType").innerHTML = authors[i].pub_type
            document.getElementById("researchArea").innerHTML = authors[i].pub_area_tag
            document.getElementById("interCollab").innerHTML = authors[i].inter_colab
            document.getElementById("nAuthors").innerHTML = numberWithCommas(authors[i].number_of_collab_students);
            if(authors[i].cmu_advisors.length == 0) {
                document.getElementById("cmuAdvisor").innerHTML = "None"
            }
            else {
                document.getElementById("cmuAdvisor").innerHTML = authors[i].cmu_advisors
            }

            if(authors[i].pt_advisors.length == 0) {
                document.getElementById("ptAdvisor").innerHTML = "None"
            }
            else {
                document.getElementById("ptAdvisor").innerHTML = authors[i].pt_advisors
            }

            document.getElementById("studentCollab").innerHTML = authors[i].collab_students
            
            if(authors[i].pub_area_tag == "") {
                document.getElementById("researchArea").innerHTML = "None"
            }
            else {
                document.getElementById("researchArea").innerHTML = authors[i].pub_area_tag
            }            

            document.getElementById("link").innerHTML = authors[i].pub_link
            link = document.getElementById("link") 
            url = "window.location.href = '" + authors[i].pub_link + "';" 
            link.setAttribute("onclick", url)

            document.getElementById("doiLink").innerHTML = authors[i].pub_DOI
            doiLink = document.getElementById("doiLink") 
            doiurl = "window.location.href = '" + authors[i].pub_DOI + "';" 
            doiLink.setAttribute("onclick", doiurl)
            
            document.getElementById("googleLink").innerHTML = authors[i].pub_scholar_link
            googleLink = document.getElementById("googleLink") 
            googleurl = "window.location.href = '" + authors[i].pub_scholar_link + "';" 
            googleLink.setAttribute("onclick", googleurl)
        }
    }
}

function createPublicationBarChart() {

    selectedPublication = JSON.parse(localStorage.getItem("selectedPublication"));

    authors = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.publications;
    var citations;
    for (let i = 0; i < authors.length; i++) {
        if(authors[i].title == selectedPublication) {
            citations = authors[i].citations_per_year;
        }
    }
    // Step 1

    citationsYears = Object.keys(citations);
    citationsNumber = Object.values(citations);

    citationsYears.sort((a, b) => (a > b) ? 1 : -1)
    var dataset = [];

    for (let i = 0; i < citationsYears.length; i++) {
        dataset.push([citationsYears[i], citationsNumber[i]]);
    }

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
    
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    // append the svg object to the body of the page
    var svg = d3.select("#citationsPerYear")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container0", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 -20 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
    // X axis
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(citationsYears)
    .padding(0.2);
    
    let xAxisGenerator = d3.axisBottom(xScale)
    if(citationsYears.length > 10) {
        xAxisGenerator.tickFormat(d => (d%2 != 0) ? "" : d)
    }
    
    // Add Y axis
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(citationsNumber)])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(yScale));

    // create tooltip element  
    const tooltip = d3.select("body")
      .append("div")
      .attr("class","d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "15px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("border-radius", "5px")
      .style("color", "#fff")
      .text("a simple tooltip");

    bar_color = "#69b3a2"
    // Bars
    svg.selectAll("mybar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("fill", bar_color)
    .attr("x", function(d) { return xScale(d[0]); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d[1]); })
    .on("mouseover", function(event, d) {
        tooltip.html(`${d[1]} citations`).style("visibility", "visible");
        d3.select(this)
          .attr("fill", shadeColor(bar_color, -15));
    })
    .on("mousemove", function(){
        tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
    })
    .on("mouseout", function() {
        tooltip.html(``).style("visibility", "hidden");
        d3.select(this).attr("fill", bar_color);
    });

    svg.append("g")
                .call(xAxisGenerator)
                .attr("transform", "translate(0," + height + ")")
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Citations Per Year");
}

function listPublicationAuthors() {

    authorsList = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors;

    selectedPublication = JSON.parse(localStorage.getItem("selectedPublication"));

    pubs = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.publications;
    var authorNames = []
    for (let i = 0; i < pubs.length; i++) {
        if(pubs[i].title == selectedPublication) {
            authorNames = pubs[i].author;
        }
    }

    var authors = []
    for (let i = 0; i < authorsList.length; i++) {
        for (let j = 0; j < authorNames.length; j++) {
            if(authorsList[i].author == authorNames[j]) {
                authors.push(authorsList[i])
            }
        }
    }

    authors.sort((a, b) => (a.start_research_year < b.start_research_year) ? 1 : -1)

    var allGroup = ["Start Research Year", "End Research Year", "Graduation Year", "Status", "Type", "Citations Count", "Nº of Publications", 
    "Citations/Publications Ratio", "Name", "Research Area", "Affiliation", "Nº of International Collaborations", "Nº of Student Collaborations"]
  
    // add the options to the button
    d3.select("#selectButtonPublication")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    d3.select("#selectButtonPublication").on("change", function(d) {
        deleteChild("#tableBody2")
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        if(selectedOption == "Start Research Year") {
            authors.sort((a, b) => (a.start_research_year < b.start_research_year) ? 1 : -1)
        }
        if(selectedOption == "End Research Year") {
            authors.sort((a, b) => (a.end_research_year < b.end_research_year) ? 1 : -1)
        }
        if(selectedOption == "Graduation Year") {
            authors.sort((a, b) => (a.graduation_year < b.graduation_year) ? 1 : -1)
        }
        if(selectedOption == "Status") {
            authors.sort((a, b) => (a.status > b.status) ? 1 : -1)
        }
        if(selectedOption == "Type") {
            authors.sort((a, b) => (a.type > b.type) ? 1 : -1)
        }
        if(selectedOption == "Citations Count") {
            authors.sort((a, b) => (a.citations_count < b.citations_count) ? 1 : -1)
        }
        if(selectedOption == "Nº of Publications") {
            authors.sort((a, b) => (a.number_of_publications < b.number_of_publications) ? 1 : -1)
        }
        if(selectedOption == "Citations/Publications Ratio") {
            authors.sort((a, b) => (a.citations_count/a.number_of_publications < b.citations_count/b.number_of_publications) ? 1 : -1)
        }
        if(selectedOption == "Research Area") {
            authors.sort((a, b) => (a.author > b.author) ? 1 : -1)
        }
        if(selectedOption == "Name") {
            authors.sort((a, b) => (a.author > b.author) ? 1 : -1)
        }
        if(selectedOption == "Nº of International Collaborations") {
            authors.sort((a, b) => (a.number_of_international_pubs < b.number_of_international_pubs) ? 1 : -1)
        }
        if(selectedOption == "Nº of Student Collaborations") {
            authors.sort((a, b) => (a.number_of_student_collabs < b.number_of_student_collabs) ? 1 : -1)
        }

        for (let i = 0; i < authors.length; i++) {
            var item = document.createElement("tr");
    
            var number = document.createElement("td");
            number.setAttribute("class", "t-op-nextlvl");
            number.innerHTML = i + 1
            var name = document.createElement("td");
            name.setAttribute("class", "t-op-nextlvl");
            name.innerHTML = authors[i].author;
            var affiliation = document.createElement("td");
            affiliation.setAttribute("class", "t-op-nextlvl");
            affiliation.innerHTML = authors[i].affiliation;
            var status = document.createElement("td");
            status.setAttribute("class", "t-op-nextlvl");
            status.innerHTML = authors[i].status;
            var type = document.createElement("td");
            type.setAttribute("class", "t-op-nextlvl");
            type.innerHTML = authors[i].type;
            var area = document.createElement("td");
            area.setAttribute("class", "t-op-nextlvl");
            area.innerHTML = authors[i].research_area;
            var citations = document.createElement("td");
            citations.setAttribute("class", "t-op-nextlvl");
            citations.innerHTML = authors[i].citations_count;
            var pubNumber = document.createElement("td");
            pubNumber.setAttribute("class", "t-op-nextlvl");
            pubNumber.innerHTML = authors[i].number_of_publications;
            var startYear = document.createElement("td");
            startYear.setAttribute("class", "t-op-nextlvl");
            startYear.innerHTML = authors[i].start_research_year;
            var endYear = document.createElement("td");
            endYear.setAttribute("class", "t-op-nextlvl");
            endYear.innerHTML = authors[i].end_research_year;
            var graduationYear = document.createElement("td");
            graduationYear.setAttribute("class", "t-op-nextlvl");
            graduationYear.innerHTML = authors[i].graduation_year;
            var internationalCollab = document.createElement("td");
            internationalCollab.setAttribute("class", "t-op-nextlvl");
            internationalCollab.innerHTML = authors[i].number_of_international_pubs;
            var studentCollab = document.createElement("td");
            studentCollab.setAttribute("class", "t-op-nextlvl");
            studentCollab.innerHTML = authors[i].number_of_student_collabs;
    
            item.appendChild(number);
            item.appendChild(name);
            item.appendChild(affiliation);
            item.appendChild(status);
            item.appendChild(type);
            item.appendChild(area);
            item.appendChild(citations);
            item.appendChild(pubNumber);
            item.appendChild(startYear);
            item.appendChild(endYear);
            item.appendChild(graduationYear);
            item.appendChild(internationalCollab);
            item.appendChild(studentCollab);
            
            item.onclick = function() {
                localStorage.setItem("selectedAuthor", JSON.stringify(authors[i].author));
                window.location.href = "authorInfo.html";
            };

            document.getElementById("tableBody2").appendChild(item);
        }
    })

    authors.sort((a, b) => (a.start_research_year < b.start_research_year) ? 1 : -1)
    for (let i = 0; i < authors.length; i++) {
        var item = document.createElement("tr");
        var number = document.createElement("td");
        number.setAttribute("class", "t-op-nextlvl");
        number.innerHTML = i + 1
        var name = document.createElement("td");
        name.setAttribute("class", "t-op-nextlvl");
        name.innerHTML = authors[i].author;
        var affiliation = document.createElement("td");
        affiliation.setAttribute("class", "t-op-nextlvl");
        affiliation.innerHTML = authors[i].affiliation;
        var status = document.createElement("td");
        status.setAttribute("class", "t-op-nextlvl");
        status.innerHTML = authors[i].status;
        var type = document.createElement("td");
        type.setAttribute("class", "t-op-nextlvl");
        type.innerHTML = authors[i].type;
        var area = document.createElement("td");
        area.setAttribute("class", "t-op-nextlvl");
        area.innerHTML = authors[i].research_area;
        var citations = document.createElement("td");
        citations.setAttribute("class", "t-op-nextlvl");
        citations.innerHTML = authors[i].citations_count;
        var pubNumber = document.createElement("td");
        pubNumber.setAttribute("class", "t-op-nextlvl");
        pubNumber.innerHTML = authors[i].number_of_publications;
        var startYear = document.createElement("td");
        startYear.setAttribute("class", "t-op-nextlvl");
        startYear.innerHTML = authors[i].start_research_year;
        var endYear = document.createElement("td");
        endYear.setAttribute("class", "t-op-nextlvl");
        endYear.innerHTML = authors[i].end_research_year;
        var graduationYear = document.createElement("td");
        graduationYear.setAttribute("class", "t-op-nextlvl");
        graduationYear.innerHTML = authors[i].graduation_year;
        var internationalCollab = document.createElement("td");
        internationalCollab.setAttribute("class", "t-op-nextlvl");
        internationalCollab.innerHTML = authors[i].number_of_international_pubs;
        var studentCollab = document.createElement("td");
        studentCollab.setAttribute("class", "t-op-nextlvl");
        studentCollab.innerHTML = authors[i].number_of_student_collabs;

        item.appendChild(number);
        item.appendChild(name);
        item.appendChild(affiliation);
        item.appendChild(status);
        item.appendChild(type);
        item.appendChild(area);
        item.appendChild(citations);
        item.appendChild(pubNumber);
        item.appendChild(startYear);
        item.appendChild(endYear);
        item.appendChild(graduationYear);
        item.appendChild(internationalCollab);
        item.appendChild(studentCollab);
        
        item.onclick = function() {
            localStorage.setItem("selectedAuthor", JSON.stringify(authors[i].author));
            window.location.href = "authorInfo.html";
        };

        document.getElementById("tableBody2").appendChild(item);
    }
}

function listPublicationCollabStudents() {

    authorsList = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.authors;

    selectedPublication = JSON.parse(localStorage.getItem("selectedPublication"));

    pubs = JSON.parse(localStorage.getItem("CMUData")).CMUPortugal.publications;
    var authorNames = []
    for (let i = 0; i < pubs.length; i++) {
        if(pubs[i].title == selectedPublication) {
            authorNames = pubs[i].author;
        }
    }

    var authors = []
    for (let i = 0; i < authorsList.length; i++) {
        for (let j = 0; j < authorNames.length; j++) {
            if(authorsList[i].author == authorNames[j]) {
                authors.push(authorsList[i])
            }
        }
    }

    authors.sort((a, b) => (a.start_research_year < b.start_research_year) ? 1 : -1)

    var allGroup = ["Name", "Research Area", "Status", "Type", "Start Research Year", "End Research Year", "Graduation Year"]
  
      // add the options to the button
      d3.select("#selectButton")
          .selectAll('myOptions')
          .data(allGroup)
          .enter()
          .append('option')
          .text(function (d) { return d; }) // text showed in the menu
          .attr("value", function (d) { return d; }) // corresponding value returned by the button
  
      d3.select("#selectButton").on("change", function(d) {
          deleteChild("#authorsList")
          // recover the option that has been chosen
          var selectedOption = d3.select(this).property("value")
          // run the updateChart function with this selected option
          if(selectedOption == "Name") {
              authors.sort((a, b) => (a.author > b.author) ? 1 : -1)
          }
          if(selectedOption == "Research Area") {
              authors.sort((a, b) => (a.research_area > b.research_area) ? 1 : -1)
          }
          if(selectedOption == "Status") {
              authors.sort((a, b) => (a.status > b.status) ? 1 : -1)
          }
          if(selectedOption == "Type") {
              authors.sort((a, b) => (a.type > b.type) ? 1 : -1)
          }
          if(selectedOption == "Start Research Year") {
              authors.sort((a, b) => (a.start_research_year > b.start_research_year) ? 1 : -1)
          }
          if(selectedOption == "End Research Year") {
              authors.sort((a, b) => (a.end_research_year > b.end_research_year) ? 1 : -1)
          }
          if(selectedOption == "Graduation Year") {
              authors.sort((a, b) => (a.graduation_year > b.graduation_year) ? 1 : -1)
          }
  
          var row;
          for (let i = 0; i < authors.length; i++) {
            var remainder = i % 3;
            if (remainder == 0){
                row = document.createElement("div")
                row.setAttribute("class", "row");
            } 
            
            var column = document.createElement("div")
            var card = document.createElement("div")
            var img = document.createElement("img");
            var container = document.createElement("div")
            var header = document.createElement("h2")
            var area = document.createElement("p");
            var status = document.createElement("p");
            var type = document.createElement("p");
            var starYear = document.createElement("p");
            var endYear = document.createElement("p");
            var graduationYear = document.createElement("p");
            var seeProfile = document.createElement("p");
            var button = document.createElement("button");
            
            img.setAttribute("class", "authorImg");
            column.setAttribute("class", "column");
            card.setAttribute("class", "card");
            container.setAttribute("class", "container");
            area.setAttribute("class", "title");
            button.setAttribute("class", "button");
        
            img.src = authors[i].picture;
            header.innerHTML = authors[i].author;
            area.innerHTML = authors[i].research_area;
            status.innerHTML += "Status: " + authors[i].status;
            type.innerHTML += "Type: " +authors[i].type
            starYear.innerHTML += "Start Researh Year: " + authors[i].start_research_year;
            endYear.innerHTML += "End Researh Year: " + authors[i].end_research_year;
            graduationYear.innerHTML += "Graduation Year: " + authors[i].graduation_year;
            button.innerHTML = "See Profile";
        
            button.onclick = function() {
                localStorage.setItem("selectedAuthor", JSON.stringify(authors[i].author));
                window.location.href = "authorInfo.html";
            };
        
            seeProfile.appendChild(button)
        
            container.appendChild(header)
            container.appendChild(area)
            container.appendChild(status)
            container.appendChild(type)
            container.appendChild(starYear)
            container.appendChild(endYear)
            container.appendChild(graduationYear)
            container.appendChild(seeProfile)
        
            card.appendChild(img)
            card.appendChild(container)
            column.appendChild(card)
        
            row.appendChild(column)
            document.getElementById("authorsList").appendChild(row);
          }
      })
  
    var row;
    for (let i = 0; i < authors.length; i++) {
      var remainder = i % 3;
      if (remainder == 0){
          row = document.createElement("div")
          row.setAttribute("class", "row");
      } 
      
      var column = document.createElement("div")
      var card = document.createElement("div")
      var img = document.createElement("img");
      var container = document.createElement("div")
      var header = document.createElement("h2")
      var area = document.createElement("p");
      var status = document.createElement("p");
      var type = document.createElement("p");
      var starYear = document.createElement("p");
      var endYear = document.createElement("p");
      var graduationYear = document.createElement("p");
      var seeProfile = document.createElement("p");
      var button = document.createElement("button");
      
      img.setAttribute("class", "authorImg");
      column.setAttribute("class", "column");
      card.setAttribute("class", "card");
      container.setAttribute("class", "container");
      area.setAttribute("class", "title");
      button.setAttribute("class", "button");
  
      img.src = authors[i].picture;
      header.innerHTML = authors[i].author;
      area.innerHTML = authors[i].research_area;
      status.innerHTML += "Status: " + authors[i].status;
      type.innerHTML += "Type: " +authors[i].type
      starYear.innerHTML += "Start Researh Year: " + authors[i].start_research_year;
      endYear.innerHTML += "End Researh Year: " + authors[i].end_research_year;
      graduationYear.innerHTML += "Graduation Year: " + authors[i].graduation_year;
      button.innerHTML = "See Profile";
  
      button.onclick = function() {
          localStorage.setItem("selectedAuthor", JSON.stringify(authors[i].author));
          window.location.href = "authorInfo.html";
      };
  
      seeProfile.appendChild(button)
  
      container.appendChild(header)
      container.appendChild(area)
      container.appendChild(status)
      container.appendChild(type)
      container.appendChild(starYear)
      container.appendChild(endYear)
      container.appendChild(graduationYear)
      container.appendChild(seeProfile)
  
      card.appendChild(img)
      card.appendChild(container)
      column.appendChild(card)
  
      row.appendChild(column)
      document.getElementById("authorsList").appendChild(row);
    }
}

function filterPublicationssByName() {
    var input, filter, filterAsciiTntValue, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    filterAsciiTntValue = filter.normalize("NFD").replace(/[^\x00-\x7F]/g, "");
    table = document.getElementById("fixedTable");
    tbody = table.getElementsByTagName("tbody")[0];
    tr = tbody.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            asciiTntValue = txtValue.normalize("NFD").replace(/[^\x00-\x7F]/g, "")
            if (asciiTntValue.toUpperCase().indexOf(filterAsciiTntValue) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }  
             
    }
}

function filterPublicationssByName2() {
    var input, filter, filterAsciiTntValue, table, tr, td, i, txtValue;
    input = document.getElementById("myInput2");
    filter = input.value.toUpperCase();
    filterAsciiTntValue = filter.normalize("NFD").replace(/[^\x00-\x7F]/g, "");
    table = document.getElementById("fixedTable2");
    tbody = table.getElementsByTagName("tbody")[0];
    tr = tbody.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            asciiTntValue = txtValue.normalize("NFD").replace(/[^\x00-\x7F]/g, "")
            if (asciiTntValue.toUpperCase().indexOf(filterAsciiTntValue) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }  
             
    }
}

function deleteAndUpdatePublications() {
    text = JSON.parse(localStorage.getItem("selectedPublication"));

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', "deletedPublication.txt");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}