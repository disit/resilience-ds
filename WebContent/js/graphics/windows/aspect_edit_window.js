var group_aspect = false;

/**
 * Ale: function that manages the dialog for the data specification of an aspect. 
 * Creation and Modification.
 * @param aType: the type of aspect to add.
 * @param for_group: a flag that indicates if is an aspect for a group. In that case we have to check if the function is one of the group.
 */
function createAspectEditWindow(aType, for_group)
{
//	console.log("Edit Aspect "+aType);
	if(for_group) group_aspect = true;
	else group_aspect = false;
	var dialog = $('#modal_Aspect').dialog({
		resizable: false,
		height: 400,
		width: 400,
		modal: true,
		dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Ok", click: function() {
			var empty_fields=false;
			if($('#modal_Aspect #inputname').val() == ""){
				empty_fields=true;
				$('#modal_Aspect #inputname').css("box-shadow", "inset 0 1px 10px red");
			}
			if(!empty_fields){				
				//Ale: Adds the aspect to the nodes source and target. And in the previous table.
				var Aname = $('#modal_Aspect #inputname').val();
				createAspectWindowClosed($('#modal_Aspect #inputname').val(), aType, $('#modal_Aspect #inputsource').val(), $('#modal_Aspect #inputtarget').val(), this);
			}			
		}
		},{
			text: "Reset", click: function() {
				
				$('#modal_Aspect #inputname').val("");
				$('#modal_Aspect #inputsource').val("");
				$('#modal_Aspect #inputtarget').val("");
				
				$('#modal_Aspect #inputname').css("box-shadow", "");
				$('#modal_Aspect #inputsource').css("box-shadow", "");
				$('#modal_Aspect #inputtarget').css("box-shadow", "");
								
				$('#modal_Aspect #A_tab_source #F_select')[0].selectedIndex = -1;
				$('#modal_Aspect #A_tab_target #F_select')[0].selectedIndex = -1;
				$('#modal_Aspect #A_G_option #G_F_select')[0].selectedIndex = 0;
				$('#modal_Aspect #A_tab_target #Ftype_select')[0].selectedIndex=0;
				
			}
		}
		],
		close:  function(event, ui){
			closeAspectWindow(this);
		}
	});

	$('#modal_Aspect').keyup(function(e) {
		if (e.keyCode == 13) //enter
		{
			var buttons = dialog.dialog('option', 'buttons');
			buttons[0].click.apply(dialog);
		}   
	});
	//Ale: enable\disable the select.
	if(aType=="Output"){
		$("#modal_Aspect #A_tab_source")[0].style.display="none";
		
		$("#modal_Aspect #A_tab_target")[0].style.display="inherit";
	}
	else{
		$("#modal_Aspect #A_tab_target")[0].style.display="none";
		
		$("#modal_Aspect #A_tab_source")[0].style.display="inherit";
	}
	
	$('#modal_Aspect #A_tab_target #F_select, #A_tab_source #F_select').change(function(){ 
//		console.log("Change option");
		if(aType=="Output"){			
			var val = $("#modal_Aspect #A_tab_target #F_select option:selected").text();
			$('#modal_Aspect #inputtarget').val(val);
		}
		else{
			var val = $("#modal_Aspect #A_tab_source #F_select option:selected").text();
			$('#modal_Aspect #inputsource').val(val);
		}
	});
	
	$('#modal_Aspect #A_select').change(function(){ $('#modal_Aspect #inputname').val($("#modal_Aspect #A_select option:selected").text()); });
	
	if(group_aspect){ // Shows the select input for chose the function in the group
		d3.selectAll("#modal_Aspect #A_G_option").style("display","inherit"); // Shows the select options.
		// Populates with the function in the group.
		createGroupOptions(aType);
		CreateGroupAspectOption(aType); //Unlike CreateAspectOption, this function Makes some control on the functions in the group.
	}
	else{
		CreateAspectOption(aType);		
	}	
	CreateOption(aType);	
}

