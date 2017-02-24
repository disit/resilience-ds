/**
 * Window per la gestione dell'incogruenza
 */

function createIncongruityWindow(position, greenUser, whiteUser, redUser, greenCalc, whiteCalc, redCalc)
{
	var dialog = $('#incongruityDiv').dialog({
		resizable: false,
		width: 600,
        height: 300,
        modal: true,
        dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Save" , click: function() {
				if($('#IFUser_div').css("opacity") == 1.0)
				{
					if($('#greenChangeLabel').val() != 0 || $('#whiteChangeLabel').val() != 0 || $('#redChangeLabel').val() != 0){
						if(Math.abs($('#greenChangeLabel').val() - greenCalc)<<0.1 || 
								Math.abs($('#whiteChangeLabel').val() - whiteCalc)<0.1 || Math.abs($('#redChangeLabel').val() - redCalc)<0.1)
						{
							var dataCriteria = {green:$('#greenChangeLabel').val(), white:$('#whiteChangeLabel').val(), red:$('#redChangeLabel').val()};
							clientRest.saveDataCriteriaInstance(position, "if_insert", dataCriteria);
							
							$(this).dialog('destroy');	
						}	
					}
				}
				else if($('#IFCalculated_div').css("opacity") == 1.0){
					
					var dataCriteria = {green:greenCalc, white:whiteCalc, red:redCalc};
					clientRest.saveDataCriteriaInstance(position, "if_insert", dataCriteria);
					
					$(this).dialog('destroy');
				}
			}
		},{ text: "Reset" , click: function() {
				$('#greenLabel').text(parseFloat(Number(greenUser).toFixed(3)));
				$('#whiteLabel').text(parseFloat(Number(whiteUser).toFixed(3)));
				$('#redLabel').text(parseFloat(Number(redUser).toFixed(3)));
	
				$('#greenCalcLabel').text(parseFloat(Number(greenCalc).toFixed(3)));
				$('#whiteCalcLabel').text(parseFloat(Number(whiteCalc).toFixed(3)));
				$('#redCalcLabel').text(parseFloat(Number(redCalc).toFixed(3)));
				
				$('#greenChangeLabel').text("");
				$('#whiteChangeLabel').text("");
				$('#redChangeLabel').text("");
			}
		}],
		open: function(event, ui) { 
			$('#greenLabel').text(parseFloat(Number(greenUser).toFixed(3)));
			$('#whiteLabel').text(parseFloat(Number(whiteUser).toFixed(3)));
			$('#redLabel').text(parseFloat(Number(redUser).toFixed(3)));

			$('#greenCalcLabel').text(parseFloat(Number(greenCalc).toFixed(3)));
			$('#whiteCalcLabel').text(parseFloat(Number(whiteCalc).toFixed(3)));
			$('#redCalcLabel').text(parseFloat(Number(redCalc).toFixed(3)));
	  	},
		close: function(event, ui){				
			$(this).dialog('destroy');	
		}
	});

}