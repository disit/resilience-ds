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

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ModelInstanceExtraOperation {
	
	private String description;
	private int modelInstanceId;
	private int modelInstanceIdImportData;
	private String query;
	private String repository;
	private int logicFunctionId;
	private int modelId;
	private int instanceUserId;
	
	public ModelInstanceExtraOperation(){ }
	
	@XmlElement
	public void setDescription(String description)
	{
		this.description = description;
	}
	
	public String getDescription()
	{
		return this.description;
	}
	
	@XmlElement
	public void setModelInstanceId(int modelInstanceId)
	{
		this.modelInstanceId = modelInstanceId;
	}
	
	public int getModelInstanceId()
	{
		return modelInstanceId;
	}
	
	@XmlElement
	public void setModelInstanceIdImportData(int modelInstanceIdImport)
	{
		this.modelInstanceIdImportData = modelInstanceIdImport;
	}
	
	public int getModelInstanceIdImportData()
	{
		return modelInstanceIdImportData;
	}
	
	
	@XmlElement
	public void setQuery(String query)
	{
		this.query = query;
	}
	
	public String getQuery()
	{
		return query;
	}
	
	@XmlElement
	public void setRepository(String repository)
	{
		this.repository = repository;
	}
	
	public String getRepository()
	{
		return repository;
	}
	
	@XmlElement
	public void setLogicFunctionId(int id)
	{
		this.logicFunctionId = id;
	}
	
	public int getLogicFunctionId()
	{
		return logicFunctionId;
	}
	
	
	
	@XmlElement
	public void setModelId(int modelId)
	{
		this.modelId = modelId;
	}
	
	public int getModelId()
	{
		return modelId;
	}
	
	
	@XmlElement
	public void setInstanceUserId(int userInstanceId)
	{
		this.instanceUserId = userInstanceId;
	}
	
	public int getUserInstanceId()
	{
		return instanceUserId;
	}
}