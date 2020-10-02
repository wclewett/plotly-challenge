function init() {
    // Select the dropdown element
    var selector = d3.select("#selDataset");
    
    // Populate the dropdown with subject ID's from the list of sample Names
      d3.json("data/samples.json").then((data) => {
        var subjectIds = data.names;
        subjectIds.forEach((id) => {
          selector
          .append("option")
          .text(id)
          .property("value", id);
        });
      
      // Use the first subject ID from the names to build initial plots
      const firstSubject = subjectIds[0];
      updateCharts(firstSubject);
      updateMetadata(firstSubject);
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

    // Data for Bubble Chart
    var trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          // Custom colorscale: ⟨r,g,b⟩ = ⟨40,190,220⟩ + t⟨11,-15,1⟩
          colorscale: [
            ['0.0', 'rgb(40, 190, 220)'],
            ['0.1', 'rgb(51, 175, 221)'],
            ['0.2', 'rgb(62, 160, 222)'],
            ['0.3', 'rgb(73, 145, 223)'],
            ['0.4', 'rgb(84, 130, 224)'],
            ['0.5', 'rgb(95, 115, 225)'],
            ['0.6', 'rgb(106, 100, 226)'],
            ['0.7', 'rgb(117, 85, 227)'],
            ['0.8', 'rgb(128, 70, 228)'],
            ['0.9', 'rgb(139, 55, 229)'],
            ['1.0', 'rgb(150, 40, 230)']
          ]
        }
    };
    var data = [trace1];
    // find max and min sample value
    var maxSampleVal = Math.max.apply(null, sample_values);
    var minSampleVal = Math.min.apply(null, sample_values);
    var bubbleSizer = sample_values.map(x => Math.ceil(x / 2));
    console.log(sample_values);
    console.log(bubbleSizer);

    // Layout for Bubble Chart
    var layout = {
        title: {
            text: 'Bacteria Cultures per Sample',
            font: {
                family: "Courier New, monospace",
                color: "black",
                size: 18
            }
        },
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "lavender",
        showlegend: false,
        hovermode: 'closest',
        xaxis: {
            title:"OTU (Operational Taxonomic Unit) ID " +sample
        },
         yaxis: {
            range: [0, maxSampleVal * 4]
        },
        margin: {t:50}
    };

    Plotly.newPlot('bubble', data, layout); 

    // Data for Bar Chart
    var trace1 = {
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        marker: {
            color: "RebeccaPurple"
        },
        name: "Greek",
        type: "bar",
        orientation: "h"
    };
    var data = [trace1];

    // Layout for Bar Chart
    var layout = {
        width: 475,
        height: 400,
        title: {
            text: "Top Ten OTUs for Individual " +sample,
            font: {
                family: "Courier New, monospace",
                color: "black",
                size: 18
            }
        },
        xaxis: {
            title: {
              text: 'Sample Values',
              font: {
                family: 'Courier New, monospace',
                size: 18,
                color: 'black'
              }
            }
        },
        paper_bgcolor: "lavender",
        margin: {l: 100, r: 100, t: 100, b: 100}
    };
    Plotly.newPlot("bar", data, layout);  
    });
  }

    // Gague Chart
    function updateMetadata(sample) {
        d3.json("data/samples.json").then((data) => {
            var metadata = data.metadata;
            var filterArray = metadata.filter(sampleObject => sampleObject.id == sample);
            var result = filterArray[0];
            var metaPanel = d3.select("#sample-metadata");
            // use loop find maximum wfreq across all samples
            var max = -Infinity;
            var l = metadata.length;
            console.log(l);
            for(var i = 0; i < l; i++) {
                var maxWFreq = metadata[i].wfreq
                if (maxWFreq > max) {
                    max = maxWFreq;
                }
            };
            console.log(max);
            metaPanel.html("");
            Object.entries(result).forEach(([key, value]) => {
                metaPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
            })
        
      // Data for Gauge Chart
        var data = [
          {
            domain: { x: [0, 1], y: [0, 1] },
            marker: {size: 42, color:'black'},
            value: result.wfreq,
            title: {
                text: 'Belly Button Washing Frequency <br> Weekly Frequency',
                font: {
                    family: "Courier New, monospace",
                    color: "black",
                    size: 18
                }
            },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, max + 1]},
                steps: [
                    {range: [0, 1], color: 'rgb(40, 190, 220)'},
                    {range: [1, 2], color: 'rgb(51, 175, 221)'},
                    {range: [2, 3], color: 'rgb(62, 160, 222)'},
                    {range: [3, 4], color: 'rgb(73, 145, 223)'},
                    {range: [4, 5], color: 'rgb(84, 130, 224)'},
                    {range: [5, 6], color: 'rgb(95, 115, 225)'},
                    {range: [6, 7], color: 'rgb(106, 100, 226)'},
                    {range: [7, 8], color: 'rgb(117, 85, 227)'},
                    {range: [8, 9], color: 'rgb(128, 70, 228)'},
                    {range: [9, 10], color: 'rgb(139, 55, 229)'},
                  ],
                bar: { color: "rgb(233, 225, 240)" },
                borderwidth: 2,
                bordercolor: "gray"
              }
          }
        ];
    
        // Layout for Gauge Chart
        var layout = {
            width: 455,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            paper_bgcolor: "lavender",
            font: { color: "darkblue", family: "Courier New, monospace" },
          };
      
        
        Plotly.newPlot("gauge", data, layout);
        });
      }
    
  
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    updateCharts(newSample);
    updateMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();