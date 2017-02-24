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
	<title>New Instance</title>
	
	<!-- External library -->
    <script type="text/javascript" src="lib/d3/tooltip/index.js"></script>
    

	<!-- Style CSS -->
	<link rel="stylesheet" href="css/instance.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/window.css" type="text/css" media="screen" />
	<link rel="stylesheet" type="text/css" href="css/fram.css">
	<link rel="stylesheet" type="text/css" href="css/model.css">

	<!-- Internal library -->
	<script type="text/javascript" src="js/graphics/nodes_instance/IF_empty.js"></script>
	<script type="text/javascript" src="js/graphics/nodes_instance/IF_modify.js"></script>
	<script type="text/javascript" src="js/graphics/nodes_instance/italian_flag.js"></script>
    <script type="text/javascript" src="js/graphics/operations_model.js"></script>
    <script type="text/javascript" src="js/graphics/operations_groups.js"></script>
    <script type="text/javascript" src="js/graphics/operations_instance.js"></script>
    <script type="text/javascript" src="js/graphics/operations_nodes.js"></script>
    <script type="text/javascript" src="js/graphics/zoom.js"></script>
    
	<script type="text/javascript" src="js/graphics/nodes_model/text_modify.js"></script>
	
    <script type="text/javascript" src="js/graphics/windows/matrix_window.js"></script>
	<script type="text/javascript" src="js/graphics/windows/controller/matrix_manager.js"></script>
	<script type="text/javascript" src="js/graphics/windows/italianflag_window.js"></script>
	<script type="text/javascript" src="js/graphics/windows/objective_instance_window.js"></script>
	<script type="text/javascript" src="js/graphics/windows/function_instance_edit_window.js"></script>
	<script type="text/javascript" src="js/graphics/windows/controller/controls_instance_windows.js"></script>
	
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


	<!--XXX OLD DIV PER INSERIMENTO O MODIFICA DELLA MATRICE O DEL VETTORE DEI PESI -->
	<div id="modal" style="display:none;" title="Modify weights of edges">
	    <div id="matrix_tab" class="weight-tab"><span id="errmsg_matrix" class="error_msg"></span></div>
	    <div id="vector_tab" class="weight-tab"><span id="errmsg_vector" class="error_msg"></span></div>
	</div>
	
	<!--OLD XXX DIV PER INSERIMENTO O MODIFICA DELL'ITALIAN FLAG -->
	<div id="modal_IF" style="display:none;" class="IF-window" title="Insert Italian Flag value or Logic Functions">
	
		<div id="IF_tab" class="IF-tab">
			<label>Favor probability</label>
			<label>Neutral Probability</label>
			<label>Contrary probability</label>
			<input type="text" id="inputgreen" maxLength=5 size=5 style="background-color:green" class="input-if">
			<input type="text" id="inputwhite" maxLength=5 size=5 style="background-color:white" class="input-if">
			<input type="text" id="inputred" maxLength=5 size=5 style="background-color:red" class="input-if">
			<span id="errmsg_IF" class="error_msg"></span>
		</div>
		
		<div id="LF_tab" class="LF-tab">
			<input type="text" id="input_url_repository_criteria" placeholder="Insert repository for SPARQL query" size="30">
			<hr>
			<div id="first_LF" class="LF-div">
				<label class="title-LF-div">Logic Function 1</label>
				<textarea id="query1" placeholder="Insert query Sparql"></textarea>
				<img src="image/instance/grey_query.png" id="statusQuery1" class="img-status-query" title="Status query"> 
				<div id="div_content_label_LF" class="content-label-LF">
					<label id="labelResultLF1">result query</label>
					<label id="labelThreshold1LF1">threshold</label>
					<label id="labelThreshold2LF1" style="visibility:hidden">threshold</label>
				</div>
				<button id="play_query" title="Simulate your query" class="button-play-query" onclick="clickSimulateQuery1()"></button> 
				<input type="text" id="resultQuery1" maxLength=5 size=6 readonly="readonly" title="Result of query 1. Not editable!">
				<select id="compare1" onchange="changeCompareLF1()">
					<option value="0">Less (&lt;)</option>
					<option value="1">Less-equal (&le;)</option>
					<option value="2">Equal (=)</option>
					<option value="3">Greater-equal (&ge;)</option>
					<option value="4">Greater (&gt;)</option>
					<option value="5">Between (&lt;&gt;)</option>
				</select>
				
				<input type="text" id="threshold1LF1" maxLength=5 size=6>
				<input type="text" id="threshold2LF1" maxLength=5 size=6 style="visibility:hidden">
			</div>
			<hr>
			<div id="second_LF" class="LF-div">
				<label class="title-LF-div">Logic Function 2</label>
				<textarea id="query2" placeholder="Insert query Sparql" onkeyup="writeQuery2()"></textarea>
				<img src="image/instance/grey_query.png" id="statusQuery2" class="img-status-query" title="Status query">
				<div id="div_content_label_LF" class="content-label-LF">
					<label id="labelResultLF2">result query</label>
					<label id="labelThreshold1LF2">threshold</label>
					<label id="labelThreshold2LF2" style="visibility:hidden">threshold</label>
				</div>
				<button id="play_query" title="Simulate your query" class="button-play-query" onclick="clickSimulateQuery2()"></button>
				<input type="text" id="resultQuery2" maxLength=5 size=6 readonly="readonly" title="Result of query 2. Not editable!">
				<select id="compare2" onchange="changeCompareLF2()">
					<option value="0">Less (&lt;)</option>
					<option value="1">Less-equal (&le;)</option>
					<option value="2">Equal (=)</option>
					<option value="3">Greater-equal (&ge;)</option>
					<option value="4">Greater (&gt;)</option>
					<option value="5">Between (&lt;&gt;)</option>
				</select>
				<input type="text" id="threshold1LF2" maxLength=5 size=6>
				<input type="text" id="threshold2LF2" maxLength=5 size=6 style="visibility:hidden">
				
			</div>
			<hr>
			<div id="LF_manager" class="LF-div">
				<label id="title_LFM" class="title-LF-div">Logic Function Manager</label>
				<select id="select_LF1">
					<option value="1">Logic Function 1</option>
					<option value="2">!Logic Function 1</option>
				</select>
				<select id="select_andor">
					<option value="0"></option>
					<option value="1">AND</option>
					<option value="2">OR</option>
				</select>
				<select id="select_LF2">
					<option value="0"></option>
					<option value="1">Logic Function 2</option>
					<option value="2">!Logic Function 2</option>
				</select>
				
				<div id="truefalse_IF">
					<label id="label_favor">Favor probability</label>
					<label id="label_neutral">Neutral Probability</label>
					<label id="label_contrary">Contrary probability</label>
					<label id="label_true">true value</label>
					<input type="text" id="true1" maxLength=5 size=5 style="background-color:green" class="input-if">
					<input type="text" id="true2" maxLength=5 size=5 style="background-color:white" class="input-if">
					<input type="text" id="true3" maxLength=5 size=5 style="background-color:red" class="input-if">
					<label id="label_false">false value</label>
					<input type="text" id="false1" maxLength=5 size=5 style="background-color:green" class="input-if">
					<input type="text" id="false2" maxLength=5 size=5 style="background-color:white" class="input-if">
					<input type="text" id="false3" maxLength=5 size=5 style="background-color:red" class="input-if">
				</div>
				
				
