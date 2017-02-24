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

package fram.model;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/*
 * Ale 16-2-4: The class that represent a FRAM's function.
 */
@XmlRootElement
public class ModelFunction{
	
	@XmlElement
	private int idFunction;
	@XmlElement
	private int idAspect;
	@XmlElement
	private String type;
		
	public ModelFunction()
	{
	
	}	
	
	public ModelFunction(int idFunction, int idAspect, String type) {
		super();
		this.idFunction = idFunction;
		this.idAspect = idAspect;
		this.type = type;
	}

	public int getIdFunction() {
		return idFunction;
	}
	@XmlTransient
	public void setIdFunction(int idFunction) {
		this.idFunction = idFunction;
	}

	public int getIdAspect() {
		return idAspect;
	}
	@XmlTransient
	public void setIdAspect(int idAspect) {
		this.idAspect = idAspect;
	}

	public String getType() {
		return type;
	}
	@XmlTransient
	public void setType(String type) {
		this.type = type;
	}

	@Override
    public String toString() {
        return ("\n-Function ID: "+idFunction+"\n-idAspect: "+idAspect+"\n-type:"+type);
    }	
	
}
