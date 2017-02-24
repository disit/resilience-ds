/**
 * Ale: function that manages the pop up menu with the starting information to complete for a new model.
 */

function createIntroFRAMModelWindow()
{
	var dialog = $('#div_insert_info_model').dialog({
		resizable: false,
		height: 400,
		width: 400,
		modal: true,
		dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Ok", click: function() {
			
			if($('#input_objective_model').val() != "")
			{
				introFRAMModelWindowClosed($('#input_objective_model').val(), $('#input_description_model').val());
				$(this).dialog('destroy');
			}	
			else{
				$('#input_objective_model').css("box-shadow", "inset 0 1px 10px red");
			}	
		}
		},{
			text: "Reset", click: function() {
				$('#input_objective_model').val("");
				$('#input_description_model').val("");
			}
		}
		],
		close: function(event, ui){
			$('#input_objective_model').val("");
			$('#input_description_model').val("");
			introFRAMModelWindowClosed(null, null);
			
			$(this).dialog('destroy');
		}
	});
	
	$('#div_insert_info_model').keyup(function(e) {
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
}
//Ale: TODO Old
function createIntroModelWindow()
{
	var dialog = $('#div_insert_info_model').dialog({
		resizable: false,
        height: 400,
        width: 400,
        modal: true,
        dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Ok", click: function() {

						if($('#input_objective_model').val() != "")
						{
							introModelWindowClosed($('#input_objective_model').val(), $('#input_url_model').val(), $('#input_description_model').val());
							$(this).dialog('destroy');
						}	
						else{
							$('#input_objective_model').css("box-shadow", "inset 0 1px 10px red");
						}	
					}
				  },{
					text: "Reset", click: function() {
						$('#input_objective_model').val("");
						$('#input_url_model').val("");
						$('#input_description_model').val("");
					}
				}
			],
			close: function(event, ui){
				$('#input_objective_model').val("");
				$('#input_url_model').val("");
				$('#input_description_model').val("");
				introModelWindowClosed(null, null, null);

				$(this).dialog('destroy');
			}
		});
	
	$('#div_insert_info_model').keyup(function(e) {
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
}