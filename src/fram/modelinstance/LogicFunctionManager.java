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
public class LogicFunctionManager {

	@XmlElement
	private String SPARQLRepository;
	
	@XmlElement
	private int notFunction1;
	
	@XmlElement(name = "logic_function1")
	private LogicFunction function1;
	
	@XmlElement
	private int logicConnector;
	
	@XmlElement
	private int notFunction2;
	
	@XmlElement(name = "logic_function2")
	private LogicFunction function2;
	
	@XmlElement
	private String typeIF1;
	
	@XmlElement
	private double value_true1;
	
	@XmlElement
	private double value_false1;
	
	
	@XmlElement
	private String typeIF2;
	
	@XmlElement
	private double value_true2;
	
	@XmlElement
	private double value_false2;
	
	@XmlElement
	private int status;

	@XmlTransient
	private CriteriaInstance criteriaInstance;
	
	
	public LogicFunctionManager(){  }
	
	public LogicFunctionManager(int notFunction1, LogicFunction lf1, int logicConnector, int notFunction2, LogicFunction lf2, 
			String typeIF1, double value_true1, double value_false1, String typeIF2, double value_true2, double value_false2, int status, String repository){ 
		setNotFunction1(notFunction1);
		setFunction1(lf1);
		setLogicConnector(logicConnector);
		setNotFunction2(notFunction2);
		setFunction2(lf2);
		setTypeIF1(typeIF1);
		setValueTrue1(value_true1);
		setValueFalse1(value_false1);
		setTypeIF2(typeIF2);
		setValueTrue2(value_true2);
		setValueFalse2(value_false2);
		setStatus(status);
		setSPARQLRepository(repository);
	}
	
	
	@XmlTransient
	public void setSPARQLRepository(String repository) {
		this.SPARQLRepository = repository;
	}
	
	public String getSPARQLRepository() {
		return SPARQLRepository;
	}
	
	
	@XmlTransient
	public void setFunction1(LogicFunction function1) {
		this.function1 = function1;
	}
	
	public LogicFunction getFunction1() {
		return function1;
	}
	
	
	@XmlTransient
	public void setNotFunction1(int notFunction1) {
		this.notFunction1 = notFunction1;
	}
	
	public int getNotFunction1() {
		return notFunction1;
	}
	
	
	@XmlTransient
	public void setFunction2(LogicFunction function2) {
		this.function2 = function2;
	}
	
	public LogicFunction getFunction2() {
		return function2;
	}
	
	
	@XmlTransient
	public void setNotFunction2(int notFunction2) {
		this.notFunction2 = notFunction2;
	}
	
	public int getNotFunction2() {
		return notFunction2;
	}
	
	
	@XmlTransient
	public void setLogicConnector(int logicConnector) {
		this.logicConnector = logicConnector;
	}
	
	public int getLogicConnector() {
		return logicConnector;
	}
	
	
	@XmlTransient
	public void setTypeIF1(String typeIF1) {
		this.typeIF1 = typeIF1;
	}
	
	public String getTypeIF1() {
		return typeIF1;
	}
	
	
	@XmlTransient
	public void setValueTrue1(double value_true1) {
		this.value_true1 = value_true1;
	}
	
	public double getValueTrue1() {
		return value_true1;
	}
	
	@XmlTransient
	public void setValueFalse1(double value_false1) {
		this.value_false1 = value_false1;
	}
	
	public double getValueFalse1() {
		return value_false1;
	}
	
	

	@XmlTransient
	public void setTypeIF2(String typeIF2) {
		this.typeIF2 = typeIF2;
	}
	
	public String getTypeIF2() {
		return typeIF2;
	}
	
	
	@XmlTransient
	public void setValueTrue2(double value_true2) {
		this.value_true2 = value_true2;
	}
	
	public double getValueTrue2() {
		return value_true2;
	}
	
	@XmlTransient
	public void setValueFalse2(double value_false2) {
		this.value_false2 = value_false2;
	}
	
	public double getValueFalse2() {
		return value_false2;
	}
	
	
	@XmlTransient
	public void setStatus(int status) {
		this.status = status;
	}
	
	public int getStatus() {
		return status;
	}
	
	
	public void setCriteriaInstance(CriteriaInstance criteriaInstance) {
		this.criteriaInstance = criteriaInstance;
	}
	
	public CriteriaInstance getCriteriaInstance() {
		return criteriaInstance;
	}

}
