//----------------------------------------------------------------------------------
//--------------------------------- *** NODE TEXT *** ------------------------------
//----------------------------------------------------------------------------------
function addNodeText(id_node, text_edit)
{		
	var text_element = d3.selectAll("#gnode_"+id_node);
	
	// Add rectangles to nodes
	text_element.append("rect")
		.attr("width", width_node)
		.attr("height", height_node)
		.attr("class", "node text-only");
	
	text_element.append("rect")
		.attr("width", 0.33*width_node)
		.attr("height", 20)
		.attr("x", 0)
		.attr("y", height_node-20)
		.attr("class","rect_empty");

	text_element.append("rect")
		.attr("width", 0.33*width_node)
		.attr("height", 20)
		.attr("x", 0.33*width_node)
		.attr("y", height_node-20)
		.attr("class","rect_empty");

	text_element.append("rect")
		.attr("width", 0.34*width_node)
		.attr("height", 20)
		.attr("x", (0.33*width_node+0.33*width_node))
		.attr("y", height_node-20)
		.attr("class","rect_empty");
	
	// Add text to nodes
	text_element.append("text")
		.attr("id","textdescription_"+id_node)
		.attr("x", width_node/2)
		.attr("y", (height_node/2)-5)
		.attr("dy", ".35em")
		.attr("text-anchor", "middle")
		.attr("class","text")
		.text(text_edit);
	
	
	var text = d3.selectAll("#textdescription_"+id_node);
	var words,
    word,
    line = [],
    lineNumber = 0,
    lineHeight = 1.1, // ems 1.1
    x = text.attr("x"),
    y = text.attr("y"),
    dy = parseFloat(text.attr("dy")),
    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
	if(text.text()) words = text.text().split(/\s+/).reverse();
	while (word = words.pop()) {
		line.push(word);
		tspan.text(line.join(" "));
		if (tspan.node().getComputedTextLength() > width_node) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		}
	}
	
}