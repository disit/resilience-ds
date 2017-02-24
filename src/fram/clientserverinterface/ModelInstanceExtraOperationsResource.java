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
   

package fram.clientserverinterface;

import java.sql.Timestamp;
//import java.time.LocalDateTime;






import java.util.ArrayList;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.UriInfo;
import javax.xml.bind.JAXBElement;

import fram.dbinterface.ModelDB;
import fram.dbinterface.ModelDBInterface;
import fram.dbinterface.ModelInstanceDB;
import fram.dbinterface.ModelInstanceDBInterface;
import fram.dbinterface.MySQLDBManager;
import fram.model.Aspect;
import fram.model.AspectForClient;
import fram.model.FRAMModel;
import fram.model.Function;
import fram.model.FunctionAspect;
import fram.model.ModelStore;
import fram.modelinstance.CriteriaInstance;
import fram.modelinstance.FRAMModelInstance;
import fram.modelinstance.FunctionInstance;
import fram.modelinstance.ModelInstance;
import fram.modelinstance.ModelInstanceExtraOperation;
import fram.modelinstance.ModelInstanceStore;
import fram.util.Convert;
import fram.util.WriteXML;

@Path("/modelinstanceoperations")
public class ModelInstanceExtraOperationsResource {

	@Context UriInfo uriInfo;
	@Context ServletContext context;
	@Context Request request;
	@Context HttpServletRequest httpRequest;
	@Context HttpServletResponse httpResponse;
	
	@POST
	@Consumes(MediaType.APPLICATION_XML)
	@Produces(MediaType.APPLICATION_XML)
	public String postOperationFRAMXML(FRAMModelInstance model) throws Exception {
		System.out.println("\n-Save a new FRAM Instance");
		//First of all checks if the model is already loaded on the server. When the model is deleted, also delete the linked functions and the aspects. 
				
		return prepareNewFRAMModelInstancetoSave(model);
		
//		if(ModelStore.getInstance().getFRAMModelById(model.getId()) == null){
//			//Model not present. Creates it and saves in the local store.
//			System.out.println("Saves a new model. ");
//			return prepareNewFRAMModeltoSave(model);
//		}
//		else{
//			FRAMModel modelToUpdate=ModelStore.getInstance().getFRAMModelById(model.getId());
//			System.out.println("Saves and update the model. ");
////			return updateFRAMModelbeforeSave(modelToUpdate, model);
//		}		
	}
	
