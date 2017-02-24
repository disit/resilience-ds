/* ResilienceDS
   Copyright (C) 2017 DISIT Lab http://www.disit.org - University of Florence

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU Affero General Public License as
   published by the Free Software Foundation, either version 3 of the
   License, or (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU Affero General Public License for more details.

   You should have received a copy of the GNU Affero General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>. */

/**
 *  Operazioni sul modello
 */

/*
 *  Inizializzazione variabili per visualizzazione ---------------------------------------------------------------------
 */
/* Ale: Variables for the visualization of a FRAM model in D3.
 * force: The d3 object that controls the layout force.
 * links, nodes: The d3 elements showed in the graph.
 * zoom, drag: The d3 object that respectively controls: the zoom and the drag behavior of the graph.
 * svg: the graphical element where is displayed the graph.
 * load_model: The model loaded from the server.
 * aspects: The list of all the aspects in the graph. 
 */
var force, links, link, nodes, zoom, svg, load_model, aspects, drag;

// Dimensioni dei nodi grafici
var width_gnode_vertical = 220, height_gnode_vertical = 150;

var width_gnode_horizontal = 300, height_gnode_horizontal = 120;

// Altezza iniziale dei modelli
var initial_height = 80;

//Ale:The last id entered. Update constantly.
var Flast_id=0;
var Alast_id=0;

// Scarti per la visualizzazione delle label sugli archi
var diff_width_linkLabel = 10, diff_height_linkLabel = 70; 

var zm = null;
var codeTests;

var HideAspects = false; // Flag for show or hide the aspects.

var displayMissAspectLabel = false; // Displays a label for the miss aspects 

/*
 *  Funzioni per la visualizzazione dei modelli ---------------------------------------------------------------------
 */

// Inizializzazione dell'albero utilizzando la variabile root
function initModel()
{
	if(type_rotate == "vertical"){
		// Inizializzazione dell'albero con la dimensione preimpostata dei nodi
		tree = d3.layout.tree().nodeSize([width_gnode_vertical, height_gnode_vertical]);
		
		// Separazione dei sottoalberi
		tree.separation(function separation(a, b) {
			return a.parent == b.parent ? 1 : 1.2;
		});
		
		diagonal = d3.svg.diagonal()
		.source(function(d) { return {"x":d.source.x, "y":(d.source.y + (height_node/2))}; })            
		.target(function(d) { return {"x":d.target.x, "y":d.target.y - (height_node/2)}; })
		.projection(function(d) { return [d.x, d.y]; });
		
		svg_body = d3.select("#model_body").append("svg")
		.attr("width", width_tree)
		.attr("height", height_tree)
		.call(zm = d3.behavior.zoom().scaleExtent([min_zoom, max_zoom]).on("zoom", redraw))
		.append("g")
		.attr("transform", "translate("+ width_tree/2 +","+ initial_height +") scale("+ zoom_initial +")");
		
		zm.translate([width_tree/2, initial_height]);
	}
	else{
		
		// Inizializzazione dell'albero con la dimensione preimpostata dei nodi
		tree = d3.layout.tree().nodeSize([height_gnode_horizontal, width_gnode_horizontal]);
		
		// Separazione dei sottoalberi
		tree.separation(function separation(a, b) {
			return a.parent == b.parent ? 1.2 : 1;
		});
		
		diagonal = d3.svg.diagonal()
		.source(function(d) { return {"x":d.source.x-(height_gnode_horizontal/2), "y":d.source.y+width_node}; })   // d.source.x+(height_gnode_horizontal/2)
		.target(function(d) { return {"x":d.target.x-(height_gnode_horizontal/2), "y":d.target.y}; })		// d.target.x+(height_gnode_horizontal/2)
		.projection(function(d) { return [d.y, d.x]; }); //[d.y,-d.x] per blocchi ribaltati sull'asse x
		
		svg_body = d3.select("#model_body").append("svg")
		.attr("width", width_tree)
		.attr("height", height_tree)
		.call(zm = d3.behavior.zoom().scaleExtent([min_zoom, max_zoom]).on("zoom", redraw))
		.append("g")
		.attr("transform", "translate("+(width_tree/2)/2+","+height_tree/2+") scale("+zoom_initial+")");
		
		zm.translate([(width_tree/2)/2, height_tree/2]);
	}
	
	//Inizializzazione dei nodi e della radice dell'albero D3
	nodes = tree(root);
	links = tree.links(nodes);
	
	//necessary so that zoom knows where to zoom and unzoom from
	zm.scale(zoom_initial);
	
	nodeInitial = svg_body.selectAll(".node");
	node = svg_body.selectAll(".node");
	link = svg_body.selectAll(".link");
	
	// Recompute the layout and data join.
	nodeInitial = nodeInitial.data(tree.nodes(root), function (d) {
		return getId(d.position);
	});
	node = node.data(tree.nodes(root), function (d) {
		return getId(d.position);
	});
	link = link.data(tree.links(nodes), function (d) {
		return getId(d.source.position) + "-" + getId(d.target.position);
	});
}

/** Ale- 
 * Initialization of the force graph.
 * 
 */ 
function initFRAMModel()
{
	aspects = [];
	// Ale: Initialization of the force graph.
	force = d3.layout.force().size([width_tree, height_tree]).charge(-400).linkDistance(40).on("tick", tick);

	nodes = force.nodes();	links = force.links();
//	Defines the zoom for the visualization. In this way it can be resetted in any moment.
	zm = d3.behavior.zoom();	zm.scaleExtent([0.3,6]);
	
	svg_body = d3.select("#model_body").append("svg") 
	.attr("width", width_tree-(20*width_tree/100))
	.attr("height", height_tree);
	
	d3.select("svg").call(zm.on("zoom", redrawSVG));

	svg = d3.select("svg").append('svg:g')
	.attr("id","main_g")
	.attr("width", width_tree)
	.attr("height", height_tree)
	.attr("transform","translate("+zm.translate()+")scale("+zm.scale()+")");
	
	svg.append('svg:rect')
	.attr('id',"frame")
	.attr('width', '100%')
	.attr('height', '100%')
	.attr('x',30)
	.attr('fill', 'white');
	
	link = svg.selectAll(".link"),
	links_entered = svg.selectAll(".link"),
	node = svg.selectAll(".node");
	nodeInitial = svg.selectAll(".node");
	
	//Defines the marker for the end of the links.
	svg.append("svg:defs").append("svg:marker").attr("id","end_arrow")
    .attr("viewBox", "0 -5 10 10").attr("refX", 15).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6)
    .attr("orient", "auto").append("svg:path").attr("d", "M0,-5L10,0L0,5");

	drag = force.drag()
	.origin(function(d) { return d; })
	.on("dragstart", dragstarted)
	.on("drag", dragged)
	.on("dragend", dragended);
	
	function dragstarted(d) { // Function for starting the drag.
        /* it's important that we suppress the mouseover event on the node being dragged. 
         * Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
		*/
		d3.event.sourceEvent.stopPropagation();
		//Disarm focus
		var pointed_element = d3.select("g#"+this.id);
		if($("body.firefox").length>0){
			pointed_element.on("mouseover",function(){return;});
			pointed_element.on("mouseout",function(){return;});
			// this.onmouseover=function(){};
			// this.onmouseout=function(){};
		}
		else{
			pointed_element.on("mouseenter",function(){return;});
			pointed_element.on("mouseleave",function(){return;});
			// this.onmouseenter=function(){};
			// this.onmouseleave=function(){};
		}
		
		if(id_currentpage==2 || id_currentpage==3){
//			console.log("Check what is dragged.");
			var strart_draw_link = drawLinkStart(d);
//			console.log("Start to draw the link, interrupt the drugging in the tick function.");			
			if(!strart_draw_link) GroupDragStart();
		}
	}	

	function dragged(d) { // Function during the drag.
		d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
//		console.log("During drag.");
		if( id_currentpage==2 || id_currentpage==3 ){
			if( drawLink.draw ) drawLinkUpdate();
			else GroupDragging(d, this);
		}
	}
	
	function dragended(d) { // Function for the end of the drag.
//		console.log("Drag finished.")
		//Rearm focus and Adds some functions
		var pointed_element=d3.select("g#"+this.id);
		if($("body.firefox").length>0){
			pointed_element.on("mouseover",function(){
				focusIn($(this),d);
			});
			pointed_element.on("mouseout",function(){
				focusOut($(this),d);
			});
		}
		else{
			pointed_element.on("mouseenter",function(){
				focusIn($(this),d);
			});
			pointed_element.on("mouseleave",function(){
				focusOut($(this),d);
			});
		}
		if(id_currentpage==2 || id_currentpage==3){
			if( drawLink.draw ){
//				console.log("Remove Drag!")
				drawLinkEnd(); // End the draw of the line.
				drawLink.drag = false; // Stop to create the link.
				focusOut($(this),d); // Removes the focus.
			}
			else GroupDragEnd(this);
		}
	}
	// Initialize the toast windows.
	toastrSettings("default");	
	// Initialize the test functions.
