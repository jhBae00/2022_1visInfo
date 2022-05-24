
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
  console.log("merging")

  d3.json("california-county-map.geojson").then(function(countyMap) {
    console.log("jsonparsingOk?")
    for (let i = 0; i < countyMap.features.length; i++) {

      let mapCountyName = countyMap.features[i].properties.NAME;
      console.log("jsonparsingOIs Going on!")
      for(let j = 0; j < medFacData.length; j++) {
        if(medFacData[j].COUNTY_NAME.toUpperCase() == mapCountyName) {
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
          countyMap.features[j].properties.statusOpen = statusOpen;
          countyMap.features[j].properties.statusSuspense = statusSuspense;
          countyMap.features[j].properties.statusUC = statusUC;
          countyMap.features[j].properties.medNum = size;
          break;
        }
        break;
      }
    }


let a = countyMap.features[3].properties.medNum
//// debug
console.log(a);

// Calculate the domains of our scales, now that we have the data.
let gasMin = d3.min(countyMap.features, function(d) { return d.properties.medNum; })
let gasMax = d3.max(countyMap.features, function(d) { return d.properties.medNum; })
facNumDegree.domain(d3.extent(countyMap.features, function(d) { return d.properties.medNum; }))

// Calculate scales of the 2nd visualization (bar graph)
let xScale = d3.scaleBand()
      .range([0, w-80])
      .domain(countyMap.features.map((s) => s.properties.NAME))
      .padding(0.2)

let yScale = d3.scaleLinear()
      .range([h-100, 10])
      .domain(d3.extent(countyMap.features, function(d) { return d.properties.medNum; }));

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

linkG.append('text')
  .attr('class', 'label')
  .attr('x', -(h/ 2) + 20)
  .attr('y', -50)
  .attr('transform', 'rotate(-90)')
  .attr('text-anchor', 'middle')
  .text('Gas Consumption per Person (Therms)')

let barGroups = linkG.selectAll()
  .data(countyMap.features)
  .enter()
  .append('g')

let clicked = []

barGroups
  .append('rect')
  .attr('class', 'bar')
  .attr('x', (g) => xScale(g.properties.NAME))
  .attr('y', (g) => yScale(g.properties.medNum))
  .attr('height', (g) => h- yScale(g.properties.medNum) - 100)
  .attr('width', xScale.bandwidth())
  .style("fill", "#CCB")


//// debug
//console.log(countyMap);

// Initialize the main map of California with tooltips giving detailed information per county.
let mainMap = mainG.selectAll("path")
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
      mainG.selectAll("path").transition().duration(500).style("fill", function(d2) {
        for(let i = 0; i < clicked.length; i++) {
          if(clicked[i] == d2.properties.NAME) {
            console.log(d2.properties.NAME)
            return facNumDegree(d2.properties.medNum);
          }
        }
        return '#ccc';
      })

    })

    // Enables the Gas Consumption Visualization on map.
    controls.select("#setGasViz").on("click", function() {
      mainMap.transition().duration(1000)
        .style("fill", function(d) {
        //Get data value
        let value = d.properties.medNum;
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
    eventFire(document.getElementById('setGasViz'), 'click');


    //////////////////
  })
})
