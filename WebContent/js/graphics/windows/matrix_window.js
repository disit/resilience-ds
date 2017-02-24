
var vectWeights = null;
var matrixComparison = null;

// Richiesta al server del vettore dei pesi per il criterio specificato e apertura della finestra di inserimento
function controlWindow(id, array_text, n_matrix)
{
	clientRest.getDataCriteriaInstance("C"+id,"weights_retrieve"); // RICHIESTA AL SERVER DEL VETTORE DEI PESI E DELLA MATRICE
	
	createWindow(id, array_text, n_matrix);
}

// Funzione chiamata quando il server risponde alla richiesta del vettore dei pesi degli archi in entrata del criterio
function initVector()
{
	if(vectWeights != "")
	{
		for(var i = 0; i < vectWeights.length; i++)
		{
			$('#input_'+i).val(parseFloat(Number(vectWeights[i]).toFixed(3)));
		}
	}
}

// Funzione chiamata quando il server risponde alla richiesta della matrice usata per calcolare i pesi degli archi in entrata criterio
function initMatrix()
{
	if(matrixComparison != "")
	{
		for(var i = 1; i < (matrixComparison.length+1); i++)
		{
			for(var j = 1; j < (matrixComparison.length+1); j++)
			{
				$('#input_'+i+j).val(parseFloat(Number(matrixComparison[i-1][j-1]).toFixed(3)));
			}
		}
	}
}

function createWindow(id, array_text, n_matrix)
{
	var dialog = $('#modal').dialog({
		resizable: false,
        height: 400,
        width: 700,
        modal: true,
        dialogClass: 'no-close custom-dialog',
		buttons: [{ text: "Save" , click: function() { 
					
						if(inputMatrixNoEmpty(n_matrix) && ($('#matrix_tab').css("opacity") == 1.0))
						{					
							var str_data = "";
			        		var str_length = 0;
			        		for(var i = 1; i < n_matrix; i++)
			        		{
			        			for(var j = 1; j < n_matrix; j++)
			        			{
			        				if(i == (n_matrix-1) && j == (n_matrix-1))
			        					str_data += $('#input_'+(n_matrix-1)+(n_matrix-1)).val();
			        				else
			        					str_data += $('#input_'+i+j).val()+",";
			        				str_length += 1;
			        			}
			        		}
			        		
		        			// Richiesta REST per salvataggio matrice sul server
		        			clientRest.saveDataCriteriaInstance("C"+id, "matrix_comparison_insert", str_data);
		        			vectWeights = null;
							matrixComparison = null;
							criteriaInstanceId = id;
							
							document.getElementById('table_vector').remove();
							document.getElementById('table_matrix').remove();
				        	$(this).dialog('destroy');
						}
						else{
							if($('#matrix_tab').css("opacity") == 1.0)
								showAlert("It's not possible save the weights matrix - there're input without value");
								//$("#errmsg_matrix").html("Impossibile salvare la matrice dei pesi - <BR> presenti input senza valore!").show().fadeOut(4000);
						}
						 
						if(inputVectorNoEmpty(n_matrix) && ($('#vector_tab').css("opacity") == 1.0))
						{        		  
			        		str_data = "";
			        		str_length = 0;
			        		var sumVector = 0;
			        		for(var i = 0; i < n_matrix-2; i++)
			        		{
			        			str_data += $('#input_'+i).val()+",";
			        			str_length += 1;
			        			sumVector += parseFloat($('#input_'+i).val());
			        		}
			        		str_data += $('#input_'+(n_matrix-2)).val();
			        		str_length += 1;
			        		sumVector += parseFloat($('#input_'+(n_matrix-2)).val());
			        		
			        		if(sumVector > 0.99 && sumVector < 1.01)
			        		{
			        			clientRest.saveDataCriteriaInstance("C"+id, "vector_weights_insert", str_data); // Salvataggio sul server del vettore dei pesi
			        			vectWeights = null;
								matrixComparison = null;
								criteriaInstanceId = id;
								
								document.getElementById('table_vector').remove();
								document.getElementById('table_matrix').remove();
					        	$(this).dialog('destroy');
			        		}
			        		else
			        			showAlert("The sum of the weights vector element must be 1");
//			        			$("#errmsg_vector").html("La somma degli elementi del vettore dei pesi \ndeve essere uguale a 1!").show().fadeOut(4000);
						}
						else{
							if($('#vector_tab').css("opacity") == 1.0)
								showAlert("It's not possible save the weights vector - there're input without value");
//								$("#errmsg_vector").html("Impossibile salvare il vettore dei pesi - <BR> presenti input senza valore!").show().fadeOut(4000);
						}
		          	} 
				},
				{ text: "Reset", click: function() { 
		        	  	
		        	// Resettare gli edit che formano la matrice 
					if(matrixComparison != null)
					{
						for(var i = 1; i < n_matrix; i++)
						{
							for(var j = 1; j < n_matrix; j++)
							{
								if(matrixComparison != "")
									$('#input_'+i+j).val(matrixComparison[i-1][j-1]);
								else{
									if(i == j)
										$('#input_'+i+j).val("1");
									else 
										$('#input_'+i+j).val("");
								}
							}
						}
					}
		        	  	
					// Resettare gli edit che formano il vettore dei pesi da inserire 
					for(var i = 0; i < vectWeights.length; i++)
					{
						if(vectWeights != "")
							$('#input_'+i).val(vectWeights[i]);
						else
							$('#input_'+i).val("");
					}	
				} 
			}],
  		open: function(event, ui) { 
  			$("#matrix_tab").createMatrixTab(n_matrix, array_text, id);
  			$("#vector_tab").createVectorTab(n_matrix, array_text);
  		},
	
		close: function(event, ui){
			document.getElementById('table_vector').remove();
			document.getElementById('table_matrix').remove();
			
			vectWeights = null;
			matrixComparison = null;
			
			$(this).dialog('destroy');
	    }	   
	});
	
	$('#modal').on('keyup', function(e) {
		if (e.keyCode == 13) //enter
		{
			var buttons = dialog.dialog('option', 'buttons');
			buttons[0].click.apply(dialog);
		}   
	});
}