//	codeTests = new FRAMTests();	
}

// Visualizzazione del modello
function showModel()
{
	// Add entering links in the parent's old position.
	link.enter().insert("path", ".g.node")
	.attr("class", "link")
	.attr("d", function (d) {
		var o = {x: d.source.x, y: d.source.y};
		return diagonal({source: o, target: o});
	})
	.attr("id",function(d,i){
		return ("link_"+getId(d.target.position));
	})
	.attr('pointer-events', 'none');
	
	// Transition nodes and links to their new positions.
	var t = svg_body.transition()
	.duration(duration);
	
	t.selectAll(".link")
	.attr("d", diagonal);
	
	// Enter any new nodes at the parent's previous position.
	var nodeEnter = node.enter().append("g")
	.attr("id",function(d){
		return ("gnode_"+getId(d.position));
	});
	
	nodeEnter.each(function(d,i){
		if(type_rotate == "vertical")
			this.setAttribute("transform", "translate("+(d.x-(width_node/2))+","+(d.y-(height_node/2))+")");
		else
			this.setAttribute("transform", "translate(" +(d.y)+ "," +(d.x-(width_node/2))+ ")"); //d.y,-(d.x-(width_node/2)) per blocchi ribaltati sull'asse x
	});
	
}

/**
 * Ale: Shows a model loaded.
 */
function showFRAMModel() 
{
//	console.log("Show the FRAM model loaded: "+json_data);
	var edges=[];
	var model=jQuery.extend(true,{},json_data); //Makes a deep copy of the json model.
	//Ale: Adapts model.Aspects and model.Functions to have always an array.
	if(model.Aspects){
		
		if(!model.Aspects["Aspect"].length){
			var Content = model.Aspects["Aspect"];
			model.Aspects["Aspect"]=new Array();
			model.Aspects["Aspect"].push(Content);
		}
	}
	else{
		model.Aspects = new Object;
		model.Aspects["Aspect"]=new Array();
	}
	if(model.Functions){
		if(!model.Functions["Function"].length){
//		console.log("Aggiungo i contenuti.");
			var Content = model.Functions["Function"];
			model.Functions["Function"]=new Array();
			model.Functions["Function"].push(Content);
		}		
	}
	else{
		model.Functions = new Object;
		model.Functions["Function"]=new Array();
	}
	if(model.Groups){
		if(!model.Groups["Group"].length){
			var Content = model.Groups["Group"];
			model.Groups["Group"]=new Array();
			model.Groups["Group"].push(Content);
		}
	}
	else{
		model.Groups = new Object;
		model.Groups["Group"]=new Array();
	}
	
//	for( var new_node in model.Functions['Function']){
//		console.log("New Model: "+model.Functions['Function'][new_node]);
//		model.Functions['Function'][new_node][aspects]= Array();
//	}
	if(model.Aspects){
		
		model.Aspects["Aspect"].forEach(function(a){
			/* This function selects the link to add in the visualization, and adds to the functions the list of the aspects.  */
			if(!a.multilabel) a.multilabel = a.label; //in case of multiple link between the same path, the name are join all together.
			if(!aspects) aspects=[]; // Initializes aspects like an array of aspects.
			aspects.push(a); // Lists of all the aspects.
			Alast_id++;
			var tmp = a;
			tmp.source = model.Functions['Function'].filter( function(n){
				if(n.id === a.source){
					if(n.aspects){
						if(!n.aspects.filter(function(n_a){return (n_a === a);}).length){
							n.aspects.push(a);
						}
					} 
					else{
						n.aspects = Array();
						n.aspects.push(a);
					}
					return n;
				}
			})[0],
			tmp.target = model.Functions['Function'].filter( function(n){
				if(n.id === a.target){
					if(n.aspects){
						if(!n.aspects.filter(function(n_a){return (n_a === a);}).length){
							n.aspects.push(a);
						}
					} 
					else{
						n.aspects = Array();
						n.aspects.push(a);
					}
					return n;
				}
			})[0];
			if(tmp.source && tmp.target){ //Adds the source and target if not undefined.
				edges.push(tmp);
			}
		});
	}
	
	for( var new_node in model.Functions['Function']){
		var NtoPush=model.Functions['Function'][new_node];
		//Makes some corrections to the data.
		if(!NtoPush.aspects) NtoPush.aspects = new Array();
		NtoPush.x=parseInt(NtoPush.x);
		NtoPush.y=parseInt(NtoPush.y);
		NtoPush.cx=parseInt(NtoPush.cx);
		NtoPush.cy=parseInt(NtoPush.cy);
		//Adds the function to the graph.
		nodes.push(NtoPush);
		Flast_id++;
	}
	//First adds the groups and then searches for the functions, and for the hierarchy.
	for( var new_group in model.Groups['Group']){
		var NtoPush=model.Groups['Group'][new_group];
		//Makes some corrections to the data.
		NtoPush.x=parseInt(NtoPush.x);
		NtoPush.y=parseInt(NtoPush.y);
		NtoPush.cx=parseInt(NtoPush.cx);
		NtoPush.cy=parseInt(NtoPush.cy);
		NtoPush.is_group = true;
		NtoPush.aspects = new Array();
		NtoPush.group = true;
		nodes.push(NtoPush);
		Flast_id++;
	}
	//Adds the function to the group.
	for( var new_group in model.Groups['Group'] ){
		var NtoPush = model.Groups['Group'][new_group];
		var group_functions = new Array();
		if(NtoPush.Functions){
			for(var i=0; i< NtoPush.Functions.Function.length; i++){
				var f_in_group = nodes.filter(function(d){return d.id == NtoPush.Functions.Function[i]})[0];				
				//Makes some changes to the function.
				f_in_group.in_group = true;
				group_functions.push( f_in_group );
				f_in_group.group = NtoPush; f_in_group.cx = NtoPush.x; f_in_group.cy = NtoPush.y;
			}				
		}
		delete(NtoPush.Functions);
		nodes.filter(function(d){
			if(d.id == NtoPush.id) d.functions = group_functions;
		});
	}
	//Adds the link to the graph.
	for( var new_link in edges){
		links.push(edges[new_link]);
		updateMultiLabel("add", edges[new_link]);
		//Take a reference to the link.
		var a_ref=aspects.filter(function(d){
			if(d.source==edges[new_link].source && d.target==edges[new_link].target && d.label==edges[new_link].label) return d;
		});
		a_ref[0].link=links[links.length-1];
	}
	updateFRAMModel();	
}

/**
 * Ale: Update the model after the enter of a new node.
 */ 
