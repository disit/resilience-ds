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

package fram.modelinstance;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

@XmlRootElement
@XmlAccessorType (XmlAccessType.FIELD)
public class LogicFunction {

	@XmlElement
	private String query;
	@XmlElement
	private int compare;
	@XmlElement
	private double threshold1;
	@XmlElement
	private double threshold2;
	@XmlElement
	private double result;
	@XmlElement
	private int status;
	
	
	public LogicFunction(){  }
	
	public LogicFunction(String query, int compare, double threshold1, double threshold2, int status){  
		setQuery(query);
		setCompare(compare);
		setThreshold1(threshold1);
		setThreshold2(threshold2);
		setStatus(status);
	}
	
	public LogicFunction(String query, int compare, double threshold1, double threshold2, double result, int status){  
		setQuery(query);
		setCompare(compare);
		setThreshold1(threshold1);
		setThreshold2(threshold2);
		setResult(result);
		setStatus(status);
	}
	
	
	@XmlTransient
	public void setQuery(String query) {
		this.query = query;
	}
	
	public String getQuery() {
		return query;
	}
	
	
	@XmlTransient
	public void setCompare(int compare) {
		this.compare = compare;
	}
	
	public int getCompare() {
		return compare;
	}
	
	
	@XmlTransient
	public void setThreshold1(double threshold1) {
		this.threshold1 = threshold1;
	}
	
	public double getThreshold1() {
		return threshold1;
	}
	
	@XmlTransient
	public void setThreshold2(double threshold2) {
		this.threshold2 = threshold2;
	}
	
	public double getThreshold2() {
		return threshold2;
	}
	
	
	@XmlTransient
	public void setResult(double result) {
		this.result = result;
	}
	
	public double getResult() {
		return result;
	}
	
	
	@XmlTransient
	public void setStatus(int status) {
		this.status = status;
	}
	
	public int getStatus() {
		return status;
	}

	
}
