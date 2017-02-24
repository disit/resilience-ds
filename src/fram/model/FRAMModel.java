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

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

import com.sun.crypto.provider.DESCipher;

import fram.modelinstance.FRAMModelInstance;
import fram.util.Convert;
import fram.util.DebugClass;

@XmlRootElement(name = "model")
@XmlAccessorType (XmlAccessType.FIELD)
public class FRAMModel{
/* Class that contains all the informations about a model. It's used for lay the model loaded from an FMV file.
 * 
 */
	@XmlElement
	private int modelId;
	@XmlElement
	private String objective;
	@XmlElement
	private String description_model;
	@XmlElement
	private String priority_type; //Value for the priority of the class...
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
	
//	@XmlTransient
	private int aspect_count=0; //Counts the number of aspect entered. 
	
//	@XmlTransient
	private int function_count=0; //Counts the number of function entered.
	
	@XmlElementWrapper(name="Functions")
	@XmlElement(name="Function")
	private ArrayList<Function> Functions;	
		
	@XmlTransient
	private ArrayList<Aspect> Aspects;
	
	@XmlElementWrapper(name = "Aspects")
	@XmlElement(name="Aspect")
	private ArrayList<AspectForClient> AspectsC; //the array of aspect to pass to the client.
	
	@XmlElementWrapper(name = "Groups")
	@XmlElement(name="Group")
	private ArrayList<Group> Groups;
	
	@XmlElement(name="modelinstance")
	private FRAMModelInstance FMI; // Instance loaded for the current model.
	
	public FRAMModel()
	{
		this.size = 1;
		Functions = new ArrayList<Function>();
		Aspects = new ArrayList<Aspect>();
		AspectsC = new ArrayList<AspectForClient>();
		Groups = new ArrayList<Group>();
	}
	
	public FRAMModel(FRAMModel model){
		this.modelId=model.getId();
		this.objective=model.getObjective();
		this.description_model=model.getDescriptionModel();
		this.priority_type=model.getPriority_type();
		this.size=model.getSize();
		this.timestamp_create_model=model.getTimestampCreateModel();
		this.timestamp_last_modify_model=model.getTimestampLastModifyModel();
		this.date_create_model=model.getDateCreateModel();
		this.date_last_modify_model=model.getDateLastModifyModel();
		this.modelUserId=model.getModelUserId();
//		this.Aspects=model.getAspects();
		this.AspectsC=new ArrayList<AspectForClient>();
		this.AspectsC=model.getAspectsC();
		this.Groups = model.getGroups();
		
//		
//		this.Functions = new ArrayList<Function>();	//XXX doesn't provide the functions for not pass them to the client.
//		this.Functions=model.getFunctions();		
	}
	public FRAMModel(int id,FRAMModel model){
		this.modelId=id;
		this.objective=model.getObjective();
		this.description_model=model.getDescriptionModel();
		this.priority_type=model.getPriority_type();
		this.size=model.getSize();
		this.timestamp_create_model=model.getTimestampCreateModel();
		this.timestamp_last_modify_model=model.getTimestampLastModifyModel();
		this.date_create_model=model.getDateCreateModel();
		this.date_last_modify_model=model.getDateLastModifyModel();
		this.modelUserId=model.getModelUserId();
//		this.Aspects=model.getAspects();
		this.AspectsC=new ArrayList<AspectForClient>();
		this.AspectsC=model.getAspectsC();
		this.Groups = model.getGroups();		
//	Clones the functions	
		this.Functions = new ArrayList<Function>();	
		this.Functions = model.getFunctions();	
		this.function_count = model.getFunctions().size();
		this.aspect_count = model.getAspect_count();

		this.Aspects = new ArrayList<Aspect>();
	}
	public FRAMModel(int size)
	{
		this.size = size;
	}
	
	// Costruttore usato per effettuare l'operazione di clonazione
	public FRAMModel(int id, String objective, int userId)
	{
		this.modelId = id;
		this.objective = objective;
		this.modelUserId = userId;
		this.description_model = objective;
		this.priority_type = "private";
		this.size = 1;
	}
	
	//Ale: constructor used for load an FMV file.
	public FRAMModel(int modelId, String objective) {
		this.modelId = modelId;
		this.objective = objective;
		this.modelUserId = 3;
		this.description_model = objective;
		this.priority_type = "private";
		this.size = 1;
	}

