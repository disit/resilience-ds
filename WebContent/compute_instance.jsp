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
	<title>Insert title here</title>
	

	<!-- Style CSS -->
	<link rel="stylesheet" href="css/instance.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/compute.css" type="text/css" media="screen" />
	
	<!-- Internal library -->
	<script type="text/javascript" src="js/graphics/windows/controller/controls_incongruence_windows.js"></script>
	<script type="text/javascript" src="js/graphics/windows/incogruity_window.js"></script>
	<script type="text/javascript" src="js/graphics/nodes_instance/italian_flag.js"></script>
    <script type="text/javascript" src="js/graphics/operations_instance.js"></script>
    <script type="text/javascript" src="js/graphics/operations_nodes.js"></script>
    <script type="text/javascript" src="js/graphics/zoom.js"></script>

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
	
	<div id="instance_body"></div>
	
	<div id="incongruityDiv" style="display:none" title="Choose the Italian Flag that you want to use for the compute decision">
		<div id="IFUser_div" tabindex="-1" class="IF-div" title="Click to choose your IF">
			<label id="titleIFUser" class="title-label">Italian Flag added of the user</label>
			<label id="greenLabel" style="background-color:green" class="if-label"></label>
			<label id="whiteLabel" style="background-color:white" class="if-label"></label>
			<label id="redLabel" style="background-color:red" class="if-label"></label>
			<label id="titleIFChange">Change your Italian Flag value to remove the incongruence</label>
			<input type="text" id="greenChangeLabel" maxLength=5 size=5 style="background-color:green" class="if-input">
			<input type="text" id="whiteChangeLabel" maxLength=5 size=5 style="background-color:white" class="if-input">
			<input type="text" id="redChangeLabel" maxLength=5 size=5 style="background-color:red" class="if-input">
		</div>
		<div id="IFCalculated_div" tabIndex="-1" class="IF-div" onclick="confirmIFCalculated()" title="Click to choose your IF">
			<label id="titleIFUser" class="title-label">Italian Flag calculated</label>
			<label id="greenCalcLabel" style="background-color:green" class="if-label"></label>
			<label id="whiteCalcLabel" style="background-color:white" class="if-label"></label>
			<label id="redCalcLabel" style="background-color:red" class="if-label"></label>
		</div>		
	</div>
	
	<script type="text/javascript">
	
		var root;
	
		var width_tree = screen.width, height_tree = screen.height;
		var width_node = 200, height_node = 80;
		
		var tree, nodes;
		var diagonal, svg_body;
		var node, link;
		
		var duration = 750;
		
		var tip = null;
		
		// Funzione richiamata da view per visualizzare l'IF calcolati sull'istanza che l'utente ha scelto di calcolare
		$(document).ready( function(){
			clientRest.computeDecision();
			
			focusIFCalculated();

			$("body").on("mouseover",'#IFUser_div',focusIFUser);			
			$("body").on("mouseover",'#IFCalculated_div',focusIFCalculated);
			
			$("body").on("click",'#IFUser_div',confirmIFUser);			
			$("body").on("click",'#IFCalculated_div',confirmIFCalculated);
		});
		
		function compute_decision(specific_object)
		{
			zoom_initial = 0.7;
			
			root = json_data;
			
	    	// Inizializzazione grafica dell'istanza
			initInstance();
			
	    	// Visualizzazione dell'istanza selezionata
	    	showInstance("no_tooltip");
	    	
	    	console.log("Stampa oggetti in compute decision...");
	    	
	    	node.each(function(d,i){
	    		
	    		console.log(d);
	    		
	    		if(d.isLeaf == "true")
   					addNodeIF(getId(d.position), d.description, "", d.IF_insert.IF_green, d.IF_insert.IF_white, d.IF_insert.IF_red);
	    		else
	    			addNodeIF(getId(d.position), d.description, specific_object, d.IF_calculated.IF_green, d.IF_calculated.IF_white, d.IF_calculated.IF_red);	    			
	    		
	    		if(d.isLeaf == "false")
	    		{
	    			if(d.IF_insert != undefined)
	    			{
	    				$('#gnode_'+getId(d.position)).on("click",function(){
	    					createIncongruityWindow(d.IF_insert.IF_green, d.IF_insert.IF_white, d.IF_insert.IF_red, d.IF_calculated.IF_green, 
	    							d.IF_calculated.IF_white, d.IF_calculated.IF_red);
	    				});	
	    			}
	    		}
   			});
	    	
	    	// Visualizzazione del risultato del calcolo della decisione
	    	d3.selectAll("#gnode_0").append("text").text("DECISION: " + (Number(nodes[0].IF_calculated.IF_green)*100).toFixed(2) + "G " +
	    			(Number(nodes[0].IF_calculated.IF_white)*100).toFixed(2) + "W " + (Number(nodes[0].IF_calculated.IF_red)*100).toFixed(2) + "R")
	    			.attr("x",-5)
	    			.attr("y",-10);
		}
		
		// Funzione per visualizzare il bordo rosso ai nodi incongruenti
		function alertIFIncongruent(arrayIFIncongruent)
		{
			console.log(arrayIFIncongruent);
			for(var i = 0; i < arrayIFIncongruent.length; i++)
			{
				$('#rectNodeIF_'+getId(arrayIFIncongruent[i].position)).attr("filter",'url(#f4)');
			}
		}
		
	</script>

</body>

</html>