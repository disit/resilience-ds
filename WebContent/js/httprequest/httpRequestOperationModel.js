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
 * Classe definita per gestire le richieste REST effettuate dal client per operazioni di creazione e modifica 
 * di risorse Model
 */
var HTTPRequestOperationModel = function( )
{
	var type;
	var address_request;
	var async_mode;
	var req_xml;
	var this_app = this;
	
	// Funzione che memorizza il tipo di richiesta nella variabile type, l'indirizzo in address_c e 
	// la modalità di risposta async_mode_c = true se � richiesta una connessione asincrona 
	// e async_mode_c = false per quella sincrona
	this.createRequest = function(type_c, address_c, async_mode_c)
	{
		type = type_c;
		address_request = address_c;
		async_mode = async_mode_c;
	}
		
	// Funzione che invia al server una richiesta POST o PUT in formato XML per creazione o modifica di una risorsa Model
	this.doRequestXML = function(xml_model, operation)
	{		
		req_xml = new XMLHttpRequest();
		req_xml.open(type, address_request, async_mode);
		//req_json.setRequestHeader("Accept","application/json");
		req_xml.setRequestHeader("Content-Type","application/xml");
		if(operation == "printModel")
			req_xml.onreadystatechange = function(){ this_app.responsePrintModelXML(); };
		else if(operation == "saveModel")
			req_xml.onreadystatechange = function(){ this_app.responseSaveModelXML(); };
		else if(operation == "saveFullFRAMModel")
			req_xml.onreadystatechange = function(){ this_app.responseSaveModelXML(); };
		else if(operation == "saveFMVModel")
			req_xml.onreadystatechange = function(){ this_app.responseSaveXFMVModel(); }; 
		else if(operation == "cloneModelWithoutInstance")
			req_xml.onreadystatechange = function(){ this_app.responseCloneModelXML(); };
		else if(operation == "cloneModelWithInstance")
			req_xml.onreadystatechange = function(){ this_app.responseCloneModelWithInstanceXML(); };
		else if(operation == "resetModel")
				req_xml.onreadystatechange = function(){ this_app.responseResetModelXML(); };
		else if(operation == "exportModelToSmartDS")
			req_xml.onreadystatechange = function(){ this_app.responseExportFRAMModelXML(); };
		else if(operation == "importResoluteModel")
			req_xml.onreadystatechange = function(){ this_app.responseImportResoluteModel();};
		
		req_xml.send(xml_model);
	}
	
	
	// Funzione che cattura la risposta alla richiesta PUT in formato XML per la modifica di una risorsa Model per la modifica di un Criteria
	this.responsePrintModelXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			view.messageBox("Modello "+modelId+" stampato sul server");
		}	
	}
	
	
	// Funzione che cattura la risposta alla richiesta PUT in formato XML per la modifica di una risorsa Model per la modifica di un Criteria
	this.responseSaveModelXML = function()
	{
		
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{	
			
			// Spostamento del modello dal vettore dei modelli tmp a quello dei modelli salvati
			var index = util.getIndexById(models_tmp, modelId);
			if(index != -1)
			{
				models_db.push(new Model(models_tmp[index].getId(), models_tmp[index].getObjective(), models_tmp[index].getUserId(),models_tmp[index].getUrl(), models_tmp[index].getDescription(), models_tmp[index].getDateCreate(), models_tmp[index].getDateLastModify()));
				models_tmp.splice(index,1);	
			}			
			var index_notsaved = util.getIndexById(models_notsaved, modelId);
			if(index_notsaved != -1)
			{
				models_notsaved.splice(index_notsaved,1);	
			}			
			view.modelSaved();
		}	
	}
	
	// Ale Respons to the requesr for the creation of a new model.
	this.responseSaveXFMVModel = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var dom_obj = req_xml.responseXML;
			modelId = dom_obj.getElementsByTagName("modelId")[0].textContent;
			
			var objective = dom_obj.getElementsByTagName("objective")[0].textContent;
			var userId = dom_obj.getElementsByTagName("modelUserId")[0].textContent;
			var urlModel = "";
			var descriptionModel = "";
			if(dom_obj.getElementsByTagName("description_model")[0] != undefined)
				descriptionModel = dom_obj.getElementsByTagName("description_model")[0].textContent;
			var date_createModel = dom_obj.getElementsByTagName("date_create_model")[0].textContent;
			var date_lastmodifyModel = dom_obj.getElementsByTagName("date_last_modify_model")[0].textContent;
			
			models_db.push(new Model(modelId, objective, userId, urlModel, descriptionModel, date_createModel, date_lastmodifyModel));
//			models_tmp.push(new Model(modelId, objective, userId, urlModel, descriptionModel, date_createModel, date_lastmodifyModel));
//			models_notsaved.push(new Model(modelId, objective, userId, urlModel, descriptionModel, date_createModel, date_lastmodifyModel));
//			modelnotsaved_update();
			if(dom_obj.getElementsByTagName("modelinstance").length>0){ // Adds also the instance if present.
				var modelInstanceId = dom_obj.getElementsByTagName("modelInstanceId")[0].textContent;
				var specific_objective = dom_obj.getElementsByTagName("specific_objective")[0].textContent;
				modelinstances_db.push(new FRAMModelInstance(modelInstanceId, specific_objective, modelId, userId, date_createModel, date_lastmodifyModel));
//				modelinstances_tmp.push(new FRAMModelInstance(modelInstanceId, specific_objective, modelId, userId, date_createModel, date_lastmodifyModel));
			}
			alert("Model imported on server.");
			console.log("Modello aggiunto sul server con id "+modelId);
			
			var obj_xml = req_xml.responseXML;	
			
			view.updateMenuModels();
		}	
	}
	
	this.responseCloneModelXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var obj_xml = req_xml.responseXML;
			var modelIdStart = modelId;
			