//Modifies an aspect.
function modifyAspectEditWindow(aspect, aType, source, target, for_group){
	console.log("Modify aspect window. "+aspect);
//	var aType = aspect.type;
	if(for_group) group_aspect = true;
	else group_aspect = false;
	var dialog = $('#modal_Aspect').dialog({
		resizable: false,
		height: 400,
		width: 400,
		modal: true,
		dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Ok", click: function() {
			var empty_fields=false;
			if($('#modal_Aspect #inputname').val() == ""){
				empty_fields=true;
				$('#modal_Aspect #inputname').css("box-shadow", "inset 0 1px 10px red");
			}
			if(!empty_fields){
				//Deletes the old aspect and creates a new one. Removes the line from the menu.
				var id_s = null;
				if(source) id_s = source.id;
				id_t = null;
				if(target) id_t = target.id;
				
				$("#F_list_"+aType +" .Afield[a_s='"+id_s +"'][a_t='"+id_t +"'][a_id='"+aspect.id+"']").remove();//Removes the line in the menu				
				
				//Edits the line.
				console.log("Removes: "+aspect.id);
				//Duplicates the aspect deleted.
				var aspect_deleted = jQuery.extend(false, {}, aspect);
				aspect_deleted.source = jQuery.extend(false, {}, aspect.source);
				aspect_deleted.target = jQuery.extend(false, {}, aspect.target);
				
//				deleteAspect(aspect.id, aspect.source.id, aspect.target.id, aspect.type);
				deleteAspect(aspect.id, id_s, id_t, aspect.type);
				// Creates the new line.
				createAspectWindowClosed($('#modal_Aspect #inputname').val(), aType, $('#modal_Aspect #inputsource').val(), $('#modal_Aspect #inputtarget').val(), this, aspect_deleted);
			}			
		}
		},{
			text: "Reset", click: function() {
				
				$('#modal_Aspect #inputname').val("");
				$('#modal_Aspect #inputsource').val("");
				$('#modal_Aspect #inputtarget').val("");
				
				$('#modal_Aspect #inputname').css("box-shadow", "");
				$('#modal_Aspect #inputsource').css("box-shadow", "");
				$('#modal_Aspect #inputtarget').css("box-shadow", "");
								
				$('#modal_Aspect #A_tab_source #F_select')[0].selectedIndex=-1;
				$('#modal_Aspect #A_tab_target #F_select')[0].selectedIndex=-1;
				$('#modal_Aspect #A_tab_target #Ftype_select')[0].selectedIndex=0;
				
				$('#modal_Aspect #A_select')[0].selectedIndex=-1;
			}
		}
		],
		close:  function(event, ui){
			closeAspectWindow(this);
		}
	});

	$('#modal_Aspect').keyup(function(e) {
		if (e.keyCode == 13) //enter
		{
			var buttons = dialog.dialog('option', 'buttons');
			buttons[0].click.apply(dialog);
		}   
	});
	
	// Selects the function passed for the modify.
	if(aspect.type!="Output" && target){ //if aspect.type="Output" => no target provided.
		// Finds the parameter that could be changed.
		if(aType == "Output" && target){
			if(group_aspect){
				if(source) createGroupOptions(aType, source.id); //Select the source in the group.
				else createGroupOptions(aType); //Select the source in the group.
			}
			CreateOption(aType, target.id);
		}
		else{
			if(aType != "Output" && source){
				if(group_aspect){
					if(target) createGroupOptions(aType, target.id);
					else createGroupOptions(aType);
				}
				CreateOption(aType, source.id);
			}
		}
	}
	else{
		if(group_aspect) createGroupOptions(aType);
		CreateOption(aType);
	}
	// Select the aspect choose. XXX Check
	if(target){
		if(group_aspect) CreateGroupAspectOption(aType, aspect.id);
		else CreateAspectOption(aType, aspect.id);
	}
	
	if(aspect) $('#modal_Aspect #inputname').val(aspect.label);
	//Sets the value of the function for the source and the target.
	if(source){
		$('#modal_Aspect #inputsource').val( source.name ); // Selects the option of the function.
		//TODO if(group_aspect) 
	}
	if(target){
		$('#modal_Aspect #inputtarget').val( target.name );
	}
	
	//Ale: enable\disable the select.
	if(aType=="Output"){
		$("#modal_Aspect #A_tab_source")[0].style.display="none";
		
		$("#modal_Aspect #A_tab_target")[0].style.display="inherit";
	}
	else{
		$("#modal_Aspect #A_tab_target")[0].style.display="none";
		
		$("#modal_Aspect #A_tab_source")[0].style.display="inherit";
	}
	$('#modal_Aspect  #A_tab_target #F_select, #A_tab_source #F_select').change(function(){ 
		if(aType=="Output"){			
			var val = $("#modal_Aspect  #A_tab_target #F_select option:selected").text();
			$('#modal_Aspect #inputtarget').val(val);
		}
		else{
			var val = $("#A_tab_source #F_select option:selected").text();
			$('#modal_Aspect #inputsource').val(val);
		}
	});
	if(group_aspect){ // Shows the select input for chose the function in the group
		d3.selectAll("#modal_Aspect  #A_G_option").style("display","inherit"); // Shows the select options.
	}
	$('#modal_Aspect #A_select').change(function(){
		$('#modal_Aspect #inputname').val($("#A_select option:selected").text());
		//XXX Set some other attributes??
	});
	
	//Selects the aspect choosen among the type options. 
	var Aoptions = $("#modal_Aspect #Ftype_select option");
	if(aspect && aspect.type){
		for(var i=0; i<Aoptions.length; i++){
			if(Aoptions[i].text == aspect.type){ Aoptions[i].selected = true; break;}
		}
	}
}

