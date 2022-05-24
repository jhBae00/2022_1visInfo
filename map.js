
//Width and height
let w = 760;
let h = 600;

//Define map projection
let projection = d3.geoMercator()
             .center([ -120, 37 ])
             .translate([ w/2, h/2 ])
             .scale([ w*3.3 ]);

//Define path generator
let path = d3.geoPath()
         .projection(projection);

//Create SVG
let svg = d3.select("#container")
      .append("svg")
      .attr("width", w * 2)
      .attr("height", h)

let mainG = svg.append("g")

let linkG = svg.append("g")
    .attr("transform", "translate(800 10)")
    .attr("class", "noPointerEvents")

console.log("dddddd")
console.log(mainG)

// Reference to our controls panel and legend svg in the HTML
let controls = d3.select("#container").select("#controls")
let legend = d3.select("#legend")

// Create scales to be used to visualize data. We do not know the domain until we read in data.
let facNumDegree = d3.scaleSequential().interpolator(d3.interpolateOrRd)
// let populationScale = d3.scalePow().range([20, 300]);
let partyScale = d3.scaleLinear().domain([50,100]).range([0.3,0.95])

// TODO
// Abstract out functions:
// ParseData()
// SetControls()
//   Toggle Ballot Results - YES(green) or NO(red), size = population, transparency = percentage that voted and won
//   Set Political Affiliation - Red or blue, shade = percentage, based on governor elections
//   Set Gas Consumption       - Yellow to red, shade = higher gas consumption, gray = no data
//   Set Public Transportation -
// DrawMap()
d3.csv("california-medical-facilitiy-crosswalk.csv").then(function(medFacData) {
  d3.json("california-county-map.geojson").then(function(countyMap) {
    console.log("jsonparsingOk?")
    
    for (let i = 0; i < countyMap.features.length; i++) {
      let abb = countyMap.features[i].properties.NAME;
      abb = abb.toUpperCase();

      console.log("jsonparsingOIs Going on!")
      for(let j = 0; j < medFacData.length; j++) {
        let bcc =medFacData[j].COUNTY_NAME;
        if(abb === bcc) {
          let regsBoth, regsOnlyOSHPD, statusClosed, statusOpen, statusSuspense, statusUC, size;
          //countyName = medFacData[j].COUNTY_NAME;
          regedBoth = medFacData[j].both;
          regsOnlyOSHPD = medFacData[j].onlyOSHPD;
          statusClosed = medFacData[j].Closed;
          statusOpen =medFacData[j].Open;
          statusSuspense = medFacData[j].Suspense;
          statusUC = medFacData[j].Under_Construction;
          size = medFacData[j].size;

          countyMap.features[i].properties.countyName = mapCountyName;
          countyMap.features[i].properties.regsBoth = regesBoth;
          countyMap.features[i].properties.regsOnlyOSHPD = regsOnlyOSHPD;
          countyMap.features[i].properties.statusClosed = statusClosed;
          countyMap.features[i].properties.statusOpen = statusOpen;
          countyMap.features[i].properties.statusSuspense = statusSuspense;
          countyMap.features[i].properties.statusUC = statusUC;
          if(size !=true){
            countyMap.features[i].properties.medNum = 0;
          }
          else{
            countyMap.features[i].properties.medNum = size;
          }
          break;

        }

      }
    }


//// debug
console.log(countyMap);
let clicked = [];
// Calculate the domains of our scales, now that we have the data.
let gasMin = d3.min(countyMap.features, function(d) { return d.properties.medNum; })
let gasMax = d3.max(countyMap.features, function(d) { return d.properties.medNum; })
facNumDegree.domain(d3.extent(countyMap.features, function(d) { return d.properties.medNum; }))

// Calculate scales of the 2nd visualization (bar graph)
let xScale = d3.scaleBand()
      .range([0, w-80])
      .domain(d3.extent(clicked, function(d) { return d[i] }))
      .padding(0.2)

let yScale = d3.scaleLinear()
      .range([h-100, 10])
      .domain(d3.extent(medFacData, function(d) { return d.size }));

linkG.append('g')
      .attr('transform', `translate(0, ${h-100})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

linkG.append('g')
      .call(d3.axisLeft(yScale));

linkG.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft()
        .scale(yScale)
        .tickSize(-w+80, 0, 0)
        .tickFormat('')
      )


      let bcc =medFacData[43].COUNTY_NAME
      let abb = countyMap.features[1].properties.NAME
      abb = abb.toUpperCase();
      if(bcc == abb){
        d = 'cool'
      }
      else{
        d = 'bad'
      }

linkG.append('text')
  .attr('class', 'label')
  .attr('x', -(h/ 2) + 20)
  .attr('y', -50)
  .attr('transform', 'rotate(-90)')
  .attr('text-anchor', 'middle')
  .text('Medical Facitilty Condition'+ d)

  let barGroups = linkG.selectAll()
    .data(medFacData)
    .enter()
    .append('g')

  barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => xScale(clicked))
    .attr('y', (g) => yScale(medFacData.size))
    .attr('height', (g) => h - yScale(medFacData.size) -5)
    .attr('width', xScale.bandwidth())
    .style("fill", "#CCB")



//// debug
//console.log(countyMap);


// Initialize the main map of California with tooltips giving detailed information per county.
let mapGraph = mainG.selectAll("path")
  .data(countyMap.features)
  .enter()
  .append("path")
    .attr("d", path)
    .style("fill", "#CCB")
    .on("click", function(d) {
      if(clicked.length == 0) {
        clicked.push(d.properties.NAME)
      }
      else if(clicked.includes(d.properties.NAME)) {
        clicked.splice(clicked.indexOf(d.properties.NAME), 1);
        //d3.select(this).attr("stroke", "none");
      }
      else {
        clicked.push(d.properties.NAME);
      }
      mainG.selectAll("path").transition().duration(500).style("fill", function(d) {
        for(let i = 0; i < clicked.length; i++) {
          if(clicked[i] == d.properties.NAME.toUpperCase()) {
            console.log(d.properties.NAME)
            console.log(d.properties.medNum)
            return facNumDegree(medFacData[].size);
          }
        }
        return '#ccc';
      })

    })

    // Enables the Gas Consumption Visualization on map.
    controls.select("#setGasViz").on("click", function() {
      mapGraph.transition().duration(700)
        .style("fill", function(d) {
        //  if(){

        //  }
        //  else{}

        //Get data value
        let value = d.properties.medNum;
        console.log(d.properties.medNum)
        if (value) {
          //If value exists…
          return facNumDegree(value);
        } else {
          //If value is undefined…
          return "#CCC";
        }
      })
      clicked = [];
      linkG.selectAll("rect").attr("stroke", "none")
    })


    // Fire the click event to initalize Gas Visualization
    //eventFire(document.getElementById('setGasViz'), 'click');


    //////////////////
  })
})
