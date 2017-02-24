/**
 * Ale: function that manages the pop up menu for export a model.
 */
function createExportWindow()
{
	// Checks if the model is saved and if there are functions with output and inputs.
	var display_dialog = true;
	var index = util.getIndexById(models_notsaved, modelId);
	if(index!=-1){
		display_dialog = false;
		showAlert(" Save the model before export! ");
	}
	var f_list = getFunctionsWithOutputAndInput();
	if(f_list.length == 0){
		display_dialog = false;
		showAlert(" In this model there isn't a Function with at least one Output and one Input");	
	}	
	if(!display_dialog)	return; // Doesn't show the window.	
	
	var dialog = $('#div_insert_export_model').dialog({
		resizable: false,
		height: 400,
		width: 400,
		modal: true,
		dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Ok", click: function() {
			//Checks if there is an output selected.
			var Oid_selected = parseInt( $('#div_insert_export_model #listoutputs').val() );
			if( Oid_selected != -1 ){
				console.log(" Output id selected: "+Oid_selected );
				clientRest.exportFRAMModel(Oid_selected); // Export the functions to the Server!
				introExportFRAMModelWindowClosed(this);
			}
			else toastr.error("Please Select a Function's Output first!");
		}
		},{
			text: "Reset", click: function() {
				$('#div_insert_export_model #listfunctions')[0].selectedIndex = -1;
				
				var selectList = $('#div_insert_export_model #listoutputs')[0];
				for(var i=selectList.length; i>0; i--){
					selectList.remove(i-1);
				}
				$('#div_insert_export_model #functions_output').css("display","none");
			}
		}
		],
		close: function(event, ui){
			introExportFRAMModelWindowClosed(this);
		}
	});
	
	// Adds the functions in to the select box.
	var options = "<option value='-1'></option>";
	for(var f in f_list){
		options +="<option value='"+f_list[f].id+"'>"+f_list[f].name +"</option>";
	}
	$("#div_insert_export_model #listfunctions").append(options);
	
	$("#div_insert_export_model #listfunctions").change(function(){
		console.log("Change for the list");
		createExportFunctionOutputs();		
	});	
}

/**Ale:
 * Creates the options for the outputs list of the function.
 */
function createExportFunctionOutputs(){
	// Creates the select box for choose the output.
	var selected_id;
	selected_id = parseInt( $("#div_insert_export_model #listfunctions").val() );
	console.log("Function's id selected: "+selected_id);
	var selectList = $('#div_insert_export_model #listoutputs')[0];
	for(var i=selectList.length; i>0; i--){
		selectList.remove(i-1);
	}
	if(selected_id==-1){$('#div_insert_export_model #functions_output').css("display","none"); return;}
	var f_list = getFunctionsWithOutputAndInput();
	var f_selected = f_list.filter(function(d){return d.id == selected_id;});
	f_selected = f_selected[0];
	var options = "";
	var f_aspects = getFunctionUniqueAspects(f_selected, true);
	for(var o in f_aspects){
		options +="<option value='"+f_aspects[o].id+"'>"+f_aspects[o].label+"</option>";
	}
	//Removes previous options and displays the list.
	$('#div_insert_export_model #functions_output').css("display","inherit");
	$("#div_insert_export_model #listoutputs").append(options);
}

/**Ale:
 * Gets the not duplicated aspects for the function passed.
 */
function getFunctionUniqueAspects(f, source){
	var a_list = new Array();
	if(!f.aspects) return a_list;
	for(var a in f.aspects){
		if(a_list.filter(function(d){return d.id == f.aspects[a].id;}).length == 0 && ((source && f.aspects[a].source && f.aspects[a].source.id == f.id )||(!source && f.aspects[a].target && f.aspects[a].target.id == f.id))) a_list.push(f.aspects[a]);
	}
	return a_list;
}

/** Ale:
 * function that close the window for export a model.
 * @param dialog: the window.
 */
function introExportFRAMModelWindowClosed(Edialog){
	var selectList = $('#div_insert_export_model #listfunctions')[0];
	for(var i=selectList.length; i>0; i--){
		selectList.remove(i-1);
	}
	
	$('#div_insert_export_model #functions_output').css("display","none");
	selectList = $('#div_insert_export_model #listoutputs')[0];
	for(var i=selectList.length; i>0; i--){
		selectList.remove(i-1);
	}

	$(Edialog).dialog('destroy');
}

/**Ale
 * Return a list of functions that have at least one output and one input different from itself.
 * @returns {Array} list of functions.
 */
function getFunctionsWithOutputAndInput(){
	var f_list = new Array();
	for(var f in nodes){
		if(nodes[f].aspects){
			var current_f = nodes[f];
			var count_o = 0; count_i = 0;
			for(var a in current_f.aspects){
				if(current_f.aspects[a].target && current_f.aspects[a].target.id == current_f.id) count_i++; //Input for the function
				if(current_f.aspects[a].source && current_f.aspects[a].source.id == current_f.id ) count_o++;//output for the function
				if(count_i>0 && count_o>0) break;
			}
			if(count_i>0 && count_o>0) f_list.push(current_f);
		}
	}
	return f_list;
}