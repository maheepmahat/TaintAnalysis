// taintGraph.js
const width = 800;  // Graph width
const height = 600; // Graph height
let currentLayer = 0; // Track the current layer

//  SVG container
const svg = d3.select("#taintGraph").append("svg")
    .attr("width", width)
    .attr("height", height);

// Force-directed layout setup
const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

function addLayerToGraph(newData) {
    currentLayer++;

    // Processing  newData here to fit into D3's expectations, e.g., create nodes and links arrays

    // Add links (lines)
    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(newData.links)
        .enter().append("line")
        .attr("class", "link");

    // Add nodes (circles)
    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(newData.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5) // Node radius
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded));

    // Add tooltip or other interactive elements here

    // Update and restart the simulation
    simulation
        .nodes(newData.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(newData.links);

    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    function dragStarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragEnded(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

//  Call addLayerToGraph with new data
// addLayerToGraph({ nodes: [...], links: [...] });
