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
import fram.model.Criteria;
import fram.model.FRAMModel;
import fram.model.Model;
import fram.model.ModelStore;
import fram.util.Convert;
import fram.util.ModelsParserXML;
import fram.util.WriteXML;

/*
 * Ale: Class for load a FMV model, or a JSON like the one reported in the thesis (TODO).
 */

@Path("/models")
public class ModelsResource {

	@Context UriInfo uriInfo;
	@Context ServletContext context;
	@Context Request request;
	@Context HttpServletRequest httpRequest;
	@Context HttpServletResponse httpResponse;
	
	
	@GET
	@Produces(MediaType.APPLICATION_XML)
	/** Ale.
	 * Returns a list for all the models presented in the DB.
	 * @return
	 */
	public String getModelsXML() {
		System.out.println("\n- Request GET Models: "+uriInfo.getPath());
		ModelsParserXML modelsParser = new ModelsParserXML(); //TODO Modify for the FRAM model.
		ModelDBInterface dbi = new ModelDB();
		modelsParser.setModelsListFromDB(dbi.retrieveListModels());
		return WriteXML.getInstance().writeModels(modelsParser);		
	}

	@POST
	@Consumes(MediaType.APPLICATION_XML)
	@Produces(MediaType.APPLICATION_XML)
	public String postFRAMModelXML(JAXBElement<FRAMModel> jaxbModel) throws Exception {
		
		System.out.println("- Request POST Model XML: "+uriInfo.getPath());
		
		FRAMModel model_stream = jaxbModel.getValue();
		ModelDBInterface dbi = new ModelDB();
		
		int modelId=0;
		if(ModelStore.getInstance().getNumModelsTmp() == 0)
			modelId = dbi.getFreeId("model");
		else
			modelId = ModelStore.getInstance().getMaxIdModelsTmp()+1;
		
		FRAMModel model = new FRAMModel();
		model.setId(modelId);
		model.setObjective(model_stream.getObjective());
		model.setDescriptionModel(model_stream.getDescriptionModel());
		model.setModelUserId(model_stream.getModelUserId());
		
		
//		Timestamp create_time = dbi.getFRAMModelCreateTime(modelId);
//		System.out.println("Model present. Date:"+create_time );
//		
//		if(create_time == null){
//			model.specifyTimestampCreateModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
//			System.out.println("Model not present. New Date.");
//		}
//		else model.specifyTimestampCreateModel(create_time);
		 
		model.specifyTimestampCreateModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		model.specifyTimestampLastModifyModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		
		ModelStore.getInstance().removeModel(modelId);		//XXX Removes the previous model of the FRAM
		ModelStore.getInstance().addFRAMModel(model);
		
		return WriteXML.getInstance().writeFRAMModel(model);
	}
	//TODO old.
	public String postModelXML(JAXBElement<Model> jaxbModel) throws Exception {
		
		System.out.println("- Request POST Model XML: "+uriInfo.getPath());
		
		Model model_stream = jaxbModel.getValue();
		ModelDBInterface dbi = new ModelDB();
		
		int modelId=0;
		if(ModelStore.getInstance().getNumModelsTmp() == 0)
			modelId = dbi.getFreeId("model");
		else
			modelId = ModelStore.getInstance().getMaxIdModelsTmp()+1;
		
		Model model = new Model();
		model.setId(modelId);
		model.setObjective(model_stream.getObjective());
		model.setDescriptionModel(model_stream.getDescriptionModel());
		model.setModelUserId(model_stream.getModelUserId());
		model.setUrl(model_stream.getUrl());
		
		model.specifyTimestampCreateModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		model.specifyTimestampLastModifyModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		
		model.setRootCriteria(new Criteria("C0", model.getObjective(), null, modelId));
		ModelStore.getInstance().addModel(model);
		
		return WriteXML.getInstance().writeModel(model);
	}
	
	
	@DELETE 
	@Produces(MediaType.APPLICATION_XML)
	public String deleteTemporaryModelInstances() {
		
		System.out.println("- Request DELETE Models temporary: "+uriInfo.getPath());
		int userId = Integer.parseInt(httpRequest.getParameterValues("idUser")[0]);
		ModelStore.getInstance().deleteModelsTmpUser(userId);
		return new String();
		
	}
	
	
	/*
	 * Ale: For every call to a specific model path a request is forwarded at the specific model.
	 */
//	@Produces(MediaType.APPLICATION_XML)
	@Path("{modelId}")
	public ModelResource getJSONModel(
			@PathParam("modelId") String modelId,
			@Context HttpServletRequest httpRequest,
			@Context HttpServletResponse httpResponse
			)
	{
//		System.out.println("Modello risorsa da modificare: "+modelId);
		return new ModelResource(uriInfo, httpRequest, httpResponse, Integer.parseInt(modelId));
	}
	
	//	Per qualunque chiamata al percorso di un model specifico viene inoltrata la richiesta al model specifico
	public ModelResource getModel(
			@PathParam("modelId") String modelId,
			@Context HttpServletRequest httpRequest,
			@Context HttpServletResponse httpResponse
			)
	{
//		System.out.println("Modello risorsa da modificare: "+modelId);
		return new ModelResource(uriInfo, httpRequest, httpResponse, Integer.parseInt(modelId));
	}
	
}
