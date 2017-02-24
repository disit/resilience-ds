>/* ResilienceDS
>   Copyright (C) 2017 DISIT Lab http://www.disit.org - University of Florence
>
>   This program is free software: you can redistribute it and/or modify
>   it under the terms of the GNU Affero General Public License as
>   published by the Free Software Foundation, either version 3 of the
>   License, or (at your option) any later version.
>
>   This program is distributed in the hope that it will be useful,
>   but WITHOUT ANY WARRANTY; without even the implied warranty of
>   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
>   GNU Affero General Public License for more details.
>
>   You should have received a copy of the GNU Affero General Public License
>   along with this program.  If not, see <http://www.gnu.org/licenses/>. */


package fram.clientserverinterface;

import java.io.*;
import java.net.*;
import java.sql.Timestamp;
//import java.time.LocalDateTime;











import java.util.ArrayList;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.UriInfo;
import javax.xml.bind.JAXBElement;

import fram.dbinterface.ModelDB;
import fram.dbinterface.ModelDBInterface;
import fram.model.Aspect;
import fram.model.AspectForClient;
import fram.model.Criteria;
import fram.model.FRAMModel;
import fram.model.Function;
import fram.model.Model;
import fram.model.ModelStore;
import fram.util.Convert;
import fram.util.ModelsParserXML;
import fram.util.WriteXML;

/*Ale 16_5_7
 * Ale: Class for export a ResoluteFRAMmodel to SmartDS.
 */

@Path("/exportFRAMmodel")
public class ExportFRAMModelResource {

	@Context UriInfo uriInfo;
	@Context ServletContext context;
	@Context HttpServletRequest httpRequest;
	@Context HttpServletResponse httpResponse;
	int modelId;
	int OutputNodeId;
	
	@POST
	@Produces(MediaType.APPLICATION_XML)
	@Path("{modelId}")
	/**Ale
	 * Creates the model for SmartDS starting from a specific output of a function.
	 * @return true if has been correctly executed.
	 */
	public String getModelToExport(@PathParam("modelId") int modelId) {
		
		System.out.println("\n- Request GET Model To Export: "+uriInfo.getPath());
		
		String result ="";
		try{
			OutputNodeId = Integer.parseInt(httpRequest.getParameterValues("OutputNodeId")[0]);
			
			System.out.println("Received: "+modelId+" , "+OutputNodeId);
			FRAMModel model;
			if(ModelStore.getInstance().getFRAMModelById(modelId) == null)
			{	
				System.out.println("- Model "+modelId+" loaded from database");
				ModelDBInterface dbi = new ModelDB();
				model = dbi.loadFRAMModel(modelId);
				ModelStore.getInstance().addFRAMModelLoadedFromDB(model); // Saves the model in a session variable.
			}	
			else
			{	
				System.out.println("- Model "+modelId+" loaded from temporary store(ModelStore)");
				ModelDBInterface dbi = new ModelDB();
				model = dbi.loadFRAMModel(modelId); //XXX Sometimes there are problems with this load.
	//			model = ModelStore.getInstance().getFRAMModelById(modelId); //Loads the model.
	//			System.out.println("Model content: "+model.PrintAll());
			}
			result = convertToSmartDS(model, OutputNodeId);
		}
		catch (Exception e){
			System.out.println("\n---Error--- \n- Message: "+e.getMessage()+" \n- String: "+e.toString()+" \n- Cause: "+e.getCause()+"\n- StackTrace: "+e.getStackTrace()[1]);
			StackTraceElement[] elements = e.getStackTrace();  
            for (int iterator=1; iterator<=elements.length; iterator++)  
                   System.out.println("Class Name:"+elements[iterator-1].getClassName()+" Method Name:"+elements[iterator-1].getMethodName()+" Line Number:"+elements[iterator-1].getLineNumber());
			result = " Error during the conversion";
			
		}
		return result;	
	}
	
