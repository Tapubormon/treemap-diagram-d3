const width = 1200;
const height = 600;
const padding = 20;

const svg = d3.select("#treemap").attr("width", width).attr("height", height);

const tooltip = d3.select("#tooltip");

const color = d3.scaleOrdinal(d3.schemeCategory10);

d3.json(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
).then((data) => {
  const root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  d3.treemap().size([width, height]).paddingInner(1)(root);

  const categories = Array.from(
    new Set(root.leaves().map((d) => d.data.category))
  );
  color.domain(categories);

  // Draw tiles
  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("fill", (d) => color(d.data.category))
    .on("mousemove", (event, d) => {
      tooltip
        .style("opacity", 0.9)
        .html(
          `<strong>Name:</strong> ${d.data.name}<br/>
             <strong>Category:</strong> ${d.data.category}<br/>
             <strong>Value:</strong> $${d.data.value.toLocaleString()}`
        )
        .attr("data-value", d.data.value)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });

  // Add text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("x", (d) => d.x0 + 4)
    .attr("y", (d) => d.y0 + 14)
    .text((d) => d.data.name)
    .attr("font-size", "10px")
    .attr("fill", "black");

  // Create legend
  const legend = d3.select("#legend");
  legend.append

  const legendItems = legend
    .selectAll(".legend-item")
    .data(categories)
    .enter()
    .append("div")
    .attr("class", "legend-item");

    legendItems
    .append("rect")
    .attr("class", "legend-item")
    .attr("fill", d => color(d));

  legendItems
    .append("div")
    .attr("class", "legend-color")
    .style("background-color", (d) => color(d));

  legendItems.append("span").text((d) => d);

  console.log(data);
});
