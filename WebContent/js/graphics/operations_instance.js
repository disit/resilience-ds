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
 * Operazioni grafiche per la visualizzazione di un'instanza
 */

// Dimensioni dei nodi grafici
var width_gnode_vertical = 220, height_gnode_vertical = 150;

var width_gnode_horizontal = 300, height_gnode_horizontal = 120;

// Altezza iniziale dei modelli
var initial_height = 80;

// Scarti per la visualizzazione delle label sugli archi
var diff_width_linkLabel = 10, diff_height_linkLabel = 70; 

var zm = null;

var url_comment_str = [];

/*
 *  Funzioni per la visualizzazione delle istanze ---------------------------------------------------------------------
 */
/**
 * Ale: 16-3-14
 * Shows the curve over a Function, indicating that the function is modified. 
 */
function appendVariability(nodes_entered){
//	console.log("Append varability.");
	nodes_entered.append("svg:path").attr("d","M25 80 C 45 65, 47 65, 62 80 S 83 105, 95 80")
	.attr("class",function(d){
		if(checkVariability(d)) return "variability_wave function_edited";
		return "variability_wave function_edited_hide ";
	});
	//Checks if there have been change.
	svg.selectAll("path.variability_wave").attr("d","M25 80 C 45 65, 47 65, 62 80 S 83 105, 95 80").attr("class",function(d){
		if(checkVariability(d)) return "variability_wave function_edited";
		return "variability_wave function_edited_hide";
	});
}

/**
 * Makes some changes before show the instance.
 * 
 */
function showFRAMModelInstance(){
	console.log("Show FRAM Instances");
	json_data.Functions = new Object();
	json_data.Functions["Function"] = new Array();
	if(json_data.FunctionInstances) json_data.Functions["Function"] = json_data.FunctionInstances["FunctionInstance"];
	showFRAMModel();
}
// Inizializzazione dell'albero utilizzando la variabile root
function initInstance()
{
	
	if(type_rotate == "vertical")
	{
		tree = d3.layout.tree().nodeSize([width_gnode_vertical, height_gnode_vertical]);
		
		tree.separation(function separation(a, b) {
	        return a.parent == b.parent ? 1 : 1.2;
	    });
		
		diagonal = d3.svg.diagonal()
			.source(function(d) { return {"x":d.source.x, "y":(d.source.y+(height_node/2))}; })            
			.target(function(d) { return {"x":(d.target.x), "y":d.target.y-(height_node/2)}; })
			.projection(function(d) { return [d.x, d.y]; });
		
		svg_body = d3.select("#instance_body").append("svg")
		    .attr("width", width_tree)
		    .attr("height", height_tree)
		    .call(zm = d3.behavior.zoom().scaleExtent([min_zoom, max_zoom]).on("zoom", redraw))
		    .append("g")
		    .attr("transform", "translate("+width_tree/2+","+initial_height+") scale("+zoom_initial+")");
		
		zm.translate([width_tree/2, initial_height]);
	}
	else{
		
		// Inizializzazione dell'albero con la dimensione preimpostata dei nodi
		tree = d3.layout.tree().nodeSize([height_gnode_horizontal, width_gnode_horizontal]);
		
		// Separazione dei sottoalberi
		tree.separation(function separation(a, b) {
	        return a.parent == b.parent ? 1.2 : 1;
	    });

		diagonal = d3.svg.diagonal()
			.source(function(d) { return {"x":d.source.x-(height_gnode_horizontal/2), "y":d.source.y+width_node}; })   // d.source.x+(height_gnode_horizontal/2)
			.target(function(d) { return {"x":d.target.x-(height_gnode_horizontal/2), "y":d.target.y}; })		// d.target.x+(height_gnode_horizontal/2)
			.projection(function(d) { return [d.y, d.x]; }); 
		
		svg_body = d3.select("#instance_body").append("svg")
	    .attr("width", width_tree)
	    .attr("height", height_tree)
	    .call(zm = d3.behavior.zoom().scaleExtent([min_zoom, max_zoom]).on("zoom", redraw))
	    .append("g")
	    .attr("transform", "translate("+(width_tree/2)/2+","+height_tree/2+") scale("+zoom_initial+")");
		
		zm.translate([(width_tree/2)/2, height_tree/2]);
	}
	
	/* CODICE PER OMBREGGIATURA BORDO SUI RECT */
	
	// everything that will be referenced
	// should be defined inside of a <defs> element ;)
	var defs = svg_body.append( 'defs' );
	
	// append filter element
	var filter = defs.append( 'filter' )
	             .attr( 'id', 'f4' ) /// !!! important - define id to reference it later
	
	// append gaussian blur to filter
	filter.append( 'feGaussianBlur' )
	  .attr( 'in', 'SourceAlpha' )
	  .attr( 'stdDeviation', 8 ) // !!! important parameter - blur 3
	  .attr( 'result', 'blur' );
	
	// append offset filter to result of gaussion blur filter
	filter.append( 'feOffset' )
	  .attr( 'in', 'blur' )
	  .attr( 'dx', 2 ) // !!! important parameter - x-offset 
	  .attr( 'dy', 3 ) // !!! important parameter - y-offset 
	  .attr( 'result', 'offsetBlur' );
	
	filter.append("feFlood")
	.attr("in", "offsetBlur")
	.attr("flood-color", "red") //#3d3d3d
	.attr("flood-opacity", "0.8") //0.5
	.attr("result", "offsetColor");
	
	filter.append("feComposite")
	.attr("in", "offsetColor")
	.attr("in2", "offsetBlur")
	.attr("operator", "in")
	.attr("result", "offsetBlur");	
	
	// merge result with original image
	var feMerge = filter.append( 'feMerge' );
	
	// first layer result of blur and offset
	feMerge.append( 'feMergeNode' )
	   .attr( 'in", "offsetBlur' )
	
	// original image on top
	feMerge.append( 'feMergeNode' )
	   .attr( 'in', 'SourceGraphic' );
	// end filter stuff

	//-----------------------------------------------------------------------
	
	//Inizializzazione dei nodi e della radice dell'albero D3
	nodes = tree(root);
	links = tree.links(nodes);
	
	//necessary so that zoom knows where to zoom and unzoom from
	zm.scale(zoom_initial);

	node = svg_body.selectAll(".node");
	link = svg_body.selectAll(".link");
	
	// Recompute the layout and data join.
	node = node.data(tree.nodes(root), function (d) {
		return getId(d.position);
	});
	
	link = link.data(tree.links(nodes), function (d) {
    	return getId(d.source.position) + "-" + getId(d.target.position);
	});
}

