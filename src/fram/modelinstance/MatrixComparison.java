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


public class MatrixComparison {

	private double[][] matrixComparison;
	private int num_rows, num_cols;
	private double[][] matrixNormalize;
	
	public MatrixComparison(double[][] matrixComp, int num_rows, int num_cols)
	{
		matrixComparison = matrixComp;
		this.num_rows = num_rows;
		this.num_cols = num_cols;
		normalize();
	}
	
	
	private void normalize()
	{
		int i,j,k;
		
		// Inizializzazione vettore somma colonne della matrice
		double[] vect_sum = new double[num_cols];
		for(k=0; k<vect_sum.length; k++)
			vect_sum[k] = 0.0;
		
		// Calcolo vettore somma delle colonne della matrice
		for(j=0; j<num_cols; j++)	
			for(i=0; i<num_rows; i++)
				vect_sum[j] = vect_sum[j] + matrixComparison[i][j];
		
		// Calcolo matrice normalizzata
		matrixNormalize = new double[num_rows][num_cols];
		for(i=0; i<num_rows; i++)	
			for(j=0; j<num_cols; j++)
				matrixNormalize[i][j] = matrixComparison[i][j]/vect_sum[j];

		//outputMatrixNormalized();
	}

	
	public double[] computeWeights()
	{
		int i,j;
		double[] vect_weights = new double[num_rows];
		for(i=0; i<vect_weights.length; i++)
			vect_weights[i] = 0.0;
		
		for(j=0; j<num_cols; j++)
			for(i=0; i<num_rows; i++)
				vect_weights[i] = vect_weights[i] + (matrixNormalize[i][j]/num_cols);
		
		//outputWeightsCalculated(vect_weights);
		return vect_weights;
	}


	public double[][] getMatrixComparison() {
		return matrixComparison;
	}
	
	public double[][] getMatrixNormalize() {
		return matrixNormalize;
	}
	
	
	
	public int getNumRows()
	{
		return num_rows;
	}
	
	public int getNumCols()
	{
		return num_cols;
	}
	
	
	
	// ------------------------------ Metodi per debugging calcolo matrice normalizzata e vettore dei pesi -------------------------------------------------
	/*
	private void outputMatrixNormalized()
	{
		System.out.println("Matrice normalizzata appena calcolata!!");
		for(int i=0; i<num_rows; i++)
		{
			System.out.println("");
			for(int j=0; j<num_cols; j++)
				System.out.print("\t"+matrixNormalize[i][j]);
		}
	}
	
	private void outputWeightsCalculated(double[] weights)
	{
		System.out.println("\n\nVettore pesi appena calcolato!!");
		for(double w:weights)
			System.out.print("\t"+w);
		System.out.println("\n\n");
	}
	*/
	// -----------------------------------------------------------------------------------------------------------------------------------------------------
	
}
