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

package fram.user;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class User
{
	private static User instance;
	
	protected String name;
	protected String email;
	protected int id;
	protected String country;
	protected String password;
	protected int type;
	protected Permit []permits_model;
	protected Permit []permits_instance;
	protected Permit []permits_software;
	
	public static User getInstance()
	{
		if(instance == null)
			instance = new User();
		return instance;
	}
	
	public void setUser(String name, String email, String country, int id)
	{
		this.name = name;
		this.id = id;
		this.country = country;
		this.email = email;
		type = 0;
	}

	@XmlElement
	public void setName(String name) 
	{
		this.name = name;
	}

	@XmlElement
	public void setEmail(String email) 
	{
		this.email = email;
	}

	@XmlElement
	public void setId(int id) 
	{
		this.id = id;
	}

	@XmlElement
	public void setCountry(String country) 
	{
		this.country = country;
	}
	
	@XmlElement
	public void setPassword(String password)
	{
		this.password = password;
	}
	
	public void setType(int type)
	{
		this.type = type;
	}

	public String getName() 
	{
		return name;
	}

	public String getEmail() 
	{
		return email;
	}

	public int getId() 
	{
		return id;
	}

	public String getCountry() 
	{
		return country;
	}
	
	public String getPassword() 
	{
		return password;
	}
	
	public int getType()
	{
		return type;
	}
	
	public String getTypeString()
	{
		return "User not defined";
	}
	
	public Permit getPermitModel(int id_permits_model)
	{
		return permits_model[id_permits_model];
	}
	
	public Permit[] getPermitsModel(){
		return permits_model;
	}
	
	public Permit getPermitInstance(int id_permits_instance)
	{
		return permits_instance[id_permits_instance];
	}
	
	public Permit[] getPermitsInstance(){
		return permits_instance;
	}
	
	public Permit getPermitSoftware(int id_permits_software)
	{
		return permits_software[id_permits_software];
	}
	
	public Permit[] getPermitSsoftware(){
		return permits_software;
	}
	
	@Override
	public String toString()
	{	
		return "\nName = "+this.name+"\nEmail="+this.email+"\nCountry="+this.country/*+"\nUser type="+str*/;
	}
}