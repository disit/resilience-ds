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
var HTTPRequestCriteriaInstance = function( )
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
	this.doRequestXML = function(xml_criteria_instance, type_request)
	{	
		
		req_xml = new XMLHttpRequest();
		req_xml.open(type, address_request, async_mode);
		req_xml.setRequestHeader("Content-Type","application/xml");
		if(type == "GET")
		{
			if(type_request == "url-comment")
				req_xml.onreadystatechange = function(){ this_app.responseGetURLCommentXML(); };
			else if(type_request == "weights")
				req_xml.onreadystatechange = function(){ this_app.responseGetWeightsXML(); };
			else if(type_request == "matrix")
				req_xml.onreadystatechange = function(){ this_app.responseGetMatrixXML(); };
			else if(type_request == "if")
				req_xml.onreadystatechange = function(){ this_app.responseGetIFXML(); };
		}	
		else if(type == "PUT"){
			if(type_request == "insert_logic_functions")
				req_xml.onreadystatechange = function(){ this_app.responseModifyLFCriteriaInstanceXML(); };
			else if(type_request == "data")
				req_xml.onreadystatechange = function(){ this_app.responseModifyDataCriteriaInstanceXML(); };
			else if(type_request == "info")
				req_xml.onreadystatechange = function(){ this_app.responseModifyInfoCriteriaInstanceXML(); };
		}
			
			
		req_xml.send(xml_criteria_instance);
	}
	
	this.responseGetURLCommentXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{

		}	
	}
	
	this.responseGetWeightsXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var res = req_xml.responseXML;
			
			if(res.getElementsByTagName("weightsSerialized").length != 0)
			{
				view.updateWeightsView(res.getElementsByTagName("weightsSerialized")[0].textContent, "vector");
				view.updateWeightsEdgeInstance(res.getElementsByTagName("weightsSerialized")[0].textContent, res.getElementsByTagName("position")[0].textContent);
			}
			else
				view.updateWeightsView("", "vector");
			
			if(res.getElementsByTagName("matrixSerialized").length != 0)
				view.updateWeightsView(res.getElementsByTagName("matrixSerialized")[0].textContent, "matrix");
			else
				view.updateWeightsView("", "matrix");
		}	
	}
	
	this.responseGetIFXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var res = req_xml.responseXML;
			
			var green = res.getElementsByTagName("IF_insert")[0].getElementsByTagName("IF_green")[0].textContent;
			var white = res.getElementsByTagName("IF_insert")[0].getElementsByTagName("IF_white")[0].textContent;
			var red = res.getElementsByTagName("IF_insert")[0].getElementsByTagName("IF_red")[0].textContent;
			
