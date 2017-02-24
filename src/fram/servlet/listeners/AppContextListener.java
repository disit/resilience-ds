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

package fram.servlet.listeners;



//import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import fram.dbinterface.MySQLDBManager;

/**
 * Application Lifecycle Listener implementation class AppContextListener
 *
 */
@WebListener
public class AppContextListener implements ServletContextListener {

    /**
     * Default constructor. 
     */
    public AppContextListener() {
        // TODO Auto-generated constructor stub
    }

	/**
     * @see ServletContextListener#contextInitialized(ServletContextEvent)
     */
    public void contextInitialized(ServletContextEvent servletContextEvent)  
    { 
    	
    	String dbURL = "smart_ds_db";
    	String user = "luca";
    	String pwd = "luca1234";
    	
    	MySQLDBManager db = MySQLDBManager.getInstance();
    	db.setParametersDB(user, pwd, dbURL);
    	
//    	if ( !db.connect() ) {
//			System.out.println("Error during connection.\n"+db.getError());
//			System.exit(0);
//		}
    }

	/**
     * @see ServletContextListener#contextDestroyed(ServletContextEvent)
     */
    public void contextDestroyed(ServletContextEvent servletContextEvent)  
    { 
    	
//    	MySQLDBManager.getInstance().disconnect();
    	
//    	Connection con = (Connection) servletContextEvent.getServletContext().getAttribute("DBConnection");
//    	try {
//			con.close();
//		} catch (SQLException e) {
//			e.printStackTrace();
//		}
    }
	
}
