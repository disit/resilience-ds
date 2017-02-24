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

public class ConvertStringToElement {

	private static ConvertStringToElement instance;
	
	
	public static ConvertStringToElement getInstance()
	{
		if(instance == null)
			instance = new ConvertStringToElement();
		return instance;
	}
	
	public double[] splitStringToVectorDouble(String vect_string)
	{
		String [] splits = vect_string.split(",");
		double [] vect_double = new double[splits.length]; 
		int i=0;
		for(String s:splits)
		{	
			vect_double[i] = Double.parseDouble(s);
			i++;
		}
		return vect_double;
	}
	
	public double[][] generateMatrixFromVector(double[] vect_elements, int matrixNumRows, int matrixNumCols)
	{
		double [][] matrix_elements = new double[matrixNumRows][matrixNumCols];
		int k=0;
		for(int i=0; i<matrixNumRows; i++)
		{	
			for(int j=0; j<matrixNumCols; j++)
			{	
				matrix_elements[i][j] = vect_elements[k];
				k++;
			}
		}
		return matrix_elements;
	}
	
}