/** Ale 
 * Function for create the options of the select box 'F_list'
 */
function CreateOption( aType, selectedId ){
//	console.log("Creates the options for the select box.");
	var options="<option value='-1'></option>";
	
	var selectObj;
	if(aType=="Output") selectObj=$("#modal_Aspect  #A_tab_target #F_select");
	else selectObj=$("#modal_Aspect #A_tab_source #F_select");
	for(var i=0;i<nodes.length;i++){
		if(!nodes[i].is_group){			
			if(nodes[i].id==selectedId) options+="<option value="+nodes[i].id +" selected='selected'>"+nodes[i].name +"</option>";
			else options+="<option value="+nodes[i].id +">"+nodes[i].name +"</option>";
		}
	}
	selectObj.append(options);
}

/** Ale 
 * Function for create the options for the group. Box 'G_F_list'
 */
function createGroupOptions(aType, selectedId){
//	console.log("Creates the options for the select box.");
	var options="";
	var selectObj;
	selectObj = $("#modal_Aspect #A_G_option #G_F_select");
	var f_in_group = GroupFunctions(currentGroup);
	for(var i=0;i < f_in_group.length; i++){ //TODO Gets all the functions of a group.
		if(f_in_group[i].id == selectedId) options+="<option value="+f_in_group[i].id +" selected='selected'>"+f_in_group[i].name +"</option>";
		else{
			if( !f_in_group[i].is_group ) options+="<option value="+f_in_group[i].id +">"+f_in_group[i].name +"</option>";
		}
	}
	selectObj.append(options);
}

/**Ale
 * Creates the group options for hierarchy case.
 * @param group
 * @param selectedId
 * @returns
 */
function createGroupHierarchyOptions(groupToDivide, selectedId){
	var options="";
	for(var i=0;i < groupToDivide.functions.length; i++){
		if(groupToDivide.functions[i].id == selectedId) options+="<option value="+groupToDivide.functions[i].id +" selected='selected'>"+groupToDivide.functions[i].name +"</option>";
		else{
			if(groupToDivide.functions[i].is_group) options+=createGroupHierarchyOptions(g, selectedId);
			else options+="<option value="+groupToDivide.functions[i].id +">"+groupToDivide.functions[i].name +"</option>";
			options+="<option value="+groupToDivide.functions[i].id +">"+groupToDivide.functions[i].name +"</option>";
		}
	}
	return options;
}

