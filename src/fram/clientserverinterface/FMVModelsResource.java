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

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.net.MalformedURLException;
import java.net.URL;
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
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import fram.dbinterface.ModelDB;
import fram.dbinterface.ModelDBInterface;
import fram.dbinterface.ModelInstanceDB;
import fram.dbinterface.ModelInstanceDBInterface;
import fram.model.Aspect;
import fram.model.Criteria;
import fram.model.FRAMModel;
import fram.model.Function;
import fram.model.FunctionAspect;
import fram.model.Model;
import fram.model.ModelStore;
import fram.modelinstance.FRAMModelInstance;
import fram.modelinstance.FunctionInstance;
import fram.util.Convert;
import fram.util.ConvertStringToElement;
import fram.util.ModelsParserXML;
import fram.util.StringToDocumentToString;
import fram.util.WriteXML;

/*
 * Ale: Class for load a FMV model, or a JSON like the one reported in the thesis (TODO).
 */

@Path("/fmvoperations")
public class FMVModelsResource {

	@Context UriInfo uriInfo;
	@Context ServletContext context;
	@Context Request request;
	@Context HttpServletRequest httpRequest;
	@Context HttpServletResponse httpResponse;
	
	@POST
	@Consumes(MediaType.APPLICATION_XML)
	@Produces(MediaType.APPLICATION_XML)
	public String postFRAMModelXML(String xfmv) throws Exception {
		
		System.out.println("- Request POST Model XML: "+uriInfo.getPath());
		
		/*
		 * Ale 16-2-4: Functions that loads a file XML from the server. THe file must be one of FMV.
		 * Once it is loaded it is saved on the DB.
		 * FMV XML format is:
		 * <FM>
		 * 		<Functions>
		 * 			<Function fnStyle={0,1,2} Tp={0,1,2} Pp={0,1,2}><IDNR></><FunctionType></><IDName></></Funciton>
		 * 			...
		 * 		</Functions>
		 * 		<Controls>
		 * 			<Control>	
		 * 				<IDNr></><IDName></><FunctionIDNr></>
		 * 			</Control>
		 * 			...	
		 * 		</Controls>
		 * 		<Inputs>	... 	</Inputs>
		 * 		<Outputs>	...		</Outputs>
		 * 		<Preconditions>	...	</Preconditions>
		 * 		<Resources> ...		</Resources>
		 * 		<Times>		...		</Times>
		 * </FM>
		 */
		String file_name;
//		file_name="D:/xampp/htdocs/SmartDS/WebContent/data/BelliniEModel.xml";
//		file_name="D:/xampp/htdocs/SmartDS/WebContent/data/BEsystem12.xfmv";
		ModelDBInterface dbi = new ModelDB();
		ModelInstanceDBInterface MIdbi = new ModelInstanceDB();
		
		int idModel = dbi.getFreeId("model");
		int idFunction = dbi.getFreeId("function");
		
//		System.out.println("Load the file");
//		System.out.println("\n- ID for the new model: "+idModel);
		// Defined the path to the readed file 
//		File doc = new File(xfmv);
//	    URL path=null;	  
	    // create a new DocumentBuilderFactory
	    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
	    // Try catch block for intercept exceptions
	    FRAMModel model = new FRAMModel();
	    try
	    {
//	      // shows the file path.
//	      path=doc.toURL(); 
//	      System.out.println("\n- The doc is in the path: " + path);
//
//	      // shows the file's name
//	      doc=new File(path.getFile());	      
//	      // opens the input stream 
//	      InputStream is=path.openStream();
//	      // use the factory to create a document builder
	    	DocumentBuilder builder = factory.newDocumentBuilder();

	      // create a new document from input stream
//	    	Document doc_xml = builder.parse(is);
//	    	DocumentBuilder builder = factory.newDocumentBuilder();
//	    	Document doc_xml = builder.parse(doc);
	    	
            Document doc_xml = builder.parse( new InputSource( new StringReader( xfmv ) ) ); 
	    	
	    	// get the first element
	    	//	      Element element = doc_xml.getDocumentElement();
	    	Element element = doc_xml.getDocumentElement();
	    	
	    	//Ale: Gets the UserId.
	    	int userId=1;
	    	NodeList UserIdList = doc_xml.getElementsByTagName("UserId"); 
	    	for(int j=0;j<UserIdList.getLength();j++){
	    		userId = Integer.parseInt(UserIdList.item(j).getTextContent());
	    		System.out.println("\n- UserId:"+userId);
	    	}
	    	//Ale: Creates the model and saves it in the DB.
	    	model = new FRAMModel( idModel, "FMV Model",userId);
	    	FRAMModelInstance FMI = new FRAMModelInstance();
	    	int instance_id=-1;

	    	model.specifyTimestampCreateModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
	    	model.specifyTimestampLastModifyModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));

