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
var HTTPRequestOperationModelInstance = function( )
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
		if(operation == "printModelInstance")
			req_xml.onreadystatechange = function(){ this_app.responsePrintModelInstanceXML(); };
		else if(operation == "saveModelInstance")
			req_xml.onreadystatechange = function(){ 
			this_app.responseSaveFRAMModelInstanceXML();
//			this_app.responseSaveModelInstanceXML(); 
			};
		else if(operation == "importDataModelInstance")
			req_xml.onreadystatechange = function(){ this_app.responseImportDataModelInstanceXML(); };
		else if(operation == "cloneModelInstance")
			req_xml.onreadystatechange = function(){ this_app.responseCloneModelInstanceXML(); };
		else if(operation == "resetModelInstance")
			req_xml.onreadystatechange = function(){ this_app.responseResetModelInstanceXML(); };
		else if(operation == "simulateQuery")
			req_xml.onreadystatechange = function(){ this_app.responseSimulateQueryXML(); };
		else if(operation == "computeDecision")
			req_xml.onreadystatechange = function(){ this_app.responseComputeDecisionXML(); };
		req_xml.send(xml_model);
	}
	
	
	// Risposta alla richiesta di stampare sulla console del server l'istanza del modello - PER DEBUG
	this.responsePrintModelInstanceXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			view.messageBox("Model Instance "+modelInstanceId+" stampato sul server");
		}	
	}
	
	
	// Response for save a new instance.
	this.responseSaveFRAMModelInstanceXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{	
			console.log(modelinstances_db);
			console.log(modelinstances_tmp);
			
			if(util.getIndexById(modelinstances_db, modelInstanceId) != -1)
			{
				console.log(modelinstances_db[util.getIndexById(modelinstances_db, modelInstanceId)]);
				console.log("Indice istanza nel vettore tmp: "+ util.getIndexById(modelinstances_db, modelInstanceId));
				console.log("Id istanza: "+ modelInstanceId);
			}
			
			var index_instance = util.getIndexById(modelinstances_tmp, modelInstanceId);
			if(index_instance != -1)
			{
				modelinstances_db.push(new ModelInstance(modelinstances_tmp[index_instance].getId(), modelinstances_tmp[index_instance].getSpecificObjective(), 
						modelinstances_tmp[index_instance].getModelId(), modelinstances_tmp[index_instance].getUserId(), 
						modelinstances_tmp[index_instance].getDateCreate(), modelinstances_tmp[index_instance].getDateLastModify()));
				
				modelinstances_tmp.splice(index_instance,1);
				modelinstances_notsaved.splice(util.getIndexById(modelinstances_notsaved, modelInstanceId))
				
				//XXX Saves also the model_tmp. Is it necessary?
				if(util.getIndexById(models_db,modelId) == -1 && util.getIndexById(models_tmp,modelId)!=-1)
				{
					var index_model = util.getIndexById(models_tmp,modelId);
					models_db.push(new Model(models_tmp[index_model].getId(), models_tmp[index_model].getObjective(), models_tmp[index_model].getUserId(), 
							models_tmp[index_model].getUrl(), models_tmp[index_model].getDescription(), models_tmp[index_model].getDateCreate(), 
							models_tmp[index_model].getDateLastModify()));
					models_tmp.splice(index_model,1);
					models_notsaved.splice(util.getIndexById(models_notsaved,modelId),1);
				}	
			}
			
			view.instanceSaved();
		}	
	}
	//XXX OLD - Risposta alla richiesta di salvare l'istanza selezionata nel DB
	this.responseSaveModelInstanceXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{	
			console.log(modelinstances_db);
			console.log(modelinstances_tmp);
			
			if(util.getIndexById(modelinstances_db, modelInstanceId) != -1)
			{
				console.log(modelinstances_db[util.getIndexById(modelinstances_db, modelInstanceId)]);
				console.log("Indice istanza nel vettore tmp: "+ util.getIndexById(modelinstances_db, modelInstanceId));
				console.log("Id istanza: "+ modelInstanceId);
			}
			
			var index_instance = util.getIndexById(modelinstances_tmp, modelInstanceId);
			if(index_instance != -1)
			{
				modelinstances_db.push(new ModelInstance(modelinstances_tmp[index_instance].getId(), modelinstances_tmp[index_instance].getSpecificObjective(), 
						modelinstances_tmp[index_instance].getModelId(), modelinstances_tmp[index_instance].getUserId(), 
						modelinstances_tmp[index_instance].getDateCreate(), modelinstances_tmp[index_instance].getDateLastModify(),
						modelinstances_tmp[index_instance].getStatus(), modelinstances_tmp[index_instance].getStartExec(), modelinstances_tmp[index_instance].getEndExec()));
				
				modelinstances_tmp.splice(index_instance,1);
				modelinstances_notsaved.splice(util.getIndexById(modelinstances_notsaved, modelInstanceId))
				
				if(util.getIndexById(models_db,modelId) == -1)
				{
					var index_model = util.getIndexById(models_tmp,modelId);
					models_db.push(new Model(models_tmp[index_model].getId(), models_tmp[index_model].getObjective(), models_tmp[index_model].getUserId(), 
							models_tmp[index_model].getUrl(), models_tmp[index_model].getDescription(), models_tmp[index_model].getDateCreate(), 
							models_tmp[index_model].getDateLastModify()));
					models_tmp.splice(index_model,1);
					models_notsaved.splice(util.getIndexById(models_notsaved,modelId),1);
				}	
			}
			
			view.instanceSaved();
		}	
	}
	
	// Risposta alla richiesta di clonazione dell'istanza selezionata
	this.responseCloneModelInstanceXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
