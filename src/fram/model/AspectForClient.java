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
 * Ale 16-2-4: The class that represent a FRAM's aspect, passed at the client.
 * Fsource and Ftarget are string but represent the functions' ids. 
 * XXX why not a int??
 */
@XmlRootElement
public class AspectForClient extends Aspect{
	
	private String Ftarget;
	
	private String Fsource;
	
	private String LinkType;
		
	public AspectForClient()
	{
		
	}
	
	public AspectForClient(int id, String label, int modelId, String t, String s, String type)
	{
		super.setId(id);
		super.setLabel(label);
		super.setModelId(modelId);
		this.Ftarget=t;
		this.Fsource=s;
		this.LinkType=type;
	}	
	
	public AspectForClient(int id, String label, int modelId, String t, String s, String type, int Nodeid)
	{
		super.setId(id);
		super.setLabel(label);
		super.setModelId(modelId);
		super.setNodeid(Nodeid);
		this.Ftarget=t;
		this.Fsource=s;
		this.LinkType=type;
	}	
	
	public String getFtarget() {
		return Ftarget;
	}

	@XmlElement(name="target")
	public void setFtarget(String ftarget) {
		Ftarget = ftarget;
	}

	public String getFsource() {
		return Fsource;
	}

	@XmlElement(name="source")
	public void setFsource(String fsource) {
		Fsource = fsource;
	}

	public String getLinkType() {
		return LinkType;
	}

	@XmlElement(name="type")
	public void setLinkType(String linkType) {
		LinkType = linkType;
	}

	@Override
    public String toString() {
        return (super.toString()+"\n Source: "+Fsource+"\n Target: "+Ftarget+"\n Type:"+LinkType);
    }

	
	
	
	
	
}
