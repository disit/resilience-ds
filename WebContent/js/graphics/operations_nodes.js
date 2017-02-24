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
 * Nodes operations. 
 * 16-4-26: Creation of Aspect by Drag.
 */
var drag_line, diagonal_line=null ,selectedCircleAspect=null, drawLink = {draw:false, type:"output"}; // Sign if the user is drawing a link.
var aspect_list = ["output","input","precondition","resource","control","time"];
// Ale: Checks for new nodes to add to the model.
function computeNewFunction(id_node, name, description, x, y, cx, cy, color, type, Aspects )
{	
	var id_newnode=id_node;
	if(!id_newnode) {
		id_newnode = Flast_id;
		Flast_id++;
	}
	//Ale: Adds a new node to the graph.
	
	//Sets x,y the center of the graph.
	var translation=[screen.width/3.5,screen.height/2.5];
	if(zm) translation = zm.translate();
//	if(!x) x=(screen.width/3.5)-translation[0];
//	if(!y) y=(screen.height/2.5)-translation[1];
	if(!x) x = 100*zm.scale()-zm.translate()[0];
	if(!y) y = 100*zm.scale()-zm.translate()[1];
	if(!cx) cx=x;
	if(!cy) cy=y;
	if(!Aspects) Aspects=new Array();
	if(!color) color = "#000";
	if(!description) description="No Description provided";
	if(!name) name="Function_"+id_newnode;
	
	var n = {id: id_newnode, x: x, y: y, cx: cx, cy: cy, color: color, 
			name: name, aspects: Aspects, type: 0, idModel: modelId, description: description };
	
	nodes.push(n);	
	return n.id;
}

// Ale: Checks for new nodes to add to the model.
function computeNewGroup(id_node, name, description, x, y, cx, cy, color, type, Aspects, Functions )
{
	var id_newnode=id_node;
	if(!id_newnode) {
		id_newnode = Flast_id;
		Flast_id++;
	}
	//Ale: Adds a new node to the graph.
	
	//Sets x,y the center of the graph.
	var translation=[screen.width/3.5,screen.height/2.5];
	if(zm) translation = zm.translate();
	if(!x) x=(screen.width/3.5)-translation[0];
	if(!y) y=(screen.height/2.5)-translation[1];
	if(!cx) cx=x;
	if(!cy) cy=y;
	if(!Aspects) Aspects = new Array();
	if(!Functions) Functions = new Array();
	if(!color) color = "#000";
	if(!description) description="No Description provided";
	if(!name) name = "New Group";
	
	var n = {id: id_newnode, x: x, y: y, cx: cx, cy: cy, color: color, 
			name: name, aspects: Aspects, type: 0, idModel: modelId, description: description, is_group: true, functions: Functions };

	nodes.push(n);	
	return n.id;
}

function getId(position)
{
	if(position == undefined)
		position = "C0";
	return parseInt(position.substring(1));
}
/**
 * Gets the last id entered for the Functions.
 */
function getFunctionsMaxId(){
	var max = nodes.length;
	nodes.forEach(function(d){
		if(d.id>max) max = d.id;
	});	
	return max;
}
/**
 * Gets the last id entered for the Aspects.
 */
function getAspectsMaxId(){
	var max = aspects.length;
	aspects.forEach(function(d){
		if(d.id>max) max = d.id;
	});	
	return max;
}

/** Ale
 * Checks for missing aspect in the function, for a specific type.
 * @param f_to_check: the function to control control.
 * @param aspectType: the specific type to control.
 */