function updateFRAMModel()
{	
	console.log("Update FRAM.");
	
	force.start();	
	/* The command below add the lines. The identification key for a line is the quadruple idA - type - source.id - target.id. 
	: id of the Aspect is needed for identify the aspect.
	: source and target are needed for identify the two function; this because one aspect could be shared among more than 2 function.
	: type for distinguish between more aspect shared between the same two functions.
	*/	
	link = svg.selectAll("g.LT").data(links,function(d){if(d.source && d.target) return d.id+"_"+d.type+"_"+d.source.id+"_"+d.target.id;}); //the if stantement is necessary, for the delete of a link.
	links_entered = link.enter().insert("g",".node").attr("class","LT");
	links_entered.append("svg:path")
	  // .attr("class", "link");
	  .attr("id",  function(d){return "L"+d.id+"_"+d.type+"_"+d.source.id+"_"+d.target.id;})
	  .attr("class", "link")
	  .attr("marker-end", "url(#end_arrow)");
	
	text_on_new_links = links_entered.append("g").attr("class","link_text");			
	text_on_new_links.append("text").attr("class","onlink").attr("x",8).attr("dy",-5).append("textPath")
	.attr("xlink:href", function(d){return "#L"+d.id+"_"+d.type+"_"+d.source.id+"_"+d.target.id+"";})
	.attr("startOffset","50%")
	.on("mouseover",function(d){
		focusAspectIn($(this));
		if(d.source){
			var g_to_highlight = highlightGroup(d.source);
			highlightNode("f_"+g_to_highlight.id);
		}
		if(d.target){
			var g_to_highlight = highlightGroup(d.target);
			highlightNode("f_"+g_to_highlight.id);
		}
	})
	.on("mouseout",function(d){
		focusAspectOut($(this));
		if(d.source){
			var g_to_highlight = highlightGroup(d.source);
			highlightNodeOut("f_"+g_to_highlight.id);
		}
		if(d.target){
			var g_to_highlight = highlightGroup(d.target);
			highlightNodeOut("f_"+g_to_highlight.id);
		}
	});
	initializeAspectsShowForUpdate();
	svg.selectAll(".onlink textPath")
	.text(function(d){
		/* 16-4-27 How works the process to label the links:
		 * It's all done by the function MultiLabelGroup.
		 * Here is sett a new parameter for the aspect: groupmultilabel, that saves the label, 
		 * and is removed the link for the aspects already count. 
		 */
//		console.log("Check text for link");
		if(!d.alreadyShowed){
			d.groupmultilabel = MultiLabelForGroup(d);
		}
		else{
//			console.log("Aspect already showed");
			this.parentElement.parentElement.parentElement.remove(); // Removes the link for lighten the visualization.
		}
		d.alreadyShowed = true;
		return d.groupmultilabel || d.multilabel || d.label;
	});
	
	text_on_new_links.append("title").attr("class","text aspect_title");
	svg.selectAll(".aspect_title").text(function(d){
		return d.groupmultilabel || d.multilabel || d.label;
		});

	if(link.exit){
//		console.log("Removes links from the graph"+link.exit().remove()); //Removes the links deleted from the graph.
		link.exit().remove(); // Removes the links deleted from the graph.
	}
	
	link = svg.selectAll(".link");
	//------------ Hull update -----------------------------
	
	svg.selectAll("path.hullGroup").remove(); 
	var p_links = d3.selectAll("g.LT");
	if(p_links[0].length >0) p_links =  "g.LT";
	else p_links = "g.node"; // Sets the position where insert the links.
	svg.selectAll("path.hullGroup")
	.data(
		nodes.filter(function(d){if( d.is_group && d.show_functions ) return d;}),
		function(d){return d.id;})
		.enter().insert("path", p_links) // Inserts before the links if present, before the node otherwise. So it's possible to drag the node.
//	.enter().insert("path","g.node") // Inserts before the links if present, before the node otherwise. So it's possible to drag the node.
	.attr("class","hullGroup")
	.style("fill", function(d){return d.color;})
//	.style("stroke", groupFill)
	.style("stroke-width", 40)
	.style("stroke-linejoin", "round")
	.attr("d", drawCluster )
	.style("opacity", .2)
	.on("click", function(d) {
		GroupShowFunctions(d, false);
		updateFRAMModel();
    });
		
	//------------ Nodes update-----------------------------
	node = svg.selectAll("g.node").data(nodes,function(d){return d.id;});
	nodes_entered = node.enter().append("g")
	.attr("id", function(d){return "f_"+d.id;})
	.attr("class","node")
	.attr("cx",function(d){
//		console.log("Node "+d.name+" x:"+d.x+" y:"+d.y);
		return d.x})
	.attr("cy",function(d){return d.y})
	.attr("transform",function(d){return "translate("+d.x+","+d.y+")"})
	.on("dblclick", dblclick)
	.call(drag);
		
	svg.selectAll("g.node").attr("class", function(d){
		if( d.in_group == true ){ if(! d.group.show_functions ){
//				console.log("Not show!");
//				this.remove(); //Removes the node for lighten the graph managment.
				return "node function hide_node"; 
			}
		}
		if( d.show_functions ) return "node function hide_node"; // For group to hide and show the functions 
		return "node function";
	});
	//The Hexagon displayed.
	nodes_entered.append("polygon")
	.attr("id",function(d){return "hex_"+d.id;})
	.attr("class","hex").attr("points","120,60 90,112 30,112 0,60 30,8 90,8")
	.classed("fixed",function(d){d.fixed=true; return true;})
	.attr("x",function(d){return d.x})
	.attr("y",function(d){return d.y});
	
	svg.selectAll("polygon")
	.style("stroke",function(d){ if(d.color=="#FFFFFF" || d.color=="#fff") return "000000"; else return d.color;})
	.style("stroke-dasharray",function(d){if(d.color=="#fff" || d.color=="#FFFFFF") return "5,5";});
	// Function Variability
	if(id_currentpage == 4 || id_currentpage == 5 || id_currentpage == 6){
		appendVariability(nodes_entered);
	}
	//______________________APPEND the label element______________ XXX
	/* 3 label for each element 
	 * 1) labelForAspectMissed - for identify the element
	 * 2) missAspect - for identify the element to show.
	 * 3) noDisplay - for decide to show or not
	 */
	var MissAspectlabel;
	MissAspectlabel=nodes_entered.append("g").attr()
	.attr("id",function(d){return "Ilabel_"+d.id;})
	.attr("class","labelForAspectMissed noDisplay")
	.on("click",function(d){
		d3.select("g#Ilabel_"+d.id).attr("class","labelForAspectMissed missAspect noDisplay");
	})
	.attr("x",function(d){return d.x})
	.attr("x",function(d){return d.x})
	.attr("y",function(d){return d.y});
	MissAspectlabel.append("polygon").attr("points","-120,70 -120,50 -40,50 -20,60 -40,70");
	MissAspectlabel.append("text").attr("class","AspectMissingLabel").attr("x","-118").attr("y","65").text("Missing Input");
	MissAspectlabel.append("title").attr("class","text function_title").text("Missing Input");
	
	MissAspectlabel=nodes_entered.append("g").attr()
	.attr("id",function(d){return "Tlabel_"+d.id;})
	.attr("class","labelForAspectMissed noDisplay")
	.on("click",function(d){
		d3.select("g#Tlabel_"+d.id).attr("class","labelForAspectMissed missAspect noDisplay");
	})
	.attr("x",function(d){return d.x})
	.attr("x",function(d){return d.x})
	.attr("y",function(d){return d.y});
	MissAspectlabel.append("polygon").attr("points","-85,18 -85,-2 -5,-2 15,8 -5,18");
	MissAspectlabel.append("text").attr("class","AspectMissingLabel").attr("x","-83").attr("y","13").text("Missing Time");
	MissAspectlabel.append("title").attr("class","text function_title").text("Missing Time");
	
	MissAspectlabel=nodes_entered.append("g").attr()
	.attr("id",function(d){return "Plabel_"+d.id;})
	.attr("class","labelForAspectMissed noDisplay")
	.on("click",function(d){
		d3.select("g#Plabel_"+d.id).attr("class","labelForAspectMissed missAspect noDisplay");
	})
	.attr("x",function(d){return d.x})
	.attr("x",function(d){return d.x})
	.attr("y",function(d){return d.y});
	MissAspectlabel.append("polygon").attr("points","-85,122 -85,102 -5,102 15,112 -5,122");
	MissAspectlabel.append("text").attr("class","AspectMissingLabel").attr("x","-83").attr("y","117").text("Missing Precondition");
	MissAspectlabel.append("title").attr("class","text function_title").text("Missing Precondition");
	
	MissAspectlabel=nodes_entered.append("g").attr()
	.attr("id",function(d){return "Olabel_"+d.id;})
	.attr("class","labelForAspectMissed noDisplay")
	.on("click",function(d){
		d3.select("g#Olabel_"+d.id).attr("class","labelForAspectMissed missAspect noDisplay");
	})
	.attr("x",function(d){return d.x})
	.attr("x",function(d){return d.x})
	.attr("y",function(d){return d.y});
	MissAspectlabel.append("polygon").attr("class","missOutput").attr("points","240,70 240,50 160,50 140,60 160,70");
	MissAspectlabel.append("text").attr("class","AspectMissingLabel").attr("x","148").attr("y","65").text("Missing Output");
	MissAspectlabel.append("title").attr("class","text function_title").text("Missing Output");
	
	MissAspectlabel=nodes_entered.append("g").attr()
	.attr("id",function(d){return "Clabel_"+d.id;})
	.attr("class","labelForAspectMissed noDisplay")
	.on("click",function(d){
		d3.select("g#Clabel_"+d.id).attr("class","labelForAspectMissed missAspect noDisplay");
	})
	.attr("x",function(d){return d.x})
	.attr("x",function(d){return d.x})
	.attr("y",function(d){return d.y})
	MissAspectlabel.append("polygon").attr("points","205,18 205,-2 125,-2 105,8 125,18");
	MissAspectlabel.append("text").attr("class","AspectMissingLabel").attr("x","113").attr("y","13").text("Missing Control");
	MissAspectlabel.append("title").attr("class","text function_title").text("Missing Control");
	
	MissAspectlabel=nodes_entered.append("g").attr()
	.attr("id",function(d){return "Rlabel_"+d.id;})
	.attr("class","labelForAspectMissed noDisplay")
	.on("click",function(d){
		d3.select("g#Rlabel_"+d.id).attr("class","labelForAspectMissed missAspect noDisplay");
	})
	.attr("x",function(d){return d.x})
	.attr("x",function(d){return d.x})
	.attr("y",function(d){return d.y});
	MissAspectlabel.append("polygon")
	.attr("points","205,122 205,102 125,102 105,112 125,122");
	MissAspectlabel.append("text").attr("class","AspectMissingLabel").attr("x","113").attr("y","117").text("Missing Resource");
	MissAspectlabel.append("title").attr("class","text function_title").text("Missing Resource");
	//________________________END MISS ASPECTS LABEL____________________
	// Path test. Adds a path, like a second border for the hexagon, only for the groups.
	nodes_entered.append("svg:path")
	.attr("class","hex_border");
	// Updates the color and the display
	svg.selectAll(".hex_border").attr("display",function(d){if(d.is_group) return "inherit"; else return "none";})
	.attr("d","M 127 60 L 95 117 L 25 117 L -7 60 L 25 3 L 95 3 L 127 60")
	.style("stroke",function(d){return d.color;});
	
	//Input circles
	nodes_entered.append("circle")
	.attr("r",10).attr("cx",-10).attr("cy",60)
	.on("mouseover", function(node) {
        overAspectCircle(node,"input");
    })
    .on("mouseout", function(node) {
        outAspectCircle(node,"input");
    })
    .on("click",function(d){AddRemoveSpecificLabel(d,"I");})
	.attr("class","circle input");
	//Updates all the times the lack of link.
	svg.selectAll("circle.input").attr("class",function(d){
		if(d.is_group){ // Checks for missing aspect between the function of the group.
			aspect_miss = checkGroupMissingAspect(d,"input");			
			if(aspect_miss.miss){ // Checks for missing aspect.
				// XXX if there is an update this hide the label
				AddRemoveMissAspectLabel(d, "I", aspect_miss.label, true);
//				d3.select("g#Ilabel_"+d.id).attr("class","labelForAspectMissed missAspect noDisplay"); // Signs that the label has to be visualized.
				return "circle input lack";
			}
			else{
				AddRemoveMissAspectLabel(d, "I", aspect_miss.label, false);// Removes the label for a miss aspect.
				return "circle input";
			}
//			var aspect_miss = false;
//			for(var i=0; i < d.functions.length; i++){
//				f_in_g = d.functions[i];
//				aspect_miss = checkMissingAspect(f_in_g,"input");
//				if(aspect_miss.miss) break;
//			}
		}
		if(!d.in_group  || d.group.show_functions ){
			
			var aspect_miss = checkFunctionMissingAspect(d,"input");
			if( aspect_miss.miss){
				console.log(aspect_miss);
				AddRemoveMissAspectLabel(d, "I", aspect_miss.label, true);
//				d3.select("g#Ilabel_"+d.id).attr("class","labelForAspectMissed missAspect noDisplay"); // Signs that the label has to be visualized.
				return "circle input lack";
			}
			else{ AddRemoveMissAspectLabel(d, "I", aspect_miss.label, false); return "circle input";} 
		}
		else{ return "circle input";} 
	});
	
	//Outputs circles
	nodes_entered.append("circle")
	.attr("r",10).attr("cx",130).attr("cy",60)
	.on("mouseover", function(node) {overAspectCircle(node,"output");})
    .on("mouseout", function(node) {outAspectCircle(node,"output");})
    .on("click",function(d){AddRemoveSpecificLabel(d,"O");})
	.attr("class","circle output");
	svg.selectAll("circle.output").attr("class",function(d){
//		console.log("Output");
		if(d.is_group){ // Checks for missing aspect between the function of the group.
			var aspect_miss = false;
			aspect_miss = checkGroupMissingAspect(d,"output");
			if(aspect_miss.miss){ // Checks for missing aspect. 
				AddRemoveMissAspectLabel(d, "O", aspect_miss.label, true);
				return "circle output lack";
			}
			else{ AddRemoveMissAspectLabel(d, "O", aspect_miss.label, false); return "circle output";}
		}
		if(!d.in_group  || d.group.show_functions ){
			
			var aspect_miss = checkFunctionMissingAspect(d,"output");
			if( aspect_miss.miss){
				AddRemoveMissAspectLabel(d, "O", aspect_miss.label, true);
				return "circle output lack";
			}
			else{ AddRemoveMissAspectLabel(d, "O", aspect_miss.label, false); return "circle output";} 
		}
		else{ return "circle output";} 
	});
	//Preconditions circles.
	nodes_entered.append("circle")
	.attr("r",10).attr("cx",25).attr("cy",117)
	.on("mouseover", function(node) {
        overAspectCircle(node,"precondition");
    })
    .on("mouseout", function(node) {
        outAspectCircle(node,"precondition");
    })
    .on("click",function(d){AddRemoveSpecificLabel(d,"P");})
	.attr("class","circle precondition");
	svg.selectAll("circle.precondition").attr("class",function(d){
		if(d.is_group){ // Checks for missing aspect between the function of the group.
			var aspect_miss = false;
			aspect_miss = checkGroupMissingAspect(d,"precondition");
			if(aspect_miss.miss){ // Checks for missing aspect. 
				AddRemoveMissAspectLabel(d, "P", aspect_miss.label, true);
				return "circle precondition lack";
			}
			else{ AddRemoveMissAspectLabel(d, "P", aspect_miss.label, false); return "circle precondition";}
		}
		if(!d.in_group || d.group.show_functions){
			
			var aspect_miss = checkFunctionMissingAspect(d,"precondition");
			if( aspect_miss.miss){
				AddRemoveMissAspectLabel(d, "P", aspect_miss.label, true);
				return "circle precondition lack";
			}
			else{ AddRemoveMissAspectLabel(d, "P", aspect_miss.label, false); return "circle precondition";} 
		}
		else{ return "circle precondition";} 
	});
	//Control circles
	nodes_entered.append("circle")
	.attr("r",10).attr("cx",95).attr("cy",3)
	.on("mouseover", function(node) {
        overAspectCircle(node,"control");
    })
    .on("mouseout", function(node) {
        outAspectCircle(node,"control");
    })
    .on("click",function(d){AddRemoveSpecificLabel(d,"C");})
	.attr("class","circle control");
	svg.selectAll("circle.control").attr("class",function(d){
		if(d.is_group){ // Checks for missing aspect between the function of the group.
			var aspect_miss = false;
			aspect_miss = checkGroupMissingAspect(d,"control");
			if(aspect_miss.miss){ // Checks for missing aspect. 
				AddRemoveMissAspectLabel(d, "C", aspect_miss.label, true);
				return "circle control lack";
			}
			else{ AddRemoveMissAspectLabel(d, "C", aspect_miss.label, false); return "circle control";}
		}
		if(!d.in_group  || d.group.show_functions){
			
			var aspect_miss = checkFunctionMissingAspect(d,"control");
			if( aspect_miss.miss){
				AddRemoveMissAspectLabel(d, "C", aspect_miss.label, true);
				return "circle control lack";
			}
			else{ AddRemoveMissAspectLabel(d, "C", aspect_miss.label, false); return "circle control";} 
		}
		else{ return "circle control";} 
	});
	//Time circles
	nodes_entered.append("circle")
	.attr("r",10).attr("cx",25).attr("cy",3)
	.on("mouseover", function(node) {
        overAspectCircle(node,"time");
    })
    .on("mouseout", function(node) {
        outAspectCircle(node,"time");
    })
    .on("click",function(d){AddRemoveSpecificLabel(d,"T");})
	.attr("class","circle time");
	svg.selectAll("circle.time").attr("class",function(d){
		if(d.is_group){ // Checks for missing aspect between the function of the group.
			var aspect_miss = false;
			aspect_miss = checkGroupMissingAspect(d,"time");
			if(aspect_miss.miss){ // Checks for missing aspect. 
				AddRemoveMissAspectLabel(d, "T", aspect_miss.label, true);
				return "circle time lack";
			}
			else{ AddRemoveMissAspectLabel(d, "T", aspect_miss.label, false); return "circle time";}
		}
		if(!d.in_group  || d.group.show_functions ){
			
			var aspect_miss = checkFunctionMissingAspect(d,"time");
			if( aspect_miss.miss){
				AddRemoveMissAspectLabel(d, "T", aspect_miss.label, true);
				return "circle time lack";
			}
			else{ AddRemoveMissAspectLabel(d, "T", aspect_miss.label, false); return "circle time";} 
		}
		else{ return "circle time";} 
	});
	//Resource circles
	nodes_entered.append("circle")
	.attr("r",10).attr("cx",95).attr("cy",117)
	.on("mouseover", function(node) {
        overAspectCircle(node,"resource");
    })
    .on("mouseout", function(node) {
        outAspectCircle(node,"resource");
    })
    .on("click",function(d){AddRemoveSpecificLabel(d,"R");})
	.attr("class","circle resource");
	svg.selectAll("circle.resource").attr("class",function(d){
		if(d.is_group){ // Checks for missing aspect between the function of the group.
			var aspect_miss = false;
			aspect_miss = checkGroupMissingAspect(d,"resource");
			if(aspect_miss.miss){ // Checks for missing aspect. 
				AddRemoveMissAspectLabel(d, "R", aspect_miss.label, true);
				return "circle resource lack";
			}
			else{ AddRemoveMissAspectLabel(d, "R", aspect_miss.label, false); return "circle resource";}
		}
		if(!d.in_group  || d.group.show_functions ){
			
			var aspect_miss = checkFunctionMissingAspect(d,"resource");
			if( aspect_miss.miss){
				AddRemoveMissAspectLabel(d, "R", aspect_miss.label, true);
				return "circle resource lack";
			}
			else{ AddRemoveMissAspectLabel(d, "R", aspect_miss.label, false); return "circle resource";} 
		}
		else{ return "circle resource";} 
	});
	//Node's title.
	nodes_entered.append("title")
	.attr("class","text function_title")
	.text(function(d){return d.name;});
	// Node's name.
	nodes_entered.append("text")
	.attr("class","text function_name")
	.attr("x",10).attr("y",65);
	svg.selectAll("text.function_name").text(function(d){ 
		/* Slices the label, for make it fit in the hexagon...A good alternative could be shape inside, like the line above, but it doesn't work. */
		var label=d.name
		if(label!=null && label.length>=15) label=label.slice(0,15)+"...";
		return label;
	});
	//Appends the label with the number of aspects for the functions.
	nodes_entered.append("text")
	.attr("class","text function_weight").attr("x",30).attr("y",25);
	svg.selectAll("text.function_weight").text(function(d){ 
		var aspect_number = d.aspects.length;
		if(d.is_group) aspect_number = countGroupAspects(d);			
		return "Links: "+aspect_number;
	});
	//Appends the label with the number of functions for the groups.
	nodes_entered.append("text")
	.attr("class","text group_weight").attr("x",15).attr("y",45);
	svg.selectAll("text.group_weight").text(function(d){ 
		var functions_number = "";
		if(d.is_group){
			functions_number +="Functions: "+ d.functions.length;	
		}
		return functions_number;
	});
	//Appends the labels for the circles.
	nodes_entered.append("text")
	.attr("class","text input").attr("x",-10).attr("y",65)
    .on("click",function(d){AddRemoveSpecificLabel(d,"I");})
	.on("mouseover", function(node) {overAspectCircle(node,"input");})
    .on("mouseout", function(node) {outAspectCircle(node,"input");}).text("I");
	nodes_entered.append("text")
    .on("click",function(d){AddRemoveSpecificLabel(d,"O");})
	.attr("class","text output").attr("x",124).attr("y",65)
	.on("mouseover", function(node) {overAspectCircle(node,"output");})
    .on("mouseout", function(node) {outAspectCircle(node,"output");}).text("O");
	nodes_entered.append("text")
    .on("click",function(d){AddRemoveSpecificLabel(d,"C");})
	.attr("class","text control").attr("x",90).attr("y",8)
	.on("mouseover", function(node) {overAspectCircle(node,"control");})
    .on("mouseout", function(node) {outAspectCircle(node,"control");}).text("C");
	nodes_entered.append("text")
    .on("click",function(d){AddRemoveSpecificLabel(d,"P");})
	.attr("class","text precondition").attr("x",21).attr("y",122)
	.on("mouseover", function(node) {overAspectCircle(node,"precondition");})
    .on("mouseout", function(node) {outAspectCircle(node,"precondition");}).text("P");
	nodes_entered.append("text")
    .on("click",function(d){AddRemoveSpecificLabel(d,"T");})
	.attr("class","text time").attr("x",21).attr("y",8)
	.on("mouseover", function(node) {overAspectCircle(node,"time");})
    .on("mouseout", function(node) {outAspectCircle(node,"time");}).text("T");
	nodes_entered.append("text")
    .on("click",function(d){AddRemoveSpecificLabel(d,"R");})
	.attr("class","text resource").attr("x",90).attr("y",122)
	.on("mouseover", function(node) {overAspectCircle(node,"resource");})
    .on("mouseout", function(node) {outAspectCircle(node,"resource");}).text("R");
	
	nodes_entered.append("circle")
    .attr('class', 'ghostCircle')
    .attr("r", 100)
    .attr("cx",60).attr("cy",60)
    .attr("opacity", 0.2) // change this to zero to hide the target area
    .attr('pointer-events', 'mouseover')
    .on("mouseover", function(node) {
        overCircle(node);
    })
    .on("mouseout", function(node) {
        outCircle(node);
    });
	svg.selectAll(".ghostCircle")
	.style("fill", function(d){return d.color;});
	
//	Adds some functions
	if($("body.firefox").length>0){
		nodes_entered.on("mouseover",function(d){
			focusIn($(this),d);
		});
		nodes_entered.on("mouseout",function(d){
			focusOut($(this),d);
		});
	}
	else{
		nodes_entered.on("mouseenter",function(d){
			// console.log("Initial");
			focusIn($(this),d);
		});
		nodes_entered.on("mouseleave",function(d){
			focusOut($(this),d);
		});
	}
	
	if(node.exit){//Removes the nodes from the visualization.
//		console.log("Removes the nodes from the visualization");
		node.exit().remove();
	}
	
	if( id_currentpage==2 || id_currentpage==3 ){
		// Prevents the doubleclick zoom in edit mode.
		d3.selectAll("g.function").on("dblclick.zoom", function(d){
//			console.log("DoubleClick Edit Model");
			d3.event.stopPropagation(); 
			return null;});
		// Actives the modify options.
		view.modifyFRAMModel();		// Enables the save icon, for save the changes.
		modelnotsaved_update();		// Saves temporary the model.
	}
	else if( id_currentpage==5 || id_currentpage==6 ){
		// Prevents the doubleclick zoom in edit mode.
		d3.selectAll("g.function").on("dblclick.zoom", function(d){
//			console.log("DoubleClick Edit Instance");
			d3.event.stopPropagation(); 
			return null;});
		// Actives the modify options.
		view.modifyFRAMModelInstance(); // Enables the save icon, for save the changes.
		modelinstancenotsaved_update();		// Saves temporary the model.
	}
	updateFRAMModelMeasure();
	if(HideAspects) hideAllAspects(true);	// Hides the link in the group
}

