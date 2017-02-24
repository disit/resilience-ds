//----------------------------------------------------------------------------------
//---------------------------- *** NODE ITALIAN FLAG *** ---------------------------
//----------------------------------------------------------------------------------

function addNodeIF(id_node, text_description, text_description_object, green, white, red, function_manager)
{
	var IF_element = d3.selectAll("#gnode_"+id_node);
	
	IF_element.append("rect")
		.attr("width", width_node)
		.attr("height", height_node)
		.attr("id", "rectNodeIF_"+id_node)
		.attr("class","rect")
		.on('mouseout', function(d){
			if(tip != null)
			{
				timer_tooltip_visible = setTimeout(function(d){
					tip.hide(d);
				}, 500);		
				$('#d3_tooltip').on("mouseover",function(){
					clearTimeout(timer_tooltip_visible);
				});
				$('#d3_tooltip').on("mouseout",function(d){
					console.log(d);
					// Controllo per non far chiudere il tooltip quando ci si sposta sugli elementi interni del tooltip
					if(d.relatedTarget.localName == "svg") 
						tip.hide(d);
				});
			}
		})
		.on('mouseover', function(d){		
			if(tip != null)
			{
				if(timer_tooltip_visible){
				    clearTimeout(timer_tooltip_visible);
				    timer_tooltip_visible = null;
				}
					
				tip.show(d);
			}
		});

	IF_element.append("text")
		.attr("x", width_node / 2)
		.attr("y", height_node / 2 - 20)
		.attr("id","textdescription_"+id_node)
		.attr("dy", ".35em")
		.attr("text-anchor", "middle")
		.attr("class","text")
		.text(text_description);
	
	if(id_node == 0)
	{
		IF_element.append("text")
			.attr("x", width_node / 2)
			.attr("y", height_node / 2+10)
			.attr("id","textspecificObject")
			.attr("dy", ".35em")
			.attr("text-anchor", "middle")
			.attr("class","text")
			.text(text_description_object);
	}
	
	IF_element.append("rect")
		.attr("width", green*width_node)
		.attr("height", 20)
		.attr("x", 0)
		.attr("y", height_node-20)
		.attr("class", "rect-green");
	
	IF_element.append("rect")
		.attr("width", white*width_node)
		.attr("height", 20)
		.attr("x", green*width_node)
		.attr("y", height_node-20)
		.attr("class", "rect-white");
	
	IF_element.append("rect")
		.attr("width", red*width_node)
		.attr("height", 20)
		.attr("x", (green*width_node+white*width_node))
		.attr("y", height_node-20)
		.attr("class", "rect-red");
	
	if(function_manager != null)
	{
		IF_element.append("image")
		.attr("id", "imgStatusLFM_"+id_node)
	  	.attr("xlink:href", function(d){
	  		if(d.function_manager == undefined) 
	  			return "";
	  		else if(d.function_manager.status == 0)
	  			return "image/instance/grey_query.png";
	  		else if(d.function_manager.status == 1)
	  			return "image/instance/yellow_query.png";
	  		else if(d.function_manager.status == 2)
	  			return "image/instance/green_query.png";
	  		else if(d.function_manager.status == 3)
	  			return "image/instance/red_query.png";
	  	})
	  	.attr("x", width_node - 20)
		.attr("y", height_node / 2)
//	  	.attr("y", 2)
		.attr("width", 18)
		.attr("height", 18);
	}
	
	var text = d3.selectAll("#textdescription_"+id_node),
    words = text.text().split(/\s+/).reverse(),
    word,
    line = [],
    lineNumber = 0,
    lineHeight = 1.1, // ems 1.1
    x = text.attr("x"),
    y = text.attr("y"),
    dy = parseFloat(text.attr("dy")),
    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
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
	
	var textSpecObj = d3.selectAll("#textspecificObject"),
    wordsSO = textSpecObj.text().split(/\s+/).reverse(),
    word,
    line = [],
    lineNumber = 0,
    lineHeight = 1.1, // ems 1.1
    x = textSpecObj.attr("x"),
    y = textSpecObj.attr("y"),
    dy = parseFloat(textSpecObj.attr("dy")),
	tspanSO = textSpecObj.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
	while (word = wordsSO.pop()) {
		line.push(word);
		tspanSO.text(line.join(" "));
		if (tspan.node().getComputedTextLength() > width_node) {
			line.pop();
			tspanSO.text(line.join(" "));
			line = [word];
			tspanSO = textSpecObj.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		}
	}
}