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

package fram.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import fram.dbinterface.UserDB;
import fram.dbinterface.UserDBInterface;
import fram.user.User;

/**
 * Servlet implementation class ModifyServlet
 */
public class ModifyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ModifyServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		
		String email = request.getParameter("email");  
        String password = request.getParameter("password");
        String name = request.getParameter("name");
        String country = request.getParameter("country");
        String typeModify = request.getParameter("typeModify");


        boolean modifyOk;
        UserDBInterface udi = new UserDB();
        if(typeModify.equals("all"))
        	modifyOk = udi.modifyUser(email, password, name, country);
        else{
        	String emailToModify = request.getParameter("emailToModify");
        	int typeUser = Integer.parseInt(request.getParameter("selectType"));
        	System.out.println("Tipo utente: "+ typeUser);
        	System.out.println("Email admin: "+ emailToModify);
//        	modifyOk = udi.modifyUserType(emailToModify, typeUser);
        }
    		
    	String encodedURL = response.encodeRedirectURL("home.jsp");
		response.sendRedirect(encodedURL);
	}

}
