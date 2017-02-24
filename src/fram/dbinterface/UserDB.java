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

import java.util.ArrayList;
import java.util.Vector;

import fram.user.*;

public class UserDB implements UserDBInterface {

	@Override
	public User infoUser(int id)
	{
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM user WHERE id='"+id+"';" );
		User user = new User();
		if( v.size() != 0 )
		{
			String[] record_user = v.elementAt(0);
			user.setId(Integer.parseInt(record_user[0]));
			user.setName(record_user[1]);
			user.setEmail(record_user[2]);
			user.setCountry(record_user[3]);
			user.setPassword(record_user[4]);
			user.setType(Integer.parseInt(record_user[5]));
		}
		return user;
	}
	
	@Override
	public User retrieveUser(String email_login, String password_login)
	{
		User user = null;
		
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT id, name, email, country, userType FROM user WHERE email='"+email_login+"' AND password='"+password_login+"' LIMIT 1;" );
		System.out.println("Vector v: "+v);
		if(v.size() != 0)
		{
			String []record_user = (String[]) v.elementAt(0);
			
			int id = Integer.parseInt(record_user[0]);
			String name = record_user[1];
			String email = record_user[2];
			String country = record_user[3];
			int userType = Integer.parseInt(record_user[4]);
			
			//Vector v_permits = DatabaseManager.getInstance().executeQuery( "SELECT  FROM  WHERE email='"+email_login+"' AND password='"+password_login+"' LIMIT 1;" );
			
			if(userType == 1)
			{
				user = new UserBasic(name, email, country, id, 1);
			}
			if(userType == 2)
			{
				user = new UserAdvanced(name, email, country, id, 2);
			}
			if(userType == 3)
			{
				user = new DecisionMaker(name, email, country, id, 3);
			}
			if(userType == 4)
			{	
				user = new Administrator(name, email, country, id, 4);
			}
		}
		return user;
	}

	@Override
	public ArrayList<String[]> getUsers()
	{
		ArrayList<String[]> users = new ArrayList<String[]>();
		
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT id, name, email, country, userType FROM user" );
		System.out.println("Vector v: "+v);
		if(v.size() != 0)
		{
			for(int i = 0; i < v.size(); i++)
			{
				String []record_user = (String[]) v.elementAt(i);
				
				users.add(record_user);
			}	
		}
		
		return users;
	}
	
	@Override
	public boolean registerUser(String name, String email, String country, String password, int userType)
	{
		return MySQLDBManager.getInstance().update("INSERT INTO user(name,email,country, password, userType) VALUES ('"+name+"','"+email+"','"+country+"','"+password+"','"+userType+"')");
	}
	
	@Override
	public boolean checkUserAlreadyPresent(String email_register)
	{
		Vector<String[]> v = MySQLDBManager.getInstance().executeQuery( "SELECT * FROM user WHERE email='"+email_register+"';" );
		System.out.println("Vector v: "+v);
		if(v.size() != 0)
		{
			return true;	
		}
		
		return false;
	}
	
	/*
	@Override
	public Permit[] getPermits()
	{
		return null;
	}
	*/
	
	@Override
	public boolean modifyUser(String email, String password, String name, String country)
	{
		if(password.equals(""))
			return MySQLDBManager.getInstance().update("UPDATE user SET name='"+name+"', country='"+country+"'  WHERE email='"+email+"'");
		else
			return MySQLDBManager.getInstance().update("UPDATE user SET name='"+name+"', country='"+country+"', password='"+password+"'  WHERE email='"+email+"'");
	}
	
	@Override
	public boolean modifyUserType(int id, int type)
	{
		System.out.println("Type passato alla query: " + type);
		System.out.println("Id modificata dalla query: " + id);
		return MySQLDBManager.getInstance().update("UPDATE user SET userType='"+type+"' WHERE id='"+id+"'");
	}
}
