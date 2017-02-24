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
	<title>Edit Instance</title>
	
	<!-- External library -->
    <script type="text/javascript" src="lib/d3/tooltip/index.js"></script>

	<!-- Style CSS -->
	<link rel="stylesheet" href="css/instance.css" type="text/css" media="screen" />
	<link rel="stylesheet" type="text/css" href="css/model.css">
	<link rel="stylesheet" type="text/css" href="css/fram.css">
	<link rel="stylesheet" type="text/css" href="lib/jquery-ui/jquery-ui.css">
	
	<script type="text/javascript" src="js/graphics/nodes_model/plus.js"></script>
	<script type="text/javascript" src="js/graphics/nodes_model/edit.js"></script>
	<script type="text/javascript" src="js/graphics/nodes_model/text_modify.js"></script>
	
	<!-- Internal library -->
	<!-- <script type="text/javascript" src="js/graphics/nodes_instance/IF_modify.js"></script>
	<script type="text/javascript" src="js/graphics/nodes_instance/IF_empty.js"></script> -->	
	<script type="text/javascript" src="js/graphics/windows/function_instance_edit_window.js"></script>
    <script type="text/javascript" src="js/graphics/operations_instance.js"></script>
    <script type="text/javascript" src="js/graphics/operations_nodes.js"></script>
    <script type="text/javascript" src="js/graphics/operations_model.js"></script>
    <script type="text/javascript" src="js/graphics/operations_groups.js"></script>
    <script type="text/javascript" src="js/graphics/zoom.js"></script>
    <!-- <script type="text/javascript" src="js/graphics/windows/matrix_window.js"></script>
	<script type="text/javascript" src="js/graphics/windows/controller/matrix_manager.js"></script>
	<script type="text/javascript" src="js/graphics/windows/italianflag_window.js"></script>
	<script type="text/javascript" src="js/graphics/windows/controller/controls_instance_windows.js"></script> -->

</head>

<body>

	<%
		String userName = null;
		
		//allow access only if session exists
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
		}else 
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
	<!-- DIV MAIN -->
	<div id="model_body"></div>
	
		 
    <script type="text/javascript">
    
    	var width_tree = screen.width, height_tree = screen.height;
		var width_node = 200, height_node = 80;
		var width_nodeplus = 40, height_nodeplus = 40;
		var width_modifyimg = 16, height_modifyimg = 16;
		var width_matriximg = 24, height_matriximg = 24;
		
		var duration = 750;
		
		var tree, nodes, links;
		var diagonal, svg_body;
		var node, link;
		var tip = null;
		
		function confirmEditedInstance()
		{
			// CHIAMATA REST PER IL SALVATAGGIO DELL'ISTANZA SUL DB
			clientRest.saveModelInstance();
			// saveFRAMModelInstance(id_modelinstance, id_model); //XXX Pass the 2 parameters.
		}
		
		function clearEditedInstance()
		{
			d3.select("svg").remove();
			
			clientRest.resetModelInstance();
		}
		
		//----------------------------------------------------------------------------------		
		$(document).ready(function () 
		{			
			edit_instance();
			
			createSubmenu(6, user.getId());
		});		
	
		function edit_instance()
		{
			id_currentpage = 6;
			
			zoom_initial = 0.7;
			
			root = json_data;		console.log(root);
			//Save the model among the model not saved.
			
			
			// Inizializzazione del modello caricato dal server
			initFRAMModel();	
			
			// Visualizzazione del modello caricato dal server			
			showFRAMModel();
			
			// Ale: Adds the edit option over the root node.
			nodes.forEach(function(d){
				addFunctionInstanceTextModify(d.id);
			}); //file: text_modify.js			
		}
		
		function changeWeightsInstance(weights, criteriaInstancePosition)
		{
			console.log(weights);
			var weights_array = util.tokenizerVector(weights);
			var idvect = util.get_idvectnode(getId(criteriaInstancePosition));
			console.log(nodes[idvect]);
			
			if(nodes[idvect] != undefined)
			{
				for(var i = 0; i < nodes[idvect].children.length; i++)
					$('#linklabel_'+nodes[idvect].children[i].id).text(parseFloat(Number(weights_array[i]).toFixed(3)));	
			}
		}
		
		function selectModelInstanceToImportData()
		{
			importDataFromInstance($('#model_instances_to_import_data').val());
		}
		
		function importDataFromInstance(id_instance)
		{
			if(id_instance != 0)
				clientRest.importDataFromInstance(id_instance);
		}
		
		function setSelect()
		{
			$('#model_instances_to_import_data').html(options_modelinstances);
			$('#div_select_importinstance').show();
		}
		
    </script>

</body>

</html>