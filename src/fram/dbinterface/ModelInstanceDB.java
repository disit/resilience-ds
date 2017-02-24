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

import fram.model.FRAMModel;
import fram.model.Function;
import fram.model.Model;
import fram.model.ModelStore;
import fram.modelinstance.CriteriaInstance;
import fram.modelinstance.FRAMModelInstance;
import fram.modelinstance.FunctionInstance;
import fram.modelinstance.ItalianFlag;
import fram.modelinstance.LogicFunction;
import fram.modelinstance.LogicFunctionManager;
import fram.modelinstance.ModelInstance;
import fram.modelinstance.ModelInstanceStore;
import fram.util.Convert;

public class ModelInstanceDB implements ModelInstanceDBInterface {

	@Override
	public int getFreeId(String table) {
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
	public boolean isModelInstanceSavedOnDB(int modelInstanceId) {
		boolean found = false;
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM model_instance WHERE id='"+modelInstanceId+"';" );
		if(v.size() != 0)
			found = true;
		return found;
	}
	

	private int firstIndexCriteriaInstance(int modelInstanceId){
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT id FROM criteria_instance WHERE idModelInstance='"+modelInstanceId+"';" );
		String[] index_criteria = v.elementAt(0);
		return Integer.parseInt(index_criteria[0]);
	}
	
	
	// --------------------------------------------------------- Save Info Model Instance on DB ----------------------------------------------------------
	//XXX OLD	
	@Override
	public void saveModelInstanceInfo(ModelInstance model_instance) {
		
		String query_modify_model_instance = "UPDATE model_instance SET model_instance.objective='"+model_instance.getSpecificObjective()+"'"
				+ " WHERE id='"+model_instance.getMIId()+"'";
		
		MySQLDBManager.getInstance().update(query_modify_model_instance);	
	}
	@Override
	public void saveFRAMModelInstanceInfo(FRAMModelInstance model_instance) {

		String query_modify_model_instance = "UPDATE model_instance SET model_instance.description='"+model_instance.getDescriptionInstance()+"'"
												+ ", model_instance.date_last_modify='"+model_instance.getDateLastModifyInstance()+"' WHERE id='"+model_instance.getMIId()+"'";
		
		MySQLDBManager.getInstance().update(query_modify_model_instance);	
	}
	
	@Override
	public void saveModelInstanceInfoCriteria(CriteriaInstance criteria_instance, int modelId, int modelInstanceId) {

		int criteriaId = this.getCriteriaIdFromCriteriaInstance(criteria_instance.getPosition(), modelId);
		
		String query_modify_criteria_instance = "UPDATE criteria_instance SET comment='" + criteria_instance.getComment() + "',"
											+ "url_discussion='"+criteria_instance.getUrl()+"'"
										  + "WHERE idModelInstance='"+modelInstanceId+"' AND idCriteria='"+criteriaId+"'";
		
		if(!MySQLDBManager.getInstance().update(query_modify_criteria_instance))
			System.out.println("Salvataggio non effettuato!");
	}
	// ---------------------------------------------------------------------------------------------------------------------------------------------
	
	
	// --------------------------------------------------------- Save ModelInstance on DB ----------------------------------------------------------	
	// --------------------------------------------------------- Save FRAMModelInstance on DB ----------------------------------------------------------	
	@Override
	/** Ale
	 * Adds an instance in the DB. If the istance passed is already in, deletes the old and saves the new one.
	 */
	public void saveFRAMModelInstance(FRAMModelInstance model) {
		
//		String data_creation = model.getDateCreateInstance();
		String data_creation = model.getDateCreateInstance();
		if(isFRAMModelInstanceSavedOnDB(model.getMIId())){
			System.out.println("\n- Deleting Model instance: "+model.getMIId());
			//Saves first the creation data.
			FRAMModelInstance Instance_present = loadFRAMModelInstance(model.getMIId());
//			data_creation = Instance_present.getDateCreateInstance();
			
			deleteFRAMModelInstance(model.getMIId());
		}

		System.out.println("\nQuery FIELDS: "+model.getMIId()+" - "+model.getDescriptionInstance()+" - "+model.getUserInstanceId()
				+" - "+model.getId()+" - "+model.getDateCreateInstance()+" - "+model.getDateLastModifyInstance());
		//6 campi tabella model: (0)id, (1)description, (2)idUser, (3)idModel, (4)date_create, (5)date_last_modify
		String query_model_insert = "INSERT INTO model_instance (id, description, idUser, idModel, date_create, date_last_modify) VALUES "
				+ "('"+model.getMIId()+"','"+model.getDescriptionInstance().replace("'", "\\'")
				+"','"+model.getUserInstanceId()+"','"+model.getId()+"',"
				+ "'"+data_creation+"','"+model.getDateLastModifyInstance()
				+"');";
		System.out.println("\nQuery executed: "+query_model_insert);
		MySQLDBManager.getInstance().update(query_model_insert);
		//			saveCriteriaModel(model.getRootCriteria(), model.getId());

	}
	
	@Override
	public void saveModelInstance(ModelInstance model_instance) {
		
		// Controllo per verificare se il modello è già stato salvato su DB altrimenti si effettua il salvataggio in questa fase
		ModelDBInterface mdbi = new ModelDB();
		if(!(mdbi.isModelSavedOnDB(model_instance.getId())))
			mdbi.saveModel(ModelStore.getInstance().getModelById(model_instance.getId()));
		
		// Controllo della presenza del ModelInstance su DB
		int criteria_inst_index = 0; 
		if(isModelInstanceSavedOnDB(model_instance.getMIId()))
		{	
			criteria_inst_index = firstIndexCriteriaInstance(model_instance.getMIId());
			deleteModelInstance(model_instance.getMIId());			
		}else
			criteria_inst_index = getFreeId("criteria_instance");
			
		
		String query_model_instance_insert = "INSERT INTO model_instance (id, objective, idUser, idModel, date_create, date_last_modify) VALUES "
									+ "('"+model_instance.getMIId()+"','"+model_instance.getSpecificObjective()+"',"
									+ "'"+model_instance.getUserInstanceId()+"','"+model_instance.getId()+"','"+model_instance.getTimestampCreateModelInstance()+"',"
									+ "'"+model_instance.getTimestampLastModifyModelInstance()+"');";
		
		MySQLDBManager.getInstance().update(query_model_instance_insert);
		saveCriteriaModelInstance(model_instance.getRootCriteriaInstance(), criteria_inst_index, model_instance.getMIId());
		
	}

	private int getCriteriaIdFromCriteriaInstance(String position, int modelId)
	{
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT id FROM criteria WHERE position='"+position+"' AND idModel='"+modelId+"';" );
		String[] record_criteria = v.elementAt(0);		
		return Integer.parseInt(record_criteria[0]);
	}
	
	
	// ------------------------------- Prepare statements for insert criteria instance and all of its data on db -----------------------------------------------
	private String prepareStatementCriteriaInstanceInsert(int idCriteriaInstance, String url, String comment, String weights, int idMatrixComp, 
								int idIfInsert, int idIfCalculated, int idFunctionManager, int idCriteria, int modelInstanceId)
	{
//		Campi tabella criteria_instance: (0)id, (1)url_discussion, (2)comment, (3)weights, (4)idMatrixComp, (5)idIfInsert, (6)idIfCalculated
//	     (7)idFunctionManager, (8)idCriteria, (9)idModelInstance
		return "INSERT INTO criteria_instance (id, url_discussion, comment, weights, idMatrixComp, idIfInsert, idIfCalculated, "
				+ "idFunctionManager, idCriteria, idModelInstance) VALUES ('"+idCriteriaInstance+"','"+url+"','"+comment+"','"+weights+"',"
				+ "'"+idMatrixComp+"','"+idIfInsert+"','"+idIfCalculated+"', '"+idFunctionManager+"', '"+idCriteria+"', '"+modelInstanceId+"');";
	}
	
	private String prepareStatementMatrixCompInsert(int idMatrixComp, String matrix, int idCriteriaInstance){
		return "INSERT INTO matrix_comparison (id, value, idCriteriaInstance) VALUES ('"+
				idMatrixComp+"', '"+matrix+"','"+idCriteriaInstance+"');";
	}

	private String prepareStatementIFInsert(int idIF, double green, double white, double red, int idCriteriaInstance){
		return "INSERT INTO italian_flag_insert (id, green, white, red, idCriteriaInstance) VALUES ('"+idIF+"', '"+green+"', '"+white+"', '"+red+"','"+idCriteriaInstance+"');";
	}
	
	private String prepareStatementIFCalculated(int idIF, double green, double white, double red, int idCriteriaInstance){
		return "INSERT INTO italian_flag_calculated (id, green, white, red, idCriteriaInstance) VALUES ('"+idIF+"', '"+green+"', '"+white+"', '"+red+"','"+idCriteriaInstance+"');";
	}
	
	private String prepareStatementLogicFunctionManager(int idFunctionManager, int notFunction1, int idFunction1, int logicConnector, int notFunction2, int idFunction2,
			String typeIF1, double value_true1, double value_false1, String typeIF2, 
			double value_true2, double value_false2, int status, String repository, int idCriteriaInstance){
		return "INSERT INTO logic_function_manager (id, notFunction1, idFunction1, logicConnector, notFunction2, idFunction2, typeIF1, value_true1, value_false1, "
				+ "typeIF2, value_true2, value_false2, status, sparql_repository, idCriteriaInstance) VALUES ('"+idFunctionManager+"', '"+notFunction1+"', '"+idFunction1+"', "
				+ "'"+logicConnector+"','"+notFunction2+"','"+idFunction2+"', '"+typeIF1+"', '"+value_true1+"', '"+value_false1+"',"
				+ "'"+typeIF2+"', '"+value_true2+"', '"+value_false2+"', '"+status+"','"+repository+"','"+idCriteriaInstance+"');";
	}
	
	private String prepareStatementLogicFunction(int idFunction, String query, int compare, double threshold1, double threshold2, double result, 
													int status, int idFunctionManager){
		return "INSERT INTO logic_function (id, query, compare, threshold1, threshold2, result, status, idFunctionManager) VALUES ("
				+ "'"+idFunction+"', '"+query+"', '"+compare+"', '"+threshold1+"','"+threshold2+"','"+result+"','"+status+"', '"+idFunctionManager+"');";
	}
	// --------------------------------------------------------------------------------------------------------------------------------------------------------
	@Override
	public boolean isFRAMModelInstanceSavedOnDB(int modelId) {
		boolean found = false;
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM model_instance WHERE id='"+modelId+"';" );
		if(v.size() != 0)
			found = true;
		return found;
	}
	
	private void saveCriteriaModelInstance(CriteriaInstance criteria_inst, int criteria_inst_index, int modelInstanceId)
	{
		//Order for insert in db tables: criteria_instance -> logic_function_manager -> logic_function
		
//		Campi tabella criteria_instance: (0)id, (1)url_discussion, (2)comment, (3)weights, (4)idMatrixComp, (5)idIfInsert, (6)idIfCalculated
//	     (7)idFunctionManager, (8)idCriteria, (9)idModelInstance
		
//		Campi tabella logic_function_manager: (0)id, (1)notFunction1, (2)idFunction1, (3)logicConnector, (4)notFunction2, (5)idFunction2,
//		  (6)typeIF1, (7)value_true1, (8)value_false1, (9)typeIF2, (10)value_true2, (11)value_false2, (12)status, (13)sparql_repository, (13)idCriteriaInstance
		
//		Campi tabella logic_function: (0)id, (1)query, (2)compare, (3)threshold1, (4)threshold2, (5)result, (6)status, (7)idFunctionManager
		
		int idCriteriaInstance;
		if(criteria_inst_index == 0)
			idCriteriaInstance = getFreeId("criteria_instance");
		else
		{	
			idCriteriaInstance = criteria_inst_index;
			criteria_inst_index = 0;
		}	
		
		int idCriteria = getCriteriaIdFromCriteriaInstance(criteria_inst.getPosition(), criteria_inst.getModelId());
		boolean insert_criteria_instance_ok = true;
		String weights = "0";
		int idMatrixComp = 0;
		int idIfInsert = 0;
		int idIfCalculated = 0;
		int idFunctionManager = 0;
		int idFunction1 = 0;
		int idFunction2 = 0;
		
		if(criteria_inst.getMatrixComp() != null) //Insert matrix without insert vector of weights because they are automatic calculated
			idMatrixComp = getFreeId("matrix_comparison");
		
		else //Insert vector of weights directly
		{
			if(criteria_inst.getWeightsSerialized() != null)
				weights = criteria_inst.getWeightsSerialized();
		}	
		
		if(criteria_inst.getIFInsert() != null)
			idIfInsert = getFreeId("italian_flag_insert");
		
		if(criteria_inst.getIFCalculated() != null)	
			idIfCalculated = getFreeId("italian_flag_calculated");

		
		if(criteria_inst.getFunctionManager() != null)
		{	
			idFunctionManager = getFreeId("logic_function_manager");
			
			if(criteria_inst.getFunctionManager().getFunction1() != null)
				idFunction1 = getFreeId("logic_function");
			
			if(criteria_inst.getFunctionManager().getFunction2() != null)
				idFunction2 = idFunction1 + 1;
		}
		
		String query_criteriainstance_insert = prepareStatementCriteriaInstanceInsert(idCriteriaInstance, criteria_inst.getUrl(), criteria_inst.getComment(), 
												weights, idMatrixComp, idIfInsert, idIfCalculated, idFunctionManager, idCriteria, modelInstanceId);
		
		if(!MySQLDBManager.getInstance().update(query_criteriainstance_insert))
		{
			insert_criteria_instance_ok = false;
			System.out.println("Errore inserimento criteria instance su DB: criteria_instance="+criteria_inst.getPosition()+"\tmodelInstance="+modelInstanceId);
		}
	
		if(insert_criteria_instance_ok)
		{	
			if(idMatrixComp != 0)
			{
				if(!MySQLDBManager.getInstance().update(prepareStatementMatrixCompInsert(idMatrixComp, criteria_inst.getMatrixSerialized(), idCriteriaInstance)))
					System.out.println("Errore inserimento matrice dei confronti a coppie per il criteria_instance="+criteria_inst.getPosition());
			}
			
			if(idIfInsert != 0)
			{
				if(!MySQLDBManager.getInstance().update(prepareStatementIFInsert(idIfInsert, criteria_inst.getIFInsert().getGreen(), criteria_inst.getIFInsert().getWhite(), 
																		criteria_inst.getIFInsert().getRed(), idCriteriaInstance)))
					System.out.println("Errore inserimento if_insert per il criteria_instance="+criteria_inst.getPosition());
			}
			
			if(idIfCalculated != 0)
			{
				if(!MySQLDBManager.getInstance().update(prepareStatementIFCalculated(idIfCalculated, criteria_inst.getIFCalculated().getGreen(), 
															criteria_inst.getIFCalculated().getWhite(), criteria_inst.getIFCalculated().getRed(), idCriteriaInstance)))
					System.out.println("Errore inserimento if_calculated per il criteria_instance="+criteria_inst.getPosition());
			}
			
			if(idFunctionManager != 0)
			{
				LogicFunctionManager lfm = criteria_inst.getFunctionManager();
				if(!MySQLDBManager.getInstance().update(prepareStatementLogicFunctionManager(idFunctionManager, lfm.getNotFunction1(), idFunction1, lfm.getLogicConnector(), 
						lfm.getNotFunction2(), idFunction2, lfm.getTypeIF1(), lfm.getValueTrue1(), lfm.getValueFalse1(), lfm.getTypeIF2(), lfm.getValueTrue2(), 
						lfm.getValueFalse2(),lfm.getStatus(), lfm.getSPARQLRepository(), idCriteriaInstance)))
					System.out.println("Errore inserimento logic_function_manager1 per il criteria_instance="+criteria_inst.getPosition());

				if(!MySQLDBManager.getInstance().update(prepareStatementLogicFunction(idFunction1, lfm.getFunction1().getQuery(), 
						lfm.getFunction1().getCompare(), lfm.getFunction1().getThreshold1(), lfm.getFunction1().getThreshold2(), lfm.getFunction1().getResult(),
						lfm.getFunction1().getStatus(), idFunctionManager)))
					System.out.println("Errore inserimento logic_function1 per il criteria_instance="+criteria_inst.getPosition());
				if(idFunction2 != 0)
				{	
					if(!MySQLDBManager.getInstance().update(prepareStatementLogicFunction(idFunction2, lfm.getFunction2().getQuery(), 
							lfm.getFunction2().getCompare(), lfm.getFunction2().getThreshold1(), lfm.getFunction2().getThreshold2(), lfm.getFunction2().getResult(),
							lfm.getFunction2().getStatus(), idFunctionManager)))
						System.out.println("Errore inserimento logic_function2 per il criteria_instance="+criteria_inst.getPosition());
				}
			}	
		}	

		for(int i=0; i < criteria_inst.getNumChildrenInstance(); i++)
			saveCriteriaModelInstance(criteria_inst.getChildInstance(i), criteria_inst_index, modelInstanceId);
	}
	// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	
	
	@Override
	public int getStatusModelInstance(int modelInstanceId){
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT status FROM model_instance WHERE id='"+modelInstanceId+"';" );
		String[] record_model_instance = v.elementAt(0);
		return Integer.parseInt(record_model_instance[0]);	
	}
	
	@Override
	public void changeStatusModelInstance(int modelInstanceId, Timestamp start_exec, Timestamp end_exec, int status){
		
		String query_modify_model_instance_exec = "";
		if(status == 3)
			query_modify_model_instance_exec = "UPDATE model_instance SET model_instance.status='"+status+"' WHERE id='"+modelInstanceId+"'";
		if(end_exec == null && status != 3)
			query_modify_model_instance_exec = "UPDATE model_instance SET model_instance.status='"+status+"', model_instance.start_exec='"+start_exec+"' "
					+" WHERE id='"+modelInstanceId+"'";
		else if(start_exec == null  && status != 3)
			query_modify_model_instance_exec = "UPDATE model_instance SET model_instance.status='"+status+"', "
				+ "model_instance.end_exec='"+end_exec+"' WHERE id='"+modelInstanceId+"'";

		MySQLDBManager.getInstance().update(query_modify_model_instance_exec);	
	}
	
	

	@Override
	public void changeStatusLogicFunctionsModelInstance(int modelInstanceId, int status){
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT id FROM criteria_instance WHERE idModelInstance='"+modelInstanceId+"';" );
		for(int i=0; i < v.size(); i++)
		{
			int criteriaInstanceId = Integer.parseInt(v.elementAt(i)[0]);
			MySQLDBManager.getInstance().update("UPDATE logic_function_manager SET logic_function_manager.status='"+status+"' WHERE idCriteriaInstance='"+criteriaInstanceId+"';");
			Vector<String[]> vlfm = MySQLDBManager.getInstance().executeQuery( "SELECT idFunction1, idFunction2 FROM logic_function_manager WHERE idCriteriaInstance='"+criteriaInstanceId+"';" );
			if(vlfm.size() != 0)
			{	
				int function1Id = Integer.parseInt(vlfm.elementAt(0)[0]);
				int function2Id = Integer.parseInt(vlfm.elementAt(0)[1]);
				if(function1Id != 0)
					MySQLDBManager.getInstance().update("UPDATE logic_function SET logic_function.status='"+status+"' WHERE id='"+function1Id+"';");
				if(function2Id != 0)
					MySQLDBManager.getInstance().update("UPDATE logic_function SET logic_function.status='"+status+"' WHERE id='"+function2Id+"';");
			}
		}
	}
	
	@Override
	public void changeStatusLogicFunction(String querySPARQL, int status){
		MySQLDBManager.getInstance().update("UPDATE logic_function SET logic_function.status='"+status+"' WHERE logic_function.query='"+querySPARQL+"';");
	}

	
	
	
	@Override
	public void changeStatusLogicFunctionManager(String position, int modelInstanceId, int status){
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT criteria_instance.id FROM criteria_instance INNER JOIN criteria "
				+ "ON criteria_instance.idCriteria = criteria.id WHERE criteria.position='"+position+"' AND criteria_instance.idModelInstance='"+modelInstanceId+"';" );
		
		int criteriaInstanceId = Integer.parseInt(v.elementAt(0)[0]);
		MySQLDBManager.getInstance().update("UPDATE logic_function_manager SET logic_function_manager.status='"+status+"' WHERE idCriteriaInstance='"+criteriaInstanceId+"'");
	}

	
	@Override
	public void setResultLogicFunction(String querySPARQL, double result){
		String result_query_insert = "UPDATE logic_function SET logic_function.result='"+result+"' WHERE query='"+querySPARQL+"'";
		MySQLDBManager.getInstance().update(result_query_insert);
	}
	
	
	@Override
	public void setIFInsert(String position_criteria, int modelInstanceId, ItalianFlag IF){

		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT criteria_instance.id FROM criteria_instance INNER JOIN criteria "
								+ "ON criteria_instance.idCriteria = criteria.id WHERE criteria.position='"+position_criteria+"' AND criteria_instance.idModelInstance='"+modelInstanceId+"';" );