function checkGroupMissingAspect( g_to_check, aspectType ){
//	console.log("Missing aspect "+aspectType);
	var aspect_miss = new Object;
	aspect_miss.miss = false;
	aspect_miss.label = "";
	var output_case = "Output";
	var re = new RegExp(aspectType, 'i');
	
	if(!g_to_check.is_group){console.log("The parameter passed is not a group!"); return false;}
	for(var i in g_to_check.functions){
		f_in_g = g_to_check.functions[i];
		if(f_in_g.is_group){
			var group_response = checkGroupMissingAspect( f_in_g, aspectType );
			if(!aspect_miss.miss) aspect_miss.miss = group_response.miss;
			aspect_miss.label+=", "+group_response.label;
		}
		else if(f_in_g.aspects){
			var f_missed = f_in_g.aspects.filter(function(n){
				if(n.type.match(re)){
					if( !n.source && n.target.id == f_in_g.id ) return n; 
					else if( output_case.match(re) && !n.target && n.source.id == f_in_g.id){
						return n;
					}
				}
				return;
			});
			if( f_missed.length > 0){
				aspect_miss.miss = true; 
				for(var a in f_missed){
					aspect_miss.label += ", "+f_missed[a].label;
				}
			}
		}
//		if(aspect_miss) break; // With this control it stops at the first step but it doesn't show the label on the AspectMissLabel			
	}
	aspect_miss.label = aspect_miss.label.slice(2);
	return aspect_miss;
}

/** Ale
 * Checks for missing aspect in the function, for a specific type.
 * @param f_to_check: the function to control control.
 * @param aspectType: the specific type to control.
 */
function checkFunctionMissingAspect( f_to_check, aspectType ){
//	console.log("Missing aspect "+aspectType);
	var aspect_miss = new Object;
	aspect_miss.miss = false;
	var output_case = "Output";
	var re = new RegExp(aspectType, 'i');
	if(f_to_check.aspects){
		var f_missed = f_to_check.aspects.filter(function(n){
			if(n.type.match(re)){
				if( !n.source && n.target.id == f_to_check.id ) return n; 
				else if( output_case.match(re) && !n.target && n.source.id == f_to_check.id){
					return n;
				}
			}
			return;
		}); 
		if( f_missed.length > 0){
			aspect_miss.miss = true;
			aspect_miss.label = "";
			for(var a in f_missed){
				aspect_miss.label += ", "+f_missed[a].label;
			}
			aspect_miss.label = aspect_miss.label.slice(2);
		}	
	}
	return aspect_miss;
}

/**Ale
 * Function that starts the dynamic draw of a circle. Check if the element dragged is an aspect of the function 
 * (One of the polygon's circles)
 * @param circle_start
 * @return true, if it starts to draw the link.
 */
function drawLinkStart(d) {
//	console.log("Check if start to drag.");
	var ref_element_class =  d3.event.sourceEvent.target.classList;
//	console.log(ref_element_class);
	if(ref_element_class.contains("circle") || ref_element_class.contains("text")){ // Check if the user have select a circle, or the text in the circle.
		var type = ref_element_class[1]; // Finds the type.
		if(!aspect_list.includes(type)) return false; // Reference not found. Probably click on the text in the node.
		toastr.info('Drag to the entry of another Function to create a New Aspect!');
		var mouse_xy = d3.mouse(d3.select("rect#frame").node());
//		console.log( mouse_xy ); // Returns the mouse coordinates into the graph frame.
		drawLink.draw = true; drawLink.type = type; drawLink.node = d;
		// Append a new line.
		diagonal_line = new Object();
		diagonal_line.initial_xy = {x:d.x, y:d.y};
		diagonal_line.source = {x:mouse_xy[0], y:mouse_xy[1]};
		diagonal_line.target = {x:mouse_xy[0], y:mouse_xy[1]};
		
//		drag_line = svg.insert("path",".node") //Insert the line before the node for prevent pointing problem
		drag_line = svg.append("path") //Insert the line before the node for prevent pointing problem
		.attr("class", "dragline")
		.attr("d", function(){
			return "M "+diagonal_line.source.x+","+diagonal_line.source.y+" L "+mouse_xy[0]+" , "+mouse_xy[1];
		})
		.attr("marker-end","url(#end_arrow)")
		.attr('pointer-events', 'none');
//		drag_line = svg.insert("line",".node") //Insert the line before the node for prevent pointing problem
//        .attr("x1", mouse_xy[0]).attr("y1", mouse_xy[1])
//        .attr("x2", mouse_xy[0]).attr("y2", mouse_xy[1]);
		return true;
	}
	return false;
}

/**Ale
 * Updates the line path.
 */
