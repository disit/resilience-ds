/**
 * Ale: function that manages the dialog for the data specification of a group.
 */
var currentGroup; //The function edit.

/** Ale
 * Function that shows the window for edit a Group.
 * @param d
 */
function createGroupEditWindow(d)
{
	console.log("Edit Group.");
	currentGroup=d;
	var dialog = $('#modal_Group').dialog({
		resizable: false,
		height: 600,
		width: 400,
		modal: true,
		dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Ok", click: function() {
			var emptyfield=false;
			if($('#modal_Group #inputname').val() == "")
			{				
				emptyfield=true;
				$('#modal_Group #inputname').css("box-shadow", "inset 0 1px 10px red");				
			}	
			if($('#modal_Group #inputdescription').val() == "")
			{				
				emptyfield=true;
				$('#modal_Group #inputdescription').css("box-shadow", "inset 0 1px 10px red");				
			}	
			if(!emptyfield){
								
				currentGroup.name=$('#modal_Group #inputname').val();
				currentGroup.description=$('#modal_Group #inputdescription').val();
				currentGroup.color=$('#modal_Group #inputcolor').val();
				//Changes also the name for the graph node.
				d3.select("g#f_"+currentGroup.id+" .function_name").text(currentGroup.name);
				
				$('#modal_Group #inputname').val("");
				$('#modal_Group #inputdescription').val("");
				$('#modal_Group #inputcolor').val("#000000");
				
			}
			closeGroupWindow(this);
		}
		},{
			text: "Reset", click: function() {
				$('#modal_Group #inputname').val(currentGroup.name);
				$('#modal_Group #inputdescription').val(currentGroup.description);
				$('#modal_Group #inputcolor').val("#000000");
				
				$('#modal_Group #inputname').css("box-shadow", "");				
				$('#modal_Group #inputdescription').css("box-shadow", "");
			}
		}
		],
		close: function(event, ui){
			closeGroupWindow(this);
		}
	});

	$('#modal_Group #inputdescription').click(function(){this.select();})
	
	$('#modal_Group').keyup(function(e) {
		if (e.keyCode == 13) //enter
		{
			var buttons = dialog.dialog('option', 'buttons');
			buttons[0].click.apply(dialog);
		}   
	});
	
	$('#input_description_model').focusin(function(e){
		$('#div_insert_info_model').off("keyup");
	});
	
	$('#input_description_model').focusout(function(){
		$('#div_insert_info_model').keyup(function(e) {
			if (e.keyCode == 13) //enter
			{
				var buttons = dialog.dialog('option', 'buttons');
				buttons[0].click.apply(dialog);
			}   
		});
	});
	
	$("#G_tab_name #inputname").val(d.name);
	
	$("#G_tab_description #inputdescription").val(d.description);
	
	$('#modal_Group #inputcolor').val(d.color);
	
	$("#inputcolor").on("change",function(){
		console.log("Color changed for: "+d.name);
	});	
	//Ale: populates the functions list
	ShowGroupFunctions(d.functions);
	
	//Ale: populates the edit table.
	ShowGroupAspects();	
	
	GroupUpdateFunctionsNumber();
	GroupUpdateAspectNumber(); 
}

/** Ale
 * Shows the group's functions 
 */
function ShowGroupFunctions(functions){
	if(functions){
		var nFunctions = functions;
		var f_in_currentG;
		for(var i=0; i<nFunctions.length; i++){
			f_in_currentG = nFunctions[i];
			appendGroupFunctions(f_in_currentG);
		}
		
	}
}

/** Ale
 * Shows the aspects for the group.
 */
