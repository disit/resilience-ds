/**
 * 
 */

function createObjectiveInstanceWindow()
{	
	
	var dialog = $('#div_insert_objective').dialog({
		resizable: false,
        height: 200,
        width: 400,
        modal: true,
        dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Ok", click: function() {
						if($('#input_objective').val() != "")
						{
							objectiveWindowClosed($('#input_objective').val(), $('#input_url_repository').val());
							$(this).dialog('destroy');
						}	
						else{
							$('#input_objective').css("box-shadow", "inset 0 1px 10px red");
						}	
					}
				  },{
					text: "Reset", click: function() {
						$('#input_objective').val("");
						$('#input_url_repository').val("");
					}
				}
			],
			close: function(event, ui){
				$('#input_objective').val("");
				$('#input_url_repository').val("");
				objectiveWindowClosed(null, null);

				$(this).dialog('destroy');
			}
		});
	
	$('#div_insert_objective').keyup(function(e) {
		if (e.keyCode == 13) //enter
		{
			var buttons = dialog.dialog('option', 'buttons');
			buttons[0].click.apply(dialog);
		}   
	});
}