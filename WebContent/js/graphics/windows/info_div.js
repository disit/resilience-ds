/**
 * Funzioni per la gestione del div che contiene le info sul modello o istanza modello selezionata
 */

function initInfoDiv(type_svg)	// Richiamata da submenu.html in function createSubmenu(idPage, idUser)
{
	
	$('#model_instancemodel_info').show(500);
	$('#model_instancemodel_info').css("cursor","move");
	
	$('#userInfo').css("display","none");
	$('#spanUser').css("display","none");
	
	var model, user_model, instance;
	
	// Rappresentazione info modello selezionato
	if(type_svg == "model")
	{
		$("#buttonModifyInfoModel").show();
		$("#buttonModifyInfoInstance").css('display','none');
		
		$("#spanNameInstance").css('display','none');
		$("#nameInstanceInfo").css('display','none');
		$("#inputNameInstance").css('display','none');
		$("#labelConfirmInput").css('display','none');
		// $("#spanTimeStartExec").css('display','none');
		// $("#spanTimeEndExec").css('display','none');
		// $("#startExecInfo").css('display','none');
		// $("#endExecInfo").css('display','none');
		
		if(util.getIndexById(models_db, modelId) > -1)
			model = models_db[util.getIndexById(models_db, modelId)];
		else if(util.getIndexById(models_tmp, modelId) > -1)
			model = models_tmp[util.getIndexById(models_tmp, modelId)];

		if(user.getType() === 4)
		{
			user_model = users[util.getIndexById(users, model.getUserId())];
			
			$('#userInfo').show();
			$('#spanUser').show();
			$('#userInfo').text(user_model.getId()+" - "+user_model.getName());
		}
		
		if(user.getId() == model.getUserId())
		{
			$('#buttonModifyInfoModel').attr('disabled',false).css('opacity',1);
			$('#buttonModifyInfoModel').attr('title','Edit information model');
		}
		else
		{
			$("#buttonModifyInfoModel").attr('disabled','disabled').css('opacity',0.5);
			$('#buttonModifyInfoModel').attr('title','Edit information model disabled: the selected model has another owner.');
		}
		
		$('#nameModelInfo').text(model.getObjective());
//		$('#urlInfo').text(model.getUrl());
		
		$('#urlInfo').empty();
		if(model.getUrl() != "" && model.getUrl() != "null" && model.getUrl() != "url")
		{
			var link = $(document.createElement("a"));
		    link.attr("href","http://" + model.getUrl());
		    link.attr("target","_blank");
		    link.text(model.getUrl());
		    
		    $('#urlInfo').append(link);
		}else
			$('#urlInfo').text(model.getUrl());
		
		$('#descriptionInfo').text(model.getDescription());
		$('#dateCreateInfo').text(model.getDateCreate());
		$('#dateLastModifyInfo').text(model.getDateLastModify());
		
		$('#urlInfo').show();
		$('#descriptionInfo').show();
		$('#spanUrl').show();
		$('#spanDescription').show();
		
		$('#view-xml').attr("title","Click to view XML of selected model in new tab browser");
	}
	else{ // Rappresentazione info istanza selezionata
		
		$("#buttonModifyInfoInstance").show();
		$("#buttonModifyInfoModel").css('display','none');
		
		$("#spanNameInstance").show();
		$("#nameInstanceInfo").show();
		$("#inputNameInstance").css('display','none');
		$("#labelConfirmInput").css('display','none');
		$("#spanTimeStartExec").show();
		$("#spanTimeEndExec").show();
		$("#startExecInfo").show();
		$("#endExecInfo").show();
		
		if(util.getIndexById(modelinstances_db, modelInstanceId) > -1)
		{
//			model = models_db[util.getIndexById(models_db, modelId)];
//			instance = modelinstances_db[util.getIndexById(modelinstances_db, modelInstanceId)];
			
			instance = modelinstances_db[util.getIndexById(modelinstances_db, modelInstanceId)];
			model = models_db[util.getIndexById(models_db, instance.getModelId())];
		}
		else if(util.getIndexById(modelinstances_tmp, modelInstanceId) > -1) {
//			if(util.getIndexById(models_db, modelId) > -1)
//				model = models_db[util.getIndexById(models_db, modelId)];
//			else
//				model = models_tmp[util.getIndexById(models_tmp, modelId)];
//			
			instance = modelinstances_tmp[util.getIndexById(modelinstances_tmp, modelInstanceId)];
			
			if(util.getIndexById(models_db, instance.getModelId()) > -1)
				model = models_db[util.getIndexById(models_db, instance.getModelId())];
			else if(util.getIndexById(models_tmp, instance.getModelId()) > -1)
				model = models_tmp[util.getIndexById(models_tmp, instance.getModelId())];
		}
		
		if(user.getType() === 4)
		{
			user_instance = users[util.getIndexById(users, instance.getUserId())];
			
			$('#userInfo').show();
			$('#spanUser').show();
			$('#userInfo').text(user_instance.getId()+" - "+user_instance.getName());
		}
		
		if(user.getId() == instance.getUserId())
		{
			$('#buttonModifyInfoInstance').attr('disabled',false).css('opacity',1);
			$('#buttonModifyInfoInstance').attr('title','Edit information instance');
		}
		else{
			$("#buttonModifyInfoInstance").attr('disabled','disabled').css('opacity',0.5);
			$('#buttonModifyInfoInstance').attr('title','Edit information process disabled: the selected process has another owner.');
		}
			
		
		$('#nameModelInfo').text(model.getObjective());
		$('#nameInstanceInfo').text(instance.getSpecificObjective());
		$('#dateCreateInfo').text(instance.getDateCreate());
		$('#dateLastModifyInfo').text(instance.getDateLastModify());
//		$("#startExecInfo").text(instance.getStartExec());
//		$("#endExecInfo").text(instance.getEndExec());
		
		$('#urlInfo').css("display","none");
		$('#descriptionInfo').css("display","none");
		$('#spanUrl').css("display","none");
		$('#spanDescription').css("display","none");
		
		$('#view-xml').attr("title","Click to view XML of selected model in new tab browser");
	}
}

