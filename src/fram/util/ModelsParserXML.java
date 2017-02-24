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

package fram.util;

import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import java.util.ArrayList;
import java.util.Vector;

import fram.model.Model;

@XmlRootElement(name = "models")
@XmlAccessorType (XmlAccessType.FIELD)
public class ModelsParserXML {

	@XmlElement(name = "model")
	private ArrayList<Model> modelsList = null;

	public ModelsParserXML()
	{
		modelsList = new ArrayList<Model>();
	}
	
	public ArrayList<Model> getModelsList() {
		return modelsList;
	}

	public void setModelsListFromDB(Vector<String[]> v) {
		for(int i=0; i<v.size(); i++)
		{
			//Record passed: id, objective, description, size, idUser, date_create, date_last_modify
			String[] record_model = v.elementAt(i);
			int modelId = Integer.parseInt(record_model[0]);
			String modelObjective = record_model[1];
			String modelDescription = record_model[2];
			int size = Integer.parseInt(record_model[3]);
			int userId = Integer.parseInt(record_model[4]);
			String model_create = record_model[5];
			String model_modify = record_model[6];
			addModelToList(modelId, modelObjective, modelDescription, size, userId, model_create, model_modify);
		} 
	}
	//XXX Old
	public void setModelsListFromDBnotFull(Vector<String[]> v) {
		for(int i=0; i<v.size(); i++)
		{
			String[] record_model = v.elementAt(i);
			int modelId = Integer.parseInt(record_model[0]);
			String modelObjective = record_model[1];
			int size = Integer.parseInt(record_model[2]);
			int userId = Integer.parseInt(record_model[3]);
			addModelToList(modelId, modelObjective, size, userId);
		} 
	}
	
	/*
	public void setModelsList(ArrayList<Model> models) {
		for(int i=0; i<models.size(); i++)
			addModelToList(models.get(i).getId(), models.get(i).getURL(), models.get(i).getObjective(), models.get(i).getModelUserId());
	}
	*/ 
	
	public void addModelToList(int modelId, String modelObjective, String modelDescription, int size, int userId, String model_create, String model_modify)
	{
		Model model = new Model(size);
		model.setId(modelId);
		model.setObjective(modelObjective);
		model.setDescriptionModel(modelDescription);
		model.setModelUserId(userId);
		model.setDateCreateModel(model_create);
		model.setDateLastModifyModel(model_modify);
		modelsList.add(model);
	}
	//Old
	public void addModelToList(int modelId, String modelObjective, int size, int userId)
	{
		Model model = new Model(size);
		model.setId(modelId);
		model.setObjective(modelObjective);
		model.setModelUserId(userId);
		modelsList.add(model);
	}
	
}
