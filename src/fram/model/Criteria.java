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
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;


@XmlRootElement
public class Criteria{
	
	@XmlElement
	private String position;
	@XmlElement
	private String description;
	@XmlElement
	private boolean isLeaf;
	//private int userId;
	@XmlElement
	private int modelId;
	private Criteria father;
	
	@XmlElement(name = "children")
	private ArrayList<Criteria> children;
		
	
	public Criteria()
	{
		children = new ArrayList<Criteria>();
		isLeaf = true;
		father = null;
	}
	
	public Criteria(String pos, String desc, int modId)
	{
		position = pos;
		description = desc;
		modelId = modId; 
		children = new ArrayList<Criteria>();
		father = null;
		setIsLeaf(true);
	}
	
	// Utilizzato quando viene creato il CriteriaInstance nella funzione reconstructModelStructure all'interno di ModelInstance
	// e nella funzione reconstructModelStructure all'interno della classe Model pre la creazione del Criteria
	public Criteria(String pos, String desc, int modId, boolean isLeaf)
	{
		position = pos;
		description = desc;
		modelId = modId;
		father = null;
		setIsLeaf(isLeaf);
	}
	
	public Criteria(String pos, String desc, Criteria fat, int modId)
	{
		position = pos;
		description = desc;
		father = fat;
		modelId = modId; 
		children = new ArrayList<Criteria>();
		setIsLeaf(true);
	} 
	
	public void createArrayListChildren()
	{
		children = new ArrayList<Criteria>();
	}
	
	
	@XmlTransient
	public void setPosition(String position)
	{
		this.position = position;
	}
	
	public String getPosition() {
		return position;
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

	/*
	@XmlTransient
	public void setUserId(int userId) {
		this.userId = userId;
	}

	public int getUserId() {
		return userId;
	}
	*/

	public void addChild(Criteria criteria)
	{
		children.add(criteria);
		isLeaf = false;
	}
	
	/*
	public void setAllChildren(ArrayList<Criteria> arr_crit)
	{
		children = arr_crit;
	} */
	
	
	public ArrayList<Criteria> getChildren()
	{
		return children;
	}
	
	public Criteria getChild(int index)
	{
		return children.get(index);
	}
	
	
	public void substituteChild(int position, Criteria criteria)
	{
		children.set(position, criteria);
	}
	
	public void removeChild(int index)
	{
		children.remove(index);
	}
	
	
	public int getNumChildren()
	{
		return children.size();
	}
	
	
	public void setCritF(Criteria fatherCriteria){
		father = fatherCriteria;
	} 
	
	public Criteria getFather() {
		return father;
	}
	
	@XmlTransient
	public void setIsLeaf(boolean leaf)
	{
		isLeaf = leaf;
	}
	
	public boolean getIsLeaf()
	{
		return isLeaf;
	}

	public Criteria returnACopyOfCriteriaWithoutChildren()
	{
		Criteria criteria_app = new Criteria( position, description, father, modelId );
		criteria_app.setIsLeaf( isLeaf );
		return criteria_app;
	}
	
	/** Ale 
	 * Print the list of children as a String.
	 * @return
	 */
	private String printChildren(){
		String child_list="";
		for(Criteria c:children){
			child_list+=c.toString();
		}
		return child_list;
	}

	@Override
    public String toString() {
        return ("\n- Description: "+description+"\n- position:"+position+"\n- isLeaf:"+isLeaf+"\n- children: "+children.size()+
        		"\n- idModel: "+modelId+"\n Criteria:"+printChildren());
    }
}
