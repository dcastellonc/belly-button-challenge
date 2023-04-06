  // Use D3 to read in samples.json
  const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
  
  d3.json(url).then(function(data) {
  
    // Get the names of all the individuals
    let names = data.names;
    console.log(names);
  
    // Call createDropdown function to create the dropdown menu
    createDropdown(names);
  
    // Initialize the plots with the first sample
    let firstSample = names[0];
    optionChanged(firstSample, data, names);
  
    // Calling the optionChanged function whenever a new sample is selected
    d3.select("#selDataset").on("change", function() {
      let newSample = d3.select(this).property("value");
      optionChanged(newSample, data, names);
    });
  
  });

// Define a function to create the dropdown menu
function createDropdown(names) {
    let dropdown = d3.select("#selDataset");
    dropdown.selectAll("option")
            .data(names)
            .enter()
            .append("option")
            .text(function(d) {
              return d;
            })
            .attr("value", function(d) {
              return d;
            });
    console.log(dropdown);
  }
  
  // Define a function to update the plots based on the selected individual
  function optionChanged(sample, data, names) {
    let index;
    for (let i = 0; i < names.length; i++) {
      if (names[i] === sample) {
        index = i;
        break;
      }
    }
  
    // Getting the data for the selected sample
    let sampleData = data.samples[index];
    let otuIDs = sampleData.otu_ids;
    let sampleValues = sampleData.sample_values;
    let otuLabels = sampleData.otu_labels;
  
    // Slice the top 10 OTUs
    let top10IDs = otuIDs.slice(0,10).reverse();
    let top10Values = sampleValues.slice(0,10).reverse();
  
    // Create the horizontal bar chart
    let trace1 = {
      x: top10Values,
      y: top10IDs.map(d => `OTU ${d}`),
      type: "bar",
      orientation: "h"
    };
    let data1 = [trace1];
    let layout1 = {
      title: "Top 10 OTUs",
      xaxis: {title: "Sample Values"},
      yaxis: {title: "OTU IDs"}
    };
    Plotly.newPlot("bar", data1, layout1);
  
    // Create the bubble chart
    let trace2 = {
      x: otuIDs,
      y: sampleValues,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIDs,
        colorscale: "Picnic"
      }
    };
    let data2 = [trace2];
    let layout2 = {
      title: "All OTUs",
      xaxis: {title: "OTU IDs"},
      yaxis: {title: "Sample Values"}
    };
    Plotly.newPlot("bubble", data2, layout2);
  
    // Display the metadata
    let metadata = data.metadata[index];
    let panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(metadata).forEach(function([key, value]) {
      panel.append("p").text(key + ": " + value);
    });
  
  }
  

  