/**Ale: 
 * Function for create the options of the select box 'A_list', for a list of aspects in a Group.
 */
function CreateGroupAspectOption(aType, selectedId){
	console.log("Creates the options for the ASPECT select box.");
	var options="<option value='-1'></option>";
	
	var selectObj;
	selectObj=$("#modal_Aspect #A_select");
	if(aspects){		
		for( var i=0; i < aspects.length; i++ ){
			// Checks if the aspect is already present among the options in var options.
			if( options.search("value="+aspects[i].id+"") != -1 ){ 
//				console.log("Aspect: "+aspects[i].id +","+aspects[i].label+" already present"); 
			}
			else{				
				if( aType == "Output" ){ // Shows the output aspect in the group functions.
					if( aspects[i].source ){
						for( var j=0; j<currentGroup.functions.length; j++ ){
							currentFunction = currentGroup.functions[j];
							// Inserts only the output aspect of the currentFunction
							if( aspects[i].source.id == currentFunction.id ){ // XXX Duplications control?
								if( aspects[i].id == selectedId ) options+="<option value="+aspects[i].id +" selected='selected'>"+aspects[i].label +"</option>";
								else options+="<option value="+aspects[i].id +">"+aspects[i].label +"</option>";
								break;
							}
						}
					}					
				}
				else{ // Shows all the aspects, execpt the duplicated.
					if(!aspects[i].target){
						if(aspects[i].id == selectedId) options+="<option value="+aspects[i].id +" selected='selected'>"+aspects[i].label +"</option>";
						else options+="<option value="+aspects[i].id +">"+aspects[i].label +"</option>";
					}
					else{
						if(aspects[i].id == selectedId) options+="<option value="+aspects[i].id +" selected='selected'>"+aspects[i].label +"</option>";
						else options+="<option value="+aspects[i].id +">"+aspects[i].label +"</option>";
						// XXX Or we enter a control to check if the aspect points to all the functions in the group. 
						// Or we check after the insertion if is already present the same aspect.
//						for(var j=0; j<currentGroup.functions.length; j++){
//							currentFunction = currentGroup.functions[j];
//							
//							if(aspects[i].target.id != currentFunction.id || aspects[i].type!=aType){ 
//								/* This control is needed for prevent duplication. 
//								 * If the target is the current Function and the type of the aspect is the selected one, the aspect is not showed for prevent duplication.
//								 */
//								if(aspects[i].id == selectedId) options+="<option value="+aspects[i].id +" selected='selected'>"+aspects[i].label +"</option>";
//								else options+="<option value="+aspects[i].id +">"+aspects[i].label +"</option>";
//							}
//						}
					}
				}
			}
		}
	}
	selectObj.append(options);
}

/**Ale: 
 * Function for create the options of the select box 'A_list', for a list of aspects.
 */
