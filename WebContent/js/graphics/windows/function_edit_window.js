/**
 * Ale: function that manages the dialog for the data specification of a function.
 */
var currentFunction; //The function edit.

function createFunctionEditWindow(d)
{
	currentFunction = d;
	var dialog = $('#modal_Function').dialog({
		resizable: false,
		height: 600,
		width: 400,
		modal: true,
		dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Ok", click: function() {
			var emptyfield=false;
			if($('#modal_Function #inputname').val() == "")
			{				
				emptyfield=true;
				$('#modal_Funciton #inputname').css("box-shadow", "inset 0 1px 10px red");				
			}	
			if($('#modal_Function #inputdescription').val() == "")
			{				
				emptyfield=true;
				$('#modal_Function #inputdescription').css("box-shadow", "inset 0 1px 10px red");				
			}	
			if(!emptyfield){
								
				currentFunction.name=$('#modal_Function #inputname').val();
				currentFunction.description=$('#modal_Function #inputdescription').val();
				currentFunction.color=$('#modal_Function #inputcolor').val();
				// Changes also the name for the graph node.
				d3.select("g#f_"+currentFunction.id+" .function_name").text(currentFunction.name);
				
				$('#modal_Function #inputname').val("");
				$('#modal_Function #inputdescription').val("");
				$('#modal_Function #inputcolor').val("#000000");
				
			}
			closeFunctionWindow(this);
		}
		},{
			text: "Reset", click: function() {
				$('#modal_Function #inputname').val(currentFunction.name);
				$('#modal_Function #inputdescription').val(currentFunction.description);
				$('#modal_Function #inputcolor').val("#000000");
				
				$('#modal_Function #inputname').css("box-shadow", "");				
				$('#modal_Function #inputdescription').css("box-shadow", "");
			}
		}
		],
		close: function(event, ui){
			closeFunctionWindow(this);
		}
	});

	$('#modal_Function #inputdescription').click(function(){this.select();})
	
	$('#modal_Function #F_tab_name').keyup(function(e) {
		if (e.keyCode == 13) //enter
		{
			var buttons = dialog.dialog('option', 'buttons');
			buttons[0].click.apply(dialog);
		}   
	});
	
	$('#modal_Function #input_description_model').focusin(function(e){
		$('#div_insert_info_model').off("keyup");
	});
	
	$('#modal_Function #input_description_model').focusout(function(){
		$('#div_insert_info_model').keyup(function(e) {
			if (e.keyCode == 13) //enter
			{
				var buttons = dialog.dialog('option', 'buttons');
				buttons[0].click.apply(dialog);
			}   
		});
	});
	
	$("#modal_Function #F_tab_name #inputname").val(d.name);
	
	$("#modal_Function #F_tab_description #inputdescription").val(d.description);
	
	ShowFunctionAspects(d.aspects);	
	
	$('#modal_Function #inputcolor').val(d.color);
	
	$("#modal_Function #inputcolor").on("change",function(){
		console.log("Color changed for: "+d.name);
	});		
	updateAspectNumber();
}

/** Ale
 * Shows function aspects
 */
function ShowFunctionAspects(f_aspects){	
	//Ale: populates the edit table.
	if(f_aspects){
		//Ale: Divides the Aspects, and adds them to the menu.
		var nAspects = f_aspects;
		var s_id=null, t_id=null, aType, type, source_name=null, target_name=null;
		for(var i=0; i < nAspects.length; i++){
			source_name = null, target_name = null;
			if(nAspects[i].source) source_name = nAspects[i].source.name;
			if(nAspects[i].target) target_name = nAspects[i].target.name;
			
			aType = nAspects[i].type;
			type = nAspects[i].type;
			if(source_name == currentFunction.name) type="Output";
			s_id = null, t_id = null;
			if(nAspects[i].source) s_id = nAspects[i].source.id;
			if(nAspects[i].target) t_id = nAspects[i].target.id;
			FunctionAppendAspect(nAspects[i].label, type, source_name, target_name, nAspects[i].id, s_id, t_id, aType);
		}
	}
}

/** Ale
 * updates the aspect number.
 */
function updateAspectNumber(){
	var C_I=0, C_O=0, C_R=0, C_T=0, C_P=0, C_C=0;
	var i_type;
	for(var i=0; i < currentFunction.aspects.length; i++){
		i_type = currentFunction.aspects[i].type;
		if(currentFunction.aspects[i].source){
			if(currentFunction.aspects[i].source.id == currentFunction.id) i_type = "Output";
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
	$("#modal_Function #Input_number").text(C_I);
	$("#modal_Function #Output_number").text(C_O);
	$("#modal_Function #Precondition_number").text(C_P);
	$("#modal_Function #Resource_number").text(C_R);
	$("#modal_Function #Time_number").text(C_T);
	$("#modal_Function #Control_number").text(C_C);
	$("#modal_Function #Aspects_number").text(currentFunction.aspects.length);
}

/** Ale 
 * Function that appends the aspects in the list.
 */
function FunctionAppendAspect(label, type, source_name, target_name, aspectId, s_id, t_id, aType){
	console.log("Adds aspect: "+label);
	var field = $("#modal_Function #F_tab_aspects .default_field");
	new_row=field[0].cloneNode(true);
	new_row.style.display="inherit";
	new_row.classList.add("Afield");
	new_row.setAttribute("a_id",aspectId);
	new_row.setAttribute("a_type",type);
	new_row.setAttribute("a_type_in_input",aType);//The type in input, if present.
	new_row.setAttribute("a_s",s_id);
	new_row.setAttribute("a_t",t_id);
	var textField=label+" ("+aType+")- Source: ";
	
	if(source_name)textField+=source_name+" - Target: ";
	else textField+="Not Defined - Target: ";
	
	if(target_name)textField+=target_name;
	else textField+="Not Defined ";
	new_row.getElementsByClassName("F_name")[0].textContent=textField;
	
	$("#modal_Function #F_list_"+type).prepend(new_row);
	
	updateAspectNumber();
}

//Ale: Removes the aspect selected.
function removeAspect(){
	console.log("Remove the aspect selected.");
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
	updateAspectNumber(); //updates the aspect number.
}

/** Ale
 * Modifies the aspect selected.
 */
function modifyAspect(){
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
	//TODO modify the multi-label.
	
	//Edits the aspect selected.
	modifyAspectEditWindow(a, a_type, source, target);
}

/** Ale 
 * Adds a new FRAM function to the model.
 */
function addFRAMFunction(name){
	console.log("Adds a FRAM's function to the current model");
	
	var Fname;
	if(name) Fname = name;
	var new_id = computeNewFunction(null, Fname);
	undo.saveOp("f_create", new_id);
	updateFRAMModel();
	addFunctionTextModify(new_id); // Adds the edit and delete button over the graph's node (file: text_modify.js)
	return new_id;
}

//Functions that reset all the parameters to the default values when closing this window.
function closeFunctionWindow(Fwindow){
	$('#modal_Function #inputname').val("");
	$('#modal_Function #inputdescription').val("");
	
	$('#modal_Function .Afield').remove();
	
	$(Fwindow).dialog('destroy');
	
	updateFRAMModel();
}