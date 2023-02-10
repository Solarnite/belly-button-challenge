// URL endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function for charts
function Plotting(id) {
    d3.json(url).then(function(data) {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == id);
        var result = resultArray[0];
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
        console.log(otu_ids, otu_labels, sample_values);

        // Bar chart

        var trace1 = {
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            type: 'bar',
            orientation: 'h',
        };

        var data = [trace1];

        var layout = {
            title: 'Top 10 OTUs',
            xaxis: { autorange: true},
            yaxis: { autorange: true},
        };
        Plotly.newPlot('bar', data, layout);

        // Bubble chart

        var trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                color: otu_ids,
                size: sample_values,
                sizeref: 0.1,
                sizemode: 'area',
                colorscale: 'Earth'
            },
        };

        var data2 = [trace2];

        var layout2 = {
            margin: { t:0 },
            xaxis: { title: 'OTU ID'},
            hovermode: "closest",
            width: window.width
        };
        Plotly.newPlot('bubble', data2, layout2);
    });
}

// Demographic Info
function demographic(id) {
    d3.json(url).then(function(data) {
        var MetaData = data.metadata;
        var microbe = MetaData.filter(sampleObj => sampleObj.id == id);
        var result = microbe[0];
        var infobox = d3.select("#sample-metadata");
        infobox.html("");
        Object.entries(result).forEach(([key, value]) => {
            infobox.append("h5").text(`${key}: ${value}`);
        });

        var gauge = [
            {
                domain: {x: [0, 5], y: [0, 1]},
                value: result.wfreq,
                text: result.wfreq,
                type: "indicator",
                mode: "gauge+number",
                delta: { reference: 10},
                gauge: {
                    axis: { range: [null, 9] },
                    steps: [
                        { range: [0, 1], color: "rgb(249, 243, 236)" },
                        { range: [1, 2], color: "rgb(240, 234, 220)" },
                        { range: [2, 3], color: "rgb(231, 225, 205)" },
                        { range: [3, 4], color: "rgb(219, 217, 190)" },
                        { range: [4, 5], color: "rgb(205, 209, 176)" },
                        { range: [5, 6], color: "rgb(190, 202, 164)" },
                        { range: [6, 7], color: "rgb(173, 195, 153)" },
                        { range: [7, 8], color: "rgb(154, 188, 144)" },
                        { range: [8, 9], color: "rgb(133, 181, 137)" },
                    ],
                },
            },
        ];

        var layout = {
            title: "<b> Bellow Button Washing Frequency </b> <br> Scrubs Per Week </br>",
            width: 500,
            height: 500,
            margin: { t: 50, r: 25, l: 25, b: 25},
        };
        Plotly.newPlot('gauge', gauge, layout);
    });
}

// Drop down menu
function init() {
    d3.json(url).then(function(data) {
        let dropdownMenu = d3.select("#selDataset");
        data.names.forEach(function(name) {
            dropdownMenu
                .append('option')
                .text(name)
                .property('value', name);
        });
        var firstSample = data.names[0];
        Plotting(firstSample);
        demographic(firstSample);
        });
}

function optionChanged(newSample) {
    Plotting(newSample);
    demographic(newSample);
}

init();