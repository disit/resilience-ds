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






import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;
import javax.xml.bind.JAXBElement;

import fram.dbinterface.ModelInstanceDB;
import fram.dbinterface.ModelInstanceDBInterface;
import fram.modelinstance.CriteriaInstance;
import fram.modelinstance.ModelInstance;
import fram.modelinstance.ModelInstanceStore;
import fram.util.Convert;
import fram.util.WriteXML;

@Path("/criteriasinstance/{criteriaInstancePosition}")
public class CriteriaInstanceResource {

	@Context UriInfo uriInfo;
	@Context ServletContext context;
	@Context HttpServletRequest httpRequest;
	@Context HttpServletResponse httpResponse;
	@PathParam("criteriaInstancePosition") String criteriaInstancePosition;
	
	
	
	@GET	
	@Produces(MediaType.APPLICATION_XML)
	public String getCriteriaInstanceXML() {
		
		System.out.println("- Request GET Criteria Instance XML: "+uriInfo.getPath());
		
		int modelInstanceId = Integer.parseInt(httpRequest.getParameterValues("idModelInstance")[0]);		
		CriteriaInstance criteria_instance = ModelInstanceStore.getInstance().getModelInstances(modelInstanceId, 0).get(0).getCriteriaInstance(criteriaInstancePosition);
		CriteriaInstance criteria_instance_to_return = criteria_instance.returnACopyOfCriteriaInstanceWithoutChildren();
		
		return WriteXML.getInstance().writeCriteriaInstance(criteria_instance_to_return);
	}
	
	
	
	@PUT
	@Consumes(MediaType.APPLICATION_XML)
	@Produces(MediaType.APPLICATION_XML)
	public String putCriteriaXML(JAXBElement<CriteriaInstance> jaxbCriteriaInstance) throws Exception {
		
		System.out.print("- Request PUT XML Criteria Instance "+ criteriaInstancePosition +" on model instance: "+uriInfo.getPath());		

		CriteriaInstance new_criteria_instance = jaxbCriteriaInstance.getValue();
		new_criteria_instance.setPosition(criteriaInstancePosition);
		
//		System.out.println("Model instance id: "+new_criteria_instance.getModelInstanceId());
//		System.out.println("Query: "+new_criteria_instance.getFunctionManager().getFunction1().getQuery());
//		System.out.println("Repository SPARQL: "+new_criteria_instance.getFunctionManager().getSPARQLRepository());
			
		ModelInstance model_instance = ModelInstanceStore.getInstance().getModelInstances(new_criteria_instance.getModelInstanceId(), 0).get(0);
		String str = "", str2="";
		int type = -1;
		
//		System.out.println("\nGET URL: "+new_criteria_instance.getUrl()+"   GET COMMENT: "+new_criteria_instance.getComment()+"\n");
		
		if(new_criteria_instance.getUrl() != null)
		{
			System.out.print(" -> Change URL");
			str = new_criteria_instance.getUrl();
			type = 1;
		}
		if(new_criteria_instance.getComment() != null)
		{
			System.out.print(" -> Change Comment");
			str2 = new_criteria_instance.getComment();
			type = 1;
		}
		if(new_criteria_instance.getMatrixSerialized() != null)
		{
			System.out.print(" -> Change Matrix Comparison");
			str = new_criteria_instance.getMatrixSerialized();
			type = 2;
		}
		else if(new_criteria_instance.getWeightsSerialized() != null)
		{
			System.out.print(" -> Change Vector Weights");
			str = new_criteria_instance.getWeightsSerialized();
			type = 3;
		}
		else if(new_criteria_instance.getFunctionManager() != null) //LogicFunctionManager setted
		{
//			String query_modify = new_criteria_instance.getFunctionManager().getFunction1().getQuery();
//			query_modify = query_modify.replaceAll("#P_ANG_OPEN#" , "<");
//			query_modify = query_modify.replaceAll("#P_ANG_CLOSE#", ">");
//			new_criteria_instance.getFunctionManager().getFunction1().setQuery(query_modify);
//			
//			if(new_criteria_instance.getFunctionManager().getFunction2() != null){
//				String query_modify2 = new_criteria_instance.getFunctionManager().getFunction2().getQuery();
//				query_modify2 = query_modify2.replaceAll("#P_ANG_OPEN#" , "<");
//				query_modify2 = query_modify2.replaceAll("#P_ANG_CLOSE#", ">");
//				new_criteria_instance.getFunctionManager().getFunction2().setQuery(query_modify2);
//			}
			
			
			
			System.out.print(" -> Change LogicFunctionManager");
			
			type = 4;
		}
		else if(new_criteria_instance.getIFInsert() != null)
		{
			System.out.print(" -> Change Italian Flag");
			str = String.valueOf(new_criteria_instance.getIFInsert().getGreen())+","+String.valueOf(new_criteria_instance.getIFInsert().getWhite())+","+
										String.valueOf(new_criteria_instance.getIFInsert().getRed());
			type = 5;
		}
		System.out.println("\n");
		
		if(type == 1)
		{
			// Save data on db
			ModelInstanceDBInterface midbi = new ModelInstanceDB();
			midbi.saveModelInstanceInfoCriteria(new_criteria_instance, model_instance.getId(), model_instance.getMIId());
		}
		else
			model_instance.setStatus(0);

		model_instance.specifyTimestampLastModifyModelInstance(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		model_instance.updateCriteriaClientRequest(criteriaInstancePosition, str, str2, new_criteria_instance, type);
		
		return WriteXML.getInstance().writeCriteriaInstance(model_instance.getCriteriaInstance(criteriaInstancePosition));
		
	}
	
}
