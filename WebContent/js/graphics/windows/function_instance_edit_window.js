/**
 * Ale: function that manages the dialog for the data specification of an aspect. 
 * Creation and Modification.
 */
var currentFunction; //The function edited.
var currentGroup; // The group edited.

function createFunctionInstanceEditWindow(FI)
{
	console.log("Edit Function Instance: "+FI);
	currentFunction = FI;
	
	var dialog = $('#modal_Instance').dialog({
		resizable: false,
		height: 300,
		width: 400,
		modal: true,
		dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Ok", click: function() {
			//Ale: Adds the aspect to the nodes source and target. And in the previous table.
			var changes = false;
			if(currentFunction.FM != $("#modal_Instance #inputtype").val()){ currentFunction.FM = $("#modal_Instance #inputtype").val(); changes = true;}
			if(currentFunction.TP != $("#modal_Instance #inputtp").val()){ currentFunction.TP = $('#modal_Instance #inputtp').val(); changes = true; }
			if(currentFunction.PP != $("#modal_Instance #inputpp").val()){ currentFunction.PP = $('#modal_Instance #inputpp').val(); changes = true; }
						
			if(changes){
				modelinstancenotsaved_update();	//Saves temporary the model.
				updateFRAMModel(); //Updates the graph.
			}
			createFunctionInstanceWindowClosed(this);			
		}
		},{
			text: "Reset", click: function() {				
				$('#modal_Instance #inputtype')[0].selectedIndex=0;
				$('#modal_Instance #inputtp')[0].selectedIndex=0;
				$('#modal_Instance #inputpp')[0].selectedIndex=0;				
			}
		}
		],
		close:  function(event, ui){
			closeInstanceWindow(this);
		}
	});	
	
	//Sets the select parameters.
	$("#modal_Instance #inputtype").val(currentFunction.FM);
	$('#modal_Instance #inputtp').val(currentFunction.TP);
	$('#modal_Instance #inputpp').val(currentFunction.PP);
	
	$('#modal_Instance').keyup(function(e) {
		console.log("KeyUp;")
		if (e.keyCode == 13) //enter
		{
			var buttons = dialog.dialog('option', 'buttons');
			buttons[0].click.apply(dialog);
		}   
	});
}

/** Ale: Changes the values for the instances. 
 * 
 */
function createFunctionInstanceWindowClosed(Idialog){
	
	//Closes the current window
	closeInstanceWindow(Idialog);
}
//Ale: Closes the windows.
function closeInstanceWindow(Idialog){	
	$('#modal_Instance #inputtype')[0].selectedIndex=0;
	$('#modal_Instance #inputtp')[0].selectedIndex=0;
	$('#modal_Instance #inputpp')[0].selectedIndex=0;
	
	$(Idialog).dialog('destroy');
}

/**Ale:
 * Create the edit window for a group instance.
 * It shows the list of function for the model, that could be edited, in terms of variability.
 * @param GI: Current Group edited.
 */
function createGroupInstanceEditWindow(GI){
	console.log("Edit Group Instance: "+GI);
	currentGroup = GI;
	
	var dialog = $('#modal_GroupInstance').dialog({
		resizable: false,
		height: 300,
		width: 400,
		modal: true,
		dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Ok", click: function() {
			// Ale: Adds the aspect to the nodes source and target. And in the previous table.
			closeGroupInstanceWindow(this);			
		}
		}
		],
		close:  function(event, ui){
			closeGroupInstanceWindow(this);
		}
	});	
	
	$("#modal_GroupInstance #G_name").text(currentGroup.name);
	$("#modal_GroupInstance #G_description").text(currentGroup.description);
//	$("#modal_GroupInstance #Functions_number").text(currentGroup.functions.length);  
	$("#modal_GroupInstance #Functions_number").text(countGroupFunctions(currentGroup));
	$("#modal_GroupInstance #Groups_number").text(countGroupGroups(currentGroup));
	// Populates the list of function in the group
//	var f_list="";
//	if(currentGroup.functions.length == 0) f_list += "No functions present in this group."
	var g_functions = GroupFunctions(currentGroup);
	for(var i in g_functions ){
		if(!g_functions[i].is_group){
			
			console.log("Adds function: "+g_functions[i].id);
			var field = $("#modal_GroupInstance #G_functions_list .default_function_field");
			new_row=field[0].cloneNode(true);
			new_row.style.display="inherit";
			new_row.classList.add("Ffield");
			new_row.setAttribute("f_id",g_functions[i].id);
			new_row.setAttribute("g_id",currentGroup.id);
			var textField=g_functions[i].name;
			new_row.getElementsByClassName("F_name")[0].textContent = textField;
			
			$("#modal_GroupInstance #Group_F_list").prepend(new_row);	
		}
	}
}

/** Ale
 * Edit the selected groups's function's variability.
 */
function editGroupFunctionVariability(event){
	var f_selected = event.target.parentElement.getAttribute("f_id"); //Recovers the function selected.
	console.log("Edit the function varibaility of: "+f_selected);
	var f_to_edit = nodes.filter(function(d){return d.id == f_selected;});
	if(f_to_edit.length > 0) f_to_edit = f_to_edit[0];
	createFunctionInstanceEditWindow(f_to_edit); 
	console.log("Finish editing function.");
}

// Ale: Closes the group instance edit windows.
function closeGroupInstanceWindow( Idialog ){	
	delete(currentFunction);
	$('#modal_GroupInstance .Ffield').remove();

	$("#modal_GroupInstance #G_name").text("No Name found");
	$("#modal_GroupInstance #G_description").text("No Description found");
	
	$( Idialog ).dialog('destroy');
}