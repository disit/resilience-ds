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

/** Ale 16-4-12
 * Groups operations
 */
var selectedNode = null, draggingNode = null, dragStarted, hull_offset = 8;

/** Ale
 * Opens the windows for the insertion of a function in the group selected.
 */
function createAddGroupFunctionWindow(){ // currentGroup the group selected. 
	console.log("Add functions to the Group.");
	var dialog = $('#modal_Group_Add_Functions').dialog({
		resizable: false,
		height: 400,
		width: 400,
		modal: true,
		dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Ok", click: function() {
			// Retrieves the list of function checked.	
			var selected = []; //List of id
			$('#modal_Group_Add_Functions #checkboxes input:checked').each(function() {
			    selected.push({f_id:$(this).attr('value'), g_id:$(this).attr('group')});
			});
			console.log( selected );
			// Removes the functions no more present. If one in selected is already in removes it from selected list
			removeAllGroupFunctions( currentGroup.id, selected ); 
			for( var i=0; i < selected.length; i++ ){ 
				// Removes the function from the previous group, and adds to the current one.
				if( selected[i].g_id ){
					removeFunctionNodeFromGroupNode( selected[i].f_id );
					undo.saveOp( "g_removeFunction", selected[i].f_id, null, selected[i].g_id );
				}
				addFunctionNodeForGroupNode(selected[i].f_id, currentGroup.id);
				undo.saveOp( "g_addFunction", selected[i].f_id, null, currentGroup.id ); // Saves this operation
			}
			UpdateDialogGroup();
			// Adds the functions and removes those no more present.			
			closeGroupFunctionWindow( this );
		}
		},{
			text: "Reset", click: function() {
				$('#modal_Group_Add_Functions #inputname').val(currentGroup.name);
				$('#modal_Group_Add_Functions #inputdescription').val(currentGroup.description);
				$('#modal_Group_Add_Functions #inputcolor').val("#000000");
				
				$('#modal_Group_Add_Functions #inputname').css("box-shadow", "");				
				$('#modal_Group_Add_Functions #inputdescription').css("box-shadow", "");
			}
		}
		],
		close: function(event, ui){
			closeGroupFunctionWindow(this);
		}
	});
	//Inserts the functions in the check box list.
	var checkboxes = "";
	for(var i=0; i < nodes.length; i++){
		var txt_in_group = "";
		if(nodes[i].id != currentGroup.id){
			var pre_text =" ";
			if(nodes[i].is_group) pre_text+="(GROUP) ";
			if(nodes[i].in_group) txt_in_group += "group ='"+nodes[i].group.id+"' ";
			checkboxes +="<p><input class='checkbox' type='checkbox' id='chkbx_"+nodes[i].id+"' value='"+nodes[i].id+"' "
			+txt_in_group+" />"+pre_text+nodes[i].name;
			if(nodes[i].in_group) checkboxes += " ( In Group: "+nodes[i].group.name+" )";
			checkboxes += " </p>";
			
		}
	}
	$("#modal_Group_Add_Functions #checkboxes").append(checkboxes);
	//Sets as checked the functions already presents in the group.
	for(var i = 0; i < currentGroup.functions.length; i++){
		$("#modal_Group_Add_Functions #chkbx_"+currentGroup.functions[i].id).attr("checked","checked");
	}
	
}

/** Ale
 * Close the window for the insertion of functions in a group.
 */
function closeGroupFunctionWindow(Fwindow){
	$('#modal_Group_Add_Functions #checkboxes p').remove(); //Removes the check boxes.
	
	$(Fwindow).dialog('destroy');
	
	updateFRAMModel();
}

/** Ale
 * removes the function passed from the group.
 * @param f_id: function to remove
 * @param g_id: group that contain the function
 */
