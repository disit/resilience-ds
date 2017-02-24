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
 * Classe definita per gestire le richieste REST effettuate dal client per operazioni di creazione, di lettura e 
 * di cancellazione di risorse Presence
 */
var HTTPRequestModelInstance = function(  )
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
	
	/*
	 * Ale: Function that send to the server the POST, Put or GET request in JSON, 
	 * for create or modify of a resource ModelIstance.
	 *TODO implement JSON request instead of XML
	 */
	this.doRequestJSON = function(json_model_instance, type_get_delete)
	{	
//		req_xml = new XMLHttpRequest();
		req_json = new XMLHttpRequest();
		req_json.open(type, address_request, async_mode);
		if(type == "POST")
//			req_json.onreadystatechange = function(){ this_app.responseAddModelInstanceXML(); };
			req_json.onreadystatechange = function(){ this_app.responseAddFRAMModelInstanceXML(); };
			else if(type == "PUT")
				req_json.onreadystatechange = function(){ this_app.responseModifyModelInstanceXML(); };
				else if(type == "GET")
				{
					if(type_get_delete == "getModelInstances")
						req_json.onreadystatechange = function(){ this_app.getModelInstancesXML(); };
						else if(type_get_delete == "getModelInstances_status")
							req_json.onreadystatechange = function(){ this_app.getStatusModelInstancesXML(); };	
							else if(type_get_delete == "getModelInstance")
								req_json.onreadystatechange = function(){ this_app.getModelInstanceJSON(); };
				}
				else if(type == "DELETE")
				{
					if(type_get_delete == "deleteModelInstancesTmp")
						req_json.onreadystatechange = function(){ this_app.deleteModelInstancesTmpXML(); };
						else if(type_get_delete == "deleteModelInstance")
							req_json.onreadystatechange = function(){ this_app.deleteModelInstanceXML(); };
				}
		
		req_json.setRequestHeader("Content-Type","application/xml");
		req_json.send(json_model_instance);
	}
	// Funzione che invia al server una richiesta POST o PUT in formato XML per creazione o modifica di una risorsa ModelIstance
	this.doRequestXML = function(xml_model_instance, type_get_delete)
	{	
		req_xml = new XMLHttpRequest();
		req_xml.open(type, address_request, async_mode);
		if(type == "POST")
//			req_xml.onreadystatechange = function(){ this_app.responseAddModelInstanceXML(); };
			req_xml.onreadystatechange = function(){ this_app.responseAddFRAMModelInstanceXML(); };
		else if(type == "PUT")
			req_xml.onreadystatechange = function(){ this_app.responseModifyModelInstanceXML(); };
		else if(type == "GET")
		{
			if(type_get_delete == "getModelInstances")
				req_xml.onreadystatechange = function(){ this_app.getModelInstancesXML(); };
			else if(type_get_delete == "getModelInstances_status")
				req_xml.onreadystatechange = function(){ this_app.getStatusModelInstancesXML(); };	
			else if(type_get_delete == "getModelInstance"){
//				req_xml.onreadystatechange = function(){ this_app.getModelInstanceXML(); };
				req_xml.onreadystatechange = function(){ this_app.getFRAMModelInstanceXML(); };
			}
		}
		else if(type == "DELETE")
		{
			if(type_get_delete == "deleteModelInstancesTmp")
				req_xml.onreadystatechange = function(){ this_app.deleteModelInstancesTmpXML(); };
			else if(type_get_delete == "deleteModelInstance")
				req_xml.onreadystatechange = function(){ this_app.deleteModelInstanceXML(); };
		}
			
		req_xml.setRequestHeader("Content-Type","application/xml");
		req_xml.send(xml_model_instance);
	}
	
	// Response to request for the creation of a new FRAM instance.
	this.responseAddFRAMModelInstanceXML = function()
	{
		
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
//			alert(req_xml.responseText);
			
			var obj_xml = req_xml.responseXML;
			
			modelInstanceId = obj_xml.getElementsByTagName("modelInstanceId")[0].textContent;
			var specific_objective = obj_xml.getElementsByTagName("specific_objective")[0].textContent;
			modelId = obj_xml.getElementsByTagName("modelId")[0].textContent;
			var userId = obj_xml.getElementsByTagName("instanceUserId")[0].textContent;
			var dateCreate = obj_xml.getElementsByTagName("date_create_instance")[0].textContent;
			var dateLastModify = obj_xml.getElementsByTagName("date_last_modify_instance")[0].textContent;
			
			modelinstances_tmp.push(new FRAMModelInstance(modelInstanceId, specific_objective, modelId, userId, dateCreate, dateLastModify));
			modelinstances_notsaved.push(new FRAMModelInstance(modelInstanceId, specific_objective, modelId, userId, dateCreate, dateLastModify));
			
			// Verifica se il modello per cui si vuol creare la nuova istanza appartiene alla lista dei modelli clonati
			var index_cloned = util.getIndexById(models_cloned, modelId);
			if(index_cloned != -1)
			{
				// Si cerca nella lista delle istanze, sia quelle temporanee(modelinstances_tmp) che quelle salvate su db(modelinstances_db), quelle relative all'id 
				// del modello di partenza e si crea una nuova lista contenente le istanze da cui è possibile importare i dati
				var modelIdToRetrieveInstances = models_cloned[index_cloned].getIdStart();
				
				var vectorModelInstance = util.getInstanceVectorByModelId(modelinstances_db, modelIdToRetrieveInstances, []);
				vectorModelInstance = util.getInstanceVectorByModelId(modelinstances_tmp, modelIdToRetrieveInstances, vectorModelInstance);
				
				modelinstances_to_import_data = [];
				for(var i=0; i<vectorModelInstance.length; i++)
					modelinstances_to_import_data.push(vectorModelInstance[i]);
				
				view.createSelectInstancesImportData();
			}	
			
			var xtree = new XML.ObjTree();
			var json = xtree.parseXML(req_xml.responseText);
			var json_string_complete = util.JSONToString(json);
			var json_string = json_string_complete;
			json_data = util.StringToJSON(json_string);
			json_data = json_data.modelinstance;
			// Chiamata per visualizzare la nuova istanza
			view.newInstance(specific_objective);
			console.log("model instance added: "+modelInstanceId);
			// Chiamata per aggiornare il menu inserendo la nuova istanza creata
			view.updateMenuInstances();
			selectButtonModel(modelInstanceId, true);
		}	
	}
	
	//XXX OLD Risposta alla richiesta di creazione di una nuova istanza
	this.responseAddModelInstanceXML = function()
	{

		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
//			alert(req_xml.responseText);
			
			var obj_xml = req_xml.responseXML;
			
			modelInstanceId = obj_xml.getElementsByTagName("modelInstanceId")[0].textContent;
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
			
			modelinstances_tmp.push(new ModelInstance(modelInstanceId, specific_objective, modelId, userId, dateCreate, dateLastModify, status, startExec, endExec));
			modelinstances_notsaved.push(new ModelInstance(modelInstanceId, specific_objective, modelId, userId, dateCreate, dateLastModify, status, startExec, endExec));

			// Verifica se il modello per cui si vuol creare la nuova istanza appartiene alla lista dei modelli clonati
			var index_cloned = util.getIndexById(models_cloned, modelId);
			if(index_cloned != -1)
			{
				// Si cerca nella lista delle istanze, sia quelle temporanee(modelinstances_tmp) che quelle salvate su db(modelinstances_db), quelle relative all'id 
				// del modello di partenza e si crea una nuova lista contenente le istanze da cui è possibile importare i dati
				var modelIdToRetrieveInstances = models_cloned[index_cloned].getIdStart();

				var vectorModelInstance = util.getInstanceVectorByModelId(modelinstances_db, modelIdToRetrieveInstances, []);
				vectorModelInstance = util.getInstanceVectorByModelId(modelinstances_tmp, modelIdToRetrieveInstances, vectorModelInstance);
				
				modelinstances_to_import_data = [];
				for(var i=0; i<vectorModelInstance.length; i++)
					modelinstances_to_import_data.push(vectorModelInstance[i]);

				view.createSelectInstancesImportData();
			}	
			
			var xtree = new XML.ObjTree();
			var json = xtree.parseXML(req_xml.responseText);
			var json_string_complete = util.JSONToString(json);
			var json_string = util.adjustStringToInstanceTree(json_string_complete);
			json_data = util.StringToJSON(json_string);
			
			// Chiamata per visualizzare la nuova istanza
			view.newInstance(specific_objective);
			
			// Chiamata per aggiornare il menu inserendo la nuova istanza creata
			view.updateMenuInstances();
		}	
	}
	
	// Risposta alla richiesta di modifica del nome di un'istanza
	this.responseModifyModelInstanceXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{			
//			alert("Response Modify Model Instance in ModelInstance:\n" + req_xml.responseText);
			
			var obj_xml = req_xml.responseXML;
			
			var id_modelinstance = obj_xml.getElementsByTagName("modelInstanceId")[0].textContent;
			var specific_objective = obj_xml.getElementsByTagName("specific_objective")[0].textContent;
			var id_model = obj_xml.getElementsByTagName("modelId")[0].textContent;
			
			if(util.getIndexById(modelinstances_db, id_modelinstance) > -1)
				modelinstances_db[util.getIndexById(modelinstances_db, id_modelinstance)].setSpecificObjective(specific_objective);
			else if(util.getIndexById(modelinstances_tmp, id_modelinstance) > -1)
				modelinstances_tmp[util.getIndexById(modelinstances_tmp, id_modelinstance)].setSpecificObjective(specific_objective);
			
			view.updateMenuModifyInstance(specific_objective, id_model, id_modelinstance);
		}
	}
	
	//Ale 16-2-10: Answer for the request of all the instances in the server or in the DB.
	this.getModelInstancesJSON = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var obj_xml = req_xml.responseXML;
			
