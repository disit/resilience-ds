/**
 * 
 */

// *****************************************************************************************************
// ****************** CONTROLLI PER LA FINESTRA DI INSERIMENTO DEI PESI SUGLI ARCHI ********************
// *****************************************************************************************************

function focusMatrixTab()
{
	$("#vector_tab").css("opacity", 0.5);
	$("#vector_tab").css("filter", "alpha(opacity=50)");
	
	$("#matrix_tab").css("opacity", 1.0);
	$("#matrix_tab").css("filter", "alpha(opacity=100)");
}

function confirmMatrixTab()
{
	$("#vector_tab").css("opacity", 0.2);
	$("#vector_tab").css("filter", "alpha(opacity=20)");
	
	$("body").off("mouseover",'#matrix_tab');			
	$("body").off("mouseover",'#vector_tab');
	
	$("#matrix_tab").css("opacity", 1.0);
	$("#matrix_tab").css("filter", "alpha(opacity=100)");
	
}

function focusVectorTab()
{
	$("#matrix_tab").css("opacity", 0.5);
	$("#matrix_tab").css("filter", "alpha(opacity=50)");
	
	$("#vector_tab").css("opacity", 1.0);
	$("#vector_tab").css("filter", "alpha(opacity=100)");
}

function confirmVectorTab()
{
	$("#matrix_tab").css("opacity", 0.2);
	$("#matrix_tab").css("filter", "alpha(opacity=20)");
	
	$("body").off("mouseover",'#matrix_tab');			
	$("body").off("mouseover",'#vector_tab');
	
	$("#vector_tab").css("opacity", 1.0);
	$("#vector_tab").css("filter", "alpha(opacity=100)");
	
}


// *****************************************************************************************************
// ************** CONTROLLI PER LA FINESTRA DI INSERIMENTO DELL'IF O DELLE FUNCTION LOGIN **************
// *****************************************************************************************************

function controlDigitGreen(e)
{
	var keyCode = e.keyCode || e.which; 
	
	console.log(e);

	if (keyCode != 9 && keyCode != 8) 
		controlDecimalNumber($("#inputgreen"));
}

function controlDigitWhite(e)
{
	var keyCode = e.keyCode || e.which; 

	if (keyCode != 9 && keyCode != 8) 
	{
		var numberIsOk = controlDecimalNumber($("#inputwhite"));
	
		if(numberIsOk)
		{
			if($('#inputgreen').val() != "")
			{
				var sum = 1-(parseFloat(Number($("#inputgreen").val().replace(',','.')).toFixed(3))+parseFloat(Number($("#inputwhite").val().replace(',','.')).toFixed(3)));
				if(sum >= 0)
					$('#inputred').val(parseFloat(sum.toFixed(3)));
				else{
					showAlert("The sum of probability can't be greater than 1");
				}
			}
		}
	}
}

function controlDigitRed(e)
{
	var keyCode = e.keyCode || e.which; 

	if (keyCode != 9 && keyCode != 8) 
		controlDecimalNumber($("#inputred"));
}


function controlDigitTrue1(e)
{	
	var keyCode = e.keyCode || e.which; 

	if (keyCode != 9 && keyCode != 8) 
		controlDecimalNumber($("#true1"));
}

function controlDigitTrue2(e)
{
	var keyCode = e.keyCode || e.which; 
	
	if (keyCode != 9 && keyCode != 8)
	{
		var numberIsOk = controlDecimalNumber($("#true2"));
		
		if(numberIsOk)
		{
			if($('#true1').val() != "")
			{
				var sum = 1-(parseFloat(Number($("#true1").val().replace(',','.')).toFixed(3))+parseFloat(Number($("#true2").val().replace(',','.')).toFixed(3)));
				if(sum >= 0)
					$('#true3').val(parseFloat(sum.toFixed(3)));
				else{
					showAlert("The sum of probability can't be greater than 1");
				}
			}
		}
	}
}

function controlDigitTrue3(e)
{
	var keyCode = e.keyCode || e.which; 
	
	if (keyCode != 9 && keyCode != 8) 
		controlDecimalNumber($("#true3"));
}

function controlDigitFalse1(e)
{
	var keyCode = e.keyCode || e.which; 

	if (keyCode != 9 && keyCode != 8) 
		controlDecimalNumber($("#false1"));
}