function removeFunctionNodeFromGroupNode(f_id, g_id){
//	console.log("Remove the function :"+f_id+" from the group: "+g_id);
	var f_selected = nodes.filter(function(d){return d.id == f_id});
	if(f_selected.length == 0){ console.log("Function not Found"); return; }
	else f_selected = f_selected[0];
	var g_selected = nodes.filter(function(d){return d.id == g_id});
	if(g_selected.length == 0){ console.log("Group not Found"); return; }
	else g_selected = g_selected[0];
	
	g_selected.functions.splice(g_selected.functions.indexOf(f_selected),1);
	f_selected.in_group = false;
	// Updates the position of the node.
	var varX=0; var varY=0;
	varX = g_selected.x - f_selected.cx; varY = g_selected.y - f_selected.cy;
	f_selected.x = f_selected.x + varX; f_selected.y = f_selected.y + varY;
	f_selected.px = f_selected.x; f_selected.py = f_selected.y;
	f_selected.cx = g_selected.x; f_selected.cy = g_selected.y;
	
	delete(f_selected.group);
	
	//Shows the group if not
	if(g_selected.functions.length == 0 && g_selected.show_functions){
		GroupShowFunctions(g_selected, false);
	}
}

/** Ale
 * adds a function passed into the group.
 * @param f_id: function id
 * @param g_id: group id
 */
function addFunctionNodeForGroupNode(f_id, g_id){
//	console.log("Adds the function :"+f_id+" in the group: "+g_id);
	var f_selected = nodes.filter(function(d){return d.id == f_id});
	if(f_selected.length == 0){ console.log("Function not Found"); return; }
	else f_selected = f_selected[0];
	var g_selected = nodes.filter(function(d){return d.id == g_id});
	if(g_selected.length == 0){ console.log("Group not Found"); return; }
	else g_selected = g_selected[0];
	
	if(f_selected.in_group){	//Case already in a group.
		undo.saveOp("g_removeFunction", f_selected.id, null, f_selected.group.id);
		removeFunctionNodeFromGroupNode(f_selected.id, f_selected.group.id);
	}
	//Anti-cycle control. Checks if the function selected is in the group to add.
	if(f_selected.is_group && g_selected.in_group){
		var found = checkGroupFunctionPresent(f_selected, g_selected);
		if(found){
			// Removes the cycle for the group
			undo.saveOp("g_removeFunction", g_selected.id, null, g_selected.group.id);
			removeFunctionNodeFromGroupNode(g_selected.id, g_selected.group.id);
			GroupShowFunctions(f_selected, false);
		} 
	}
	f_selected.in_group = true;
	f_selected.group = g_selected;
	f_selected.cx=g_selected.x;	f_selected.cy=g_selected.y;	//In cx and cy saves the group position for update the position when the group is moved.
	g_selected.functions.push(f_selected);
}

/**Ale
 * Check if the function is in the group.
 * @param g
 * @param f
 */
function checkGroupFunctionPresent(g, f){
	for(var i in g.functions){
		if(g.functions[i].id == f.id) return true;
		if(g.functions[i].is_group && checkGroupFunctionPresent(g.functions[i], f)) return true;
	}
	return false;
}

/** Ale
 * removes all the functions from the groop
 * @param g_id: id of the group.
 * @param list_in: list of selected check button.
 */
function removeAllGroupFunctions(g_id, list_in){
	var g_selected = nodes.filter(function(d){ return d.id == g_id} );
	if(g_selected.length == 0){ console.log("Group not Found"); return; }
	else g_selected = g_selected[0];
	
	for(var i = g_selected.functions.length; i>0; i--){
		var find = false; 
		if( list_in ){
			var find_list = list_in.filter(function(d){return d.f_id == g_selected.functions[i-1].id;});
			if(find_list.length > 0){
				find = true;
				// Removes the element from the list, for speed up and for the case of add new function in createAddGroupFunctionWindow.
				list_in.splice( list_in.indexOf(find_list[0]), 1 );
			}
			
		}
		if(!find){
//			console.log("Function removed from the group.");
			undo.saveOp("g_removeFunction", g_selected.functions[i-1].id, null, g_selected.id);
			removeFunctionNodeFromGroupNode(g_selected.functions[i-1].id, g_selected.id);
		}
//		else console.log("Function already present.");
	}
}