//XXX Old, aggiornamento del modello dopo l'aggiunta di un nuovo nodo.
//function updateModel()
//{
//	// Recompute the layout and data join.
//	node = node.data(tree.nodes(root), function (d) {
//		return getId(d.position);
//	});
//	link = link.data(tree.links(nodes), function (d) {
//    	return getId(d.source.position) + "-" + getId(d.target.position);
//	});
//
//	// Add entering nodes in the parentâs old position.
//	var new_gelement = node.enter().append("g").attr("id",function(d){
//		return ("gnode_"+getId(d.position));
//	});
//	
//	if(type_rotate == "vertical")
//		node_plus = {path:path_imgplus, "x":0, "y":0};
//	else
//		node_plus = {path:path_imgplus, "x":-(width_node/2)+30, "y":12};
//	
//	new_gelement.each(function(d,i){
//		addNodePlus(node_plus, new_gelement);	
//	});
//	
//	// Add entering links in the parentâs old position.
//	link.enter().insert("path", ".g.node")
//        .attr("class", "link")
//        .attr("d", function (d) {
//            var o = {x: d.source.x, y: d.source.y};
//            return diagonal({source: o, target: o});
//       	})
//    	.attr('pointer-events', 'none');
//	
//	// Transition nodes and links to their new positions.
//	var t = svg_body.transition()
//		.duration(duration);
//	
//	t.selectAll(".link")
//	    .attr("d", diagonal);
//	
//	translateGNodes();//operations_node
//}

