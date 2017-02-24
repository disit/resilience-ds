/* ResilienceDS
   Copyright (C) 2017 DISIT Lab http://www.disit.org - University of Florence

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU Affero General Public License as
   published by the Free Software Foundation, either version 3 of the
   License, or (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU Affero General Public License for more details.

   You should have received a copy of the GNU Affero General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>. */

/*
 * Classe definita per gestire gli oggetti grafici presenti
 */
var View = function(obj_window, obj_document){
	var obj_w = obj_window;
	var obj_d = obj_document;

	// Funzione che consente l'apertura di una alert con il messaggio passato come parametro
	this.messageBox = function(stringMessage)
	{
		alert(stringMessage);
	}
	
	this.returnXmlModel = function(obj_xml)
	{
		xmlModel(obj_xml);
	}
	
	this.returnXmlInstance = function(obj_xml)
	{
		xmlInstance(obj_xml);
	}

	/* ---------------------------------------------------------------------------------------------------------------- */
	/* --------------------------- GESTIONE GRAFICA DELLA PARTE RELATIVA AI MODELLI ----------------------------------- */ 
	/* ---------------------------------------------------------------------------------------------------------------- */
	
	this.listModelsFromServer = function()
	{
		// Funzione in menu.html richiamata quando si ha la lista dei modelli sul server
		listModelDone();
	}

	// Funzione utilizzata quando si richiedono tutti i modelli presenti sul server
	this.updateMenuModels = function()
	{
		// Richiama la funzione updateMenuModel in menu.html
		updateMenuModel();
	}
	
	this.visualizeModelSelected = function(idUserModel)
	{
		//Ale: Calls the function visualize_model in visualize_model.jsp
		visualize_FRAMmodel(idUserModel);
//		visualize_model(idUserModel);
	}
	
	this.updateNameModel = function(textModel, idModel)
	{
		updateMenuNameModel(textModel, idModel);
		changeNameRoot(textModel);
	}
	this.updateDateLastModifyModel = function(new_date){
		updateDateLastModify(new_date);
	}
	
	//XXX OLD Funzione per la gestione grafica chiamata nella risposta alla modifica della descrizione di un criterio nel modello
	this.updateMenuModifyCriteria = function(textModel, idModel)
	{
		// Funzione in menu.html - si modifica il text con textModel del button corrispondente al idModel passato
		updateMenuCriteriaModel(textModel, idModel);
		
		// Funzione in menu.html - Si visualizza l'icona del salvataggio nel button corrispondente al modello selezionato 
		showSaveIconModel();
	}
	/**
	 * Functions in menu.html - Shows the save icon
	 */
	this.modifyFRAMModel = function()
	{
//		console.log("Modify FRAM Models.");
		var index_notsaved = util.getIndexById(models_notsaved, modelId);
		var index_db = util.getIndexById(models_db, modelId);
		var index_tmp = util.getIndexById(models_tmp, modelId);
		
		if(index_db != -1 && index_notsaved == -1)
			models_notsaved.push(new Model(models_db[index_db].getId(), models_db[index_db].getObjective(), models_db[index_db].getUserId(), models_db[index_db].getUrl(), models_db[index_db].getDescription(), models_db[index_db].getDateCreate(), models_db[index_db].getDateLastModify()));
		
		if(index_tmp != -1 && index_notsaved == -1)	
			models_notsaved.push(new Model(models_tmp[index_tmp].getId(), models_tmp[index_tmp].getObjective(), models_tmp[index_tmp].getUserId(), models_tmp[index_tmp].getUrl(), models_tmp[index_tmp].getDescription(), models_tmp[index_tmp].getDateCreate(), models_tmp[index_tmp].getDateLastModify()));
		
		// Funzione in menu.html - Si visualizza l'icona del salvataggio nel button corrispondente al modello selezionato 
		showSaveIconModel();		
	}
	/**
	 * Functions in menu.html - Shows the save icon for the instance.
	 */
	this.modifyFRAMModelInstance = function()
	{
		console.log("Modify FRAM Models.");
		var index_notsaved = util.getIndexById(modelinstances_notsaved, modelInstanceId);
		var index_db = util.getIndexById(modelinstances_db, modelInstanceId);
		var index_tmp = util.getIndexById(modelinstances_tmp, modelInstanceId);
		
		if(index_db != -1 && index_notsaved == -1)
			modelinstances_notsaved.push(new FRAMModelInstance(modelinstances_db[index_db].getId(), modelinstances_db[index_db].getSpecificObjective(), modelinstances_db[index_db].getModelId(), modelinstances_db[index_db].getUserId(), modelinstances_db[index_db].getDateCreate(), modelinstances_db[index_db].getDateLastModify()));
		
		if(index_tmp != -1 && index_notsaved == -1)	
			modelinstances_notsaved.push(new FRAMModelInstance(modelinstances_tmp[index_tmp].getId(), modelinstances_tmp[index_tmp].getSpecificObjective(), modelinstances_tmp[index_db].getModelId(), modelinstances_tmp[index_tmp].getUserId(), modelinstances_tmp[index_tmp].getDateCreate(), modelinstances_tmp[index_tmp].getDateLastModify()));
		
		// Funzione in menu.html - Si visualizza l'icona del salvataggio nel button corrispondente al modello selezionato 
		showSaveIconInstance();		
	}
	//XXX OLD
	this.modifyCriteriaModel = function()
	{
		// Funzione in menu.html - Si visualizza l'icona del salvataggio nel button corrispondente al modello selezionato 
		showSaveIconModel();
	}
	
	// Funzione per la gestione grafica chiamata nella risposta al salvataggio del modello selezionato
	this.modelSaved = function()
	{
		// Funzione in menu.html - Si nasconde l'icona del salvataggio nel button corrispondente al modello selezionato 
		hideSaveIconModel(); 
		
		// Link alla pagina di visualizzazione del modello salvato 
//		openLink("visualize_model.jsp",'section'); 
	}
	
	// Funzione per la gestione grafica chiamata nella risposta alla clonazione del modello selezionato
	this.modelCloned = function(id_model, withInstance)
	{
		// Funzione in menu.html - si ricrea il menu per aggiornarlo con il nuovo modello clonato da quello selezionato
		this.updateMenuModels();
//		modelId = id_model; // si aggiorna la variabile globale che contiene l'id del modello selezionato
//		
//		// Controllo se questa funzione (modelCloned) è stata chiamata in conseguenza ad una clonazione di un modello o di un'istanza
//		if(withInstance == true)
//			clientRest.cloneModelInstance(); // caso in cui clono un'istanza - devo clonare anche il modello collegato all'istanza
//		else
//			openLink("visualize_model.jsp",'section'); // caso in cui clono un modello - apro la visualizzazione del modello
	}
	
	this.resetModelTMP = function()
	{
//		openLink('new_model.jsp','section');
		openLink('new_FRAMmodel.jsp','section');
	}
	
	this.resetModelDB = function()
	{
		openLink('edit_model.jsp','section');
	}
	
	/* ---------------------------------------------------------------------------------------------------------------- */
	/* ---------------------- GESTIONE GRAFICA DELLA PARTE RELATIVA ALLE ISTANZE DEI MODELLI -------------------------- */ 
	/* ---------------------------------------------------------------------------------------------------------------- */
	
	this.updateListInstanceModels = function()
	{
		// Richiama la funzione createMenu in menu.html
		createMenu();
	}
	
	//XXX OLD
	this.updateListStatusInstanceModels = function()
	{
		// Richiama la funzione refreshStatusInstances in menu.html
		refreshStatusInstances();
	}
	
	// Funzione utilizzata quando si richiedono tutte le istanze presenti sul server
	this.updateMenuInstances = function()
	{
		// Richiama la funzione updateMenuInstance in menu.html
		updateMenuNav();
	}
	
	// Funzione per la gestione grafica chiamata nella risposta alla modifica del nome di un'istanza
	this.updateMenuModifyInstance = function(textInstance, idModel, idModelInstance)
	{
		// Funzione in menu.html - si modifica il text con textInstance del button corrispondente al idModelInstance passato
		updateMenuNameInstance(textInstance, idModel, idModelInstance);
		
		// Funzione in operations_instance per modificare il nome del nodo root
		changeSpecObjectRoot();
		
		// Funzione in menu.html - Si visualizza l'icona del salvataggio nel button corrispondente al modello selezionato 
//		showSaveIconInstance();
	}
	
	this.updateWeightsView = function(data_criteria, type)
	{
		// Funzioni in matrix_window.js per l'inizializzazione della finestra di modifica dei pesi degli archi uscenti da un nodo 
		if(type == "matrix")
		{
			matrixComparison = util.tokenizerMatrix(data_criteria);
			initMatrix();
		}
		else if(type == "vector") 
		{
			vectWeights = util.tokenizerVector(data_criteria);
			initVector();
		}
	}
	
	this.newInstance = function(specific_object)
	{
		// Richiama la funzione new_instance in new_instance.jsp
//		new_instance(specific_object);
		console.log("Create a FRAM Instance");
		new_FRAMinstance(specific_object);
	}
	
	this.visualizeInstanceSelected = function(idUser, specific_object, arrayIFIncogruent)
	{
		// Richiama la funzione visualize_instance in visualize_instance.jsp
		visualize_instance(idUser, specific_object, arrayIFIncogruent);
	}
	this.visualizeFRAMInstanceSelected = function(idUser)
	{
		visualize_FRAMinstance(idUser);
	}
	
	this.instanceSaved = function()
	{
//		saveInstance(); // funzione in menu.html per l'aggiornamento dopo il salvataggio di un'instanza
		
		// Funzione in menu.html - Si nasconde l'icona del salvataggio nel button corrispondente al modello collegato all'istanza selezionata 
		hideSaveIconModel(); 
		// Funzione in menu.html - Si nasconde l'icona del salvataggio nel button corrispondente all'istanza selezionata 
		hideSaveIconInstance(); 
		
//		openLink('visualize_instance.jsp','section'); // Richiamo la pagina visualizzazione dell'istanza salvata
	}
	
	this.instanceCloned = function(id_instance)
	{
		this.updateMenuInstances();
		modelInstanceId = id_instance;
		openLink('visualize_instance.jsp','section');
	}
	
	this.computeDecisionInstance = function(idUser, specific_object, arrayIFIncongruent)
	{
//		compute_decision(specific_object);
		visualize_instance(idUser, specific_object, arrayIFIncongruent)
		alertIFIncongruent(arrayIFIncongruent);
	}
	//XXX OLD
	this.editWeightsAndIFModelInstance = function()
	{
		clientRest.getDataCriteriaInstance("C"+criteriaInstanceId, "weights_retrieve");
		
		refreshStatusInstances();
		
		// Funzione in menu.html - Si visualizza l'icona del salvataggio nel button corrispondente all'istanza selezionata 
		showSaveIconInstance(); 
	}
	
	this.updateWeightsEdgeInstance = function(weights, criteriaInstancePosition)
	{
		changeWeightsInstance(weights, criteriaInstancePosition); 
	}
	//XXX OLD
	this.editLFCriteriaModel = function()
	{
		refreshStatusInstances();
		
		showSaveIconInstance(); 
	}
	
	this.clearMainDIV = function()
	{
		disableSubMenu();
		if($('#model_body').length > 0)
			$('#model_body').empty();
		if($('#instance_body').length > 0)
			$('#instance_body').empty();
	}
	
//	this.enabledButtonImport = function()
//	{
//		enableImport();
//	}
	
//	this.createSelectInstancesImportData = function()
//	{
//		var options_modelinstances = "<option value=\"0\">Select Instance For Data Import</option>"; 
//		
////		alert(modelinstances_to_import_data);
//		
//		for(var i=0; i<modelinstances_to_import_data.length; i++)
//			options_modelinstances += "<option value=\""+modelinstances_to_import_data[i].getId()+"\">"+modelinstances_to_import_data[i].getId()+" - "+modelinstances_to_import_data[i].getSpecificObjective()+" (userId="+modelinstances_to_import_data[i].getUserId()+")</option>";
//		return options_modelinstances;
//	}
	
	this.createSelectInstancesImportData = function()
	{
		options_modelinstances = "<option value=\"0\">Select Instance For Data Import</option>"; 
		
		for(var i=0; i<modelinstances_to_import_data.length; i++)
			options_modelinstances += "<option value=\""+modelinstances_to_import_data[i].getId()+"\">"+modelinstances_to_import_data[i].getId()+" - "+modelinstances_to_import_data[i].getSpecificObjective()+" (userId="+modelinstances_to_import_data[i].getUserId()+")</option>";
	}
	
//	this.addModelInstancesImportData = function(options_import_data_instances)
//	{
//		setSelect(options_import_data_instances);
//	}
	
	this.visualizeInstanceImported = function()
	{
		openLink('visualize_instance.jsp','section');
	}
	
	this.resetModelInstanceTMP = function()
	{
		console.log("Open Link to instance.");
		openLink('new_FRAMinstance.jsp','section');
//		openLink('new_instance.jsp','section'); //XXX Old
	}
	
	this.resetModelInstanceDB = function()
	{
		openLink('edit_instance.jsp','section');
	}
	
	this.insertResultQuery = function(type, result, status)
	{
		if(type == 1)
		{
			$('#resultQuery1').val(result);
			
			if(status == 0)
				$('#statusQuery1').attr("src","image/instance/grey_query.png");
			else if(status == 1)
				$('#statusQuery1').attr("src","image/instance/yellow_query.png");
			else if(status == 2)
				$('#statusQuery1').attr("src","image/instance/green_query.png");
			else if(status == 3)
				$('#statusQuery1').attr("src","image/instance/red_query.png");
		}
		else if(type == 2){
			$('#resultQuery2').val(result);
			
			if(status == 0)
				$('#statusQuery2').attr("src","image/instance/grey_query.png");
			else if(status == 1)
				$('#statusQuery2').attr("src","image/instance/yellow_query.png");
			else if(status == 2)
				$('#statusQuery2').attr("src","image/instance/green_query.png");
			else if(status == 3)
				$('#statusQuery2').attr("src","image/instance/red_query.png");
		}	
	}
	
	/* ---------------------------------------------------------------------------------------------------------------- */
	/* --------------------------- GESTIONE GRAFICA DELLA PARTE RELATIVA AGLI UTENTI ---------------------------------- */ 
	/* ---------------------------------------------------------------------------------------------------------------- */
	
	this.updateUserData = function(id_user, email, name, country)
	{
		// Funzione in slider.html per l'aggiornamento dei dati utente dopo una modifica
		getUserData(id_user, email, name, country);
	}
	
	this.updateUserType = function(id_user, userType)
	{
		// Funzione in slider.html per l'aggiornamento del tipo di un utente registrato da parte dell'amministratore
		getUserType(id_user, userType);
	}
	
	
}