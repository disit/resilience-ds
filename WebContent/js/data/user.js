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
 *  User
 */

var User = function(){
	
	var id;
	var name;
	var email;
	var country;
	var type;
	var permits_model_description = [];
	var permits_model_value = [];
	
	this.setUser = function(idUser, nameUser, emailUser, countryUser, typeUser)
	{
		id = idUser;
		name = nameUser;
		email = emailUser;
		country = countryUser;
		type = typeUser;
		
		permits_model_description = new Array();
		permits_model_value = new Array();
	}
	
	this.setName = function(nameUser)
	{
		name = nameUser;
	}
	
	this.setCountry = function(countryUser)
	{
		country = countryUser;
	}
	
	this.setType = function(typeUser)
	{
		type = typeUser;
	}
	
	this.getId = function()
	{
		return id;
	}
	
	this.getName = function()
	{
		return name;
	}
	
	this.getEmail = function()
	{
		return email;
	}
	
	this.getCountry = function()
	{
		return country;
	}
	
	this.getType = function()
	{
		return type;
	}
	
	this.setPermitModel = function(permitDescription, permitValue, index)
	{
		permits_model_description[index] = permitDescription;
		permits_model_value[index] = permitValue;
	}
	
	this.getPermitModelValue = function(permitModelId)
	{
		return permits_model_value[permitModelId];
	}
	
	this.toString = function()
	{
		return "User: " +id + name + email + country + type;
	}
}