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

package fram.util;

import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import java.util.ArrayList;

import fram.model.Criteria;
import fram.model.ModelStore;

@XmlRootElement(name = "criterias")
@XmlAccessorType (XmlAccessType.FIELD)
public class CriteriasParserXML {

	@XmlElement(name = "criteria")
	private ArrayList<Criteria> criteriasList = null;

	public ArrayList<Criteria> getCriteriasList() {
		return criteriasList;
	}

	public void setCriteriasList(int modelId) {
		criteriasList = getCriteriaPresentActuallyOnServer(ModelStore.getInstance().getModelById(modelId).getRootCriteria(), new ArrayList<Criteria>());  
	}
	
	public ArrayList<Criteria> getCriteriaPresentActuallyOnServer(Criteria criteria, ArrayList<Criteria> criterias)
	{
		criterias.add(criteria);
		for(int i=0; i < criteria.getNumChildren(); i++)
			criterias = getCriteriaPresentActuallyOnServer(criteria.getChild(i), criterias);
		return criterias;
	}
	
}
