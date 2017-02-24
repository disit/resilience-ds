/**
 * Gestione della finestra Matrix
 */

function presenceMatrixIcon()
{
	node.each(function(d,i) 
	{
		var node_matrixicon = d3.selectAll("#matrixicon_"+d.id);
		if(node_matrixicon.empty())
		{
			var gnode = d3.selectAll("#gnode_"+d.id);
			if(nodes[util.get_idvectnode(d.id)].children)
			{
				if(nodes[util.get_idvectnode(d.id)].children.length > 1)
				{
					gnode.append("image")
			    	.attr("id", "matrixicon_"+d.id)
			      	.attr("xlink:href", "image/matrix.png")
			      	.attr("x", (width_node/2)-(width_matriximg/2))
			    	.attr("y", height_node)
			    	.attr("width", width_matriximg)
			    	.attr("height", height_matriximg)
			    	.attr("title","Change matrix comparison or weights of edges")
			    	.on("click", function (d){
			    		openWindowMatrix(d);
			    	});	
				}	
			}
		}
		else{
			if(nodes[util.get_idvectnode(d.id)].children)
			{
				if(nodes[util.get_idvectnode(d.id)].children.length < 2)
					node_matrixicon.remove();		
			}
		}	
	});	
}

function openWindowMatrix(d)
{
	var array_text = new Array();
	
	// Creazione del vettore delle descrizioni dei nodi figli per la costruzione della finestra di inserimento dei pesi
	for(var i = 0; i < d.children.length; i++)
		array_text.push(d.children[i].description);
	
	controlWindow(d.id, array_text, d.children.length+1);
}