	/**Ale
	 * Builds the SmartDS model for the model passed, with root the aspect with the NodeId equal to rootId.
	 * For prevent cycle it saves in the criteria.modeId the id of the function relatives to the aspect selected. 
	 * The modelId is set from SmartDS when it saves the new model passed. Maybe it's also possible to save it step by step like how is done the creation.
	 * 16/7/8:Ale - For prevent a consistency error in SmartDS, that doesn't provide node's with only one children, 
	 * when this case is found it bypass the node, and enters directly the children in place of the father
	 * @param model: The FRAM model
	 * @param rootId: the id for the root.
	 * @return the model converted
	 */
	private String convertToSmartDS(FRAMModel model, int rootId){
		// First of all checks if the aspect is present in the model.
		AspectForClient asp_root = model.getAspectForClientByNodeId(rootId);
		if(asp_root==null) return "false";
		// Creates the info for the model.
		Model model_SmartDS = new Model();
		model_SmartDS.setDateCreateModel(model.getDateCreateModel());
		model_SmartDS.setDateLastModifyModel(model.getDateLastModifyModel());
		model_SmartDS.setObjective(model.getObjective());
		model_SmartDS.setDescriptionModel("Model for the Output: "+asp_root.getLabel()+". Description: "+model.getDescriptionModel());
		// TODO Retrieve the user. From SmartDS
		model_SmartDS.setModelUserId(model.getModelUserId()); // TODO Searches for the user id on SmartDS.
		Criteria root = new Criteria();
		root.setIsLeaf(false);
		root.setPosition("C0");
		/*---- Builds the tree. Get the aspect source, and for the source checks the aspects in input. ---- */
		//Retrieves the function for the node.
		Function fsource = model.getFunctionbyNodeid(Integer.parseInt(asp_root.getFsource()));
		if(fsource==null) return "false"; //No source found.
		root.setDescription(asp_root.getLabel()+" - FROM F: "+fsource.getName());
		root.setModelId(fsource.getNodeid()); //!! Sets in the modelId the function Id for check cycle.  
		// Retrieves the aspect in inputs for the source.
		ArrayList<AspectForClient> fsource_aspects = model.getAspectsForFunction(fsource, false);
		// Divides the aspects in base of the 5 inputs.
		if(fsource_aspects.size()==0) return "false";
		// Adds the inputs to the aspect.
		Criteria CInputs = new Criteria(); CInputs.setIsLeaf(true); CInputs.setModelId(-1); CInputs.setCritF(root);
		Criteria CPreconditions = new Criteria(); CPreconditions.setIsLeaf(true); CPreconditions.setModelId(-1); CPreconditions.setCritF(root);
		Criteria CResources = new Criteria(); CResources.setIsLeaf(true); CResources.setModelId(-1); CResources.setCritF(root);
		Criteria CControls = new Criteria(); CControls.setIsLeaf(true); CControls.setModelId(-1); CControls.setCritF(root);
		Criteria CTimes = new Criteria(); CTimes.setIsLeaf(true); CTimes.setModelId(-1); CTimes.setCritF(root);
		CInputs.setDescription("Inputs for "+fsource.getName()); CInputs.setPosition("C1"); 
		CPreconditions.setDescription("Preconditions for "+fsource.getName()); CPreconditions.setPosition("C2"); 
		CResources.setDescription("Resources for "+fsource.getName()); CResources.setPosition("C3"); 
		CControls.setDescription("Controls for "+fsource.getName()); CControls.setPosition("C4"); 
		CTimes.setDescription("Times for "+fsource.getName()); CTimes.setPosition("C5"); 
//		ArrayList<Criteria> CriteriaForFunction = new ArrayList<Criteria>(); //List of all the criteria added for the function.
		
		for(AspectForClient a:fsource_aspects){
			String LinkType = a.getLinkType();
			Criteria CPointF = new Criteria(); // Criteria for the aspect that points the function source.
			Function a_source = new Function();
			if(a.getFsource()!="null") a_source = model.getFunctionbyNodeid(Integer.parseInt(a.getFsource()));
			else a_source = null;
			if(a_source!=null){
				CPointF.setDescription(a.getLabel()+" - FROM F: "+a_source.getName());
				// Checks if it's already present. In that case it doesn't add that.
				CPointF.setCritF(root); // This is a temporary set for make the search of cycles.
				CPointF.setModelId(a_source.getNodeid());
				boolean cycle_detected = checkForCycle(CPointF);
				System.out.println("\n- Cycle detected: "+cycle_detected);
				System.out.println("\n- Link Type: "+LinkType+(LinkType=="Input"));
				if(LinkType.equals("Input")){ CPointF.setPosition(CInputs.getPosition()+""+(CInputs.getChildren().size()+1)); CPointF.setCritF(CInputs); CInputs.addChild(CPointF); CInputs.setIsLeaf(false);}
				else if(LinkType.equals("Precondition")){ CPointF.setPosition(CPreconditions.getPosition()+""+(CPreconditions.getChildren().size()+1)); CPointF.setCritF(CPreconditions); CPreconditions.addChild(CPointF); CPreconditions.setIsLeaf(false);}
				else if(LinkType.equals("Resource")){ CPointF.setPosition(CResources.getPosition()+""+(CResources.getChildren().size()+1)); CPointF.setCritF(CResources); CResources.addChild(CPointF); CResources.setIsLeaf(false); }
				else if(LinkType.equals("Control")){ CPointF.setPosition(CControls.getPosition()+""+(CControls.getChildren().size()+1)); CPointF.setCritF(CControls); CControls.addChild(CPointF); CControls.setIsLeaf(false);}
				else if(LinkType.equals("Time")){ CPointF.setPosition(CTimes.getPosition()+""+(CTimes.getChildren().size()+1)); CPointF.setCritF(CTimes); CTimes.addChild(CPointF); CTimes.setIsLeaf(false);}
				// Makes a deep tree construction.
				if(!cycle_detected){ // Adds the criteria to the relative aspect.
					String deep_search = prepareCriteriaForSmartDS(CPointF, model, a.getFsource());					
					if(deep_search.equalsIgnoreCase("false")){
						System.out.println("\n- Criteria: "+CPointF.getDescription()+" is a leaf.");
						CPointF.setIsLeaf(true);
					}
					else{
						CPointF.setIsLeaf(false);
					}					
				}
				else{
					System.out.println("\n- Criteria: "+CPointF.getDescription()+" is a leaf.");
					CPointF.setDescription(CPointF.getDescription()+" - (T-1)");
					CPointF.setIsLeaf(true);
				}
			}
			else{ // Adds only the aspect without the function.
				CPointF.setDescription(a.getLabel()+" - FROM Function not present!");
				CPointF.setModelId(-1); // XXX Probably not necessary. It's used only for the search cycle.
				if(LinkType.equals("Input")){ CPointF.setPosition(CInputs.getPosition()+""+(CInputs.getChildren().size()+1)); CPointF.setCritF(CInputs); CInputs.addChild(CPointF); CInputs.setIsLeaf(false);}
				else if(LinkType.equals("Precondition")){ CPointF.setPosition(CPreconditions.getPosition()+""+(CPreconditions.getChildren().size()+1)); CPointF.setCritF(CPreconditions); CPreconditions.addChild(CPointF); CPreconditions.setIsLeaf(false);}
				else if(LinkType.equals("Resource")){ CPointF.setPosition(CResources.getPosition()+""+(CResources.getChildren().size()+1)); CPointF.setCritF(CResources); CResources.addChild(CPointF); CResources.setIsLeaf(false); }
				else if(LinkType.equals("Control")){ CPointF.setPosition(CControls.getPosition()+""+(CControls.getChildren().size()+1)); CPointF.setCritF(CControls); CControls.addChild(CPointF); CControls.setIsLeaf(false);}
				else if(LinkType.equals("Time")){ CPointF.setPosition(CTimes.getPosition()+""+(CTimes.getChildren().size()+1)); CPointF.setCritF(CTimes); CTimes.addChild(CPointF); CTimes.setIsLeaf(false);}
				
				CPointF.setIsLeaf(true);
			}
		}
		// Ale: Consistency Check. Checks if the node has only a child, in that case the Criteria is removed and changed with its son
		CInputs = checkChildrenConsistency(CInputs);
		CPreconditions = checkChildrenConsistency(CPreconditions);
		CResources = checkChildrenConsistency(CResources);
		CControls = checkChildrenConsistency(CControls);
		CTimes = checkChildrenConsistency(CTimes);
		// Adds the aspect to the root.
		root.addChild(CInputs); root.addChild(CPreconditions); root.addChild(CResources); root.addChild(CControls); root.addChild(CTimes);
		// TODO Set the tree size.
		model_SmartDS.setRootCriteria(root);
		model_SmartDS.calculateSize();
		System.out.println(model_SmartDS.toString());
		return WriteXML.getInstance().writeModel(model_SmartDS);
	}
	