function clickModifyInfoInstance()
{
	$("#nameInstanceInfo").css('display','none');
	$('#inputNameInstance').show();
	$('#inputNameInstance').val($("#nameInstanceInfo").text());
	$("#labelConfirmInput").show();
	
	selectTextNameInstance(); // funzione in home.jsp per selezionare il testo dell'input di default
	
	$("#inputNameInstance").keyup(function(e){
		
		if(e.keyCode == '13')
		{
			if($("#inputNameInstance").val() != "")
			{
				//clientRest.  //RICHIESTA REST PER LA MODIFICA DEL NOME DELL'ISTANZA...
				clientRest.modifyDataModelInstance($('#inputNameInstance').val());
				
				$("#nameInstanceInfo").text($('#inputNameInstance').val());
			}
			
			$("#nameInstanceInfo").show();
			$('#inputNameInstance').css('display','none');
			$("#labelConfirmInput").css('display','none');
		}
		if(e.keyCode == '27')
		{
			$("#nameInstanceInfo").show();
			$('#inputNameInstance').css('display','none');
			$("#labelConfirmInput").css('display','none');
		}
	});
	
	$("#inputNameInstance").focusout(function(e){
		if($("#inputNameInstance").val() != "")
		{
			//clientRest.  //RICHIESTA REST PER LA MODIFICA DEL NOME DELL'ISTANZA...
			clientRest.modifyDataModelInstance($('#inputNameInstance').val());
			
			$("#nameInstanceInfo").text($('#inputNameInstance').val());
		}
		
		$("#nameInstanceInfo").show();
		$('#inputNameInstance').css('display','none');
		$("#labelConfirmInput").css('display','none');
	});
}