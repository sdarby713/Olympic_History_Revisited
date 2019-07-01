// This is a saved version of app.js that "produces" the olympic cities map

function init() {
  console.log("Entering init function");

  // Grab a reference to the dropdown select element
  var selector2 = d3.select("#selNOC");
  var selector3 = d3.select("#selSport");

  // Populate the NOC selector list
  d3.json(`/names`).then(function(nocdata) {
    selector2
      .append("option")
      .text("All")
      .property("value", "All") 
    nocdata.forEach((datum) => {
      selector2
        .append("option")
        .text(datum.NOC)
        .property("value", datum.NOC)  });
  });
  

  // Populate the Sport selector list
  var sportList = ["All", "Athletics", "Cycling", "Diving", "Fencing", "Gymnastics", "Rowing", "Swimming", "Weightlifting"];
  sportList.forEach((sport) => {
    selector3
      .append("option")
      .text(sport)
      .property("value", sport);
    });


  // Use the defaults to build the initial plots
  const defaultSelections = [1896, 2016, "All", "All", "MWXGSB"];
  buildCharts(defaultSelections);

}
function buildCharts(sels) {
  console.log ("entering buildCharts");

  Promise.all([
    d3.json(`/names`),
    d3.json(`/medals/${sels[0]}/${sels[1]}/${sels[2]}/${sels[3]}/${sels[4]}`),
    d3.json(`/olympiads`)
  ]).then(([NOCData, medalData, olympiData]) => {
      buildChart1(olympiData, sels[0]);
      builhbarchart(medalData, sels);   // including sels primarily to be able to label the chart
      buildgageplot(olympiData, sels[0]);
      buildbarchart(olympiData);
  });
};

function buildChart1(oData, year)  {

  // here is a list of where logo images may be found
  const logos = 
      [ "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Athens_1896_report_cover.jpg/330px-Athens_1896_report_cover.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/JOParis_1900.jpg/330px-JOParis_1900.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/1904summerolympicsposter.jpg/330px-1904summerolympicsposter.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Olympic_games_1908_London.jpg/330px-Olympic_games_1908_London.jpg",
        "https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/1912_Summer_Olympics_poster.jpg/330px-1912_Summer_Olympics_poster.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/7/73/1920_olympics_poster.jpg",
        "https://upload.wikimedia.org/wikipedia/en/thumb/4/45/1924_Summer_Olympics_logo.svg/330px-1924_Summer_Olympics_logo.svg.png",
        "https://upload.wikimedia.org/wikipedia/en/f/f9/1928_Olympics_poster.jpg",
        "https://upload.wikimedia.org/wikipedia/en/thumb/0/0f/1932_Summer_Olympics_logo.svg/255px-1932_Summer_Olympics_logo.svg.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/1936_berlin_logo.jpg/330px-1936_berlin_logo.jpg",
        "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/1948_Summer_Olympics_logos.svg/266px-1948_Summer_Olympics_logos.svg.png",
        "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/1952_Summer_Olympics_logo.svg/330px-1952_Summer_Olympics_logo.svg.png",
        "https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/1956_Summer_Olympics_logo.svg/225px-1956_Summer_Olympics_logo.svg.png",
        "https://upload.wikimedia.org/wikipedia/en/1/11/1960_Summer_Olympics_logo.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tokyo_1964_Summer_Olympics_logo.svg/180px-Tokyo_1964_Summer_Olympics_logo.svg.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/1968_Mexico_emblem.svg/330px-1968_Mexico_emblem.svg.png",
        "https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/1972_Summer_Olympics_logo.svg/330px-1972_Summer_Olympics_logo.svg.png",
        "https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/1976_Summer_Olympics_logo.svg/330px-1976_Summer_Olympics_logo.svg.png",
        "https://upload.wikimedia.org/wikipedia/en/thumb/c/c1/Emblem_of_the_1980_Summer_Olympics.svg/330px-Emblem_of_the_1980_Summer_Olympics.svg.png",
        "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/1984_Summer_Olympics_logo.svg/330px-1984_Summer_Olympics_logo.svg.png",
        "https://upload.wikimedia.org/wikipedia/en/thumb/d/d6/1988_Summer_Olympics_logo.svg/225px-1988_Summer_Olympics_logo.svg.png",
        "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/1992_Summer_Olympics_logo.svg/300px-1992_Summer_Olympics_logo.svg.png",
        "https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/1996_Summer_Olympics_logo.svg/255px-1996_Summer_Olympics_logo.svg.png",
        "https://upload.wikimedia.org/wikipedia/en/thumb/8/81/2000_Summer_Olympics_logo.svg/287px-2000_Summer_Olympics_logo.svg.png",
        "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/2004_Summer_Olympics_logo.svg/286px-2004_Summer_Olympics_logo.svg.png",
        "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/2008_Summer_Olympics_logo.svg/248px-2008_Summer_Olympics_logo.svg.png",
        "https://upload.wikimedia.org/wikipedia/en/thumb/d/de/2012_Summer_Olympics_logo.svg/270px-2012_Summer_Olympics_logo.svg.png",
        "https://upload.wikimedia.org/wikipedia/en/thumb/d/df/2016_Summer_Olympics_logo.svg/267px-2016_Summer_Olympics_logo.svg.png" ]
  for (var i = 0; i < oData.length; i++)  {
    if (year === oData[i].Year)  {
      d3.select("#c1d").text(oData[i].Year)
      d3.select("#c2d").text(oData[i].City)
      d3.select("#c3d").text(oData[i].Nations)
      d3.select("#c4d").text(oData[i].Athletes_M)
      d3.select("#c5d").text(oData[i].Athletes_W)
      d3.select("#c6d").text(oData[i].Sports)
      d3.select("#c7d").text(oData[i].Events)
      d3.select("img").attr('src', logos[i])
    }
  }

}