function CreateAspectOption(aType, selectedId){
	console.log("Creates the options for the ASPECT select box.");
	var options="<option value='-1'></option>";
	
	var selectObj;
	selectObj = $("#modal_Aspect #A_select");
	if(aspects){		
		for( var i=0; i < aspects.length; i++ ){
			// Checks if the aspect is already present among the options in var options.
			if( options.search("value="+aspects[i].id+"") != -1 ){ 
				console.log("Aspect: "+aspects[i].id +","+aspects[i].label+" already present"); 
			}
			else{				
				if( aType == "Output" ){ // Shows the output of the current function.
					if( aspects[i].source ){
						// Inserts only the output aspect of the currentFunction
						if( aspects[i].source.id == currentFunction.id ){ // XXX Duplications control?
							if( aspects[i].id==selectedId ) options+="<option value="+aspects[i].id +" selected='selected'>"+aspects[i].label +"</option>";
							else options+="<option value="+aspects[i].id +">"+aspects[i].label +"</option>";
						}
					}
				}
				else{ // Shows all the aspects, execpt the duplicated.
					if(!aspects[i].target){
						if(aspects[i].id==selectedId) options+="<option value="+aspects[i].id +" selected='selected'>"+aspects[i].label +"</option>";
						else options+="<option value="+aspects[i].id +">"+aspects[i].label +"</option>";
					}
					else if(aspects[i].target.id!=currentFunction.id || aspects[i].type!=aType){ 
						/* This control is needed for prevent duplication. 
						 * If the target is the current Function and the type of the aspect is the selected one, the aspect is not showed for prevent duplication.
						 */
						if(aspects[i].id==selectedId) options+="<option value="+aspects[i].id +" selected='selected'>"+aspects[i].label +"</option>";
						else options+="<option value="+aspects[i].id +">"+aspects[i].label +"</option>";
					}
				}
			}
		}
	}
	selectObj.append(options);
}

/** Ale
 *  Creates the aspect, and updates the model. 
 */
