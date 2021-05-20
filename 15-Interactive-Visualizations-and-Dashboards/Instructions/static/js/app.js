function init() {
    // dropdown element
    var selector = d3.select("#selDataset");
    
    // Populate the dropdown 
      d3.json("data/samples.json").then((data) => {
        var subjectIds = data.names;
        subjectIds.forEach((id) => {
          selector
          .append("option")
          .text(id)
          .property("value", id);
        });
      
      // build initial plots
      const firstSubject = subjectIds[0];
      updateCharts(firstSubject);
      updateMetadata(firstSubject);
    });
  }
  
  
  
  function updateMetadata(sample) {
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;
        var filterArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var result = filterArray[0];
        var metaPanel = d3.select("#sample-metadata");
        metaPanel.html("");
        Object.entries(result).forEach(([key, value]) => {
            metaPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
        })
    
  // Data for Gauge Chart
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        marker: {size: 28, color:'850000'},
        value: result.wfreq,
        title: 'Belly Button Washing Frequency<br> Scrubs per Week',
        titlefont: {family: '"Palatino Linotype", "Book Antiqua", Palatino, serif'},
        type: "indicator",
        mode: "gauge+number"
      }
    ];
    // Layout for Gauge Chart
  
    var layout = {
      width: 450,
       height: 400,
       margin: { t: 25, r: 25, l: 25, b: 25 },
       line: {
       color: '600000'
       },
       paper_bgcolor: "#a5bdc6",
       font: { color: "#85541d", family: "Serif" }
     };
  
    
    Plotly.newPlot("gauge", data, layout);

    });
  }
  
  
  function updateCharts(sample) {    
    d3.json("data/samples.json").then((data) => {
    var samples = data.samples;
    var filterArray = samples.filter(sampleObject => sampleObject.id == sample);
    var result = filterArray[0];
    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;   
    // Bubble Chart
    var trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
        size: sample_values,
        color: otu_ids,
        colorscale:"Electric"
        }
    };
    var data = [trace1];
    var layout = {
        title: 'Bacteria Cultures per Sample',
        showlegend: false,
        hovermode: 'closest',
        xaxis: {title:"OTU (Operational Taxonomic Unit) ID " +sample},
        margin: {t:30}
    };
    Plotly.newPlot('bubble', data, layout); 
    // Bar Chart
    var trace1 = {
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        name: "Greek",
        type: "bar",
        orientation: "h"
    };
    var data = [trace1];
    var layout = {
        title: "Top Ten OTUs for Individual " +sample,
        margin: {l: 100, r: 100, t: 100, b: 100}
    };
    Plotly.newPlot("bar", data, layout);  
    });
  }
  
  
  function optionChanged(newSample) {
    // get new data for new sample 
    updateCharts(newSample);
    updateMetadata(newSample);
  }
  
  // Initialize
  init();
  