	/**Ale
	 * Makes a recursive construction of the SmartDS tree for the FRAM model.
	 * @param model_criteria: The criteria that has to be explored.
	 * @param model: The FRAM Model
	 * @param a_source: The function id for the aspect.
	 * @return
	 */
	private String prepareCriteriaForSmartDS(Criteria model_criteria, FRAMModel model, String f_source){
		System.out.println("- Prepare criteria for Criteria: "+model_criteria.getDescription()+" pos: "+model_criteria.getPosition()+" id: "+f_source);
		//XXX Check if it's possible that there is more than one aspect with the same ID.
//		AspectForClient asp_root = model.getAspectForClientByNodeId(Integer.parseInt(f_source)); 
		String c_position = model_criteria.getPosition();
		// Creates the info for the model.
		//Retrieves the function for the node.
//		Function fsource = model.getFunctionbyNodeid(Integer.parseInt(f_source));
		Function fsource = new Function();
		if(f_source !=null) fsource = model.getFunctionbyNodeid(Integer.parseInt(f_source));
		else fsource = null; // a.getFsource() is null when we have an aspect without the source but with only the target.
		
		if(fsource==null) return "false"; // No source found.
//		System.out.println("\n- Source: "+fsource.getId()+" label: "+fsource.getName());
		// Retrieves the aspect in inputs for the source.
		ArrayList<AspectForClient> fsource_aspects = model.getAspectsForFunction(fsource, false);
		if(fsource_aspects.size()==0){ model_criteria.setIsLeaf(true); return "false";}
		// Divides the aspects in base of the 5 inputs.
		// Adds the inputs to the aspect.
		Criteria CInputs = new Criteria(); CInputs.setIsLeaf(true); CInputs.setModelId(-1); CInputs.setCritF(model_criteria);
		Criteria CPreconditions = new Criteria(); CPreconditions.setIsLeaf(true); CPreconditions.setModelId(-1); CPreconditions.setCritF(model_criteria);
		Criteria CResources = new Criteria(); CResources.setIsLeaf(true); CResources.setModelId(-1); CResources.setCritF(model_criteria);
		Criteria CControls = new Criteria(); CControls.setIsLeaf(true); CControls.setModelId(-1); CControls.setCritF(model_criteria);
		Criteria CTimes = new Criteria(); CTimes.setIsLeaf(true); CTimes.setModelId(-1); CTimes.setCritF(model_criteria);
		CInputs.setDescription("Inputs for "+fsource.getName()); CInputs.setPosition(model_criteria.getPosition()+"1"); 
		CPreconditions.setDescription("Preconditions for "+fsource.getName()); CPreconditions.setPosition(model_criteria.getPosition()+"2"); 
		CResources.setDescription("Resources for "+fsource.getName()); CResources.setPosition(model_criteria.getPosition()+"3"); 
		CControls.setDescription("Controls for "+fsource.getName()); CControls.setPosition(model_criteria.getPosition()+"4"); 
		CTimes.setDescription("Times for "+fsource.getName()); CTimes.setPosition(model_criteria.getPosition()+"5"); 
		
		System.out.println("-Aspect size: "+fsource_aspects.size());
		for(AspectForClient a:fsource_aspects){
			System.out.println("- Aspect label: "+a.getLabel()+" id:"+a.getId()+" source:"+a.getFsource()+" target:"+a.getFtarget());
			String LinkType = a.getLinkType();
			Criteria CPointF = new Criteria(); // Criteria for the aspect that points the function source.
			// Manages the case where an aspect doens't have the source.
			Function a_source = new Function();
			if( a.getFsource() != "null" ) a_source = model.getFunctionbyNodeid(Integer.parseInt(a.getFsource()));
			else a_source = null; // a.getFsource() is null when we have an aspect without the source but with only the target.
			if(a_source != null){
				CPointF.setDescription(a.getLabel()+" - FROM F: "+a_source.getName());
				// Checks if it's already present. In that case it doesn't add that.
				CPointF.setCritF(model_criteria); // This is a temporary set for make the search of cycle.
				CPointF.setModelId(a_source.getNodeid()); // This is a temporary set for make the search of cycle. The search is based on modelId
				boolean cycle_detected = checkForCycle(CPointF);
//				System.out.println("\n- Cycle detected: "+cycle_detected);
				if(LinkType.equals("Input")){ CPointF.setPosition(CInputs.getPosition()+""+(CInputs.getChildren().size()+1)); CPointF.setCritF(CInputs); CInputs.addChild(CPointF); CInputs.setIsLeaf(false);}
				else if(LinkType.equals("Precondition")){ CPointF.setPosition(CPreconditions.getPosition()+""+(CPreconditions.getChildren().size()+1)); CPointF.setCritF(CPreconditions); CPreconditions.addChild(CPointF); CPreconditions.setIsLeaf(false);}
				else if(LinkType.equals("Resource")){ CPointF.setPosition(CResources.getPosition()+""+(CResources.getChildren().size()+1)); CPointF.setCritF(CResources); CResources.addChild(CPointF); CResources.setIsLeaf(false); }
				else if(LinkType.equals("Control")){ CPointF.setPosition(CControls.getPosition()+""+(CControls.getChildren().size()+1)); CPointF.setCritF(CControls); CControls.addChild(CPointF); CControls.setIsLeaf(false);}
				else if(LinkType.equals("Time")){ CPointF.setPosition(CTimes.getPosition()+""+(CTimes.getChildren().size()+1)); CPointF.setCritF(CTimes); CTimes.addChild(CPointF); CTimes.setIsLeaf(false);}
				if(!cycle_detected){ // Adds the criteria to the relative aspect.					
					// Makes a deep tree construction.
					String deep_search = prepareCriteriaForSmartDS(CPointF, model, a.getFsource());					
					if(deep_search.equals("false")){
						System.out.println("\n- Criteria: "+CPointF.getDescription()+" is a leaf.");
						CPointF.setIsLeaf(true);
					}
					else{
						CPointF.setIsLeaf(false);
					}					
				}
				else{
					System.out.println("\n- Criteria: "+CPointF.getDescription()+" is a leaf.");
					CPointF.setDescription(CPointF.getDescription()+" - (T-1)");
					CPointF.setIsLeaf(true);
				}
			}
			else{ // Adds only the aspect without the function.
				CPointF.setDescription(a.getLabel()+" - FROM Function not present!");
				CPointF.setCritF(model_criteria);
				CPointF.setModelId(-1); // XXX Probably not necessary. It's used only for the search cycle.
				if(LinkType.equals("Input")){ CPointF.setPosition(CInputs.getPosition()+""+(CInputs.getChildren().size()+1)); CPointF.setCritF(CInputs); CInputs.addChild(CPointF); CInputs.setIsLeaf(false);}
				else if(LinkType.equals("Precondition")){ CPointF.setPosition(CPreconditions.getPosition()+""+(CPreconditions.getChildren().size()+1)); CPointF.setCritF(CPreconditions); CPreconditions.addChild(CPointF); CPreconditions.setIsLeaf(false);}
				else if(LinkType.equals("Resource")){ CPointF.setPosition(CResources.getPosition()+""+(CResources.getChildren().size()+1)); CPointF.setCritF(CResources); CResources.addChild(CPointF); CResources.setIsLeaf(false); }
				else if(LinkType.equals("Control")){ CPointF.setPosition(CControls.getPosition()+""+(CControls.getChildren().size()+1)); CPointF.setCritF(CControls); CControls.addChild(CPointF); CControls.setIsLeaf(false);}
				else if(LinkType.equals("Time")){ CPointF.setPosition(CTimes.getPosition()+""+(CTimes.getChildren().size()+1)); CPointF.setCritF(CTimes); CTimes.addChild(CPointF); CTimes.setIsLeaf(false);}
				
				CPointF.setIsLeaf(true);
			}
		}
		// Ale: Consistency Check. Checks if the node has only a child, in that case the Criteria is removed and changed with its son
		CInputs = checkChildrenConsistency(CInputs);
		CPreconditions = checkChildrenConsistency(CPreconditions);
		CResources = checkChildrenConsistency(CResources);
		CControls = checkChildrenConsistency(CControls);
		CTimes = checkChildrenConsistency(CTimes);
		
		model_criteria.addChild(CInputs); model_criteria.addChild(CPreconditions); model_criteria.addChild(CResources); model_criteria.addChild(CControls); model_criteria.addChild(CTimes);
		return "true";
	}
	
