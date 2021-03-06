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
  
import javax.servlet.ServletException;  
import javax.servlet.http.HttpServlet;  
import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpServletResponse;  
import javax.servlet.http.HttpSession;  

public class LogoutServlet extends HttpServlet 
{  
	private static final long serialVersionUID = 1L;
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response)  
					throws ServletException, IOException {  
        
		response.setContentType("text/html");  
        PrintWriter out=response.getWriter();  
          
        //request.getRequestDispatcher("login.html").include(request, response);  
          
        HttpSession session=request.getSession();  
        session.invalidate();  
          
        response.sendRedirect("login.html");
        //out.print("You are successfully logged out!");  
          
       // out.close();  
    } 
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response)  
			throws ServletException, IOException {  

		response.setContentType("text/html");  
		
		HttpSession session=request.getSession();  
		session.invalidate();  
		  
		response.sendRedirect("login.html"); 
	}
}  


/*
public class LogoutServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	static Logger logger = Logger.getLogger(LogoutServlet.class);
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	response.setContentType("text/html");
    	Cookie[] cookies = request.getCookies();
    	if(cookies != null){
	    	for(Cookie cookie : cookies){
	    		if(cookie.getName().equals("JSESSIONID")){
	    			logger.info("JSESSIONID="+cookie.getValue());
	    			break;
	    		}
	    	}
    	}
    	//invalidate the session if exists
    	HttpSession session = request.getSession(false);
    	logger.info("User="+session.getAttribute("User"));
    	if(session != null){
    		session.invalidate();
    	}
    	response.sendRedirect("login.html");
    }

}
*/
