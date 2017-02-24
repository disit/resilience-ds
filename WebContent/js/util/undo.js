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

/** Ale - 16-3-25
 * Here are all the functions for the UnDO operation. Undo Operation active during the graph editing.
 * For now are handled only the critical operation.
 * Operation supported:
 * - Function elimination
 * - Aspect elimination
 */
var UnDo = function(Msize){
	
	var stack_lifo; //Array of all the operations.
	var stack_forward; //Forward stack. Array of all the operations undo.	
	var save_enabled = true; //boolean that is true if save is active.
	max_size = 20;
	if(Msize > 0) max_size = Msize; //max number of operations saved in the stack.
		
	/**
	 * Initialize the stack.
	 */
	this.init_undo = function(){
		stack_lifo = new Array();
		stack_forward = new Array();
	}
	
	this.init_undo();
	
	/**
	 * Saves the creation of a function.
	 */
	this.FCreate = function(f_id, forward){
		console.log("F_Create!");
		if(forward == 'undefined') forward = false;
		var operation = new Object;
		operation.type = "f_create";
		operation.F_id = f_id;
		if(!forward) stack_lifo.push(operation);
		else stack_forward.push(operation);
	}
	
	/**
	 * Saves the deletion of a function.
	 * @param f: the function that will be delete.
	 * @param forward: a flag that indicates in which stack save the operation.
	 */
	this.FDelete = function( f, forward ){
		console.log("F_Delete!");
		if(forward == 'undefined') forward = false;
		var operation = new Object;
		operation.type = "f_delete";
		operation.F_id = f.id;
		f_copied = jQuery.extend(false,{},f); //Makes a non deep copy of the node deleted.
		//Makes a copy of the aspect.
		var aspect_copied = new Array();
		var aspect_to_copy = f_copied.aspects;
		for(var i=0; i<aspect_to_copy.length; i++){
			aspect_copied.push(jQuery.extend(false,{},aspect_to_copy[i]));
		}
		f_copied.aspects = aspect_copied;
		//save the function info and the aspect deleted. The full node.
		operation.f_deleted = f_copied;
		console.log(operation);
		if(!forward) stack_lifo.push(operation);
		else stack_forward.push(operation);
	}
	
	/** Ale
	 * Saves the creation of a new aspect. The parameters needed is the aspect added, and the id of the function eventually added. 
	 * The aspect id is not sufficient because there could be the same aspect among different functions.
	 */
	this.ACreate = function( new_aspect, new_f_id, forward ){
		console.log("SAVE Aspect creation!");
		if(forward == 'undefined') forward = false;
		var operation = new Object;
		operation.type = "a_create";
		operation.new_aspect = jQuery.extend(false, {}, new_aspect);
		operation.new_aspect.source = jQuery.extend(false, {}, new_aspect.source);
		operation.new_aspect.target = jQuery.extend(false, {}, new_aspect.target);
		operation.new_function_id = new_f_id;
		console.log( operation );
		if(!forward) stack_lifo.push( operation );
		else stack_forward.push( operation );
	}
	
	/** Ale
	 * Saves the deletion of an aspect. The parameters needed is the aspect deleted. 
	 */
	this.ADelete = function( deleted_aspect, forward ){
		console.log("SAVE Aspect deletion!");
		if(forward == 'undefined') forward = false;
		var operation = new Object;
		operation.type = "a_delete";
		operation.aspect_deleted = jQuery.extend( false, {}, deleted_aspect );
		operation.aspect_deleted.source = jQuery.extend( false, {}, deleted_aspect.source );
		operation.aspect_deleted.target = jQuery.extend( false, {}, deleted_aspect.target );
		console.log( operation );
		if(!forward) stack_lifo.push( operation );
		else stack_forward.push( operation );
	}
	
	/** Ale
	 * Saves the modification of a new aspect. The parameters needed is the aspect modiifed
	 */
	this.AModify = function( new_aspect, old_aspect, forward ){
		console.log("SAVE Aspect modification!");
		if(forward == 'undefined') forward = false;
		var operation = new Object;
		operation.type = "a_modify";
		operation.aspect_modified = jQuery.extend(false, {}, new_aspect);
		operation.aspect_modified.source = jQuery.extend(false, {}, new_aspect.source);
		operation.aspect_modified.target = jQuery.extend(false, {}, new_aspect.target);
		operation.aspect_old = jQuery.extend(false, {}, old_aspect);
		operation.aspect_old.source = jQuery.extend(false, {}, old_aspect.source);
		operation.aspect_old.target = jQuery.extend(false, {}, old_aspect.target);
		console.log( operation );
		if(!forward) stack_lifo.push( operation );
		else stack_forward.push( operation );
	}
	
	/**Ale
	 * save the creation of a group.
	 */
	this.GCreate = function(G, forward){
		console.log(" Saves the creation of a group. ");
		if(forward == 'undefined') forward = false;
		var operation = new Object;
		operation.type = "g_createGroup";
		operation.g_id = G.id;
		console.log( operation );
		if(!forward) stack_lifo.push( operation );
		else stack_forward.push( operation );
	}
	
	/**Ale
	 * save the add of a function in a group.
	 */
	this.GAddF = function(G, F, forward){
		console.log(" Saves the add of a function in a group. ");
		var operation = new Object;
		operation.type = "g_addFunction";
		operation.g_id = G;
		operation.f_id = F;		
		console.log( operation );
		if(!forward) stack_lifo.push( operation );
		else stack_forward.push( operation );
	}
	
	/** Ale
	 * Save the function removes from a group.
	 */
	this.GRemoveF = function (G, F, forward){
		console.log(" Saves the remotion of a function from a group.");
		var operation = new Object;
		operation.type = "g_removeFunction";
		operation.g_id = G;
		operation.f_id = F;		
		console.log( operation );
		if(!forward) stack_lifo.push( operation );
		else stack_forward.push( operation );
	}
	
	/**Ale
	 * Save the deletion of a group. 
	 */
	this.GDelete = function( G, forward ){
		console.log(" Saves the group deletion");
		var operation = new Object;
		operation.type = "g_deleteGroup";
		var g_deleted;
		g_deleted = jQuery.extend( false, {}, G );
		operation.g_id = G.id;
		//Makes a copy of the functions in the group.
		var functions_copied = new Array();
		var f_to_copy = g_deleted.functions;
		for(var i=0; i<f_to_copy.length; i++){
			functions_copied.push({id:f_to_copy[i].id});
		}
		g_deleted.functions = functions_copied;
		//save the group info. The full node.
		operation.group_deleted = g_deleted;
		console.log( operation );
		if(!forward) stack_lifo.push( operation );
		else stack_forward.push( operation );
	}
	//----------------- UNDO Operations -----------------------------------------------------------------
	/**
	 * Undo the creation of a function.
	 */
	this.undoFCreate = function(operation){
		//Removes the node with id operation.f_id.
		console.log("UnDo function created.");
		var node_to_delete = nodes.filter(function(d){return d.id==operation.F_id;});
		
		if(node_to_delete.length > 0) deleteFunction(node_to_delete[0]);
		else console.log(" The function is no longer present. ");
	}
	
	/**
	 * Undo the deletion of a function.
	 */
	this.undoFDelete = function(operation){
		//Removes the node with id operation.f_id.
		console.log("UnDo function deleted.");
		var node_to_add = operation.f_deleted;
		console.log( node_to_add );
		//Adds the function.
		nodes.push( node_to_add );
		//Adds the aspects. If the aspect is no more present adds it. If is already present update the source or the target depending on the one the type.
		var aspect_to_add = node_to_add.aspects;
		for(var i=0; i<aspect_to_add.length; i++){
			var aspect_to_update = aspects.filter(function(d){if(d.id==aspect_to_add[i].id && d.type == aspect_to_add[i].type) return d;});
			if(aspect_to_update.length == 0){
				//Rebinds source and target.
				if(aspect_to_add[i].type=="Output"){
					aspect_to_add[i].source = node_to_add;
					if(aspect_to_add[i].target){
						var f = nodes.filter(function(d){return d.id == aspect_to_add[i].target.id;});
						if( f[0] != undefined ){
							aspect_to_add[i].target = f[0];
							links.push(aspect_to_add[i]);
							f[0].aspects.push(aspect_to_add[i]);
						}
					} 
				}
				else{
					aspect_to_add[i].target = node_to_add;
					if(aspect_to_add[i].source){
						var f = nodes.filter(function(d){return d.id == aspect_to_add[i].source.id;});
						if( f[0] != undefined ){
							aspect_to_add[i].source = f[0];
							links.push(aspect_to_add[i]);
							f[0].aspects.push(aspect_to_add[i]);
						}
					}
				}
				aspects.push(aspect_to_add[i]);
			}
			else{ //Updates
				if(!aspect_to_update[0].source){
					console.log("Add source");
					aspect_to_update[0].source = node_to_add;
					if(aspect_to_update[0].target) links.push(aspect_to_update[0]);
				}
				else if(!aspect_to_update[0].target){
					console.log("Add target");
					aspect_to_update[0].target = node_to_add;
					aspect_to_update[0].type = aspect_to_add[i].type;
					if(aspect_to_update[0].source) links.push(aspect_to_update[0]);
				}
			}
		}
		//Re-bind the group connection.
		if(node_to_add.in_group){
			var g_found;
			g_found = nodes.filter(function(d){
				if(d.id == node_to_add.group.id){
					d.functions.push(node_to_add);
					return d;
				}
			});
			if(g_found.length > 0){
				node_to_add.group = g_found[0];
			}
		}
		
		updateFRAMModel();
		addFunctionTextModify( node_to_add.id );
	}
	
	/** Ale
	 * UnDo the creation of a new aspect.
	 */
	this.undoACreate = function(operation){
		console.log("UNDO Aspect creation!");
		var a_to_delete = operation.new_aspect;
		var a_s="null", a_t="null", a_type;
		if(a_to_delete.source.id != null) a_s = a_to_delete.source.id;
		if(a_to_delete.target.id != null) a_t = a_to_delete.target.id;
		a_type = a_to_delete.type;
		deleteAspect(a_to_delete.id, a_s, a_t, a_type);
		if(operation.new_function_id){ //If a function has been created
			var node_to_delete = nodes.filter(function(d){return d.id==operation.new_function_id;});
			if(node_to_delete.length > 0) deleteFunction(node_to_delete[0]);
			else console.log(" The function is no longer present. ");
		}
	}
	
	/** Ale
	 * UnDo the deletion of an aspect.
	 */
	this.undoADelete = function(operation){
		console.log("UNDO Aspect deletion!");
		var aspect_to_add = operation.aspect_deleted;		
		//Binds the connection
		var f_source = nodes.filter( function(d){ return d.id == aspect_to_add.source.id; });
		if( f_source.length > 0 ){ aspect_to_add.source = f_source[0]; }
		var f_target = nodes.filter( function(d){ return d.id == aspect_to_add.target.id; });
		if( f_target.length > 0 ){ aspect_to_add.target = f_target[0]; f_target[0].aspects.push(aspect_to_add); }
		if( f_source.length > 0 ){ f_source[0].aspects.push(aspect_to_add);}		
		
		if(aspect_to_add.source.id == null) aspect_to_add.source = undefined;
		if(aspect_to_add.target.id == null) aspect_to_add.target = undefined;
		//Adds the aspect.
		aspects.push(aspect_to_add);
		//Adds the relative links.
		if( f_source.length > 0 && f_target.length > 0 ){ 
			links.push( aspect_to_add );
			updateMultiLabel("add", aspect_to_add);
		}
		updateFRAMModel();
	}
	
	/** Ale
	 * UnDo the modification of a new aspect. Updates the aspect with the parameters of the new one. 
	 * N.B. If a new function is created with the the modify, it's not deleted. 
	 */
	this.undoAModify = function(operation){
		console.log("UNDO Aspect modify!");
		var a_to_update = operation.aspect_modified;
		var a_old = operation.aspect_old;
		
		var a_s = null, a_t = null, a_type;
		if(a_to_update.source.id != null) a_s = a_to_update.source.id;
		if(a_to_update.target.id != null) a_t = a_to_update.target.id;
		a_type = a_to_update.type;
		
		a_to_update = find_aspect(a_to_update.id, a_s, a_t, a_type);
		if(a_to_update.length==0) return;
		else a_to_update = a_to_update[0];
		
		a_s = undefined, a_t = undefined, a_type;
		if(a_old.source.id != null){
			a_s = nodes.filter(function(d){
				return d.id == a_old.source.id;
			});
			if(a_s.length>0) a_s = a_s[0];
		}
		if(a_old.target.id != null){
			a_t = nodes.filter(function(d){
				return d.id == a_old.target.id;
			});
			if(a_t.length>0) a_t = a_t[0];
		}
		a_type = a_old.type;
		//Binds the connection
		a_to_update.type = a_type;
		a_to_update.source = a_s;
		a_to_update.target = a_t;
		
		updateFRAMModel();//Updates the graph.
	}
	
	/** Ale
	 * Undo the creation of a group
	 */
	this.undoGCreate = function(operation){
		console.log("Undo the creation of a group");
		var g_to_delete = nodes.filter(function(d){return d.id == operation.g_id;});
		if(g_to_delete.length > 0 ){
			save_enabled = false;
			deleteGroup(g_to_delete[0], false);
			save_enabled = true;
		}
		updateFRAMModel();
	}
	
	/** Ale
	 * Undo the creation of a group
	 */
	this.undoGAddF = function( operation ){
		console.log("Undo the add of a function to a group");
		removeFunctionNodeFromGroupNode(operation.f_id, operation.g_id); // Removes the function from the group.
		updateFRAMModel();
	}
	
	/** Ale
	 * Undo the remotion of a function from a group.
	 */
	this.undoGRemoveF = function( operation ){
		console.log("Undo the subtraction of a function from a group");
		this.save_enabled = false;
		addFunctionNodeForGroupNode(operation.f_id, operation.g_id);
		this.save_enabled = true;
		updateFRAMModel();
	}
	
	/** Ale
	 * Undo the deletion of a Group. Re-binds all the functions in the group.
	 */
	this.undoGDelete = function( operation ){
		console.log(" Undo the group deletion. ");
		// Adds the group in the graph.
		var g_toAdd = operation.group_deleted;
		g_toAdd.functions = new Array();
		// TODO Check if the function is in a group, for re-bind the connection.
		nodes.push(g_toAdd);
		updateFRAMModel();
		addFunctionTextModify(operation.g_id);
	}
	//------------------------SAVE Operations -------------------------------------
	/** Ale
	 * Saves the operation specified by type.
	 */
	this.saveOp = function(operation_type, F, A, G){
		if(!save_enabled) return;
		// Checks the operation type to save.
		switch(operation_type){
		case "f_create":
			this.FCreate(F);
			break;
		case "f_delete":
			this.FDelete(F);
			break;
		// Aspect cases --------------------------
		case "a_create":
			this.ACreate(A, F);
			break;
		case "a_delete":
			this.ADelete(A);
			break;
		case "a_modify":
			this.AModify(A, F); // F in this case is the old aspect.
			break;
		// Group cases ----------------------------
			//The create case is the same of the function.
		case "g_deleteGroup":
			this.GDelete(G);
			break;
		case "g_addFunction":
			this.GAddF(G, F);
			break;
		case "g_removeFunction":
			this.GRemoveF(G, F);
			break;
		}		
		// Updates the status of the undo button.
		if(stack_lifo.length==1){ submenuViewBack(); }// Active the button.
		if(stack_lifo.length>max_size){ stack_lifo.splice( 0, stack_lifo.length-max_size); } //Removes the first element in chronological order.
		//Reset the forward button.
		this.resetForward();
	}
	
	/** Ale
	 * Turn back of one step.
	 */
	this.undo = function(){
		var operation = stack_lifo.pop();
		console.log("Undo!");
		console.log(operation);
		// Checks the operation type and makes the relative UnDO
		switch(operation.type){
		case "f_create":
			//save forward
			var f = nodes.filter(function(d){return d.id==operation.F_id;});
			this.FDelete(f[0], true); //saves the forward operation.
			//do back
			this.undoFCreate(operation);
			break;
		case "f_delete":
			//save forward
			this.FCreate(operation.f_deleted.id, true); //saves the forward operation.
			//do back
			this.undoFDelete(operation);
			break;
		//------- Aspect cases ------------------------
		case "a_create":
			/*
			 * The forward below if there is a function id that was deleted, it makes only the forward of the deletion because is necessary also for recreate the aspect.
			 * otherwise it save the aspect elimination.
			 */
			var f = nodes.filter(function(d){return d.id == operation.new_function_id;});
			if(f[0] != undefined) this.FDelete(f[0], true);
			else this.ADelete(operation.new_aspect, true);
			//do back
			this.undoACreate(operation);
			break;
		case "a_delete":
			//save forward
			this.ACreate(operation.aspect_deleted, null, true);
			//do back
			this.undoADelete(operation);
			break;
		case "a_modify":
			//save forward
			this.AModify(operation.aspect_old, operation.aspect_modified, true);
			//do back
			this.undoAModify(operation);
			break;
		//----------- Group cases ------------------------
		case "g_deleteGroup":
			this.GCreate( operation.group_deleted ,true );
			this.undoGDelete( operation );
			break;
		case "g_addFunction":
			this.GRemoveF( operation.g_id, operation.f_id, true );			
			this.undoGAddF( operation );
			break;
		case "g_removeFunction":
			this.GAddF( operation.g_id, operation.f_id, true );
			this.undoGRemoveF( operation );
			break;
		}
		// Updates the status of the UnDo button.
		if(stack_forward.length >= 1 ){ submenuViewForward();} // Active the forward button
		if(stack_lifo.length == 0){ submenuDisableBack();} // Disables the undo button
	}
	
	/** Ale
	 * Turns on of one step.
	 */
	this.forward = function(){
		var operation = stack_forward.pop();
		console.log("Forward!");
		console.log(operation);
		// Checks the operation type and makes the relative UnDO
		switch(operation.type){
		case "f_create":
			var f = nodes.filter(function(d){return d.id==operation.F_id;});
			this.FDelete(f[0]); //saves the undo operation.
						
			this.undoFCreate(operation);
			break;
		case "f_delete":
			this.FCreate(operation.f_deleted.id); //saves the forward operation.
			
			this.undoFDelete(operation);
			break;
		case "a_create":
			//save back
			this.ADelete(operation.new_aspect);
			//do forward
			this.undoACreate(operation);
			break;
		case "a_delete":
			//save back
			this.ACreate(operation.aspect_deleted);
			//do forward
			this.undoADelete(operation);
			break;
		case "a_modify":
			//save back
			this.AModify(operation.aspect_old, operation.aspect_modified);
			//do forward
			this.undoAModify(operation);
			break;
		// -------------Group cases----------------
		case "g_createGroup":
			var g = nodes.filter(function(d){ return d.id == operation.g_id; });
			if(g.length > 0 ) this.GDelete(g[0]);
			this.undoGCreate(operation);
			break;
		case "g_addFunction":
			this.GRemoveF(operation.g_id, operation.f_id);
			this.undoGAddF(operation);
			break;
		case "g_removeFunction":
			this.GAddF(operation.g_id, operation.f_id);
			this.undoGRemoveF(operation);
			break;
		}
		// Updates the status of the UnDo button.
		if(stack_lifo.length == 1){ submenuViewBack();} // Active the undo button
		if(stack_forward.length == 0){ submenuDisableForward();} // Disables the forward button
	}
	
	/** Ale
	 * Function that returns the stack 
	 */
	this.getStackList = function(){
		return stack_lifo;
	}
	
	/** Ale
	 * Function that returns the stack of the forward
	 */
	this.getForwardList = function(){
		return stack_forward;
	}
	
	/** Ale
	 * Reset the forward button. Every time that is made a new action.
	 */
	this.resetForward = function(){
		stack_forward = new Array(); //Clear the array.
		submenuDisableForward(); //Reset the button icon.
	}
	
	this.getMaxSize = function(){
		return max_size;
	}
	
	this.getSaveStatus = function(){
		return save_enabled;
	}
	
	this.setSaveStatus = function(status){
		save_enabled = status;
	}
	
	/** Ale
	 * disables the save.
	 */
	this.disable_save = function(){
		save_enabled = false;
	}
	
	/** Ale
	 * enables the save.
	 */
	this.enable_save = function(){
		save_enabled = true;
	}
}