function ShowGroupAspects(){
	console.log("Shows Group aspects");
	if(currentGroup.functions){
		var all_f_in_g = GroupFunctions(currentGroup);
		var f_in_g;		
		for(var j=0; j < all_f_in_g.length; j++){
			f_in_g = all_f_in_g[j];
			if(f_in_g.aspects){	// Ale: Divides the Aspects, and adds them to the menu.
				var nAspects = f_in_g.aspects;
				var s_id=null, t_id=null, aType, type, source_name=null, target_name=null;
				for(var i=0; i<nAspects.length; i++){
					source_name = null, target_name = null;
					if(nAspects[i].source) source_name = nAspects[i].source.name;
					if(nAspects[i].target) target_name = nAspects[i].target.name;
					
					aType=nAspects[i].type;
					type=nAspects[i].type;
					if(source_name == f_in_g.name) type="Output";
					s_id=null, t_id=null;
					if(nAspects[i].source) s_id = nAspects[i].source.id;
					if(nAspects[i].target) t_id = nAspects[i].target.id;
					GroupAppendAspect(nAspects[i].label, type, source_name, target_name, nAspects[i].id, s_id, t_id, aType);
				}
			}		
		}
	}
}

/**Ale
 * Append recursively the aspect into the group.
 */
function AspectsForGroup(group){
//	console.log("Aspects for group");
	if( group.functions ){
		var f_in_g;
		for(var j=0; j < group.functions.length; j++){
			f_in_g = group.functions[j];
			if( f_in_g.is_group ) AspectsForGroup(f_in_g);
			else{ 
				// Ale: Divides the Aspects, and adds them to the menu.
				if(f_in_g.aspects){				
					var nAspects = f_in_g.aspects;
					var s_id=null, t_id=null, aType, type, source_name=null, target_name=null;
					for(var i=0; i<nAspects.length; i++){
						source_name = null, target_name = null;
						if(nAspects[i].source) source_name = nAspects[i].source.name;
						if(nAspects[i].target) target_name = nAspects[i].target.name;
						
						aType=nAspects[i].type;
						type=nAspects[i].type;
						if(source_name == f_in_g.name) type="Output";
						s_id=null, t_id=null;
						if(nAspects[i].source) s_id = nAspects[i].source.id;
						if(nAspects[i].target) t_id = nAspects[i].target.id;
						GroupAppendAspect(nAspects[i].label, type, source_name, target_name, nAspects[i].id, s_id, t_id, aType);
					}
				}					
			}
		}
	}
}

/** Ale
 * Updates the number of functions.
 */
function GroupUpdateFunctionsNumber(){
	if(currentGroup.functions){
//		$("#modal_Group #Functions_number").text(currentGroup.functions.length);		 
		$("#modal_Group #Functions_number").text(countGroupFunctions(currentGroup));
		$("#modal_Group #Groups_number").text(countGroupGroups(currentGroup));
	}	
}

/** Ale
 * updates the aspect number for the group.
 */
function GroupUpdateAspectNumber(){
	var C_I=0, C_O=0, C_R=0, C_T=0, C_P=0, C_C=0;
	var i_type;
	var f_in_group;
	var all_f_in_g = GroupFunctions(currentGroup);
	for(var j=0; j < all_f_in_g.length; j++){
		f_in_group = all_f_in_g[j];
		for(var i=0; i < f_in_group.aspects.length; i++){
			i_type = f_in_group.aspects[i].type;
			if(f_in_group.aspects[i].source){
				if(f_in_group.aspects[i].source.id == f_in_group.id) i_type = "Output";
			}
			switch(i_type){
			case "Input":
				C_I++;
				break;
			case "Output":
				C_O++;
				break;
			case "Resource":
				C_R++;
				break;
			case "Control":
				C_C++;
				break;
			case "Time":
				C_T++;
				break;
			case "Precondition":
				C_P++;
				break;
			}		
		}
	}
	$("#modal_Group #Input_number").text(C_I);
	$("#modal_Group #Output_number").text(C_O);
	$("#modal_Group #Precondition_number").text(C_P);
	$("#modal_Group #Resource_number").text(C_R);
	$("#modal_Group #Time_number").text(C_T);
	$("#modal_Group #Control_number").text(C_C);
	$("#modal_Group #Aspects_number").text(function(){
		var asp_number = countGroupAspects(currentGroup);
		return ""+asp_number;
	});
}

