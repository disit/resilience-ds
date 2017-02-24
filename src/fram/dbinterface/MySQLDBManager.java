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

package fram.dbinterface;

/*
* Classe dedicata alla gestione del Database.
* Gestisce l'apertura e la chiusura della connessione col Database
* Fornisce i metodi per l'esecuzione delle query sul Database
*/
import java.sql.*;
import java.util.Vector;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

public class MySQLDBManager {

	private static String dbName = ""; // Name of Database to Connect
	private static String username; // User Name used for Database connection
	private static String password; // Password used for Database connection
	private static String error; // Collect information about the last exception throwed
	private Connection db; // Database connection
	private boolean connected; // Flag that indicate connection actived or not
	
	private Context ctx = null;
	private Connection con = null;
	private Statement stmt = null;
	private ResultSet rs = null;
	
	private static MySQLDBManager instance = null;

	
	public void setParametersDB(String user, String psw, String db)
	{
	    username = user;
		password = psw;
		dbName = db;
	}
	
	public static MySQLDBManager getInstance()
	{
		if(instance == null)
			instance = new MySQLDBManager();
		return instance;
	}

	
	
	// Open Database connection
	public boolean connect() {
		
		System.out.println("Connection with database "+dbName+"...");
		connected = false;
		
		try {
			// Load driver JDBC for connection on database MySQL
			Class.forName("com.mysql.jdbc.Driver");
		
			// Control if database name is null
			if (!dbName.equals("")) {
				
				// Control if user name is useful for connection
				if (username.equals("")) {
					
					// The connection require username and password
					db = DriverManager.getConnection("jdbc:mysql://localhost/" + dbName);
					
				} else {
			
					// The connection require username and control if also the password is required
					if (password.equals("")) {
						
						// The connection doesn't require password
						db = DriverManager.getConnection("jdbc:mysql://localhost/" + dbName + "?user=" + username);
						
					} else {
	
						// The connection requires password
						db = DriverManager.getConnection("jdbc:mysql://localhost/" + dbName + "?user=" + username + "&password=" + password);
						
					}
				}
		
				// The connection is open with success
				connected = true;
				System.out.print("connected");
				
			} else {
				
				System.out.println("Database name left!!");
				System.out.println("Write database name to utilize him inside the file \"config.xml\"");
				System.exit(0);
			}
			
		} catch (Exception e) { error = e.getMessage(); e.printStackTrace(); }
		
		return connected;
	}
	
	
	// Execute query for data selection on db
	// query: a string that represent SQL instruction to execute of type SELECT
	// columns: number of columns of the result tuple
	// return a Vector containing all tuples of the result
	public Vector<String[]> executeQuery(String query) {
		
		Vector<String[]> v = null;
		String [] record;
		int columns = 0;
		try {
			
			// NUOVO CODICE  -------------
//			System.out.println("Connessione al db aperta!");
			ctx = new InitialContext();
			DataSource ds = (DataSource) ctx.lookup("java:/comp/env/jdbc/FRAMdisit_DB"); 
            
            con = ds.getConnection();
            stmt = con.createStatement();
            
//            System.out.println("\n Query executed: "+query);
            
            rs = stmt.executeQuery(query);
			// ---------------------------
			
//			Statement stmt = db.createStatement(); // Make Statement for the query execution
//			ResultSet rs = stmt.executeQuery(query); // Obtain the ResultSet of the execution of the query
			v = new Vector<String[]>();
			ResultSetMetaData rsmd = rs.getMetaData();
			columns = rsmd.getColumnCount();
		
			while(rs.next()) { // Make the result query scan all the ResultSet
				record = new String[columns];
				for (int i=0; i<columns; i++) record[i] = rs.getString(i+1);
					v.add( (String[]) record.clone() );
			}
//			rs.close(); // Close the ResultSet
//			stmt.close(); // Close the Statement
			
			/* codice aggiuntivo */
			rs.close();
            rs = null;
            stmt.close();
            stmt = null;
            con.close(); // Return to connection pool
            con = null;  // Make sure we don't close it twice
            // ------------------------------------------------------------------
            
		} catch (Exception e) { e.printStackTrace(); error = e.getMessage(); }
		
		/* Codice aggiuntivo */
	finally{
        try {
        	
//        	System.out.println("Connessione al db chiusa!");
        	if (rs != null) {
        	      try { rs.close(); } catch (SQLException e) { ; }
        	      rs = null;
        	    }
        	    if (stmt != null) {
        	      try { stmt.close(); } catch (SQLException e) { ; }
        	      stmt = null;
        	    }
        	    if (con != null) {
        	      try { con.close(); } catch (SQLException e) { ; }
        	      con = null;
        	    }
        }catch(Exception e)
        {
        	System.out.println("Exception...");
        }
//        } catch (SQLException e) {
//            System.out.println("Exception in closing DB resources");
//        } catch (NamingException e) {
//            System.out.println("Exception in closing Context");
//        }
         
    }
		/* Fine codice aggiuntivo */
	
		return v;
	}

	// Execute a query for the database update
	// query: a string that represent SQL instruction to execute of type UPDATE
	// return TRUE if the execution is gone fine - FALSE if there was an exception
	public boolean update(String query) {
		//int number = 0;
		boolean result = false;
		
		try {
			
			// NUOVO CODICE ------------
//			System.out.println("Connessione al db aperta!");
			ctx = new InitialContext();
            DataSource ds = (DataSource) ctx.lookup("java:/comp/env/jdbc/FRAMdisit_DB"); 
            con = ds.getConnection();
            stmt = con.createStatement();
            
			// ---------------------------
			
//			Statement stmt = db.createStatement();
			stmt.executeUpdate(query);
			result = true;
//			stmt.close();

            stmt.close();
            stmt = null;
            con.close(); // Return to connection pool
            con = null;  // Make sure we don't close it twice
		
		} catch (Exception e) {
		
			e.printStackTrace();
			error = e.getMessage();
			result = false;
		}	
		
			/* Codice aggiuntivo */
			finally{
		        try {
		        	
//		        	System.out.println("Connessione al db chiusa!");
	        	    if (stmt != null) {
	        	      try { stmt.close(); } catch (SQLException e) { ; }
	        	      stmt = null;
	        	    }
	        	    if (con != null) {
	        	      try { con.close(); } catch (SQLException e) { ; }
	        	      con = null;
	        	    }
		        }catch(Exception e)
		        {
		        	System.out.println("Exception...");
		        }
//		        } catch (SQLException e) {
//		            System.out.println("Exception in closing DB resources");
//		        } catch (NamingException e) {
//		            System.out.println("Exception in closing Context");
//		        }
		         
		    }
				/* Fine codice aggiuntivo */
		
		return result;
	}
		
	
	// Close Database connection
	public void disconnect() {
		System.out.println("Disconnect from database "+dbName+"...");
		try {
			db.close();
			connected = false;
			System.out.print("disconnected");
		} catch (Exception e) { e.printStackTrace(); }
	}

	public boolean isConnected() { return connected; } // Return TRUE if the connection with the Database is active
	
	public String getError() { return error; } // Return a message error of the last exception throwed

}
