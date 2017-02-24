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

package fram.model;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/*
 * Ale 16-2-4: The class that represent a FRAM's aspect, the structure saved in the DB.
 */
@XmlRootElement(name="aspect")
public class Aspect{
	
	private int id;
	@XmlElement
	private String label;
	@XmlElement
	private int modelId;
	
	@XmlElement(name="id")
	private int Nodeid; //The id in the graph view.
	
	public Aspect()
	{
		
	}
	
	public Aspect(int id, String label, int modelId) {
		super();
		this.id = id;
		this.label = label;
		this.modelId = modelId;
//		this.model = model;
	}
	
	public Aspect(int id, String label, int modelId, int Nodeid) {
		super();
		this.id = id;
		this.label = label;
		this.modelId = modelId;
		this.Nodeid = Nodeid;
	}
	
	public Aspect(String label, int modelId, int nodeId ) {//Constructor for initialize an aspect.
		super();
		this.label = label;
		this.modelId = modelId;
		this.Nodeid = nodeId;
//		this.model = model;
	}
	
//	public Aspect(int id, String label, FRAMModel model) {
//		super();
//		this.id = id;
//		this.label = label;
//		this.modelId = model.getId();
//		this.model = model;
//	}

//	public FRAMModel getModel() {
//		return model;
//	}
//
//
//	public void setModel(FRAMModel model) {
//		this.model = model;
//	}


	public int getId() {
		return id;
	}

	public int getmodelId() {
		return modelId;
	}


	public void setModelId(int modelId) {
		this.modelId = modelId;
	}


	@XmlTransient
	public void setId(int id) {
		this.id = id;
	}


	public String getLabel() {
		return label;
	}

	@XmlTransient
	public void setLabel(String label) {
		this.label = label;
	}


	@Override
    public String toString() {//Prints the content of the aspect.
        return ("\n-Aspect ID: "+id+"  NodeId: "+Nodeid+"\n-Label: "+label+"\n-Model ID: "+modelId);
    }	
	
	public int getNodeid() {
		return Nodeid;
	}

	public void setNodeid(int nodeid) {
		Nodeid = nodeid;
	}
	
}
