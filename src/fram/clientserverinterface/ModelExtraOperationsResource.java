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


import java.io.InputStream;
import java.io.StringReader;
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
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.Unmarshaller;
import javax.xml.bind.annotation.XmlElement;

import fram.dbinterface.ModelDB;
import fram.dbinterface.ModelDBInterface;
import fram.dbinterface.ModelInstanceDB;
import fram.dbinterface.ModelInstanceDBInterface;
import fram.model.Aspect;
import fram.model.AspectForClient;
import fram.model.FRAMModel;
import fram.model.Function;
import fram.model.FunctionAspect;
import fram.model.Group;
import fram.model.Model;
import fram.model.ModelExtraOperation;
import fram.model.ModelStore;
import fram.util.Convert;
import fram.util.WriteXML;


@Path("/modeloperations")
public class ModelExtraOperationsResource {

	@Context UriInfo uriInfo;
	@Context ServletContext context;
	@Context Request request;
	@Context HttpServletRequest httpRequest;
	@Context HttpServletResponse httpResponse;
	
	
	@POST
	@Consumes(MediaType.APPLICATION_XML)
	@Produces(MediaType.APPLICATION_XML)
	public String postSaveFRAMXMLF(FRAMModel model) throws Exception {
		//First of all checks if the model is already loaded on the server. When the model is deleted, also delete the linked functions and the aspects. 
		return prepareNewFRAMModeltoSave(model);
		
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
	
	@Path("/clone")
	@POST
	@Produces(MediaType.APPLICATION_XML)
	public String postOperationFRAMXML(JAXBElement<ModelExtraOperation> jaxbOperation) throws Exception {
		ModelExtraOperation operation = jaxbOperation.getValue();
		String desc = operation.getDescription();
		String response = new String();
		ModelDBInterface dbi = new ModelDB();
		
		System.out.println("- Request POST Operation Model XML: "+uriInfo.getPath()+" - "+desc+"\n\n");
//		FRAMModel model = ModelStore.getInstance().getModelById(operation.getModelId()); //Retrieves the model saved
		
		if(desc.equals("cloneModel"))
		{
			System.out.println("- Request POST Clone \n\n");
			FRAMModel model = dbi.loadFRAMModel(operation.getModelId()); //Retrieves the model saved
			int modelId=0;
			if(ModelStore.getInstance().getNumModelsTmp() == 0)
				modelId = dbi.getFreeId("model");
			else
				modelId = ModelStore.getInstance().getMaxIdModelsTmp()+1;
			
//			model.setId(modelId);
			model.setObjective("CLONED - "+model.getObjective());
			FRAMModel model_cloned = new FRAMModel(modelId, model);
			
//			System.out.println("\n-Modello: "+model.PrintAll());
//			System.out.println("\n-Clone: "+model_cloned.PrintAll());
			
			model_cloned.specifyTimestampCreateModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
			model_cloned.specifyTimestampLastModifyModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
			
//			dbi.saveFRAMModel(model_cloned);	//Saves the model on the DB
//			System.out.println(model_cloned.PrintAll());
			prepareNewFRAMModeltoCloneAndSave(model_cloned);
//			ModelStore.getInstance().addFRAMModel(model_cloned);
			response = WriteXML.getInstance().writeFRAMModel(model_cloned);
//			response = WriteXML.getInstance().writeModel(model_cloned);
		}
		return response;
	}
	
/* Ale: All the functions above come from SMartDS. I have decided to not delete these because can be useful for future development
 */
	public String postOperationFRAMXMLF(Function F) throws Exception {
		System.out.println("Add a single Function");
		System.out.println(F.toString());
		
		return "";		
	}
	public String postOperationFRAMXML(Aspect A) throws Exception {
		System.out.println("Add a single Aspect");
		System.out.println(A.toString());
		
		return "";		
	}
	public String postOperationFRAMXML_Good(String XMLstring) throws Exception {
		System.out.println("XML: "+XMLstring);
		JAXBContext jaxbContext = JAXBContext.newInstance(Aspect.class);
		
		StringReader sr = new StringReader(XMLstring);
		Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
		Aspect response = (Aspect) unmarshaller.unmarshal(sr);
		System.out.println(response.toString());
		
		return "";		
	}
	//XXX Old
	public String postOperationXML(JAXBElement<ModelExtraOperation> jaxbOperation) throws Exception {
		
		ModelExtraOperation operation = jaxbOperation.getValue();
		String desc = operation.getDescription();
		
		System.out.println("- Request POST Operation Model XML: "+uriInfo.getPath()+" - "+desc+"\n\n");
		Model model = ModelStore.getInstance().getModelById(operation.getModelId());

		String response = new String();
		ModelDBInterface dbi = new ModelDB();
		
		if(desc.equals("printModel"))
			model.printModel(model.getRootCriteria());
		
		else if(desc.equals("saveModel"))
			dbi.saveModel(model);
		
		else if(desc.equals("cloneModel"))
		{
			int modelId=0;
			if(ModelStore.getInstance().getNumModelsTmp() == 0)
				modelId = dbi.getFreeId("model");
			else
				modelId = ModelStore.getInstance().getMaxIdModelsTmp()+1;
			
			Model model_cloned = model.cloneModel(modelId, operation.getUserId());
			
			model_cloned.specifyTimestampCreateModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
			model_cloned.specifyTimestampLastModifyModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
			
			ModelStore.getInstance().addModel(model_cloned);
			response = WriteXML.getInstance().writeModel(model_cloned);
		}
		else if(desc.equals("resetModelDB"))
		{	
			// Operazione di reset per inserire nel modello i dati precedentemente salvati su DB
			ModelStore.getInstance().removeModelLoadedFromDB(model);
			ModelDBInterface md = new ModelDB();
			Model m = md.loadModel(model.getId());
			ModelStore.getInstance().addModelLoadedFromDB(m);
			response = WriteXML.getInstance().writeModel(m);
		}
		else if(desc.equals("resetModelTmp"))
		{	
			// Operazione di reset che consiste nell'eliminare la risorsa temporanea presente sul server
			ModelStore.getInstance().removeModelTmp(model);
		}
		return response;
		
	}

	/** Ale
	 * Prepare new FRAM model to clone. If there is no instance associated it deletes the previous model and creates a new one. 
	 * Else updates the model.
	 * @param model
	 * @return
	 */
	private String prepareNewFRAMModeltoCloneAndSave(FRAMModel model){
		ModelDBInterface dbi = new ModelDB();		
		
		ArrayList<Function> currentM_functions =  model.getFunctions();
		ArrayList<AspectForClient> aspects_list = model.getAspectsC();
		ArrayList<Group> currentM_groups = model.getGroups();
		
		model.specifyTimestampCreateModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		model.specifyTimestampLastModifyModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		model.setPriority_type("private");
		// Retrieves the create time if the model was already present.
		Timestamp create_time = dbi.getFRAMModelCreateTime(model.getId());
		if(create_time != null) model.specifyTimestampCreateModel(create_time);		
		
		// Checks if there are some instances saved for that model. In that case updates only the function modified. Otherwise it deletes and re-enter all the model.
		if(dbi.isModelSavedOnDB(model.getId())){
			if(dbi.hasModelInstanceOnDB(model.getId())){
				updateFRAMModel(model); //XXX is called for the instance case?
				return "";
			}
		}
		
		System.out.println("\n-Add a Model: "+model.getId()+" Objective: "+model.getObjective());
		// Model-> 8 table field: (0)id, (1)objective, (2)description, (3)type, (4)size, (5)date_create, (6)date_last_modify, (7)idUser
		dbi.saveFRAMModel( model ); // Saves the changes in the model.
		// Function Management
		for(Function F:currentM_functions){
			F.setId(dbi.getFreeId("function")); // XXX modify. I don't like it. Maybe is good for the first save but not for the rest.
			F.setModelId(model.getId()); // XXX bypass the value provided.
			dbi.saveFunction(F); // Saves functions.			
		}
		// Saves the aspects and functions aspect		
		ArrayList<FunctionAspect> FA_list = new ArrayList<FunctionAspect>();
		
		for(AspectForClient A:aspects_list){
			/* Ale 16-3-7: Creates the aspect from the list passed by the client. There are some differences between aspect and aspectClient.
			 * Aspect structure: id, label, modelId
			 * AspectForClient(extension of Aspect) structure: 	String Ftarget; String Fsource; String LinkType;
			 */
			// Creates the Aspect relative to the AspectClient passed and checks if it is already present in the temporary list.
			int id, modelId, nodeId;
			String label;
			label = A.getLabel();
			modelId = model.getId();
//			nodeId=A.getId();
			nodeId = A.getNodeid();
			Aspect newA = new Aspect(label, modelId, nodeId);
			boolean present = model.containsAspectByNodeId(nodeId); // Checks only based on the nodeId.
//			System.out.println(A.toString() +" present:"+present);
			
			if(!present){ // Adds the aspect in to the array of the model, for save it and, adds the FunctionAspect object.
				id = dbi.getFreeId("aspect");
				newA.setId(id);
				model.getAspects().add(newA);
				dbi.saveAspect(newA);
			}
			//Adds the link between FunctionAspect. Searches among the function for the two with the id
			//FunctionAspect field:  int idFunction; int idAspect; Function F_ref; Aspect A_ref; String type; 1-2-5 are the parameters saved.
			Function source = null;
			Function target = null;
			String Atype="";
			if(A.getFsource() != null && A.getFsource() != "null" && !A.getFsource().isEmpty() ){
				source = model.getFunctionWithNodeid(Integer.parseInt(A.getFsource())); 
//				System.out.println("Source:"+source.toString());
				Atype="Output";
				// Retrieves the id of the aspect, with the node id.
				Aspect Asearched=null;
				Asearched=model.getAspectByNodeId(nodeId);
				if(Asearched!=null){					
					FunctionAspect FA = new FunctionAspect(source.getId(), Asearched.getId(), Atype);
					// Checks if is already present.
					if(FA_list.indexOf(FA)==-1){
						FA_list.add(FA);
						dbi.saveFunctionAspect(FA);				
					}
				}
				else{
					System.out.println("Aspect not found. Not possible to add the relative FunctionAspect");
				}
			}
			if(A.getFtarget() != null && A.getFtarget() != "null" && !A.getFtarget().isEmpty() ){
				target = model.getFunctionWithNodeid(Integer.parseInt(A.getFtarget())); 
//				System.out.println("Target:"+target.toString());
				Atype=A.getLinkType();
				//retrieves the id of the aspect, with the node id.
				Aspect Asearched=null;
				Asearched=model.getAspectByNodeId(nodeId);
				if(Asearched!=null){
					
					FunctionAspect FA = new FunctionAspect(target.getId(), Asearched.getId(), Atype);
					//Checks if is already present.
					if(FA_list.indexOf(FA)==-1){
						FA_list.add(FA);
						dbi.saveFunctionAspect(FA);				
					}
				}
				else{
					System.out.println("Aspect not found. Not possible to add the relative FunctionAspect");
				}
			}			
		}
		//Saves the Groups. First saves the group. Then saves all the functions and hierarchy.
		for(Group G:currentM_groups){
			G.setId(dbi.getFreeId("framgroup"));//XXX modify. I don't like it. Maybe is good for the first save but not for the rest.
			G.setModelId(model.getId()); // XXX bypass the value provided.
			dbi.saveGroup( G ); // Saves functions.
		}			
		for(Group G:currentM_groups){
			Function f_in_group; // The function id;
			Group g_in_group; // The child group id
			for( Integer node_id:G.getFunctions_id() ){
				System.out.println("\n- Function NodeId: "+node_id);
				f_in_group = model.getFunctionWithNodeid(node_id);
				if(f_in_group != null){ // is the id of a function.
					System.out.println("\n- Function Id: "+f_in_group.getId());
					dbi.saveGroupFunction(G.getId(), f_in_group.getId());// Adds the link in the DB.
				}
				else{ // is the id of a group.
					g_in_group = model.getGroupWithNodeId(node_id);
					if(g_in_group != null){ // is the id of a function.
						System.out.println("\n- Group Id: "+g_in_group.getId());
						dbi.saveGroupHierarchy(G.getId(), g_in_group.getId());// Adds the link in the DB.
					}
					else System.out.println("\n- Group not found!!!");
				}
			}				
		}
//		FRAMModel old_model = ModelStore.getInstance().getFRAMModelById(model.getId());
//		System.out.println(old_model.toString());
//		ModelStore.getInstance().removeFRAMModelTmp(old_model); // Removes the model in cache.
//		ModelStore.getInstance().removeFRAMModelLoadedFromDB(old_model); // Removes the model in cache.
//		ModelStore.getInstance().addFRAMModelLoadedFromDB(model); // Saves the model in a session variable.
		ModelStore.getInstance().addFRAMModel(model); // Saves the model in a session variable.
		return "";
	}
	/** Ale
	 * Prepare new FRAM model to save. If there is no instance associated it deletes the previous model and creates a new one. 
	 * Else updates the model.
	 * @param model
	 * @return
	 */
	private String prepareNewFRAMModeltoSave(FRAMModel model){
		ModelDBInterface dbi = new ModelDB();		
		
		ArrayList<Function> currentM_functions =  model.getFunctions();
		ArrayList<AspectForClient> aspects_list = model.getAspectsC();
		ArrayList<Group> currentM_groups = model.getGroups();
		
		model.specifyTimestampCreateModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		model.specifyTimestampLastModifyModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		model.setPriority_type("private");
		// Retrieves the create time if the model was already present.
		Timestamp create_time = dbi.getFRAMModelCreateTime(model.getId());
		if(create_time != null) model.specifyTimestampCreateModel(create_time);		
		
		// Checks if there are some instances saved for that model. In that case updates only the function modified. Otherwise it deletes and re-enter all the model.
		if(dbi.isModelSavedOnDB(model.getId())){
			if(dbi.hasModelInstanceOnDB(model.getId())){
				updateFRAMModel(model); //XXX is called for the instance case?
				return "";
			}
		}
		
		System.out.println("\n-Add a Model: "+model.getId()+" Objective: "+model.getObjective());
		// Model-> 8 table field: (0)id, (1)objective, (2)description, (3)type, (4)size, (5)date_create, (6)date_last_modify, (7)idUser
		dbi.saveFRAMModel( model ); // Saves the changes in the model.
		// Function Management
		for(Function F:currentM_functions){
			F.setId(dbi.getFreeId("function")); // XXX modify. I don't like it. Maybe is good for the first save but not for the rest.
			F.setModelId(model.getId()); // XXX bypass the value provided.
			dbi.saveFunction(F); // Saves functions.			
		}
		// Saves the aspects and functions aspect		
		ArrayList<FunctionAspect> FA_list = new ArrayList<FunctionAspect>();
		
		for(AspectForClient A:aspects_list){
			/* Ale 16-3-7: Creates the aspect from the list passed by the client. There are some differences between aspect and aspectClient.
			 * Aspect structure: id, label, modelId
			 * AspectForClient(extension of Aspect) structure: 	String Ftarget; String Fsource; String LinkType;
			 */
			// Creates the Aspect relative to the AspectClient passed and checks if it is already present in the temporary list.
			int id, modelId, nodeId;
			String label;
			label = A.getLabel();
			modelId = model.getId();
//			nodeId=A.getId();
			nodeId = A.getNodeid();
			Aspect newA = new Aspect(label, modelId, nodeId);
			boolean present = model.containsAspectByNodeId(nodeId); //Checks only based on the nodeId.
//			System.out.println(A.toString() +" present:"+present);
			
			if(!present){ // Adds the aspect in to the array of the model, for save it and, adds the FunctionAspect object.
				id = dbi.getFreeId("aspect");
				newA.setId(id);
				model.getAspects().add(newA);
				dbi.saveAspect(newA);
			}
			//Adds the link between FunctionAspect. Searches among the function for the two with the id
			//FunctionAspect field:  int idFunction; int idAspect; Function F_ref; Aspect A_ref; String type; 1-2-5 are the parameters saved.
			Function source = null;
			Function target = null;
			String Atype="";
			if(A.getFsource() != null && A.getFtarget() != "null" && !A.getFsource().isEmpty() ){
				source = model.getFunctionWithNodeid(Integer.parseInt(A.getFsource())); 
//				System.out.println("Source:"+source.toString());
				Atype="Output";
				// Retrieves the id of the aspect, with the node id.
				Aspect Asearched=null;
				Asearched=model.getAspectByNodeId(nodeId);
				if(Asearched!=null){					
					FunctionAspect FA = new FunctionAspect(source.getId(), Asearched.getId(), Atype);
					// Checks if is already present.
					if(FA_list.indexOf(FA)==-1){
						FA_list.add(FA);
						dbi.saveFunctionAspect(FA);				
					}
				}
				else{
					System.out.println("Aspect not found. Not possible to add the relative FunctionAspect");
				}
			}
			if(A.getFtarget() != null && A.getFtarget() != "null" && !A.getFtarget().isEmpty() ){
				target = model.getFunctionWithNodeid(Integer.parseInt(A.getFtarget())); 
//				System.out.println("Target:"+target.toString());
				Atype=A.getLinkType();
				//retrieves the id of the aspect, with the node id.
				Aspect Asearched=null;
				Asearched=model.getAspectByNodeId(nodeId);
				if(Asearched!=null){
					
					FunctionAspect FA = new FunctionAspect(target.getId(), Asearched.getId(), Atype);
					//Checks if is already present.
					if(FA_list.indexOf(FA)==-1){
						FA_list.add(FA);
						dbi.saveFunctionAspect(FA);				
					}
				}
				else{
					System.out.println("Aspect not found. Not possible to add the relative FunctionAspect");
				}
			}			
		}
		//Saves the Groups. First saves the group. Then saves all the functions and hierarchy.
		for(Group G:currentM_groups){
			G.setId(dbi.getFreeId("framgroup"));//XXX modify. I don't like it. Maybe is good for the first save but not for the rest.
			G.setModelId(model.getId()); // XXX bypass the value provided.
			dbi.saveGroup( G ); // Saves functions.
		}			
		for(Group G:currentM_groups){
			Function f_in_group; // The function id;
			Group g_in_group; // The child group id
			for( Integer node_id:G.getFunctions_id() ){
				System.out.println("\n- Function NodeId: "+node_id);
				f_in_group = model.getFunctionWithNodeid(node_id);
				if(f_in_group != null){ // is the id of a function.
					System.out.println("\n- Function Id: "+f_in_group.getId());
					dbi.saveGroupFunction(G.getId(), f_in_group.getId());// Adds the link in the DB.
				}
				else{ // is the id of a group.
					g_in_group = model.getGroupWithNodeId(node_id);
					if(g_in_group != null){ // is the id of a function.
						System.out.println("\n- Group Id: "+g_in_group.getId());
						dbi.saveGroupHierarchy(G.getId(), g_in_group.getId());// Adds the link in the DB.
					}
					else System.out.println("\n- Group not found!!!");
				}
			}				
		}
		FRAMModel old_model = ModelStore.getInstance().getFRAMModelById(model.getId());
//		System.out.println(old_model.toString());
		ModelStore.getInstance().removeFRAMModelTmp(old_model); // Removes the model in cache.
		ModelStore.getInstance().removeFRAMModelLoadedFromDB(old_model); // Removes the model in cache.
//		ModelStore.getInstance().addFRAMModelLoadedFromDB(model); // Saves the model in a session variable.
		ModelStore.getInstance().addFRAMModel(model); // Saves the model in a session variable.
		return "";
	}
	
	/** Ale
	 * Update the values for the model, for the functions and for the aspects. 
	 * 16-4-14 Also for the group.
	 * @param model
	 * @return
	 */
	private String updateFRAMModel(FRAMModel model){
		ModelDBInterface dbi = new ModelDB();	
		
		ArrayList<Function> currentM_functions =  model.getFunctions();
		ArrayList<AspectForClient> aspects_list = model.getAspectsC();
		ArrayList<Group> currentM_groups = model.getGroups();
		
		model.specifyTimestampCreateModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		model.specifyTimestampLastModifyModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		model.setPriority_type("private");
				
		System.out.println("\n- Updates the Model: "+model.getId() +" Objective: "+model.getObjective());
		//Model-> 8 table field: (0)id, (1)objective, (2)description, (3)type, (4)size, (5)date_create, (6)date_last_modify, (7)idUser
		dbi.saveFRAMModelInfo(model); //Saves the model.
		FRAMModel old_model = ModelStore.getInstance().getFRAMModelById(model.getId());
		//Function Management - Updates the functions and deletes the other no longer present.
		for(Function F:currentM_functions){
			boolean present = false;
			for( Function FO:old_model.getFunctions() ){
				if(F.getNodeid() == FO.getNodeid()){
					System.out.println("\n- Elemento trovato:"+F.getName()+" - "+FO.getName());
					F.setId(FO.getId());
					dbi.saveFunctionInfo(F);
					present = true;
					break;
				}
			}
			if(!present){
				F.setId(dbi.getFreeId("function"));// Sets a new ID for the function.
				F.setModelId(model.getId()); // Sets the model ID into the function.
				dbi.saveFunction(F); // Saves functions.			
			}
		}
		// Deletes the function no long present TODO it could be done better.
		for(Function FO:old_model.getFunctions()){
			boolean present = false;
			for(Function F:currentM_functions){
				if(F.getNodeid() == FO.getNodeid()){
					present = true;
					break;
				}
			}
			if(!present) dbi.deleteFunction(FO.getId());
		}
		
		// Saves the aspects and functions aspect		
		dbi.deleteFRAMModelAspects(model.getId());
		ArrayList<FunctionAspect> FA_list = new ArrayList<FunctionAspect>();
		for(AspectForClient A:aspects_list){
			/* Ale 16-3-7: Creates the aspect from the list passed by the client. There are some differences between aspect and aspectClient.
			 * Aspect structure: id, labe, modelId
			 * AspectForClient(extension of Aspect) structure: 	String Ftarget; String Fsource; String LinkType;
			 */
			//Creates the Aspect relative to the AspectClient passed and checks if is already present in the temporary list.
			int id, modelId, nodeId;
			String label;
			label = A.getLabel();
			modelId = model.getId();
			nodeId = A.getNodeid();
			Aspect newA = new Aspect(label, modelId, nodeId);
			boolean present = model.containsAspectByNodeId(nodeId); //Checks only based on the nodeId.
			if(!present){ //Adds the aspect in to the array of the model, for save it and, adds the FunctionAspect object.
				id = dbi.getFreeId("aspect");
				newA.setId(id);
				model.getAspects().add(newA);
				dbi.saveAspect(newA);
			}
			//Adds the link between FunctionAspect. 
			//Searches among the function for the two with the id
			//FunctionAspect field:  int idFunction; int idAspect; Function F_ref; Aspect A_ref; String type; 1-2-5 are the parameters saved.
			Function source = null;
			Function target = null;
			String Atype="";
			if(A.getFsource() != null && !A.getFsource().isEmpty() ){
				source = model.getFunctionWithNodeid(Integer.parseInt(A.getFsource())); 
				Atype="Output";
				//retrieves the id of the aspect, with the node id.
				Aspect Asearched=null;
				Asearched=model.getAspectByNodeId(nodeId);
				if(Asearched!=null){					
					FunctionAspect FA = new FunctionAspect(source.getId(), Asearched.getId(), Atype);
					//Checks if is already present.
					if(FA_list.indexOf(FA)==-1){
						FA_list.add(FA);
						dbi.saveFunctionAspect(FA);				
					}
				}
				else{
					System.out.println("Aspect not found. Not possible to add the relative FunctionAspect");
				}
			}
			if(A.getFtarget() != null && !A.getFtarget().isEmpty() ){
				target = model.getFunctionWithNodeid(Integer.parseInt(A.getFtarget())); 
				Atype=A.getLinkType();
				//retrieves the id of the aspect, with the node id.
				Aspect Asearched=null;
				Asearched=model.getAspectByNodeId(nodeId);
				if(Asearched!=null){
					
					FunctionAspect FA = new FunctionAspect(target.getId(), Asearched.getId(), Atype);
					//Checks if is already present.
					if(FA_list.indexOf(FA)==-1){
						FA_list.add(FA);
						dbi.saveFunctionAspect(FA);				
					}
				}
				else{
					System.out.println("Aspect not found. Not possible to add the relative FunctionAspect");
				}
			}			
		}
		
		//Group Management - Updates the groups and deletes the other no longer present.
//		System.out.println("\n-Control the groups");
		for(Group G:currentM_groups){
			boolean present = false;
			for(Group GO:old_model.getGroups()){
//				System.out.println("\n_Checks for a Group: "+G.getName()+" - "+G.getNodeid() +" with: "+GO.getId()+" name: "+GO.getNodeid());
				//TODO retrieve the real ID.
//				if(G.getId() == GO.getId()){
				if(G.getNodeid() == GO.getNodeid()){
//					System.out.println("\n-Gruppo trovato:"+G.getName()+" - "+GO.getName());
					G.setId(GO.getId());
					dbi.saveGroupInfo(G);
					present = true;
					break;
				}
			}
			if(!present){
//				System.out.println("\n-Adds the group:"+G.getName());
				G.setId(dbi.getFreeId("framgroup"));// Sets a new ID for the group.
				G.setModelId(model.getId()); // Sets the model ID into the group.
				dbi.saveGroup(G); // Saves groups.			
			}
		}
		//Deletes the group no long present TODO it could be done better.
		for(Group GO:old_model.getGroups()){
			boolean present = false;
			for(Group G:currentM_groups){
				if(G.getNodeid() == GO.getNodeid()){
					present = true;
					break;
				}
			}
			if(!present) dbi.deleteGroup(GO.getId());
		}
		// Updates the list of functions in the group and the hierarchy.
		for(Group G:currentM_groups){
			dbi.deleteGroupFunction(G.getId()); // Removes the previous list. N.B. This can be done because there aren't info linked with this line
			dbi.deleteGroupHierarchy(G.getId()); // Removes the previous list. N.B. This can be done because there aren't info linked with this line
			//Adds the new functions in the group.
			Function f_in_group; // The function id;
			Group g_in_group; // The child group id
			for( Integer node_id:G.getFunctions_id() ){
				System.out.println("\n- Function NodeId: "+node_id);
				f_in_group = model.getFunctionWithNodeid(node_id);
				if(f_in_group != null){ // is the id of a function.
					System.out.println("\n- Function Id: "+f_in_group.getId());
					dbi.saveGroupFunction(G.getId(), f_in_group.getId());// Adds the link in the DB.
				}
				else{ // is the id of a group.
					g_in_group = model.getGroupWithNodeId(node_id);
					if(g_in_group != null){ // is the id of a function.
						System.out.println("\n- Group Id: "+g_in_group.getId());
						dbi.saveGroupHierarchy(G.getId(), g_in_group.getId());// Adds the link in the DB.
					}
					else System.out.println("\n- Group not found!!!");
				}
			}
		}
		
//		FRAMModel old_model = ModelStore.getInstance().getFRAMModelById(model.getId());
		ModelStore.getInstance().removeFRAMModelTmp(old_model); //Removes the model in cache.
		ModelStore.getInstance().removeFRAMModelLoadedFromDB(old_model); //Removes the model in cache.
//		ModelStore.getInstance().addFRAMModelLoadedFromDB(model); //Saves the model in a session variable.
		ModelStore.getInstance().addFRAMModel(model); //Saves the model in a session variable.
		return "";
	}
}
