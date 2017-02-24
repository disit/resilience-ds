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

import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

import org.openrdf.model.Value;
import org.openrdf.query.MalformedQueryException;
import org.openrdf.query.QueryEvaluationException;
import org.openrdf.query.QueryLanguage;
import org.openrdf.query.TupleQueryResult;
import org.openrdf.repository.Repository;
import org.openrdf.repository.RepositoryConnection;
import org.openrdf.repository.RepositoryException;
import org.openrdf.repository.sparql.SPARQLRepository;

import fram.dbinterface.ModelInstanceDB;
import fram.dbinterface.ModelInstanceDBInterface;
import fram.model.Criteria;
import fram.model.Model;
import fram.model.ModelStore;
import fram.util.Convert;
import fram.util.DebugClass;


@XmlRootElement(name = "modelinstance")
@XmlAccessorType (XmlAccessType.FIELD)
public class ModelInstance extends Model{
	
	private int modelInstanceId;
	private String specific_objective;
	@XmlTransient
	private Timestamp timestamp_create_instance;
	@XmlTransient
	private Timestamp timestamp_last_modify_instance;
	@XmlElement
	private String date_create_instance;
	@XmlElement
	private String date_last_modify_instance;
	@XmlElement
	private int status;
	@XmlTransient
	private Timestamp timestamp_start_exec;
	@XmlTransient
	private Timestamp timestamp_end_exec;
	@XmlElement
	private String start_exec;
	@XmlElement
	private String end_exec;
	
	private int instanceUserId;
	
	@XmlElement(name = "children")
	private CriteriaInstance root;
	
	
	
	public ModelInstance()
	{
		root = null;
	}

	// Costruttore per creazione lista ModelInstance da scrivere nello stream
	public ModelInstance(int modelInstanceId, String objective, int modelId, int userInstanceId, int status)
	{
		super();
		super.setId(modelId);
		setMIId(modelInstanceId);
		setSpecificObjective(objective);
		setUserInstanceId(userInstanceId);
		setStatus(status);
	}

	// Costruttore per creazione ModelInstance a partire dalla struttura del Model collegato
	public ModelInstance(int modelInstanceId,String objective, int userInstanceId, Model model)
	{
		super(model.getId(), model.getUrl(), model.getObjective(), model.getSize(), model.getModelUserId());
		setMIId(modelInstanceId);
		setSpecificObjective(objective);
		setUserInstanceId(userInstanceId);
		reconstructModelStructure(model.getRootCriteria());
	}
	
	public void setMIId(int id)
	{
		modelInstanceId = id;
	}
	
	public int getMIId()
	{
		return modelInstanceId;
	}
	
	public void setSpecificObjective(String specific_objective)
	{
		this.specific_objective = specific_objective;
	}
	
	public String getSpecificObjective()
	{
		return specific_objective;
	}
	
	
	public void setUserInstanceId(int id)
	{
		instanceUserId = id;
	}
	
	public int getUserInstanceId()
	{
		return instanceUserId;
	}
	
	public void specifyTimestampCreateModelInstance(Timestamp date)
	{
		this.timestamp_create_instance = date;
		setDateCreateInstance(Convert.getInstance().dateToString(new Date(this.timestamp_create_instance.getTime())));
	}

	public Timestamp getTimestampCreateModelInstance()
	{
		return timestamp_create_instance;
	}
	
	@XmlTransient
	public void setDateCreateInstance(String date)
	{
		date_create_instance = date;
	}
	
	public String getDateCreateInstance()
	{
		return date_create_instance;
	}
	
	
	
	public void specifyTimestampLastModifyModelInstance(Timestamp date)
	{
		this.timestamp_last_modify_instance = date;
		setDateLastModifyInstance(Convert.getInstance().dateToString(new Date(this.timestamp_last_modify_instance.getTime())));
	}

	public Timestamp getTimestampLastModifyModelInstance()
	{
		return timestamp_last_modify_instance;
	}
	
	@XmlTransient
	public void setDateLastModifyInstance(String date)
	{
		date_last_modify_instance = date;
	}
	
	public String getDateLastModifyInstance()
	{
		return date_last_modify_instance;
	}
	
	
	
	public void specifyTimestampStartExecModelInstance(Timestamp date)
	{
		this.timestamp_start_exec = date;
		if(date != null)
			setDateStartExecInstance(Convert.getInstance().dateToString(new Date(this.timestamp_start_exec.getTime())));
	}

