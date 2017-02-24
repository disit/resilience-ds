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

/*
 * Classe definita per gestire operazioni di utilità quali:
 * conversione da stringa a xml o viceversa
 * costruzione xml per l'aggiunta di un Model o per l'aggiunta di un Criteria collegato ad un Model
 */
var Util = function( ){

	// Ale: Function for the creation of the xml file that adds a model.
	this.createStringForAddFRAMModel = function(objective, description, userId)
	{
		
		var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><model><objective>"+objective+"</objective><description_model>"+description+"</description_model><modelUserId>"+userId+"</modelUserId></model>";
		return text_xml;
	}
	// Ale: Function for the creation of the xml file that adds a loaded xfmv model.
	this.createStringForAddXFMVModel = function(xfmv_file, userId) 
	{	
		var text_xml = xfmv_file.replace("</FM>","<UserId>"+user.getId()+"</UserId></FM>");
		return text_xml;
	}
	//XXX OLD Funzione per la creazione del file xml per l'aggiunta di un model
	this.createStringForAddModel = function(objective, url, description, userId)
	{
		var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><model><objective>"+objective+"</objective><url>"+url+"</url><description_model>"+description+"</description_model><modelUserId>"+userId+"</modelUserId></model>";
		return text_xml;
	}
	//XXX Old
	this.createStringForModifyDataModel = function(objective, url, description)
	{
		var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><model><objective>"+objective+"</objective><url>"+url+"</url><description_model>"+description+"</description_model></model>";
		return text_xml;
	}
	/**
	 * Creates the string for modify the data of a FRAM model.
	 */
	this.createStringForModifyDataFRAMModel = function(objective, description)
	{
		console.log("Modify Data Model");
		var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><model><objective>"+objective+"</objective><description_model>"+description+"</description_model></model>";
		return text_xml;
	}
	
	this.createStringForOperationModel = function(operation, id_model)
	{
		if(operation == "saveModel")
			var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><operation><modelId>"+id_model+"</modelId><description>"+operation+"</description><userId>"+user.getId()+"</userId></operation>";
		else
			var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><operation><modelId>"+modelId+"</modelId><description>"+operation+"</description><userId>"+user.getId()+"</userId></operation>";
		return text_xml;
	}
	/** Ale 16-3-4: 
	 * 	Functions that create the json of the model for save.
	 * @param operation: the operation to make. Now it's permitted only saveFullFRAMModel.
	 * @param id_model: the id of the model to save.
	 * @param instance: 
	 */
	this.createStringForOperationFullFRAMModel = function(operation, id_model, instance)
	{
		var XMLmodel="";
		var JSONmodel="";
		if(operation == "saveFullFRAMModel"){
			
			var modelToSave = new Object;
			modelToSave.model = new Object;
			//The structure is circular, so it removes the cyclic nature of nodes and aspects.
			//Info for the model: name, description, userId.
			modelToSave.model.modelUserId=user.getId();
						
			modelToSave.model.modelId=id_model;
			var CurrentM;
			if(!instance){
				CurrentM = models_notsaved.filter(function(d){return d.getId()==id_model});
				modelToSave.model.objective=CurrentM[0].getObjective();
				modelToSave.model.description_model=CurrentM[0].getDescription();				
			}
			else{
				CurrentM = modelinstances_notsaved.filter(function(d){return d.getId()==id_model});
				modelToSave.model.specific_objective=CurrentM[0].getSpecificObjective();
			}
			
			modelToSave.model.size=nodes.length;			
			//For nodes changes the source, target and the list of the aspects with the id.
			var CFunctions = Array();//Current Functions.
			var CGroups = Array();//Current Groups.
			modelToSave.model.Functions=Object();
			modelToSave.model.Groups=Object();
			var i_f=0, i_g=0; //Indexes for functions and groups
			for(var i=0; i<nodes.length;i++){
				if(nodes[i].is_group){
					CGroups[i_g] = new Object;
					CGroups[i_g] = jQuery.extend({},nodes[i]);
					CGroups[i_g]["modelId"] = CGroups[i_g]["idModel"];
					CGroups[i_g]["x"] = parseInt(CGroups[i_g]["x"]);
					CGroups[i_g]["y"] = parseInt(CGroups[i_g]["y"]);
					CGroups[i_g]["Functions"] = Object();
					var CGFunctions = Array();
					for( var j=0; j<nodes[i].functions.length; j++){
						CGFunctions[j] = nodes[i].functions[j].id;						
					}
					CGroups[i_g]["Functions"]["Function"] = CGFunctions;
					
					//Deletes the not necessary fields.
					delete CGroups[i_g]["aspects"]; //removes the aspects from the node, for prevent cycle and redundancy.
					delete CGroups[i_g]["px"]; 
					delete CGroups[i_g]["py"]; 
					delete CGroups[i_g]["fixed"]; 
					delete CGroups[i_g]["index"]; 
					delete CGroups[i_g]["weight"]; 
					delete CGroups[i_g]["idModel"]; 
					delete CGroups[i_g]["is_group"]; 
					delete CGroups[i_g]["functions"]; 
					delete CGroups[i_g]["group"]; 
					
					i_g++;
				}
				else{					
					CFunctions[i_f] = new Object;
					CFunctions[i_f] = jQuery.extend({},nodes[i]);
					CFunctions[i_f]["modelId"] = CFunctions[i_f]["idModel"];
					CFunctions[i_f]["x"] = parseInt(CFunctions[i_f]["x"]);
					CFunctions[i_f]["y"] = parseInt(CFunctions[i_f]["y"]);
					
					//Deletes the not necessary fields.
					delete CFunctions[i_f]["aspects"]; //removes the aspects from the node, for prevent cycle and redundancy.
					delete CFunctions[i_f]["px"]; //removes the aspects from the node, for prevent cycle and redundancy.
					delete CFunctions[i_f]["py"]; //removes the aspects from the node, for prevent cycle and redundancy.
					delete CFunctions[i_f]["fixed"]; //removes the aspects from the node, for prevent cycle and redundancy.
					delete CFunctions[i_f]["index"]; //removes the aspects from the node, for prevent cycle and redundancy.
					delete CFunctions[i_f]["weight"]; //removes the aspects from the node, for prevent cycle and redundancy.
					delete CFunctions[i_f]["idModel"]; 
					delete CFunctions[i_f]["in_group"]; 
					delete CFunctions[i_f]["group"];
					
					i_f++;
				}
			}
			modelToSave.model.Functions.Function = CFunctions;
			modelToSave.model.Groups.Group = CGroups;
			//For aspects changes the source and target with the respective id.
			modelToSave.model.Aspects=Object();
			var Caspect=Array(); //Current aspects
			for(var i=0;i<aspects.length;i++){
				Caspect[i]=new Object;
				Caspect[i]=jQuery.extend({},aspects[i]);
				
				if(aspects[i].link) delete Caspect[i].link;
				if(aspects[i].source) Caspect[i].source=aspects[i].source.id;
				if(aspects[i].target) Caspect[i].target=aspects[i].target.id;
			}
			modelToSave.model.Aspects.Aspect = Caspect;
			//JSON parser
//			JSONmodel = JSON.stringify(modelToSave,function(key,value){
//				//Filter some properties.
//				if(key=="px" || key=="py" || key=="fixed") return undefined;
//				return value;
//			});
			//XML parser
			var xtree = new XML.ObjTree();
			// Only an aspect passed.
//			var PassedAspect=new Object;
//			PassedAspect.aspect=modelToSave.model.aspect[0]
//			XMLmodel = xtree.writeXML(PassedAspect);
			// Only a function passed.
//			var PassedFunction=new Object;
//			PassedFunction["function"]=modelToSave.model.Function[0]
//			XMLmodel = xtree.writeXML(PassedFunction);
			XMLmodel = xtree.writeXML(modelToSave);
		}			
//		console.log(XMLmodel); 
		return XMLmodel;
//		console.log(JSONmodel);
//		return JSONmodel;
	}
	
	this.createStringForOperationFullFRAMModelInstance = function(operation, id_modelinstance, id_model)
	{
		var XMLmodelinstance="";
		var JSONmodelinstance="";
		if(operation=="saveFullFRAMModelInstance"){
			//Prepares the model to load.
			XMLmodelinstance = this.createStringForOperationFullFRAMModel("saveFullFRAMModel", id_modelinstance, true);
			XMLmodelinstance=XMLmodelinstance.replace("<model>","<modelinstance><modelInstanceId>"+id_modelinstance+"</modelInstanceId>");
			XMLmodelinstance=XMLmodelinstance.replace("</model>","</modelinstance>");
			XMLmodelinstance=XMLmodelinstance.replace("<Functions>","<FunctionInstances>");
			XMLmodelinstance=XMLmodelinstance.replace("</Functions>","</FunctionInstances>");
			XMLmodelinstance=XMLmodelinstance.replace(/<Function>/g,"<FunctionInstance>");
			XMLmodelinstance=XMLmodelinstance.replace(/<\/Function>/g,"</FunctionInstance>");
			XMLmodelinstance=XMLmodelinstance.replace(/<modelId>[\s\S]*?<\/modelId>/, '<modelId>' + id_model + '<\/modelId>');
//			console.log(XMLmodelinstance);
		}
		return XMLmodelinstance;
	}
	
	//XXX Check if it is eraseable.
	this.createStringForOperationFullFRAMModel_good = function(operation, id_model)
	{
		var XMLmodel="";
		var JSONmodel="";
		if(operation == "saveFullFRAMModel"){
			
			var modelToSave = new Object;
			modelToSave.model = new Object;
			//The structure is circular, so it removes the cyclic nature of nodes and aspects.
			//Info for the model: name, description, userId.
			modelToSave.model.userId=user.getId();
			//For nodes changes the source, target and the list of the aspects with the id.
			modelToSave.model.nodes=Array();
			for(var i=0; i<nodes.length;i++){
				modelToSave.model.nodes[i]=new Object;
				modelToSave.model.nodes[i]=jQuery.extend({},nodes[i]);
				delete modelToSave.model.nodes[i]["aspects"]; //removes the aspects from the node, for prevent cycle and redundancy.
			}
			//For aspects changes the source and target with the respective id.
			modelToSave.model.aspect=Array();
			for(var i=0;i<aspects.length;i++){
				modelToSave.model.aspect[i]=new Object;
				modelToSave.model.aspect[i]=jQuery.extend({},aspects[i]);
				
				if(aspects[i].link) delete modelToSave.model.aspect[i].link;
				if(aspects[i].source) modelToSave.model.aspect[i].source=aspects[i].source.id;
				if(aspects[i].target) modelToSave.model.aspect[i].target=aspects[i].target.id;
			}
			//JSON parser
//			JSONmodel = JSON.stringify(modelToSave,function(key,value){
//				//Filter some properties.
//				if(key=="px" || key=="py" || key=="fixed") return undefined;
//				return value;
//			});
			//XML parser
			var xtree = new XML.ObjTree();
			XMLmodel = xtree.writeXML(modelToSave.model.nodes[0]);
		}		
		
		console.log(XMLmodel);
		return XMLmodel;
//		console.log(JSONmodel);
//		return JSONmodel;
	}
	
	// Funzione per la creazione del file xml per l'aggiunta di un model instance
	this.createStringForAddModelInstance = function(objective, userId)
	{
		var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><modelinstance><specific_objective>"+objective+"</specific_objective><instanceUserId>"+userId+"</instanceUserId><modelId>"+modelId+"</modelId></modelinstance>";
		return text_xml;
	}
	
	this.createStringForModifyDataModelInstance = function(objective)
	{
		var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><modelinstance><modelInstanceId>"+modelInstanceId+"</modelInstanceId><specific_objective>"+objective+"</specific_objective></modelinstance>";
		return text_xml;
	}
	
	this.createStringForOperationModelInstance = function(operation, id_modelinstance, id_model)
	{
		if(operation == "saveModelInstance")
			var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><operationinstance><modelInstanceId>"+id_modelinstance+"</modelInstanceId><modelId>"+id_model+"</modelId><description>"+operation+"</description><instanceUserId>"+user.getId()+"</instanceUserId></operationinstance>";
		else
			var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><operationinstance><modelInstanceId>"+modelInstanceId+"</modelInstanceId><modelId>"+modelId+"</modelId><description>"+operation+"</description><instanceUserId>"+user.getId()+"</instanceUserId></operationinstance>";
		return text_xml;
	}
	
	this.createStringForSimulateQueryModelInstance = function(operation, query, logicFunctionId, repository)
	{
		var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><operationinstance><modelInstanceId>"+modelInstanceId+"</modelInstanceId><description>"+operation+"</description><query>"+query+"</query><logicFunctionId>"+logicFunctionId+"</logicFunctionId><repository>"+repository+"</repository></operationinstance>";
		return text_xml;
	}
	
	this.createStringForImportDataModelInstance = function(operation, idInstance)
	{
		var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><operationinstance><description>"+operation+"</description><modelInstanceId>"+modelInstanceId+"</modelInstanceId><modelId>"+modelId+"</modelId><modelInstanceIdImportData>"+idInstance+"</modelInstanceIdImportData></operationinstance>";
		return text_xml;
	}
	
	this.createStringForAddCriteria = function(position, description)
	{
		var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><criteria><position>"+position+"</position><description>"+description+"</description><modelId>"+modelId+"</modelId></criteria>";
		return text_xml;
	} 
	
	this.createStringForModifyCriteriaDescription = function(description)
	{
		var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><criteria><description>"+description+"</description><modelId>"+modelId+"</modelId></criteria>";
		return text_xml;
	}
	
	this.createStringForModifyURLComment = function(url, comment)
	{
		var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><criteriainstance><url>"+url+"</url><comment>"+comment+"</comment><modelInstanceId>"+modelInstanceId+"</modelInstanceId></criteriainstance>";
		return text_xml;
	}
	
	this.createStringForModifyWeights = function(vect)
	{
		var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><criteriainstance><weightsSerialized>"+vect+"</weightsSerialized><modelInstanceId>"+modelInstanceId+"</modelInstanceId></criteriainstance>";
		return text_xml;
	}
	
	this.createStringForModifyMatrix = function(matrix)
	{
		var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><criteriainstance><matrixSerialized>"+matrix+"</matrixSerialized><modelInstanceId>"+modelInstanceId+"</modelInstanceId></criteriainstance>";
		return text_xml;
	}
	
	this.createStringForModifyIF = function(green, white, red)
	{
		var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><criteriainstance><IF_insert><IF_green>"+green+"</IF_green>"
						+"<IF_white>"+white+"</IF_white><IF_red>"+red+"</IF_red></IF_insert><modelInstanceId>"+modelInstanceId+"</modelInstanceId></criteriainstance>";
		return text_xml;
	}
	
	this.createStringForInsertLogicFunctionManager = function(query1, compare1, threshold1_lf1, threshold2_lf1, query2, compare2, 
						threshold1_lf2, threshold2_lf2, notFunction1, logicConnector, notFunction2, typeIF1, value_true1, value_false1, typeIF2, value_true2, value_false2, repository)
	{
		var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><criteriainstance><function_manager>";
		text_xml += "<logic_function1><query>"+query1+"</query><compare>"+compare1+"</compare><threshold1>"+threshold1_lf1+"</threshold1><threshold2>"+threshold2_lf1+"</threshold2></logic_function1>";
		text_xml += "<logic_function2><query>"+query2+"</query><compare>"+compare2+"</compare><threshold1>"+threshold1_lf2+"</threshold1><threshold2>"+threshold2_lf2+"</threshold2></logic_function2>";
		text_xml +=	"<notFunction1>"+notFunction1+"</notFunction1><logicConnector>"+logicConnector+"</logicConnector><notFunction2>"+notFunction2+"</notFunction2>";
		text_xml += "<typeIF1>"+typeIF1+"</typeIF1><value_true1>"+value_true1+"</value_true1><value_false1>"+value_false1+"</value_false1>";
		text_xml += "<typeIF2>"+typeIF2+"</typeIF2><value_true2>"+value_true2+"</value_true2><value_false2>"+value_false2+"</value_false2>";
		text_xml += "<SPARQLRepository>"+repository+"</SPARQLRepository>";
		text_xml += "</function_manager><modelInstanceId>"+modelInstanceId+"</modelInstanceId></criteriainstance>";
		return text_xml;
	}
	
	this.createStringForModifyUserLogged = function(email, password, name, country)
	{
		var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><user><email>"+email+"</email><password>"+password+"</password><name>"+name+"</name><country>"+country+"</country></user>";
		return text_xml;
	}
	
	this.createStringForModifyUserFromAdmin = function(userType)
	{
		var text_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><user><type>"+userType+"</type></user>";
		return text_xml;
	}
	
	// ---------------------------------------------------------------------------------------------------------------------
	
	// Funzioni per la conversione da stringa a xml e viceversa
	this.stringToXml = function(string_req)
	{
		var parser_obj = new DOMParser();
		var dom_obj = parser_obj.parseFromString(string_req, "text\/xml");
		return dom_obj;
	}
	
	this.xmlToString = function(xml_obj)
	{
		return (new XMLSerializer()).serializeToString(xml_obj);
	}
	
	// ---------------------------------------------------------------------------------------------------------------------
	
	// Funzioni per la conversione da stringa a json e viceversa
	
	this.JSONToString = function(json_obj)
	{
		return JSON.stringify(json_obj,null,2);
	}
	
	this.StringToJSON = function(str)
	{
		return JSON.parse(str);
	}
	
	// ---------------------------------------------------------------------------------------------------------------------
	
	// Funzioni di utilità sulle stringhe
	
	this.adjustStringToModelTree = function (json_string) 
	{
		var json_string_copy = "";
		var n = json_string.indexOf("\"children\":")+10;
		
		json_string_copy += json_string.substring(n+1, json_string.length-6);

		return json_string_copy;
	}
	
	this.adjustStringToModelWithOneChildren = function (json_string)
	{
		json_string = json_string.replace(/: {/g, ": [ {");
		
		var indices = this.getIndicesOf("}", json_string);
		for( var i = 0; i < indices.length; i++ )
		{
			var cnt = indices[i]+1;
			
			while(true)
			{				
				if(json_string.charAt(cnt) == ',' || json_string.charAt(cnt) == ']' || (cnt - indices[i]) > 20)
					break;
				else if(json_string.charAt(cnt) == '}'){
					json_string = util.replaceCharInString(json_string, cnt-1, "]");
					break;
				}
				else
					cnt += 1;
			}
		}
		
		return json_string;
	}
	
	this.adjustStringToInstanceTree = function (json_string) 
	{
		var json_string_copy = "";
		var n = json_string.indexOf("\"children\":")+10;
		
		json_string_copy += json_string.substring(n+1, json_string.length-4);

		return json_string_copy;
	}
	
	this.replaceCharInString = function(str, index, character)
	{
		character = character.toString();
	    return str.substr(0, index) + character + str.substr(index+character.length);
	}
	
	this.getIndicesOf = function(searchStr, str) {
	    var startIndex = 0, searchStrLen = searchStr.length;
	    var index, indices = [];
	    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
	        indices.push(index);
	        startIndex = index + searchStrLen;
	    }
	    return indices;
	}
	
	// ---------------------------------------------------------------------------------------------------------------------
	
	// Funzioni di utilità grafiche

	// Recupero della posizione nel vettore dei nodi attraverso il parametro id_node che indica
	// la posizione del nodo nell'albero

	this.get_idvectnode = function(id_node)
	{
		for(var i = 0; i < nodes.length;i++)
		{
			if(nodes[i].id == id_node)
				return i;
		}
		return id_node;
	}
	
	this.get_idvect = function(id_node, vect)
	{
		for(var i = 0; i < vect.length;i++)
		{
			if(vect[i].id == id_node)
				return i;
		}
		return id_node;
	}
	
	// ---------------------------------------------------------------------------------------------------------------------
	
	// Funzione tokenizer
	
	this.tokenizerVector = function(str_vector)
	{
		return str_vector.split(",");
	}
	
	this.tokenizerMatrix = function(str_matrix)
	{	
		if(str_matrix != "")
		{
			var vect_elements = this.tokenizerVector(str_matrix);
			var n = Math.sqrt(vect_elements.length);
			
			var matrix_elements = [];
			var k = 0;
			
			for(var i = 0; i < n; i++)
			{
				matrix_elements[i] = new Array(n);
				for(var j = 0; j < n ; j++)
				{
					matrix_elements[i][j] = vect_elements[k];
					k = k+1;
				}
			}
			
			return matrix_elements;
		}
		else
			return "";
	}
	
	/**
	 * Function that return the index of the instance with the 'id'. It's valid both Model and ModelInstance.
	 */
	this.getIndexById = function(array, id)
	{
		var index = -1;
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].getId() == id)
			{	
				index = i;
				break;
			}	
		}
		return index;
	}
	
	//Funzione valida sia per vettore di Model che per vettore di ModelInstance
	this.getIdUserByEmail = function(array, email)
	{
		var idUser = 0;
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].getEmail() == email)
			{	
				return array[i].getId();
			}	
		}
	}
	
	this.getInstanceVectorByModelId = function(modelinstances_interface, id, vector)
	{
		for(var i=0; i<modelinstances_interface.length; i++)
		{
			if(modelinstances_interface[i].getModelId() == id)
				vector.push(modelinstances_interface[i]);
		}
		return vector;
	}

	/** Ale
	 * Get Instance by id. Return the index of the instances that has the model id equal to id_model.
	 */
	this.getInstanceIdByModelId = function(modelinstances_array, id_model){
		var indexes_list = new Array();
		for(var i in modelinstances_array){
			if(modelinstances_array[i].getModelId()==id_model) indexes_list.push(i);
		}
		return indexes_list;
	}
}

/**Ale
 * Creates a prototype for the String type for capitalize the first character of the string.
 */
String.prototype.capitalizeFirstLetter  = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// ---------------------------------------------------------------------------------------------------------------------




