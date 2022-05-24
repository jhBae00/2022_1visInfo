


let w = 780;
let h = 600;

let projection = d3.geoMercator()
             .center([ -120, 37 ])
             .translate([ 290, 310 ])
             .scale([ 780*3.1 ]);

let path = d3.geoPath()
         .projection(projection);
//svg
let svg = d3.select("#container")
      .append("svg")
      .attr("width", 780 * 2)
      .attr("height", 600)

let geoGraph = svg.append("g")
let barChart = svg.append("g")
    .attr("transform", "translate(700 16)")

console.log("dddddd")
console.log(geoGraph)

let tasks = d3.select("#container").select("#tasks")
let facNumDegree = d3.scaleSequential().interpolator(d3.interpolateOrRd)


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
          countyMap.features[i].properties.statusUC = statusUC

          if(size !=true){
            countyMap.features[i].properties.medNum = 0;
          }
          else{
            countyMap.features[i].properties.medNum = size;
          }

          break;
        }
        break;
      }
    }


let clicked = [];
facNumDegree.domain(d3.extent(countyMap.features, function(d) { return d.properties.ALAND; }))

let xAxisScale = d3.scaleBand()
      .range([0, w -100])
      .domain(d3.extent(clicked,
                        function(d) { return d[i] }))
      .padding(0.3)

let yAxisScale = d3.scaleLinear()
      .range([h - 100, 10])
      .domain(d3.extent(medFacData,
                          function(d) { return d.size }));

barChart.append('g')
      .attr('transform', `translate(0, ${h-100})`)
      .call(d3.axisBottom(xAxisScale))
      .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

barChart.append('g')
      .call(d3.axisLeft(yAxisScale));

barChart.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft()
        .scale(yAxisScale)
        .tickSize(-w+80, 0, 0)
        .tickFormat('')
      )


      let fff =medFacData[43].COUNTY_NAME
      let ggg = countyMap.features[1].properties.NAME
      ggg = ggg.toUpperCase();
      if(fff == ggg){
        f = 'cool'
      }
      else{
        f = 'bad'
      }

      deluca = medFacData[43].COUNTY_NAME

      for(i=0; i<medFacData.length; i++){
        let bcc = medFacData[i].COUNTY_NAME;
        for(j=0; j<medFacData.length; j++){
          let abb = countyMap.features[j].properties.NAME
          abb = abb.toUpperCase();
          if(bcc == abb){
            d = 'cool'
          }
          else{
            d = 'bad'
          }
        }
      }


barChart.append('text')
  .attr('class', 'label')
  .attr('x', -(h/ 2) + 20)
  .attr('y', -50)
  .attr('transform', 'rotate(-90)')
  .attr('text-anchor', 'middle')
  .text('Medical Facitilty Condition')

  let barGroups = barChart.selectAll()
    .data(medFacData)
    .enter()
    .append('g')

  barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => xAxisScale(clicked))
    .attr('y', (g) => yAxisScale(medFacData.size))
    .attr('height', (g) => h - yAxisScale(medFacData.size) -5)
    .attr('width', xAxisScale.bandwidth())
    .style("fill", "#CCB")



//// debug
//console.log(countyMap);
let mapGraph = geoGraph.selectAll("path")
  .data(countyMap.features)
  .enter()
  .append("path")
    .attr("d", path)
    .style("fill", "#DBDBDB")
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
      geoGraph.selectAll("path").transition().duration(500).style("fill", function(d) {
        for(let i = 0; i < clicked.length; i++) {
          if(clicked[i] == d.properties.NAME) {
            console.log(d.properties.NAME)
            console.log(d.properties.medNum)
            return facNumDegree(d.properties.ALAND);
          }
        }
        return '#ccc';
      })

    })

    tasks.select("#task1").on("click", function() {
      mapGraph.transition().duration(700)
        .style("fill", function(d) {
        //  if(){

        //  }
        //  else{}

        //Get data value
        let value = d.properties.ALAND;
        if (value) {
          return facNumDegree(value);
        } else {
          return "#DBDBDB";
        }
      })
      //initialize
      clicked = [];
      barChart.selectAll("rect").attr("stroke", "none")
    })
    tasks.select("#task2").on("click", function() {
      mapGraph.transition().duration(700)
        .style("fill", function(d) {

        let value = d.properties.ALAND;
        if (value) {
          return facNumDegree(value);
        } else {
          return "#DBDBDB";
        }
      })
      //initialize
      clicked = [];
      barChart.selectAll("rect").attr("stroke", "none")
    })
  })
})
