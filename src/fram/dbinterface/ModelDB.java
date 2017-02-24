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

package fram.dbinterface;

import java.sql.Timestamp;
import java.util.Vector;

import fram.dbinterface.MySQLDBManager;
import fram.model.Aspect;
import fram.model.AspectForClient;
import fram.model.Criteria;
import fram.model.FRAMModel;
import fram.model.Function;
import fram.model.FunctionAspect;
import fram.model.Group;
import fram.model.Model;
import fram.model.ModelStore;
import fram.modelinstance.FRAMModelInstance;
import fram.modelinstance.FunctionInstance;
import fram.util.Convert;

/* Ale: In this file is reported the implementation of a class ModelDBInterface.
 * There are all the function for retrieve a model, modify, save, retrieve a freeId and save criteria.
 * TODO modify this class to fit with the FRAM model.
*/
public class ModelDB implements ModelDBInterface {
	@Override
	public int getFreeId(String table) {
		//Ale:16-2-5 Function that retrieves a freeId from the table 'table'.
//		TODO: If one id is deleted there is an empty id forever. The research have to be redone. 
//		TOCHECK: What happened with one or more insertion simultaneously.
		int freeId = 0;
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT MAX(id) FROM "+table+";" );
		String[] record_max = v.elementAt(0);
		String record_max_id = record_max[0];
		if(record_max_id == null)
			freeId = 1;
		else
			freeId = Integer.parseInt(record_max_id) + 1;		
		return freeId;
	}

	@Override
	public boolean isModelSavedOnDB(int modelId) {
		boolean found = false;
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM model WHERE id='"+modelId+"';" );
		if(v.size() != 0)
			found = true;
		return found;
	}
	@Override
	public boolean hasModelInstanceOnDB(int modelId) {
		boolean found = false;
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM model_instance WHERE idModel='"+modelId+"';" );
		if(v.size() != 0)
			found = true;
		return found;
	}
	
	@Override
	public boolean isFunctionSavedOnDB(int functionId) {
		boolean found = false;
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM function WHERE id='"+functionId+"';" );
		if(v.size() != 0)
			found = true;
		return found;
	}
	