	// Costruttore usato per creare la struttura di un ModelInstance
	public FRAMModel(int id, String objective, int size, int modelUserId)
	{
		this.modelId = id;
		this.objective = objective;
		this.size = size;
		this.modelUserId = modelUserId;
	}
	
	public FRAMModel(int id, String objective, String description, int size, int modelUserId)
	{
		this.modelId = id;
		this.objective = objective;
		this.description_model = description;
		this.size = size;
		this.modelUserId = modelUserId;
	}
		
	public ArrayList<Aspect> getAspects() {
		return Aspects;
	}

	public void setAspects(ArrayList<Aspect> aspects) {
		Aspects = aspects;
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

	
	public String getPriority_type() {
		return priority_type;
	}

	@XmlTransient
	public void setPriority_type(String priority_type) {
		this.priority_type = priority_type;
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
	
	public void setTimestampCreateModel(Timestamp timestamp_create_model)
	{
		this.timestamp_create_model = timestamp_create_model;
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
	public void setTimestampLastModifyModel(Timestamp timestamp_last_modify_model)
	{
		this.timestamp_last_modify_model = timestamp_last_modify_model;
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
	
	@XmlTransient
	public void setDateLastModifyModel(String date)
	{
		date_last_modify_model = date;
	}
	
	public String getDateLastModifyModel()
	{
		return date_last_modify_model;
	}	
	
	public ArrayList<Function> getFunctions() {
		return Functions;
	}
	/**Ale: 
	 * Searches for a specific function with the id passed.
	 * @param idF
	 * @return
	 */
	public Function getFunction(int idF) {
		for(int i=0;i<Functions.size();i++){
			if( Functions.get(i).getId()==idF ) return Functions.get(i);
		}
		return null;
	}
	/**Ale: 
	 * Searches for a specific function with a specific nodeId.
	 * @param idF
	 * @return
	 */
	public Function getFunctionbyNodeid(int nodeId) {
		for(int i=0;i<Functions.size();i++){
			if( Functions.get(i).getNodeid()==nodeId ) return Functions.get(i);
		}
		return null;
	}
	
	public void setFunctions(ArrayList<Function> functions) {
		Functions = functions;
	}
	
	public void addFunction(Function f){
		Functions.add(f);
	}
	
	public void addGroup(Group g ){
		Groups.add(g);
	}
	
	public ArrayList<AspectForClient> getAspectsC() {
		return AspectsC;
	}

	public void setAspectsC(ArrayList<AspectForClient> aspectsC) {
		AspectsC = aspectsC;
	}

	public int getAspect_count() {
		return aspect_count;
	}

	public void setAspect_count(int aspect_count) {
		this.aspect_count = aspect_count;
	}
	
	public int getFunction_count() {
		return function_count;
	}

	public void setFunction_count(int function_count) {
		this.function_count = function_count;
	}
	
	public int incFunction_count(){
		return function_count++;
	}
	
	public int incAspect_count(){
		return aspect_count++;
	}

	public void addAspect(Aspect a){
		Aspects.add(a);
	}
	
	public void addAspectForClient(AspectForClient a){
//		System.out.println("\n- Insert a new Aspect: "+a.toString());
		AspectsC.add(a);
	}
	
	public void addFunctionForClient(Function f){
//		System.out.println("\n- Insert a new Aspect: "+a.toString());
		Functions.add(f);
	}
	/**
	 * Function that return the Function with the selected node ID
	 * @return Function or null if not present.
	 */
	public Function getFunctionWithNodeid(int id_searched){
		for(Function F : Functions){
	        if(F.getNodeid() == id_searched )
	           return F;
	    }
		return null;
	}
	
	public FRAMModelInstance getFMI() {
		return FMI;
	}

	public void setFMI(FRAMModelInstance fMI) {
		FMI = fMI;
	}

	public ArrayList<Group> getGroups() {
		return Groups;
	}
	
	public void setGroups(ArrayList<Group> groups) {
		Groups = groups;
	}
	
	/**Ale: 
	 * Searches for a specific group with the id passed.
	 * @param idG: id of the group.
	 * @return: the group if exist, or null.
	 */
	public Group getGroup(int idG) {
		for(int i=0;i<Groups.size();i++){
			if( Groups.get(i).getId() == idG ) return Groups.get(i);
		}
		return null;
	}
	
	public Group getGroupWithNodeId(int idG){
		for(int i=0; i < Groups.size(); i++){
			if( Groups.get(i).getNodeid()==idG ) return Groups.get(i);
		}
		return null;
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
	
	public Aspect getAspectByNodeId(int nodeId){ //Finds the aspect identified by the id on the graph.
		for(Aspect A:Aspects){
			if(A.getNodeid()==nodeId) return A;
		}
		return null;
	}
	
	public AspectForClient getAspectForClientByNodeId(int nodeId){ //Finds the aspect identified by the id on the graph.
		for(AspectForClient A:AspectsC){
			if(A.getNodeid()==nodeId) return A;
		}
		return null;
	}
	
	/**Ale
	 * Functions that check if a specific aspect, based on the nodeId, is already present in the model.
	 * @param nodeId: id passed from the client for the aspect.
	 * @return true if a correspondence is found.
	 */
	public boolean containsAspectByNodeId(int nodeId){
		for( Aspect A:Aspects ){
			if(A.getNodeid() == nodeId) return true;
		}
		return false;
	}
	
	/**Ale
	 * Gets all the aspects for the function F in the current model.
	 * @param F. Function to search in the aspect list.
	 * @param source. Boolean value that indicates if the search have to be made for source or target.
	 * @return an arrayList of aspect that have F for source ( or target )
	 */
	public ArrayList<AspectForClient> getAspectsForFunction(Function F, boolean source){
		ArrayList<AspectForClient> aspectsList = new ArrayList<AspectForClient>();
		for(AspectForClient A:AspectsC){
			// Searches for aspects with source the function passed. Else for target
//			System.out.println("\n Aspect: "+source+" source:"+A.getFsource()+" idNode:"+F.getNodeid()+" target:"+A.getFtarget()+" label:"+A.getLabel());
			if( source && A.getFsource()!="null" && Integer.parseInt(A.getFsource()) == F.getNodeid()) aspectsList.add(A); 
			else if(!source && A.getFtarget()!="null" && Integer.parseInt(A.getFtarget()) == F.getNodeid()) aspectsList.add(A);
		}
		return aspectsList;
	}
	
	@Override
    public String toString() {
        return ("\n-Model ID: "+modelId+"\n-Objective: "+objective+"\n-Description: "+description_model+"\n-User ID: "+modelUserId+"\n- Size:"+size
        		+"\n Type: "+priority_type+"\n- Create: "+date_create_model+"\n- Modify:"+date_last_modify_model);
    }
	
//	/** Ale:
//	 * Clone the passed model 
//	 * @param modelId
//	 * @param userId
//	 * @return
//	 */
//	public FRAMModel cloneModel(int modelId, int userId)
//	{
//		FRAMModel model = new Model(modelId, url, objective.concat("_cloned"), userId);
//		reconstructModelStructure(root, model, modelId);
//		return model;
//	}
	
	public String PrintAll(){
		String Content="";
		Content = ("\n-Model ID: "+modelId+"\n-Objective: "+objective+"\n-Description: "+description_model+"\n-User ID: "+modelUserId+"\n- Size:"+size
        		+"\n Type: "+priority_type+"\n- Create: "+date_create_model+"\n- Modify:"+date_last_modify_model);
		Content += "\n\n- F-size: "+Functions.size();
		for(Function F:Functions){
			Content+=F.toString();
		}
		Content += "\n\n- A-size: "+AspectsC.size();
		for(AspectForClient A:AspectsC){
			Content+=A.toString();
		}
		return Content;
	}
	
	/**Ale
	 * Prints the Aspect List.
	 * @return
	 */
	public String printAspects(){
		String Content ="";
		Content += "\n- A-size: "+Aspects.size();
		for(Aspect A:Aspects){
			Content+=A.toString();
		}
		return Content;
	}
	
	/** Ale
	 * Returns the number of aspects in the model.
	 * The number of aspect is the unique number of functions' outputs or external inputs
	 * @return Acount, the number of unique aspects.
	 */
	public int countAspects(){
		int Acount=0;
		int previous_id=-1;
		for(Aspect a:AspectsC){ 
			// The aspects are in ascending order
			if(previous_id!=a.getId()){
				Acount++;
				previous_id = a.getId();
			}
		}
		return Acount;
	}
}