	public Timestamp getTimestampStartExecModelInstance()
	{
		return timestamp_start_exec;
	}
	
	@XmlTransient
	public void setDateStartExecInstance(String date)
	{
		start_exec = date;
	}
	
	public String getDateStartExecInstance()
	{
		return start_exec;
	}
	
	
	
	public void specifyTimestampEndExecModelInstance(Timestamp date)
	{
		this.timestamp_end_exec = date;
		if(date != null)
			setDateEndExecInstance(Convert.getInstance().dateToString(new Date(this.timestamp_end_exec.getTime())));
	}

	public Timestamp getTimestampEndExecModelInstance()
	{
		return timestamp_end_exec;
	}
	
	@XmlTransient
	public void setDateEndExecInstance(String date)
	{
		end_exec = date;
	}
	
	public String getDateEndExecInstance()
	{
		return end_exec;
	}
	
	public void setStatus(int status)
	{
		this.status = status;
	}
	
	public int getStatus()
	{
		return status;
	}
	
	
	public void setRootCriteriaInstance(CriteriaInstance crit)
	{
		root = crit;
	}
	
	public CriteriaInstance getRootCriteriaInstance()
	{
		return root;
	}
	
	
	
	
	public void printModelInstance(CriteriaInstance criteria_inst)
	{
		DebugClass.getInstance().printModelInstance(criteria_inst);
	}
	
	public void addCriteriaInstance(CriteriaInstance crit_inst)
	{
		CriteriaInstance critToAddChild = getFatherCriteriaInstance(crit_inst.getPosition());
		crit_inst.setCritFInst(critToAddChild);
		critToAddChild.addChildInstance(crit_inst);
	}

	
	public void updateCriteriaClientRequest(String pos, String str, String str2, CriteriaInstance new_criteria_instance, int type)
	{
		CriteriaInstance crit_inst = getCriteriaInstance(pos);
		if(type == 1) // Change url discussion and comment
		{	
			crit_inst.setUrl(str);
			crit_inst.setComment(str2);
		}	
		else if(type == 2) // Change matrix comparison
		{
			crit_inst.setMatrixSerialized(str);
			crit_inst.setMatrixFromString();
		}	
		else if(type == 3) // Change vector weights
		{	
			crit_inst.setWeightsSerialized(str);
			crit_inst.setWeigthsFromString();
			crit_inst.resetMatrix();
		}
		else if(type == 4) // Change Logic Function
		{	
			insertLogicFunctionManagersOnCriteria(crit_inst, new_criteria_instance);
			crit_inst.getFunctionManager().setStatus(0);
			crit_inst.getFunctionManager().getFunction1().setStatus(0);
			if(crit_inst.getFunctionManager().getFunction2() != null)
				crit_inst.getFunctionManager().getFunction2().setStatus(0);
			crit_inst.setIFInsert(null);
		}	
		else if(type == 5) // Change IF
		{
			double[] vect = Convert.getInstance().splitStringToVectorDouble(str);
			crit_inst.setIFInsert(new ItalianFlag(vect[0], vect[1], vect[2]));
			crit_inst.setFunctionManager(null);
		}
		else
			System.out.println("Errore nella modifica del criteria instance: type errato!");
		
		if(type == 4 || type == 5)
		{
			if(status == 2 && crit_inst.getIsLeaf())
				resetIFCalculatedAncestors(crit_inst);
		}		
	}
	
	
	private void resetIFCalculatedAncestors(CriteriaInstance crit_inst){
		crit_inst.setIFCalculated(null);   // reset if_calculated on server
		ModelInstanceDBInterface mdbi = new ModelInstanceDB();  
		mdbi.deleteIFCalculated(crit_inst.getPosition(), crit_inst.getModelInstanceId());    // reset if_calculated on db
		if(crit_inst.getFatherInstance() != null)
			resetIFCalculatedAncestors(crit_inst.getFatherInstance());
	}
	
	
	private LogicFunction setParametersLogicFunction(String query, int compare, double threshold1, double threshold2, int status)
	{
		return new LogicFunction(query, compare, threshold1, threshold2, status);
	}
	
