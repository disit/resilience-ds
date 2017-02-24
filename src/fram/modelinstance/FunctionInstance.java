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
import fram.model.Function;
import fram.util.Convert;

@XmlRootElement(name="FunctionInstance")
public class FunctionInstance extends Function{

	@XmlTransient
	private FRAMModelInstance M_ref; //XXX To change for recursion

//	private Function F_ref; //XXX To change for recursion
		
	private int time_precision=-1;
	
	private int potential_precision=-1;
	
	private int function_manager=0;
	
	public FunctionInstance()	{	}
	//Ale: Constructor used for load a function.
	public FunctionInstance(Function f, int Tprecision, int Pprecision, int FSupervisor){
		super(f);
		this.time_precision=Tprecision;
		this.potential_precision=Pprecision;
		this.function_manager=FSupervisor;
	}

	public FunctionInstance(FRAMModelInstance m_ref, Function f,
			int time_precision, int potential_precision, int function_manager) {
//		super();
		M_ref = m_ref;
//		F_ref = f_ref;
		this.time_precision = time_precision;
		this.potential_precision = potential_precision;
		this.function_manager = function_manager;
		
		super.setId(f.getId());
		super.setName(f.getName());
		super.setDescription(f.getDescription());
		super.setX(f.getX());
		super.setY(f.getY());
		super.setColor(f.getColor());
		super.setType(f.getType());
		super.setModelId(f.getModelId());
		super.setAspects(f.getAspects());
		super.setNodeid(f.getNodeid());
	}
	@XmlTransient
	public FRAMModelInstance getM_ref() {
		return M_ref;
	}
	
	public void setM_ref(FRAMModelInstance m_ref) {
		M_ref = m_ref;
	}

//	public Function getF_ref() {
//		return F_ref;
//	}
//
//	public void setF_ref(Function f_ref) {
//		F_ref = f_ref;
//	}
	public int getTime_precision() {
		return time_precision;
	}

	@XmlElement(name="TP")
	public void setTime_precision(int time_precision) {
		this.time_precision = time_precision;
	}

	public int getPotential_precision() {
		return potential_precision;
	}

	@XmlElement(name="PP")
	public void setPotential_precision(int potential_precision) {
		this.potential_precision = potential_precision;
	}

	public int getFunction_manager() {
		return function_manager;
	}

	@XmlElement(name="FM")
	public void setFunction_manager(int function_maker) {
		this.function_manager = function_maker;
	}
	
	public void setFunctionVariables(int function_maker, int time_precision, int potential_precision){
		this.function_manager = function_maker;
		this.time_precision = time_precision;
		this.potential_precision = potential_precision;
	}
	
	@Override
    public String toString() {
        return (super.toString()+"\n-TP: "+time_precision+"\n-PP: "+potential_precision+"\n-FM: "+function_manager);
    }
	/*
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


	
	
	
	public void addChildInstance(FuncitonInstance criteria_inst)
	{
		children_instance.add(criteria_inst);
	}
	
	public ArrayList<FuncitonInstance> getChildrenInstance()
	{
		return children_instance;
	}
	
	public FuncitonInstance getChildInstance(int index)
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
	
	public void setCritFInst(FuncitonInstance fatherCriteriaInstance){
		father_instance = fatherCriteriaInstance;
	} 
	
	public FuncitonInstance getFatherInstance() {
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
	
	
	public FuncitonInstance returnACopyOfCriteriaInstanceWithoutChildren()
	{
		FuncitonInstance criteria_inst_app = new FuncitonInstance(super.getPosition(), super.getDescription(), super.getModelId(), super.getIsLeaf());

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
	*/
}
