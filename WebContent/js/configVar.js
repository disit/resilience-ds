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
   
/**Ale 16-6-1
 *	configuration class with some parameters. For example the link to connect to SmartDS 
 */
var configVariables = function(){
	var config_address_for_importResoluteModel = '/dss/rest/importResoluteModel/';
//	var config_address_for_importResoluteModel = 'http://localhost:8080/dss/rest/importResoluteModel/';
//	var config_address_for_importResoluteModel = 'http://smartds.disit.org:8080/dss/rest/importResoluteModel/';

	this.getAddressForImportResoluteModel = function(){
		return config_address_for_importResoluteModel;
	}

}