	private LogicFunctionManager setParametersLogicFunctionManager(int notFunction1, LogicFunction lf1, int logicConnector, int notFunction2, LogicFunction lf2, 
					String typeIF1, double value_true1, double value_false1, String typeIF2, double value_true2, double value_false2, int status, String repository)
	{
		return new LogicFunctionManager(notFunction1, lf1, logicConnector, notFunction2, lf2, typeIF1, value_true1, value_false1, typeIF2, value_true2, 
										value_false2, status, repository);
	}
	
	private LogicFunctionManager insertLogicFunctionManager(LogicFunctionManager lfm)
	{
		LogicFunction lf1_data = lfm.getFunction1();
		LogicFunction lf1 = setParametersLogicFunction(lf1_data.getQuery(), lf1_data.getCompare(), lf1_data.getThreshold1(), lf1_data.getThreshold2(), lf1_data.getStatus());
		LogicFunction lf2 = null;
		if(lfm.getNotFunction2() != 0)
		{
			LogicFunction lf2_data = lfm.getFunction2();
			lf2 = setParametersLogicFunction(lf2_data.getQuery(), lf2_data.getCompare(), lf2_data.getThreshold1(), lf2_data.getThreshold2(), lf2_data.getStatus());
		}
		LogicFunctionManager manager = setParametersLogicFunctionManager(lfm.getNotFunction1(), lf1, lfm.getLogicConnector(), lfm.getNotFunction2(), lf2,
			lfm.getTypeIF1(), lfm.getValueTrue1(), lfm.getValueFalse1(), lfm.getTypeIF2(), lfm.getValueTrue2(), lfm.getValueFalse2(), lfm.getStatus(), lfm.getSPARQLRepository());
		return manager;
	}
	
	
	private void insertLogicFunctionManagersOnCriteria(CriteriaInstance old_criteria_inst, CriteriaInstance new_criteria_inst)
	{	
		LogicFunctionManager lfm = insertLogicFunctionManager(new_criteria_inst.getFunctionManager());
		old_criteria_inst.setFunctionManager(lfm);
		lfm.setCriteriaInstance(old_criteria_inst);
	}
	
	
	
	
	public void updateCriteriaFromDB(String position, String url_discussion, String comment, String weightsSerialized, String matrixSerialized, 
									ItalianFlag IF_ins, ItalianFlag IF_calc, LogicFunctionManager lfm)
	{
		CriteriaInstance crit_inst = getCriteriaInstance(position);
		
		if(lfm != null)
			lfm.setCriteriaInstance(crit_inst);
		
		if(!(matrixSerialized.equals(""))) // Change matrix comparison
		{
			crit_inst.setMatrixSerialized(matrixSerialized);
			crit_inst.setMatrixFromString();
		}	
		else if(matrixSerialized.equals("") && !(weightsSerialized.equals("0"))) // Change vector weights
		{	
			crit_inst.setWeightsSerialized(weightsSerialized);
			crit_inst.setWeigthsFromString();
			crit_inst.resetMatrix();
		}
		crit_inst.setUrl(url_discussion);
		crit_inst.setComment(comment);
		crit_inst.setIFInsert(IF_ins);
		crit_inst.setIFCalculated(IF_calc);
		crit_inst.setFunctionManager(lfm);
	}
	
	
	public CriteriaInstance getCriteriaInstance(String position)
	{
		CriteriaInstance crit_inst;
		if(position.length()-1 == 1 && position.contains("0"))
			return root;
		else
		{
			int[] values = getVectorPositionInstance(position,"child");	
			crit_inst = getCriteriaInstanceRecurrent(root, 0, values);
		}
		return crit_inst;
	}
	
	private CriteriaInstance getFatherCriteriaInstance(String position)
	{
		CriteriaInstance crit_inst;
		if(position.length()-1 == 1 && position.contains("0"))
			crit_inst = null;
		else
		{
			int[] values = getVectorPositionInstance(position,"father");	
			crit_inst = getCriteriaInstanceRecurrent(root, 0, values);
		}
		return crit_inst;
	}
	
	private CriteriaInstance getCriteriaInstanceRecurrent(CriteriaInstance crit_inst, int index, int[] vect_pos)
	{
		if(index < vect_pos.length)
			return getCriteriaInstanceRecurrent(crit_inst.getChildInstance(vect_pos[index]), index+1, vect_pos);
		else
			return crit_inst;
	}
	