//			alert(req_xml.responseText);
			
			var obj_xml = req_xml.responseXML;
			id_instance = obj_xml.getElementsByTagName("modelInstanceId")[0].textContent;
			var specific_objective = obj_xml.getElementsByTagName("specific_objective")[0].textContent;
			modelId = obj_xml.getElementsByTagName("modelId")[0].textContent;
			var userId = obj_xml.getElementsByTagName("instanceUserId")[0].textContent;
			var dateCreate = obj_xml.getElementsByTagName("date_create_instance")[0].textContent;
			var dateLastModify = obj_xml.getElementsByTagName("date_last_modify_instance")[0].textContent;
			var status = obj_xml.getElementsByTagName("status")[0].textContent;
			var startExec = "";
			if(obj_xml.getElementsByTagName("start_exec")[0] != undefined)
				startExec = obj_xml.getElementsByTagName("start_exec")[0].textContent;
			var endExec = "";
			if(obj_xml.getElementsByTagName("end_exec")[0] != undefined)
				endExec = obj_xml.getElementsByTagName("end_exec")[0].textContent;
			
			modelinstances_tmp.push(new ModelInstance(id_instance, specific_objective, modelId, userId, dateCreate, dateLastModify, status, startExec, endExec));
			modelinstances_notsaved.push(new ModelInstance(id_instance, specific_objective, modelId, userId, dateCreate, dateLastModify, status, startExec, endExec));
			
			view.instanceCloned(id_instance);
		}	
	}
	
	this.responseImportDataModelInstanceXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var obj_xml = req_xml.responseXML;
			
			var userId = obj_xml.getElementsByTagName("instanceUserId")[0].textContent;
			var specific_objective = obj_xml.getElementsByTagName("specific_objective")[0].textContent;
			
			var xtree = new XML.ObjTree();
			var json = xtree.parseXML(req_xml.responseText);
			var json_string_complete = util.JSONToString(json);
			var json_string = util.adjustStringToInstanceTree(json_string_complete);
			json_data = util.StringToJSON(json_string);
			
			// Apro la modalità di visualizzazione dell'istanza importata
			view.visualizeInstanceImported();
