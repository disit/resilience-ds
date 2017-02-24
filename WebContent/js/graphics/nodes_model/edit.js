//----------------------------------------------------------------------------------
//--------------------------------- *** NODE EDIT *** ------------------------------
//----------------------------------------------------------------------------------
function addNodeEdit(id_node, text_edit)
{	
	var edit_element = d3.selectAll("#gnode_"+id_node);
	var no_focusout = false;
	
	edit_element.append("rect")
	.attr("class", 'node edit-rect')
	.attr("id",'nodeedit_'+id_node)
	.attr("width", width_node)
	.attr("height", height_node)
	.attr("x", 0)
	.attr("y", 0);

	edit_element.append("foreignObject")
    .attr("width", width_node-20)
    .attr("height", height_node)
    .attr("x", 8)
	.attr("y", 30)
    .attr('class', 'foreignObject')
    .append("xhtml:body")
    .html("<div id=div_nodeedit_"+id_node+"></div>")
    .append('input')
	.attr('type','text')
	.attr("value", text_edit)
	.attr("x", 2)
	.attr("y", 0)
	.attr("title","Press enter to save added description")
	.attr("class","input")
	.attr('id','input_nodeedit_'+id_node)
	.on("keydown", function(d){
		if(d3.event.keyCode == '13')
		{
			no_focusout = true;
			var edit_text = document.getElementById('input_nodeedit_'+id_node).value;
			if(edit_text.length > 0)
				changeNodeEditToNodeTextModify(id_node, edit_text);
			else
				$('#input_nodeedit_'+id_node).css("box-shadow", "0 0 10px red");
		}
	})
	.on("blur", function(d){
		if(!no_focusout){
			var edit_text = document.getElementById('input_nodeedit_'+id_node).value;
			if(edit_text.length > 0)
				changeNodeEditToNodeTextModify(id_node, edit_text);
		}
	})
	.on("focus", function(){
		$('#input_nodeedit_'+id_node).css("box-shadow", "0 0 0px #000");
        var focusedElement = this;
        setTimeout(function () { focusedElement.select(); }, 50);
	});
	
	if(document.getElementById('input_nodeedit_'+id_node).value === "Insert description...")
	{
		edit_element.append("image")
		.attr("id", "deleteediticon_"+id_node)
	  	.attr("xlink:href", "image/delete.png")
	  	.attr("title","Delete this criteria")
	  	.attr("x", (width_node-width_modifyimg-5))
		.attr("y", 2)
		.attr("width", width_modifyimg)
		.attr("height", height_modifyimg)
		.on("click", function (d){
			// CHIAMATA REST PER CANCELLAZIONE CRITERIA
			clientRest.deleteCriteria(d.position);
			if(d.id != 0)
				deleteNodeTextModify(d.id);
			else
				clearModel();
		});
	}
}

function removeNodeEdit(id_node)
{
	d3.selectAll("#nodeedit_"+id_node).remove();		
	d3.selectAll("#gnode_"+id_node).selectAll(".foreignObject").remove();
	d3.selectAll("#deleteediticon_"+id_node).remove();
}

function changeNodeEditToNodeTextModify(id_node, text_node)
{
	// CHIAMATA REST PER MODIFY CRITERIA DESCRIPTION
	clientRest.modifyCriteriaDescription("C"+id_node, text_node);
	
	addNodeTextModify(id_node, text_node);
	removeNodeEdit(id_node);
}

function changeNodeEditToNodePlus(id_node)
{
	var gelement = d3.selectAll("#gnode_"+id_node);
	var node_plus = {path:path_imgplus, 
			"x":0, 
			"y":0};
	addNodePlus(node_plus, gelement, id_node);
	removeNodeEdit(id_node);
}