/** Ale 
 * Function that appends the aspects in the list.
 */
function GroupAppendAspect(label, type, source_name, target_name, aspectId, s_id, t_id, aType){
	console.log("Adds aspect in the Group: "+label);
	var field = $("#G_F_tab_aspects .default_field");
	new_row=field[0].cloneNode(true);
	new_row.style.display="inherit";
	new_row.classList.add("Afield");
	new_row.setAttribute("a_id",aspectId);
	new_row.setAttribute("a_type",type);
	new_row.setAttribute("a_type_in_input",aType); //The type in input, if present.
	new_row.setAttribute("a_t",t_id);
	new_row.setAttribute("a_s",s_id);
	var textField=label+" ("+aType+")- Source: ";
	
	if(source_name)textField+=source_name+" - Target: ";
	else textField+="Not Defined - Target: ";
	
	if(target_name)textField+=target_name;
	else textField+="Not Defined ";
	new_row.getElementsByClassName("F_name")[0].textContent=textField;
	
	$("#G_F_list_"+type).prepend(new_row);
	
	GroupUpdateAspectNumber(); // Updates the aspect number.
}

/**Ale
 * Removes the aspect selected. 
 */ 
function GroupRemoveAspect(event){
	console.log("Remove the aspect selected from the Function in the current Group.");
	// Retrieves the id of the aspect and calls the function that deletes the aspect.
	var AIdtoDelete = event.target.parentElement.getAttribute("a_id");
	var A_source = event.target.parentElement.getAttribute("a_s");
	var A_target = event.target.parentElement.getAttribute("a_t");
	var A_type = event.target.parentElement.getAttribute("a_type_in_input");
	if(A_source == "undefined") A_source = "null";
	if(A_target == "undefined") A_target = "null";
	undo.saveOp("a_delete", null, find_aspect(AIdtoDelete, A_source, A_target, A_type)[0]);
	deleteAspect(AIdtoDelete, A_source, A_target, A_type);
	// Removes the line from the menu.
	event.target.parentElement.remove();
	
	GroupUpdateAspectNumber(); //updates the aspect number.
}

/**Ale 
 * Functions that add the functions in the list.
 */
function appendGroupFunctions(f_in_currentG){
	console.log("Adds function: "+f_in_currentG.id);
	var field = $("#modal_Group #G_functions_list .default_function_field");
	new_row = field[0].cloneNode(true);
	new_row.style.display="inherit";
	new_row.classList.add("Ffield");
	new_row.setAttribute("f_id",f_in_currentG.id);
	new_row.setAttribute("g_id",currentGroup.id);
	var pre_text ="- ", post_text="";
	//	var g_in_functions = 0;
//	var g_in_groups = 0;
	if(f_in_currentG.is_group){
		pre_text+="(GROUP) ";
		new_row.style.color = "blue"; // Sets the color of the group.
//		new_row.style.color = f_in_currentG.color; // Sets the color of the group.
	}
	var textField = f_in_currentG.name;

	new_row.getElementsByClassName("F_name")[0].textContent = pre_text+textField+post_text;
	
	$("#modal_Group #Group_F_list").prepend(new_row);
	
	GroupUpdateAspectNumber();
}

/** Ale
 * Modifies the aspect selected.
 */
function modifyGroupAspect(event) {
	console.log("Modifies the aspect selected.");

	var a_type = event.target.parentElement.getAttribute("a_type");
	var a_id = event.target.parentElement.getAttribute("a_id");
	var a = aspects.filter(function(d){return d.id==a_id;});
	if(a.length>0) a=a[0];
	
	var s_id = event.target.parentElement.getAttribute("a_s");
	var source = nodes.filter(function(d){return d.id==s_id;});
	if(source.length>0) source=source[0];
	
	var t_id = event.target.parentElement.getAttribute("a_t");
	var target = nodes.filter(function(d){return d.id==t_id;});
	if(target.length>0) target=target[0];
	//Finds the source in the group.
	var g_s_id = event.target.parentElement.getAttribute("a_g_s");
	var g_source = nodes.filter(function(d){return d.id==g_s_id;});
	if(g_source.length>0) g_source = g_source[0];
	//Finds the target in the group.
	var g_t_id = event.target.parentElement.getAttribute("a_g_t");
	var g_target = nodes.filter(function(d){return d.id==g_t_id;});
	if(g_target.length>0) g_target = g_target[0];	
	
	//TODO modify the multi-label.
	
	//Edits the aspect selected.
	modifyAspectEditWindow(a, a_type, source, target, g_source, g_target, true);
}