	/**Ale
	 * Updates the values of the instance of the model
	 * @param model
	 * @return
	 */
	private String prepareNewFRAMModelInstancetoSave(FRAMModelInstance model){
//		ModelDBInterface dbi = new ModelDB();		
		ModelInstanceDBInterface dbi = new ModelInstanceDB();
		ModelDBInterface db = new ModelDB();
		
		ArrayList<FunctionInstance> currentM_functioninstances =  model.getFunctionsInstances();
		
//		System.out.println("\n- Function : "+currentM_functions.size());
//		System.out.println("\n- Aspect: "+aspects_list.size());
//		System.out.println("\n- Function Instances: "+currentM_functioninstances.size());
//		System.out.println("\n- Function Instances: "+model.printFunctionInstance());
		
		model.specifyTimestampCreateModelInstance(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		model.specifyTimestampLastModifyModelInstance(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		model.specifyTimestampCreateModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		model.specifyTimestampLastModifyModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		model.setPriority_type("private");
		model.setUserInstanceId(model.getModelUserId()); //TOCHECK if it's the one passed.
		
		dbi.saveFRAMModelInstance(model); //Saves the instance.
		System.out.println("\n- Add Model instance: "+model.getMIId());
//		System.out.println("\n- Model Instance to string:"+model.toString());
		//Saves the functions' instances.
			
		ArrayList<FunctionInstance> currentM_functions =  model.getFunctionsInstances();
		
		FRAMModel base_model = db.loadFRAMModel(model.getId());
//		System.out.println(base_model.PrintAll());
//		System.out.println(model.printFunctionInstance());
		
		//Save the Function Instances.
		for(FunctionInstance F:currentM_functions){
//			System.out.println(F.toString());
//			F.setId(dbi.getFreeId("function"));//XXX modify. I don't like it. MAybe is good for the first save but not for the rest.
			F.setModelId(model.getId()); //XXX bypass the value provided.
			F.setM_ref(model);
			//TODO Takes the ID corresponding to the current function instance.
			Function FDB = base_model.getFunctionbyNodeid(F.getNodeid());//Gets the function by the nodeId associated.
			if(FDB!=null){
				System.out.println(FDB.toString());
				System.out.println("\n-"+FDB.getId()+" Corresponds to: "+FDB.getNodeid());
				F.setId(FDB.getId());
//			System.out.println("\n-FI to save: "+F.toString());
				dbi.saveFunctionInstance(F); //Saves functions.			
			}
			else{
				System.out.println("PROBLEM WITH SAVE INSTANCE - Function not find ");
			}
		}
		
//		ArrayList<FRAMModelInstance> model_list = ModelInstanceStore.getInstance().getFRAMModelInstances(model.getMIId(), 0);
//		FRAMModelInstance old_model = model_list.get(0);
////		System.out.println(old_model.toString());
//		ModelInstanceStore.getInstance().removeFRAMModelInstanceTmp(old_model); //Removes the model in cache.
//		ModelInstanceStore.getInstance().removeFRAMModelInstanceLoadedFromDB(old_model); //Removes the model in cache.
////		ModelStore.getInstance().addFRAMModelLoadedFromDB(model); //Saves the model in a session variable.
//		ModelInstanceStore.getInstance().addFRAMModelInstance(model); //Saves the model in a session variable.
		return "";
	}
	
	
	//XXX OLD
	public String postOperationXML(JAXBElement<ModelInstanceExtraOperation> jaxbOperation) throws Exception {
		
		ModelInstanceExtraOperation operation = jaxbOperation.getValue();
		String desc = operation.getDescription();
		
		System.out.println("- Request POST Operation Model Instance XML: "+uriInfo.getPath()+" - "+desc+"");
		ModelInstance model_instance = ModelInstanceStore.getInstance().getModelInstances(operation.getModelInstanceId(),0).get(0);
		int model_id_forclone = operation.getModelId();
		
		String response = new String();
		ModelInstanceDBInterface dbi = new ModelInstanceDB();
		
		if(desc.equals("printModelInstance"))
			model_instance.printModelInstance(model_instance.getRootCriteriaInstance());
		
		else if(desc.equals("saveModelInstance"))	
			dbi.saveModelInstance(model_instance);

		else if(desc.equals("cloneModelInstance"))
		{
			int modelInstanceId=0;
			if(ModelInstanceStore.getInstance().getNumModelInstancesTmp() == 0)
				modelInstanceId = dbi.getFreeId("model_instance");
			else
				modelInstanceId = ModelInstanceStore.getInstance().getMaxIdModelInstancesTmp()+1;
			
			ModelInstance model_instance_cloned = model_instance.cloneModelInstance(modelInstanceId, operation.getUserInstanceId(), ModelStore.getInstance().getModelById(model_id_forclone));

			model_instance_cloned.specifyTimestampCreateModelInstance(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
			model_instance_cloned.specifyTimestampLastModifyModelInstance(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
			
			ModelInstanceStore.getInstance().addModelInstance(model_instance_cloned);
			response = WriteXML.getInstance().writeModelInstance(model_instance_cloned);
		}
		else if(desc.equals("importDataModelInstance"))
		{			
			System.out.println("Import data from instance "+operation.getModelInstanceIdImportData()+" into instance "+model_instance.getMIId());			
			ModelInstance model_instance_to_import_data = null;
			// Carica l'istanza da DB se non presente nello Store e la aggiunge, altrimenti la preleva dallo Store
			if(ModelInstanceStore.getInstance().getModelInstances(operation.getModelInstanceIdImportData(),0).size() == 0)
			{	
				ModelInstanceDBInterface mid = new ModelInstanceDB();
				model_instance_to_import_data =  mid.loadModelInstance(operation.getModelInstanceIdImportData());
				ModelInstanceStore.getInstance().addModelInstanceLoadedFromDB(model_instance_to_import_data);
			}else{
				model_instance_to_import_data = ModelInstanceStore.getInstance().getModelInstances(operation.getModelInstanceIdImportData(),0).get(0);
			}
			
			model_instance.importDataInstance(model_instance_to_import_data);
			response = WriteXML.getInstance().writeModelInstance(model_instance);
		}
		else if(desc.equals("resetModelInstanceDB"))
		{	
			System.out.println("Reload data instance from DB (RESET instance "+model_instance.getMIId()+")");
			// Operazione di reset per inserire nell'istanza i dati precedentemente salvati su DB
			ModelInstanceStore.getInstance().removeModelInstanceLoadedFromDB(model_instance); //rimuove l'istanza modificata sul client
			ModelInstanceDBInterface mid = new ModelInstanceDB();
			ModelInstance mi = mid.loadModelInstance(model_instance.getMIId());
			ModelInstanceStore.getInstance().addModelInstanceLoadedFromDB(mi);
			response = WriteXML.getInstance().writeModelInstance(mi);
		}
		else if(desc.equals("resetModelInstanceTmp"))
		{	
			System.out.println("Delete instance from temporary area on DB (RESET instance "+model_instance.getMIId()+")");
			ModelInstanceStore.getInstance().removeModelInstanceTmp(model_instance); //rimuove l'istanza modificata sul client
		}
		else if(desc.equals("simulateQuery"))
		{
			System.out.println("- Simulate query logic function "+operation.getQuery()+" on repository "+operation.getRepository());
			CriteriaInstance crit = model_instance.simulateQuery(operation.getLogicFunctionId(), operation.getRepository(), operation.getQuery());
			response = WriteXML.getInstance().writeCriteriaInstance(crit);
		}
		else if(desc.equals("computeDecision"))
		{
			System.out.println("- Compute decision for instance "+model_instance.getMIId());
			model_instance.computeDecision();
			response = WriteXML.getInstance().writeModelInstance(model_instance);
		}
		return response;
	}
	
}
