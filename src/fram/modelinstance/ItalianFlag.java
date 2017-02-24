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

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

@XmlRootElement
@XmlAccessorType (XmlAccessType.FIELD)
public class ItalianFlag {

	@XmlElement
	private double IF_green;
	@XmlElement
	private double IF_white;
	@XmlElement
	private double IF_red;
	
	
	public ItalianFlag(){  }
	
	public ItalianFlag(double green, double white, double red)
	{
		this.IF_green = green;
		this.IF_white = white;
		this.IF_red = red;
	}
	
	@XmlTransient
	public void setGreen(double green) {  this.IF_green = green;  }
	public double getGreen() {  return IF_green;  }

	@XmlTransient
	public void setWhite(double white) {  this.IF_white = white;  }
	public double getWhite() {  return IF_white;  }
	
	@XmlTransient
	public void setRed(double red) {  this.IF_red = red;  }
	public double getRed() {  return IF_red;  }
	
}
