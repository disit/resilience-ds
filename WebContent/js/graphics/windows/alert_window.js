/**
 * 
 */

function showAlert(text_alert)
{
	
	var dialog = $('#div_alert').dialog({
		resizable: false,
        height: 170,
        width: 250,
        modal: true,
        dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Ok" , click: function(){
//				if(element != undefined && element != null)
//					element.triggerHandler( "select" );
				$(this).dialog('destroy');
			} 
		}],
		open: function(event, ui) { 
	  		$('#text_alert').text(text_alert);
	  	},
		close: function(event, ui){
//			if(element != undefined && element != null)
//				element.triggerHandler( "select" );
			$(this).dialog('destroy');	
		}
	});
	
}