//			alert(green + " " + white + " " + red);
//			view.changeIFReplaceLFM();
		}	
	}
	
	this.responseModifyLFCriteriaInstanceXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{	
			// Caso di modifica dei dati (Pesi archi e IF) di un criteria
			var index_notsaved = util.getIndexById(modelinstances_notsaved, modelInstanceId);
			var index_db = util.getIndexById(modelinstances_db, modelInstanceId);
			var index_tmp = util.getIndexById(modelinstances_tmp, modelInstanceId);
			
			if(index_db != -1 && index_notsaved == -1)
				modelinstances_notsaved.push(new ModelInstance(modelinstances_db[index_db].getId(), modelinstances_db[index_db].getSpecificObjective(), 
						modelinstances_db[index_db].getModelId(), modelinstances_db[index_db].getUserId(), modelinstances_db[index_db].getDateCreate(), 
						modelinstances_db[index_db].getDateLastModify(), modelinstances_db[index_db].getStatus(), modelinstances_db[index_db].getStartExec(),
						modelinstances_db[index_db].getEndExec()));
			
			if(index_tmp != -1 && index_notsaved == -1)	
				modelinstances_notsaved.push(new ModelInstance(modelinstances_tmp[index_tmp].getId(), modelinstances_tmp[index_tmp].getSpecificObjective(), 
						modelinstances_tmp[index_tmp].getModelId(), modelinstances_tmp[index_tmp].getUserId(), modelinstances_tmp[index_tmp].getDateCreate(), 
						modelinstances_tmp[index_tmp].getDateLastModify(), modelinstances_tmp[index_tmp].getStatus(), modelinstances_tmp[index_tmp].getStartExec(),
						modelinstances_tmp[index_tmp].getEndExec()));
			
			if(index_db != -1)
				modelinstances_db[index_db].setStatus(0);
			if(index_tmp != -1)
				modelinstances_tmp[index_tmp].setStatus(0);
			
			view.editLFCriteriaModel();
		}
	}
	
	this.responseModifyDataCriteriaInstanceXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{	
			// Caso di modifica dei dati (Pesi archi e IF) di un criteria
			var index_notsaved = util.getIndexById(modelinstances_notsaved, modelInstanceId);
			var index_db = util.getIndexById(modelinstances_db, modelInstanceId);
			var index_tmp = util.getIndexById(modelinstances_tmp, modelInstanceId);
			
			if(index_db != -1 && index_notsaved == -1)
				modelinstances_notsaved.push(new ModelInstance(modelinstances_db[index_db].getId(), modelinstances_db[index_db].getSpecificObjective(), 
						modelinstances_db[index_db].getModelId(), modelinstances_db[index_db].getUserId(), modelinstances_db[index_db].getDateCreate(), 
						modelinstances_db[index_db].getDateLastModify(), modelinstances_db[index_db].getStatus(), modelinstances_db[index_db].getStartExec(),
						modelinstances_db[index_db].getEndExec()));
			
			if(index_tmp != -1 && index_notsaved == -1)	
				modelinstances_notsaved.push(new ModelInstance(modelinstances_tmp[index_tmp].getId(), modelinstances_tmp[index_tmp].getSpecificObjective(), 
						modelinstances_tmp[index_tmp].getModelId(), modelinstances_tmp[index_tmp].getUserId(), modelinstances_tmp[index_tmp].getDateCreate(), 
						modelinstances_tmp[index_tmp].getDateLastModify(), modelinstances_tmp[index_tmp].getStatus(), modelinstances_tmp[index_tmp].getStartExec(),
						modelinstances_tmp[index_tmp].getEndExec()));
			
			if(index_db != -1)
				modelinstances_db[index_db].setStatus(0);
			if(index_tmp != -1)
				modelinstances_tmp[index_tmp].setStatus(0);
			
			var res = req_xml.responseXML;
			
			green_IFinsert = res.getElementsByTagName("IF_insert")[0].getElementsByTagName("IF_green")[0].textContent;
			white_IFinsert = res.getElementsByTagName("IF_insert")[0].getElementsByTagName("IF_white")[0].textContent;
			red_IFinsert = res.getElementsByTagName("IF_insert")[0].getElementsByTagName("IF_red")[0].textContent;
			
			view.editWeightsAndIFModelInstance();
		}
	}
	
	// Funzione che cattura la risposta alla richiesta PUT in formato XML per la modifica di una risorsa Model per la modifica di un Criteria
	this.responseModifyInfoCriteriaInstanceXML = function()
	{	
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{	
			// Caso di modifica delle info (url e comment) di un criteria
			var obj_xml = req_xml.responseXML;
			
//			var id_modelinstance = obj_xml.getElementsByTagName("modelInstanceId")[0].textContent;
//			var specific_objective = obj_xml.getElementsByTagName("specific_objective")[0].textContent;
//			 
//			if(util.getIndexById(modelinstances_db, id_modelinstance) > -1)
//				modelinstances_db[util.getIndexById(modelinstances_db, id_modelinstance)].setSpecificObjective(specific_objective);
//			else if(util.getIndexById(modelinstances_tmp, id_modelinstance) > -1)
//				modelinstances_tmp[util.getIndexById(modelinstances_tmp, id_modelinstance)].setSpecificObjective(specific_objective);
		}
	}
	
}