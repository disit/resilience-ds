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

package fram.user;

public class DecisionMaker extends User
{
	private int type;
	private Permit []permits_model;
	private Permit []permits_instance;
	private Permit []permits_software;

	public DecisionMaker(String name, String email, String country, int id, int type) {
		//super(name, email, country, id);
		// TODO Auto-generated constructor stub
		
		this.setUser(name, email, country, id);
		
		this.type = type;
		
		// Permessi sulle operazioni dei modelli
		permits_model = new Permit[13];
		permits_model[0] = new Permit("Visualizzazione di tutti i modelli", 0, true);
		permits_model[1] = new Permit("Creazione di un nuovo modello", 1, true);
		permits_model[2] = new Permit("Creazione criterio", 2, true);
		permits_model[3] = new Permit("Inserimento matrici confronto a coppie", 3, true);
		permits_model[4] = new Permit("Salvataggio modello", 4, true);
		permits_model[5] = new Permit("Caricamento modello", 5, true);
		permits_model[6] = new Permit("Modifica modello", 6, true);
		permits_model[7] = new Permit("Modifica criteri", 7, true);
		permits_model[8] = new Permit("Modifica matrici di confronto a coppie", 8, true);
		permits_model[9] = new Permit("Modifica funzioni logiche", 9, true);
		permits_model[10] = new Permit("Clonazione modello", 10, true);
		permits_model[11] = new Permit("Eliminazione modello", 11, true);
		permits_model[12] = new Permit("Eliminazione criterio", 12, true);
		
		
		// Permessi sulle operazioni delle istanze dei modelli
		permits_instance = new Permit[14];
		permits_instance[0] = new Permit("Visualizzazione istanze modello", 0, true);
		permits_instance[1] = new Permit("creazione nuova istanza", 1, true);
		permits_instance[2] = new Permit("definizione funzioni logiche per i criteri", 2, true);
		permits_instance[3] = new Permit("inserimento IF", 3, true);
		permits_instance[4] = new Permit("caricamento istanza modello", 4, true);
		permits_instance[5] = new Permit("modifica istanza modello", 5, true);
		permits_instance[6] = new Permit("modifica criteri istanza", 6, true);
		permits_instance[7] = new Permit("modifica criteri istanza", 7, true);
		permits_instance[8] = new Permit("modifica funzioni logiche per i criteri", 8, true);
		permits_instance[9] = new Permit("modifica IF per i criteri", 9, true);
		permits_instance[10] = new Permit("salvataggio istanza modello", 10, true);
		permits_instance[11] = new Permit("eliminazione istanza", 11, true);
		permits_instance[12] = new Permit("eliminazione criterio istanza", 12, true);
		permits_instance[13] = new Permit("calcolo decisione", 13, true);
		
		
		// Permessi sulle operazioni del software
		permits_software = new Permit[2];
		permits_software[0] = new Permit("Impostazioni applicazione", 0, false);
		permits_software[1] = new Permit("Gestione permessi utenti", 1, false);
	}
	
	public int getType()
	{
		return 3;
	}
	
	public String getTypeString()
	{
		return "Decision Maker";
	}
	
	public Permit getPermitModel(int id_permits_model)
	{
		return permits_model[id_permits_model];
	}
	
	public Permit[] getPermitsModel(){
		return permits_model;
	}
	
	public String[] getDescriptionPermitsModel()
	{
		String descriptions[] = new String[permits_model.length];
		
		for(int i = 0; i < permits_model.length; i++)
		{
			descriptions[i] = permits_model[i].getDescription();
		}
		
		return descriptions;
	}
	
	public boolean[] getValuePermitsModel()
	{
		boolean values[] = new boolean[permits_model.length];
		
		for(int i = 0; i < permits_model.length; i++)
		{
			values[i] = permits_model[i].getValue();
		}
		
		return values;
	}
	
	public Permit getPermitInstance(int id_permits_instance)
	{
		return permits_instance[id_permits_instance];
	}
	
	public Permit[] getPermitsInstance(){
		return permits_instance;
	}
	
	@Override
	public String toString()
	{	
		return "\nName= "+this.name+"\nEmail= "+this.email+"\nCountry= "+this.country+"\nUser type= Decision Maker";
	}
}