function changeNameRoot(nameModel)
{
	d3.selectAll("#textdescription_0").text(nameModel);
}

function focusAspectIn(element){ //Focus over a Link.
//	console.log("Focus Aspect"+element);
	
	var LinkText = element.parent()[0];
	LinkText.classList.add("over");
	
	var pathElement=element.parent().parent().parent()[0].getElementsByTagName("path")[0];//takes the 'path' element
	pathElement.classList.add("over");
//	element.parent().parent().parent()[0].insertAfter("#main_g g:last");
}

function focusAspectOut(element){//Focus out from an Aspect.
	var LinkText = element.parent()[0];
	LinkText.classList.remove("over");
	
	var pathElement=element.parent().parent().parent()[0].getElementsByTagName("path")[0];
	pathElement.classList.remove("over");
}

function highlightNode(node_id){
	$("#"+node_id)[0].classList.add("over");
}

function highlightNodeOut(node_id){
	$("#"+node_id)[0].classList.remove("over");	
}

/**Ale
 * Function that makes a focus over a node 'element' passed
 * @param element: DOM element focussed
 * @param d: data node relative to element
 */
function focusIn(element,d){
//	console.log("Node focus: "+d.id+" - "+d.name);
	
	element.insertAfter("#main_g g.node:last"); //Puts the node in foreground.

	var e=element[0];
	e.classList.add("over"); //Highlight the function.
	
	//Focus the links connected to this node.
	var FunctionFocused = d;
	if(FunctionFocused.is_group && !FunctionFocused.show_functions){ // Focus for the group.
		for(var i=0; i < FunctionFocused.functions.length; i++){ focusIn(element, FunctionFocused.functions[i]); }
	}
	var linkFiltered = svg.selectAll("g.LT").data(links,function(e){
		return "#"+e.id+"_"+e.type+"_"+e.source.id+"_"+e.target.id+"";}); //Retrieves the element with the data associated.
	linkFiltered = linkFiltered.filter(function(e){ //Selects the element with specific source or target.
		if(e.source){
			if(e.source.id == FunctionFocused.id) return e;
		}
		if(e.target){
			if(e.target.id == FunctionFocused.id) return e;
		}
	});
	
	linkFiltered.attr("class","LT over"); //highlight the link.
	
	//Stops the focus.
	
	//Rescales the mouse target's function 
	/* 
	// Makes the focus on the node, some problems occurs when focus is combined with drag.
	var scale=1.2;
	transform_value = e.attributes.transform.value;
	// var xforms = myElement.getAttribute('transform');
	var parts  = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(transform_value);
	if(parts){
		var firstX = parts[1],firstY = parts[2];
	}
	else{
		var firstX=0,firstY=0;
	}
	d3.select(e).transition()
		.duration(500)
		.attr("transform","translate("+firstX+", "+firstY+") scale("+scale+") ");
	 */// console.log("translate("+firstX+", "+firstY+") scale("+scale+") ");
}

