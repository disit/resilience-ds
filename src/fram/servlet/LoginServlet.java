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

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;  
import javax.servlet.http.HttpServlet;  
import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpServletResponse;  
import javax.servlet.http.HttpSession;  

import fram.dbinterface.UserDB;
import fram.dbinterface.UserDBInterface;
import fram.user.*;


public class LoginServlet extends HttpServlet 
{  
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)  
                    throws ServletException, IOException {
		
        response.setContentType("text/html");  
        PrintWriter out = response.getWriter();  
        
        request.getRequestDispatcher("login.html").include(request, response);  
          
        String email = request.getParameter("email");  
        String password = request.getParameter("password");
        String guest = request.getParameter("guest");
        String typeLogin = request.getParameter("typeLogin");
        
        if(guest == null)
        {
        	UserDBInterface udi = new UserDB();
        	User user = udi.retrieveUser(email, password);
        	
    		if(user != null)
    		{	
    			HttpSession session = request.getSession();
    			session.setAttribute("User", user);
    			
    			if(user.getType() == 4)
    			{
    				session.setAttribute("Users", udi.getUsers());  
    			}
    			
//				request.setAttribute("messageError", "");
				String encodedURL = response.encodeRedirectURL("home.jsp");
				response.sendRedirect(encodedURL);
			}
			else {
				String message = "No user found with given email id and password, please register first.";
				
				if(typeLogin.equals("external"))
				{					
					out.println("<script type=\"text/javascript\">");
            		out.println("warningEmailPass();");
            		out.println("</script>");
				}
				else{
				    request.setAttribute("messageError", message);
				    request.getRequestDispatcher("/home.jsp").forward(request,response);
				}
			}			
        }
        else
        {
        	HttpSession session = request.getSession();
        	User user = new UserBasic("Guest", "guest@guest.com", "Italy", 0, 1);
        	session.setAttribute("User", user);
        	
        	String encodedURL = response.encodeRedirectURL("home.jsp");
        	request.setAttribute("messageError", "");
        	response.sendRedirect(encodedURL);
//	        request.getRequestDispatcher(encodedURL).forward(request,response);
        }
    }  
}
