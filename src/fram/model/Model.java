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

import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Iterator;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

import fram.util.Convert;
import fram.util.DebugClass;

@XmlRootElement(name = "model")
@XmlAccessorType (XmlAccessType.FIELD)
public class Model{

	@XmlElement
	private int modelId;
	@XmlElement
	private String objective;
	@XmlElement
	private String description_model;
	@XmlElement
	private String url;
	@XmlElement
	private int size;
	@XmlTransient
	private Timestamp timestamp_create_model;
	@XmlTransient
	private Timestamp timestamp_last_modify_model;
	@XmlElement
	private String date_create_model;
	@XmlElement
	private String date_last_modify_model;
	@XmlElement
	private int modelUserId;
	
	@XmlElement(name = "children")
	private Criteria root;
	

	public Model()
	{
		root = null; 
		this.size = 1;
	}
	
	public Model(int size)
	{
		root = null; 
		this.size = size;
	}
	
	// Costruttore usato per effettuare l'operazione di clonazione
	public Model(int id, String url, String objective, int userId)
	{
		this.modelId = id;
		this.url = url;
		this.objective = objective;
		this.modelUserId = userId;
		this.size = 1;
	}
	
	// Costruttore usato per creare la struttura di un ModelInstance
	public Model(int id, String url, String objective, int size, int modelUserId)
	{
		this.modelId = id;
		this.url = url;
		this.objective = objective;
		this.size = size;
		this.modelUserId = modelUserId;
	}
	
	
	@XmlTransient
	public void setId(int modelId)
	{
		this.modelId = modelId;
	}

	public int getId() {
		return modelId;
	}
	

	@XmlTransient
	public void setModelUserId(int modelUserId)
	{
		this.modelUserId = modelUserId;
	}

	public int getModelUserId() {
		return modelUserId;
	}
	
	
	@XmlTransient
	public void setSize(int size){
		this.size = size;
	}
	
	public int getSize() {
		return size;
	}


	@XmlTransient
	public void setObjective(String objective)
	{
		this.objective = objective;
	}
	
	public String getObjective()
	{
		return objective;
	}

	
	@XmlTransient
	public void setRootCriteria(Criteria criteria)
	{
		root = criteria;
	}
	
	public Criteria getRootCriteria()
	{
		return root;
	}
	
	
	@XmlTransient
	public void setDescriptionModel(String description)
	{
		this.description_model = description;
	}
	
	public String getDescriptionModel()
	{
		return description_model;
	}
	
	
	
	public void specifyTimestampCreateModel(Timestamp date)
	{
		this.timestamp_create_model = date;
		setDateCreateModel(Convert.getInstance().dateToString(new Date(this.timestamp_create_model.getTime())));
	}

	public Timestamp getTimestampCreateModel()
	{
		return timestamp_create_model;
	}
	
	@XmlTransient
	public void setDateCreateModel(String date)
	{
		date_create_model = date;
	}
	
	public String getDateCreateModel()
	{
		return date_create_model;
	}
	
	
	
	public void specifyTimestampLastModifyModel(Timestamp date)
	{
		this.timestamp_last_modify_model = date;
		setDateLastModifyModel(Convert.getInstance().dateToString(new Date(this.timestamp_last_modify_model.getTime())));
	}

	public Timestamp getTimestampLastModifyModel()
	{
		return timestamp_last_modify_model;
	}
	
	@XmlTransient
	public void setDateLastModifyModel(String date)
	{
		date_last_modify_model = date;
	}
	
	public String getDateLastModifyModel()
	{
		return date_last_modify_model;
	}
	
	
	@XmlTransient
	public void setUrl(String url_discussion)
	{
		this.url = url_discussion;
	}
	