function focusOut(element,d){
	var e=element[0];
	e.classList.remove("over");
	
	//Un-Focus the links connected to this node.
	var FunctionFocused = d;
	if(FunctionFocused.is_group){ // Focus for the group.
		for(var i=0; i < FunctionFocused.functions.length; i++){ focusOut(element, FunctionFocused.functions[i]); }
	}
	var linkFiltered=svg.selectAll("g.LT").data(links,function(e){
		return "#"+e.id+"_"+e.type+"_"+e.source.id+"_"+e.target.id+"";}); //Retrieves the element with the data associated.
	linkFiltered = linkFiltered.filter(function(e){ //Selects the element with specific source or target.
		if(e.source){
			if(e.source.id==FunctionFocused.id) return e;
		}
		if(e.target){
			if(e.target.id==FunctionFocused.id) return e;
		}
	});
	
	linkFiltered.attr("class","LT");
	//Resets the scale of the mouse target's function 
	/*
	// Makes the focus on the node, some problems occurs when focus is combined with drag.
	var scale=1;
	transform_value = e.attributes.transform.value;
	var parts  = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(transform_value);
	if(parts){
		var firstX = parts[1],firstY = parts[2];
	}
	else{
		var firstX=0,firstY=0;
	}
	d3.select(e).transition()
		.duration(0)
		.attr("transform","translate("+firstX+", "+firstY+") scale("+scale+") ");
	 */// console.log("translate("+firstX+", "+firstY+") scale("+scale+") ");
}

function redrawSVG(){ //Function for zoom.
//	console.log("Redraw: transform - translate("+ d3.event.translate +") scale( "+ d3.event.scale +")");
	
	var translate=d3.event.translate;
	var scale=d3.event.scale;
	svg.attr("transform",
			"translate(" +d3.event.translate+ ")"
			+ " scale(" + d3.event.scale + ")");
}

/** Ale
 * This function creates and updates the links between the elements, and also manage the places of the nodes. 
 */
