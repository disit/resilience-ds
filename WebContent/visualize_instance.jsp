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
	<title>Visualize instance</title>

	<!-- Style CSS -->
	<!-- <link rel="stylesheet" href="css/instance.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/compute.css" type="text/css" media="screen" /> -->
	<link rel="stylesheet" type="text/css" href="css/model.css">
	<link rel="stylesheet" type="text/css" href="lib/jquery-ui/jquery-ui.css">
	<link rel="stylesheet" type="text/css" href="css/window.css">
	<link rel="stylesheet" type="text/css" href="css/fram.css">
	
	<script type="text/javascript" src="js/graphics/windows/controller/controls_incongruence_windows.js"></script>
	<script type="text/javascript" src="js/graphics/windows/incogruity_window.js"></script>
	<script type="text/javascript" src="js/graphics/windows/function_edit_window.js"></script>
	<script type="text/javascript" src="js/graphics/windows/function_info_window.js"></script>
	
	<script type="text/javascript" src="js/graphics/nodes_instance/italian_flag.js"></script>
    <script type="text/javascript" src="js/graphics/operations_instance.js"></script>
    <script type="text/javascript" src="js/graphics/operations_model.js"></script>
    <script type="text/javascript" src="js/graphics/operations_groups.js"></script>
    <script type="text/javascript" src="js/graphics/operations_nodes.js"></script>
    <script type="text/javascript" src="js/graphics/zoom.js"></script>
    
    <script type="text/javascript" src="lib/d3/tooltip/index.js"></script>

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
	
	<div id="model_body"></div>
	
	<!-- Ale: Code for SmartDS. With the Menu for change the IF 
	<div id="instance_body"></div>
	
	 <div id="incongruityDiv" style="display:none" title="Choose the Italian Flag that you want to use for the compute decision">
		<div id="IFUser_div" class="IF-div" title="Click to choose your IF">
			<label id="titleIFUser" class="title-label">Italian Flag added of the user</label>
			<label id="greenLabel" style="background-color:green" class="if-label"></label>
			<label id="whiteLabel" style="background-color:white" class="if-label"></label>
			<label id="redLabel" style="background-color:red" class="if-label"></label>
			<label id="titleIFChange">Change your Italian Flag value to remove the incongruence</label>
			<input type="text" id="greenChangeLabel" maxLength=5 size=5 style="background-color:green" class="if-input">
			<input type="text" id="whiteChangeLabel" maxLength=5 size=5 style="background-color:white" class="if-input">
			<input type="text" id="redChangeLabel" maxLength=5 size=5 style="background-color:red" class="if-input">
		</div>
		<div id="IFCalculated_div" class="IF-div" onclick="confirmIFCalculated()" title="Click to choose your IF">
			<label id="titleIFUser" class="title-label">Italian Flag calculated</label>
			<label id="greenCalcLabel" style="background-color:green" class="if-label"></label>
			<label id="whiteCalcLabel" style="background-color:white" class="if-label"></label>
			<label id="redCalcLabel" style="background-color:red" class="if-label"></label>
		</div>		
	</div> -->
	 
    <script type="text/javascript">

		var root;

		var width_tree = screen.width, height_tree = screen.height;
		var width_node = 200, height_node = 80;
		var width_root = 250, height_root = 130; 

		var width_modifyimg = 16, height_modifyimg = 16;
		
		var tree, nodes;
		var diagonal, svg_body;
		var node, link;
		var tip = null;
		
		var duration = 750;
	    	
		// Richiesta del modello scelto dall'utente 
		id_currentpage = 4;
	   	console.log("Get Model Instance");
		var load_from = clientRest.getModelInstance();
	   	if(load_from=="local"){
			console.log("Modify of a local Instance. ");
			id_currentpage = 6;
			nodes.forEach(function(d){
				addFunctionInstanceTextModify(d.id);
			}); //file: text_modify.js
			createSubmenu(6, user.getId());	
		}
		//OLD Funzione richiamata da view per visualizzare l'istanza selezionata dall'utente
		function visualize_instance(idUser, specific_object, arrayIFIncongruent)
	    {	
			console.log("Visualize Instance");
			focusIFCalculated();
			
			$("body").on("mouseover",'#IFUser_div',focusIFUser);			
			$("body").on("mouseover",'#IFCalculated_div',focusIFCalculated);
			
			$("body").on("click",'#IFUser_div',confirmIFUser);			
			$("body").on("click",'#IFCalculated_div',confirmIFCalculated);
			
			id_currentpage = 4;
			
			zoom_initial = 0.7;
			
	    	// Apertura del menu laterale per la modifica della visualizzazione dell'istanza
	    	visualizeMenuside();
	    	rotateOn();
	    	
	    	// Controllo sul tipo di utente - l'utente guest non può modificare l'istanza
	    	if(user.getType() !== 1)
	    	{
	    		// console.log("Id dell'utente loggato: " + user.getId());
	    		// console.log("Id dell'utente che ha creato l'istanza selezionata: " + idUser);

				createSubmenu(4,idUser);
	    	}
			
	    	root = json_data;
		
	    	// Inizializzazione grafica dell'istanza
			initInstance();
			
	    	// Visualizzazione dell'istanza selezionata
	    	showInstance();
	    	
	    	node.each(function(d,i){
	    		if(d.isLeaf == "true")
	    		{
	    			if(d.IF_insert != undefined)
	    				addNodeIF(getId(d.position), d.description, specific_object, d.IF_insert.IF_green, d.IF_insert.IF_white, d.IF_insert.IF_red, d.function_manager);
	    			else{
	    				addNodeIF(getId(d.position), d.description, specific_object, 0, 0, 0, d.function_manager);
	    			}
	    		}
	    		else{
	    			if(d.IF_calculated != undefined)
	    				addNodeIF(getId(d.position), d.description, specific_object, d.IF_calculated.IF_green, d.IF_calculated.IF_white, d.IF_calculated.IF_red, d.function_manager);
	    			else if(d.IF_insert != undefined)
	    				addNodeIF(getId(d.position), d.description, specific_object, d.IF_insert.IF_green, d.IF_insert.IF_white, d.IF_insert.IF_red, d.function_manager);
	    			else
	    				addNodeIF(getId(d.position), d.description, specific_object, 0, 0, 0, d.function_manager);
	    		}
	    		
	    		if(d.isLeaf == "false")
	    		{
	    			if(d.IF_insert != undefined && d.IF_calculated != undefined)
	    			{
	    				if(user.getId() == idUser){
	    					$('#gnode_'+getId(d.position)).on("click",function(){
		    					createIncongruityWindow(d.position, d.IF_insert.IF_green, d.IF_insert.IF_white, d.IF_insert.IF_red, d.IF_calculated.IF_green, 
		    							d.IF_calculated.IF_white, d.IF_calculated.IF_red);
		    				});	
	    				}	
	    			}
	    		}
   			});
	    	
	    	if(nodes[0].IF_calculated != undefined)
	    	{
	    		// Visualizzazione del risultato del calcolo della decisione
		    	d3.selectAll("#gnode_0").append("text").text("DECISION: " + (Number(nodes[0].IF_calculated.IF_green)*100).toFixed(2) + "%G " +
		    			(Number(nodes[0].IF_calculated.IF_white)*100).toFixed(2) + "%W " + (Number(nodes[0].IF_calculated.IF_red)*100).toFixed(2) + "%R")
		    			.attr("x",-5)
		    			.attr("y",-10);	
	    	}
	    	
	    	alertIFIncongruent(arrayIFIncongruent);
	    }
		
		function controlLeafsIFIsEmpty()
		{
			var leafIFEmpty = false;
			var edgeWeightEmpty = false;
			
			node.each(function(d,i){
				if(d.isLeaf == "false")
				{
					if(d.weightsSerialized == undefined)
						edgeWeightEmpty = true;	
				}
				if(d.isLeaf == "true")
				{
					if(d.IF_insert == undefined && d.function_manager == undefined){
							leafIFEmpty = true;
					}
				}
			});
			
			if(!leafIFEmpty && !edgeWeightEmpty)
				return false;
			else if(leafIFEmpty)
				showAlert("Insert Italian Flag inside all leaf criterias");
			else if(edgeWeightEmpty)
				showAlert("Insert weight on all edges");
				
			return true;
		}
		/** Ale: Function that recalls view for visualize the selected instance of the user.
		*/
		function visualize_FRAMinstance(idUser)
	    {	
			console.log("Visualize FRAM Model: "+modelId+" - Instance: "+modelInstanceId);
			/* focusIFCalculated();
			
			$("body").on("mouseover",'#IFUser_div',focusIFUser);			
			$("body").on("mouseover",'#IFCalculated_div',focusIFCalculated);
			
			$("body").on("click",'#IFUser_div',confirmIFUser);			
			$("body").on("click",'#IFCalculated_div',confirmIFCalculated); */
			
			id_currentpage = 4;
			
			zoom_initial = 0.7;
			
	    	// Apertura del menu laterale per la modifica della visualizzazione dell'istanza
	    	visualizeMenuside();
	    	// rotateOn();
	    	
	    	// Controllo sul tipo di utente - l'utente guest non può modificare l'istanza
	    	if(user.getType() !== 1)
	    	{
	    		// console.log("Id dell'utente loggato: " + user.getId());
	    		// console.log("Id dell'utente che ha creato l'istanza selezionata: " + idUser);

				createSubmenu(4,idUser);
	    	}
			
	    	root = json_data;
		
	    	// Ale: Initialization of the instance.
			// initInstance(); // Ale: In smartds there was a differentiation from model and instance, we don't have this need.
			initFRAMModel();
			
	    	// Ale: Visualization of the instance.
	    	// showInstance(); // Ale: In smartds there was a differentiation from model and instance, we don't have this need.
	    	showFRAMModelInstance();
	    	
	    	nodes.forEach(function(d){
	    		addGroupShow(d.id);
	    		showFunctionInfo(d.id);
	    	});
	    	/* node.each(function(d,i){
	    		if(d.isLeaf == "true")
	    		{
	    			if(d.IF_insert != undefined)
	    				addNodeIF(getId(d.position), d.description, specific_object, d.IF_insert.IF_green, d.IF_insert.IF_white, d.IF_insert.IF_red, d.function_manager);
	    			else{
	    				addNodeIF(getId(d.position), d.description, specific_object, 0, 0, 0, d.function_manager);
	    			}
	    		}
	    		else{
	    			if(d.IF_calculated != undefined)
	    				addNodeIF(getId(d.position), d.description, specific_object, d.IF_calculated.IF_green, d.IF_calculated.IF_white, d.IF_calculated.IF_red, d.function_manager);
	    			else if(d.IF_insert != undefined)
	    				addNodeIF(getId(d.position), d.description, specific_object, d.IF_insert.IF_green, d.IF_insert.IF_white, d.IF_insert.IF_red, d.function_manager);
	    			else
	    				addNodeIF(getId(d.position), d.description, specific_object, 0, 0, 0, d.function_manager);
	    		}
	    		
	    		if(d.isLeaf == "false")
	    		{
	    			if(d.IF_insert != undefined && d.IF_calculated != undefined)
	    			{
	    				if(user.getId() == idUser){
	    					$('#gnode_'+getId(d.position)).on("click",function(){
		    					createIncongruityWindow(d.position, d.IF_insert.IF_green, d.IF_insert.IF_white, d.IF_insert.IF_red, d.IF_calculated.IF_green, 
		    							d.IF_calculated.IF_white, d.IF_calculated.IF_red);
		    				});	
	    				}	
	    			}
	    		}
   			});
	    	
	    	if(nodes[0].IF_calculated != undefined)
	    	{
	    		// Visualizzazione del risultato del calcolo della decisione
		    	d3.selectAll("#gnode_0").append("text").text("DECISION: " + (Number(nodes[0].IF_calculated.IF_green)*100).toFixed(2) + "%G " +
		    			(Number(nodes[0].IF_calculated.IF_white)*100).toFixed(2) + "%W " + (Number(nodes[0].IF_calculated.IF_red)*100).toFixed(2) + "%R")
		    			.attr("x",-5)
		    			.attr("y",-10);	
	    	}
	    	
	    	alertIFIncongruent(arrayIFIncongruent); */
	    }
		
		function controlLeafsIFIsEmpty()
		{
			var leafIFEmpty = false;
			var edgeWeightEmpty = false;
			
			node.each(function(d,i){
				if(d.isLeaf == "false")
				{
					if(d.weightsSerialized == undefined)
						edgeWeightEmpty = true;	
				}
				if(d.isLeaf == "true")
				{
					if(d.IF_insert == undefined && d.function_manager == undefined){
							leafIFEmpty = true;
					}
				}
			});
			
			if(!leafIFEmpty && !edgeWeightEmpty)
				return false;
			else if(leafIFEmpty)
				showAlert("Insert Italian Flag inside all leaf criterias");
			else if(edgeWeightEmpty)
				showAlert("Insert weight on all edges");
				
			return true;
		}
		
		// Funzione per visualizzare il bordo rosso ai nodi incongruenti
		function alertIFIncongruent(arrayIFIncongruent)
		{
			console.log("Array delle incongruenze...");
			console.log(arrayIFIncongruent.length);
			for(var i = 0; i < arrayIFIncongruent.length; i++)
			{
				console.log("Green: " + arrayIFIncongruent[i].green + " white: " + arrayIFIncongruent[i].white + " Red:" + arrayIFIncongruent[i].red + " Position:" + arrayIFIncongruent[i].position);
				$('#rectNodeIF_'+getId(arrayIFIncongruent[i].position)).attr("filter",'url(#f4)');
			}
		}
    			
    </script>

</body>
</html>

