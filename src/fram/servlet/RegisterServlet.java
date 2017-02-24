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
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import fram.dbinterface.UserDB;
import fram.dbinterface.UserDBInterface;


/**
 * Servlet implementation class RegisterServlet
 */

public class RegisterServlet extends HttpServlet 
{
	private static final long serialVersionUID = 1L;
       
	protected void doPost(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		
		PrintWriter out= response.getWriter();
		
		request.getRequestDispatcher("register.html").include(request, response); 
		
		String email = request.getParameter("email");
		String password = request.getParameter("pass");
		String name = request.getParameter("name");
		String country = request.getParameter("country");
		String typeRegister = request.getParameter("typeRegister");
		
		UserDBInterface udi = new UserDB();
		if(!udi.checkUserAlreadyPresent(email))
		{
			if(!udi.registerUser(name, email, country, password, 2))
			{
				if(typeRegister.equals("external"))
				{
					out.println("<script type=\"text/javascript\">");
	        		out.println("warningNoRegistration();");
	        		out.println("</script>");
				}	
				else{
					request.setAttribute("messageError", "Registration error. Try again...");
				    request.getRequestDispatcher("/home.jsp").forward(request,response);
				}
			}
			else
			{
				if(typeRegister.equals("external"))
				{
					// Registrazione andata a buon fine - redirect in login.html  
					out.println("<script type=\"text/javascript\">");
	        		out.println("alert(\"Registration succesfull!\");");
	        		out.println("registrationComplete();");
	        		out.println("</script>");
				}	
				else{
					request.setAttribute("messageError", "Registration succesfull. Login now...");
				    request.getRequestDispatcher("/home.jsp").forward(request,response);
				}
			}
		}
		else{
			if(typeRegister.equals("external"))
			{
				out.println("<script type=\"text/javascript\">");
        		out.println("warningEmailFounded();");
        		out.println("</script>");
			}	
			else{
				request.setAttribute("messageError", "Email user already used! Please change email...");
			    request.getRequestDispatcher("/home.jsp").forward(request,response);
			}
		}
			
	}
}
