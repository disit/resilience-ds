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

import fram.modelinstance.CriteriaInstance;
import fram.modelinstance.FRAMModelInstance;
import fram.modelinstance.FunctionInstance;
import fram.modelinstance.ItalianFlag;
import fram.modelinstance.ModelInstance;

public interface ModelInstanceDBInterface {

	public int getFreeId(String table);
	public boolean isModelInstanceSavedOnDB(int modelInstanceId);
	public boolean isFRAMModelInstanceSavedOnDB(int modelInstanceId);
	public boolean isFunctionInstanceSavedOnDB(int modeId, int functionId);
	public void saveModelInstance(ModelInstance model_instance);
	public void saveFRAMModelInstance(FRAMModelInstance model_instance);
	public void saveModelInstanceInfo(ModelInstance model_instance);
	public void saveFRAMModelInstanceInfo(FRAMModelInstance model_instance);
	public void saveModelInstanceInfoCriteria(CriteriaInstance criteria_instance, int modelId, int modelInstanceId);
	public void changeStatusModelInstance(int modelInstanceId, Timestamp start_exec, Timestamp end_exec, int status);
	public void changeStatusLogicFunctionsModelInstance(int modelInstanceId, int status);
	public void changeStatusLogicFunction(String querySPARQL, int status);
	public void changeStatusLogicFunctionManager(String position, int modelInstanceId, int status);
	public int getStatusModelInstance(int modelInstanceId);
	public void setResultLogicFunction(String querySPARQL, double result);
	public void setIFCalculated(String position_criteria, int modelInstanceId, ItalianFlag IF);
	public void setIFInsert(String position_criteria, int modelInstanceId, ItalianFlag IF);
	public void deleteIFCalculated(String position_criteria, int modelInstanceId);
	public void deleteIFCalculatedBeforeInstanceExecution(int modelInstanceId);
	public void deleteFRAMModelInstance(int modelInstanceId);
	public void deleteModelInstance(int modelInstanceId);
	public void deleteModelInstances(int modelId);
	public void deleteFunctionInstance(int modelId, int functionId);
	public Vector<String[]> retrieveListModelInstances();
	public Vector<String[]> retrieveListModelInstancesByModelId(int modelId);
	public ModelInstance loadModelInstance(int modelInstanceId);
	public FRAMModelInstance loadFRAMModelInstance(int modelInstanceId);
	public void saveFunctionInstance(FunctionInstance function);
	
}