// Creazione del finestra in cui inserire il vettore dei pesi degli archi
$.fn.createVectorTab = function(n_matrix, array_text){
	
	console.log("Creazione input matrice con " + n_matrix + " elementi e " + array_text);
	
	var vector_table = $(document.createElement('table'));
	vector_table.attr('id','table_vector');
	vector_table.attr('border-spacing',10);
	vector_table.attr('align','center');
	
	for(var r = 0; r < n_matrix-1; r++)
	{
		var tr = $(document.createElement('tr'));
		
		var td1 = $(document.createElement('td'));
		var td2 = $(document.createElement('td'));
		
		var div_text = $(document.createElement('div'));
		var text = $(document.createTextNode(array_text[r]));
		div_text.append(text);
		
		td1.append(div_text);
		
		var input_text_vect = $(document.createElement('input'));
		input_text_vect.attr("type",'text');
		input_text_vect.attr("maxLenght",5);
		input_text_vect.attr("size",5);
		input_text_vect.attr("id","input_"+r);
		input_text_vect.on("input", function() {
			
			var id_this = this.id.substring(this.id.indexOf("_")+1);
			if($.isNumeric(this.value) === true) 
			{
				if(parseFloat(this.value) >= 0 && parseFloat(this.value) <= 1)
				{
					for(var t = 1; t < n_matrix; t++)
					{
						for(var s = 1; s < n_matrix; s++)
						{
							if(t != s)
								$('#input_'+t+s).val("");
						}
					}
				}
				else
				{
					showAlert("The digit must be a number between 0 and 1");
//					$("#errmsg_vector").html("DIGITS: BETWEEN 0-1").show().fadeOut(2000);
					this.value = "";
				}
			}
			else{
				showAlert("The digit must be a number between 0 and 1");
				$("#errmsg_vector").html("DIGITS ONLY").show().fadeOut(2000);
				this.value = "";
			}
		});
		td2.append(input_text_vect);	
		
		tr.append(td1);
		tr.append(td2);
		
		vector_table.append(tr);
	}
	
	$(this).append(vector_table);
}