// *************************************
// Buildup Stacked Horizontal  Bar Chart
// *************************************

function builhbarchart(mdata, sels) {
  console.log("Entering builhbarchart")
  console.log(mdata);
  console.log(sels);

  var lowerLimit = mdata.length;
  if (sels[2] === 'All')  {
    if (lowerLimit > 15)  { lowerLimit = 15; }
  }
  lowerLimit -= 1;  // to adjust for js array convention

  var y = [];
  var x1 = [];
  var x2 = [];
  var x3 = [];

  for (var i = lowerLimit; i >= 0; i--)  {
    y.push(mdata[i].Key);
    x1.push(mdata[i].Gold_t);
    x2.push(mdata[i].Silver_t);
    x3.push(mdata[i].Bronze_t);
  }

  var trace1 = {
    y: y,
    x: x1, 
    name: 'Gold',
    orientation: 'h',
    marker: {
        color: '#ffff00'
      },
    type: 'bar'
  };
 

  var trace2 = {
      y: y,
      x: x2,
      name: 'silver',
      marker: {
          color:'#C0C0C0'
        },
      orientation: 'h',
      type: 'bar'
  };


  var trace3 = {
      y: y,
      x: x3,
      name: 'Bronze',
      orientation: 'h',
      marker: {
          color: '#d2a92d'
        },
      type: 'bar'
  };                                
     
  var data = [trace1, trace2, trace3 ];

  var layout = {
  title:"Summer Olympics Winner Countries by Medals",  
  titlefont: {
      size: 29
      },   
  barmode: 'stack'};

  Plotly.newPlot('Libar', data, layout);

};


// .......... Gauge plot to show profit or Fund loss for each Olympic game.......... //
function buildgageplot(data, yearselect) {
  console.log("Entering buildgageplot")
  if (yearselect < 1976)  { yearselect = 1976 };

  // clear out any previous information and gauge
  d3.select('#FZgauge').html(" ");
  d3.select("#fzmetadata").html(" ");

  console.log(data);
  data = data.filter(data =>data.Year === yearselect);
  console.log(data);
  var profit = parseFloat(data[0].ProfitorLoss)/1000;
  var Text = data[0].Notes;
  var Title = data[0].City;
  var totalcost = data[0].Total_Costs/1000;
  // Comment = data[0].ProfitorLoss
  profit = Math.round(profit * 100) / 100
  if (profit<0) {
    profit = -profit;
    gMax = 15;
    gMaxTxt = "15 Bn.";
    gColor = "#eb2d1f";
  }
  else {
    gMax = 1.1;
    gMaxTxt = "1.1 Bn.";
    gColor = "#125ee3";
  } 

  var g1 = new JustGage({
    id: 'FZgauge',
    value: profit,
    min: 0,
    max: gMax,
    maxTxt: gMaxTxt,
    textRenderer: function(val) {
      return "$"+profit.toString()+" Bn.";
    },  
        
    pointer: false,
    label: "Total Costs: "+"$"+totalcost.toString() +" Bn.",
    gaugeWidthScale: 0.6,
    counter: true,
    relativeGaugeSize: true,
    levelColors: [gColor],
    titleMinFontSize: "6px",
    titleFontColor: ["#999"],
    color: [gColor]   
  });      
        
  // .......... information box.......... //
  d3.select("#fzmetadata").append('div')
    .text(Text)
    .attr('padding',"8px")
    .attr("font-weight","1000");
  d3.select("#olycity").text(Title);
  
};