var overCircle = function(d) {
    selectedNode = d;
    updateTempConnector();
};

var outCircle = function(d) {
    selectedNode = null;
    updateTempConnector();
};

// Function to update the temporary connector indicating dragging affiliation
var updateTempConnector = function() {
//	console.log("Update Temp Connector");
    var data_for_drag = [];
    if (draggingNode !== null && selectedNode !== null) {
        // have to flip the source coordinates since we did this for the existing connectors on the original tree
        data_for_drag = [{
            source: {
                x: (selectedNode.x+60),
                y: (selectedNode.y+60)
            },
            target: {
                x: (draggingNode.x+60),
                y: (draggingNode.y+60)
            }
        }];
    }
    var link_for_drag = svg.selectAll(".templink").data(data_for_drag);

    link_for_drag.enter().append("path")
        .attr("class", "templink")
        .attr("d", d3.svg.diagonal())
        .attr('pointer-events', 'none');

    link_for_drag.attr("d", d3.svg.diagonal());

    link_for_drag.exit().remove();
};

/** Ale
 * Manage the dragging of a function.
 */
function GroupDragging(d, element){
	if (dragStarted) {
		domNode = element;
		initiateDrag(d, domNode);
	}
	updateTempConnector();
}

/** Ale
 * Initialization for the drag with groups.
 * @param d
 * @param domNode
 */
function initiateDrag(d, domNode) {
//	console.log("Initiate Drag");
	draggingNode = d;
    d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
    d3.selectAll('.ghostCircle').attr('class', function(n){ if( n.is_group && draggingNode.id != n.id) return 'ghostCircle show'; else return 'ghostCircle'; });
    d3.select(domNode).attr('class', 'node activeDrag');

    svg.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
        if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
        else return -1; // a is the hovered element, bring "a" to the front
    });    
    dragStarted = null;
}

/** Ale
 * Start the group dragging function.
 */
function GroupDragStart(){
	dragStarted = true;
}


/** Ale
 * manage the end of drag.
 */
function GroupDragEnd(element){	
	domNode = element;
	if (selectedNode) {
		// removes the element from the parent, and insert it into the group
		if(selectedNode.is_group && draggingNode){
			console.log("Adds Dragged node "+draggingNode.id+" to the group: "+selectedNode.id);
			addFunctionNodeForGroupNode(draggingNode.id, selectedNode.id);	
			undo.saveOp("g_addFunction", draggingNode.id, null, selectedNode.id);
			//Ols drag where the group was deleted.
//			if(draggingNode.is_group){
//				console.log("Adds The group: "+draggingNode.id +" in the group: "+selectedNode.id);
//				for(var i = draggingNode.functions.length; i > 0; i--){
//					addFunctionNodeForGroupNode(draggingNode.functions[i-1].id, selectedNode.id);
//					undo.saveOp("g_addFunction", draggingNode.id, null, selectedNode.id); //Saves this operation
////					removeFunctionNodeFromGroupNode(draggingNode.functions[i-1].id, draggingNode.id);
//				}
//				deleteFunction(draggingNode);//Deletes the group.
//			}
//			else{
//				console.log("Adds Dragged node "+draggingNode.id+" to the group: "+selectedNode.id);
//				addFunctionNodeForGroupNode(draggingNode.id, selectedNode.id);	
//				undo.saveOp("g_addFunction", draggingNode.id, null, selectedNode.id); //Saves this operation
//			}
			updateFRAMModel();
		}
		endDrag();
	} else {
		endDrag();
	}
}

/** Ale
 * Manage the drag end for the visualization.
 */