	private boolean checkForCycle(Criteria C_to_check){
		Criteria C_in_path = C_to_check.getFather();
		while(C_in_path!=null){
//			System.out.println("\n CHecks: 1 "+C_in_path.getPosition()+" id:"+C_in_path.getModelId()+" 2"+C_to_check.getPosition()+" id:"+C_to_check.getModelId());
			if(C_in_path.getModelId() == C_to_check.getModelId()) return true; // Cycle detected	
			C_in_path  = C_in_path.getFather();
		}
		return false;
	}
	
	/**Ale
	 * Checks if the user is already present among the users in the SmartDS. Chevck based by the email.
	 * @param urlToRead
	 * @return
	 * @throws Exception
	 */
//	private String checkUserInSmartDS(String urlToRead) throws Exception {
//	      StringBuilder result = new StringBuilder();
//	      URL url = new URL(urlToRead);
//	      HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//	      conn.setRequestMethod("GET");
//	      BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
//	      String line;
//	      while ((line = rd.readLine()) != null) {
//	         result.append(line);
//	      }
//	      rd.close();
//	      return result.toString();
//	   }
	/**Ale
	 * Check the consistency for the SmartDS model
	 * @param father
	 * @return the father or the children if is lonely
	 */
	private Criteria checkChildrenConsistency(Criteria father){
		if(father.getChildren().size()!=1)	return father;
		else{ // Returns the child in the place of the father
			Criteria f_child = father.getChild(0);
			father.getChild(0).setCritF(father.getFather());
			String FDesc = father.getDescription();// Change the name with the reference of the father deleted
			if(FDesc.contains("Input")) f_child.setDescription("Input - "+f_child.getDescription());
			else if(FDesc.contains("Precondition")) f_child.setDescription("Precondition - "+f_child.getDescription());
			else if(FDesc.contains("Resource")) f_child.setDescription("Resource - "+f_child.getDescription());
			else if(FDesc.contains("Control")) f_child.setDescription("Control - "+f_child.getDescription());
			else if(FDesc.contains("Time")) f_child.setDescription("Time - "+f_child.getDescription());
			f_child.setPosition(father.getPosition()); 
			updateChildrenPositionsIndex(f_child); // Updates all the position
			return f_child;
		}
	}

	/** Ale
	 * Update the children position, based on the position of the father
	 * @param c
	 */
	private void updateChildrenPositionsIndex(Criteria c){
		int count = 1;
		for(Criteria cc:c.getChildren()){
			cc.setPosition(c.getPosition()+""+count);
			count++;
			updateChildrenPositionsIndex(cc); // Updates recursively all the tree
		}
	}
}