//			alert(req_xml.responseText);
			
			if(obj_xml != null)
			{
				var num_modelinstances = obj_xml.getElementsByTagName("modelinstance").length;
				for(var i = 0; i < num_modelinstances; i++)
				{
					var mi_id = obj_xml.getElementsByTagName("modelInstanceId")[i].textContent;
					var mi_description = obj_xml.getElementsByTagName("descriptionInstance")[i].textContent;
					var m_id = obj_xml.getElementsByTagName("modelId")[i].textContent;
					var mi_uid = obj_xml.getElementsByTagName("modelUserId")[i].textContent;
					var mi_create = obj_xml.getElementsByTagName("date_create_instance")[i].textContent;
					var mi_last_modify = obj_xml.getElementsByTagName("date_last_modify_instance")[i].textContent;
					
					modelinstances_db.push(new ModelInstance(mi_id, mi_description, m_id, mi_uid, mi_create, mi_last_modify));
					
//					modelinstances_db.push(new ModelInstance(obj_xml.getElementsByTagName("modelInstanceId")[i].textContent,
//							obj_xml.getElementsByTagName("descriptionInstance")[i].textContent, obj_xml.getElementsByTagName("modelId")[i].textContent, 
//							obj_xml.getElementsByTagName("instanceUserId")[i].textContent, "", ""));
				}
				view.updateListInstanceModels();
			}	
		}	
	}
	//Ale:The original for XML.
	this.getModelInstancesXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var obj_xml = req_xml.responseXML;
			