function endDrag(){
    selectedNode = null;
    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
//    d3.select(domNode).attr('class', 'node');
    // now restore the mouseover event or we won't be able to drag a 2nd time
    d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
    updateTempConnector();
    if (draggingNode !== null) {
//        update(root);
//        centerNode(draggingNode);
        draggingNode = null;
    }
}

/** Ale
 * Removes a group from the graph.
 * @param GtoDelete: The group to delete.
 * @param complete: if true removes also the functions in the group.
 */
function deleteGroup(GtoDelete, complete){
	console.log("Group to remove: "+GtoDelete);
	var n_functions = GtoDelete.functions.length;
	if(complete && GtoDelete.functions){
		// Deletes all the functions.
		for(var i=n_functions-1; i >= 0; i--){
			undo.saveOp("f_delete",GtoDelete.functions[i]);
			deleteFunction(GtoDelete.functions[i]);
		}
	}
	else{
		// Deletes all the functions.
		for(var i=n_functions-1; i >= 0; i--){
			undo.saveOp("g_removeFunction", GtoDelete.functions[i].id, null, GtoDelete.id);
			removeFunctionNodeFromGroupNode(GtoDelete.functions[i].id, GtoDelete.id);
		}
	}
	if(GtoDelete.in_group){ // Removes from the group.
		undo.saveOp("g_removeFunction", GtoDelete.id, null, GtoDelete.group.id);
		removeFunctionNodeFromGroupNode(GtoDelete.id, GtoDelete.group.id);
	}
	// Deletes the group
	undo.saveOp("g_deleteGroup",null ,null ,GtoDelete ); 
	var index_node = GtoDelete.index;
	nodes.splice(index_node,1);
	
	// Updates the graph.
	updateFRAMModel();
}

/** Ale
 * Functions that returns the curve for the hull.
 * @param d
 * @returns
 */
function drawCluster(d) {
//	console.log("Draw the path for the hull.");	
	var curve = d3.svg.line()
    .interpolate("cardinal-closed")
    .tension(.85);
	var g_path; 
	var l = []; //List of point for the hull.
	l = HullPoints(d);
	g_path = d3.geom.hull(l);
//	console.log(g_path);
	return curve(g_path);
}

/**Ale
 * Gets the point for the hull.
 * @param d
 */
function HullPoints(d){
	var l = [];
	for(var i in d.functions){
		// If the function is a group, we need the points of that hull. For that we need a ricorsive call.		
		if( d.functions[i].is_group && d.functions[i].show_functions ) l = l.concat( HullPoints(d.functions[i]) );
		else{
			l.push([d.functions[i].x-hull_offset, d.functions[i].y-hull_offset]); // Bottom Left corner
			l.push([d.functions[i].x-20-hull_offset, d.functions[i].y+65]); // Center Left 
			l.push([d.functions[i].x-hull_offset, d.functions[i].y+112+hull_offset]); // Top Left corner
			l.push([d.functions[i].x+120+hull_offset, d.functions[i].y-hull_offset]); // Bottom Right corner
			l.push([d.functions[i].x+120+hull_offset, d.functions[i].y+112+hull_offset]); // Top Right corner
			l.push([d.functions[i].x+140+hull_offset, d.functions[i].y+65]); // Center Right 
			l.push([d.functions[i].x+70, d.functions[i].y-hull_offset*2]); // Center Top 
			l.push([d.functions[i].x+70+hull_offset, d.functions[i].y+112+hull_offset*2]); // Center Bottom 		
		}			
	}
	return l;
}

/** Ale
 * Shows the group's functions.
 * @param textmodify_element. The element to modify. In some case it's passed to the function.
 */