	private int[] getVectorPositionInstance(String position, String type)
	{
		int length_vect = 0;
		if(type.equals("father"))
			length_vect = position.length()-1;
		else if(type.equals("child"))
			length_vect = position.length();
		
		int[] values = new int[length_vect-1];
		for(int i=1; i<length_vect; i++)
			values[i-1] = (int) position.charAt(i)-49;
		return values;
	}
	
	
	public void reconstructModelStructure(Criteria criteria)
	{
		CriteriaInstance crit_inst = new CriteriaInstance(criteria.getPosition(), criteria.getDescription(), criteria.getModelId(), criteria.getIsLeaf());
		crit_inst.setModelInstanceId(modelInstanceId);
		if(ModelStore.getInstance().getModelById(criteria.getModelId()).getRootCriteria() == criteria)
			root = crit_inst;
		else
			addCriteriaInstance(crit_inst);
		
		for(int i=0; i<criteria.getNumChildren(); i++)
			reconstructModelStructure(criteria.getChild(i));
		
	}
	
	
	// ------------------------------  Funzioni per copiare i dati di un CriteriaInstance in un altro  ------------------------------------------------------
	
	private void copyMatrixOrWeights(CriteriaInstance crit_new, CriteriaInstance crit_old)
	{
		// Matrix Serialized e Weights Serialized
		crit_new.setMatrixComp(crit_old.getMatrixComp());
		crit_new.setMatrixCompObj(crit_old.getMatrixCompObj());
		crit_new.setMatrixSerialized(crit_old.getMatrixSerialized());
		crit_new.setWeightsEdges(crit_old.getWeightsEdges());
		crit_new.setWeightsSerialized(crit_old.getWeightsSerialized());
	}
	
	private void copyFunctionManager(CriteriaInstance crit_new, CriteriaInstance crit_old)
	{
		// Logic Function Manager
		crit_new.setFunctionManager(crit_old.getFunctionManager());
		if(crit_new.getFunctionManager() != null)
			crit_new.getFunctionManager().setCriteriaInstance(crit_new);
	}
	
	private void copyIF(CriteriaInstance crit_new, CriteriaInstance crit_old)
	{
		// IF inseriti dall'utente
		if(crit_old.getIFInsert() != null)
			crit_new.setIFInsert(new ItalianFlag(crit_old.getIFInsert().getGreen(), crit_old.getIFInsert().getWhite(), crit_old.getIFInsert().getRed()));	
	}
	
	public void copyAllDataCriteria(CriteriaInstance crit_new, CriteriaInstance crit_old)
	{
		copyMatrixOrWeights(crit_new, crit_old);
		copyFunctionManager(crit_new, crit_old);
		copyIF(crit_new, crit_old);	
	}
	
	
	
	// ---------------------------------------------  MIGRAZIONE DATI TRA MODEL INSTANCE DIVERSI  ----------------------------------------------------------
	// Funzione richiamata dall'esterno per la migrazione dei dati di un ModelInstance in un altro per i Criteria uguali (nodi con la stessa descrizione)
	public void importDataInstance(ModelInstance mi_old)
	{
		CriteriaInstance root_crit_old = mi_old.getRootCriteriaInstance();

		ArrayList<CriteriaInstance> crit_list = new ArrayList<CriteriaInstance>(); 
		createArrayListOfCriteriaInstance(root, crit_list);
		for(int j=0; j<crit_list.size(); j++)
			copyDataWithSameDescriptionOldInstanceCycle(crit_list.get(j), root_crit_old);
	}
	
	private void createArrayListOfCriteriaInstance(CriteriaInstance crit, ArrayList<CriteriaInstance> crit_inst_array)
	{
		crit_inst_array.add(crit);
		for(int i=0; i<crit.getNumChildrenInstance(); i++)
			createArrayListOfCriteriaInstance(crit.getChildInstance(i), crit_inst_array);
	}
	
