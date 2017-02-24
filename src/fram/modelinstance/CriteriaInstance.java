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

import java.util.ArrayList;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

import fram.model.Criteria;
import fram.util.Convert;

@XmlRootElement
public class CriteriaInstance extends Criteria{

	@XmlElement
	private String url;
	@XmlElement
	private String comment;

	@XmlElement(name = "IF_insert")
	private ItalianFlag IFInsert;
	
	@XmlElement(name = "IF_calculated")
	private ItalianFlag IFCalculated;

	private int weightsLength;
	private double[] weightsEdges;
	@XmlElement
	private String weightsSerialized;
	private double[][] matrixComp;
	private MatrixComparison matrixCompObj;
	private int matrixNumRows;
	private int matrixNumCols;
	@XmlElement
	private String matrixSerialized;
	@XmlElement
	private int modelInstanceId;
	private CriteriaInstance father_instance;
	
	@XmlElement(name = "function_manager")
	private LogicFunctionManager functionManager;
	
	@XmlElement(name = "children")
	private ArrayList<CriteriaInstance> children_instance;
	
	
	
	
	public CriteriaInstance()
	{
//		IF_green = 0.0;
//		IF_white = 0.0;
//		IF_red = 0.0;
	}
	
	public CriteriaInstance(String pos, String desc, int modId, boolean isLeaf)
	{
		super(pos,desc,modId,isLeaf);
		children_instance = new ArrayList<CriteriaInstance>();
	}
	
	
	@XmlTransient
	public void setModelInstanceId(int modelInstanceId)
	{
		this.modelInstanceId = modelInstanceId;
	}
	
	public int getModelInstanceId()
	{
		return modelInstanceId;
	}
	
	
	@XmlTransient
	public void setUrl(String url){  this.url = url; }
	public String getUrl(){  return url;  }
	
	@XmlTransient
	public void setComment(String comment){  this.comment = comment;  } 
	public String getComment() {  return comment;  }
	
	@XmlTransient
	public void setIFInsert(ItalianFlag if_insert){  this.IFInsert = if_insert; }
	public ItalianFlag getIFInsert(){  return IFInsert;  }
	
	@XmlTransient
	public void setIFCalculated(ItalianFlag if_calculated){  this.IFCalculated = if_calculated; }
	public ItalianFlag getIFCalculated(){  return IFCalculated;  }


	
	
	
	public void addChildInstance(CriteriaInstance criteria_inst)
	{
		children_instance.add(criteria_inst);
	}
	
	public ArrayList<CriteriaInstance> getChildrenInstance()
	{
		return children_instance;
	}
	
	public CriteriaInstance getChildInstance(int index)
	{
		return children_instance.get(index);
	}
	
	public void removeChildInstance(int index)
	{
		children_instance.remove(index);
	}
	
	public int getNumChildrenInstance()
	{
		return children_instance.size();
	}
	
	public void setCritFInst(CriteriaInstance fatherCriteriaInstance){
		father_instance = fatherCriteriaInstance;
	} 
	
	public CriteriaInstance getFatherInstance() {
		return father_instance;
	}
	
	
	
	@XmlTransient
	public void setFunctionManager(LogicFunctionManager functionManager) {
		this.functionManager = functionManager;
	}
	
	public LogicFunctionManager getFunctionManager() {
		return functionManager;
	}

	
	
	
	// -------------------------------------------- Manage Weights Vector --------------------------------------------------
	@XmlTransient
	public void setWeightsLength(int weightsLength) {  this.weightsLength = weightsLength; }
	public int getWeightsLength() {  return weightsLength; }
	
	@XmlTransient
	public void setWeightsSerialized(String weightsSerialized) {
		this.weightsSerialized = weightsSerialized;
	}
	
	public void setWeigthsFromString()
	{
		double[] weights = Convert.getInstance().splitStringToVectorDouble(weightsSerialized);
		setWeightsEdges(weights);
		setWeightsLength(weights.length);
	}

	public String getWeightsSerialized() {
		return weightsSerialized;
	}
	
	@XmlTransient
	public void setWeightsEdges(double[] weights)
	{ 
		weightsEdges = weights;
	}
	
	public double[] getWeightsEdges()
	{
		return weightsEdges;
	}
	
	private void computeWeightsEdges(){
		setWeightsEdges(matrixCompObj.computeWeights());
		setWeightsSerialized(computeWeightsSerialized(getWeightsEdges()));
		setWeightsLength(weightsEdges.length);
	}
	
	public String computeWeightsSerialized(double[] weights)
	{
		String s = String.valueOf(weights[0]);
		for(int i=1; i<weights.length; i++)
			s += "," + String.valueOf(weights[i]);
		return s;
	}
	
	public void resetMatrix()
	{
		matrixCompObj = null;
		matrixComp = null;
		matrixSerialized = null;
		matrixNumRows = 0;
		matrixNumCols = 0;
	}
	// --------------------------------------------------------------
	
	
	// ------------------ Manage Matrix Comparison ----------------------
	@XmlTransient
	public void setMatrixNumRows(int matrixNumRows) {  this.matrixNumRows = matrixNumRows; }
	public int getMatrixNumRows() {  return matrixNumRows;  }
	
	@XmlTransient
	public void setMatrixNumCols(int matrixNumCols) {  this.matrixNumCols = matrixNumCols; }
	public int getMatrixNumCols() {  return matrixNumCols; }
	
	@XmlTransient
	public void setMatrixSerialized(String matrixSerialized) {
		this.matrixSerialized = matrixSerialized;
	}
	
	public void setMatrixFromString()
	{
		double[] vect_weights_extracted = Convert.getInstance().splitStringToVectorDouble(matrixSerialized);
		setMatrixNumRows((int) Math.sqrt(vect_weights_extracted.length));
		setMatrixNumCols((int) Math.sqrt(vect_weights_extracted.length));
		double[][] matrix = Convert.getInstance().generateMatrixFromVector(vect_weights_extracted, matrixNumRows, matrixNumCols);
		setMatrixComp(matrix);
		setMatrixCompObj(new MatrixComparison(matrix, matrixNumRows, matrixNumCols));
		computeWeightsEdges();
	}
	

	public String getMatrixSerialized() {
		return matrixSerialized;
	}
	
	@XmlTransient
	public void setMatrixComp(double[][] matrix) {
		matrixComp = matrix;
	}
	
	public double[][] getMatrixComp() {
		return matrixComp;
	}
	
	@XmlTransient
	public void setMatrixCompObj(MatrixComparison mc) {
		matrixCompObj = mc;
	}
	
	public MatrixComparison getMatrixCompObj() {
		return matrixCompObj;
	}
	// --------------------------------------------------------------------------------------------------------------------------------------------
	
	
	public CriteriaInstance returnACopyOfCriteriaInstanceWithoutChildren()
	{
		CriteriaInstance criteria_inst_app = new CriteriaInstance(super.getPosition(), super.getDescription(), super.getModelId(), super.getIsLeaf());

		if(matrixNumRows != 0 && matrixNumCols != 0)
			criteria_inst_app.setMatrixSerialized(matrixSerialized);

		if(weightsLength != 0)
			criteria_inst_app.setWeightsSerialized(weightsSerialized); 
		
		criteria_inst_app.setUrl(url);
		criteria_inst_app.setComment(comment);
		criteria_inst_app.setIFInsert(IFInsert);
		criteria_inst_app.setIFCalculated(IFCalculated);
		
		return criteria_inst_app;
	}
}
