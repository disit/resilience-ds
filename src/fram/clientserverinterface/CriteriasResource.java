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
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.UriInfo;
import javax.xml.bind.JAXBElement;

import fram.model.Criteria;
import fram.model.Model;
import fram.model.ModelStore;
import fram.util.Convert;
import fram.util.WriteXML;


@Path("/criterias")
public class CriteriasResource {

	@Context UriInfo uriInfo;
	@Context ServletContext context;
	@Context Request request;
	@Context HttpServletRequest httpRequest;
	@Context HttpServletResponse httpResponse;
	
	
	@POST
	@Consumes(MediaType.APPLICATION_XML)
	@Produces(MediaType.APPLICATION_XML)
	public String postCriteriaXML(JAXBElement<Criteria> jaxbCriteria) throws Exception {
		
		Criteria criteria = jaxbCriteria.getValue();
		System.out.println("\n- Request POST Criteria XML with position "+criteria.getPosition()+" "+uriInfo.getPath()+" modelId="+criteria.getModelId());	
			
		Model model = ModelStore.getInstance().getModelById(criteria.getModelId()); 
		//Controllo se il criteria da aggiungere è il criterio radice o un criterio interno
		if(!criteria.getPosition().equals("C0"))
		{	
			model.addCriteria(criteria);
			model.specifyTimestampLastModifyModel(Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis())));	
		}			
		return WriteXML.getInstance().writeModel(model);

	}	
	
	//	Per qualunque chiamata al percorso di un criteria specifico viene inoltrata la richiesta al criteria specifico
	@Path("{criteriaPosition}")
	public CriteriaResource getCriteria(
			@PathParam("criteriaPosition") String criteriaPosition,
			@Context HttpServletRequest httpRequest,
			@Context HttpServletResponse httpResponse
			)
	{
		return new CriteriaResource(uriInfo, httpRequest, httpResponse, criteriaPosition);
	}
	
}
  