	    	// Ale: groups all the Function
	    	NodeList FRAM_functions=doc_xml.getElementsByTagName("Function");
	    	//	      System.out.println("\n- #Functions found: "+FRAM_functions.getLength());
	    	ArrayList<Function> function_list = new ArrayList<Function>(); 
	    	
	    	for(int j=0;j<FRAM_functions.getLength();j++){
	    		//	    	  System.out.println("\n- #Functions Name: "+FRAM_functions.item(j).getNodeName());

	    		//TODO: Create a model instance with this attributes.
	    		//	    	  NamedNodeMap F_attributes = FRAM_functions.item(j).getAttributes();// Retrieves fnStyle, Pp and Tp from the function.
	    		//	    	  for(int i=0;i<F_attributes.getLength();i++){
	    		//	    		  System.out.println("\n- Attr "+i+" Name: "+F_attributes.item(i).getNodeName()+" Value: "+F_attributes.item(i).getTextContent());
	    		//	    	  }

	    		NodeList F_components = FRAM_functions.item(j).getChildNodes();
	    		int x=0, y=0, type=0, idTemp, Tp=-1, Pp=-1, F_manager=0;
	    		double Dx=0, Dy=0;
	    		boolean create_instance=false;
	    		String nameFunction="", descriptionFunction="", color="#fff";

	    		if(FRAM_functions.item(j).getAttributes().getNamedItem("x")!=null){
	    			//TOCHECK for Emanuele's file
	    			Dx=Double.parseDouble(FRAM_functions.item(j).getAttributes().getNamedItem("x").getNodeValue());
	    			x=(int) Dx;
	    		}
	    		if(FRAM_functions.item(j).getAttributes().getNamedItem("y")!=null){
	    			Dy=Double.parseDouble(FRAM_functions.item(j).getAttributes().getNamedItem("y").getNodeValue());
	    			y=(int) Dy;
	    		}
	    		//XXX This 'for' below maybe could be done with elementValue.
	    		for(int i=0;i<F_components.getLength();i++){ 
	    			//Parse all the components of the function: <IDNr><FunctionType><IDName><Description>
	    			//	    		  System.out.println("\n- Component "+i+" Name: "+F_components.item(i).getNodeName()+" Value: "+F_components.item(i).getTextContent());
	    			if(F_components.item(i).getNodeName()=="IDNr"){
	    				idTemp = Integer.parseInt(F_components.item(i).getTextContent());
	    				// Ale 16-2-5: Updates the ID on the XML file, with the current ID. 	
	    				NodeList f_ToUpdate= doc_xml.getElementsByTagName("FunctionIDNr");
	    				for(int z=0;z<f_ToUpdate.getLength();z++){
	    					if(f_ToUpdate.item(z).getTextContent().equals(Integer.toString(idTemp))){
	    						doc_xml.createElement("newID");
	    						Node newField = doc_xml.createElement("newID"); //Creates a newField with a newId.
	    						newField.setTextContent(Integer.toString(idFunction));

	    						f_ToUpdate.item(z).getParentNode().appendChild(newField); //Ale: Makes a modification to the file.
	    						//	    					  System.out.println("\n-Add an element: "+idFunction);

	    						//	    					  f_ToUpdate.item(z).setTextContent(Integer.toString(idFunction));
	    						//	    					  System.out.println("\n-Update "+idTemp+" to: "+idFunction);
	    					}
	    				}
	    			}
	    			else if (F_components.item(i).getNodeName()=="FunctionType") {
	    				type = Integer.parseInt(F_components.item(i).getTextContent());
	    			}
	    			else if (F_components.item(i).getNodeName()=="IDName") {
	    				nameFunction = F_components.item(i).getTextContent();					
	    			}
	    			else if (F_components.item(i).getNodeName()=="Description") {
	    				descriptionFunction = F_components.item(i).getTextContent();					
	    			}
	    		}
	    		//Ale: To convert, Adobe air has a different style for save the color.
	    		if(FRAM_functions.item(j).getAttributes().getNamedItem("color")!=null){
	    			color = FRAM_functions.item(j).getAttributes().getNamedItem("color").getNodeValue(); //Ale: This is provided as a decimal value.
	    			
	    			Convert A = new Convert();
	    			color = A.ConvertColorDecimalToHex(color);
	    		}
	    		Function F = new Function(idFunction, nameFunction, descriptionFunction, x, y, color, type, idModel);
	    		/*
	    		 * Ale: Checks if Pp and Tp are specified. In that case creates a instantiation, or, 
	    		 * if it's already present use the same and updates model_function.
	    		 */
	    		if(FRAM_functions.item(j).getAttributes().getNamedItem("Tp")!=null){
	    			Tp=Integer.parseInt(FRAM_functions.item(j).getAttributes().getNamedItem("Tp").getNodeValue());
	    			if(Tp!=-1) create_instance=true;
	    		}
	    		if(FRAM_functions.item(j).getAttributes().getNamedItem("Pp")!=null){
	    			Pp=Integer.parseInt(FRAM_functions.item(j).getAttributes().getNamedItem("Pp").getNodeValue());
	    			if(Pp!=-1) create_instance=true;
	    		}
	    		if(FRAM_functions.item(j).getAttributes().getNamedItem("fnType")!=null){
	    			F_manager=Integer.parseInt(FRAM_functions.item(j).getAttributes().getNamedItem("fnType").getNodeValue());
	    			if(F_manager!=-1) create_instance=true;
	    		}
	    		if(create_instance){
	    			System.out.println("\n-New instance: "+FMI);
	    			System.out.println("\n-instance_ID: "+instance_id);

	    			if(instance_id==-1){
	    				System.out.println("\n-New instance entered: "+FMI);
	    				instance_id=dbi.getFreeId("model_instance");
	    				System.out.println("\n-instance_ID: "+instance_id);
	    				FMI = new FRAMModelInstance(instance_id, "New Instance", userId);
	    				FMI.specifyTimestampCreateModelInstance(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
	    				FMI.specifyTimestampLastModifyModelInstance(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));

	    			}
	    			FunctionInstance FI = new FunctionInstance(FMI, F, Tp, Pp, F_manager);
	    			System.out.println("\n-FI: "+FI.getPotential_precision()+" - "+FI.getTime_precision()+" - "+FI.getFunction_manager());
	    			FMI.addFunctionInstance(FI);	 
	    		}
	    		function_list.add(F);
	    		//TODO: Insert the function in the DB and change the line above with getfreeId.
	    		idFunction++;	    	  
	      }	
//	      System.out.println("\n- Functions in the XML file: "+function_list.toString());
	      