	private void copyDataWithSameDescriptionOldInstanceCycle(CriteriaInstance crit_new, CriteriaInstance crit_old)
	{
		if(crit_new == ModelInstanceStore.getInstance().getModelInstances(crit_new.getModelInstanceId(), 0).get(0).getRootCriteriaInstance() &&
				crit_old == ModelInstanceStore.getInstance().getModelInstances(crit_old.getModelInstanceId(), 0).get(0).getRootCriteriaInstance())
		{
			if(crit_new.getNumChildrenInstance() == crit_old.getNumChildrenInstance())
				copyMatrixOrWeights(crit_new, crit_old);
		}
		else if(crit_new != ModelInstanceStore.getInstance().getModelInstances(crit_new.getModelInstanceId(), 0).get(0).getRootCriteriaInstance() &&
				crit_old != ModelInstanceStore.getInstance().getModelInstances(crit_old.getModelInstanceId(), 0).get(0).getRootCriteriaInstance())
		{	
			if(crit_new.getDescription().equals(crit_old.getDescription()))
			{	
				copyIF(crit_new, crit_old);
				copyFunctionManager(crit_new, crit_old);
				if(crit_new.getNumChildrenInstance() == crit_old.getNumChildrenInstance())
					copyMatrixOrWeights(crit_new, crit_old);
			}	
		}
		
		for(int i=0; i<crit_old.getNumChildrenInstance(); i++)
			copyDataWithSameDescriptionOldInstanceCycle(crit_new, crit_old.getChildInstance(i));	
	}
	// -----------------------------------------------------------------------------------------------------------------------------------------------------
	
	
	
	// -------------------------------------------------------------------  CLONAZIONE ---------------------------------------------------------------------
	// Funzione per la copiatura di tutti i dati dei CriteriaInstance utilizzata dalla funzione cloneModelInstance()
	public void copyDataInstance(CriteriaInstance crit_new, CriteriaInstance crit_old)
	{
		copyAllDataCriteria(crit_new, crit_old);
		for(int i=0; i<crit_new.getNumChildrenInstance(); i++)
			copyDataInstance(crit_new.getChildInstance(i), crit_old.getChildInstance(i));
	}
	
	// Funzione per la clonazione di un ModelInstance
	public ModelInstance cloneModelInstance(int modelInstanceId, int userInstanceId, Model model)
	{
		ModelInstance mi = new ModelInstance(modelInstanceId, specific_objective.concat("_cloned"), userInstanceId, model);
		copyDataInstance(mi.getRootCriteriaInstance(), root);
		return mi;
	}
	// ------------------------------------------------------------------------------------------------------------------------------------------------------
	
	
	
	
	// ---------------------------------------------------------------- COMPUTE DECISION --------------------------------------------------------------------
	// --------- Compute Decision - calculate all query on criterias instance -------------------------------------------------------------------------------
	private boolean verifyLogicFunction(LogicFunction lf)
	{
		boolean verify_lf = false;
		
		if(lf.getCompare() == 0 && lf.getResult() < lf.getThreshold1())
			verify_lf = true;
		
		if(lf.getCompare() == 1 && lf.getResult() <= lf.getThreshold1())
			verify_lf = true;
		
		if(lf.getCompare() == 2 && lf.getResult() == lf.getThreshold1())
			verify_lf = true;
		
		if(lf.getCompare() == 3 && lf.getResult() >= lf.getThreshold1())
			verify_lf = true;
		
		if(lf.getCompare() == 4 && lf.getResult() > lf.getThreshold1())
			verify_lf = true;
		
		if(lf.getCompare() == 5 && (lf.getResult() > lf.getThreshold1() && lf.getResult() < lf.getThreshold2()))
			verify_lf = true;
		
		return verify_lf;
	}
	
	private boolean verifyLogicFunctionManager(int notFunction1, int logicConnector, int notFunction2, boolean verify_lf1, boolean verify_lf2)
	{
		boolean verify_lfm = false;
		boolean verify_lf1_final = verify_lf1;
		boolean verify_lf2_final = verify_lf2;
		if(notFunction1 == 2)
			verify_lf1_final = !verify_lf1;
		if(notFunction2 == 2)
			verify_lf2_final = !verify_lf2;
	
		if(notFunction2 == 0)
		{	
			if(verify_lf1_final)
				verify_lfm = true;
		}else{
			if(logicConnector == 1 && (verify_lf1_final && verify_lf2_final))
				verify_lfm = true;
			else if(logicConnector == 2 && (verify_lf1_final || verify_lf2_final))
				verify_lfm = true;
		}		
		return verify_lfm;
	}
	
	
	private void setIFFromResultLogicManager(CriteriaInstance crit_inst, String typeIF, double value)
	{
		if(crit_inst.getIFInsert() == null)
			crit_inst.setIFInsert(new ItalianFlag());
		
		if(typeIF.equals("G"))
			crit_inst.getIFInsert().setGreen(value);
		else if(typeIF.equals("W"))
			crit_inst.getIFInsert().setWhite(value);
		else if(typeIF.equals("R"))
			crit_inst.getIFInsert().setRed(value);
	}
	
