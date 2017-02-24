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
var HTTPRequestCriteria = function( )
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
	this.doRequestXML = function(xml_criteria)
	{	
		req_xml = new XMLHttpRequest();
		req_xml.open(type, address_request, async_mode);

		if(type == "GET")
			req_xml.onreadystatechange = function(){ this_app.responseGetCriteriaWeightsXML(); };
		else if(type == "POST")
			req_xml.onreadystatechange = function(){ this_app.responseAddCriteriaXML(); };
		else if(type == "PUT")
			req_xml.onreadystatechange = function(){ this_app.responseModifyCriteriaXML(); };
		else if(type == "DELETE")
			req_xml.onreadystatechange = function(){ this_app.responseDeleteCriteriaXML(); };
		
		req_xml.setRequestHeader("Content-Type","application/xml");
		req_xml.send(xml_criteria);
	}
	
	
	// Funzione che cattura la risposta alla richiesta PUT in formato XML per la modifica di una risorsa Model per l'inserimento di un Criteria
	this.responseAddCriteriaXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var index_notsaved = util.getIndexById(models_notsaved, modelId);
			var index_db = util.getIndexById(models_db, modelId);
			var index_tmp = util.getIndexById(models_tmp, modelId);
			
			if(index_db != -1 && index_notsaved == -1)
				models_notsaved.push(new Model(models_db[index_db].getId(), models_db[index_db].getObjective(), models_db[index_db].getUserId(), models_db[index_db].getUrl(), models_db[index_db].getDescription(), models_db[index_db].getDateCreate(), models_db[index_db].getDateLastModify()));
			
			if(index_tmp != -1 && index_notsaved == -1)	
				models_notsaved.push(new Model(models_tmp[index_tmp].getId(), models_tmp[index_tmp].getObjective(), models_tmp[index_tmp].getUserId(), models_tmp[index_tmp].getUrl(), models_tmp[index_tmp].getDescription(), models_tmp[index_tmp].getDateCreate(), models_tmp[index_tmp].getDateLastModify()));
			
			view.modifyCriteriaModel();
		}
	}	
	
	// Funzione che cattura la risposta alla richiesta PUT in formato XML per la modifica di una risorsa Model per la modifica di un Criteria
	this.responseModifyCriteriaXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var obj_xml = req_xml.responseXML;
			
			var index_notsaved = util.getIndexById(models_notsaved, modelId);
			var index_db = util.getIndexById(models_db, modelId);
			var index_tmp = util.getIndexById(models_tmp, modelId);
			
			if(index_db != -1 && index_notsaved == -1)
				models_notsaved.push(new Model(models_db[index_db].getId(), models_db[index_db].getObjective(), models_db[index_db].getUserId(), models_db[index_db].getUrl(), models_db[index_db].getDescription(), models_db[index_db].getDateCreate(), models_db[index_db].getDateLastModify()));
			
			if(index_tmp != -1 && index_notsaved == -1)	
				models_notsaved.push(new Model(models_tmp[index_tmp].getId(), models_tmp[index_tmp].getObjective(), models_tmp[index_tmp].getUserId(), models_tmp[index_tmp].getUrl(), models_tmp[index_tmp].getDescription(), models_tmp[index_tmp].getDateCreate(), models_tmp[index_tmp].getDateLastModify()));
			
			view.updateMenuModifyCriteria(obj_xml.getElementsByTagName("objective")[0].textContent, obj_xml.getElementsByTagName("modelId")[0].textContent);
		}	
	}
	
	
	// Funzione che cattura la risposta alla richiesta DELETE in formato XML per la modifica di una risorsa Model per la cancellazione di un Criteria
	this.responseDeleteCriteriaXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{				
			var index_notsaved = util.getIndexById(models_notsaved, modelId);
			var index_db = util.getIndexById(models_db, modelId);
			var index_tmp = util.getIndexById(models_tmp, modelId);
			
			if(index_db != -1 && index_notsaved == -1)
				models_notsaved.push(new Model(models_db[index_db].getId(), models_db[index_db].getObjective(), models_db[index_db].getUserId(), models_db[index_db].getUrl(), models_db[index_db].getDescription(), models_db[index_db].getDateCreate(), models_db[index_db].getDateLastModify()));
			
			if(index_tmp != -1 && index_notsaved == -1)	
				models_notsaved.push(new Model(models_tmp[index_tmp].getId(), models_tmp[index_tmp].getObjective(), models_tmp[index_tmp].getUserId(), models_tmp[index_tmp].getUrl(), models_tmp[index_tmp].getDescription(), models_tmp[index_tmp].getDateCreate(), models_tmp[index_tmp].getDateLastModify()));
			
			view.modifyCriteriaModel();
		}	
	}
}