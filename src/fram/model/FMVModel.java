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

package fram.model;

import java.io.*;
import java.net.*;
import java.sql.Timestamp;
import java.util.ArrayList;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;
import javax.xml.bind.JAXBElement;
import javax.xml.parsers.*;//Ale: for parse the xml file.

import fram.dbinterface.ModelDB;
import fram.dbinterface.ModelDBInterface;
import fram.dbinterface.ModelInstanceDB;
import fram.dbinterface.ModelInstanceDBInterface;
//import fram.modelinstance.CriteriaInstance;
import fram.modelinstance.FRAMModelInstance;
import fram.modelinstance.FunctionInstance;
import fram.modelinstance.ModelInstanceStore;
import fram.util.Convert;
import fram.util.WriteXML;


//For parse the XML
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.eclipse.persistence.jaxb.*;

import com.sun.org.apache.xpath.internal.operations.Bool;

/*
 * Ale: Class that translate a model provided from FMV (version or before) and translate in the one used from this tool.
 * This model is saved in the DB.
 * 
 */
public class FMVModel {
	@Context UriInfo uriInfo;
	@Context ServletContext context;
	@Context HttpServletRequest httpRequest;
	@Context HttpServletResponse httpResponse;
	int modelId;
	
	public FMVModel(UriInfo uriInfo,
						HttpServletRequest httpRequest,
						HttpServletResponse httpResponse,
						int modelId) {
		this.uriInfo = uriInfo;
		this.httpRequest = httpRequest;
		this.httpResponse = httpResponse;
		this.modelId = modelId;
	}	
	
	@GET
	@Produces(MediaType.APPLICATION_XML)
	public String getModelXML() {
		/*
		 * Ale 16-2-10: The methods that loads an FMV is done. For go further just create a function that send the file selected to this method.
		 * And remember to update the UserId.
		 */
		System.out.println("\n- LOAD an XML model from the file: "+uriInfo.getPath());
//		System.out.println("\n- Working directory: "+System.getProperty("user.dir"));
//		System.out.println("\n- Session directory: "+context.getHttpSession().getServletContext().getRealPath("/"));
//		System.out.println("\n- Session directory: "+httpRequest);
//		String XML_result=loadXMLModelFromFile(); //Ale: function that load an FMV file. //XXX
		
		Model model;
		if(ModelStore.getInstance().getModelById(modelId) == null)
		{	
			System.out.println("- Model "+modelId+" loaded from database");
			ModelDBInterface dbi = new ModelDB();
			model = dbi.loadModel(modelId);
			ModelStore.getInstance().addModelLoadedFromDB(model);
		}	
		else
		{	
			System.out.println("- Model "+modelId+" loaded from temporary store(ModelStore)");
			model = ModelStore.getInstance().getModelById(modelId);
		}	
		return WriteXML.getInstance().writeModel(model);	
	}
	
	public String loadXMLModelFromFile(){
		return "load";
	}
	
	
	
	@PUT
	@Consumes(MediaType.APPLICATION_XML)
	@Produces(MediaType.APPLICATION_XML)
	public String modifyDataModel(JAXBElement<Model> jaxbModel) throws Exception {
		
		System.out.println("\n- Request PUT Model XML: "+uriInfo.getPath());
		Model model_stream = jaxbModel.getValue();
		Model model = ModelStore.getInstance().getModelById(modelId);
		model.setObjective(model_stream.getObjective());
		model.setUrl(model_stream.getUrl());
		model.setDescriptionModel(model_stream.getDescriptionModel());
		model.getRootCriteria().setDescription(model_stream.getObjective());
		
		// Save data on db
		ModelDBInterface mdbi = new ModelDB();
		mdbi.saveModelInfo(model);

		// Update date_last_modify Model
		model.specifyTimestampLastModifyModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		
		return WriteXML.getInstance().writeModel(model);
		
	}
	
	@DELETE 
	@Produces(MediaType.APPLICATION_XML)
	public String deleteModel() {
		System.out.println("\n- Request DELETE Model: "+uriInfo.getPath());
		
		ModelDBInterface dbi = new ModelDB();
		ModelInstanceDBInterface mdbi = new ModelInstanceDB();
		
		// Rimozione delle istanze dallo Store e cancellazione di quelle presenti sul DB che hanno idModel  = modelId
		ModelInstanceStore.getInstance().removeModelInstances(modelId,1);
		mdbi.deleteModelInstances(modelId);
				
		// Rimozione del Modello dallo Store e cancellazione sul DB se era stato salvato
		ModelStore.getInstance().removeModel(modelId);
		dbi.deleteModel(modelId);
		
		return new String();
	}	
}