//			alert(req_xml.responseText);

			if(obj_xml != null)
			{
				var num_modelinstances = obj_xml.getElementsByTagName("modelinstance").length;
				for(var i = 0; i < num_modelinstances; i++)
				{
					var mi_id = obj_xml.getElementsByTagName("modelInstanceId")[i].textContent;
					var mi_description = obj_xml.getElementsByTagName("specific_objective")[i].textContent;
					var m_id = obj_xml.getElementsByTagName("modelId")[i].textContent;
					var mi_uid = obj_xml.getElementsByTagName("instanceUserId")[i].textContent;
					var mi_create = obj_xml.getElementsByTagName("date_create_instance")[i].textContent;
					var mi_last_modify = obj_xml.getElementsByTagName("date_last_modify_instance")[i].textContent;
					
					modelinstances_db.push(new FRAMModelInstance(mi_id, mi_description, m_id, mi_uid, mi_create, mi_last_modify));
//					modelinstances_db.push(new FRAMModelInstance(obj_xml.getElementsByTagName("modelInstanceId")[i].textContent,
//							obj_xml.getElementsByTagName("specific_objective")[i].textContent, obj_xml.getElementsByTagName("modelId")[i].textContent, 
//							obj_xml.getElementsByTagName("instanceUserId")[i].textContent, "", ""));
				}
				view.updateListInstanceModels();
			}	
		}	
	}
	
	// Risposta alla richiesta di tutte le istanze presenti sul server e sul DB
	this.getStatusModelInstancesXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var obj_xml = req_xml.responseXML;
			