	@Override
	public boolean isAspectSavedOnDB(int aspectId) {
		boolean found = false;
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM aspect WHERE id='"+aspectId+"';" );
		if(v.size() != 0)
			found = true;
		return found;
	}
	@Override
	public boolean isFunctionAspectSavedOnDB(FunctionAspect fa) {
		boolean found = false;
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM function_aspect WHERE "
				+"(idFunction='"+fa.getIdFunction()+"'AND idAspect='"+fa.getIdAspect()+"' AND type='"+fa.getType()+"' );" );
		if(v.size() != 0)
			found = true;
		return found;
	}

	
	// --------------------------------------------------------- Save Info Model on DB ----------------------------------------------------------
	@Override
	/**
	 * Updates the info of a FRAM Model.
	 */
	public void saveFRAMModelInfo(FRAMModel model) {
		
		String query_modify_model = "UPDATE model SET model.objective='"+model.getObjective()+"', model.description='"+model.getDescriptionModel()+"'"
				+", model.size='"+model.getSize()+"', model.date_last_modify='"+model.getDateLastModifyModel()+"' WHERE id='"+model.getId()+"'";
//		System.out.println(query_modify_model);
		MySQLDBManager.getInstance().update(query_modify_model);		
	}
	
	@Override
	public void saveModelInfo(Model model) {
		
		String query_modify_model = "UPDATE model SET model.objective='"+model.getObjective()+"', model.description='"+model.getDescriptionModel()+"',"
				+ "model.url_model='"+model.getUrl()+"' WHERE id='"+model.getId()+"'";
		MySQLDBManager.getInstance().update(query_modify_model);
		
		String query_modify_root_criteria = "UPDATE criteria SET criteria.description='"+model.getRootCriteria().getDescription()+"'"
				+ "WHERE idModel='"+model.getId()+"' AND criteria.position='C0'";
		
		MySQLDBManager.getInstance().update(query_modify_root_criteria);
		
	}
	
	/** Ale
	 * Update a function in the DB.
	 * @param function
	 */
	@Override
	public void saveFunctionInfo(Function function) {
		/*
		 * DB table field: id,	name,	description,	x,	y,	color,	type,	idModel
		 */
		String query_modify_function = "UPDATE function SET function.name='"+function.getName()+"', function.description='"+function.getDescription()+"',"
				+ "function.x='"+function.getX()+"', function.y='"+function.getY()+"', function.color='"+function.getColor()+"', function.type='"+function.getType()+"'"
				+ "WHERE id='"+function.getId()+"'";
		MySQLDBManager.getInstance().update(query_modify_function);		
	}		
	
	/** Ale
	 * Updates a group in the DB.
	 * @param group
	 */
	@Override
	public void saveGroupInfo(Group group) {
		/*
		 * DB table field: id,	name,	description,	x,	y,	color,	idModel
		 */
		String query_modify_group = "UPDATE framgroup SET framgroup.name='"+group.getName()+"', framgroup.description='"+group.getDescription()+"',"
				+ "framgroup.x='"+group.getX()+"', framgroup.y='"+group.getY()+"', framgroup.color='"+group.getColor()+"'"
				+ "WHERE id='"+group.getId()+"'";
		MySQLDBManager.getInstance().update(query_modify_group);		
	}		

	// --------------------------------------------------------- Save FRAMModel on DB ----------------------------------------------------------	
	@Override
	public void saveFRAMModel(FRAMModel model) {
		
		if(isModelSavedOnDB(model.getId())) //Deletes all the model.
			deleteModel(model.getId());
		boolean present = false;
//		if(isModelSavedOnDB(model.getId())){
//			present = true;
////			saveFRAMModelInfo( model );//Modifies the information of the model.
//			deleteFRAMModelFunctions(model.getId());//Deletes all the function
//			deleteFRAMModelAspects(model.getId());//Deletes all the aspects
//		}
		String query_model_insert="";
		//8 table field: (0)id, (1)objective, (2)description, (3)type, (4)size, (5)date_create, (6)date_last_modify, (7)idUser 
		if(!present){			
			query_model_insert = "INSERT INTO model (id, objective, description, type, size, date_create, date_last_modify, idUser) VALUES "
					+ "('"+model.getId()+"','"+model.getObjective().replace("'", "\\'")
					+"','"+model.getDescriptionModel().replace("'", "\\'")+"','"+model.getPriority_type()+"',"
					+ "'"+model.getSize()+"','"+model.getDateCreateModel()+"','"+model.getDateLastModifyModel()
					+"','"+model.getModelUserId()+"');";
		}
		else{
			query_model_insert = "UPDATE model SET model.objective='"+model.getObjective()+"', model.description='"+model.getDescriptionModel()+"'"
					+", model.size='"+model.getSize()+"', model.date_last_modify='"+model.getDateLastModifyModel()+"' WHERE id='"+model.getId()+"'";
		}
		MySQLDBManager.getInstance().update(query_model_insert);
//		saveCriteriaModel(model.getRootCriteria(), model.getId());
		
	}

	// --------------------------------------------------------- Save FRAM function on DB ----------------------------------------------------------	
	@Override
	public void saveFunction(Function function) {
		if(isFunctionSavedOnDB(function.getId()))
			deleteFunction(function.getId());
		System.out.println(function.toString());
		
		String f_description = null;
		if(function.getDescription()!=null) f_description=function.getDescription().replace("'", "\\'");
		//8 campi tabella model: (0)id, (1)name, (2)description, (3)x, (4)y, (5)color, (6)type, (7)idModel 
		String query_model_insert = "INSERT INTO function (id, name, description, x, y, color, type, idModel) VALUES "
				+ "('"+function.getId()+"','"+function.getName().replace("'", "\\'")
				+"','"+f_description+"','"+function.getX()+"',"
				+ "'"+function.getY()+"','"+function.getColor()+"','"+function.getType()+"','"+function.getModelId()+"');";
//		System.out.println("\n- Query: "+query_model_insert);
		MySQLDBManager.getInstance().update(query_model_insert);
//		saveCriteriaModel(model.getRootCriteria(), model.getId());
		
	}
	
	// --------------------------------------------------------- Save FRAM Group on DB ----------------------------------------------------------	
	@Override
	public void saveGroup(Group group) {
		
		if(isFunctionSavedOnDB(group.getId()))
			deleteFunction(group.getId());
		
		//8 campi tabella model: (0)id, (1)name, (2)description, (3)x, (4)y, (5)color, (6)idModel 
		String query_group_insert = "INSERT INTO framgroup (id, name, description, x, y, color, idModel) VALUES "
				+ "('"+group.getId()+"','"+group.getName().replace("'", "\\'")
				+"','"+group.getDescription().replace("'", "\\'")+"','"+group.getX()+"',"
				+ "'"+group.getY()+"','"+group.getColor()+"','"+group.getModelId()+"');";
//		System.out.println("\n- Query: "+query_model_insert);
		MySQLDBManager.getInstance().update(query_group_insert);
//		saveCriteriaModel(model.getRootCriteria(), model.getId());
		
	}
	
	// --------------------------------------------------------- Save FRAM group function on DB ----------------------------------------------------------	
	
	@Override
	/** Ale
	 * Saves a field group function in DB.
	 */
	public void saveGroupFunction(int G_id, int F_id) {		
		//Ale: 2 fields table model: (0)idGroup, (1)idFunction
		String query_group_function_insert = "INSERT INTO framgroup_function (idGroup, idFunction) VALUES "
				+ "('"+G_id+"','"+F_id+"');";		
		System.out.println("\n "+query_group_function_insert);
		MySQLDBManager.getInstance().update( query_group_function_insert );
	}
	
	// --------------------------------------------------------- Save FRAM function-aspect on DB ----------------------------------------------------------	
	@Override
	public void saveFunctionAspect(FunctionAspect fa) {
		
		if(isFunctionAspectSavedOnDB(fa))
			deleteFunctionAspect(fa);
		
		//Ale:3 field table model: (0)idFunction, (1)idAspect, (2)type
		String query_model_insert = "INSERT INTO function_aspect (idFunction, idAspect, type) VALUES "
				+ "('"+fa.getIdFunction()+"','"+fa.getIdAspect()+"','"+fa.getType()+"');";

		MySQLDBManager.getInstance().update(query_model_insert);
//		saveCriteriaModel(model.getRootCriteria(), model.getId());
		
	}
	// --------------------------------------------------------- Save ASPECT function on DB ----------------------------------------------------------	
	@Override
	public void saveAspect(Aspect aspect) {
		
		if(isAspectSavedOnDB(aspect.getId()))
			deleteAspect(aspect.getId());
		
		//3 table's fields: (0)id, (1)label, (2)idModel
		String query_model_insert = "INSERT INTO aspect (id, label, idModel) VALUES "
				+ "('"+aspect.getId()+"','"+aspect.getLabel().replace("'", "\\'")+"','"+aspect.getmodelId()+"');";
//		System.out.println("\n- Query: "+query_model_insert);
		MySQLDBManager.getInstance().update(query_model_insert);
		
	}
	
	// --------------------------------------------------------- Save Model on DB ----------------------------------------------------------	
	@Override
	public void saveModel(Model model) {
		
		if(isModelSavedOnDB(model.getId()))
			deleteModel(model.getId());
		
		//8 campi tabella model: (0)id, (1)objective, (2)description, (3)url_model, (4)size, (5)date_create, (6)date_last_modify, (7)idUser 
		String query_model_insert = "INSERT INTO model (id, objective, description, url_model, size, date_create, date_last_modify, idUser) VALUES "
									+ "('"+model.getId()+"','"+model.getObjective()+"','"+model.getDescriptionModel()+"','"+model.getUrl()+"',"
									+ "'"+model.getSize()+"','"+model.getTimestampCreateModel()+"','"+model.getTimestampLastModifyModel()+"','"+model.getModelUserId()+"');";
		MySQLDBManager.getInstance().update(query_model_insert);
		saveCriteriaModel(model.getRootCriteria(), model.getId());
		
	}

	
	private void saveCriteriaModel(Criteria criteria, int modelId)
	{//Ale: TODO change in saveFunctionModel for FRAM.
		String query_criteria_insert = "";
		int idCriteria = getFreeId("criteria");
		
		query_criteria_insert = "INSERT INTO criteria (id, position, description, idModel) VALUES ('"+
					idCriteria+"','"+criteria.getPosition()+"','"+criteria.getDescription()+"','"+modelId+"');";
	
		if(!MySQLDBManager.getInstance().update(query_criteria_insert))
				System.out.println("Errore inserimento criteria su DB: criteria="+criteria.getPosition()+"\tmodel= "+modelId+" - "+
							ModelStore.getInstance().getModelById(criteria.getModelId()).getObjective());
		
		for(int i=0; i < criteria.getNumChildren(); i++)
			saveCriteriaModel(criteria.getChild(i), modelId);
	}
	// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	
	
	
	
	// --------------------------------------------------------- Delete Model on DB for rewrite it ----------------------------------------------------------
	@Override
	public void deleteModel(int modelId) {
		
//		deleteCriteriaModel(model.getId());
		String query_model_delete = "DELETE FROM model WHERE id='"+modelId+"';";
		MySQLDBManager.getInstance().update(query_model_delete);
		
	}
	
	@Override
	public void deleteFunction(int functionId) {
		
//		deleteCriteriaModel(model.getId());
		String query_model_delete = "DELETE FROM function WHERE id='"+functionId+"';";
		MySQLDBManager.getInstance().update(query_model_delete);
	}
	
	@Override
	public void deleteGroup(int groupId) {		
		String query_group_delete = "DELETE FROM framgroup WHERE id='"+groupId+"';";
		MySQLDBManager.getInstance().update(query_group_delete);
	}
	
	@Override
	public void deleteGroupFunction(int groupId) {
		String query_group_delete = "DELETE FROM framgroup_function WHERE idGroup='"+groupId+"';";
		MySQLDBManager.getInstance().update(query_group_delete);
	}
	
	@Override
	public void deleteGroupHierarchy(int groupId) {
		String query_group_hierarchy_delete = "DELETE FROM framgroup_hierarchy WHERE idGroup_father='"+groupId+"';";
		MySQLDBManager.getInstance().update(query_group_hierarchy_delete);
	}
	
	@Override
	public void deleteFRAMModelFunctions(int modelId) {
		
//		deleteCriteriaModel(model.getId());
		String query_model_delete = "DELETE FROM function WHERE idModel='"+modelId+"';";
		MySQLDBManager.getInstance().update(query_model_delete);
	}
	@Override
	public void deleteFRAMModelAspects(int modelId) {
		
//		deleteCriteriaModel(model.getId());
		String query_model_delete = "DELETE FROM aspect WHERE idModel='"+modelId+"';";
		MySQLDBManager.getInstance().update(query_model_delete);
	}
	@Override
	public void deleteFunctionInstance(int modelId, int functionId) {
//		deleteCriteriaModel(model.getId());
		String query_model_delete = "DELETE FROM model_function WHERE idInstance='"+modelId+"' AND idFunction='"+functionId+"';";
		MySQLDBManager.getInstance().update(query_model_delete);
	}
	@Override
	public void deleteAspect(int aspectId) {
		
//		deleteCriteriaModel(model.getId());
		String query_model_delete = "DELETE FROM aspect WHERE id='"+aspectId+"';";
		MySQLDBManager.getInstance().update(query_model_delete);
		
	}
	@Override
	public void deleteFunctionAspect(FunctionAspect fa) {
		
//		deleteCriteriaModel(model.getId());
		String query_model_delete = "DELETE FROM function_aspect WHERE (idFunction='"+fa.getIdFunction()
				+"' AND idAspect= +'"+fa.getIdAspect()+"' AND type='"+fa.getType()+"' );";
		MySQLDBManager.getInstance().update(query_model_delete);
		
	}
	
