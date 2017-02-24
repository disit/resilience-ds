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
 * Class for a FRAMModel Instance.
 */
var FRAMModelInstance = function( idModelInstance, objModelInstance, idModel, idUser, dateCreateModelInstance, dateLastModifyModelInstance){
	
	var mi_id = idModelInstance;
	var specific_objective = objModelInstance;
	var id = idModel;
	var userId = idUser;
	var dateCreate = dateCreateModelInstance.substring(0,dateCreateModelInstance.length-4);
	var dateLastModify = dateLastModifyModelInstance.substring(0,dateLastModifyModelInstance.length-4);
	//Lists of the variable in the visualization.
	var Mnodes = new Array();
	var Mlinks = new Array();
	var Maspects = new Array();

	this.getId = function()
	{
		return mi_id;
	}
	
	this.getSpecificObjective = function()
	{
		return specific_objective;
	}
	
	this.getModelId = function()
	{
		return id;
	}
	
	this.getUserId = function()
	{
		return userId;
	}
	
	this.getDateCreate = function()
	{
		return dateCreate;
	}
	
	this.getDateLastModify = function()
	{
		return dateLastModify;
	}	
	
	this.setSpecificObjective = function(spec_objective)
	{
		specific_objective = spec_objective;
	}
	
	this.toString = function()
	{
		return "Model Instance: \n\t id: " + mi_id + "\n\t specific objective: " + specific_objective + "\n\t model id: " + id + "\n\t user id: " + userId + "\n\t date create: " 
			+ dateCreate + "\n\t date modify: " + dateLastModify;
	}
	
	this.setNodes = function(nodes_to_copy){
		Mnodes=Array();
		for(var i=0; i<nodes_to_copy.length;i++){
			Mnodes[i] = new Object;
			Mnodes[i] = jQuery.extend({},nodes_to_copy[i]);
		}
	}
	this.getNodes = function(){
		return Mnodes;
	}
	this.setLinks = function(links_to_copy){
		Mlinks=Array();
		for(var i=0; i<links_to_copy.length;i++){
			Mlinks[i] = new Object;
			Mlinks[i] = jQuery.extend({},links_to_copy[i]);
		}
	}
	this.getLinks = function(){
		return Mlinks;
	}
	this.setAspects = function(aspects_to_copy){
		Maspects=Array();
		for(var i=0; i<aspects_to_copy.length;i++){
			Maspects[i] = new Object;
			Maspects[i] = jQuery.extend({},aspects_to_copy[i]);
		}
	}
	this.getAspects = function(){
		return Maspects;
	}
	
}