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

@XmlRootElement
public class ModelExtraOperation {

	private String description;
	private int modelId;
	private int userId;
	
	public ModelExtraOperation(){ }
	
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
	public void setModelId(int modelId)
	{
		this.modelId = modelId;
	}
	
	public int getModelId()
	{
		return modelId;
	}
	
	
	@XmlElement
	public void setUserId(int userId)
	{
		this.userId = userId;
	}
	
	public int getUserId()
	{
		return userId;
	}
	
}