	private void setLastIFElement(CriteriaInstance crit_inst)
	{
		if((crit_inst.getFunctionManager().getTypeIF1().equals("W") && crit_inst.getFunctionManager().getTypeIF2().equals("R")) ||
				(crit_inst.getFunctionManager().getTypeIF1().equals("R") && crit_inst.getFunctionManager().getTypeIF2().equals("W")))	
			crit_inst.getIFInsert().setGreen(1.0-(crit_inst.getIFInsert().getWhite()+crit_inst.getIFInsert().getRed()));
		
		if((crit_inst.getFunctionManager().getTypeIF1().equals("G") && crit_inst.getFunctionManager().getTypeIF2().equals("R")) ||
				(crit_inst.getFunctionManager().getTypeIF1().equals("R") && crit_inst.getFunctionManager().getTypeIF2().equals("G")))
			crit_inst.getIFInsert().setWhite(1.0-(crit_inst.getIFInsert().getGreen()+crit_inst.getIFInsert().getRed()));
		
		if((crit_inst.getFunctionManager().getTypeIF1().equals("G") && crit_inst.getFunctionManager().getTypeIF2().equals("W")) ||
				(crit_inst.getFunctionManager().getTypeIF1().equals("W") && crit_inst.getFunctionManager().getTypeIF2().equals("G")))
			crit_inst.getIFInsert().setRed(1.0-(crit_inst.getIFInsert().getGreen()+crit_inst.getIFInsert().getWhite()));
	}
	
	private void setIFBasedOnResultsQuery(LogicFunctionManager lfm)
	{
		LogicFunction lf1 = lfm.getFunction1();
		LogicFunction lf2 = lfm.getFunction2();
		
		boolean verify_lf1 = verifyLogicFunction(lf1);
		boolean verify_lf2 = false;
		boolean verify_lfm = false;
		if(lf2 == null)
			verify_lfm = verify_lf1;
		else
		{
			verify_lf2 = verifyLogicFunction(lf2);
			verify_lfm = verifyLogicFunctionManager(lfm.getNotFunction1(), lfm.getLogicConnector(), lfm.getNotFunction2(), verify_lf1, verify_lf2);
		}
		
		if(verify_lfm)
		{	
			setIFFromResultLogicManager(lfm.getCriteriaInstance(), lfm.getTypeIF1(), lfm.getValueTrue1());
			setIFFromResultLogicManager(lfm.getCriteriaInstance(), lfm.getTypeIF2(), lfm.getValueTrue2());
		}	
		else
		{	
			setIFFromResultLogicManager(lfm.getCriteriaInstance(), lfm.getTypeIF1(), lfm.getValueFalse1());
			setIFFromResultLogicManager(lfm.getCriteriaInstance(), lfm.getTypeIF2(), lfm.getValueFalse2());
		}	
	}

	
	private void setResultLogicFunction(LogicFunction lf, double result_query, int status)
	{
		ModelInstanceDBInterface mdbi = new ModelInstanceDB();
		lf.setStatus(status);
		lf.setResult(result_query);
		mdbi.setResultLogicFunction(lf.getQuery(), result_query);
		mdbi.changeStatusLogicFunction(lf.getQuery(), status);
	}

