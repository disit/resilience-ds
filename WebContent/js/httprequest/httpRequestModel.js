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
var HTTPRequestModel = function()
{
	var type;
	var address_request;
	var async_mode;
	var req_xml;
	var req_json;
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
	this.doRequestXML = function(xml_model, type_get_delete)
	{	
		req_xml = new XMLHttpRequest();
		req_xml.open(type, address_request, async_mode);
		if(type == "POST")
			req_xml.onreadystatechange = function(){ this_app.responseAddModelXML(); };
		else if(type == "PUT")
			req_xml.onreadystatechange = function(){ this_app.responseModifyModelXML(); };
		else if(type == "GET")
		{
			if(type_get_delete == "getModels")
				req_xml.onreadystatechange = function(){ this_app.getModelsXML(); };
			else if(type_get_delete == "getModel")
				req_xml.onreadystatechange = function(){ this_app.getFRAMModelXML(); };
		}
		else if(type == "DELETE")
		{
			if(type_get_delete == "deleteModelsTmp")
				req_xml.onreadystatechange = function(){ this_app.deleteModelsTmpXML(); };
			else if(type_get_delete == "deleteModel")
				req_xml.onreadystatechange = function(){ this_app.deleteModelXML(); };
		}
			
		req_xml.setRequestHeader("Content-Type","application/xml");
		req_xml.send(xml_model);
	}
	
	// Risposta alla richiesta di creazione di un nuovo modello
	this.responseAddModelXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var dom_obj = req_xml.responseXML;
			modelId = dom_obj.getElementsByTagName("modelId")[0].textContent;
			
			var objective = dom_obj.getElementsByTagName("objective")[0].textContent;
			var userId = dom_obj.getElementsByTagName("modelUserId")[0].textContent;
			var urlModel = "";
			if(dom_obj.getElementsByTagName("url")[0] != undefined)
				urlModel = dom_obj.getElementsByTagName("url")[0].textContent;
			var descriptionModel = "";
			if(dom_obj.getElementsByTagName("description_model")[0] != undefined)
				descriptionModel = dom_obj.getElementsByTagName("description_model")[0].textContent;
			var date_createModel = dom_obj.getElementsByTagName("date_create_model")[0].textContent;
			var date_lastmodifyModel = dom_obj.getElementsByTagName("date_last_modify_model")[0].textContent;
			
			models_tmp.push(new Model(modelId, objective, userId, urlModel, descriptionModel, date_createModel, date_lastmodifyModel));
			models_notsaved.push(new Model(modelId, objective, userId, urlModel, descriptionModel, date_createModel, date_lastmodifyModel));
			modelnotsaved_update();
			
			console.log("Modello aggiunto sul server con id "+modelId);
			
			var obj_xml = req_xml.responseXML;	
			
			view.updateMenuModels();
			selectButtonModel(modelId, false);
		}	
	}
	
	// Funzione che cattura la risposta alla richiesta PUT in formato XML per la modifica di una risorsa Model
	this.responseModifyModelXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var dom_obj = req_xml.responseXML;
			modelId = dom_obj.getElementsByTagName("modelId")[0].textContent;
			var objective = dom_obj.getElementsByTagName("objective")[0].textContent;
			var date_last_modify = dom_obj.getElementsByTagName("date_last_modify_model")[0].textContent;
			
			console.log("Modifica del nome al modello con id " + modelId + " - nuovo nome: " +objective);
			
			if(util.getIndexById(models_db, modelId) > -1){
				models_db[util.getIndexById(models_db, modelId)].setObjective(objective);
				models_db[util.getIndexById(models_db, modelId)].setDateLastModify(date_last_modify);				
			}
			else if(util.getIndexById(models_tmp, modelId) > -1){
				models_tmp[util.getIndexById(models_tmp, modelId)].setObjective(objective);
				models_tmp[util.getIndexById(models_tmp, modelId)].setDateLastModify(date_last_modify);				
			}
			
			view.updateDateLastModifyModel(date_last_modify);
			view.updateNameModel(objective, modelId);
		}	
	}
	
	// Risposta alla richiesta di tutti i modelli presenti sul server e di quelli nel DB
	this.getModelsXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var obj_xml = req_xml.responseXML;
			
			if(obj_xml != null)
			{
				var num_models = obj_xml.getElementsByTagName("model").length;
				for(var i=0; i < num_models; i++)
				{
					var id_model = obj_xml.getElementsByTagName("modelId")[i].textContent;
					var objective = obj_xml.getElementsByTagName("objective")[i].textContent;
					var userId = obj_xml.getElementsByTagName("modelUserId")[i].textContent;
					var descriptionModel=" No description provided.";
					if(obj_xml.getElementsByTagName("description_model")[i] != undefined)
						descriptionModel = obj_xml.getElementsByTagName("description_model")[i].textContent;
					var date_createModel = obj_xml.getElementsByTagName("date_create_model")[i].textContent;
					var date_lastmodifyModel = obj_xml.getElementsByTagName("date_last_modify_model")[i].textContent;
					
					models_db.push(new Model(id_model, objective, userId, "", descriptionModel, date_createModel, date_lastmodifyModel));
				}
				
				view.listModelsFromServer();
			}
			else
				alert("There isn't models saved on Database!");
		}	
	}
	
	// Risposta alla richiesta del modello selezionato
	this.getModelXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{				
			var obj_xml = req_xml.responseXML;
			
			console.log(obj_xml);
			
			var objective = obj_xml.getElementsByTagName("objective")[0].textContent;
			var userId = obj_xml.getElementsByTagName("modelUserId")[0].textContent;
			var urlModel = "";
			if(obj_xml.getElementsByTagName("url")[0] != undefined)
				urlModel = obj_xml.getElementsByTagName("url")[0].textContent;
			var descriptionModel = "";
			if(obj_xml.getElementsByTagName("description_model")[0] != undefined)
				descriptionModel = obj_xml.getElementsByTagName("description_model")[0].textContent;
			var date_createModel = obj_xml.getElementsByTagName("date_create_model")[0].textContent;
			var date_lastmodifyModel = obj_xml.getElementsByTagName("date_last_modify_model")[0].textContent;
			
			var index_db = util.getIndexById(models_db, modelId);
			if(index_db != -1)
			{
				models_db.splice(index_db, 1);
				models_db.push(new Model(modelId, objective, userId, urlModel, descriptionModel, date_createModel, date_lastmodifyModel));
			}
			
			var index_tmp = util.getIndexById(models_tmp, modelId);
			if(index_tmp != -1)
			{
				models_tmp.splice(index_tmp, 1);
				models_tmp.push(new Model(modelId, objective, userId, urlModel, descriptionModel, date_createModel, date_lastmodifyModel));
			}
			
			var xtree = new XML.ObjTree();
			var json = xtree.parseXML(req_xml.responseText);
			var json_string_complete = util.JSONToString(json);
			var json_string = util.adjustStringToModelTree(json_string_complete);
			json_string = util.adjustStringToModelWithOneChildren(json_string);
			json_data = util.StringToJSON(json_string);
			
			view.visualizeModelSelected(userId);
			
			view.returnXmlModel(obj_xml);
		}	
	}
	/**
	 * Ale: Answers to the request for a specific fram model.
	 */
	this.getFRAMModelXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{				
			var obj_xml = req_xml.responseXML;
			
			console.log(obj_xml);
			
			var objective = obj_xml.getElementsByTagName("objective")[0].textContent;
			var userId = obj_xml.getElementsByTagName("modelUserId")[0].textContent;
		
			var descriptionModel = "";
			if(obj_xml.getElementsByTagName("description_model")[0] != undefined)
				descriptionModel = obj_xml.getElementsByTagName("description_model")[0].textContent;
			var date_createModel = obj_xml.getElementsByTagName("date_create_model")[0].textContent;
			var date_lastmodifyModel = obj_xml.getElementsByTagName("date_last_modify_model")[0].textContent;
			/*
			 * TODO checks if it is necessary. There are some issues with the code below.
			//Saves the model in a temporary list.
			var index_db = util.getIndexById(models_db, modelId);
			if(index_db != -1)
			{
				models_db.splice(index_db, 1);
				models_db.push(new Model(modelId, objective, userId, null, descriptionModel, date_createModel, date_lastmodifyModel));
			}
			
			var index_tmp = util.getIndexById(models_tmp, modelId);
			if(index_tmp != -1)
			{
				models_tmp.splice(index_tmp, 1);
				models_tmp.push(new Model(modelId, objective, userId, null, descriptionModel, date_createModel, date_lastmodifyModel));
			}	
			*/		
//			------------
			var xtree = new XML.ObjTree();
			var json = xtree.parseXML(req_xml.responseText);
//			var json_string_complete = util.JSONToString(json);
//			var json_string = util.adjustStringToModelTree(json_string_complete);
//			json_string = util.adjustStringToModelWithOneChildren(json_string);

			json_data = json.model;
			
			view.visualizeModelSelected(userId);
			
			view.returnXmlModel(obj_xml);
		}	
	}
	
	
	
	// Risposta alla richiesta di cancellazione del modello selezionato
	this.deleteModelXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var index_db = util.getIndexById(models_db, modelId);
			if(index_db != -1)
			{
				models_db.splice(index_db,1);	
			}
			
			var index_tmp = util.getIndexById(models_tmp, modelId);
			if(index_tmp != -1)
			{
				models_tmp.splice(index_tmp,1);
			}
			
			var index_notsaved = util.getIndexById(models_notsaved, modelId);
			if(index_notsaved != -1)
			{
				models_notsaved.splice(index_notsaved,1);
			}
			
			modelId = null;
			
			view.updateMenuModels();
			view.clearMainDIV();
		}	
	}
	
	// Risposta alla richiesta di cancellazione dei modelli temporanei presenti sul server
	this.deleteModelsTmpXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
//			alert("Models temp delete on server!");
		}	
	}
}