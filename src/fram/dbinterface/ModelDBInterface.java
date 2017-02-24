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

import fram.model.Aspect;
import fram.model.FRAMModel;
import fram.model.Function;
import fram.model.FunctionAspect;
import fram.model.Group;
import fram.model.Model;
import fram.modelinstance.FRAMModelInstance;
import fram.modelinstance.FunctionInstance;

import java.sql.Timestamp;
import java.util.Vector;

public interface ModelDBInterface {

	public int getFreeId(String table);
	public boolean isModelSavedOnDB(int modelId);
	public boolean hasModelInstanceOnDB(int modelId);
//	public boolean isFRAMModelInstanceSavedOnDB(int modelId);
	public boolean isFunctionSavedOnDB(int functionId);
//	public boolean isFunctionInstanceSavedOnDB(int modeId, int functionId);
	public boolean isAspectSavedOnDB(int aspectId);
	public boolean isFunctionAspectSavedOnDB(FunctionAspect fa);
	public void saveFRAMModel(FRAMModel model);
//	public void saveFRAMModelInstance(FRAMModelInstance model);
	public void saveFunction(Function function);
	public void saveGroup(Group group);
//	public void saveFunctionInstance(FunctionInstance function);
	public void saveAspect(Aspect aspect);
	public void saveFunctionAspect(FunctionAspect fa);
	public void saveModel(Model model);
	public void saveModelInfo(Model model);
	public void saveFunctionInfo(Function function);
	public void saveFRAMModelInfo(FRAMModel model);
	public void deleteModel(int modelId);
//	public void deleteFRAMModelInstance(int modelId);
	public void deleteFunction(int functionId);
	public void deleteFunctionInstance(int modelId, int functionId);
	public void deleteFRAMModelFunctions(int modelId);
	public void deleteFRAMModelAspects(int modelId);
	public void deleteAspect(int aspectId);
	public void deleteFunctionAspect(FunctionAspect fa);
	public Vector<String[]> retrieveListModels();
	public Model loadModel(int idModel);
	public FRAMModel loadFRAMModel(int idModel);
	
	public Timestamp getFRAMModelCreateTime(int idModel);
	void saveGroupFunction(int G_id, int F_id);
	void saveGroupHierarchy(int G_id, int F_id);
	public void saveGroupInfo(Group g);
	public void deleteGroup(int id);
	public void deleteGroupFunction(int id);
	public void deleteGroupHierarchy(int id);
	
}