function showInstance(type_tooltip)
{
	// Add entering links in the parent's old position.
	link.enter().insert("path", ".g.node")
        .attr("class", "link")
        .attr("d", function (d) {
            var o = {x: d.source.x, y: d.source.y};
            return diagonal({source: o, target: o});
       	})
    	.attr('pointer-events', 'none');
	
	// Transition nodes and links to their new positions.
	var t = svg_body.transition()
		.duration(duration);
	
	t.selectAll(".link")
	    .attr("d", diagonal);
	  	
	// Enter any new nodes at the parent's previous position.
	var nodeEnter = node.enter().append("g")
		.attr("id",function(d){
			return ("gnode_"+getId(d.position));
	});

	nodeEnter.each(function(d,i){
		if(type_rotate == "vertical")
			this.setAttribute("transform", "translate("+(d.x-(width_node/2))+","+(d.y-(height_node/2))+")");
		else
			this.setAttribute("transform", "translate(" +(d.y)+ "," +(d.x-(width_node/2))+ ")"); ///d.y,-(d.x-(width_node/2)) per blocchi ribaltati sull'asse x
	});
	
	// Update the link labels…
	var linkLabel = svg_body.selectAll("text.link-label")
		.data(links, function (d) {
			return getId(d.target.position);
		});

	// Enter any new links at the parent's previous position.
	linkLabel.enter().insert("text", "path")
		.text(function (d) {
			if(d.source.weightsSerialized != undefined)
				return parseFloat(Number(d.source.weightsSerialized.split(',')[(parseInt(d.target.position.substring(d.target.position.length-1))-1)]).toFixed(3));
			else
				return "";
		})
		.attr("id", function (d) {
			return "linklabel_" + getId(d.target.position);
		})
		.attr("class", "link-label")
		.attr("x", function (d) {
			if(type_rotate == "vertical")
				return d.target.x-diff_width_linkLabel;
			else
				return d.target.y-diff_height_linkLabel; // d.target.y+diff_height_linkLabel per blocchi ribaltati sull'asse x
		})
		.attr("y", function (d) {
			if(type_rotate == "vertical")
				return d.target.y-diff_height_linkLabel;
			else
				return d.target.x-50; // -d.target.x-50 per blocchi ribaltati sull'asse x
		})				
		.attr('text-anchor', 'middle')
		.style("fill-opacity", 0);

	// Transition link labels
	linkLabel.transition()
		.delay(duration)
		.style("fill-opacity", 1);
	
	// Rimozione del vecchio tooltip se c'è prima di crearne uno nuovo
	$('#d3_tooltip').remove();
	if(user.getType() != 1){ // Un utente guest non può vedere i tooltip con le informazioni sui criteri delle istanze
		if(type_tooltip != "no_tooltip") // Controllo nel caso in cui ci troviamo in compute decision - non si visualizzano i tooltip
			d3tooltip();
	}
}

function changeSpecObjectRoot(spec_object)
{
	$("#textspecificObject").text(spec_object);
}