	      //---------------SAVE-----------------
	      model.setSize(function_list.size());
	      model.setFunctions(function_list);
	      dbi.saveFRAMModel(model);
	      for( Function F:function_list ) dbi.saveFunction(F); //Saves functions.
	      System.out.println("InstanceId: "+instance_id);
	      if(instance_id!=-1){
	    	  //Ale: Saves the instance.
	    	  FMI.setFatherModel(model); //XXX To check. If removed creates error...
	    	
	    	  MIdbi.saveFRAMModelInstance(FMI);
	    	  for(FunctionInstance FI:FMI.getFunctionsInstances()) MIdbi.saveFunctionInstance(FI);
	      }
//	      Ale: Loads the Aspects.
	      ArrayList<Aspect> aspect_list = new ArrayList<Aspect>(); 

	      loadAspect("Input", aspect_list, doc_xml, dbi, model);
	      loadAspect("Output", aspect_list, doc_xml, dbi, model);
	      loadAspect("Precondition", aspect_list, doc_xml, dbi, model);
	      loadAspect("Resource", aspect_list, doc_xml, dbi, model);
	      loadAspect("Time", aspect_list, doc_xml, dbi, model);
	      loadAspect("Control", aspect_list, doc_xml, dbi, model);
	      
//	      System.out.println("\n- Aspects in the XML file: "+aspect_list.toString());
	      