//			importDataDone(); // disabilito il button per l'importazione
		}
	}

	
	this.responseResetModelInstanceXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var xml_obj = req_xml.responseXML;
			if(xml_obj == null)
			{

				var index = util.getIndexById(modelinstances_tmp, modelInstanceId);
				modelinstances_tmp.splice(index,1);	
				modelinstances_notsaved.splice(util.getIndexById(modelinstances_notsaved, modelInstanceId),1);
				modelInstanceId = null;
				
				view.resetModelInstanceTMP();
			}else{
				var xtree = new XML.ObjTree();
				var json = xtree.parseXML(req_xml.responseText);
				var json_string_complete = util.JSONToString(json);
				var json_string = util.adjustStringToInstanceTree(json_string_complete);
				json_data = util.StringToJSON(json_string);
				
				view.resetModelInstanceDB();
			}
		}	
	}
	
	this.responseSimulateQueryXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{	
			var obj_xml = req_xml.responseXML;
			
			console.log(obj_xml);
			
			if(obj_xml.getElementsByTagName("logic_function1")[0] != undefined)
			{
//				alert("Query 1: " + obj_xml.getElementsByTagName("status")[0].textContent);
				view.insertResultQuery(1, obj_xml.getElementsByTagName("result")[0].textContent, obj_xml.getElementsByTagName("status")[0].textContent);
			}
			else if(obj_xml.getElementsByTagName("logic_function2")[0] != undefined)
			{
//				alert("Query 2: " + obj_xml.getElementsByTagName("status")[0].textContent);
				view.insertResultQuery(2, obj_xml.getElementsByTagName("result")[0].textContent, obj_xml.getElementsByTagName("status")[0].textContent);
			}
		}
	}
	
	this.responseComputeDecisionXML = function()
	{	
		var arrayIFIncongruent = new Array();
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{	
			
			var obj_xml = req_xml.responseXML;
			
			var id_instance = obj_xml.getElementsByTagName("modelInstanceId")[0].textContent;
			var idUser = obj_xml.getElementsByTagName("instanceUserId")[0].textContent;
			
//			alert(req_xml.responseText);
			
			if(modelInstanceId == id_instance)
			{
				$(".loading").fadeOut("slow");
				
				var position;			
				var criterias = obj_xml.getElementsByTagName("children");
				
				for(var i = 0; i < criterias.length; i++)
				{
					console.log(criterias[i].childNodes);
					
					var if_green_insert = 0, if_white_insert = 0, if_red_insert = 0, if_green_calculated = 0, if_white_calculated = 0, if_red_calculated = 0;
					
					for(var j = 0; j < criterias[i].childNodes.length; j++)
					{
						if(criterias[i].childNodes[j].tagName == "position")
							position = criterias[i].childNodes[j].textContent;
						if(criterias[i].childNodes[j].tagName == "IF_insert")
						{
							if_green_insert = Number(criterias[i].childNodes[j].childNodes[0].textContent);
							if_white_insert = Number(criterias[i].childNodes[j].childNodes[1].textContent);
							if_red_insert = Number(criterias[i].childNodes[j].childNodes[2].textContent);
						}
						if(criterias[i].childNodes[j].tagName == "IF_calculated")
						{
							if_green_calculated = Number(criterias[i].childNodes[j].childNodes[0].textContent);
							if_white_calculated = Number(criterias[i].childNodes[j].childNodes[1].textContent);
							if_red_calculated = Number(criterias[i].childNodes[j].childNodes[2].textContent);
						}
					}
					
					console.log(if_green_insert + if_white_insert + if_red_insert + if_green_calculated + if_white_calculated + if_red_calculated);
					
					if((if_green_insert != 0 || if_white_insert != 0 || if_red_insert != 0) && (if_green_calculated != 0 || if_white_calculated != 0 || if_red_calculated != 0))
					{
						if(Math.abs(if_green_insert-if_green_calculated)>0.1 || Math.abs(if_white_insert-if_white_calculated)>0.1 || Math.abs(if_red_insert-if_red_calculated)>0.1)
							arrayIFIncongruent.push({'green': if_green_calculated, 'white': if_white_calculated, 'red': if_red_calculated, 'position': position});
					}
				}

				specific_object = obj_xml.getElementsByTagName("specific_objective")[0].textContent;

				var xtree = new XML.ObjTree();
				var json = xtree.parseXML(req_xml.responseText);
				var json_string_complete = util.JSONToString(json);
				var json_string = util.adjustStringToInstanceTree(json_string_complete);
				json_data = util.StringToJSON(json_string);
				
				view.computeDecisionInstance(idUser, specific_object, arrayIFIncongruent);
			}
			
			var status = obj_xml.getElementsByTagName("status")[0].textContent;
			
			if(util.getIndexById(modelinstances_db, id_instance) != -1)
				modelinstances_db[util.getIndexById(modelinstances_db, id_instance)].setStatus(status);
			else if(util.getIndexById(modelinstances_tmp, id_instance) != -1)
				modelinstances_tmp[util.getIndexById(modelinstances_tmp, id_instance)].setStatus(status);
			
			view.updateListStatusInstanceModels();
		}	
	}
	
}