function tick() {
	/* Path property. d stay for 'draw'. M indicates the starting point for drawing. A stays for elliptical arch. 
		The four parameters are: A rx ry x-axis-rotation large-arc-flag sweep-flag x y.
		For more info see about Path: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
	 */
//	console.log("Tick");
	if(drawLink.draw) return; //Stops the drag of the node.
	link.attr("d", function(d) {
		/* Checks if is present the source and the target. 
		 * If one of them is not present change the class of the circle relative to the empty aspect. */
		if(d.source && d.target){
			/* Checks if it is a group. */
//			var link_target = d.target.group || d.target; // Takes as reference the group of the function if present.
//			var link_source = d.source.group || d.source; // Takes as reference the group of the function if present.
//			//For group hierarchy.
			var link_target = d.target; // Takes as reference the group of the function if present.
			var link_source = d.source; // Takes as reference the group of the function if present.
			//For group hierarchy.
			while( link_target.in_group ){
				// If the group is exploded, link to the child
				if( !link_target.group.show_functions) link_target = link_target.group;
				else break;
			}
			while( link_source.in_group ){
				// If the group is exploded, link to the child
				if( !link_source.group.show_functions) link_source = link_source.group;
				else break;
			}
			// Shows the links to the Group's functions in the graph.
//			if(d.target.group){ if(d.target.group.show_functions) link_target = d.target;} 
//			if(d.source.group){ if(d.source.group.show_functions) link_source = d.source;}		
			
			if( link_target.id == link_source.id && link_target.is_group ){
				//Checks if the source and the target are in the same group. In that case doesn't show the link.
				console.log("Link not showed: "+d.label+" from: "+link_source.name+" to: "+link_target.name);
				var link_to_delete = d3.select("#L"+d.id+"_"+d.type+"_"+d.source.id+"_"+d.target.id);
				// This prevents a bug in Firefox that display the text over a path in the left top corner of the svg rect.
				if(link_to_delete[0][0]!=null) link_to_delete[0][0].parentElement.remove(); 
				return "";
			}
			var dx = link_target.x - link_source.x,
			dy = link_target.y - link_source.y,
			dr = Math.sqrt(dx * dx + dy * dy),
			dtype = d.type;
			//Searches for the position of the interessed parameters.
			var cx_in, cy_in, cx_out, cy_out;
			var node_tmp;
			node_tmp=d3.selectAll("g circle.output");
			cx_out=parseFloat(node_tmp.attr("cx"))+5;
			cy_out=parseFloat(node_tmp.attr("cy"));
			if(dtype.match(/input/i)!=null){
				node_tmp=d3.selectAll("g circle.input");
				cx_in=parseFloat(node_tmp.attr("cx"))-5;
				cy_in=parseFloat(node_tmp.attr("cy"));
			}
			else if(dtype.match(/resource/i)!=null){
				node_tmp=d3.selectAll("g circle.resource");
				cx_in=parseFloat(node_tmp.attr("cx"));
				cy_in=parseFloat(node_tmp.attr("cy"))+15;
			}
			else if(dtype.match(/precondition/i)!=null){
				node_tmp=d3.selectAll("g circle.precondition");
				cx_in=parseFloat(node_tmp.attr("cx"));
				cy_in=parseFloat(node_tmp.attr("cy"))+15;
			}
			else if(dtype.match(/time/i)!=null){
				node_tmp=d3.selectAll("g circle.time");
				cx_in=parseFloat(node_tmp.attr("cx"));
				cy_in=parseFloat(node_tmp.attr("cy"))-5;				
			}
			else if(dtype.match(/control/i)!=null){
				node_tmp=d3.selectAll("g circle.control");
				cx_in=parseFloat(node_tmp.attr("cx"));
				cy_in=parseFloat(node_tmp.attr("cy"))-5;
			}
			//Test with H and V lines
			/* var line = "M"+
					(d.source.x+cx_out) + "," + 
					(d.source.y+cy_out);
				if((dx+cx_out+cx_in)>0 && (dy+cy_out+cy_in)>0){line+= "H" + (d.target.x+cx_in) + "V" + (d.target.y+cy_in);}	
				if((dx+cx_out+cx_in)<0 && (dy+cy_out+cy_in)>0){line+= "V" + (d.target.y+cy_in) + "H" + (d.target.x+cx_in);}	
				if((dx+cx_out+cx_in)>0 && (dy+cy_out+cy_in)<0){line+= "H" + (d.target.x+cx_in) + "V" + (d.target.y+cy_in);}	
				if((dx+cx_out+cx_in)<0 && (dy+cy_out+cy_in)<0){line+= "V" + (d.target.y+cy_in) + "H" + (d.target.x+cx_in);}	

				return line; */
			//Test with Bezier
			return "M" + 
			(parseInt(link_source.x)+cx_out) + "," + 
			(parseInt(link_source.y)+cy_out) + "Q" + 
			(parseInt(link_source.x)+cx_out) + " " + (parseInt(link_target.y)+cy_in) + ","+
			(parseInt(link_target.x)+cx_in) + " " + 
			(parseInt(link_target.y)+cy_in);

			//Test with Arcs
			/* return "M" + 
					d.source.x + "," + 
					d.source.y + "A" + 
					dr + "," + dr + " 0,0,0, " + 
					d.target.x + "," + 
					d.target.y; */
		}
	});

	svg.selectAll("g.node")
	.attr("cx", function(d) {
		return d.x; })
	.attr("cy", function(d) { 
		return d.y; })
	.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")";});
	
//	svg.selectAll("g.node")
//	.attr("cx", function(d) { return d.x; })
//	.attr("cy", function(d) { return d.y; })
//	.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")";});
		
	svg.selectAll("path.hullGroup").attr("d",drawCluster); // Updates the Hull
	
	force.stop(); //This could be done because we have a static graph, all the nodes are fixed.
}
//Double click handler
function dblclick(d) { 
	console.log("Double click!!!");
	
	if(id_currentpage==2 || id_currentpage==3){//Only when it is in modification.
		if(d.is_group)	createGroupEditWindow(d);
		else createFunctionEditWindow(d);
	}
	if(id_currentpage==5 || id_currentpage==6){//Only when it is in modification.
		if(d.is_group) createGroupInstanceEditWindow(d);
		else createFunctionInstanceEditWindow(d);
	}
}

/** Ale 
 * Function that deletes the node identified by 'FtoDelete', and updates the graph. 
 */
function deleteFunction(FtoDelete){
	console.log("Function to remove: "+FtoDelete);
	//Updates the aspects linked to that node.
	var AtoDelete = aspects.filter(function(d){
		if(d.source==FtoDelete || d.target==FtoDelete) return d;
	});
	for(var i=0; i<AtoDelete.length; i++){
		//Removes the links
		var i_to_delete=links.indexOf(AtoDelete[i]);
		if(i_to_delete != -1) links.splice(i_to_delete,1);
		//Updates the aspects.
		if(AtoDelete[i].source==FtoDelete && !AtoDelete[i].target) aspects.splice(aspects.indexOf(AtoDelete[i]),1); //removes definitiveley the aspect
		else if(AtoDelete[i].source==FtoDelete) aspects[aspects.indexOf(AtoDelete[i])].source = null; 
		else if(!AtoDelete[i].source && AtoDelete[i].target==FtoDelete ) aspects.splice(aspects.indexOf(AtoDelete[i]),1);
		else if( AtoDelete[i].target==FtoDelete ){ aspects[aspects.indexOf(AtoDelete[i])].target = null; aspects[aspects.indexOf(AtoDelete[i])].type="Output";}
	}
	// Removes the node from 'nodes' and from the visualization
	if(FtoDelete.in_group){	// Removes the function from the group.
		removeFunctionNodeFromGroupNode(FtoDelete.id, FtoDelete.group.id);
	}
	var index_node = FtoDelete.index;
	nodes.splice(index_node,1);
	
	//Updates the graph.
	updateFRAMModel();
}

/** Ale: 
 * FUnction that deletes an aspect, identified by 'AtoDelete', and updates the graph.
 * An aspect is uniquely identified by its id. An aspect instance is identified by: aspect id, source id, target id and type.
 */
function deleteAspect(AIdtoDelete, ASource, ATarget, AType){ 
	console.log("Aspect to remove: "+AIdtoDelete+" "+ASource+" "+ATarget+" "+AType);
	// Retrieves the aspect from the list.
	var AtoDelete = find_aspect(AIdtoDelete, ASource, ATarget, AType);
	if(AtoDelete.length == 0){
		console.log(" Aspect not find, or not present! ");
		return false;
	}
//	console.log(AtoDelete);
	// Removes the aspect from the source and from the target. 
	var source=AtoDelete[0].source;
	var target=AtoDelete[0].target;
	var iA; //Index of the aspect.
	if(source){
		iA = source.aspects.indexOf(AtoDelete[0]);
		source.aspects.splice(iA,1);
	}
	if(target){
		iA = target.aspects.indexOf(AtoDelete[0]);
		target.aspects.splice(iA,1);
	}
	
	updateMultiLabel("remove", AtoDelete[0]); // Updates the labels.
	// Removes the link associated.
	iA = links.indexOf(AtoDelete[0]);
	if(iA!=-1) links.splice(iA,1);
	// Checks if the apsect is shared only between the two links, in that case it deletes the aspect from the memory.
	
	iA = aspects.indexOf(AtoDelete[0]);
	aspects.splice(iA,1);
	// Updates the graph.
	updateFRAMModel();
	return true;
}

/**
 * Function that finds the aspect selected.
 */
function find_aspect(AId, ASource, ATarget, AType){
	return aspects.filter(function(d){
		// Searches for the aspect that has the id, type, source and target passed.
		var source_found = false; target_found = false;
		if(d.id == AId && d.type == AType){
			if( d.source != null && ASource != "null"){
				if(d.source.id == ASource) source_found = true;
			}
			else if(ASource == "null") source_found = true;
			if(d.target != null && ATarget != "null"){
				if(d.target.id == ATarget) target_found = true;
			}
			else if(ATarget == "null") target_found = true;

			if( source_found && target_found ) return d.id == AId;
		}
	});
}

/**
 * Function that updates the model in the client side for a fast reload, when it is not saved on the server.
 */
