<%-- ResilienceDS
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
along with this program.  If not, see <http://www.gnu.org/licenses/>. --%>

<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>

	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Visualize Model</title>
	
	<link rel="stylesheet" type="text/css" href="css/model.css">
	<link rel="stylesheet" type="text/css" href="css/fram.css">
    
    <script type="text/javascript" src="js/graphics/nodes_model/text_only.js"></script>
    <script type="text/javascript" src="js/graphics/operations_model.js"></script>
    <script type="text/javascript" src="js/graphics/operations_groups.js"></script>
    <script type="text/javascript" src="js/graphics/operations_nodes.js"></script>
    <script type="text/javascript" src="js/graphics/zoom.js"></script>
    
    
	<script type="text/javascript" src="js/graphics/windows/function_edit_window.js"></script>
	<script type="text/javascript" src="js/graphics/windows/function_info_window.js"></script>
	
    <script type="text/javascript" src="lib/XML/ObjTree.js"></script>
	<script type="text/javascript" src="js/client.js"></script>
	<script type="text/javascript" src="js/connection/asyncContext.js"></script>
	<script type="text/javascript" src="js/httprequest/httpRequestModel.js"></script>
	<script type="text/javascript" src="js/httprequest/httpRequestCriteria.js"></script>
	<script type="text/javascript" src="js/httprequest/httpRequestModelInstance.js"></script>
	<script type="text/javascript" src="js/httprequest/httpRequestCriteriaInstance.js"></script>
	<script type="text/javascript" src="js/httprequest/httpRequestOperationModel.js"></script>
	<script type="text/javascript" src="js/httprequest/httpRequestOperationModelInstance.js"></script>
	<script type="text/javascript" src="js/view/view.js"></script>
	<script type="text/javascript" src="js/util/util.js"></script>

	<style type="text/css">
		body {
			overflow: hidden;
		}
	</style>

</head>

<body>

	<%  
		// Codice Java per il controllo sull'accesso - lo permette solo se la sessione esiste
		String userName = null;
		
		if(session.getAttribute("User") == null){
			response.sendRedirect("login.html");
			%> 
				<script> 
					$('#nav').remove();
					$('#menu-side').remove();
					$('#sub-menu').remove();
					$('#toppanel').remove();
					$('#model_instancemodel_info').remove();	
				</script> 
			<% 
		}
		else 
			userName = (String) session.getAttribute("user");
		
		String sessionID = null;
		
		Cookie[] cookies = request.getCookies();
		if(cookies !=null)
		{
			for(Cookie cookie : cookies){
				if(cookie.getName().equals("User")) 
					userName = cookie.getValue();
				if(cookie.getName().equals("JSESSIONID")) 
					sessionID = cookie.getValue();
			}
		}
		
	%>

	<div id="model_body"></div>
 
    <script type="text/javascript">
	    
	    var root;
	    
	    var width_tree = screen.width, height_tree = screen.height;
		var width_node = 200, height_node = 80;
		
		var tree, nodes;
		var diagonal, svg_body;
		var node, link;
		
		var duration = 750;
		

		var width_modifyimg = 16, height_modifyimg = 16;
		// Richiesta del modello scelto dall'utente 	   	
		var load_from = clientRest.getModel();
		if(load_from=="local"){
			console.log("Modify of a local model. ");
			id_currentpage = 3;
			nodes.forEach(function(d){
				addFunctionTextModify(d.id);
			}); //file: text_modify.js
			createSubmenu(3, user.getId());	
		}
		//XXX OLD. Funzione richiamata da view per visualizzare il modello che l'utente ha scelto di aprire
	    function visualize_model(idUserModel)
	    {
	    	id_currentpage = 1;
			
	    	zoom_initial = 0.7;
			
	    	// Apertura del menu laterale per la modifica della visualizzazione del modello
	    	visualizeMenuside();
	    	rotateOn();
	    	
	    	// Controllo sul tipo di utente - l'utente guest non può modificare il modello
	    	if(user.getType() !== 1)
	    	{
	    		// console.log("Id dell'utente loggato: " + user.getId());
	    		// console.log("Id dell'utente che ha creato il modello selezionato: " + idUserModel);

				// Creazione del menu per le operazioni personalizzate sul modello
				createSubmenu(1, idUserModel);	
	    	}
			
	    	root = json_data;// Ale: json data created in httpRequestModel
		
	    	// Ale: Initialization of the FRAM model. File operations_model.js
	   		// initModel();
	   		initFRAMModel();
	   		
	   		// Ale: Visualization of the FRAM model operations_model.js
			// showModel();
			showFRAMModel();
	   			
   			node.each(function(d,i){
   				addNodeText(getId(d.position), d.description);
   			});
	    }
		// Functions called by view for visualize a model choised by the user.
	    function visualize_FRAMmodel(idUserModel)
	    {
	    	id_currentpage = 1;
			
	    	zoom_initial = 0.7;
			
	    	// Apertura del menu laterale per la modifica della visualizzazione del modello
	    	visualizeMenuside();
	    	// rotateOn();
	    	
	    	// Controllo sul tipo di utente - l'utente guest non può modificare il modello
	    	if(user.getType() !== 1)
	    	{
	    		console.log("Id dell'utente loggato: " + user.getId());
	    		console.log("Id dell'utente che ha creato il modello selezionato: " + idUserModel);

				// Creazione del menu per le operazioni personalizzate sul modello
				createSubmenu(1, idUserModel);	
	    	}
			
	    	root = json_data;// Ale: json data created in httpRequestModel
		
	   		initFRAMModel(); // Ale: Initialization of the FRAM model. File operations_model.js
	   		
			showFRAMModel(); // Ale: Visualization of the FRAM model operations_model.js
	   			
   			nodes.forEach(function(d){
   				addGroupShow(d.id);
   				showFunctionInfo(d.id);
   			});
	    }
				
    </script>

</body>
</html>