function createAspectWindowClosed(label, aType, source_name, target_name, Adialog, aspect_modify){
	console.log("Saves the changes and updates the model. Adds: "+label+" - "+aType+" - "+source_name+" - "+target_name);
	undo.disable_save();
	if(aType=="Output"){
		if(group_aspect){ // Sets the currentFunction with the function in the group selected in #A_G_option #G_F_select
			var id_group_source = $("#A_tab_target #A_G_option #G_F_select").val();
			currentFunction = nodes.filter(function(d){return d.id == id_group_source;});
			if(currentFunction.length > 0 ) currentFunction = currentFunction[0];
			else{
				console.log("No Function in group found. "); return;
			}			
		}
		source_name = currentFunction.name;
	}
	else{
		if(group_aspect){ // Sets the currentFunction with the function in the group selected in #A_G_option #G_F_select
			var id_group_target = $("#A_tab_source #A_G_option #G_F_select").val();
			currentFunction = nodes.filter(function(d){return d.id == id_group_target;});
			if(currentFunction.length > 0 ) currentFunction = currentFunction[0];
			else{
				console.log("No Function in group found. "); return;
			}			
		}
		target_name = currentFunction.name;
	}
	var newLink = new Object;	
	var Apresent=false; // Checks if the aspect is already present.
	var A_id = 0;
	var new_f_id = null; // the id of the new function eventually entered.
	if(label==$("#modal_Aspect  #A_select option:selected").text()){//XXX Not enough?
		Apresent=true;
		A_id = parseInt($("#modal_Aspect  #A_select option:selected").val());
	}
	if(!Apresent){
		newLink.id = Alast_id;
		Alast_id++;
	}
	else newLink.id = A_id;
	
	newLink.modelId = currentFunction.idModel;
	newLink.type = aType;
	newLink.label = label;	
	// Updates the model-----------------------------------------
	var SecondFunction = null; // The second function of an aspect.
	var s_id, t_id; // Id of reference for the source and target.
	if(aType=="Output"){
		
		newLink.source=currentFunction;
		s_id=currentFunction.id;
		newLink.target=null;
		if(target_name!=""){
			newLink.type = $("#modal_Aspect  #A_tab_target #Ftype_select option:selected").text();
			// If the id is present, finds the function. Else creates a new one.
			var option = $("#modal_Aspect  #A_tab_target #F_select option:selected");
			if(option.text() == target_name){
				var TargetId=option.attr("value");
				SecondFunction = nodes.filter(function(d){return d.id==TargetId;})[0];				
				newLink.target = SecondFunction;				
				t_id = SecondFunction.id;
			}
			else{ // Adds the function if it is not present.
				var TargetId = addFRAMFunction(target_name);
				new_f_id = TargetId;
				SecondFunction = nodes.filter(function(d){return d.id==TargetId;})[0];				
				newLink.target = SecondFunction;		
				t_id = SecondFunction.id;
			}
		}
	}
	else{		
		newLink.target=currentFunction;
		t_id=currentFunction.id;
		newLink.source=null;
		if(source_name!=""){
			// If the id is present, finds the function. Else creates a new one.
			var option=$("#modal_Aspect #A_tab_source #F_select option:selected");
			if(option.text()==source_name){
				var SourceId=option.attr("value");
				SecondFunction=nodes.filter(function(d){return d.id==SourceId;})[0];				
				newLink.source=SecondFunction;				
				s_id=SecondFunction.id;
			}
			else{ // Adds the function if it is not present.
				var SourceId=addFRAMFunction(source_name);
				new_f_id = SourceId;
				SecondFunction=nodes.filter(function(d){return d.id==SourceId;})[0];				
				newLink.source=SecondFunction;				
				s_id=SecondFunction.id;
			}
		}
	}
	if(aType=="Output"){
		if(aspects.filter(function(d){if(d.id==newLink.id && d.target==newLink.target && d.type==newLink.type) return d;}).length>0){
			console.log("Alert, link already present for this aspect, function and type combination. Check and change the info entered.");
			alert("Alert, link already present for this aspect, function and type combination. Check and change the info entered.");
			return;
		}		
	}
	//Updates the aspects on the nodes.
	currentFunction.aspects.push(newLink);//Adds the link entered.
	if(SecondFunction) SecondFunction.aspects.push(newLink);//Adds the link entered.
	//Updates the models.
	//Checks for the label and aspect id.
	newLink.multilabel=label; //Used for the case of multi-edge between the same two function and the same output and aspect.
	if(!aspects) aspects=[];	
	aspects.push(newLink);
	if(aspect_modify){
		undo.enable_save();
		undo.saveOp("a_modify", aspect_modify, newLink); // Saves the operation.		
	}
	else{
		undo.enable_save();
		undo.saveOp("a_create", new_f_id, newLink); // Saves the operation.
	}
	
	console.log("append new link.");
	if(newLink.source && newLink.target){
		links.push(newLink);
		//saves a reference in aspect to the rispective link.
		aspects[aspects.length-1].link=links[links.length-1];
		updateMultiLabel("add", newLink);
	}
	updateFRAMModel();
	//XXX ?Updates the model on the server? Now The changes on the server are made when saves. 
	//Adds a line in the previous window.----------------------
	if(group_aspect){
		$('.Afield').remove(); // Updates the list of aspects.
		ShowGroupAspects();
//		GroupAppendAspect(label, aType, source_name, target_name, newLink.id, s_id, t_id, newLink.type);
	}
	else FunctionAppendAspect(label, aType, source_name, target_name, newLink.id, s_id, t_id, newLink.type);
	
	//Closes the current window
	closeAspectWindow(Adialog);
}

//Ale: Closes the windows.
function closeAspectWindow(Adialog){
	$('#modal_Aspect #inputname').val("");
	$('#modal_Aspect #inputsource').val("");
	$('#modal_Aspect #inputtarget').val("");
	
	$('#modal_Aspect #inputname').css("box-shadow", "");
	$('#modal_Aspect #inputsource').css("box-shadow", "");
	$('#modal_Aspect #inputtarget').css("box-shadow", "");
	
	$("#modal_Aspect  #A_tab_source")[0].style.display="none";
	$("#modal_Aspect #A_tab_target")[0].style.display="none";
	
	if(group_aspect){ // Shows the select input for chose the function in the group
		d3.selectAll("#modal_Aspect #A_G_option").style("display","none"); // Shows the select options.
		group_aspect = false;
	}
	
	var selectList = $('#modal_Aspect #A_tab_source #F_select')[0];
	for(var i=selectList.length;i>0;i--){
		selectList.remove(i-1);
	}
	selectList = $('#modal_Aspect #A_tab_target #F_select')[0];
	for(var i=selectList.length;i>0;i--){
		selectList.remove(i-1);
	}
	$('#modal_Aspect #A_tab_target #Ftype_select')[0].selectedIndex=0;
	selectList = $('#modal_Aspect #A_select')[0];
	for(var i=selectList.length;i>0;i--){
		selectList.remove(i-1);
	}
	
	selectList = $('#modal_Aspect #A_G_option #G_F_select')[0];
	for(var i=selectList.length; i >= 0; i--){
		selectList.remove(i-1);
	}
	
	selectList = $('#modal_Aspect #A_G_option #G_F_select')[1];
	for(var i=selectList.length; i>=0; i--){
		selectList.remove(i-1);
	}
	
	$(Adialog).dialog('destroy');
}

