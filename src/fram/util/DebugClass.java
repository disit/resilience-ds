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

import java.util.ArrayList;

import fram.model.Criteria;
import fram.model.ModelStore;
import fram.modelinstance.CriteriaInstance;
import fram.modelinstance.ModelInstance;
import fram.modelinstance.ModelInstanceStore;

public class DebugClass {

	private static DebugClass instance;
	
	public static DebugClass getInstance()
	{
		if(instance == null)
			instance = new DebugClass();
		return instance;
	}
	
	public void printModel(Criteria criteria)
	{
		if(criteria == ModelStore.getInstance().getModelById(criteria.getModelId()).getRootCriteria())	
			System.out.println("\nModel - "+ModelStore.getInstance().getModelById(criteria.getModelId()).getObjective()+"\n");
		else
			System.out.println(criteria.getPosition()+" - "+criteria.getDescription());
		
		System.out.println("Criteria: "+criteria.getPosition()+" - "+criteria.getDescription()+"  -> father: "+criteria.getFather()+"  children: "+
				criteria.getChildren()+"  num.children: "+criteria.getNumChildren());
		
		for(int i=0; i < criteria.getNumChildren(); i++)
			printModel(criteria.getChild(i));
	}
	
	
	public void printModelInstance(CriteriaInstance criteria_inst)
	{
		ArrayList<ModelInstance> ami = ModelInstanceStore.getInstance().getModelInstances(criteria_inst.getModelInstanceId(), 0);
		ModelInstance mi = ami.get(0);
		if(criteria_inst == mi.getRootCriteriaInstance())
		{	
			System.out.println("\nModelInstance - "+mi.getObjective()+", "+mi.getSpecificObjective());
			System.out.println(criteria_inst.getPosition()+" - "+criteria_inst.getDescription()+": "+"   matrix_comp: "+criteria_inst.getMatrixSerialized()+
			           "   weights: "+criteria_inst.getWeightsSerialized()+"   IF -> G: "+criteria_inst.getIFInsert().getGreen()+" W: "+criteria_inst.getIFInsert().getWhite()+
			           " R: "+criteria_inst.getIFInsert().getRed()+"   IF Calculated -> G: "+criteria_inst.getIFCalculated().getGreen()+" W: "+
			           		criteria_inst.getIFInsert().getWhite()+" R: "+criteria_inst.getIFCalculated().getRed());
		}	
		else
			System.out.println(criteria_inst.getPosition()+" - "+criteria_inst.getDescription()+": "+"   matrix_comp: "+criteria_inst.getMatrixSerialized()+
					   "   weights: "+criteria_inst.getWeightsSerialized()+"   IF -> G: "+criteria_inst.getIFInsert().getGreen()+" W: "+criteria_inst.getIFInsert().getWhite()+
					   " R: "+criteria_inst.getIFInsert().getRed()+"   IF Calculated -> G: "+criteria_inst.getIFCalculated().getGreen()+" W: "+
					   		criteria_inst.getIFCalculated().getWhite()+" R: "+criteria_inst.getIFCalculated().getRed());
			
		for(int i=0; i < criteria_inst.getNumChildrenInstance(); i++)
			printModelInstance(criteria_inst.getChildInstance(i));
	}
	
	/*
	public static void outputMatrixForCalculateWeights(String position, MatrixComparison matrixCompObj)
	{
		System.out.println("\nMatrix Comparison for criteria: "+position+":");
		outputMatrix(matrixCompObj.getMatrixComparison(), matrixCompObj.getNumRows(), matrixCompObj.getNumCols());
		System.out.println("\nMatrix Normalize for criteria "+position+":");
		outputMatrix(matrixCompObj.getMatrixNormalize(), matrixCompObj.getNumRows(), matrixCompObj.getNumCols());
		System.out.println("\n");
	}
	
	public static void outputMatrix(double[][] matrix, int matrixNumRows, int matrixNumCols)
	{
		for(int i=0; i<matrixNumRows; i++)
		{
			System.out.println("");
			for(int j=0; j<matrixNumCols; j++)
				System.out.print("\t"+matrix[i][j]);
		}
	}
	
	public static void outputVectorWeights(double[] weightsEdges)
	{
		System.out.println("\nWeights Edges:");
		for(double w: weightsEdges)
			System.out.print("\t"+w);
		System.out.println("\n\n");
	}
	*/
}