//	private void deleteCriteriaModel(int modelId)
//	{		
//		String query_criteria_delete = "DELETE FROM criteria WHERE idModel='"+modelId+"';";
//		
//		if(!MySQLDBManager.getInstance().update(query_criteria_delete))
//			System.out.println("Errore cancellazione criteri con id modello "+modelId+" su DB!");
//	}
	// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	
	
	@Override
	public Vector<String[]> retrieveListModels() {
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT id, objective, description, size, idUser, date_create, date_last_modify FROM model;" );
		return v;
	}
	//XXX OLD.
	public Vector<String[]> retrieveListModelsnotCompleted() {
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT id, objective, size, idUser FROM model;" );
		return v;
	}

	/** Ale
	 * Load the data of the last modify for the model
	 */
	public Timestamp getFRAMModelCreateTime(int idModel){
		Vector<String[]> vModel = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM model WHERE id="+idModel+";" );
		String[] record_model;
		Timestamp date_last_modify = null;
		if(vModel.size() != 0){
			record_model = vModel.elementAt(0);
			date_last_modify = Convert.getInstance().stringToTimestamp(record_model[6]);			
		}
		return date_last_modify;
	}
	// ---------------------------------- Metodo per recuperare un modello su DB e caricarlo sul server -------------------------------------------------------------
	@Override //Old
	public Model loadModel(int idModel) {
//		// Non è necessario controllare il tipo di utente per questa richiesta perchè viene fatta in base ai modelli recuperati in precedenza
//		Vector<String[]> vModel = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM model WHERE id="+idModel+";" );
//		Vector<String[]> vCriteria = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM criteria WHERE idModel="+idModel+";" );
//		Model model = createModelOnServer(vModel, vCriteria); 
		return new Model();
	}
	
	// ---------------------------------- Ale: Method for retrieve a FRAMmodel from the DB and load on the server.-------------------------------------------------------------
	@Override
	public FRAMModel loadFRAMModel(int idModel) {
		Vector<String[]> vModel = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM model WHERE id="+idModel+";" );
		Vector<String[]> vFunction = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM function WHERE idModel="+idModel+";" );
		Vector<String[]> vAspect = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM aspect WHERE idModel="+idModel+";" );
		Vector<String[]> vGroup = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM framgroup WHERE idModel="+idModel+";" );
		FRAMModel model = createFRAMModelOnServer(vModel, vFunction, vAspect, vGroup); 
		return model;
	}
	
	/**Ale: 
	 * Creates a copy of the model on server.
	 * @param vModel: Model request by the client.
	 * @param vFunction: list of functions for the current model.
	 * @param vAspect: list of aspects for the current model.
	 * @param vGroup: list of groups for the current model.
	 * @return
	 */
	private FRAMModel createFRAMModelOnServer(Vector<String[]> vModel, Vector<String[]> vFunction, Vector<String[]> vAspect, Vector<String[]> vGroup){
		//Ale: This function builds the model.
		//model table's field: (0)id, (1)objective, (2)description, (3)type, (4)size, (5)date_create, (6)date_last_modify, (7)idUser 
		String[] record_model = vModel.elementAt(0);
		int modelId = Integer.parseInt(record_model[0]);
		String objective = record_model[1];
		String description = record_model[2];
		String Ptype = record_model[3];
		Timestamp date_create = Convert.getInstance().stringToTimestamp(record_model[5]);
		Timestamp date_last_modify = Convert.getInstance().stringToTimestamp(record_model[6]);
		int userId = Integer.parseInt(record_model[7]);		
		
		FRAMModel model = new FRAMModel();
		model.setId(modelId);		
		model.setObjective(objective);
		model.setDescriptionModel(description);
		model.setPriority_type(Ptype);
		model.specifyTimestampCreateModel(date_create);
		model.specifyTimestampLastModifyModel(date_last_modify);
		model.setModelUserId(userId);
		
		insertDataFunction(model, vFunction);
		
		insertDataAspect(model, vAspect); 
		
		insertDataGroup(model, vGroup);
		
		insertGroupHierarchy(model);
		
		model.setFunction_count(vFunction.size());
		
		model.setAspect_count(model.countAspects());
		
		return model;
	}