	      //TODO: Make a function to populate Function.Aspects. Or a search when all loadAspect are finished
	      //or pass the vector at the function loadAspect
	      
//	      for(Aspect A:aspect_list)dbi.saveAspect(A); // Saves aspects.
	      if(instance_id!=-1) {
	    	  model.setFMI(FMI); //Adds the instance to the model.
	    	  System.out.println("\n- XML for the Instance Model: "+WriteXML.getInstance().writeFRAMModel(model));	    
//	    	  System.out.println("\n- XML for the Instance Model: "+WriteXML.getInstance().writeFRAMModelInstance(FMI));	    
	      }
	      else System.out.println("\n- XML for the Model: "+WriteXML.getInstance().writeFRAMModel(model));
	    }		
	    catch (MalformedURLException e)
	    {
	      System.out.println("Attenzione:" + e);
	    }
	    catch (IOException e)
	    {
	      System.out.println(e.getMessage());
	    }
	    catch (Exception ex) {
	    	ex.printStackTrace();
	    }	
		
		return WriteXML.getInstance().writeFRAMModel(model);
	}
	
	public void loadAspect(String type, ArrayList<Aspect> Aspects,  Document doc_xml, ModelDBInterface dbi, FRAMModel model){
		/* Ale 16-2-5: Function that load the aspects from doc_xml to Aspects. 
		 * Checks if the aspects is already present.
		 */
		NodeList FRAM_aspect=doc_xml.getElementsByTagName(type);
		System.out.println("\n- DOC XML: "+doc_xml.toString());
		int idFunction;
		int idAspect;
		String Ftype=type;
		System.out.println("\n- FRAM_Aspect: "+FRAM_aspect.getLength() +" for: "+type);
		if(FRAM_aspect.getLength()>0){
			for(int i=0; i<FRAM_aspect.getLength();i++){
				NodeList A_components = FRAM_aspect.item(i).getChildNodes();
				//TOCHECK: it's a progressive number, not used in our case.
				idFunction=-1;
				System.out.println(elementValue(FRAM_aspect.item(i).getChildNodes(), "newID"));
				//XXX Some value are null. It doesn't find the newID
				if(elementValue(FRAM_aspect.item(i).getChildNodes(), "newID")!=null) idFunction = Integer.parseInt(elementValue(FRAM_aspect.item(i).getChildNodes(), "newID"));
				System.out.println("\n-newID id: "+idFunction);
				
				//Checks if the aspect is present. Searches the same label.
				String A_label=elementValue(FRAM_aspect.item(i).getChildNodes(), "IDName");
				idAspect=findAspect(Aspects, A_label);
				if(idAspect==(-1)){
					idAspect=dbi.getFreeId("aspect");
					Aspect aNew= new Aspect(idAspect, A_label, model.getId());
					Aspects.add(aNew);
					
					//Ale: adds the aspects.
					dbi.saveAspect(aNew); 
				}
				if(idFunction!=-1){
					
					FunctionAspect FA = new FunctionAspect(idFunction,idAspect,Ftype);
					dbi.saveFunctionAspect(FA);
				}
//				System.out.println("\n-function-aspect to add: F:"+idFunction+" A:"+idAspect+" type:"+Ftype);
				//TODO: adds the line in 'function_aspect' db. idFunction, idAspect, type			
			}
		}
	}
	
	public String elementValue(NodeList n, String tag){
		//Ale: Returns the value of the sub elements with tag = 'tag'.
		for(int i=0;i<n.getLength();i++){
			if(n.item(i).getNodeName()==tag) return n.item(i).getTextContent();
		}
		return null;
	}
	
	public int findAspect(ArrayList<Aspect> Aspects, String label){
		for(Aspect a : Aspects){
			if(a.getLabel().equals(label)) return a.getId();
		}
		return -1;
	}	
}
