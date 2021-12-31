// set variables by the ids from html 
var idSelect = d3.select("#selDataset");
var demographic_info = d3.select("#sample-metadata");
var bar_chart = d3.select('#bar');
var gauge_chart = d3.select('#gauge');
var bubble_chart = d3.select('#bubble');

// read the data, get the first id as the default, plot with the default id
function init() {
    // reset previous data
    reset()

    d3.json('data/samples.json').then(function(data) {
        // array.forEach(element => { })
        data.names.forEach(name => {
            var option = idSelect.append("option");
            option.text(name);
        })
        var init_id = idSelect.property("value")
        plotCharts(init_id)
    })
};


// clear divs for new data
function reset() {
    demographic_info.html("");
    bar_chart.html("");
    bubble_chart.html("");
    gauge_chart.html("");
}; 


// charts plotting
function plotCharts(id) {

    // read the JSON data
    d3.json("data/samples.json").then((data => {

        // ** Demopraphic info for the selected ID ** //

        // filter the metadata for the chosen ID
        var participants_data = data.metadata.filter(participant => participant.id == id)[0];

        // get the wash frequency for gauge chart later
        var wfreq = participants_data.wfreq;

        // Iterate through the metadata
        Object.entries(participants_data).forEach(([key, value]) => {

            var demoItems = demographic_info.append("ul");
            demoItems.attr("class", "list-group");

            // append a li item to the unordered list tag
            var info_items = demoItems.append("li");

            // change the class attributes of the list item for styling
            info_items.attr("class", "list-group-item demo-text bg-transparent");

            // add the key value pair from the metadata to the demographics list
            info_items.text(`${key}: ${value}`);

        });


        // ** Retrieve data to plot the charts ** //

        // create empty arrays to store sample data
        var otu_ids = [];
        var otu_labels = [];
        var sample_values = [];
        
        // filter the samples for the ID chosen
        var samples_ids = data.samples.filter(sample => sample.id == id)[0];

        // Iterate through the sample data to retrieve data for plotting
        Object.entries(samples_ids).forEach(([key, value]) => {

            // switch statement to categorize the info
            switch (key) {
                case "otu_ids":
                    otu_ids.push(value);
                    break;
                case "sample_values":
                    sample_values.push(value);
                    break;
                case "otu_labels":
                    otu_labels.push(value);
                    break;
                    // case
                default:
                    break;
            }
        }); 

        // get the top 10 by slicing and reversing the arrays
        var top10OtuIds = otu_ids[0].slice(0, 10).reverse();
        var top10Otulabels = otu_labels[0].slice(0, 10).reverse();
        var top10SampleValues = sample_values[0].slice(0, 10).reverse();

        // use the map function to store the IDs with "OTU" for labelling y-axis
        var top10OtuIdsFormatted = top10OtuIds.map(otuID => "OTU " + otuID);


        // ** Plotly: Bar Chart ** //

        // create a trace
        var bar_trace = {
            x: top10SampleValues,
            y: top10OtuIdsFormatted,
            text: top10Otulabels,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'rgba(0, 99, 0, 0.7)'
            }
        };

        // create the data array
        var bar_data = [bar_trace];

        // define the plot layout
        var bar_layout = {
            height: 500,
            width: 500,
            font: {
                family: 'Tahoma'},
            hoverlabel: {
                font: {family: 'Tahoma'}
            },
            title: {
                text: `<b>Top OTUs for Test ID ${id}</b>`,
                font: {
                    size: 18,
                    color: 'rgb(0, 99, 0)'}
            },
            xaxis: {
                title: "<b>Sample values<b>",
                color: 'rgb(0, 99, 0)'
            },
            yaxis: {
                tickfont: { size: 14 }
            }
        }

        // plot the bar chart
        Plotly.newPlot("bar", bar_data, bar_layout);


        // ** Plotly: Bubble Chart ** //

        // create trace
        var bubble_trace = {
            x: otu_ids[0],
            y: sample_values[0],
            text: otu_labels[0],
            mode: 'markers',
            marker: {
                size: sample_values[0],
                color: otu_ids[0],
                colorscale: 'Greens'
            }
        };

        // create the data array for the plot
        var bubble_data = [bubble_trace];

        // define the plot layout
        var bubble_layout = {
            font: {
                family: 'Tahoma'
            },
            hoverlabel: {
                font: {
                    family: 'Tahoma'
                }
            },
            xaxis: {
                title: `<b>OTU Id ${id}</b>`,
                color: 'rgb(0, 99, 0)'
            },
            yaxis: {
                title: "<b>Sample Values</b>",
                color: 'rgb(0, 99, 0)'
            },
            showlegend: false,
        };

        Plotly.newPlot('bubble', bubble_data, bubble_layout);


        // ** Plotly: Gauge Chart ** //
        // https://plotly.com/javascript/gauge-charts/#basic-gauge

        // if wfreq has a null value, make it zero
        if (wfreq == null) {
            wfreq = 0;
        }

        // create an indicator trace for the gauge chart
        var gauge_trace = {
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            type: "indicator",
            mode: "gauge",
            gauge: {
                axis: {
                    range: [0, 9],
                    tickmode: 'linear',
                    tickfont: {
                        size: 15
                    }
                },
                bar: { color: 'rgba(8,29,88,0)' }, // making gauge bar transparent since a pointer is being used instead
                steps: [
                    { range: [0, 1], color: '#F7FFDC' },
                    { range: [1, 2], color: '#D9FFBE' },
                    { range: [2, 3], color: '#BDFFA4' },
                    { range: [3, 4], color: '#A0E989' },
                    { range: [4, 5], color: '#85CC6F' },
                    { range: [5, 6], color: '#6AB155' },
                    { range: [6, 7], color: '#4F963C' },
                    { range: [7, 8], color: '#337824' },
                    { range: [8, 9], color: '#136207' }
                ]
            }
        };
    

        // determine angle for each wfreq segment on the chart
        var angle = (wfreq / 9) * 180;

        // calculate end points for triangle pointer path
        var degrees = 180 - angle,
            radius = .8;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: to create needle shape (triangle). 
        /* Initial coordinates of two of the triangle corners plus the third calculated 
        end tip that points to the appropriate segment on the gauge */
        // M aX aY L bX bY L cX cY Z
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            cX = String(x),
            cY = String(y),
            pathEnd = ' Z';
        var path = mainPath + cX + " " + cY + pathEnd;

        // gaugeColors = ['rgb(8,29,88)', 'rgb(37,52,148)', 'rgb(34,94,168)', 'rgb(29,145,192)', 'rgb(65,182,196)', 'rgb(127,205,187)', 'rgb(199,233,180)', 'rgb(237,248,217)', 'rgb(255,255,217)', 'white']

        // create a trace to draw the circle where the needle is centered
        var needleCenter_trace = {
            type: 'scatter',
            showlegend: false,
            x: [0],
            y: [0],
            marker: { size: 36, color: '800000' },
            name: wfreq,
            hoverinfo: 'name'
        };

        // create a data array from the two traces
        var gauge_data = [gauge_trace, needleCenter_trace];

        // define a layout for the chart
        var gauge_layout = {

            // draw the needle pointer shape using path defined above
            shapes: [{
                type: 'path',
                path: path,
                fillcolor: '800000',
                line: {
                    color: '800000'
                }
            }],
            font: {
                family: 'Tahoma'
            },
            hoverlabel: {
                font: {
                    family: 'Tahoma',
                    size: 16
                }
            },
            title: {
                text: `<b>Test ID ${id}</b><br><b>Belly Button Washing Frequency</b><br><br>Scrubs per Week`,
                font: {
                    size: 18,
                    color: 'rgb(0, 99, 0)'
                },
            },
            height: 500,
            width: 500,
            xaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1],
                fixedrange: true // disable zoom
            },
            yaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-0.5, 1.5],
                fixedrange: true // disable zoom
            }
        };

    
        Plotly.newPlot('gauge', gauge_data, gauge_layout);

    }));

}; 
// end of chart plotting

/* when there is a change in the dropdown select menu, 
this function is called with the ID as a parameter */

function optionChanged(id) {

    // reset the data
    reset();

    // plot the charts for this id
    plotCharts(id);


};

// call the init() function for default data
init();
