# Plotly-Challenge 
## Belly Button Biodiversity

![Virus.jpg](https://github.com/PeiDay/Plotly-Challenge/blob/main/static/images/2029078.jpg)

## Background
We are building an interactive dashboard to explore the [Belly Button Biodiversity dataset](http://robdunnlab.com/projects/belly-button-biodiversity/), which catalogs the microbes that colonize human navels.

The dataset reveals that a small handful of microbial species (also called operational taxonomic units, or OTUs, in the study) were present in more than 70% of people, while the rest were relatively rare.

Demographics information is populated based upon a user-selected test subject ID. A bar chart, bubble chart and a gauge chart also update once the ID is changed. Code has been written using Plotly, JavaScript, HTML, CSS, and D3.js.

Belly Button Diversity Dashboard: https://peiday.github.io/Plotly-Challenge/

## Plotly 
The ask was to retrieve the demographics by the test ID, and make bar chart and bubble chart displaying each individual's samples. This was done as follows:

* Read in samples.json using the D3 library;

* Retrieve metadata info for each test subject and display this in the form of an unordered list item as a key-value pair on the dashboard;

* Get required data for plotting, including sample_values, otu_ids and otu_labels which were used to create a trace and plot the bar chart;

* Display the charts as below: 
    ![dashboard](https://github.com/PeiDay/Plotly-Challenge/blob/main/static/images/BBB_dashboard.png)
    ![bar](https://github.com/PeiDay/Plotly-Challenge/blob/main/static/images/bar.png)
    ![bubble](https://github.com/PeiDay/Plotly-Challenge/blob/main/static/images/bubble.png)
    ![gauge_needle](https://github.com/PeiDay/Plotly-Challenge/blob/main/static/images/gauge_needle.png)

## Sources
* Hulcr, J. et al.(2012) A Jungle in There: Bacteria in Belly Buttons are Highly Diverse, but Predictable. Retrieved from: http://robdunnlab.com/projects/belly-button-biodiversity/results-and-data/