//			alert(req_xml.responseText);
			
			modelId = obj_xml.getElementsByTagName("modelId")[0].textContent;
			
			var objective = obj_xml.getElementsByTagName("objective")[0].textContent;
			var userId = obj_xml.getElementsByTagName("modelUserId")[0].textContent;
			var urlModel = "";
//			var urlModel = obj_xml.getElementsByTagName("url")[0].textContent;
			var descriptionModel = obj_xml.getElementsByTagName("description")[0].textContent;
			var date_createModel = obj_xml.getElementsByTagName("date_create_model")[0].textContent;
			var date_lastmodifyModel = obj_xml.getElementsByTagName("date_last_modify_model")[0].textContent;
			
			// Aggiunta del modello nella lista temporanea dei modelli
//			models_tmp.push(new Model(modelId, objective, userId, urlModel, descriptionModel, date_createModel, date_lastmodifyModel));
			
			// Aggiunta del modello nella lista dei modelli che ancora non sono stati salvati su DB
//			models_notsaved.push(new Model(modelId, objective, userId, urlModel, descriptionModel, date_createModel, date_lastmodifyModel));
			
			// Aggiunta del modello nella lista di quelli clonati
			var model_cloned = new Model(modelId, objective, userId, urlModel, descriptionModel, date_createModel, date_lastmodifyModel);
//			idModel, objectiveModel, idUser, urlModel, descriptionModel, date_createModel, date_lastmodifyModel
//			var model_cloned = new ModelCloned(modelId, modelIdStart);
			models_db.push(model_cloned);
			
			view.modelCloned(modelId, false);

			toastr.info("Model: '"+objective+"' Cloned ");
		}	
	}
	
	this.responseCloneModelWithInstanceXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var obj_xml = req_xml.responseXML;
			var modelIdStart = modelId;
			
			var id_model = obj_xml.getElementsByTagName("modelId")[0].textContent;
			var objective = obj_xml.getElementsByTagName("objective")[0].textContent;
			var userId = obj_xml.getElementsByTagName("modelUserId")[0].textContent;
			var urlModel = obj_xml.getElementsByTagName("url")[0].textContent;
			var descriptionModel = obj_xml.getElementsByTagName("description")[0].textContent;
			var date_createModel = obj_xml.getElementsByTagName("date_create_model")[0].textContent;
			var date_lastmodifyModel = obj_xml.getElementsByTagName("date_last_modify_model")[0].textContent;
			
			// Aggiunta del modello nella lista temporanea dei modelli
			models_tmp.push(new Model(id_model, objective, userId, urlModel, descriptionModel, date_createModel, date_lastmodifyModel));
			
			// Aggiunta del modello nella lista dei modelli che ancora non sono stati salvati su DB
			models_notsaved.push(new Model(id_model, objective, userId, urlModel, descriptionModel, date_createModel, date_lastmodifyModel));
			
			// Aggiunta del modello nella lista di quelli clonati
			var model_cloned = new ModelCloned(id_model, modelIdStart);
			models_cloned.push(model_cloned);
			
			view.modelCloned(id_model, true);
			
		}	
	}
	
	this.responseResetModelXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var xml_obj = req_xml.responseXML;
			if(xml_obj == null)
			{
				var index = util.getIndexById(models_tmp, modelId);
				models_tmp.splice(index,1);

				modelId = null;
				
				view.resetModelTMP();
			}else{
				
				var xtree = new XML.ObjTree();
				var json = xtree.parseXML(req_xml.responseText);
				var json_string_complete = util.JSONToString(json);
				var json_string = util.adjustStringToModelTree(json_string_complete);
				json_string = util.adjustStringToModelWithOneChildren(json_string);
				json_data = util.StringToJSON(json_string);
				
				view.resetModelDB();
			}
			
			var index = util.getIndexById(models_notsaved, modelId);
			if(index != -1)
				models_notsaved.splice(model);
		}	
	}
	
	/**Ale
	 * Reponse to the export of a FRAM model.
	 */
	this.responseExportFRAMModelXML = function(){
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var xml_obj = req_xml.responseXML;
			console.log(xml_obj);
			if(xml_obj != null && xml_obj != "false"){ //XXX TODO on server side??
				// Sends a request to clientDS with the XML and the userMail to check if the user is already present.
//				var config_address_for_importResoluteModel = 'http://localhost:8080/dss/rest/importResoluteModel/';
				console.log(configParams.getAddressForImportResoluteModel())
				var address_request = configParams.getAddressForImportResoluteModel()+user.getEmail(); //XXX Change this reference.
				this.createRequest('POST', address_request, true);
				this.doRequestXML(xml_obj,"importResoluteModel");
			}
			else{ console.log("Errore durante la creazione del modello su Resolute."); toastr.error("Operation not completed! Retry later or contact the administrator.");}
		}
		else if(req_xml.readyState == 4){ console.log("Errore durante la creazione del modello su Resolute."); toastr.error("Operation not completed! Retry later or contact the administrator.");}
	}
	
	/**Ale
	 * Response for the import of a FRAM model into SmartDS.
	 */
	this.responseImportResoluteModel = function(){
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var xml_obj = req_xml.responseXML; //Returns null if something goes wrong.
			console.log(xml_obj); 
			toastr.success("Operation completed!");
		}
		else if(req_xml.readyState == 4){console.log("Errore su SmartDS sul salvataggio!"); toastr.error("Operation not completed! Retry later or contact the administrator.");}
	}
}