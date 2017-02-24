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

var ModelInstance = function( idModelInstance, objModelInstance, idModel, idUser, dateCreateModelInstance, dateLastModifyModelInstance, statusModelInstance, startExecModelInstance, endExecModelInstance ){
	
	var mi_id = idModelInstance;
	var specific_objective = objModelInstance;
	var id = idModel;
	var userId = idUser;
	var dateCreate = dateCreateModelInstance.substring(0,dateCreateModelInstance.length-4);
	var dateLastModify = dateLastModifyModelInstance.substring(0,dateLastModifyModelInstance.length-4);
	var status = statusModelInstance;
//	var startExec = startExecModelInstance.substring(0,startExecModelInstance.length-4);
//	var endExec = endExecModelInstance.substring(0,startExecModelInstance.length-4);
	var startExec = 0; //Ale: Not provided for now.
	var endExec = 0;
	
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
	
	this.getStatus = function()
	{
		return status;
	}
	
	this.getStartExec = function()
	{
		return startExec;
	}
	
	this.getEndExec = function()
	{
		return endExec;
	}
	
	this.setSpecificObjective = function(spec_objective)
	{
		specific_objective = spec_objective;
	}
	
	this.setStatus = function(statusModelInstance)
	{
		status = statusModelInstance;
	}
	
	this.setStartExec = function(startExecModelInstance)
	{
		startExec = startExecModelInstance;
	}
	
	this.setEndExec = function(endExecModelInstance)
	{
		endExec = endExecModelInstance;
	}

	this.toString = function()
	{
		return "Model Instance: \n\t id: " + mi_id + "\n\t specific objective: " + specific_objective + "\n\t model id: " + id + "\n\t user id: " + userId + "\n\t date create: " 
			+ dateCreate + "\n\t date modify: " + dateLastModify + "\n\t status: " + status + "\n\t time start exec: " + startExec + "\n\t time end exec: " + endExec;
	}
	
}