/**Ale
 * Create the window for add the info about an aspect. Exactly, the name, and for the group the function in the group.
 * @param source
 * @param target
 * @param type
 */
function createAspectAddInfoWindow(source, target, type){ 
	var dialog = $('#modal_AspectAddInfo').dialog({
		resizable: false,
		height: 400,
		width: 400,
		modal: true,
		dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Ok", click: function() {
			var empty_fields=false;
			
			if(!empty_fields){				
				//Ale: Adds the aspect to the nodes source and target. And in the previous table.
				var Aname = $('#modal_AspectAddInfo #inputname').val();
				//Retrievs the source and the target of the selection.
				if(source.is_group){
					var s_id = parseInt($("#modal_AspectAddInfo #G_Fsource_select option:selected").val());
					source = nodes.filter(function(d){return d.id == s_id;});
					source = source[0];
				}
				if(target.is_group){
					var t_id = parseInt($("#modal_AspectAddInfo #G_Ftarget_select option:selected").val());
					target = nodes.filter(function(d){return d.id == t_id;});
					target = target[0];
				}				
				createAspectAddInfoWindowClosed( Aname, source, target, type, this ); 
			}			
		}
		},{
			text: "Reset", click: function() {				
				$('#modal_AspectAddInfo #inputname').val("");				
			}
		}
		],
		close:  function(event, ui){
			closeAspectAddInfoWindow(this);
		}
	});
	// Checks if the source or target or both are groups.
	if(source.is_group){
		$("#modal_AspectAddInfo #A_tab_source")[0].style.display="inherit";
		AspectAddInfoCreateOptions("source",source);
	}
	if(target.is_group){
		$("#modal_AspectAddInfo #A_tab_target")[0].style.display="inherit";
		AspectAddInfoCreateOptions("target",target);
	}
	$('#modal_AspectAddInfo #A_select').change(function(){ $('#modal_AspectAddInfo #inputname').val($("#modal_AspectAddInfo #A_select option:selected").text()); });
		
	$('#modal_AspectAddInfo #inputname').keyup(function(e) {
		if (e.keyCode == 13) //enter
		{
			var buttons = dialog.dialog('option', 'buttons');
			buttons[0].click.apply(dialog);
		}   
	});
	
	CreateAddInfoAspectOption(type, source);
}


/**Ale: 
 * Function for create the options of the select box 'A_list', for a list of aspects.
 */
function CreateAddInfoAspectOption(aType, source){
	console.log("Creates the options for the ASPECT select box.");
	var options="<option value='-1'></option>";
	
	var selectObj;
	selectObj = $("#modal_AspectAddInfo #A_select");
	
	if(source.is_group) options += AspectAddInfoHierarchyOptions(source);
	else{			
		for(var i in source.aspects){
			// Inserts only the output aspect of the currentFunction
			if(source.aspects[i].source && source.aspects[i].source.id == source.id  && options.indexOf("value="+source.aspects[i].id+"")==-1)options+="<option value="+source.aspects[i].id +">"+source.aspects[i].label +"</option>";
		}		
	}
	selectObj.append(options);
}