	public String getUrl()
	{
		return url;
	}
	
	
	public void addCriteria(Criteria criteria)
	{
		Criteria critToAddChild = getFatherCriteria(criteria.getPosition());
		//int posChild = (int) criteria.getPosition().charAt(criteria.getPosition().length()-1)-49;
		criteria.setCritF(critToAddChild);
		critToAddChild.addChild(criteria);
		//critToAddChild.addChild(new Criteria(criteria.getPosition(), criteria.getDescription(), critToAddChild, criteria.getModelId()));
		size++;
	}

	
	public void updateCriteriaDescription(String pos, String str)
	{
		Criteria crit = getCriteria(pos);
		crit.setDescription(str);
		if(crit.getPosition().equals("C0"))
				setObjective(str);	
	}
	
	
	public void deleteCriteria(String position)
	{	
		Criteria crit = getFatherCriteria(position); 
		
		if(crit != null)
		{	
			int pos_child = (int) position.charAt(position.length()-1)-49;
			if(pos_child < crit.getNumChildren()-1)
			{	
				for(int j=pos_child+1; j<crit.getNumChildren(); j++)
					relabelingSubTree(crit.getChild(j),position.length()-1);
			}
			crit.removeChild(pos_child);
		}else
			root = null;
	}
	
	
	public void relabelingSubTree(Criteria crit, int posChange)
	{
		String oldPosition = crit.getPosition();
	
		String newPosition = "C";
		for(int i=1; i<oldPosition.length(); i++)
		{
			int app_position = (int) oldPosition.charAt(i)-48;
			if(i == posChange)
				app_position--;
			newPosition = newPosition.concat(String.valueOf(app_position));
		}	
		crit.setPosition(newPosition);
		
		for(int i=0; i < crit.getNumChildren(); i++)
			relabelingSubTree(crit.getChild(i), posChange);
	}
	
	
	public void printModel(Criteria criteria)
	{
		DebugClass.getInstance().printModel(criteria);
	}
	
	
	public Model cloneModel(int modelId, int userId)
	{
		Model model = new Model(modelId, url, objective.concat("_cloned"), userId);
		reconstructModelStructure(root, model, modelId);
		return model;
	}
	
	public void reconstructModelStructure(Criteria criteria, Model model, int modelId)
	{
		String description_criteria = "";
		if(criteria == root)
			description_criteria = criteria.getDescription().concat("_cloned");
		else
			description_criteria = criteria.getDescription();
		
		Criteria crit_new = new Criteria(criteria.getPosition(), description_criteria, modelId, criteria.getIsLeaf());
		crit_new.createArrayListChildren();
		
		if(criteria == root)
			model.setRootCriteria(crit_new);
		else
			model.addCriteria(crit_new);
		
		for(int i=0; i<criteria.getNumChildren(); i++)
			reconstructModelStructure(criteria.getChild(i), model, modelId);
	} 
	
	
	
	public Criteria getCriteria(String position)
	{
		Criteria crit;
		if(position.length()-1 == 1 && position.contains("0"))
			return root;
		else
		{
			int[] values = getVectorPosition(position,"child");	
			crit = getCriteriaRecurrent(root, 0, values);
		}
		return crit;
	}
	
	private Criteria getFatherCriteria(String position)
	{
		Criteria crit;
		if(position.length()-1 == 1 && position.contains("0"))
			crit = null;
		else
		{
			int[] values = getVectorPosition(position,"father");	
			crit = getCriteriaRecurrent(root, 0, values);
		}
		return crit;
	}
	
	private Criteria getCriteriaRecurrent(Criteria criteria, int index, int[] vect_pos)
	{
		if(index < vect_pos.length)
			return getCriteriaRecurrent(criteria.getChild(vect_pos[index]), index+1, vect_pos);
		else
			return criteria;
	}
	
	private int[] getVectorPosition(String position, String type)
	{
		int length_vect = 0;
		if(type.equals("father"))
			length_vect = position.length()-1;
		else if(type.equals("child"))
			length_vect = position.length();
		
		int[] values = new int[length_vect-1];
		for(int i=1; i<length_vect; i++)
			values[i-1] = (int) position.charAt(i)-49;
		return values;
	}


	@Override
    public String toString() {
        return ("\n-Model ID: "+modelId+"\n-Objective: "+objective+"\n-Description: "+description_model+"\n-User ID: "+modelUserId+"\n-Size:"+size
        		+"\n-Create: "+date_create_model+"\n-Modify:"+date_last_modify_model+"\n-Criteria List:"+root.toString());
    }

	/**Ale:
	 * Calculate the size for the current model. It counts the number of criteria present in the tree.
	 */
	public void calculateSize() {
		int new_size = 0;
		if(root != null){
			new_size++;
			new_size += root.getChildren().size();
			ArrayList<Criteria> children = new ArrayList<Criteria>(root.getChildren()); // The queue for the criteria.
			while(!children.isEmpty()){
				Criteria next = children.remove(0);
				new_size += next.getChildren().size();
				children.addAll(next.getChildren());				
			}
		}
		this.size = new_size;
	}
}
