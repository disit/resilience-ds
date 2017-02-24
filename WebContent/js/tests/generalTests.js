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

/*Ale
 * In this file there are some test functions written in jasmine created for work with KARMA
 */
var FRAMTests = function(){
	/**Ale 
	 * Runs all the tests provided.
	 */
	this.testAll = function(){
		console.log("-----Run all the tests-------");
		this.testAspectsNotEmpty();
		this.checkAllBind();
	}
	
	/** Ale
	 * Checks if there are aspects without source and target.
	 */
	this.testAspectsNotEmpty = function(){
		var empty_aspect = false;
		for(var i in aspects){
			if(!aspects[i].source && !aspects[i].target){ empty_aspect = true; break; } 
		}
		if(empty_aspect) console.log("---!!! Test Empty Aspects");
		else console.log("+++ Test Empty Aspects");
	}
	
	/** Ale
	 * Checks if all the variables are binded together
	 */
	this.checkAllBind = function(){
		//Calls sub functions
		this.checkNodesBind();
		this.checkAspectsBind();
		this.checkLinksBind();
	}
	
	/**Ale
	 * Checks the bind for the nodes.
	 */
	this.checkNodesBind = function(){
		var N_binded = true;
		for(var n in nodes){
			if( nodes[n].is_group ) N_binded = this.checkGroupBind(nodes[n],true);
			else N_binded = this.checkFunctionBind(nodes[n],true)
			if(!N_binded) break;
		}
		if(N_binded) console.log("+++ All Nodes binded");
		else console.log("---!!! All Nodes binded");
	}
	
	/** Ale
	 * Checks the bind for the aspects. If are present source and target
	 */
	this.checkAspectsBind = function(){
		var a_binded = true;
		for(var a in aspects){
			if(aspects[a].source && nodes.indexOf(aspects[a].source)==-1){ a_binded = false; break; }
			if(aspects[a].target && nodes.indexOf(aspects[a].target)==-1){ a_binded = false; break; }
		}
		if(a_binded) console.log("+++ ASPECTS binded");
		else console.log("---!!! ASPECTS binded");
	}
	
	/**Ale
	 * Checks the bind for the function, if are resent all the aspects.
	 */
	this.checkFunctionBind = function(f,return_result){
		var node_binded = true;
		if(f.aspects){
			for(var a in f.aspects){
				if( aspects.indexOf( f.aspects[a] ) == -1 ){ node_binded = false; break; }
			}
		}
		if(return_result){
			return node_binded;
		}
		else{
			if(node_binded) console.log("+++ Function "+f.id+" - "+f.name+" Binded Correctly");
			else console.log("---!!! Function "+f.id+" - "+f.name+" Binded Correctly");
		}
	}
	
	/**ALe
	 * Checks the bind for all the links
	 */
	this.checkLinksBind = function(){
		var a_binded = true;
		for(var a in links){
			if(aspects.indexOf(links[a]) == -1){ a_binded = false; break;}
		}
		if(a_binded) console.log("+++ LINKS binded");
		else console.log("---!!! LINKS binded");
	}
	
	/** Ale
	 * Checks the bind for all the group
	 */
	this.checkGroupBind = function(g,return_result){ //Checks the bind of the function.
		var node_binded = true;
		if(g.functions){
			for(var f in g.functions){
				if( nodes.indexOf( g.functions[f] ) == -1 ){ node_binded = false; break; }
			}
		}
		if(return_result){
			return node_binded;
		}
		else{
			if(node_binded) console.log("+++ GROUP "+g.id+" - "+g.name+" Binded Correctly");
			else console.log("---!!! GROUP "+g.id+" - "+g.name+" Binded Correctly");
		}
	}
	
	
}