//			alert("Modifica dello stato:\n"+req_xml.responseText);

			if(obj_xml != null)
			{
				var num_modelinstances = obj_xml.getElementsByTagName("modelinstance").length;
				for(var i = 0; i < num_modelinstances; i++)
				{
					var id_modelinstance = obj_xml.getElementsByTagName("modelInstanceId")[i].textContent;
					if(util.getIndexById(modelinstances_db, id_modelinstance) != -1)
						modelinstances_db[util.getIndexById(modelinstances_db, id_modelinstance)].setStatus(obj_xml.getElementsByTagName("status")[i].textContent);
					else if(util.getIndexById(modelinstances_tmp, id_modelinstance) != -1)
						modelinstances_tmp[util.getIndexById(modelinstances_tmp, id_modelinstance)].setStatus(obj_xml.getElementsByTagName("status")[i].textContent);
				}
				view.updateListStatusInstanceModels();
			}	
		}	
	}
	
	// Ale: Answer to the request of an instance with the same id of modelInstanceId.
	this.getFRAMModelInstanceXML = function()
	{
		console.log("FRAM model instance returned");
		
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

			//TODO: Check the utility of these lines, probably it saves the models for a fast recover.-----
			/*
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
			 */
//			------------

			var xtree = new XML.ObjTree();
			var json = xtree.parseXML(req_xml.responseText);

//			var json_string_complete = util.JSONToString(json);
//			var json_string = util.adjustStringToModelTree(json_string_complete);
//			json_string = util.adjustStringToModelWithOneChildren(json_string);

			json_data = json.modelinstance;

//			view.visualizeModelSelected(userId);
			view.visualizeFRAMInstanceSelected(userId);

			view.returnXmlModel(obj_xml);
		}				
	}
	
	// Risposta alla richiesta di un'istanza con id uguale a modelInstanceId
	this.getModelInstanceXML = function()
	{
		var arrayIFIncongruent = new Array();
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			console.log(req_xml.responseText);
			
			green_IFinsert = 0.0;
			white_IFinsert = 0.0;
			red_IFinsert = 0.0;
			
			var obj_xml = req_xml.responseXML;
			
			var idUser = obj_xml.getElementsByTagName("instanceUserId")[0].textContent;
			specific_object = obj_xml.getElementsByTagName("specific_objective")[0].textContent;
			
			modelInstanceId = obj_xml.getElementsByTagName("modelInstanceId")[0].textContent;
			var specific_objective = obj_xml.getElementsByTagName("specific_objective")[0].textContent;
			modelId = obj_xml.getElementsByTagName("modelId")[0].textContent;
			var userId = obj_xml.getElementsByTagName("instanceUserId")[0].textContent;
			var dateCreate = obj_xml.getElementsByTagName("date_create_instance")[0].textContent;
			var dateLastModify = obj_xml.getElementsByTagName("date_last_modify_instance")[0].textContent;
			var status = obj_xml.getElementsByTagName("status")[0].textContent;
			
			if(status != 1)
			{
				$(".loading").fadeOut("slow");
				
				var startExec = "";
				if(obj_xml.getElementsByTagName("start_exec")[0] != undefined)
					startExec = obj_xml.getElementsByTagName("start_exec")[0].textContent;
				var endExec = "";
				if(obj_xml.getElementsByTagName("end_exec")[0] != undefined)
					endExec = obj_xml.getElementsByTagName("end_exec")[0].textContent;
				
				console.log("Data creazione istanza: " + dateCreate + " data ultima modifica:  "+dateLastModify);
				
				var index_db = util.getIndexById(modelinstances_db, modelInstanceId);
				if(index_db != -1)
				{
					modelinstances_db.splice(index_db, 1);
					modelinstances_db.push(new ModelInstance(modelInstanceId, specific_objective, modelId, userId, dateCreate, dateLastModify, status, startExec, endExec));
				}
				
				var index_tmp = util.getIndexById(modelinstances_tmp, modelInstanceId);
				if(index_tmp != -1)
				{
					modelinstances_tmp.splice(index_tmp, 1);
					modelinstances_tmp.push(new ModelInstance(modelInstanceId, specific_objective, modelId, userId, dateCreate, dateLastModify, status, startExec, endExec));
				}
				
				
				// Verifica se il modello per cui si vuol creare la nuova istanza appartiene alla lista dei modelli clonati
				var index_cloned = util.getIndexById(models_cloned, modelId);
				
				if(index_cloned != -1)
				{
					// Si cerca nella lista delle istanze, sia quelle temporanee(modelinstances_tmp) che quelle salvate su db(modelinstances_db), quelle relative all'id 
					// del modello di partenza e si crea una nuova lista contenente le istanze da cui è possibile importare i dati
					var modelIdToRetrieveInstances = models_cloned[index_cloned].getIdStart();
					
					var indexModelDB = util.getIndexById(models_db, modelIdToRetrieveInstances);
	
					var vectorModelInstance = util.getInstanceVectorByModelId(modelinstances_db, modelIdToRetrieveInstances, []);
					vectorModelInstance = util.getInstanceVectorByModelId(modelinstances_tmp, modelIdToRetrieveInstances, vectorModelInstance);
					
					modelinstances_to_import_data = [];
					for(var i=0; i<vectorModelInstance.length; i++)
						modelinstances_to_import_data.push(vectorModelInstance[i]);
					
					view.createSelectInstancesImportData();
				}
				
				// Controllo se ci sono nodi con Italian Flag incongruenti
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
							if_green_insert = Number(criterias[i].childNodes[j].childNodes[1].textContent);
							if_white_insert = Number(criterias[i].childNodes[j].childNodes[3].textContent);
							if_red_insert = Number(criterias[i].childNodes[j].childNodes[5].textContent);
						}
						if(criterias[i].childNodes[j].tagName == "IF_calculated")
						{
							if_green_calculated = Number(criterias[i].childNodes[j].childNodes[1].textContent);
							if_white_calculated = Number(criterias[i].childNodes[j].childNodes[3].textContent);
							if_red_calculated = Number(criterias[i].childNodes[j].childNodes[5].textContent);
						}
					}
					
					console.log(if_green_insert + " " + if_white_insert + " " + if_red_insert + " " + if_green_calculated + " " + if_white_calculated + " " + if_red_calculated);
					
					if((if_green_insert != 0 || if_white_insert != 0 || if_red_insert != 0) && (if_green_calculated != 0 || if_white_calculated != 0 || if_red_calculated != 0))
					{
						if(Math.abs(if_green_insert-if_green_calculated)>0.1 || Math.abs(if_white_insert-if_white_calculated)>0.1 || Math.abs(if_red_insert-if_red_calculated)>0.1)
							arrayIFIncongruent.push({'green': if_green_calculated, 'white': if_white_calculated, 'red': if_red_calculated, 'position': position});
					}
				}
				
				var xtree = new XML.ObjTree();
				var json = xtree.parseXML(req_xml.responseText);
				var json_string_complete = util.JSONToString(json);
				var json_string = util.adjustStringToInstanceTree(json_string_complete);
				json_data = util.StringToJSON(json_string);
				
				view.visualizeInstanceSelected(idUser, specific_object, arrayIFIncongruent);
				
				view.returnXmlInstance(obj_xml);
			}
			else{
				$(".loading").fadeIn("slow");
				view.clearMainDIV();
			}
		}	
	}
	
	// Risposta alla richiesta di cancellazione dell'istanza selezionata
	this.deleteModelInstanceXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var index_db = util.getIndexById(modelinstances_db, modelInstanceId);
			if(index_db != -1)
				modelinstances_db.splice(index_db,1);
			
			var index_tmp = util.getIndexById(modelinstances_tmp, modelInstanceId);
			if(index_tmp != -1)
				modelinstances_tmp.splice(index_tmp,1);

			var index_notsaved = util.getIndexById(modelinstances_notsaved, modelInstanceId);
			if(index_notsaved != -1)
				modelinstances_notsaved.splice(index_notsaved,1);
			
			modelInstanceId = null;

			view.updateMenuInstances();
			view.clearMainDIV();
		}	
	}
	
	// Risposta alla richiesta di cancellazione di tutte le istanze temporanee presenti sul server e non salvate nel DB
	this.deleteModelInstancesTmpXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
//			alert("Istanze utente temporanee cancellate sul server!");
		}	
	}
}