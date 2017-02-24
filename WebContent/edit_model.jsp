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
	<title>Modify FRAM Model</title>
    
    <!-- Style CSS -->
    <link rel="stylesheet" type="text/css" href="lib/jquery-ui/jquery-ui.css">
    <link rel="stylesheet" type="text/css" href="css/model.css">
	<link rel="stylesheet" type="text/css" href="css/window.css">
	<link rel="stylesheet" type="text/css" href="css/fram.css">

	<!-- Import delle librerie -->
	
	<!-- Import dei file js necessari -->
	<script type="text/javascript" src="js/graphics/windows/intro_model_window.js"></script>
	<script type="text/javascript" src="js/util/util.js"></script>
	
	<script type="text/javascript" src="js/graphics/nodes_model/plus.js"></script>
	<script type="text/javascript" src="js/graphics/nodes_model/edit.js"></script>
	<script type="text/javascript" src="js/graphics/nodes_model/text_modify.js"></script>
	
	<script type="text/javascript" src="js/graphics/windows/function_edit_window.js"></script>
	<script type="text/javascript" src="js/graphics/windows/group_edit_window.js"></script>
	<script type="text/javascript" src="js/graphics/windows/group_add_function_window.js"></script>
	<script type="text/javascript" src="js/graphics/windows/aspect_edit_window.js"></script>
	<script type="text/javascript" src="js/graphics/operations_model.js"></script>
	<script type="text/javascript" src="js/graphics/operations_groups.js"></script>
	<script type="text/javascript" src="js/graphics/operations_nodes.js"></script>
	<script type="text/javascript" src="js/graphics/zoom.js"></script>
    
</head>

<body>
	
	<%
		// Codice Java per il controllo sull'accesso - lo permette solo se la sessione esiste
	 	String userName = null;
		
		if(session.getAttribute("User") == null)
		{
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
	
	<!-- DIV PRINCIPALE -->
	<div id="model_body"></div>
	
	<!-- Ale: DIV for the insertion or modification of a Function 
	<div id="modal_Function" style="display:none;" class="IF-window" title="Insert Function's Info.">
	
		<div id="F_tab_name" class="IF-tab">
			<label>Function Name</label>
			<input type="text" id="inputname" size=200 style="background-color:white" class="input-if">
			
			<span id="errmsg_IF" class="error_msg"></span>
		</div>

		<div id="F_tab_description" class="IF-tab">
			<label>Function Description</label>
			<textarea id="inputdescription" size=200 rows="5" cols="40">
			</textarea>
			
			<span id="errmsg_IF" class="error_msg"></span>
		</div>
		<span id="errmsg_LF" class="error_msg"></span>
	</div> -->
	
	<script type="text/javascript">
	
		var width_tree = screen.width, height_tree = screen.height;
		//XXX Above old config.
		var width_node = 200, height_node = 80;
		var width_nodeplus = 40, height_nodeplus = 40;
		var width_modifyimg = 16, height_modifyimg = 16;
		
		var text_modify = "Insert description...";
		var path_imgplus = "image/plus.png";
		
		var duration = 750;
		
		var tree, nodes, links;
		var diagonal, svg_body;
		var node, nodeInitial, link; //XXX nodeInitial
		
		var root_original; //XXX old
		
		function confirmEditedModel()
		{
			var allnodes_edited = d3.selectAll(".edit-rect");
			
			// Controllo se tutti i criteri hanno le descrizioni
			if(allnodes_edited.empty())
				clientRest.saveModel(); // CHIAMATA REST PER IL SALVATAGGIO DEL MODELLO SUL DB
			else
				showAlert("Insert description inside all criterias!");
		}
		
		function clearEditedModel()
		{
			console.log("Reset Model");
			d3.select("svg").remove();
			
			clientRest.resetModel();
		}
		
		//----------------------------------------------------------------------------------
		
		$(document).ready(function () 
		{			
			console.log("Get the model");
			var load_from = clientRest.getModel();
			
			createSubmenu(3, user.getId());
			
			if(load_from=="local"){
				console.log("Modify of a local model. ");
				id_currentpage = 3;
				nodes.forEach(function(d){
					addFunctionTextModify(d.id);
				}); //file: text_modify.js
				createSubmenu(3, user.getId());	
			}
		});
		

		function visualize_FRAMmodel() //XXX Use the same name of a function in view, for use the same getXML function without changes.
		{
			console.log("Edit the model: "+modelId);
			id_currentpage = 3;
			
			zoom_initial = 0.7;
			
			visualizeMenuside();
			
			root = json_data;
			
			console.log(root);
			
			// Inizializzazione del modello caricato dal server
			// initModel();	
			initFRAMModel();	
			
			// Visualizzazione del modello caricato dal server
			
			showFRAMModel();
			// updateFRAMModel();
			
			// Ale: Adds the edit option over the root node.
			nodes.forEach(function(d){
				addFunctionTextModify(d.id);
			}); //file: text_modify.js
		}
		function edit_model()
		{
			console.log("Edit the model: "+modelId);
			id_currentpage = 3;
			
			zoom_initial = 0.7;
			
			visualizeMenuside();
			
			root = json_data;
			
			console.log(root);
			
			//rotateOff();
			
			// Inizializzazione del modello caricato dal server
			// initModel();	
			initFRAMModel();	
			
			// Visualizzazione del modello caricato dal server
			
			showFRAMModel();
			// updateFRAMModel();
			
			// Ale: Adds the edit option over the root node.
			// addFunctionTextModify(0); //file: text_modify.js
		  	
			// Per ogni nodo si inserisce un nodo text modify
			
			node.each(function(d,i){
				addNodeTextModify(getId(d.position), d.description);
			});
			
			// Aggiunta del campo id nel modello caricato dal server
			for(var i = 0; i < nodes.length; i++)
			{
				nodes[i].id = getId(nodes[i].position);
			}
		
			// Aggiunta dei nodi plus
			addAdditionalNodes();
			
		}
		
		/*
		function addAdditionalNodes()
		{
			node.each(function(d,i) 
			{
				computeNewNodeOnExisting(d);
			});
			
			updateModel();
		}
		*/
		function update(id_node, Fname, Fdescription)
		{
			Flast_id=id_node;

			computeNewFunction(id_node, Fname, Fdescription);
			
			updateFRAMModel();
		}	
	   			
	</script>

</body>
</html>