//	//Ale: XXX old
//	private Model createModelOnServer(Vector<String[]> vModel, Vector<String[]> vCriteria){
//		//Ale: TODO This function builds the model.
//		//campi tabella model: (0)id, (1)objective, (2)description, (3)url_model, (4)size, (5)date_create, (6)date_last_modify, (7)idUser 
//		String[] record_model = vModel.elementAt(0);
//		int modelId = Integer.parseInt(record_model[0]);
//		String objective = record_model[1];
//		String description = record_model[2];
//		String url = record_model[3];
//		Timestamp date_create = Convert.getInstance().stringToTimestamp(record_model[5]);
//		Timestamp date_last_modify = Convert.getInstance().stringToTimestamp(record_model[6]);
//		int userId = Integer.parseInt(record_model[7]);
//		
//		Model model = new Model();
//		model.setId(modelId);
//		model.setObjective(objective);
//		model.setDescriptionModel(description);
//		model.setUrl(url);
//		model.specifyTimestampCreateModel(date_create);
//		model.specifyTimestampLastModifyModel(date_last_modify);
//		model.setModelUserId(userId);
//		
////		Model modelUpdate = insertDataCriteria(model, vCriteria);
//		return modelUpdate;
//	}
/**	Ale: 
 * Update the functions' data with the parameter provided in the instances.
 * @param model
 * @param vFunction
 * @return FRAMModel with the information provided.
 */
	private FRAMModel insertDataFunction(FRAMModel model, Vector<String[]> vFunction)
	{
		//Function table's fields: id, name, description, x, y, color, type, idModel
		for(int i=0; i<vFunction.size(); i++)
		{
			String[] record_function = vFunction.elementAt(i);
			int f_id=Integer.parseInt(record_function[0]);
			String name = record_function[1];
			String description = record_function[2];
			int x = Integer.parseInt(record_function[3]);
			int y = Integer.parseInt(record_function[4]);
			String color = record_function[5];
			int type = Integer.parseInt(record_function[6]);
			int modelId = Integer.parseInt(record_function[7]);
			int nodeId = i; //The id in the graph.
			Function function = new Function(f_id, name, description, x, y, color, type, modelId, nodeId);
			
//			Function function = new Function(position, description, model.getId());
			model.addFunction(function);
//			System.out.println("\n-Function passed: "+function.toString());		
		}	
		return model;
	}
