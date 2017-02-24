/**
 * 
 */

function createIFWindow(d, green, white, red, text)
{
	console.log(d);
	
	var dialog = $('#modal_IF').dialog({
		resizable: false,
        height: 630,
        width: 500,
        modal: true,
        position: ['center',20],
        position:{my: "center center+10", at: 'center'},
        dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Save" , 
					click: function() { 
//						if_replace_lfm = false;
						if($('#IF_tab').css("opacity") == 1.0)
						{
							var sumIF = Number($('#inputgreen').val().replace(',','.')) + Number($('#inputwhite').val().replace(',','.')) + Number($('#inputred').val().replace(',','.'));
							if(sumIF > 0.99 && sumIF < 1.01)
							{
								// RICHIESTA REST PER IL SALVATAGGIO DELL'IF
								var dataIF = {green: $('#inputgreen').val().replace(',','.'), white:$('#inputwhite').val().replace(',','.'), red:$('#inputred').val().replace(',','.')};
								clientRest.saveDataCriteriaInstance("C"+d.id, "if_insert", dataIF);
								criteriaInstanceId = d.id;
								
								if(green == 0 && white == 0 && red == 0)
								{
									changeNodeIFEmptyToNodeIFModify(d.id, text, dataIF.green, dataIF.white, dataIF.red, green, white, red, null);
								}
								else{
									modifyIFValue(d.id, dataIF.green, dataIF.white, dataIF.red);
								}
								
								clearIFWindow();
								$("#imgStatusLFM_"+d.id).remove();
								
								$(this).dialog('destroy');
							}
							else{
								showAlert("The sum of Italian Flag elements must be 1");
							}
						}
						else{
							
							var query1 = $("#query1").val();
							var cmp1 = $("#compare1").val();
							var thr1_lf1 = $("#threshold1LF1").val();
							var thr2_lf1 = $("#threshold2LF1").val();
							var query2 = $("#query2").val();
							var cmp2 = $("#compare2").val();
							var thr1_lf2 = $("#threshold1LF2").val();
							var thr2_lf2 = $("#threshold2LF2").val();	
							
							var notFunction1 = $("#select_LF1").val();
							var logicConnector = $("#select_andor").val();
							var notFunction2 = $("#select_LF2").val();
							var typeIF1 = "G";
							var value_true1 = $("#true1").val().replace(',','.');
							var value_false1 = $("#false1").val().replace(',','.');
							var typeIF2 = "W";
							var value_true2 = $("#true2").val().replace(',','.');
							var value_false2 = $("#false2").val().replace(',','.');
							
							if(query1 == "")
								showAlert("You must set query1!");
							else if(notFunction2 != 0 && query2 == "")
								showAlert("You must set query2!");
							else if(logicConnector == 0 && notFunction2 != 0)
//								showAlert("Devi impostare il connettore logico tra le due funzioni!");
								showAlert("You must set logic connector between two function!");
							else if(logicConnector != 0 && notFunction2 == 0)
//								showAlert("Hai impostato il connettore logico senza definire l'utilizzo della funzione logica 2 nel LogicFunctionManager!");
								showAlert("You must logic connector without define the use of logic function 2 in the Logic Function Manager!");
							else if((Number(value_true1) + Number(value_true2)) > 1.0)
//								showAlert("La somma delle due soglie impostate relative al valore true di LogicFunctionManager è maggiore di 1!");
								showAlert("The sum of the 2 thresholds about true value of Logic Function Manager is greater than 1!");
							else if((Number(value_false1) + Number(value_false2)) > 1.0)
//								showAlert("La somma delle due soglie impostate relative al valore false di LogicFunctionManager è maggiore di 1!");
								showAlert("The sum of the 2 thresholds about false value of Logic Function Manager is greater than 1!");
							else if($('#input_url_repository_criteria').val() == "")
								showAlert("Insert the repository!");
							else if(1-value_true1-value_true2 < 0)
								showAlert("The sum of Italian Flag part in true case must be 1!")
							else if(1-value_false1-value_false2 < 0)
								showAlert("The sum of Italian Flag part in false case must be 1!")
							else{
								criteriaInstanceId = d.id;
								
								var url_repository = $('#input_url_repository_criteria').val();
								
								query1 = query1.replace(/\</g, '&lt;');
								query1 = query1.replace(/\>/g, '&gt;');
								
								if(notFunction2 != 0 && query2 != "")
								{
									query2 = query2.replace(/\</g, '&lt;');
									query2 = query2.replace(/\>/g, '&gt;');
								}
								
								// Paramteri da passare alla funzione insertLogicFunctions() in clientRest
								/*criteriaPosition, query1, cmp1, thr1_lf1, thr2_lf1, query2, cmp2, thr1_lf2, thr2_lf2, notFunction1, logicConnector, notFunction2,
								typeIF1, value_true1, value_false1, typeIF2, value_true2, value_false2*/
								
								console.log(d.id + query1 + cmp1+ thr1_lf1+ thr2_lf1+ query2+ cmp2+ thr1_lf2+ thr2_lf2+ notFunction1+ logicConnector+ notFunction2+
										typeIF1+ value_true1+ value_false1+ typeIF2+ value_true2+ value_false2 + url_repository);
								
								clientRest.insertLogicFunctions("C"+d.id, query1, cmp1, thr1_lf1, thr2_lf1, query2, cmp2, thr1_lf2, thr2_lf2, notFunction1, logicConnector, notFunction2,
										typeIF1, value_true1, value_false1, typeIF2, value_true2, value_false2, url_repository);
								
								changeNodeIFEmptyToNodeIFModify(d.id, text, 0, 0, 0, 1);
								
								addFunctionManager(d.id, text);
								
								clearIFWindow();
								
								$(this).dialog('destroy');
							}
						}
					}
				},
				{ text: "Reset", 
					click: function() { 
						if($('#IF_tab').css("opacity") == 1.0)
						{
							$('#inputgreen').val(parseFloat(Number(green).toFixed(3)));
							$('#inputwhite').val(parseFloat(Number(white).toFixed(3)));
							$('#inputred').val(parseFloat(Number(red).toFixed(3)));	
						}
						else{
							if(d.function_manager != undefined)
							{
								$("#query1").val(d.function_manager.logic_function1.query);
								$("#compare1").val(d.function_manager.logic_function1.compare);
								$("#threshold1LF1").val(d.function_manager.logic_function1.threshold1);
								$("#threshold2LF1").val(d.function_manager.logic_function1.threshold2);
								if(d.function_manager.logic_function2.query != undefined)
									$("#query2").text(d.function_manager.logic_function2.query);
								else
									$("#query2").text("");
								if(d.function_manager.logic_function2.compare != undefined)
									$("#compare2").val(d.function_manager.logic_function2.compare);
								else
									$("#compare2").val(0);
								if(d.function_manager.logic_function2.threshold1 != undefined)
									$("#threshold1LF2").val(d.function_manager.logic_function2.threshold1);
								else
									$("#threshold1LF2").val("");
								if(d.function_manager.logic_function2.threshold2 != undefined)
									$("#threshold2LF2").val(d.function_manager.logic_function2.threshold2);	
								else
									$("#threshold2LF2").val("");
								
								$("#select_LF1").val(d.function_manager.notFunction1);
								$("#select_andor").val(d.function_manager.logicConnector);
								$("#select_LF2").val(d.function_manager.notFunction2);
								$("#selectIFPart1").val(d.function_manager.typeIF1);
								$("#true1").val(d.function_manager.value_true1);
								$("#false1").val(d.function_manager.value_false1);
								$("#selectIFPart2").val(d.function_manager.typeIF2);
								$("#true2").val(d.function_manager.value_true2);
								$("#false2").val(d.function_manager.value_false2);
							}
						}
					}
				}
			],
		  	open: function(event, ui) { 
		  		$("#IF_tab").createIF(d, green, white, red);
		  	},
			close: function(event, ui){		
				
				clearIFWindow();
				
				$(this).dialog('destroy');	
			}
		});
	
	$('#IF_tab').on('keyup', function(e) {
		if(e.keyCode == 13) //enter
		{
			if($('#IF_tab').css("opacity") == 1.0)
			{	
				var buttons = dialog.dialog('option', 'buttons');
				buttons[0].click.apply(dialog);
			}
		}   
	});
}