	private void setResultLogicFunctionManagerAndIF(LogicFunctionManager lfm)
	{
		ModelInstanceDBInterface mdbi = new ModelInstanceDB();
		setIFBasedOnResultsQuery(lfm);
		setLastIFElement(lfm.getCriteriaInstance());
		mdbi.setIFInsert(lfm.getCriteriaInstance().getPosition(), lfm.getCriteriaInstance().getModelInstanceId(), lfm.getCriteriaInstance().getIFInsert());
		lfm.setStatus(2);
		mdbi.changeStatusLogicFunctionManager(lfm.getCriteriaInstance().getPosition(), lfm.getCriteriaInstance().getModelInstanceId(), 2);
	}

	
	private void executeQuerySPARQL(String repository, CriteriaInstance crit_inst, boolean lf1) throws RepositoryException, QueryEvaluationException, MalformedQueryException
	{	
		System.out.print("\nQuery SPARQL Execution on Criteria Instance " + crit_inst.getPosition());
		Repository repo = new SPARQLRepository(repository);
		repo.initialize();
		RepositoryConnection con = repo.getConnection();
					
		try{
			StringBuilder qb = new StringBuilder();

			if(lf1)
				qb.append(crit_inst.getFunctionManager().getFunction1().getQuery());
			else
				qb.append(crit_inst.getFunctionManager().getFunction2().getQuery());
			
			TupleQueryResult result = con.prepareTupleQuery(QueryLanguage.SPARQL,qb.toString()).evaluate();	

			Value val = null;
			if(result.hasNext()) 
				val = result.next().getValue(result.getBindingNames().get(0)); 
			
			System.out.println("Result query: "+val.stringValue());
			
			int dataType = 0;
			if(val != null)
				dataType = Convert.getInstance().controlTypeValue(val.stringValue());
			
			if(dataType == 0)
			{	
				if(lf1)
					setResultLogicFunction(crit_inst.getFunctionManager().getFunction1(), 0.0, 3);
				else
					setResultLogicFunction(crit_inst.getFunctionManager().getFunction2(), 0.0, 3);
				status = 3;
				System.out.println("Result Type: string (error).");
			}
			else if(dataType == 1)
			{
				if(lf1)
					setResultLogicFunction(crit_inst.getFunctionManager().getFunction1(), Integer.parseInt(val.stringValue()), 2);
				else
					setResultLogicFunction(crit_inst.getFunctionManager().getFunction2(), Integer.parseInt(val.stringValue()), 2);
				System.out.println("Result Type: int.");
			}
			else if(dataType == 2)
			{
				if(lf1)
					setResultLogicFunction(crit_inst.getFunctionManager().getFunction1(), Double.parseDouble(val.stringValue()), 2);
				else
					setResultLogicFunction(crit_inst.getFunctionManager().getFunction2(), Double.parseDouble(val.stringValue()), 2);
				System.out.println("Result Type: double.");
			}
		}
		finally{
			con.close();
		}
	}
	
	private void executeQuerySPARQLFunction(String repository, CriteriaInstance crit_inst, boolean lf1)
	{
			try {
				executeQuerySPARQL(repository, crit_inst, lf1);
			} catch (RepositoryException | QueryEvaluationException | MalformedQueryException e) {
				
				e.printStackTrace();
				if(lf1)
				{	
					System.out.println("Exception execution query for logic function 1!");
					setResultLogicFunction(crit_inst.getFunctionManager().getFunction1(), 0.0, 3);
					status = 3;
				}	
				else
				{	
					System.out.println("Exception execution query for logic function 2!");
					setResultLogicFunction(crit_inst.getFunctionManager().getFunction2(), 0.0, 3);
					status = 3;
				}	
				
			}
	}
	
	
	public CriteriaInstance simulateQuery(int logic_function_id, String repository, String query){
		CriteriaInstance crit_inst = new CriteriaInstance();
		LogicFunctionManager lfm_new = new LogicFunctionManager();
		lfm_new.setSPARQLRepository(repository);
		boolean lf1 = true;
		if(logic_function_id == 1)
		{	
			lfm_new.setFunction1(new LogicFunction(query, 0, 0.0, 0.0, 0));
			lf1 = true;
		}	
		if(logic_function_id == 2)
		{	
			lfm_new.setFunction2(new LogicFunction(query, 0, 0.0, 0.0, 0));
			lf1 = false;
		}	
		crit_inst.setFunctionManager(lfm_new);
		executeQuerySPARQLFunction(repository, crit_inst, lf1);
		return crit_inst;
	}
	
	
	private void computeAllFunctionManagers(CriteriaInstance crit_inst)
	{
		if(crit_inst.getFunctionManager() != null && status != 3)
		{
			ModelInstanceDBInterface mdbi = new ModelInstanceDB();		
			LogicFunctionManager lfm = crit_inst.getFunctionManager();

			// -------------------------------- Queries SPARQL execution for Logic Functions ------------------------------------------
			executeQuerySPARQLFunction(lfm.getSPARQLRepository(), crit_inst, true);
			if(lfm.getFunction2() != null)
				executeQuerySPARQLFunction(lfm.getSPARQLRepository(), crit_inst, false);
		
			if(lfm.getFunction1().getStatus() == 2)
			{	
				if(lfm.getFunction2() != null)
				{	
					if(lfm.getFunction2().getStatus() == 2)	
						setResultLogicFunctionManagerAndIF(lfm);
					else
					{	
						lfm.setStatus(3);
						mdbi.changeStatusLogicFunctionManager(crit_inst.getPosition(), crit_inst.getModelInstanceId(), 3);
					}	
				}
				else
					setResultLogicFunctionManagerAndIF(lfm);
			}else{
				lfm.setStatus(3);
				mdbi.changeStatusLogicFunctionManager(crit_inst.getPosition(), crit_inst.getModelInstanceId(), 3);
			}
				
		}

		for(int i=0; i<crit_inst.getNumChildrenInstance(); i++)
			computeAllFunctionManagers(crit_inst.getChildInstance(i));
	}
	