function addGroupShow(id_node, textmodify_element){
//	console.log("Add group show for: ");
	if(!textmodify_element)	textmodify_element = d3.selectAll("#f_"+id_node); // The element's node.	
	if( textmodify_element.data()[0] && textmodify_element.data()[0].is_group ){ //Appends the view for the group.
		textmodify_element.append("image")
		.attr("id", "showgroupicon_"+id_node)
//XXX		.attr("id", "deleteicon_"+id_node)
		.attr("class","modifyFunction")
		.attr("xlink:href", "image/icon_eye.png")
		.attr("x", 71)
		.attr("y", -15)
		.attr("width", width_modifyimg)
		.attr("height", height_modifyimg)
		.attr("title","Show_Functions")
		.on("click", function (d){
			if(d.functions.length > 0){
				GroupShowFunctions(d, true);
				updateFRAMModel();				
			}
			else toastr.error("This groups doesn't have functions in.");
		})
		.append("title")
		.attr("x", (width_node-width_modifyimg - 50)).attr("y", 2)
		.attr("class","text")
		.text("Show the functions inside the group.");
	}
}

/** Ale
 * Returns the number of aspect for the group.
 * @param g : the group to count the aspects.
 */
function countGroupAspects(g){ 
//	console.log("Count group aspects");
	if(!g.is_group){console.log("Element passed is not a group!!"); return 0;}
	var a_tot=countGroupAspectsInOut(g, g);
	if(a_tot.inside%2==1) a_tot.inside++; //XXX In some case a_tot is odd. To FIX
	a_tot.result = a_tot.inside/2 + a_tot.out;
	return a_tot.result;
}

/** Ale
 * Returns the number of aspect for the group.
 * @param g : the group to count the aspects.
 * @param g_level : the group to check if is parent of the current function.
 */
function countGroupAspectsInOut(g, g_level){
//	console.log("Count group aspects");
	if(!g.is_group){console.log("Element passed is not a group"); return {inside:0,out:0};}
	var a_tot = {inside:0, out:0};
	for(var i in g.functions){
		if(g.functions[i].is_group){
			var ar_tot = countGroupAspectsInOut(g.functions[i], g_level);	// Group Hierarchy case.
			a_tot.inside += ar_tot.inside; a_tot.out += ar_tot.out;
		}
		else{ //Checks inside and outside aspects.
			for(var a in g.functions[i].aspects){
				var c_a = g.functions[i].aspects[a];
				if(c_a.source == g.functions[i]){
					if(c_a.target && GroupParentPresent(c_a.target, g_level)) a_tot.inside++;
					else a_tot.out++;
				}
				else if(c_a.target == g.functions[i]){
					if(c_a.source && GroupParentPresent(c_a.source, g_level)) a_tot.inside++;
					else a_tot.out++;
				}
			}
		}
	}
	return a_tot;
}

/** Ale
 * Returns the number of functions for the group.
 * @param g : the group.
 */
function countGroupFunctions(g){
//	console.log("Count group functions");
	var f_tot = 0;
	for(var i in g.functions){
		if(!g.functions[i].is_group) f_tot ++;
//		if(g.functions[i].is_group) f_tot += countGroupFunctions(g.functions[i]);	// Group Hierarchy case.
//		else f_tot ++;
	}
	return f_tot;
}

/** Ale
 * Returns the number of functions for the group.
 * @param g : the group.
 */
function countGroupTOTFunctions(g){
//	console.log("Count group functions");
	var f_tot = 0;
	for(var i in g.functions){
//		if(!g.functions[i].is_group) f_tot ++;
		if(g.functions[i].is_group) f_tot += countGroupTOTFunctions(g.functions[i]);	// Group Hierarchy case.
		else f_tot ++;
	}
	return f_tot;
}

/** Ale
 * Returns the number of groups for the group.
 * @param g : the group.
 */
function countGroupGroups(g){
//	console.log("Count group groups");
	var g_tot=0;
	for(var i in g.functions){
		if(g.functions[i].is_group){
			g_tot++;
//			g_tot += countGroupAspects(g.functions[i]);	// Group Hierarchy case.
		}
	}
	return g_tot;
}

/** Ale
 * Create the window for insert new Aspect in a group.
 * @param a_type: The aspect type.
 */