function modelnotsaved_update(){
//	console.log("Update Model not saved."+modelId);
	if(modelId){
		var index = util.getIndexById(models_notsaved, modelId);
		if(index!=-1){
			models_notsaved[index].setNodes(nodes);
			models_notsaved[index].setLinks(links);			
			models_notsaved[index].setAspects(aspects);			
		}
	}
}
/** Ale
 * Function that updates the model instance in the client side for a fast reload, when it is not saved on the server.
 */
function modelinstancenotsaved_update(){
	console.log("Update Model Instance not saved."+modelInstanceId);
	if(modelInstanceId){
		var index = util.getIndexById(modelinstances_notsaved, modelInstanceId);
		if(index!=-1){
			modelinstances_notsaved[index].setNodes(nodes);
			modelinstances_notsaved[index].setLinks(links);			
			modelinstances_notsaved[index].setAspects(aspects);			
		}
	}
}
/**Ale
 * Rebinds the pointer among the nodes and links. Used when a model is loaded from models_notsaved.
 */ 
function rebind_connection(){
	console.log("Rebinds the connection among the element of the graph.");
	// Binds the Functions with the Groups
	for(var i in nodes){
		if(nodes[i].is_group){ //Searches the functions and rebind them.
			for(var j in nodes[i].functions){
				nodes.filter(function(d){ 
					if(nodes[i].functions[j].id == d.id ){ nodes[i].functions[j] = d; return true;}
				});
			}
		}
		
		if(nodes[i].in_group){ // binds the group.
			var find_group = nodes.filter(function(d){
				if(d.id == nodes[i].group.id){ nodes[i].group = d; return true;}
			});
//			if(find_group) console.log("Group: "+nodes[i].group.name+" for: "+nodes[i].id+" founded");
		}
		
	}
	//Binds the Aspects
	for(var i=0; i<aspects.length; i++){
		if(aspects[i].source){
			var n_selected = nodes.filter(function(d){return d.id==aspects[i].source.id;});
			if(n_selected){
				aspects[i].source=n_selected[0];
				//Binds the node with the aspect
				var a_selected = n_selected[0].aspects.filter(function(a){return a.id==aspects[i].id;});
				if(a_selected) a_selected = aspects[i];
			}
		}
		if(aspects[i].target){
			var n_selected = nodes.filter(function(d){return d.id==aspects[i].target.id;});
			if(n_selected){
				aspects[i].target=n_selected[0];
				//Binds the node with the aspect
				var a_selected = n_selected[0].aspects.filter(function(a){return a.id==aspects[i].id;});
				if(a_selected) a_selected = aspects[i];
			}
		}
	}
	//Binds the aspects in the nodes.
	for(var n in nodes){
		for(var a in nodes[n].aspects){
			var a_found = aspects.filter(function(d){
				return (d.id == nodes[n].aspects[a].id && d.type == nodes[n].aspects[a].type && 
						((!d.source && !nodes[n].aspects[a].source) || (d.source && nodes[n].aspects[a].source && d.source.id == nodes[n].aspects[a].source.id)) &&
						((!d.target && !nodes[n].aspects[a].target) || (d.target && nodes[n].aspects[a].target && d.target.id == nodes[n].aspects[a].target.id)));
			});
			if(a_found.length>0) nodes[n].aspects[a] = a_found[0];
		}
	}
	//Binds the Links to the aspect.
	for(var l in links){
		var link_found = aspects.filter(function(d){
			/*Checks for the aspect with the same id, same type and which has the same source and target 
			*(which could be or both null, or with the same id).
			*/
			return (d.id == links[l].id && d.type == links[l].type && 
					((!d.source && !links[l].source) || (d.source && links[l].source && d.source.id == links[l].source.id)) &&
					((!d.target && !links[l].target) || (d.target && links[l].target && d.target.id == links[l].target.id))); });
		if(link_found.length>0){
			links[l] = link_found[0];
		}
		else console.log("REBIND - Link not found.");
	}
	//Binds the Links
//	for(var i=0; i<links.length; i++){
//		if(links[i].source){
//			var n_selected = nodes.filter(function(d){return d.id == links[i].source.id;});
//			if(n_selected)links[i].source=n_selected[0];
//		}
//		if(links[i].target){
//			var n_selected = nodes.filter(function(d){return d.id==links[i].target.id;});
//			if(n_selected) links[i].target=n_selected[0];
//		}
//	}
}

/** Ale
 * Updates the multi label in the case of multiple edge between the same two function.
 * The possible behaviours are:
 * Add: to merge the label of all this function in a new one.
 * Remove: remove only the label of the aspect removed.
 * @param operation: ['add', 'remove']. 'add' in the case of a new aspect
 * @param new_aspect: the aspect to add or remove.
 */
function updateMultiLabel(operation, new_aspect){
	if(new_aspect.source && new_aspect.target){
		// Searches for aspect between the two function with same type.
		var same_aspects=links.filter(function(d){return (d.type==new_aspect.type && d.source.id==new_aspect.source.id && d.target.id == new_aspect.target.id && d.id!=new_aspect.id);})
		if(same_aspects.length>0){
			if(operation=="add"){
				var new_multilabel="";
				same_aspects.forEach(function(d){
					d.multilabel +=", "+new_aspect.label;
					new_multilabel=d.multilabel;
//					console.log("Label: "+d.multilabel);
				});	
				new_aspect.multilabel = new_multilabel;
			}
			else if(operation=="remove"){
				same_aspects.forEach(function(d){
					d.multilabel = d.multilabel.replace(", "+new_aspect.label,"");// If the label is not the first.					
					d.multilabel = d.multilabel.replace(new_aspect.label+", ","");// If the label is the first.					
//					console.log("Label: "+d.multilabel);
				});	
			}
		}
	}
}

/**
 * Functions that resets the main parameters: 
 * Last id for function - last id for aspects and re-binds the connection among the nodes and aspects.
 */
function resetParameters(){
	console.log("Reset Parameters!");
	Flast_id=getFunctionsMaxId();
	Alast_id=getAspectsMaxId();
	rebind_connection(); //Rebinds the connection among nodes, aspects and links.
					
	updateFRAMModel();
}

/**Ale
 * Calculates the complexity for the model. As the max number of functions for a group. 
 * It could also be the average number of functions for groups
 */
function modelComplexity(){
	var complexity = 0;
	for(var n in nodes){
		if(nodes[n].is_group){
			var f_in_group = countGroupTOTFunctions(nodes[n]);
			if(complexity < f_in_group) complexity = f_in_group;
		}
	}
	return complexity;
}

/**Ale
 * The number of functions for the model
 */
function modelVolumes(){
	var volumes = 0;
	for(var n in nodes){
		if(!nodes[n].is_group) volumes++;
	}
	return volumes;
}

/**Ale
 * The Cohesion is how much a model is connected with others. The number of aspet over the number of functions.
 */
function modelCohesion(){
	var result = new Object;
	var volumes = modelVolumes();
	result.functions = volumes;
	result.aspects = aspects.length;
	result.cohesion = 0;
	if(result.functions != 0) result.cohesion = result.aspects / result.functions;
	return result;
}

/**Ale:
 * Settings for the options of toastr
 */
function toastrSettings(type){
	switch(type){
	case("default"):
		toastr.options = {
			"closeButton": false,
			"debug": false,
			"newestOnTop": true,
			"progressBar": false,
			"positionClass": "toast-top-center",
			"preventDuplicates": true,
			"onclick": null,
			"showDuration": "300",
			"hideDuration": "1000",
			"timeOut": "5000",
			"extendedTimeOut": "1000",
			"showEasing": "swing",
			"hideEasing": "linear",
			"showMethod": "fadeIn",
			"hideMethod": "fadeOut"
		};
		break;
	case("indexInfo"):
		toastr.options = {
			  "closeButton": true,
			  "debug": false,
			  "newestOnTop": true,
			  "progressBar": false,
			  "positionClass": "toast-bottom-center",
			  "preventDuplicates": true,
			  "onclick": null,
			  "showDuration": "300",
			  "hideDuration": "1000",
			  "timeOut": 0,
			  "extendedTimeOut": 0,
			  "showEasing": "swing",
			  "hideEasing": "linear",
			  "showMethod": "fadeIn",
			  "hideMethod": "fadeOut",
			  "tapToDismiss": false
			}
		break;
	}
}