		int criteriaInstanceId = Integer.parseInt(v.elementAt(0)[0]);
		
		int idIF = getFreeId("italian_flag_insert");
		String if_insert = "INSERT INTO italian_flag_insert (id, green, white, red, idCriteriaInstance) VALUES ("
							+ "'"+idIF+"', '"+IF.getGreen()+"', '"+IF.getWhite()+"', '"+IF.getRed()+"','"+criteriaInstanceId+"')";
		MySQLDBManager.getInstance().update(if_insert);
		MySQLDBManager.getInstance().update("UPDATE criteria_instance SET idIfInsert='"+idIF+"' WHERE id='"+criteriaInstanceId+"';");
	}
	
	
	@Override
	public void setIFCalculated(String position_criteria, int modelInstanceId, ItalianFlag IF){

		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT criteria_instance.id FROM criteria_instance INNER JOIN criteria "
								+ "ON criteria_instance.idCriteria = criteria.id WHERE criteria.position='"+position_criteria+"' AND criteria_instance.idModelInstance='"+modelInstanceId+"';" );

		int criteriaInstanceId = Integer.parseInt(v.elementAt(0)[0]);
		
		int idIF = getFreeId("italian_flag_calculated");
		String if_insert = "INSERT INTO italian_flag_calculated (id, green, white, red, idCriteriaInstance) VALUES ("
							+ "'"+idIF+"', '"+IF.getGreen()+"', '"+IF.getWhite()+"', '"+IF.getRed()+"','"+criteriaInstanceId+"')";
		MySQLDBManager.getInstance().update(if_insert);
		MySQLDBManager.getInstance().update("UPDATE criteria_instance SET idIfCalculated='"+idIF+"' WHERE id='"+criteriaInstanceId+"';");
	}
	
	
	@Override
	public void deleteIFCalculated(String position_criteria, int modelInstanceId){
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT criteria_instance.id, criteria_instance.idIfCalculated FROM criteria_instance INNER JOIN criteria "
				+ "ON criteria_instance.idCriteria = criteria.id WHERE criteria.position='"+position_criteria+"' AND criteria_instance.idModelInstance='"+modelInstanceId+"';" );
		String[] record_criteria_instance = v.elementAt(0);
		int criteriaInstanceId = Integer.parseInt(record_criteria_instance[0]);
		int ifCalculatedId = Integer.parseInt(record_criteria_instance[1]);  // it's always different from 0

		MySQLDBManager.getInstance().update("DELETE FROM italian_flag_calculated WHERE id='"+ifCalculatedId+"' AND idCriteriaInstance='"+criteriaInstanceId+"';");
		MySQLDBManager.getInstance().update("UPDATE criteria_instance SET idIfCalculated='0' WHERE id='"+criteriaInstanceId+"';");
	}
	
	@Override
	public void deleteIFCalculatedBeforeInstanceExecution(int modelInstanceId){
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT id, idIfCalculated FROM criteria_instance WHERE idModelInstance='"+modelInstanceId+"' AND idIfCalculated <> 0;" );

		for(int i=0; i<v.size(); i++)
		{
			int criteriaInstanceId = Integer.parseInt(v.elementAt(i)[0]);
			int ifCalculatedId = Integer.parseInt(v.elementAt(i)[1]);	
			MySQLDBManager.getInstance().update("DELETE FROM italian_flag_calculated WHERE id='"+ifCalculatedId+"';");
			MySQLDBManager.getInstance().update("UPDATE criteria_instance SET idIfCalculated='0' WHERE id='"+criteriaInstanceId+"';");
		}
	}
	
	
	// --------------------------------------------------------- Delete Model Instance on DB -----------------------------------------------------------------------
	@Override
	public void deleteModelInstance(int modelInstanceId) {
		MySQLDBManager.getInstance().update("DELETE FROM model_instance WHERE id='"+modelInstanceId+"';");
	}
	@Override
	public void deleteFRAMModelInstance(int modelInstanceId) {
		MySQLDBManager.getInstance().update("DELETE FROM model_instance WHERE id='"+modelInstanceId+"';");
	}
	// --------------------------------------------------------- Save FRAM function instance on DB ----------------------------------------------------------	
	@Override
	public void saveFunctionInstance(FunctionInstance function) {

		if(isFunctionInstanceSavedOnDB(function.getM_ref().getId(),function.getId()))
			deleteFunctionInstance(function.getM_ref().getId(),function.getId());
		//XXX Test with function.getId() in place of function.getFref().getId();	
		//5 campi tabella model: (0)idInstance, (1)idFunction, (2)time_precision, (3)potential_precision, (4)function_manager
		String query_model_insert = "INSERT INTO model_function (idInstance, idFunction, time_precision, potential_precision, function_manager) VALUES "
				+ "('"+function.getM_ref().getMIId()+"','"+function.getId()+"','"+function.getTime_precision()+"','"+function.getPotential_precision()
				+"','"+function.getFunction_manager()+"');";
		System.out.println("\nQuery executed: "+query_model_insert);
		MySQLDBManager.getInstance().update(query_model_insert);
		//				saveCriteriaModel(model.getRootCriteria(), model.getId());

	}
	
	@Override
	public boolean isFunctionInstanceSavedOnDB(int modelId, int functionId) {
		boolean found = false;
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM model_function "
				+"WHERE idInstance='"+modelId+"' AND idFunction='"+functionId+"';" );
		if(v.size() != 0)
			found = true;
		return found;
	}
	
	@Override
	public void deleteFunctionInstance(int modelId, int functionId) {
//		deleteCriteriaModel(model.getId());
		String query_model_delete = "DELETE FROM model_function WHERE idInstance='"+modelId+"' AND idFunction='"+functionId+"';";
		MySQLDBManager.getInstance().update(query_model_delete);
	}
	// --------------------------------------------- Delete Model Instances on DB with a specific modelId ----------------------------------------------------------
	@Override
	public void deleteModelInstances(int modelId) {
		MySQLDBManager.getInstance().update("DELETE FROM model_instance WHERE idModel='"+modelId+"';");
	}
	// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	
	
	@Override
	public Vector<String[]> retrieveListModelInstances() {
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM model_instance;" );
		return v;
	}


	@Override
	public Vector<String[]> retrieveListModelInstancesByModelId(int modelId) {
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM model_instance WHERE idModel='"+modelId+"';" );
		return v;
	}
	
	
	
	// ---------------------------------- Metodo per recuperare una istanza di un modello su DB e caricarla sul server -------------------------------------------------------------
	@Override
	public ModelInstance loadModelInstance(int idModelInstance) 
	{
		Vector<String[]> vModelInstance = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM model_instance WHERE id="+idModelInstance+";" );
		Vector<String[]> vCriteriaInstance = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM criteria_instance WHERE idModelInstance="+idModelInstance+";" );
		
		ModelInstance model_inst = createModelInstanceOnServer(vModelInstance, vCriteriaInstance); 
		
		return model_inst;
	}
	//Ale: Loads from the DB the rows of the model_instance.
	@Override
	public FRAMModelInstance loadFRAMModelInstance(int idModelInstance) 
	{
		Vector<String[]> vModelInstance = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM model_instance WHERE id="+idModelInstance+";" );
		Vector<String[]> vFunctionInstance = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM model_function WHERE idInstance="+idModelInstance+";" );
		
		FRAMModelInstance model_inst = createFRAMModelInstanceOnServer(vModelInstance, vFunctionInstance); 
		
		return model_inst;
	}
	
	/*private int getModelIdFromModelInstanceId(int modelInstanceId)
	{
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT idModel FROM model_instance WHERE id='"+modelInstanceId+"';" );
		//Da verificare se il primo elemento è idModel e non idModelInstance ------>>>>>>>
		String[] record_model_inst = v.elementAt(0);		
		return Integer.parseInt(record_model_inst[0]);
	} */
	
	private ModelInstance createModelInstanceOnServer(Vector<String[]> vModelInstance, Vector<String[]> vCriteriaInstance)
	{
		String[] record_model_inst = vModelInstance.elementAt(0);
		int modelInstanceId = Integer.parseInt(record_model_inst[0]);
		String specific_objective = record_model_inst[1];
		int userId = Integer.parseInt(record_model_inst[2]);
		int modelId = Integer.parseInt(record_model_inst[3]);
		Timestamp date_create = Convert.getInstance().stringToTimestamp(record_model_inst[4]);
		Timestamp date_last_modify = Convert.getInstance().stringToTimestamp(record_model_inst[5]);
		int status = Integer.parseInt(record_model_inst[6]);
		
		Timestamp date_start_exec = null;
		if(record_model_inst[7] != null)
			date_start_exec = Convert.getInstance().stringToTimestamp(record_model_inst[7]);
		
		Timestamp date_end_exec = null;
		if(record_model_inst[8] != null)
			date_end_exec = Convert.getInstance().stringToTimestamp(record_model_inst[8]);
		
		Model model = null;
		if(ModelStore.getInstance().getModelById(modelId) == null)
		{
			ModelDBInterface mdbi = new ModelDB();
			model = mdbi.loadModel(modelId);
			ModelStore.getInstance().addModelLoadedFromDB(model);
		}else
			model = ModelStore.getInstance().getModelById(modelId);
		
		ModelInstance mi = new ModelInstance(modelInstanceId, specific_objective , userId, model);
		mi.specifyTimestampCreateModelInstance(date_create);
		mi.specifyTimestampLastModifyModelInstance(date_last_modify);
		mi.specifyTimestampStartExecModelInstance(date_start_exec);
		mi.specifyTimestampEndExecModelInstance(date_end_exec);
		mi.setStatus(status);
		ModelInstance modelUpdate = updateDataCriteria(mi, vCriteriaInstance);
		return modelUpdate;
	}
	//Ale: Creates the FRAM model instance on the server to pass at the client.
	private FRAMModelInstance createFRAMModelInstanceOnServer(Vector<String[]> vModelInstance, Vector<String[]> vFunctionInstance)
	{
		/*
		 * Ale: File's content:
		 * vModelInstance: 0 id - 1 description - 2 idUser - 3 idModel - 4 date_create - 5 date_last_modify
		 * vFunctionInsance: 0 idInstance - 1 idFunction - 2 time_precision - 3 potential_precision - 4 function_manager
		 */
		String[] record_model_inst = vModelInstance.elementAt(0);
		int modelInstanceId = Integer.parseInt(record_model_inst[0]);
		String instance_description = record_model_inst[1];
		int userId = Integer.parseInt(record_model_inst[2]);
		int modelId = Integer.parseInt(record_model_inst[3]);
		Timestamp date_create = Convert.getInstance().stringToTimestamp(record_model_inst[4]);
		Timestamp date_last_modify = Convert.getInstance().stringToTimestamp(record_model_inst[5]);
		
		FRAMModel model = null;
		if(ModelStore.getInstance().getModelById(modelId) == null)
		{
			System.out.println("\n-Model for instance loaded from the DB");
			ModelDBInterface mdbi = new ModelDB();
			model = mdbi.loadFRAMModel(modelId);
			ModelStore.getInstance().addFRAMModelLoadedFromDB(model);
		}
		else{
			System.out.println("\n-Model for instance loaded from the store");
			model = ModelStore.getInstance().getFRAMModelById(modelId);
		}
		//Ale: Creates the model instance specifications.
		FRAMModelInstance fmi = new FRAMModelInstance(modelInstanceId, instance_description , userId, model);
//		mi.specifyTimestampCreateModelInstance(date_create);
//		mi.specifyTimestampLastModifyModelInstance(date_last_modify);
		updateDataFunction(fmi, vFunctionInstance, model);
		//Adds the tmp modelInstance 
//		ModelInstanceStore.getInstance().deleteFRAMTemporaryStore();
		ModelInstanceStore.getInstance().addFRAMModelInstance(fmi);
		
		return fmi;
	}
	
	private String retrieveMatrixComp(int idMatrixComp)
	{
		// Campi tabella matrix_comparison: id, value, idCriteriaInstance
		Vector<String[]> vMatrix = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM matrix_comparison WHERE id="+idMatrixComp+";" );
		String[] record_matrix = vMatrix.elementAt(0);
		return record_matrix[1];
	}
	
	private String retrieveIFInsert(int idIF)
	{
		Vector<String[]> vIF = MySQLDBManager.getInstance().executeQuery( "SELECT green,white,red FROM italian_flag_insert WHERE id="+idIF+";" );
		String[] record_if = vIF.elementAt(0);
		return record_if[0]+","+record_if[1]+","+record_if[2];
	}
	
	private String retrieveIFCalculated(int idIF)
	{
		Vector<String[]> vIF = MySQLDBManager.getInstance().executeQuery( "SELECT green,white,red FROM italian_flag_calculated WHERE id="+idIF+";" );
		String[] record_if = vIF.elementAt(0);
		return record_if[0]+","+record_if[1]+","+record_if[2];
	}
	
	private String getPositionFromCriteriaId(int criteriaId)
	{
		Vector<String[]> vMatrix = MySQLDBManager.getInstance().executeQuery( "SELECT position FROM criteria WHERE id="+criteriaId+";" );
		String[] record_matrix = vMatrix.elementAt(0);
		return record_matrix[0];
	}
	
	
	private ModelInstance updateDataCriteria(ModelInstance model_inst, Vector<String[]> vCriteriaInstance)
	{
//		Campi tabella criteria_instance: (0)id, (1)url_discussion, (2)comment, (3)weights, (4)idMatrixComp, (5)idIfInsert, (6)idIfCalculated
//	     								 (7)idFunctionManager, (8)idCriteriaInstance, (9)idModelInstance
		for(int i=0; i<vCriteriaInstance.size(); i++)
		{
			String[] record_criteria_instance = vCriteriaInstance.elementAt(i);
			int idMatrixComp = Integer.parseInt(record_criteria_instance[4]);
			
			int idIfInsert = Integer.parseInt(record_criteria_instance[5]);
			ItalianFlag IF_ins = null;
			if(idIfInsert != 0)
			{
				double[] if_insert = Convert.getInstance().splitStringToVectorDouble(retrieveIFInsert(idIfInsert));
				IF_ins = new ItalianFlag(if_insert[0], if_insert[1], if_insert[2]);
			}
			
			int idIfCalculated = Integer.parseInt(record_criteria_instance[6]);
			ItalianFlag IF_calc = null;
			if(idIfCalculated != 0)
			{
				double[] if_calculated = Convert.getInstance().splitStringToVectorDouble(retrieveIFCalculated(idIfCalculated));
				IF_calc = new ItalianFlag(if_calculated[0], if_calculated[1], if_calculated[2]);
			}
			
			int idFunctionManager = Integer.parseInt(record_criteria_instance[7]);
			
			LogicFunctionManager lfm = null;
			if(idFunctionManager != 0)
			{
//				Campi tabella logic_function_manager: (0)id, (1)notFunction1, (2)idFunction1, (3)logicConnector, (4)notFunction2, (5)idFunction2,
//				  (6)typeIF1, (7)value_true1, (8)value_false1, (9)typeIF2, (10)value_true2, (11)value_false2, (12)status, (13)sparql_repository (14)idCriteriaInstance
				
//				Campi tabella logic_function: (0)id, (1)query, (2)compare, (3)threshold1, (4)threshold2, (5)result, (6)status, (7)idFunctionManager
				Vector<String[]> vlfm = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM logic_function_manager WHERE id="
						+idFunctionManager+";" );
				
				String[] lfm_vect = vlfm.elementAt(0);
				
				Vector<String[]> vlf1 = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM logic_function WHERE id="+Integer.parseInt(lfm_vect[2])+";" );				
				Vector<String[]> vlf2 = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM logic_function WHERE id="+Integer.parseInt(lfm_vect[5])+";" );
				
				String[] lf1_vect = vlf1.elementAt(0);
				
				LogicFunction lf1 = new LogicFunction(lf1_vect[1], Integer.parseInt(lf1_vect[2]), Double.parseDouble(lf1_vect[3]), Double.parseDouble(lf1_vect[4]), 
						Double.parseDouble(lf1_vect[5]), Integer.parseInt(lf1_vect[6]));
				
				LogicFunction lf2 = null;
				if(vlf2.size() != 0)
				{
					String[] lf2_vect = vlf2.elementAt(0);
					lf2 = new LogicFunction(lf2_vect[1], Integer.parseInt(lf2_vect[2]), Double.parseDouble(lf2_vect[3]), Double.parseDouble(lf2_vect[4]),
							Double.parseDouble(lf2_vect[5]), Integer.parseInt(lf2_vect[6]));
				}	
				
				lfm = new LogicFunctionManager(Integer.parseInt(lfm_vect[1]), lf1, Integer.parseInt(lfm_vect[3]), Integer.parseInt(lfm_vect[4]), lf2, lfm_vect[6],
						Double.parseDouble(lfm_vect[7]), Double.parseDouble(lfm_vect[8]), lfm_vect[9], Double.parseDouble(lfm_vect[10]), Double.parseDouble(lfm_vect[11]),
						Integer.parseInt(lfm_vect[12]), lfm_vect[13]);
			}
			
			String matrixSerialized = "";
			if(idMatrixComp != 0)
				matrixSerialized = retrieveMatrixComp(idMatrixComp);
			
			String position = getPositionFromCriteriaId(Integer.parseInt(record_criteria_instance[8]));
			model_inst.updateCriteriaFromDB(position, record_criteria_instance[1], record_criteria_instance[2], record_criteria_instance[3], 
					matrixSerialized, IF_ins, IF_calc, lfm);
		}	
		return model_inst;
	}
	/** Ale
	 * Sets the variability parameters (TP, PP, FM) of the functions. 
	 */
	private void updateDataFunction(FRAMModelInstance model_inst, Vector<String[]> vFunctionInstance, FRAMModel model)
	{
/*
 * Ale: The third parameter is used only for search the Function for avoid duplication.
 * Ale: Table field: vFunctionInsance: 0 idInstance - 1 idFunction - 2 time_precision - 3 potential_precision - 4 function_manager
 */
//		System.out.println("\n- Update Functions");
		for(int i=0; i<vFunctionInstance.size(); i++)
		{
			String[] record_function_instance = vFunctionInstance.elementAt(i);
			int idF=Integer.parseInt(record_function_instance[1]);
			int Tprecision=Integer.parseInt(record_function_instance[2]);
			int Pprecision=Integer.parseInt(record_function_instance[3]);
			int FSupervisor=Integer.parseInt(record_function_instance[4]);
			
//			System.out.println("\n- Values- FM"+FSupervisor+" TP: "+Tprecision+" PP: "+Pprecision);
			//Ale: updates the function instance.
			model_inst.getFunctionInstance(idF).setFunctionVariables(FSupervisor, Tprecision, Pprecision);
			
//			Function f;
//			//Ale: Searches for the function modified.
//			f = model.getFunction(idF);
//			
//			if(f!=null){
//				FunctionInstance fi = new FunctionInstance(f, Tprecision, Pprecision, FSupervisor);
//				model_inst.addFunctionInstance(fi);
//			}
			
//			model_inst.updateFunctionFromDB(idF, Tprecision, Pprecision, FSupervisor);
		}
	}
	// ------------------------------------------------------------------------------------------------------------------------------------------------------------
}
