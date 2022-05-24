/*
 *  Alfred Lam
 *  CMPS 161
 *  Prog 2
 *  map.js - reads in 5 csv files with data, merges them into 1 array, and displays the results in interactive
 *           ways using D3 and SVG elements.
 */

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
let gasConsumptionScale = d3.scaleSequential().interpolator(d3.interpolateOrRd)
let populationScale = d3.scalePow().range([20, 300]);
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
d3.csv("https://github.com/jhBae00/2022_1visInfo/blob/main/california-medical-facilitiy-crosswalk.csv").then(function(medFacData) {
  console.log("merging")
  d3.json("https://github.com/jhBae00/2022_1visInfo/blob/main/california-county-map.geojson").then(function(countyMapData) {
    console.log("jsonparsingOk?")
    for (let i = 0; i < countyMapData.features.length; i++) {

      let mapCountyName = countyMapData.features[i].properties.NAME;
      console.log("jsonparsingOIs Going on!")
      for(let j = 0; j < medFacData.length; j++) {
        if(medFacData[j].COUNTY_NAME.toUpperCase() == mapCountyName) {
          let regsBoth, regsOnlyOSHPD, statusClosed, statusOpen, statusSuspense, statusUC, size;
          regedBoth = medFacData[j].both;
          regsOnlyOSHPD = medFacData[j].onlyOSHPD;
          statusClosed = medFacData[j].Closed;
          statusOpen =medFacData[j].Open;
          statusSuspense = medFacData[j].Suspense;
          statusUC = medFacData[j].Under_Construction;
          size = medFacData[j].size;

          countyMapData.features[i].properties.regsBoth = regesBoth;
          countyMapData.features[i].properties.regsOnlyOSHPD = regsOnlyOSHPD;
          countyMapData.features[i].properties.statusClosed = statusClosed;
          countyMapData.features[j].properties.statusOpen = statusOpen;
          countyMapData.features[j].properties.statusSuspense = statusSuspense;
          countyMapData.features[j].properties.statusUC = statusUC;
          countyMapData.features[j].properties.medNum = medNum;
          break;
        }
        break;
      }
    }



//// debug
//console.log(countyMapData);

// Initialize the main map of California with tooltips giving detailed information per county.
let mainMap = mainG.selectAll("path")
  .data(countyMapData.features)
  .enter()
  .append("path")
    .attr("d", path)
    .style("fill", "#CCC")
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
            return gasConsumptionScale(d2.properties.gasPerPop);
          }
        }
        return '#ccc';
      })
      linkG.selectAll(".bar")
        .attr("stroke", function(d2) {
          for(let i = 0; i < clicked.length; i++) {
            if(clicked[i] == d2.properties.NAME) {
              return "red"
            }
          }
          return "none"
        })
    })

    //////////////////
  })
})
