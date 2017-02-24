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
import fram.dbinterface.ModelInstanceDB;
import fram.dbinterface.ModelInstanceDBInterface;
import fram.model.FRAMModel;
import fram.model.Model;
import fram.model.ModelStore;
import fram.modelinstance.FRAMModelInstance;
import fram.modelinstance.ModelInstance;
import fram.modelinstance.ModelInstanceStore;
import fram.util.Convert;
import fram.util.FRAMModelInstancesParserXML;
import fram.util.ModelInstancesParserXML;
import fram.util.WriteXML;


@Path("/modelinstances")
public class ModelInstancesResource {

	@Context UriInfo uriInfo;
	@Context ServletContext context;
	@Context Request request;
	@Context HttpServletRequest httpRequest;
	@Context HttpServletResponse httpResponse;
	
	
	@GET
	@Produces(MediaType.APPLICATION_XML)
	/** Ale
	 * Returns a list of model instances present on the server.
	 * @return
	 */
	public String getModelsInstancesXML() {
		System.out.println("\n- Request GET Models Instances: "+uriInfo.getPath());
		FRAMModelInstancesParserXML miParser = new FRAMModelInstancesParserXML();
//		ModelInstancesParserXML miParser = new ModelInstancesParserXML();
		ModelInstanceDBInterface dbi = new ModelInstanceDB();
		miParser.setModelInstancesListFromDB(dbi.retrieveListModelInstances());
		
		String response = new String();
		if(miParser.getModelInstancesList().size() != 0)
			response = WriteXML.getInstance().writeFRAMModelInstances(miParser);
		return response;		
	}
		
	@POST
	@Consumes(MediaType.APPLICATION_XML)
	@Produces(MediaType.APPLICATION_XML)
	public String postFRAMModelInstanceXML(JAXBElement<FRAMModelInstance> jaxbModelInstance) throws Exception {
		System.out.println("- Request POST FRAMModelInstance XML: "+uriInfo.getPath());
		
		FRAMModelInstance model_inst_tmp = jaxbModelInstance.getValue();
		ModelInstanceDBInterface dbi = new ModelInstanceDB();
		
		int modelInstanceId = 0;
		if(ModelInstanceStore.getInstance().getNumModelInstancesTmp() == 0)
			modelInstanceId = dbi.getFreeId("model_instance");
		else
			modelInstanceId = ModelInstanceStore.getInstance().getMaxIdModelInstancesTmp()+1;
		
		// Caricamento modello da database se questo non è presente nello Store
		if(ModelStore.getInstance().getFRAMModelById(model_inst_tmp.getId()) == null)
		{
			ModelDBInterface mdbi = new ModelDB();
			FRAMModel model = mdbi.loadFRAMModel(model_inst_tmp.getId());
			ModelStore.getInstance().addFRAMModelLoadedFromDB(model);
		}
		System.out.println("\n ModelInst id: "+modelInstanceId);
		FRAMModelInstance model_inst = new FRAMModelInstance(modelInstanceId, model_inst_tmp.getDescriptionInstance(), model_inst_tmp.getUserInstanceId(), ModelStore.getInstance().getFRAMModelById(model_inst_tmp.getId()));
		
		model_inst.specifyTimestampCreateModelInstance(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		model_inst.specifyTimestampLastModifyModelInstance(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		
		ModelInstanceStore.getInstance().addFRAMModelInstance(model_inst); 
//		System.out.println(WriteXML.getInstance().writeFRAMModelInstance(model_inst)); 
		
		return WriteXML.getInstance().writeFRAMModelInstance(model_inst);
	}
	//OLD
	public String postModelInstanceXML(JAXBElement<ModelInstance> jaxbModelInstance) throws Exception {
		System.out.println("- Request POST ModelInstance XML: "+uriInfo.getPath());
		
		ModelInstance model_inst_tmp = jaxbModelInstance.getValue();
		ModelInstanceDBInterface dbi = new ModelInstanceDB();

		int modelInstanceId=0;
		if(ModelInstanceStore.getInstance().getNumModelInstancesTmp() == 0)
			modelInstanceId = dbi.getFreeId("model_instance");
		else
			modelInstanceId = ModelInstanceStore.getInstance().getMaxIdModelInstancesTmp()+1;

		// Caricamento modello da database se questo non è presente nello Store
		if(ModelStore.getInstance().getModelById(model_inst_tmp.getId()) == null)
		{
			ModelDBInterface mdbi = new ModelDB();
			Model model = mdbi.loadModel(model_inst_tmp.getId());
			ModelStore.getInstance().addModelLoadedFromDB(model);
		}
		
		ModelInstance model_inst = new ModelInstance(modelInstanceId, model_inst_tmp.getSpecificObjective(), model_inst_tmp.getUserInstanceId(), ModelStore.getInstance().getModelById(model_inst_tmp.getId()));

		model_inst.specifyTimestampCreateModelInstance(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		model_inst.specifyTimestampLastModifyModelInstance(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		
		ModelInstanceStore.getInstance().addModelInstance(model_inst); 
		
		return WriteXML.getInstance().writeModelInstance(model_inst);
	}
	
	
	@DELETE 
	@Produces(MediaType.APPLICATION_XML)
	public String deleteTemporaryModelInstances() {
		
		System.out.println("- Request DELETE Model Intances temporary: "+uriInfo.getPath());
		int userId = Integer.parseInt(httpRequest.getParameterValues("idUser")[0]);
		ModelInstanceStore.getInstance().deleteModelInstancesTmpUser(userId);
		return new String();
		
	}
	
	//	Per qualunque chiamata al percorso di un model instance specifico viene inoltrata la richiesta al model instance specifico
	@Path("{modelInstanceId}")
	public ModelInstanceResource getModelInstance(
			@PathParam("modelInstanceId") String modelInstanceId,
			@Context HttpServletRequest httpRequest,
			@Context HttpServletResponse httpResponse
			)
	{
		return new ModelInstanceResource(uriInfo, httpRequest, httpResponse, Integer.parseInt(modelInstanceId));
	}
}
