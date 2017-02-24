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
 * Operazioni per lo zoom
 */

// Variabili zoom
var min_zoom = 0.1, max_zoom = 3;

// Funzioni per lo zoom chiamato attraverso i button nel menu-side

function zoomed() 
{
	svg_body.attr("transform",
			"translate(" + zm.translate() + ")" +
			"scale(" + zm.scale() + ")"
	);
	//Ale: For FRAM
	svg.attr("transform",
        "translate(" + zm.translate() + ")" +
        "scale(" + zm.scale() + ")"
    );
}

function interpolateZoom (translate, scale)
{
    var self = this;
    return d3.transition().duration(350).tween("zoom", function () {
        var iTranslate = d3.interpolate(zm.translate(), translate),
            iScale = d3.interpolate(zm.scale(), scale);
        return function (t) {
            zm.scale(iScale(t))
              .translate(iTranslate(t));
            zoomed();
        };
    });
}

function zoomClick(direction) // Zoom in: direction=1 - Zoom out: direction=-1
{ 
	
    var factor = 0.2,
        target_zoom = zoom_initial,
        center = [width_tree / 2, height_tree / 2],
        extent = zm.scaleExtent(),
        translate = zm.translate(),
        translate0 = [],
        l = [],
        view = {x: translate[0], y: translate[1], k: zm.scale()}; 
    
    target_zoom = zm.scale() * (1 + factor * direction);

    if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

    translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
    view.k = target_zoom;
    l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

    view.x += center[0] - l[0];
    view.y += center[1] - l[1];

    interpolateZoom([view.x, view.y], view.k);
}

function zoomClickReset() 
{
	svg_body.transition()
	.duration(1000)
	.attr('transform', "translate(" + (width_tree/2) + "," + initial_height + ") scale(" + zoom_initial + ")");

	zm.translate([(width_tree/2)-(width_tree*0.25), initial_height]);
	
	zm.scale(zoom_initial);
	zoomed();
}

/**Ale 16-7-15
 * Reset the visualization over the first function.
 */
function positionReset()
{
	svg_body.transition()
	.duration(1000)
	.attr('transform', "translate(" + (width_tree/2) + "," + initial_height + ") scale(" + zoom_initial + ")");
	
	if(nodes[0]){
//		console.log("translate(" + (svg.attr("width")/2-nodes[0].x) + "," +  (svg.attr("height")/2-nodes[0].y) + ") scale(" + zoom_initial + ")");
//		svg_body.transition()
//		.duration(1000)
//		.attr('transform', "translate(" + (svg.attr("width")/2-nodes[0].x) + "," +  (svg.attr("height")/2-nodes[0].y) + ") scale(" + zoom_initial + ")");
//		.attr('transform', "translate(" + (nodes[0].x/2) + "," + nodes[0].y/2 + ") scale(" + zoom_initial + ")");
		zm.translate([svg.attr("width")/2-nodes[0].x*zoom_initial, svg.attr("height")/2-nodes[0].y*zoom_initial]);
		zm.scale(zoom_initial);
	}

//	zm.translate([(nodes[0].x/2)-(nodes[0].x*0.25), nodes[0].y]);
	
	zoomed();
}

//Redraw per zoom
function redraw() 
{
	svg_body.attr("transform",
		"translate(" + d3.event.translate + ")"
		+ " scale(" + d3.event.scale + ")");
}