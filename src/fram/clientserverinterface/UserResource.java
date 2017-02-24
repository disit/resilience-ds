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
import javax.ws.rs.core.Request;
import javax.ws.rs.core.UriInfo;
import javax.xml.bind.JAXBElement;

import fram.dbinterface.UserDB;
import fram.dbinterface.UserDBInterface;
import fram.user.User;
import fram.util.WriteXML;

@Path("/users/{userId}")
public class UserResource {

	@Context UriInfo uriInfo;
	@Context ServletContext context;
	@Context Request request;
	@Context HttpServletRequest httpRequest;
	@Context HttpServletResponse httpResponse;
	@PathParam("userId") int userId;
	
	@GET
	@Produces(MediaType.APPLICATION_XML)
	public String getUserXML() {
		
		System.out.println("- Request GET User XML: "+uriInfo.getPath());	
		UserDBInterface udi = new UserDB();
		User user = udi.infoUser(userId);
		return WriteXML.getInstance().writeUserData(user);
		
	}
	
	
	@PUT
	@Consumes(MediaType.APPLICATION_XML)
	@Produces(MediaType.APPLICATION_XML)
	public String modifyUserXML(JAXBElement<User> jaxbUser) {	
		System.out.println("- Request PUT User XML (Modify User Data): "+uriInfo.getPath());
		
		User user = jaxbUser.getValue();
		UserDBInterface udi = new UserDB();
		
		System.out.println("Tipo utente: "+ user.getType());
		
		if(user.getType() != 0)
		{	
	    	System.out.println("Tipo utente: "+ user.getType());
	    	System.out.println("Email admin: "+ user.getEmail());
	    	udi.modifyUserType(userId, user.getType());
	    }
		else
	    	udi.modifyUser(user.getEmail(), user.getPassword(), user.getName(), user.getCountry());
	    
		user.setId(userId);
		return WriteXML.getInstance().writeUserData(user);
	}	
}

