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

import java.util.ArrayList;
import java.util.Vector;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import fram.modelinstance.FRAMModelInstance;
import fram.modelinstance.ModelInstance;

@XmlRootElement(name = "modelinstances")
@XmlAccessorType (XmlAccessType.FIELD)
public class FRAMModelInstancesParserXML {

	@XmlElement(name = "modelinstance")
	private ArrayList<FRAMModelInstance> modelinstancesList = new ArrayList<FRAMModelInstance>();

	/*
	public ModelInstancesParserXML()
	{
		modelinstancesList = new ArrayList<ModelInstance>();
	}
	*/
	
	public ArrayList<FRAMModelInstance> getModelInstancesList() {
		return modelinstancesList;
	}

	public void setModelInstancesListFromDB(Vector<String[]> v) {
		for(int i=0; i<v.size(); i++)
		{
			String[] record_model_inst = v.elementAt(i);
			int modelInstId = Integer.parseInt(record_model_inst[0]);
			String modelInstObjective = record_model_inst[1];
			int userInstanceId = Integer.parseInt(record_model_inst[2]);
			int modelId = Integer.parseInt(record_model_inst[3]);
//			int status = Integer.parseInt(record_model_inst[6]);
			String instance_create = record_model_inst[4];
			String instance_last_modify = record_model_inst[5];
			addFRAMModelInstToList(modelInstId, modelInstObjective, modelId, userInstanceId, instance_create, instance_last_modify);
		} 
	}
	
	/*
	public void setModelInstancesList(ArrayList<ModelInstance> modelinstances) {
		for(int i=0; i<modelinstances.size(); i++)
			addModelInstToList(modelinstances.get(i).getMIId(), modelinstances.get(i).getObjective());
	}
	*/
	
	public void addFRAMModelInstToList(int modelInstId, String modelInstObjective, int modelId, int userInstanceId, String instance_create, String instance_last_modify)
	{
		FRAMModelInstance model_inst = new FRAMModelInstance(modelInstId, modelInstObjective, modelId, userInstanceId, instance_create, instance_last_modify);
		modelinstancesList.add(model_inst);
	}
}