// // *************************************************************************										
// // * Display the line and bar combine plot for selected options											
// // * ************************************************************************												
function buildbarchart(odata) {
  console.log("Entering buildbarchart")
									
	// we only have data from 1976 forward
	odata = odata.filter(odata =>odata.Year > 1975);

	xx1 = [];
	yy1 = [];
	xx2 = [];
	yy2 = [];
	color2 = [];
	xx3 = [];
	yy3 = [];
	color3 = [];
	yy4 = [];

	var i = 0;
	for (i = 0; i < odata.length; i++)  {
    odata[i].ProfitorLoss = parseInt(odata[i].ProfitorLoss, 10);
		xx1.push(odata[i].Year.toString() + "y");  // apparently, numbers are treated like numbers even if they are strings
		yy1.push(odata[i].Total_Costs);
		xx2.push(odata[i].Year.toString() + "y");
		yy2.push(odata[i].ProfitorLoss);
    if (odata[i].ProfitorLoss > 0)  { color2.push('rgb(0, 179, 0)'); }
    else { color2.push('rgb(179, 0, 0)') };
	}
  
  console.log("odata before sort: ", odata);
  // the second graph features the same data as the third, sorted by ProfitorLoss
  odata.sort(function(a,b)  {
    return a.ProfitorLoss - b.ProfitorLoss;
  });
  console.log("odata  after sort: ", odata);

  for (i = 0; i < odata.length; i++)  {
		xx3.push(odata[i].Year.toString() + "y");
		yy3.push(odata[i].ProfitorLoss);
    if (odata[i].ProfitorLoss > 0)  { color3.push('rgb(0, 179, 0)'); }
    else { color3.push('rgb(179, 0, 0)') };
	}



  // console.log("For chart 1:");
  // console.log(xx1);
  // console.log(yy1);
  // console.log("For chart 2:");
  // console.log(xx2);
  // console.log(yy2);
  // console.log("For chart 3:");
  // console.log(xx3);
  // console.log(yy3);


	var trace2 = {
    x: xx1,
    y: yy1,
    name: "Total Costs",
    mode: 'lines+markers',
    type: "scatter",
    marker: {
      color: "purple",
    },
  };
  var data = [trace2];
  var layout = {
    title: "Olympic Host City Total Costs",
    yaxis: {
      title: 'USD (Million)',
      font: {
        family:"Arial",
      },
    },
  };										
												
	Plotly.newPlot("FZbar1", data, layout);
										
	var trace1 = {
    x: xx2,
    y: yy2,
    marker:{
      color: color2,
    },
    name: "Profits or Loss",
    type: "bar"
  };
												
  var data = [trace1];
  var layout = {
    title: "Olympic Profits and Fund Loss",
    yaxis: {
      title: 'USD (Million)',
      font: {
        family:"Arial",
      },
    },
  };
												
	Plotly.newPlot("FZbar2", data, layout);
												
  var trace3 = {
    x: xx3,
    y: yy3,
    name: "Profits or Loss",
    marker:{
      color: color3,
    },
    type: "bar"
  };

  var data = [trace3];
  var layout = {
    title: "Olympic Profits or Fund Loss - By Year",
    yaxis: {
      title: 'USD (Million)',
      font: {
        family:"Arial",
      },
    },
  };

  Plotly.newPlot("FZbar3", data, layout);
		
};


// function buildChart2(medaldata)  {


// }



// Initialize the dashboard
init();

// next, set up the select button:
var btn = d3.select("#filter-btn");

btn.on("click", function() {
  d3.event.preventDefault();

  var fromYear = d3.select("#frYear").property("value");
  var toYear   = d3.select("#toYear").property("value");
  var selectedNOC = d3.select("#selNOC").property("value");
  var selectedSport = d3.select("#selSport").property("value");

  var cb1 = d3.select("#cb1").property("checked");
  var cb2 = d3.select("#cb2").property("checked");
  var cb3 = d3.select("#cb3").property("checked");
  var cb4 = d3.select("#cb4").property("checked");
  var cb5 = d3.select("#cb5").property("checked");
  var cb6 = d3.select("#cb6").property("checked");

  console.log(cb1, cb2, cb3, cb4, cb5, cb6);
  var genderMen = ".";
  var genderWomen = ".";
  var genderMixed = ".";
  var medalGold = ".";
  var medalSilver  = ".";
  var medalBronze  = ".";
  if (cb1)  { genderMen = "M"; }
  if (cb2)  { genderWomen = "W"; }
  if (cb3)  { genderMixed = "X"; }
  if (cb4)  { medalGold = "G"; }
  if (cb5)  { medalSilver = "S"; }
  if (cb6)  { medalBronze = "B"; }


  if (fromYear > " ")  {
      fromYear = +fromYear
      if (toYear > " ")  {
        toYear = +toYear;
      }
      else {
        toYear = fromYear;
      }
  }
  else  {
      fromYear = 1896;
      toYear   = 2016;
  }

  var checkboxes = genderMen + genderWomen + genderMixed + medalGold + medalSilver + medalBronze;
  selections = [fromYear, toYear, selectedNOC, selectedSport, checkboxes];
  console.log(selections);
  buildCharts(selections);
});