function d3tooltip()
{
	tip = d3.tip()
	.attr('class', 'd3-tip')
	.attr('id','d3_tooltip')
	.offset([-10, 0])
	.html(function(d) {	
		var url = "", comment ="";
		
		if(d.url != undefined && d.comment != undefined) 
		{	
			if(d.url == "null")
				url = "No url added";
			else
				url = d.url;
			if(d.comment == "null")
				comment = "No comment added";
			else
				comment = d.comment;
		}
		else if(d.url == undefined && d.comment != undefined) 
		{
			url = "No url added";
			if(d.comment == "null")
				comment = "No comment added";
			else
				comment = d.comment;
		}
		else if(d.url != undefined && d.comment == undefined) 
		{
			if(d.url == "null")
				url = "No url added";
			else
				url = d.url;
			comment = "No comment added";
		}
		else{
			url = "No url added";
			comment = "No comment added";
		}
		
		for(var i = 0; i < url_comment_str.length; i++)
		{
			if(d.position == url_comment_str[i].position)
			{
				comment = url_comment_str[i].comment;
				url = url_comment_str[i].url;
			}
		}
		
		var userId_MI;
		if(util.getIndexById(modelinstances_tmp, modelInstanceId) != -1)
			userId_MI = modelinstances_tmp[util.getIndexById(modelinstances_tmp, modelInstanceId)].getUserId();
		else if(util.getIndexById(modelinstances_db, modelInstanceId) != -1)
			userId_MI = modelinstances_db[util.getIndexById(modelinstances_db, modelInstanceId)].getUserId();
			
		return "<span class='span-tooltip' id='spanUrlInstance'>"+getUrl()+"</span>" +
			"<span class='span-tooltip' id='spanDescriptionInstance'>" + comment + "</span>" +
			"<button id='buttonModifyCriteriaInstance' onclick='clickModifyInstance()' style="+getStyleButtonModify()+"></button>" +
			"<label id='variableGhost' style='display:none'>"+d.position+"</label>" +
			"<button id='buttonSaveModifyCriteriaInstance' onclick='clickSaveModifyInstance()' style='display:none'></button>" +
			"<input type='text' class='inputtext-tooltip edit' placeholder='Insert url' id='editUrlInstance' style='display:none' onclick='focusInputText()'>" +
			"<textarea class='inputtext-tooltip textarea' placeholder='Insert description' id='editDescriptionInstance' style='display:none' onclick='focusInputTextArea()'>";
		
		function getStyleButtonModify()
		{
			if(user.getId() != userId_MI)
				return 'display:none';
			else
				return '';
		}
		
		function getUrl()
		{
			if(url != "No url added"){
				return "<a href=http://" + url + " target=\"_blank\">" + url + "</a>";
			}
			else
				return url;
		}
	});
			
	svg_body.call(tip);
}

function focusInputText(){
//	var focusedElement = $('#editUrlInstance');
//    setTimeout(function () { focusedElement.select(); }, 50);
}

function focusInputTextArea(){
//	var focusedElement = $('#editDescriptionInstance');
//    setTimeout(function () { focusedElement.select(); }, 50);
}

function clickModifyInstance()
{
	$('#spanUrlInstance').css('display','none');
	$('#spanDescriptionInstance').css('display','none');
	$('#buttonModifyCriteriaInstance').css('display','none');
	
	$('#buttonSaveModifyCriteriaInstance').show();
	$('#editUrlInstance').show();
	$('#editDescriptionInstance').show();
	$('#editUrlInstance').val($('#spanUrlInstance').text());
	$('#editDescriptionInstance').val($('#spanDescriptionInstance').text());
	
	var positionCriteriaInstance = $('#variableGhost').text();
	$('#d3_tooltip').off("mouseout");
}

function clickSaveModifyInstance() //positionCriteriaInstance
{	
	if($('#editUrlInstance').val() != "" && $('#editDescriptionInstance').val() != "")
	{
		var positionCriteriaInstance = $('#variableGhost').text();
		console.log(positionCriteriaInstance);
		clientRest.saveInfoCriteriaInstance(positionCriteriaInstance, $('#editUrlInstance').val(), $('#editDescriptionInstance').val());
		
		// CHIAMATA REST PER LA MODIFICA DEL CRITERIO DELL'ISTANZA
		
		$('#editUrlInstance').css('display','none');
		$('#editDescriptionInstance').css('display','none');
		$('#buttonSaveModifyCriteriaInstance').css('display','none');
		
		$('#buttonModifyCriteriaInstance').show(); 
		$('#spanUrlInstance').show(); 
		$('#spanDescriptionInstance').show();
		$('#spanUrlInstance').html(getUrlCriteria($('#editUrlInstance').val()));
		$('#spanDescriptionInstance').text($('#editDescriptionInstance').val());
		
		url_comment_str.push({'position':positionCriteriaInstance,'url':$('#editUrlInstance').val(), 'comment':$('#editDescriptionInstance').val()});
	}
}

function getUrlCriteria(url_criteria)
{
	if(url_criteria != "No url added"){
		return "<a href=http://" + url_criteria + " target=\"_blank\">" + url_criteria + "</a>";
	}
	else
		return url_criteria;
}