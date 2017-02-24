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

package fram.util;

import java.io.StringWriter;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.annotation.*;

import fram.dbinterface.ModelDB;
import fram.model.Aspect;
import fram.model.AspectForClient;
import fram.model.Criteria;
import fram.model.FRAMModel;
import fram.model.Function;
import fram.model.Model;
import fram.modelinstance.CriteriaInstance;
import fram.modelinstance.FRAMModelInstance;
import fram.modelinstance.ModelInstance;
import fram.user.User;

import org.eclipse.persistence.jaxb.MarshallerProperties;
import org.openrdf.query.algebra.Or;
import org.eclipse.persistence.jaxb.JAXBContextFactory;

public class WriteXML {

	private static WriteXML instance;
	
	public static WriteXML getInstance() //Singleton. 
	{
		if(instance == null)
			instance = new WriteXML();
		return instance;
	}
	
	public String writeModel(Model model)
	{
		StringWriter sw = new StringWriter();
		try {
			Marshaller jaxbMarshaller = JAXBContext.newInstance(Model.class).createMarshaller();
			jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
			jaxbMarshaller.marshal(model, sw);
		} catch (Exception e) {e.printStackTrace();}
		return sw.toString();
	}
	//Ale: Function that return a json with the FRAM model.
	public String writeFRAMModel(FRAMModel model)
	{
		StringWriter sw = new StringWriter();
		try {
			
//			System.out.println(System.getProperty("java.runtime.version"));
			Marshaller jaxbMarshaller = JAXBContext.newInstance(FRAMModel.class).createMarshaller();
			jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
			jaxbMarshaller.marshal(model, sw);
			
//			System.out.println(org.eclipse.persistence.Version.getVersion());
//			JAXBContext jc = JAXBContextFactory.createContext("com.core.mymodel", null);
			
//			System.out.println(JAXBContext.newInstance(FRAMModel.class).getClass());
			
//	        System.out.println(JAXBContext.newInstance(Aspect.class).getClass());
//	        System.out.println(JAXBContext.newInstance(Foo.class, Bar.class).getClass());
//			Marshaller jaxbMarshaller = JAXBContext.newInstance(FRAMModel.class, Function.class, WriteXML.class, ModelDB.class, Aspect.class).createMarshaller();
//			System.out.println("jaxbMarshaller Class: "+jaxbMarshaller.getClass());
			// Set the Marshaller media type to JSON or XM
//			jaxbMarshaller.setProperty(MarshallerProperties.MEDIA_TYPE, "application/json");
//			
//			// Set it to true if you need to include the JSON root element in the JSON output
//			jaxbMarshaller.setProperty(MarshallerProperties.JSON_INCLUDE_ROOT, true);
//			
//			// Set it to true if you need the JSON output to formatted
//			jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
//
//			jaxbMarshaller.marshal(model, System.out);
////			jaxbMarshaller.setProperty(MarshallerProperties.MEDIA_TYPE, "application/json");
//			jaxbMarshaller.marshal(model, sw);
		} catch (Exception e) {e.printStackTrace();}
		return sw.toString();
	}
	
	public String writeModels(ModelsParserXML models)
	{
		StringWriter sw = new StringWriter();
		try {
			Marshaller jaxbMarshaller = JAXBContext.newInstance(ModelsParserXML.class).createMarshaller();
			jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
			jaxbMarshaller.marshal(models, sw);
		} catch (Exception e) {e.printStackTrace();}
		return sw.toString();
	}
	
	public String writeModelInstance(ModelInstance model_instance)
	{
		StringWriter sw = new StringWriter();
		try {
			Marshaller jaxbMarshaller = JAXBContext.newInstance(ModelInstance.class).createMarshaller();
			jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
			jaxbMarshaller.marshal(model_instance, sw);
		} catch (Exception e) {e.printStackTrace();}
		return sw.toString();
	}
	//Ale: writes FRAM Model instance to the Client.
	public String writeFRAMModelInstance(FRAMModelInstance model_instance)
	{
		StringWriter sw = new StringWriter();
		try {
			Marshaller jaxbMarshaller = JAXBContext.newInstance(FRAMModelInstance.class).createMarshaller();
			jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
			jaxbMarshaller.marshal(model_instance, sw);
		} catch (Exception e) {e.printStackTrace();}
		return sw.toString();
	}
	
	public String writeModelInstances(ModelInstancesParserXML modelinstances)
	{
		StringWriter sw = new StringWriter();
		try {
			Marshaller jaxbMarshaller = JAXBContext.newInstance(ModelInstancesParserXML.class).createMarshaller();
			jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
			jaxbMarshaller.marshal(modelinstances, sw);
		} catch (Exception e) {e.printStackTrace();}
		return sw.toString();
	}
	
	public String writeFRAMModelInstances(FRAMModelInstancesParserXML modelinstances)
	{
		StringWriter sw = new StringWriter();
		try {
			Marshaller jaxbMarshaller = JAXBContext.newInstance(FRAMModelInstancesParserXML.class).createMarshaller();
			jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
			jaxbMarshaller.marshal(modelinstances, sw);
		} catch (Exception e) {e.printStackTrace();}
		return sw.toString();
	}
	
	public String writeCriteria(Criteria criteria)
	{
		StringWriter sw = new StringWriter();
		try {
			Marshaller jaxbMarshaller = JAXBContext.newInstance(Criteria.class).createMarshaller();
			jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
			jaxbMarshaller.marshal(criteria, sw);
		} catch (Exception e) {e.printStackTrace();}
		return sw.toString();
	}
	
	public String writeCriteriaInstance(CriteriaInstance criteria_instance)
	{
		StringWriter sw = new StringWriter();
		try {
			Marshaller jaxbMarshaller = JAXBContext.newInstance(CriteriaInstance.class).createMarshaller();
			jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
			jaxbMarshaller.marshal(criteria_instance, sw);
		} catch (Exception e) {e.printStackTrace();}
		return sw.toString();
	}
	
	public String writeUserData(User user)
	{
		StringWriter sw = new StringWriter();
		try {
			Marshaller jaxbMarshaller = JAXBContext.newInstance(User.class).createMarshaller();
			jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
			jaxbMarshaller.marshal(user, sw);
		} catch (Exception e) {e.printStackTrace();}
		return sw.toString();
	}
}