function AspectAddInfoHierarchyOptions(g){
	var options="";	
	for(var i in g.functions){
		if(g.functions[i].is_group) options += AspectAddInfoHierarchyOptions(g.functions[i]);
		else{
			for(var j in g.functions[i].aspects){
				// Inserts only the output aspect of the currentFunction, ad if is not already present in the options.
				if(g.functions[i].aspects[j].source && g.functions[i].aspects[j].source.id == g.functions[i].id && options.indexOf("value="+g.functions[i].aspects[j].id+"")==-1) options+="<option value="+g.functions[i].aspects[j].id +">"+g.functions[i].aspects[j].label +"</option>";
			}
		}
	}		
	return options;
}

/** Ale 
 * Function for create the options of the select box 'F_list'
 */
function AspectAddInfoCreateOptions( aType, group_linked ){
//	console.log("Creates the options for the select box.");
	var options="";
	options += AspectGetGroupFunctions(group_linked);
	var selectObj;
	if(aType=="source") selectObj = $("#modal_AspectAddInfo #G_Fsource_select");
	else selectObj=$("#modal_AspectAddInfo #G_Ftarget_select");
	
	selectObj.append(options);
}

function AspectGetGroupFunctions(g){
	var options="";
	for(var i in g.functions){
		if(!g.functions[i].is_group)	options+="<option value="+g.functions[i].id +">"+g.functions[i].name +" ( Group: "+g.name +" )</option>";
		else options += AspectGetGroupFunctions(g.functions[i]);
	}
	return options;
}


function createAspectAddInfoWindowClosed(Aname, source, target, type, Adialog){
	console.log("Adds a new Aspect.");
	var newAspect = new Object;
	var A_id = null; //The id for the aspect. If it's an aspect already present takes the previous id.
	if(Aname == "") newAspect.label = "New Aspect";
	else{
		if( Aname == $("#modal_AspectAddInfo #A_select option:selected").text()){//XXX Not enough?
			Apresent = true;
			A_id = parseInt($("#modal_AspectAddInfo #A_select option:selected").val());
		}
		newAspect.label = Aname;
	}
	if( A_id ) newAspect.id = A_id;
	else newAspect.id = Alast_id++;
	newAspect.source = source;
	newAspect.target = target;
	newAspect.type = type;	
	newAspect.modelId = modelId;
	newAspect.multilabel = newAspect.label;
	// Checks if there is already an aspect equal to the one entered
	if(aspects.filter(function(d){
		return (d.id == newAspect.id && d.source == newAspect.source && d.target == newAspect.target && d.type == newAspect.type);
	}).length>0){
		console.log("There is a duplication for this aspect. No enter.");
		toastr.error("Aspect already present!"); Alast_id--; // Count's down the id number for the aspects.
		return;
	}
	aspects.push(newAspect);
	source.aspects.push(newAspect);
	target.aspects.push(newAspect);
	
	links.push(newAspect);
	
	updateFRAMModel();
	closeAspectAddInfoWindow(Adialog);
}

function closeAspectAddInfoWindow(Adialog){
	$('#modal_AspectAddInfo #inputname').val("");
	
	$("#modal_AspectAddInfo #A_tab_source")[0].style.display="none";
	$("#modal_AspectAddInfo #A_tab_target")[0].style.display="none";
	
	var selectList = $('#modal_AspectAddInfo #G_Fsource_select')[0];
	for(var i=selectList.length;i>0;i--){
		selectList.remove(i-1);
	}
	selectList = $('#modal_AspectAddInfo #G_Ftarget_select')[0];
	for(var i=selectList.length;i>0;i--){
		selectList.remove(i-1);
	}
	selectList = $('#modal_AspectAddInfo #A_select')[0];
	for(var i=selectList.length;i>0;i--){
		selectList.remove(i-1);
	}
	
	$(Adialog).dialog('destroy');
}