function createGroupAspectEditWindow(a_type){
	if(countGroupAspects(currentGroup) == 0) alert("First Add a Function into the Group!"); // Consistency control.
	else createAspectEditWindow(a_type, true);
}

/**Ale
 * Adds a new function in the graph and also in the group list.
 */
function GroupAddNewFunctionIntoList(add_group){
	var f_id, f_name;
	if(add_group){
		f_id = addFRAMGroup();
		f_name = "(GROUP) New Group";
	}
	else{
		f_id = addFRAMFunction();// Adds a new function.		
		f_name = "Function_"+f_id;
		
	}
	var new_checkbox ="<p><input class='checkbox' type='checkbox' id='chkbx_"+f_id+"' value='"+f_id+"' checked='checked' /> "+f_name+" </p>";
	$("#modal_Group_Add_Functions #checkboxes").prepend(new_checkbox); // Adds a new check button checked for the new function, at the top of the list.
}

/**Ale
 * Hide the group hull. Prevents to show the functions of the group.
 * @param d: the group
 * @param view: boolean that indicates if show the group or not.
 */
function GroupShowFunctions(d, view){
	if(!view){
//		console.log(" Hides the functions inside the group: "+d.name+ " -id: "+d.id);
		if( d.is_group && d.show_functions ){ 
			d.show_functions = false;
			for(var i in d.functions){
				if(d.functions[i].is_group) GroupShowFunctions(d.functions[i], view);
			}
		}
		else return;		
	}
	else{
//		console.log(" Shows the functions inside the group: "+d.name+" - id: "+d.id);
		toastr.info('Click anywhere in the Hull to Close!');
		d.show_functions = true;
		for(var i in d.functions){
			var varX=0; var varY=0;
			varX = d.x - d.functions[i].cx; varY = d.y - d.functions[i].cy;
			d.functions[i].x = d.functions[i].x + varX; d.functions[i].y = d.functions[i].y + varY;
			d.functions[i].px = d.functions[i].x; d.functions[i].py = d.functions[i].y;
			d.functions[i].cx = d.x; d.functions[i].cy = d.y;
//			console.log("F position x:"+d.functions[i].x+" y:"+d.functions[i].y+" cx:"+d.functions[i].cx+" cy:"+d.functions[i].cy+" VarX: "+varX+" VarY: "+varY);
			if(d.functions[i].is_group) updatePositionGroupElement(d.functions[i]);
			
		}
	}
}

/**Ale
 * functions that determines which node has to be focussed. Based on the group hierarchy and on the show_function flag.
 * @param d: the function to control.
 * @returns the node to focus.
 */
function highlightGroup(d){
	if( d.in_group ){
		if( !d.group.show_functions )	return highlightGroup(d.group); 
		else return d;
	} // Highlights the group.
	else return d;
}

/** Ale
 * Check the variability of the sub functions. 
 */
function checkVariability(d){
	var find_variability = false; // Checks of in the function or in the group's functions there are variability.
	if(d.is_group){ // Checks for the functions variability. If also one has a variation, displays the wave symbol.
		for(var f in d.functions){
			if(d.functions[f].is_group){
				if(checkVariability(d.functions[f])) return true;
			}
			else if((d.functions[f].TP!=-1 || d.functions[f].PP != -1 || d.functions[f].FM != 0 )){
				return true;
			}							
		}
	}
	else{
		if((d.TP!=-1 || d.PP != -1 || d.FM != 0 )){
			return true;
		}			
	}
	return false;
}

/**Ale
 * Checks if the group is empty.
 */
function isGroupEmpty(g){
	if(g.functions && g.functions.length == 0) return true; //group empty
	return false;
}

/**Ale
 * Retrieves the list of functions, also the functions in the hierarchy, for the group provided
 * @param g: the group
 * @returns {Array}: Array of functions into the group.
 */
function GroupFunctions(g){
	var g_functions = new Array;
	if(!g.is_group){g_functions.push(g); return g_functions;} // if g is not a group, returns the current functions.
	for(var i in g.functions){
		if(g.functions[i].is_group) g_functions = g_functions.concat(GroupFunctions(g.functions[i]));
		else g_functions.push(g.functions[i]);
	}
	return g_functions;
}

