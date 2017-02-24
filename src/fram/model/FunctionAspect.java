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
public class FunctionAspect{
	
	@XmlElement
	private int idFunction;
	@XmlElement
	private int idAspect;
	@XmlElement
	private Function F_ref;
	@XmlElement
	private Aspect A_ref;
	@XmlElement
	private String type;
		
	public FunctionAspect()
	{
	
	}	
	
	public FunctionAspect(Function f_ref, Aspect a_ref, String type) {
		super();
		F_ref = f_ref;
		A_ref = a_ref;
		this.type = type;
	}
	
	public FunctionAspect(int idFunction, int idAspect, String type) {
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

	public Function getF_ref() {
		return F_ref;
	}

	public void setF_ref(Function f_ref) {
		F_ref = f_ref;
	}

	public Aspect getA_ref() {
		return A_ref;
	}

	public void setA_ref(Aspect a_ref) {
		A_ref = a_ref;
	}	
	
}
