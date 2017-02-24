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
//import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;
import javax.xml.bind.JAXBElement;

import fram.model.Criteria;
import fram.model.Model;
import fram.model.ModelStore;
import fram.util.Convert;
import fram.util.WriteXML;


public class CriteriaResource {
	@Context UriInfo uriInfo;
	@Context ServletContext context;
	@Context HttpServletRequest httpRequest;
	@Context HttpServletResponse httpResponse;
	String criteriaPosition;
	
	public CriteriaResource(UriInfo uriInfo,
						HttpServletRequest httpRequest,
						HttpServletResponse httpResponse,
						String criteriaPosition) {
		this.uriInfo = uriInfo;
		this.httpRequest = httpRequest;
		this.httpResponse = httpResponse;
		this.criteriaPosition = criteriaPosition;
	}
	
	
	@GET	
	@Produces(MediaType.APPLICATION_XML)
	public String getCriteriaXML() {
		
		System.out.println("- Request GET Criteria XML: "+uriInfo.getPath());
		
		int modelId = Integer.parseInt(httpRequest.getParameter("idModel"));
		Criteria criteria = ModelStore.getInstance().getModelById(modelId).getCriteria(criteriaPosition);
		Criteria criteria_to_return = criteria.returnACopyOfCriteriaWithoutChildren();
			
		return WriteXML.getInstance().writeCriteria(criteria_to_return);
	}
	
	
	@PUT
	@Consumes(MediaType.APPLICATION_XML)
	@Produces(MediaType.APPLICATION_XML)
	public String putCriteriaXML(JAXBElement<Criteria> jaxbCriteria) throws Exception {
		
		System.out.println("- Request PUT XML Criteria "+ criteriaPosition +" on model: "+uriInfo.getPath());		
//		httpRequest.setCharacterEncoding("utf-8");
//		httpResponse.setCharacterEncoding("utf-8");
		
		Criteria new_criteria = jaxbCriteria.getValue();
		new_criteria.setPosition(criteriaPosition);
		
		Model model = ModelStore.getInstance().getModelById(new_criteria.getModelId());
		model.updateCriteriaDescription(criteriaPosition, new_criteria.getDescription());	
		
		model.specifyTimestampLastModifyModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		
		return WriteXML.getInstance().writeModel(model);
	}
	
	
	
	@DELETE
	@Produces(MediaType.APPLICATION_XML)
	public String deleteCriteria() {
		
		System.out.println("- Request DELETE: "+uriInfo.getPath());
		
		int modelId = Integer.parseInt(httpRequest.getParameterValues("idModel")[0]);
		Model model = ModelStore.getInstance().getModelById(modelId);
		model.deleteCriteria(criteriaPosition);

		model.specifyTimestampLastModifyModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));
		
		return WriteXML.getInstance().writeModel(model);
	}	
	
}