/**Ale
 * Functions that provide the multilabel for the groups. For example between two groups.
 * @param a: the aspect to provide the label.
 * @returns {String}: The label for the aspect.
 */
function MultiLabelForGroup(link){
	var label = "";
	if(!link.source || !link.target) return "";
	var l_s = link.source;
	if(link.source.in_group){ // Searches for the main group that contains the source.
		while(l_s.in_group && !l_s.group.show_functions) l_s = l_s.group; 
	}
	var l_t = link.target;
	if(link.target.in_group){ // Searches for the main group that contains the target.
		while(l_t.in_group && !l_t.group.show_functions) l_t = l_t.group; 		
	}
	var source_displayed, target_displayed;
	if((!l_s.in_group && !l_s.is_group) || (l_s.in_group && l_s.group.show_functions) ) source_displayed = true;
	else source_displayed = false;
	if((!l_t.in_group && !l_t.is_group) || (l_t.in_group && l_t.group.show_functions) ) target_displayed = true;
	else target_displayed = false;
	
	//Case 1 - source and target on the same group, or the same function.
	if(l_s == l_t) label = link.multilabel || link.label; //The two functions of the link are in the same group, or is the same f.
	//Case 2 - source and target are two function not in group, or in a group visualized.
	else if(source_displayed && target_displayed) label = link.multilabel || link.label;
	//Case 3 - source in group and target not
	else{
//		console.log("Source or target are in groups");
		label = GetAspectLabelForGroup(link, l_s, l_t);
	}	
	return label;
}

/**Ale
 * returns the label for links starting or ending in a group.
 * @param a: the aspect selected.
 * @param s: the source
 * @param t: the target
 */
function GetAspectLabelForGroup(a, s, t){
//	console.log("Get aspect label for group.");	
	var s_functions = new Array(), t_functions = new Array();
	var group_label = "";
	s_functions = GroupFunctions(s);
	t_functions = GroupFunctions(t);
	for(var i in s_functions){
		var fa_source; // All the aspects in s_functions where s_functions is source, for the type provided.
		fa_source = getFunctionAspects(s_functions[i], true, a.type);
		for(var j in fa_source){
			if(t_functions.includes(fa_source[j].target) ){
				group_label += ", "+fa_source[j].label;
				fa_source[j].alreadyShowed = true; // Marks the aspect as showed.
			}
		}
	}	
	if(group_label != "") group_label = group_label.substr(2); // Removes the initial , 'comma'
	return group_label;
}

/**Ale
 * Searches for a specific group as a parent of the passed function
 * @param f. the function passed
 * @param g. the group to search
 * @returns {Boolean}. found or not.
 */
function GroupParentPresent(f, g){
	if(f.group && f.group.id == g.id) return true;
	else if(f.group) return GroupParentPresent(f.group,g);
	else return false;
}

/** Ale
 * Updates the position of the elements of a group. cx, cy is the previous position for the group. px,py and x,y the position of the block.
 * @param g = the group
 * @param varX = the variation of x
 * @param varY = the variation of y
 */
function updatePositionGroupElement(g, varX, varY){
//	console.log("Update Group Elements: "+varX+" varY: "+varY+" G X:"+g.x+" Y:"+g.y );
	for(var i in g.functions){
		var varX=0; var varY=0;
		varX = g.x - g.functions[i].cx; varY = g.y - g.functions[i].cy;
		g.functions[i].x = g.functions[i].x + varX; g.functions[i].y = g.functions[i].y + varY;
		g.functions[i].px = g.functions[i].x; g.functions[i].py = g.functions[i].y;
		g.functions[i].cx = g.x; g.functions[i].cy = g.y;
		if(g.functions[i].is_group) updatePositionGroupElement(g.functions[i]);
	}
}