//Creazione del finestra in cui inserire il valore degli IF
$.fn.createIF = function(d, green, white, red)
{	
	$('#inputgreen').val(parseFloat(Number(green).toFixed(3)));
	$('#inputwhite').val(parseFloat(Number(white).toFixed(3)));
	$('#inputred').val(parseFloat(Number(red).toFixed(3)));	
	
	if(d.function_manager != undefined)
	{
		if(d.function_manager.SPARQLRepository != undefined)
			$('#input_url_repository_criteria').val(d.function_manager.SPARQLRepository);
		else
			$('#input_url_repository_criteria').val(repository);
		
		if(d.function_manager.logic_function1 != undefined)
		{
			if(d.function_manager.logic_function1.status == 0)
				$('#statusQuery1').attr("src","image/instance/grey_query.png");
			if(d.function_manager.logic_function1.status == 1)
				$('#statusQuery1').attr("src","image/instance/yellow_query.png");
			if(d.function_manager.logic_function1.status == 2)
				$('#statusQuery1').attr("src","image/instance/green_query.png");
			if(d.function_manager.logic_function1.status == 3)
				$('#statusQuery1').attr("src","image/instance/red_query.png");
			
			if(d.function_manager.logic_function1.status == 2)
				$('#resultQuery1').val(d.function_manager.logic_function1.result);
		}
		
		$("#query1").val(d.function_manager.logic_function1.query);
		$("#compare1").val(d.function_manager.logic_function1.compare);
		$("#threshold1LF1").val(d.function_manager.logic_function1.threshold1);
		$("#threshold2LF1").val(d.function_manager.logic_function1.threshold2);
		
		changeCompareLF1();
		
		if(d.function_manager.logic_function2 != undefined)
		{
			if(d.function_manager.logic_function2.status == 0)
				$('#statusQuery2').attr("src","image/instance/grey_query.png");
			if(d.function_manager.logic_function2.status == 1)
				$('#statusQuery2').attr("src","image/instance/yellow_query.png");
			if(d.function_manager.logic_function2.status == 2)
				$('#statusQuery2').attr("src","image/instance/green_query.png");
			if(d.function_manager.logic_function2.status == 3)
				$('#statusQuery2').attr("src","image/instance/red_query.png");
			
			if(d.function_manager.logic_function2.query != undefined)
				$("#query2").val(d.function_manager.logic_function2.query);
			else
				$("#query2").val("");
			if(d.function_manager.logic_function2.compare != undefined){
				$("#compare2").val(d.function_manager.logic_function2.compare);
				changeCompareLF2();
			}
			else
				$("#compare2").val(0);
			if(d.function_manager.logic_function2.threshold1 != undefined)
				$("#threshold1LF2").val(d.function_manager.logic_function2.threshold1);
			else
				$("#threshold1LF2").val("");
			if(d.function_manager.logic_function2.threshold2 != undefined)
				$("#threshold2LF2").val(d.function_manager.logic_function2.threshold2);	
			else
				$("#threshold2LF2").val("");
			if(d.function_manager.logic_function2.status == 2)
				$('#resultQuery2').val(d.function_manager.logic_function2.result);
		}
		else{
			$("#query2").val("");
			$("#compare2").val(0);
			$("#threshold1LF2").val("");
			$("#threshold2LF2").val("");
		}
		
		$("#select_LF1").val(d.function_manager.notFunction1);
		$("#select_andor").val(d.function_manager.logicConnector);
		$("#select_LF2").val(d.function_manager.notFunction2);
		$("#true1").val(d.function_manager.value_true1);
		$("#false1").val(d.function_manager.value_false1);
		$("#true2").val(d.function_manager.value_true2);
		$("#false2").val(d.function_manager.value_false2);
		$("#true3").val(parseFloat(Number(1-d.function_manager.value_true1-d.function_manager.value_true2).toFixed(3)));
		$("#false3").val(parseFloat(Number(1-d.function_manager.value_false1-d.function_manager.value_false2).toFixed(3)));
		
	}
	else{
		$('#input_url_repository_criteria').val(repository);
		
		clearIFWindow();
	}
}

function clearIFWindow()
{
	$("#query1").val("");
	$('#statusQuery1').attr("src","image/instance/grey_query.png");
	$('#resultQuery1').val("");
	$("#compare1").val(0);
	$("#threshold1LF1").val("");
	$("#threshold2LF1").val("");
	$("#query2").val("");
	$('#statusQuery2').attr("src","image/instance/grey_query.png");
	$('#resultQuery2').val("");
	$("#compare2").val(0);
	$("#threshold1LF2").val("");
	$("#threshold2LF2").val("");	
	
	$("#select_LF1").val(1);
	$("#select_andor").val(0);
	$("#select_LF2").val(0);
	$("#true1").val("");
	$("#false1").val("");
	$("#true2").val("");
	$("#false2").val("");
	$("#true3").val("");
	$("#false3").val("");
}
