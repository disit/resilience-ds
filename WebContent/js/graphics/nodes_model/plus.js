//----------------------------------------------------------------------------------
//--------------------------------- *** NODE PLUS *** ------------------------------
//----------------------------------------------------------------------------------

function addNodePlus(node_plus, gelement)
{			
	gelement.append("image")
	.attr("class", "node plus")
	.attr("id", function(d){
		return ("nodeplus_"+getId(d.position));
	})
  	.attr("xlink:href", node_plus.path)
	.attr("x", (node_plus.x+width_node/2-width_nodeplus/2)-2.5)
	.attr("y", node_plus.y+5)
	.attr("width", width_nodeplus+5)
	.attr("height", height_nodeplus+5)
	.on("click", function (d){
		changeNodePlusToNodeEdit(getId(d.position));
	});
}

function removeNodePlus(id_node)
{
	d3.selectAll("#nodeplus_"+id_node).remove();
}

function changeNodePlusToNodeEdit(id_node)
{		
	// CHIAMATA REST PER AGGIUNTA CRITERIA AL MODEL
	clientRest.addCriteria("C"+id_node, "description_"+id_node);
	
	addNodeEdit(id_node, "Insert description...");
	removeNodePlus(id_node);
	
	update(id_node);
}

function getId(position)
{
	if(position == undefined)
		position = "C0";
	return parseInt(position.substring(1));
}