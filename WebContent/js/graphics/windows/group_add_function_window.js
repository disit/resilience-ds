/**
 * Ale: function that manages the dialog for the insertion of function in a Group.
 */
function createAddFunctionsWindow(){
	console.log("Add Functions to Group.");
	var dialog = $('#modal_GroupAddFunctions').dialog({
		resizable: false,
		height: 600,
		width: 400,
		modal: true,
		dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Ok", click: function() {
			closeGroupWindow(this);
		}
		}],
		close: function(event, ui){
			closeAddFunctionWindow(this);
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
	
	//Ale: populates the functions list
	ShowGroupFunctions(d.functions);
	
	//Ale: populates the edit table.
	ShowGroupAspects(d.aspects);	
	
	$('#modal_Group #inputcolor').val(d.color);
	
	$("#inputcolor").on("change",function(){
		console.log("Color changed for: "+d.name);
	});	
}