function drawLinkUpdate(){
//	console.log("Updates the drag line.");
	var mouse_xy = d3.mouse(d3.select("rect#frame").node()); //Mouse relative to the svg rect.
//	drag_line.attr("x2", mouse_xy[0])
//	.attr("y2", mouse_xy[1]);
	if(drawLink.type == "output") diagonal_line.target= {x:mouse_xy[0], y:mouse_xy[1]};
	else diagonal_line.source = {x:mouse_xy[0], y:mouse_xy[1]};
	drag_line.attr("d", function(){
		return "M"+diagonal_line.source.x+","+diagonal_line.source.y+" L "+diagonal_line.target.x+" , "+diagonal_line.target.y;
	});
}

/**Ale
 * End the drawing of the path.
 */
function drawLinkEnd(){
//	console.log("Stop Draw. Check if the target is an entry of a function.");
//	console.log(selectedCircleAspect);
	if(selectedCircleAspect && selectedCircleAspect.type != drawLink.type && (selectedCircleAspect.type=="output" || drawLink.type=="output")){
		//Checks if we have group and if they are not empty of functions.
		var group_selected_empty = isGroupEmpty(selectedCircleAspect.node);
		var group_start_empty = isGroupEmpty(drawLink.node);
		if(group_selected_empty || group_start_empty){ toastr.error("Group Empty!"); }
		else{
			console.log("Adds the link between "+selectedCircleAspect.node.name+" and "+drawLink.node.name);
			// Shows the dialog for choose the name, and eventually the group aspect.
			var newAspect = new Object; 
			if(drawLink.type == "output"){
				newAspect.source = drawLink.node;
				newAspect.target = selectedCircleAspect.node;
				newAspect.type = selectedCircleAspect.type.capitalizeFirstLetter();
			}
			else{
				newAspect.target = drawLink.node;
				newAspect.source = selectedCircleAspect.node;	
				newAspect.type = drawLink.type.capitalizeFirstLetter();
			}
			createAspectAddInfoWindow(newAspect.source, newAspect.target, newAspect.type);
		}
	}
	else{
		if(!selectedCircleAspect) toastr.error('No Entry Selected!');	
		else{
			if(selectedCircleAspect.type!="output" && drawLink.type!="output") toastr.error('The Entry Selected is not Valid! You have to choose an Output!');
			else toastr.error('The Entry Selected is not Valid! You have to choose one Aspect!');
		}
	}
	// Resets the initial position. The drag moves the node even if the tick function is disabled.
	drawLink.node.x = diagonal_line.initial_xy.x; 
	drawLink.node.px = diagonal_line.initial_xy.x; 
	drawLink.node.y = diagonal_line.initial_xy.y;
	drawLink.node.py = diagonal_line.initial_xy.y;
	// Reset the drag options. And deletes the path.
	d3.selectAll("path.dragline").remove(); drawLink.draw = false; drag_line = null; diagonal_line = null; selectedCircleAspect = null;
	
//	force.stop(); //Stops the tick function made by the drag.
} 

/**Ale
 * Select the aspect with mouse over.
 */
function overAspectCircle(node,type){
	if(drawLink.draw){
//		console.log("over "+node.name);
		selectedCircleAspect = {node:node, type:type};
	}
}

/**Ale
 * De-select the aspect overed.
 * @param node
 * @param type
 */
function outAspectCircle(node,type){
	if(drawLink.draw){
//		console.log("out "+node.name);
		selectedCircleAspect = null;
	}	
}

/**Ale
 * Searches for all the aspects of a functions that satisfy specific request
 * @param f: the function
 * @param source: {false, true} indicates if searches the aspects that have f for source.
 * @param a_type: the type of the aspects to search. If empty it seaches only for source or target.
 */
function getFunctionAspects(f, source, a_type){
	var fa_founded = new Array(); // The aspects in function founded.
	if(source){
		fa_founded = f.aspects.filter(function(a){
			return (a.source == f && (!a_type || a.type == a_type));
		});
	}
	else{
		fa_founded = f.aspects.filter(function(a){
			return (a.target == f && (!a_type || a.type == a_type));
		});
	}
	return fa_founded;
}

/**Ale
 * Before Update the model set's the flag alreadyShowed that indicates that the aspects is already been showed or considered in a group.
 */
