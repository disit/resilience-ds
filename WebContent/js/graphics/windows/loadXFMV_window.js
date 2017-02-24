/**
 * Ale: function that manages the dialog for the data specification of an aspect. 
 * Creation and Modification.
 */
function createLoadXFMVWindow(aType)
{
	console.log("Shows the dialog.");

	var dialog = $('#load_xfmv').dialog({
		resizable: false,
		height: 150,
		width: 400,
		modal: true,
		dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Ok", click: function() {
			var empty_fields=false;
			//TODO Checks if there is a file loaded.
			if($('#fileDialog').val() == ""){
				empty_fields=true;
				$('#fileDialog').css("box-shadow", "inset 0 1px 10px red");
			}			
			if(!empty_fields){				
				//Ale: Send the .xfmv file to the server. TODO send the file.
				var file=document.getElementById("fileDialog").files[0];
				sendXFMV(file); //Sends the xfmv file to the server.
				closeLoadXFMVWindow(this);
			}			
		}
		},{
			text: "Reset", click: function() {
				$("#fileDialog").val("");
			}
		}
		],
		close:  function(event, ui){
			closeLoadXFMVWindow(this);
		}
	});	
}
function sendXFMV(file){
	//Loads an XFMV on the server. 'file' is the file to send.
	console.log("Send the file to the server.");
	console.log(file);
	var reader = new FileReader(); 

	reader.readAsText(file, "UTF-8"); 
	reader.onload = clientRest.createXFMVModel; //Function executed once the file has been loaded.
}

//Ale: Closes the window.
function closeLoadXFMVWindow(Ldialog){
	$('#fileDialog').css("box-shadow", "");	
	$("#fileDialog").val("");
	$(Ldialog).dialog('destroy');
}