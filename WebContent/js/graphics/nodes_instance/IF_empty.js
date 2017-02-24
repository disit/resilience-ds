//----------------------------------------------------------------------------------
//------------------------ *** NODE ITALIAN FLAG EMPTY *** ------------------------
//----------------------------------------------------------------------------------

function addNodeIFEmpty(id_node, text_description, specific_object, function_manager)
{
	var IFempty_element = d3.selectAll("#gnode_"+id_node);
	
	// Add rectangles to nodes
	IFempty_element.append("rect")
		.attr("width", width_node)
		.attr("height", height_node)
		.attr("id", "rectNodeIF_"+id_node)
		.attr("class", "rect")
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

	// Add text to nodes
	IFempty_element.append("text")
		.attr("x", width_node / 2)
		.attr("y", height_node / 2-20)
		.attr("id","textdescription_"+id_node)
		.attr("dy", ".35em")
		.attr("text-anchor", "middle")
		.attr("class","text")
		.text(text_description);
	
	if(id_node == 0)
	{
		// Add text to nodes
		IFempty_element.append("text")
			.attr("x", width_node / 2)
			.attr("y", height_node / 2+10)
			.attr("id","textspecificObject")
			.attr("dy", ".35em")
			.attr("text-anchor", "middle")
			.attr("class","text")
			.text(specific_object);
	}
	
	IFempty_element.append("rect")
		.attr("width", width_node)
		.attr("height", 20)
		.attr("id","rectempty_"+id_node)
		.attr("x", 0)
		.attr("y", height_node-20)
		.attr("class", "rect");
	
	IFempty_element.append("image")
		.attr("id", "addIFicon_"+id_node)
	  	.attr("xlink:href", "image/plus_IF.png")
	  	.attr("title","Click to add Italian Flag Flag value")
	  	.attr("x", ((width_node/2)-10))
		.attr("y", (height_node-20))
		.attr("width", 20)
		.attr("height", 20)
		.on("click", function (d){
			if(d.id != 0)
				createIFWindow(d, 0, 0, 0, text_description);
		});
	
	if(function_manager != null)
	{
		IFempty_element.append("image")
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

function removeNodeIFEmpty(id_node)
{
	d3.selectAll("#gnode_"+id_node).empty();
}

function changeNodeIFEmptyToNodeIFModify(id_node, text_node, green, white, red, green_old, white_old, red_old, function_manager)
{
	if(green_old != 0 || white_old != 0 || red_old != 0)
	{
		if(green_IFinsert != 0.0 || white_IFinsert != 0.0 || red_IFinsert)
			addNodeIFModify(id_node, text_node, "", green_IFinsert, white_IFinsert, red_IFinsert, function_manager);
		else
			addNodeIFModify(id_node, text_node, "", green, white, red, function_manager);
	}
	else{
		addNodeIFModify(id_node, text_node, "", green, white, red, function_manager);
	}
	removeNodeIFEmpty(id_node);
}

function addFunctionManager(id_node, text_description)
{
	$('#imgStatusLFM_' + id_node).remove();
	
	d3.selectAll("#gnode_"+id_node).append("image")
		.attr("id", "imgStatusLFM_"+id_node)
	  	.attr("xlink:href", "image/instance/grey_query.png")
	  	.attr("x", width_node - 20)
		.attr("y", height_node / 2)
		.attr("width", 18)
		.attr("height", 18);
	
	d3.selectAll("#gnode_"+id_node).append("rect")
	.attr("width", width_node)
	.attr("height", 20)
	.attr("id","rectempty_"+id_node)
	.attr("x", 0)
	.attr("y", height_node-20)
	.attr("class", "rect");
	
	d3.selectAll("#gnode_"+id_node).append("image")
	.attr("id", "addIFicon_"+id_node)
  	.attr("xlink:href", "image/plus_IF.png")
  	.attr("title","Click to add Italian Flag value")
  	.attr("x", ((width_node/2)-10))
	.attr("y", (height_node-20))
	.attr("width", 20)
	.attr("height", 20)
	.on("click", function (d){
		if(d.id != 0)
			createIFWindow(d, 0, 0, 0, text_description);
	});
}