	private void changeStatusModelInstance(int modelInstanceId, String execution_time)
	{
		Timestamp time_start_exec = null;
		Timestamp time_end_exec = null;
		if(execution_time.equals("start_exec"))
		{	
			status = 1;
			time_start_exec = Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis()));
			specifyTimestampStartExecModelInstance(time_start_exec);
		}	
		else if(execution_time.equals("end_exec"))
		{	
			status = 2;
			time_end_exec = Timestamp.valueOf(Convert.getInstance().getFormatDateTime().format(System.currentTimeMillis()));
			specifyTimestampEndExecModelInstance(time_end_exec);
		}
		else
		{
			status = 3;
		}
		ModelInstanceDBInterface mdbi = new ModelInstanceDB();
		mdbi.changeStatusModelInstance(modelInstanceId, time_start_exec, time_end_exec, status);
	}
	
	public void computeDecision()
	{	
		ModelInstanceDBInterface mdbi = new ModelInstanceDB();
		if(status != 0)
		{	
			mdbi.deleteIFCalculatedBeforeInstanceExecution(modelInstanceId);
			mdbi.changeStatusLogicFunctionsModelInstance(modelInstanceId, 1);
		}	
		changeStatusModelInstance(root.getModelInstanceId(), "start_exec");
		
		
//		try {
//			TimeUnit.MINUTES.sleep(1);
//		} catch (InterruptedException e) {
//			System.out.println("Throw Exception:\n"+e.getMessage());
//			e.printStackTrace();
//		}
		
		
		System.out.println("\n");
		System.out.print("Compute Logic Functions on Criterias Instance..");
		computeAllFunctionManagers(root);
		System.out.print(" computed.");
		
		if(status != 3)
		{	
			System.out.println("");
			System.out.print("Compute Decision..");
			computeDecisionOverCriteriasInstance(root);
			System.out.print("computed.");
			System.out.println("\n\n");
			changeStatusModelInstance(root.getModelInstanceId(), "end_exec");
		}
		else
			changeStatusModelInstance(root.getModelInstanceId(), "");
		
	}
	
	private void computeDecisionOverCriteriasInstance(CriteriaInstance criteria_instance)
	{
		for(int i=0; i<criteria_instance.getNumChildrenInstance(); i++)
			computeDecisionOverCriteriasInstance(criteria_instance.getChildInstance(i));
		
		CriteriaInstance father = criteria_instance.getFatherInstance(); 
		if(father != null && father.getChildInstance(father.getNumChildrenInstance()-1) == criteria_instance)
		{	
			double green = 0.0, white = 0.0, red = 0.0;
			for(int i=0; i<father.getNumChildrenInstance(); i++)
			{
				CriteriaInstance child = father.getChildInstance(i);
				double green_tmp = 0.0, white_tmp = 0.0, red_tmp = 0.0;
				if(!child.getIsLeaf())
				{
					green_tmp = child.getIFCalculated().getGreen();
					white_tmp = child.getIFCalculated().getWhite();
					red_tmp = child.getIFCalculated().getRed();
				}else{
					green_tmp = child.getIFInsert().getGreen();
					white_tmp = child.getIFInsert().getWhite();
					red_tmp = child.getIFInsert().getRed();
				}
				green += green_tmp * father.getWeightsEdges()[i];
				white += white_tmp * father.getWeightsEdges()[i];
				red += red_tmp * father.getWeightsEdges()[i];
			}
			father.setIFCalculated(new ItalianFlag(green, white, red));
			
			ModelInstanceDBInterface mdbi = new ModelInstanceDB();
			mdbi.setIFCalculated(father.getPosition(), father.getModelInstanceId(), father.getIFCalculated());
		}
	}
}
