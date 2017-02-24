//----------------------------------------------------------------------------------
//---------------------------- *** NODE TEXT MODIFY *** ----------------------------
//----------------------------------------------------------------------------------
/** Ale 
 * Function that append the modification and the deletion icons.
 */
function addFunctionTextModify(id_node)
{
	if(id_currentpage != 2 && id_currentpage != 3 && id_currentpage != 5 && id_currentpage != 6){
		console.log("Icons request but Not showed. current page not correct."); return;
	}
	var textmodify_element = d3.selectAll("#f_"+id_node); // THe element's node.
//	console.log(textmodify_element);
	
	textmodify_element.append("image")
	.attr("id", "modifyicon_"+id_node)
	.attr("class","modifyFunction")
	.attr("xlink:href", "image/modify.png")
//	.attr("x", (width_node-(width_modifyimg*2)-60))
//	.attr("y", 2)
	.attr("x", (35))
	.attr("y", -15)	
	.attr("width", width_modifyimg)
	.attr("height", height_modifyimg)
	.attr("title","Edit")
	.on("click", function (d){
		console.log("double click");
		if(d.is_group)	createGroupEditWindow(d);
		else createFunctionEditWindow(d);
	})
	.append("title")
	.attr("x", (width_node-(width_modifyimg*2)-60)).attr("y", -20)
	.attr("class","text")
	.text("Edit");
	
//	d3.selectAll("deleteicon_"+id_node).remove();	
	textmodify_element.append("image")
	.attr("id", "deleteicon_"+id_node)
	.attr("class","modifyFunction")
	.attr("xlink:href", "image/delete.png")
//	.attr("x", (width_node-width_modifyimg-58))
//	.attr("y", 2)
	.attr("x", 53).attr("y", -15)
	.attr("width", width_modifyimg)
	.attr("height", height_modifyimg)
	.attr("title","Delete")
	.on("click", function (d){
		if(d.is_group){			
			CreateDeleteDialogGroup(d);
		}
		else{
			undo.saveOp("f_delete",d); 
			deleteFunction(d);
		}
	})
	.append("title").attr("x", (width_node-width_modifyimg-58)).attr("y", 2)
	.attr("class","text").text("Delete");
	
	addGroupShow(id_node, textmodify_element); //Adds the show button over the group's node.
}

/**Ale:
 * Function that enable the modification of a Function's instance.
 * @param id_node: node's id.
 */ 
function addFunctionInstanceTextModify(id_node)
{
	var textmodify_element = d3.selectAll("#f_"+id_node);
	
	textmodify_element.append("image")
	.attr("id", "modifyicon_"+id_node)
	.attr("class","modifyFunction")
	.attr("xlink:href", "image/modify.png")
//	.attr("x", (width_node-(width_modifyimg*2)-60))
//	.attr("y", 2)	
	.attr("x", (35)).attr("y", -15)
	.attr("width", width_modifyimg)
	.attr("height", height_modifyimg)
	.on("click", function (d){
		if(d.is_group) createGroupInstanceEditWindow(d);
		else createFunctionInstanceEditWindow(d);
	})
	.append("title")
	.attr("x", (width_node-(width_modifyimg*2)-60)).attr("y", 2)
	.attr("class","text").text("Edit");
	
	addGroupShow(id_node, textmodify_element); //Adds the show button over the group's node.
}




function removeNodeTextModify(id_node)
{
	console.log("Remove Icons--------------------------------------------------------------------");
	d3.selectAll("#nodetextmodify_"+id_node).remove();		
	d3.selectAll("#textdescription_"+id_node).remove();
	d3.selectAll("#modifyicon_"+id_node).remove();
	d3.selectAll("#deleteicon_"+id_node).remove();
}

function changeNodeTextModifyToNodeEdit(id_node, text_node)//TODO Modify for add an edit window.
{
	addNodeEdit(id_node, text_node);
	removeNodeTextModify(id_node);
}

function deleteNodeTextModify(id_node)//TODO. Change this function for delete a node.
{
	var depth_node_deleted = nodes[util.get_idvectnode(id_node)].depth;
	var str_idnode_deleted = id_node.toString();
	
	// Cancellazione del nodo da eliminare dal vettore di figli del nodo padre 
	nodes[util.get_idvectnode(id_node)].parent.children.splice(util.get_idvect(id_node, nodes[util.get_idvectnode(id_node)].parent.children), 1);
	
	for(var i = nodes.length-1; i >= 0; i--)
	{
		// Cancellazione del nodo da eliminare e di tutti i suoi figli
		if(nodes[i].id.toString().indexOf(str_idnode_deleted) == 0)
			nodes.splice(util.get_idvectnode(nodes[i].id),1);	
	}
	
	//Correzione dell'albero visualizzato
	fix_nodes_tree();
	
	// Rinominazione degli id dei nodi diventati errati dopo la cancellazione 
	for(var i = nodes.length-1; i >= 0; i--)
	{
		// Rinominazione solo se la profondità del nodo è maggiore di 0 
		if(nodes[i].depth > 0)
		{
			var str_node = nodes[i].id.toString();
			
			// Se il nodo da cancellare ha profondità 1 si rinominano tutti i nodi fratelli a destra, altri nodi figli della radice
			if(str_idnode_deleted.length == 1)
			{
				if(str_node.substring(0, 1) > str_idnode_deleted.substring(0, 1))
				{
					nodes[i].id = Number(util.replaceCharInString(str_node, 0, (str_node.substring(0, 1)-1)));
					nodes[i].position = "C" + nodes[i].id;
				}
			}
			
			// Se il nodo da cancellare ha profondità > 1 si rinominano tutti i nodi fratelli a destra e si lasciano invariati gli altri nodi figli del padre 
			else
			{			
				if(str_node.substring(depth_node_deleted-1,depth_node_deleted) > str_idnode_deleted.substring(depth_node_deleted-1, depth_node_deleted))
				{
					if(str_node.substring(0,depth_node_deleted-1) === str_idnode_deleted.substring(0,depth_node_deleted-1))
					{
						nodes[i].id = Number(util.replaceCharInString(str_node, nodes[i].depth-1, (str_node.substring(nodes[i].depth-1,nodes[i].depth)-1)));
						nodes[i].position = "C" + nodes[i].id;
					}
				}
			}
		}
	}
	
	// Rinominazione dei gnode appartenenti ai nodi con id modificato
	relabeling_gnode();
}
