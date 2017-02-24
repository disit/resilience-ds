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

import java.util.ArrayList;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/*
 * Ale 16-2-4: The class that represent a FRAM's function.
 */
@XmlRootElement
public class Group{	
	
	@XmlTransient
	private String name;
	
	private int id;
	
	@XmlElement
	private String description;
	@XmlElement
	private int x;
	@XmlElement
	private int y;
	@XmlTransient
	private String color;
	@XmlElement
	private int modelId;	

	@XmlElement(name="id") // Use this for id to pass to the client.
	private int Nodeid; // The node id in the graph. Used for consistency between client and server and for not provide the real id of a function at the client.
	
	@XmlElementWrapper(name = "Functions")
	@XmlElement(name="Function")
	private ArrayList<Integer> Functions_id; //Array of the id of the function in the group.	
	
	public Group()
	{
		Functions_id = new ArrayList<Integer>();
	}
	//Ale: Clones a function.
	public Group(Group f)
	{
		this.id=f.getId();
		this.name=f.getName();
		this.description=f.getDescription();
		this.x=f.getX();
		this.y=f.getY();
		this.color=f.getColor();
		this.modelId=f.getModelId();
		this.Nodeid=f.getNodeid();
		Functions_id = new ArrayList<Integer>();
	}
	
	public Group(int px, int py, String desc, int modId)
	{
		x = px;
		y = py;
		description = desc;
		modelId = modId; 
//		children = new ArrayList<Function>();
		Functions_id = new ArrayList<Integer>();		
	}
	
	public Group(int id, String name, String description, int x, int y,
			String color, int modelId) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
		this.x = x;
		this.y = y;
		this.color = color;
		this.modelId = modelId;
		Functions_id = new ArrayList<Integer>();
	}
	
	public Group(int id, String name, String description, int x, int y,
			String color, int modelId, int Nodeid) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
		this.x = x;
		this.y = y;
		this.color = color;
		this.modelId = modelId;
		this.Nodeid = Nodeid;
		Functions_id = new ArrayList<Integer>();
	}	
	
	public int getId() {
		return id;
	}
	
	@XmlTransient
	public void setId(int id) {
		this.id = id;
	}
	
	public int getNodeid() { 
		return Nodeid;
	}
	
	public void setNodeid(int nodeid) {
		Nodeid = nodeid;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public int getX() {
		return x;
	}

	@XmlTransient
	public void setX(int x) {
		this.x = x;
	}

	public int getY() {
		return y;
	}

	@XmlTransient
	public void setY(int y) {
		this.y = y;
	}
	
	@XmlTransient
	public void setModelId(int modelId)
	{
		this.modelId = modelId;
	}
	
	public int getModelId()
	{
		return modelId;
	}	

	@XmlTransient
	public void setDescription(String description) {
		this.description = description;
	}

	public String getDescription() {
		return description;
	}

	public void addFunction(int f_id)
	{ 
		Functions_id.add(f_id);
		
	}

	
	
	public ArrayList<Integer> getFunctions_id() {
		return Functions_id;
	}
	public void setFunctions_id(ArrayList<Integer> functions_id) {
		Functions_id = functions_id;
	}
	
	@Override
    public String toString() {
        return ("\n-name: "+name+"\n-description: "+description+"\n-ID: "+id+"  -NodeId :"+Nodeid+"\n-x: "+x+"\n-y: "+y+"\n-color:"+color+"\n-modelId: "+modelId
        +"\n-functions id in: "+Functions_id.toString());
    }
    
	/** Ale
	 * Updates the values of the function. 
	 * Exception for id, Nodeid and modelId.
	 * @param g: the Group with the value for the update.
	 */
	public void updateValues(Group g) {
		this.name = g.getName();
		this.description = g.getDescription();
		this.x = g.getX();
		this.y = g.getY();
		this.color = g.getColor();
	} 
	
}