function initializeAspectsShowForUpdate(){
	for(var a in aspects){
		aspects[a].alreadyShowed = false;
	}
}

/**Ale
 * Functions that checks if there are cycle in the model
 */ 
function checkForCycle(){ //TODO Call when the user choose the function's output.
//	var functions_to_check; //Checks only the functions.
//	for(var n in nodes){
//		if(!nodes[n].checked){ // Checks the node.
//			
//		}
//	}
}

/** Ale:
 * Adds the icon 'i' over the function, that is used for show the function's info like name, color, aspects etc. in a not edit page.
 */
function showFunctionInfo(id_node){
//	console.log("Add group show for: ");
	var	textmodify_element = d3.selectAll("#f_"+id_node); // The element's node.	
	if( textmodify_element.data()[0] ){ // Appends the info to functions and groups.
		textmodify_element.append("image")
		.attr("id", "showgroupicon_"+id_node)
//XXX		.attr("id", "deleteicon_"+id_node)
		.attr("class","modifyFunction")
		.attr("xlink:href", "image/info_icon.png")
		.attr("x", 35)
		.attr("y", -15)
		.attr("width", width_modifyimg)
		.attr("height", height_modifyimg)
		.attr("title","Show_Functions_Info")
		.on("click", function (d){
			console.log("Shows the info for: "+d.id);
			createFunctionInfoWindow(d);
		})
		.append("title")
		.attr("x", (width_node-width_modifyimg - 50)).attr("y", 2)
		.attr("class","text")
		.text("Show the info for this FRAM.");
	}
}

//___________________________________FUNCTIONS FOR THE LABEL OF MISS ASPECTS-----------------------------------
/**Ale: 
 * Shows the label for the aspects that hasn't no target or source.
 */
function ShowHideMissAspectLabel(){
	// TODO Add Control to decied which has to be displayed.
	if(!displayMissAspectLabel){
		displayMissAspectLabel = true;
		d3.selectAll("g.missAspect").attr("class","labelForAspectMissed missAspect");
	}
	else{
		displayMissAspectLabel = false;
		d3.selectAll("g.missAspect").attr("class","labelForAspectMissed missAspect noDisplay");		
	}
}

/**Ale:
 * Functions that add or remove the class missAspect from the label. This class is used for find the aspect to add.
 * Also sets the label to display.
 * @param d: the node data
 * @param t: the inputs
 * @param show:{true,false} indicates if shows or not the label.
 */
function AddRemoveMissAspectLabel(d, t, labelTXT, show){
	var label, Lclass;
//	console.log("AddREmoveAspectLabel");
	if(show){ //Checks the status of the label and shows the label.
		label = d3.select("g#"+t+"label_"+d.id);
		Lclass = label.attr("class");
		if( Lclass.indexOf("missAspect")==-1 ){
			label.attr("class","labelForAspectMissed missAspect noDisplay"); //Adds the label
		}
		//Sets the label and the title.
		d3.select("g#"+t+"label_"+d.id+" title").text(labelTXT);
		if(labelTXT.length>14) labelTXT = labelTXT.slice(0,14)+"...";
		d3.select("g#"+t+"label_"+d.id+" text").text(labelTXT);
	}
	else{//Checks the status of the label and hide the label.
		label = d3.select("g#"+t+"label_"+d.id);
		Lclass = label.attr("class");
		if( Lclass.indexOf("missAspect")!=-1 ) label.attr("class","labelForAspectMissed noDisplay"); //Removes the label
		
	}
}

/**Ale:
 * Functions that hides or shows the label depend from the actual state (class noDisplay).
 * @param d: the node
 * @param t: the Aspect type.
 */
function AddRemoveSpecificLabel(d,t){
	var CLabel = d3.select("g#"+t+"label_"+d.id);
	var Cclass = CLabel.attr("class");
	if(Cclass.indexOf("missAspect")!=-1){// If is present the label.
		if(Cclass.indexOf("noDisplay")==-1){// Hides the label.
			CLabel.attr("class","labelForAspectMissed missAspect noDisplay");
		}
		else CLabel.attr("class","labelForAspectMissed missAspect"); // Displays the label.	
	}
}
//___________________________________________________________________________________