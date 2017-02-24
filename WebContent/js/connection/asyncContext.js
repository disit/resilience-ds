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
 * Classe definita per gestire la comunicazione verso il client attraverso asyncContext
 */
var asyncContext = function(http_req_model){
	
	var req_model = http_req_model;
	var objHTTP;
	var obj_app = this;

	// Funzione utilizzata per avviare l'async-context per la connessione al database
	this.connect = function()
	{
		string_address = 'http://'+server_address+':'+port_number+'/dss/rest/models/live';
		objHTTP = new XMLHttpRequest();
		objHTTP.open('GET', string_address, true);	
		objHTTP.onreadystatechange = function(){ obj_app.responseAsyncContext(); };			
		objHTTP.send(null);
	}
	
	
	this.responseAsyncContext = function()
	{
		if(objHTTP.readyState == 4 && objHTTP.status == 204)
			obj_app.getListModels();
	}
	
	this.getListModels = function()
	{
		var address_request = 'http://'+server_address+':'+port_number+'/dss/rest/models';
		req_model.createRequest('GET',address_request,true); 
		req_model.doRequestXML(null,"getModels");
	}
	
}