//Creazione del finestra in cui inserire la matrice dei confronti a coppie per il calcolo dei pesi degli archi
$.fn.createMatrixTab = function( n_matrix, array_text, id){ 
	
	console.log("Creazione input matrice");

	var matrix_table = $(document.createElement('table'));
	matrix_table.attr('id','table_matrix');
	matrix_table.attr('border-spacing', 10);
	matrix_table.attr('align','center');
	
	for(var r = 0; r < n_matrix; r++)
	{
		var tr = $(document.createElement('tr'));
		
		if(r == 0)
		{
			for (var c = 0; c < n_matrix; c++)
			{
				var td = $(document.createElement('td'));
				var text;
				var div_text = $(document.createElement('div'));
				if(c == 0)
				{
					text = $(document.createTextNode(' '));
					div_text.append(text);
				}
				else
				{
					text = $(document.createTextNode(array_text[c-1]));
					div_text.append(text);
				}
					
				td.append(div_text);
				tr.append(td);
			}	
		}
		else{
			for (var c = 0; c < n_matrix; c++)
			{
				var td = $(document.createElement('td'));
				if(c == 0)
				{
					var text;
					if(r == 0)
						text = $(document.createTextNode(' '));
					else
						text = $(document.createTextNode(array_text[r-1]));
					td.append(text);
				}
				else{
					
					var input_text = $(document.createElement('input'));					
					input_text.attr("type",'text');
					input_text.attr("maxLenght",5);
					input_text.attr("size",5);
					input_text.attr("id","input_"+r+c);			
					
					if(r == c)
					{
						input_text.attr("disabled",true);
						input_text.attr("value","1");
					}
					if(r > c)
						input_text.attr("disabled",true);
					if(r < c)
					{		
						input_text.on("input", function() {
							
							var id_this = this.id.substring(this.id.indexOf("_")+1);
							if($.isNumeric(this.value) === true) 
							{
								var number = parseFloat(Number(this.value).toFixed(3));
								var mutual_number = parseFloat((1/Number(this.value)).toFixed(3));
								if(parseFloat(this.value) >= 0 && parseFloat(this.value) < 10)
								{
									if(this.value != "0" && this.value != "0.")
										$('#input_'+id_this[1]+id_this[0]).val(mutual_number);
									
									for(var t = 0; t < (n_matrix-1); t++)
										$('#input_'+t).val("");
								}
								else
								{
									showAlert("The digit must be a number between 0 and 9");
//									$("#errmsg_matrix").html("DIGITS: 0-9").show().fadeOut(2000);
									this.value = "";
									$('#input_'+id_this[1]+id_this[0]).val("");
								}
							}
							else{
								showAlert("The digit must be a number between 0 and 9");
								this.value = "";
								$('#input_'+id_this[1]+id_this[0]).val("");
							}
						});
					}
					td.append(input_text);	
				}
				tr.append(td);
			}	
		}
			
		matrix_table.append(tr);
	}
		
	$(this).append(matrix_table);
}

function inputMatrixNoEmpty(n_matrix)
{
	for(var i = 1; i < n_matrix; i++)
	{
		for(var j = 1; j < n_matrix; j++)
		{
			if($('#input_'+i+j).val() == "")
				return false;
		}
	}
	return true;
}

function inputVectorNoEmpty(n_vector)
{
	for(var i = 0; i < n_vector-1; i++)
	{
		if($('#input_'+i).val() == "")
			return false;	
	}
	return true;
}