/** Ale: Inserts Data Aspect. TODO Modify. For each aspect, creates an extension of the aspect to pass to the client.
 */
	private void insertDataAspect(FRAMModel model, Vector<String[]> vAspect)
	{
		//Function table's fields: id, label, idModel
		for(int i=0; i<vAspect.size(); i++)
		{
			String[] record_aspect = vAspect.elementAt(i);
			int a_id=Integer.parseInt(record_aspect[0]);
			String label = record_aspect[1];
			int modelId = Integer.parseInt(record_aspect[2]);
			
			//TOCHECK loro non gli passano l'id. Forse perché si basano sulla posizione per fare le mdofiche.
//			Aspect aspect = new Aspect(a_id, label, modelId, i);
			
			insertDataAspectForClient(model, a_id, label, i);
		}
	}
/** Ale: 
 * Function that creates the aspects to pass to the client side.	
 */
	private void insertDataAspectForClient(FRAMModel model, int aToSearch, String label, int ANodeid){
		//function_aspect fields: isFunction, idAspect, type.
		Vector<String[]> vSource = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM function_aspect WHERE idAspect="+aToSearch+" AND type = 'Output' ;" );//Only one for this.
		Vector<String[]> vTarget = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM function_aspect WHERE idAspect="+aToSearch+" AND type != 'Output' ;" );//More than one record are possible.
		String source="null";
		String target="null";
		String type="Output";
		//Sets the source or the target.
		
		if(vSource.size()>0){
			source=vSource.elementAt(0)[0];
			//Retrieves the function id for the graph (Function.Nodeid).
			Function F=model.getFunction(Integer.parseInt(source));
			int FNodeid=F.getNodeid();
			source=""+FNodeid;			
		}
		if(vTarget.size()==0){ //there is the source and not the source.
			AspectForClient a = new AspectForClient(aToSearch, label, model.getId(), "null", source, type, ANodeid);
			model.addAspectForClient(a);
//			System.out.println("\n-Source passed: "+a.toString());
		}
		else{
			for(int i=0; i<vTarget.size(); i++){
				target = vTarget.elementAt(i)[0];
				Function Ft=model.getFunction(Integer.parseInt(target));
				int FtNodeid=Ft.getNodeid();
				target=""+FtNodeid;
				type = vTarget.elementAt(i)[2];
				AspectForClient a=new AspectForClient(aToSearch, label, model.getId(), target, source, type, ANodeid);
				model.addAspectForClient(a);
//				System.out.println("\n-Target passed: "+a.toString());
			}			
		}
	}
	
	/** Ale 16-4-9
	 * Functions that creates the groups of the model.
	 * @param model: the model requested.
	 * @param vGroup: string from the DB about the groups.
	 * @return
	 */
	private FRAMModel insertDataGroup(FRAMModel model, Vector<String[]> vGroup){
		//Function table's fields: id, name, description, x, y, color, type, idModel
		for(int i=0; i<vGroup.size(); i++)
		{
			String[] record_function = vGroup.elementAt(i);
			int g_id=Integer.parseInt(record_function[0]);
			String name = record_function[1];
			String description = record_function[2];
			int x = Integer.parseInt(record_function[3]);
			int y = Integer.parseInt(record_function[4]);
			String color = record_function[5];
			int modelId = Integer.parseInt(record_function[6]);
			/* The id in the graph. There is an id for each function. From the moment that a group is treated like a function we have to 
			 * count also the number of functions.
			*/
			int nodeId = i + model.getFunctions().size();			
			Group group = new Group(g_id, name, description, x, y, color, modelId, nodeId);

			insertDataGroupFunctions(model, group);
			model.addGroup(group);
			//					System.out.println("\n-Function passed: "+function.toString());		
		}	
		return model;
	}
	
	/** Ale
	 * Retrieves the functions of the group selected.
	 * @param model: the model requested from the client
	 * @param group: the group in the model, of which we want the functions.
	 */
	private void insertDataGroupFunctions(FRAMModel model, Group group){
		//function_aspect fields: isFunction, idAspect, type.
		Vector<String[]> vGroup_Functions = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM framgroup_function WHERE idGroup="+group.getId()+" ;" );//Only one for this.
		for(int j=0; j < vGroup_Functions.size(); j++){
			if(vGroup_Functions.size() > 0){
				String[] record_function = vGroup_Functions.elementAt(j);
				int f_id=Integer.parseInt(record_function[1]);
				//Searches for the function_NodeId relatives to f_id.
				Function F = model.getFunction(f_id);
				if(F != null){
					int F_NodeId = F.getNodeid();
					group.addFunction(F_NodeId);
				}
			}			
		}
	}
	
	/**Ale 
	 * Retrieves the hierarchy for the FRAMModel provided.
	 * @param model: FRAMModel to search the group hierarchy.
	 */
	private void insertGroupHierarchy(FRAMModel model){
		for( int i=0; i < model.getGroups().size(); i++){
			Group currentG = model.getGroups().get(i);
			Vector<String[]> vGroup_Hierarchy = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM framgroup_hierarchy WHERE idGroup_father="+currentG.getId()+" ;" );//Only one for this.
			for(int j=0; j < vGroup_Hierarchy.size(); j++){
				
				String[] record_function = vGroup_Hierarchy.elementAt(j);
				int g_child_id=Integer.parseInt(record_function[1]);
				//Searches for the group_NodeId relatives to g_child_id.
				Group G = model.getGroup(g_child_id);
				if(G != null){
					int G_NodeId = G.getNodeid();
					currentG.addFunction(G_NodeId);
				}
							
			}
		}
	}

	/**Ale
	 * Save the groups relation
	 */
	public void saveGroupHierarchy(int Gf_id, int Gc_id) {
		//Ale: 2 fields table model: (0)idGroup, (1)idFunction
		String query_group_hierarchy_insert = "INSERT INTO framgroup_hierarchy (idGroup_father, idGroup_child) VALUES "
				+ "('"+Gf_id+"','"+Gc_id+"');";		
		System.out.println("\n "+query_group_hierarchy_insert);
		MySQLDBManager.getInstance().update( query_group_hierarchy_insert );		
	}
	
	// ------------------------------------------------------------------------------------------------------------------------------------------------------------
	
}