<!-- 				<select id="selectIFPart1" onchange="changeSelectIFPart1()"> -->
<!-- 					<option value="G">Green</option> -->
<!-- 					<option value="W">White</option> -->
<!-- 					<option value="R">Red</option> -->
<!-- 				</select> -->
<!-- 				<input type="text" placeholder="true" id="true1" maxLength=5 size=6> -->
<!-- 				<input type="text" placeholder="false" id="false1" maxLength=5 size=6> -->
<!-- 				<select id="selectIFPart2" onchange="changeSelectIFPart2()"> -->
<!-- 					<option value="G">Green</option> -->
<!-- 					<option value="W">White</option> -->
<!-- 					<option value="R">Red</option> -->
<!-- 				</select> -->
<!-- 				<input type="text" placeholder="true" id="true2" maxLength=5 size=6> -->
<!-- 				<input type="text" placeholder="false" id="false2" maxLength=5 size=6> -->
			</div>
			<span id="errmsg_LF" class="error_msg"></span>
		</div>
	</div>
	
	<!--XXX OLD DIV PER CREAZIONE DELLA SELECT PER SCEGLIERE DA QUALE ISTANZA IMPORTARE I DATI -->
	<div id="div_select_importinstance" style="margin-top:80px;margin-left:900px;display:none">
		<select id="model_instances_to_import_data" onchange="selectModelInstanceToImportData()"></select>
	</div>
	
	<!-- DIV FOR INSERT THE INSTANCE OBJECT-->
	<div id="div_insert_objective" style="display:none" title="Insert specific objective for process model">
		<input type="text" id="input_objective" placeholder="Insert objective for instance" size="30" onfocus="focusInputObjective()">
		<!--   
		<input type="text" id="input_url_repository" placeholder="Insert repository for SPARQL query" value="http://it.dbpedia.org/sparql" size="30">
		-->
	</div>
	
	<!--  
	<div id="instance_body"></div>
	-->
	<div id="model_body"></div>
	 
    <script type="text/javascript">
    
    	var width_tree = screen.width, height_tree = screen.height;
		var width_node = 200, height_node = 80;
		var width_nodeplus = 40, height_nodeplus = 40;
		var width_modifyimg = 16, height_modifyimg = 16;
		var width_matriximg = 24, height_matriximg = 24;
		
		var duration = 750;
		
		var tree, nodes, links, root;
		var diagonal, svg_body;
		var node, link;
		var tip = null;
		
		var root_original;
		
		function confirmNewInstance()
		{		
			// CHIAMATA REST PER IL SALVATAGGIO DELL'ISTANZA SUL DB
			clientRest.saveModelInstance();
		}
		
		function clearNewInstance()
		{
			d3.select("svg").remove();
			
			clientRest.resetModelInstance();
		}
		
		//----------------------------------------------------------------------------------
		
		$(document).ready(function () 
		{			
			// First Checks if the model is saved.
			console.log("Checks if the model is saved ");
			var model_saved = false;
			for(var i in models_db){ 
				if( models_db[i].getId() == modelId ){ model_saved = true; break; }			
			}
			if(model_saved){				
				
				createObjectiveInstanceWindow();
	// 			changeSelectIFPart1();
				initEvents();
			}
			else showAlert("First save the model!");
		});
		
		function objectiveWindowClosed(objective, url_repository)
		{	
			if(objective != null)
			{
				if(url_repository != null)
					repository = url_repository;
				
				clientRest.createModelInstance(objective); // CHIAMATA REST - Creazione di una nuova istanza sul server
				specific_object = objective;
			}
			else
				disableSubMenu();
		}
		
		// Funzione richiamata da view per creare una nuova istanza
		function new_FRAMinstance(specific_object)
		{
			console.log("New FRAM Instance creation.");
			id_currentpage = 5;
			
			zoom_initial = 0.7;
			
    		root = json_data.modelinstance; 
			console.log(json_data);
			// Apertura del menu laterale per la modifica della visualizzazione dell'istanza
	    	visualizeMenuside();
	    	rotateOff();
			
	    	// Apertura del sotto menù per le operazioni effettuabili sull'istanza
			createSubmenu(5, user.getId());
			
			// Initializatio of the isntance loaded from the server. The same of model.
			initFRAMModel(); //Ale: operations_model.js
			// initInstance();	
			
			// Visualizzazione dell'istanza caricata dal server
			// showInstance();
			showFRAMModelInstance();
			
			nodes.forEach(function(d){
				addFunctionInstanceTextModify(d.id);
			}); //file: text_modify.js
			
			modelinstancenotsaved_update();		//Saves temporary the model.
		}
		
		function focusInputObjective()
		{
			$('#input_objective').css("box-shadow","inset 0 1px 3px #000");
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
		
		// Funzione per controllare se il modello da cui si carica l'istanza ha al suo interno un criterio con un unico figlio
		function haveOneChild()
		{	
			if(nodes.length == 1)
				return true;
			else{
				for(var i = 0; i < nodes.length; i++)
				{	
					if(nodes[i].children != undefined)
						if(nodes[i].children.length == 1)
							return true;
				}	
			}
			
			return false;
		}
		
		function initEvents()
		{
			$("body").on("mouseover",'#matrix_tab',focusMatrixTab);			
			$("body").on("mouseover",'#vector_tab',focusVectorTab);
			
			$("body").on("click",'#matrix_tab',confirmMatrixTab);			
			$("body").on("click",'#vector_tab',confirmVectorTab);
			
			$("body").on("mouseover",'#IF_tab',focusIFTab);			
			$("body").on("mouseover",'#LF_tab',focusLFTab);
			
			$("body").on("click",'#IF_tab',confirmIFTab);			
			$("body").on("click",'#LF_tab',confirmLFTab);
			
			$('#inputgreen').on("keyup", function(e){ controlDigitGreen(e); });
			$('#inputwhite').on("keyup", function(e){ controlDigitWhite(e); });
			$('#inputred').on("keyup", function(e){ controlDigitRed(e); });
			
			$("#true1").on("keyup", function(e){ controlDigitTrue1(e); });
			$("#true2").on("keyup", function(e){ controlDigitTrue2(e); });
			$("#true3").on("keyup", function(e){ controlDigitTrue3(e); });
			
			$("#false1").on("keyup", function(e){ controlDigitFalse1(e); });
			$("#false2").on("keyup", function(e){ controlDigitFalse2(e); });
			$("#false3").on("keyup", function(e){ controlDigitFalse3(e); });
		}
		
    </script>

</body>

</html>