/** Ale XXX already present
 * Adds a new FRAM function to the model.
 */
function addFRAMFunction(name){
	console.log("Adds a FRAM's function to the current model");
	
	var Fname;
	if(name) Fname = name;
	var new_id = computeNewFunction(null, Fname);
	undo.saveOp("f_create", new_id);
	updateFRAMModel();
	addFunctionTextModify(new_id); //Adds the edit and delete button over the graph's node (file: text_modify.js)
	return new_id;
}

//Functions that reset all the parameters to the default values when closing this window.
function closeGroupWindow(Fwindow){
	$('#modal_Group #inputname').val("");
	$('#modal_Group #inputdescription').val("");
	//Empties the lists.
		
	$('#modal_Group .Ffield').remove();
	$('.Afield').remove();
	
	$(Fwindow).dialog('destroy');
	
	updateFRAMModel();
}

/** Ale
 * Removes the function from the group.
 */
function removeFunctionFromGroup(event){
	console.log("Remove the aspect selected.");
	// Retrieves the id of the aspect and calls the function that deletes the aspect.
	var FIdtoDelete;
	if(event) FIdtoDelete = event.target.parentElement.getAttribute("f_id");
	else FIdtoDelete = event.target.parentElement.getAttribute("f_id");
	var GId = currentGroup.id;
	removeFunctionNodeFromGroupNode(FIdtoDelete, GId);
	undo.saveOp("g_removeFunction", FIdtoDelete, null, GId);
	
	updateFRAMModel();
	// undo.saveOp("a_delete", null, find_aspect(AIdtoDelete, A_source, A_target, A_type)[0]); TODO undo operation for add on a group.
	
	// Removes the line from the menu.
	event.target.parentElement.remove();
	GroupUpdateFunctionsNumber(); // Updates the function number.
	$('.Afield').remove();
	ShowGroupAspects(); //updates the aspect list
}

/** Ale
 * Adds a FRAM group of Functions.
 * @param name: the name of the group.
 * @returns new_id: the new id of the group
 */
function addFRAMGroup(name){
	console.log("Adds a FRAM's group into the current model");	
	var Gname;
	if(name) Gname = name;
	var new_id = computeNewGroup(null, Gname);
	undo.saveOp("f_create", new_id);
	updateFRAMModel();
	addFunctionTextModify(new_id); // Adds the edit and delete button over the graph's node (file: text_modify.js)
	return new_id;
}

function CreateDeleteDialogGroup(d){
	var dialog = $('#modal_Group_Delete').dialog({
		resizable: false,
		height: 100,
		width: 400,
		modal: true,
		dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Yes", click: function() {
			$(this).dialog('destroy');
			deleteGroup(d, true);
		}
		},{
			text: "No", click: function() {
				$(this).dialog('destroy');
				deleteGroup(d, false);
			}
		}
		],
		close: function(event, ui){			
			$(this).dialog('destroy');
		}
	});
}

function UpdateDialogGroup(){ //Re-populates the dialog of a group.
	$('#modal_Group .Ffield').remove();
	$('.Afield').remove();
	
	//Ale: populates the functions list
	ShowGroupFunctions(currentGroup.functions);
	
	//Ale: populates the edit table.
	ShowGroupAspects();	
	
	GroupUpdateFunctionsNumber();
	GroupUpdateAspectNumber(); 
}