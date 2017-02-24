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
   
/**
 * 
 * Classe definita per gestire le richieste REST effettuate dal client per operazioni di creazione e modifica 
 * di risorsa User
 */

var HTTPRequestUser = function()
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
	this.doRequestXML = function(xml_user,type_put)
	{	
		req_xml = new XMLHttpRequest();
		req_xml.open(type, address_request, async_mode);
		
		if(type == "GET")
			req_xml.onreadystatechange = function(){ this_app.getUserXML(); };
		else if(type == "PUT")
		{
			if(type_put == "modifyUserLogged")
				req_xml.onreadystatechange = function(){ this_app.modifyUserLoggedXML(); };
			else if(type_put == "modifyUserFromAdmin")
				req_xml.onreadystatechange = function(){ this_app.modifyUserFromAdminXML(); };
		}
			
		req_xml.setRequestHeader("Content-Type","application/xml");
		req_xml.send(xml_user);
	}
	
	this.modifyUserLoggedXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var obj_xml = req_xml.responseXML;
			
			var id = obj_xml.getElementsByTagName("id")[0].textContent;
			var email = obj_xml.getElementsByTagName("email")[0].textContent;
			var name = obj_xml.getElementsByTagName("name")[0].textContent;
			var country = obj_xml.getElementsByTagName("country")[0].textContent;
			
			view.updateUserData(id, email, name, country);
			
//			alert("Dati utente modificati correttamente");
		}	
	}
	
	this.modifyUserFromAdminXML = function()
	{
		if(req_xml.readyState == 4 && req_xml.status == 200)
		{
			var obj_xml = req_xml.responseXML;
			
			view.updateUserType(obj_xml.getElementsByTagName("id")[0].textContent, obj_xml.getElementsByTagName("type")[0].textContent);
			
//			alert("Tipologia utente modificata correttamente");
		}	
	}
	
	
}