function controlDigitFalse2(e)
{
	var keyCode = e.keyCode || e.which; 
	
	if (keyCode != 9 && keyCode != 8)
	{
		var numberIsOk = controlDecimalNumber($("#false2"));
		
		if(numberIsOk)
		{
			if($('#false1').val() != "")
			{
				var sum = 1-(parseFloat(Number($("#false1").val().replace(',','.')).toFixed(3))+parseFloat(Number($("#false2").val().replace(',','.')).toFixed(3)));
				if(sum >= 0)
					$('#false3').val(parseFloat(sum.toFixed(3)));
				else{
					showAlert("The sum of probability can't be greater than 1");
				}
			}
		}
	} 
}

function controlDigitFalse3(e)
{
	var keyCode = e.keyCode || e.which; 

	if (keyCode != 9 && keyCode != 8) 
		controlDecimalNumber($("#false3"));
}


function controlDecimalNumber(element)
{ 	
	var string_number = element.val().replace(',','.');
	
	if($.isNumeric(string_number) === true) 
	{
		var number = parseFloat(Number(string_number).toFixed(3));
		if(parseFloat(element.val()) >= 0 && parseFloat(element.val()) <= 1)
		{
			return true;
		}
		else
		{
			showAlert("The number must be between 0 and 1");
			element.val("");
			return false;
		}
	}
	else{
		showAlert("The number must be between 0 and 1");
		element.val("");
		return false;
	}
}

function changeCompareLF1()
{
	if($('#compare1').val() == "5")
	{
		$('#threshold2LF1').css("visibility","visible");
		$('#labelThreshold2LF1').css("visibility","visible");
	}
	else{
		$('#threshold2LF1').css("visibility","hidden");
		$('#labelThreshold2LF1').css("visibility","hidden");
	}		
}

function changeCompareLF2()
{
	if($('#compare2').val() == "5")
	{
		$('#threshold2LF2').css("visibility","visible");
		$('#labelThreshold2LF2').css("visibility","visible");
	}
	else{
		$('#threshold2LF2').css("visibility","hidden");
		$('#labelThreshold2LF2').css("visibility","hidden");
	}
}

function focusIFTab()
{
	$("#LF_tab").css("opacity", 0.5);
	$("#LF_tab").css("filter", "alpha(opacity=50)");
	
	$("#IF_tab").css("opacity", 1.0);
	$("#IF_tab").css("filter", "alpha(opacity=100)");
}

function confirmIFTab()
{
	$("#LF_tab").css("opacity", 0.2);
	$("#LF_tab").css("filter", "alpha(opacity=20)");
	
	$("body").off("mouseover",'#IF_tab');			
	$("body").off("mouseover",'#LF_tab');
	
	$("#IF_tab").css("opacity", 1.0);
	$("#IF_tab").css("filter", "alpha(opacity=100)");
	
}

function focusLFTab()
{
	$("#IF_tab").css("opacity", 0.5);
	$("#IF_tab").css("filter", "alpha(opacity=50)");
	
	$("#LF_tab").css("opacity", 1.0);
	$("#LF_tab").css("filter", "alpha(opacity=100)");
}

function confirmLFTab()
{
	$("#IF_tab").css("opacity", 0.2);
	$("#IF_tab").css("filter", "alpha(opacity=20)");
	
	$("body").off("mouseover",'#IF_tab');			
	$("body").off("mouseover",'#LF_tab');
	
	$("#LF_tab").css("opacity", 1.0);
	$("#LF_tab").css("filter", "alpha(opacity=100)");	
}

function writeQuery2()
{
	if($('#query2').val() != "")
	{
		$("#select_LF2").val('1');
		$("#select_andor").val('1');
	}
	else{
		$("#select_LF2").val('0');
		$("#select_andor").val('0');
	}
}

function clickSimulateQuery1()
{
	if($('#query1').val() == "") 
		showAlert("Insert query to simulate");
	else if($('#input_url_repository_criteria').val() == "")
		showAlert("Insert repository");
	else{
		var query = $('#query1').val();
		query = query.replace(/\</g, '&lt;');
		query = query.replace(/\>/g, '&gt;');
		
		clientRest.simulateQuery(query, 1, $('#input_url_repository_criteria').val());
	}
}

function clickSimulateQuery2()
{
	if($('#query2').val() == "") 
		showAlert("Insert query to simulate");	
	else if($('#input_url_repository_criteria').val() == "")
		showAlert("Insert repository");
	else{
		var query = $('#query2').val();
		query = query.replace(/\</g, '&lt;');
		query = query.replace(/\>/g, '&gt;');
		
		clientRest.simulateQuery(query, 2, $('#input_url_repository_criteria').val());
	}
}