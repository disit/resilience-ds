/**
 * Ale: function that manages the dialog for the data specification of a function.
 */
var currentFunction; //The function edit.
var currentGroup; //The function edit.

function createFunctionInfoWindow(d)
{
	currentFunction = d;
	currentGroup = d;
	var dialog = $('#modal_Function_Info').dialog({
		resizable: false,
		height: 600,
		width: 400,
		modal: true,
		dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Ok", click: function() {
			closeFunctionInfoWindow(this);
		} }
		],
		close: function(event, ui){
			closeFunctionInfoWindow(this);
		}
	});

	$("#modal_Function_Info #F_tab_name #inputname").val(d.name);
	
	$("#modal_Function_Info #F_tab_description #inputdescription").val(d.description);	
	
	$('#modal_Function_Info #inputcolor').val(d.color);	
	
	// Handles the case of Group
	if(d.is_group){
		$("#modal_Function_Info #G_functions_list").css("display","inherit"); // Updates the information.
		//Ale: populates the functions list
		ShowGroupFunctionsInfo(d.functions);
		
		//Ale: populates the edit table.
		ShowGroupAspectsInfo();	
		
		GroupUpdateFunctionsNumberInfo();
		GroupUpdateAspectNumberInfo();
	}
	else{
		ShowFunctionAspectsInfo(d.aspects);	
		updateAspectNumberInfo();		
	}
}

/** Ale:
 * Shows function aspects
 */
function ShowFunctionAspectsInfo(f_aspects){	
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
			FunctionAppendAspectInfo(nAspects[i].label, type, source_name, target_name, nAspects[i].id, s_id, t_id, aType);
		}
	}
}

/** Ale:
 * updates the aspect number.
 */
function updateAspectNumberInfo(){
	var C_I=0, C_O=0, C_R=0, C_T=0, C_P=0, C_C=0;
	var i_type;
	for(var i=0; i < currentFunction.aspects.length; i++){
		i_type = currentFunction.aspects[i].type;
		if(currentFunction.aspects[i].source){
			if(currentFunction.aspects[i].source.id == currentFunction.id) i_type = "Output";
		}
		switch(i_type){
		case "Input":
			C_I++;			break;
		case "Output":
			C_O++; 			break;
		case "Resource":
			C_R++;			break;
		case "Control":
			C_C++;			break;
		case "Time":
			C_T++;			break;
		case "Precondition":
			C_P++;			break;
		}		
	}
	$("#modal_Function_Info #Input_number").text(C_I);
	$("#modal_Function_Info #Output_number").text(C_O);
	$("#modal_Function_Info #Precondition_number").text(C_P);
	$("#modal_Function_Info #Resource_number").text(C_R);
	$("#modal_Function_Info #Time_number").text(C_T);
	$("#modal_Function_Info #Control_number").text(C_C);
	$("#modal_Function_Info #Aspects_number").text(currentFunction.aspects.length);
}

/** Ale: 
 * Function that appends the aspects in the list.
 */
function FunctionAppendAspectInfo(label, type, source_name, target_name, aspectId, s_id, t_id, aType){
	console.log("Adds aspect: "+label);
	var field = $("#modal_Function_Info #F_tab_aspects .default_field");
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
	
	$("#modal_Function_Info #F_list_"+type).prepend(new_row);
	
	updateAspectNumberInfo();
}

/** Ale:
 * Shows the group's functions 
 */
function ShowGroupFunctionsInfo(functions){
	if(functions){
		var nFunctions = functions;
		var f_in_currentG;
		for(var i=0; i<nFunctions.length; i++){
			f_in_currentG = nFunctions[i];
			appendGroupFunctionsInfo(f_in_currentG);
		}		
	}
}

/** Ale:
 * Shows the aspects for the group.
 */
function ShowGroupAspectsInfo(){
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
function GroupUpdateFunctionsNumberInfo(){
	if(currentGroup.functions){
//		$("#modal_Function_Info #Functions_number").text(currentGroup.functions.length);		 
		$("#modal_Function_Info #Functions_number").text(countGroupFunctions(currentGroup));
		$("#modal_Function_Info #Groups_number").text(countGroupGroups(currentGroup));
	}	
}

/** Ale
 * updates the aspect number for the group.
 */
function GroupUpdateAspectNumberInfo(){
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
	$("#modal_Function_Info #Input_number").text(C_I);
	$("#modal_Function_Info #Output_number").text(C_O);
	$("#modal_Function_Info #Precondition_number").text(C_P);
	$("#modal_Function_Info #Resource_number").text(C_R);
	$("#modal_Function_Info #Time_number").text(C_T);
	$("#modal_Function_Info #Control_number").text(C_C);
	$("#modal_Function_Info #Aspects_number").text(function(){
		var asp_number = countGroupAspects(currentGroup);
		return ""+asp_number;
	});
}

/** Ale 
 * Function that appends the aspects in the list.
 */
function GroupAppendAspect(label, type, source_name, target_name, aspectId, s_id, t_id, aType){
//	console.log("Adds aspect in the Group: "+label);
	var field = $("#modal_Function_Info #F_tab_aspects .default_field");
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
	$("#modal_Function_Info  #F_tab_"+type.toLowerCase()+"s").append(new_row);
	
	GroupUpdateAspectNumberInfo(); // Updates the aspect number.
}

/**Ale 
 * Functions that add the functions in the list.
 */
function appendGroupFunctionsInfo(f_in_currentG){
	console.log("Adds function: "+f_in_currentG.id);
	var field = $("#modal_Function_Info #G_functions_list .default_function_field");
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
	
	$("#modal_Function_Info #Group_F_list").prepend(new_row);
	
	GroupUpdateAspectNumberInfo();
}

// Functions that reset all the parameters to the default values when closing this window.
function closeFunctionInfoWindow(Fwindow){
	$('#modal_Function_Info #inputname').val("");
	$('#modal_Function_Info #inputdescription').val("");
	
	$('#modal_Function_Info .Ffield').remove();
	$('#modal_Function_Info .Afield').remove();
	
	$("#modal_Function_Info #G_functions_list").css("display","none");
	
	$(Fwindow).dialog('destroy');
	
	updateFRAMModel();
}