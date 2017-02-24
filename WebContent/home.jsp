<%-- ResilienceDS
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
along with this program.  If not, see <http://www.gnu.org/licenses/>. --%>

<%@ page import="fram.user.*"%>
<%@ page import="java.util.ArrayList"%>
<%@ page language="java" contentType="text/html; charset=US-ASCII"
    pageEncoding="US-ASCII"%>
    
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>

<head>

	<meta http-equiv="Content-Type" content="text/html; charset=US-ASCII">
	<meta http-equiv="Cache-control" content="public">
	
	<title>ResilienceDS</title>
	
	<!-- External library -->
	<script type="text/javascript" src="lib/d3/d3.min.js"></script>
	<script type="text/javascript" src="lib/jquery/jquery-1.11.2.min.js"></script>
	<script type="text/javascript" src="lib/jquery-ui/jquery-ui.js"></script>
	<link rel="stylesheet" href="lib/jquery-ui/jquery-ui.css" type="text/css" media="screen" />
	<script type="text/javascript" src="lib/spin/spin.js"></script>
	<script type="text/javascript" src="lib/toastr/toastr.min.js"></script>
	<link rel="stylesheet" href="lib/toastr/toastr.min.css" type="text/css" media="screen" />
	
	<!-- Internal library -->
	<script type="text/javascript" src="lib/XML/ObjTree.js"></script>
	<script type="text/javascript" src="js/client.js"></script>
	<script type="text/javascript" src="js/configVar.js"></script>
	<script type="text/javascript" src="js/connection/asyncContext.js"></script>
	<script type="text/javascript" src="js/httprequest/httpRequestModel.js"></script>
	<script type="text/javascript" src="js/httprequest/httpRequestCriteria.js"></script>
	<script type="text/javascript" src="js/httprequest/httpRequestModelInstance.js"></script>
	<script type="text/javascript" src="js/httprequest/httpRequestCriteriaInstance.js"></script>
	<script type="text/javascript" src="js/httprequest/httpRequestOperationModel.js"></script>
	<script type="text/javascript" src="js/httprequest/httpRequestOperationModelInstance.js"></script>
	<script type="text/javascript" src="js/httprequest/httpRequestUser.js"></script>
	<script type="text/javascript" src="js/view/view.js"></script>
	<script type="text/javascript" src="js/util/util.js"></script>
	<script type="text/javascript" src="js/util/undo.js"></script>
	<script type="text/javascript" src="js/data/user.js"></script>
	<script type="text/javascript" src="js/data/model.js"></script>
	<script type="text/javascript" src="js/data/FRAMmodelInstance.js"></script>
	<script type="text/javascript" src="js/data/modelInstance.js"></script><!-- XXX OLD -->
	<script type="text/javascript" src="js/data/modelCloned.js"></script>
	<script type="text/javascript" src="js/graphics/windows/info_div.js"></script>
	<script type="text/javascript" src="js/graphics/windows/modify_model_window.js"></script>
	<script type="text/javascript" src="js/graphics/windows/alert_window.js"></script>
	<script type="text/javascript" src="js/graphics/windows/export_FRAMmodel_window.js"></script>
	<script type="text/javascript" src="js/tests/generalTests.js"></script>
	
	<!-- Sliding effect -->
	<script src="lib/jquery/slide.js" type="text/javascript"></script>
	
	<!-- Style CSS -->
	<link rel="stylesheet" href="css/menu/menu.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/home.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/window.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/slide_user/style.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/slide_user/slide.css" type="text/css" media="screen" />

	<link rel="stylesheet" href="lib/font-awesome-4.6.1/css/font-awesome.min.css" type="text/css" media="screen" />
</head>


<!--  <body onbeforeunload=" return checkUnload()" onunload="deleteTemporaryData()">  -->
<body onbeforeunload=" " onunload="deleteTemporaryData()">


	<%
		// Codice Java per il controllo sull'accesso - lo permette solo se la sessione esiste
		User user = null;
		ArrayList<String[]> users = null;
		
		if(session.getAttribute("User") == null) 
		{
// 			response.sendRedirect("login.html");
			request.getRequestDispatcher("login.html").include(request, response);
		}
		else
		{
			user = (User) session.getAttribute("User");
			if(user.getType() == 4)
				users = (ArrayList<String[]>) session.getAttribute("Users");
		}
		
		String userName = null;
		String sessionID = null;
		Cookie[] cookies = request.getCookies();
		if(cookies !=null)
		{
			for(Cookie cookie : cookies)
			{
				if(cookie.getName().equals("user")) 
					userName = cookie.getValue();
				if(cookie.getName().equals("JSESSIONID")) 
					sessionID = cookie.getValue();
			}
		}
		else{
			sessionID = session.getId();
		}
	%>
	
	
	
	<div id="loading" class="loading"></div>
 
<!--   	<button style="position:absolute;left:5px;top:10px" onclick="debug()">Debug Model</button> -->
<!--  	<button style="position:absolute;left:5px;top:30px" onclick="debugMI()">Debug Instance</button>  -->
 
	<!-- MENU PRINCIPALE --> 
	<div id="nav"></div>

	
	<!-- MENU LATERALE --> 
	<div id="menu-side" style="display:none"></div>
	
	
	<!-- SOTTO MENU --> 
	<div id="sub-menu" style="display:none"></div>
	
	
	<!-- SLIDER AL TOP DELLA PAGINA *** LOGIN/LOGOUT USER -->
	<div id="toppanel"></div> 
	
	
	<!-- SEZIONE PRINCIPALE -->
	<div id="section"></div>
	
	
	<!-- INFO MODEL E INSTANCE MODEL -->
	<div id="model_instancemodel_info" style="display:none" title="Click to move panel"> 
		<div class="info-left">
			<span id="spanNameModel">Name Model</span><label id="nameModelInfo" class="label-info"></label>
			<span id="spanNameInstance">Name Instance</span><label id="nameInstanceInfo" class="label-info"></label>
			<input type="text" class="input-info" id="inputNameInstance" maxlength=30 onclick="selectTextNameInstance()"><label id="labelConfirmInput" class="label-confirm">ENTER to confirm<br>ESC to reset</label>
			<span id="spanDateCreate">Date creation</span><label id="dateCreateInfo" class="label-info"></label>
			<span id="spanDateLastModify">Date last modify</span><label id="dateLastModifyInfo" class="label-info"></label>
			<span id="spanDescription">Description</span><label id="descriptionInfo" class="label-info"></label>

			<!--  <span id="spanUrl">Url</span><label id="urlInfo" class="label-info"></label>  -->
		</div>
		<div class="info-right">
			<span id="spanUser">User owner</span><label id="userInfo" class="label-info"></label>
			<span id="spanModelComplexity">Complexity <button id="buttonInfoIndexComplexity" class="button-index-info" title="What is the Complexity?" onclick="showInfoIndexComplexity()"></button></span><label id="ModelComplexity" class="label-info"></label>
			<span id="spanModelVolumes">Volumes <button id="buttonInfoIndexVolumes" class="button-index-info" title="What is the Volumes?" onclick="showInfoIndexVolumes()"></button></span><label id="ModelVolumes" class="label-info"></label>
			<span id="spanModelCohesion">Cohesion <button id="buttonInfoIndexCohesion" class="button-index-info" title="What is the Cohesion?"  onclick="showInfoIndexCohesion()"></button></span><label id="ModelCohesion" class="label-info"></label>
<!-- 			<span id="spanTimeStartExec">Start execute</span><label id="startExecInfo" class="label-info"></label>
			<span id="spanTimeEndExec">End execute</span><label id="endExecInfo" class="label-info"></label> -->
		</div>
		
		<button id="buttonModifyInfoModel" class="button-modify-info" title="Edit information model"></button>
		<button id="buttonModifyInfoInstance" class="button-modify-info" title="Edit information instance" onclick="clickModifyInfoInstance()"></button>
		<div id="container-link-xml">
			<a id="view-xml" href="#" onclick="viewXML()" class="link-xml" target="_blank">View XML structure</a>
		</div>
	</div>
	
	<!-- DIV PER LA MODIFICA DELLE INFORMAZIONI DEL MODELLO -->
	<div id="div_modify_info_model" style="display:none" title="Modify info model">
		<input type="text" class="input_info_model" id="input_objective_modify_model" placeholder="Insert name model" size="30" onfocus="focusInputObjectiveModifyModel()">
		<input type="text" class="input_info_model" id="input_url_modify_model" placeholder="Insert url" size="30" style="display:none;">
		<textarea class="input_info_model" id="input_description_modify_model" placeholder="Insert description" rows="10" cols="30"></textarea>
	</div>
	
	<!-- DIV PER ALERT -->
	<div id="div_alert" style="display:none">
		<img src="image/warning.png" id="img_warning">
		<label id="text_alert">Testo alert</label>
	</div>
	
	<!-- Ale:ASPECT DIV for the insertion of an Aspect. -->
	<div id="modal_Aspect" style="display:none;" class="IF-window" title="Insert Aspect Info.">
	
		<div id="A_tab_name" class="IF-tab">
			<label>Label</label></br>
			<input type="text" id="inputname" size=40 style="background-color:white" class="input-if"></br>
			<div id="A_tab_allAspects" class="IF-tab">
				<label>Or chose one existent aspect from here:</label></br>
				<select id="A_select"></select>
			</div>
			
			<span id="errmsg_IF" class="error_msg"></span>
		</div>
	
		<div id="A_tab_source" class="IF-tab">
			<label>SOURCE. You can leave empty OR insert here a new value: </label></br>
			<input type="text" id="inputsource" size="50"></br>
			<label> OR select an existent Function from here:</label>
			<select id="F_select"></select>
			<div id="A_G_option" style="display:none;">
				<label> TARGET. Choose a Group Function, from here: </label></br>
				<select id="G_F_select"></select>
			</div>
				
			<span id="errmsg_IF" class="error_msg"></span>
		</div>
		<div id="A_tab_target" class="IF-tab" style="display:none;">
			<div id="A_G_option" style="display:none;">
				<label> SOURCE. Chose a function in the group, from here: </label></br>
				<select id="G_F_select"></select>
			</div>
			
			<label> TARGET. You can leave it empty OR insert here a new value: </label></br>
			<input type="text" id="inputtarget"  size="50"></br>
			<label> OR select an existent Function from here:</label>
			<select id="F_select"></select></br>
			
			<label> Select the FUNCTION's TYPE for the TARGET:</label></br>
			<select id="Ftype_select">
			<option selected>Input</option>
			<option>Precondition</option>
			<option>Resource</option>
			<option>Control</option>
			<option>Time</option>
			</select>
			
			<span id="errmsg_IF" class="error_msg"></span>
		</div>
	</div>
	
	<!-- Ale:ASPECT DIV for the insertion of an Aspect's information. -->
	<div id="modal_AspectAddInfo" style="display:none;" class="IF-window" title="Insert Aspect's Info.">	
		<div id="A_tab_name" class="IF-tab">
			<label>Label:</label></br>
			<input type="text" id="inputname" size=40 style="background-color:white" class="input-if"></br>
			<div id="A_tab_allAspects" class="IF-tab">
				<label>Or chose one existent aspect from here:</label></br>
				<select id="A_select"></select>
			</div>
			<span id="errmsg_IF" class="error_msg"></span>
		</div>
		<div id="A_tab_source" class="IF-tab" style="display:none;">
			<label> SOURCE. Choose a Group Function: </label></br>
			<select id="G_Fsource_select"></select>
		</div>
		<div id="A_tab_target" class="IF-tab" style="display:none;">
			<label> TARGET. Choose a Group Function: </label></br>
			<select id="G_Ftarget_select"></select>
		</div>
	</div>
	
	<!-- Ale: GROUP- DIV for the insertion or modification of a Function -->
	<div id="modal_Group" style="display:none;" class="IF-window" title="Insert Group's Info.">
	
		<div id="G_tab_name" class="IF-tab">
			<label class="l_title">Name</label></br>
			<input type="text" id="inputname" size=40 style="background-color:white" class="input-if" >
			
			<span id="errmsg_IF" class="error_msg"></span>
		</div>

		<div id="G_tab_description" class="IF-tab">
			<label class="l_title">Description</label></br>
			<textarea id="inputdescription" size=100 rows="5" cols="40">
			</textarea>
			
			<span id="errmsg_IF" class="error_msg"></span>
		</div>
		
		<div id="G_color_picker" class="IF-tab">
			<label class="l_title">Color</label></br>
			<input id="inputcolor" type="color" name="GroupColor" >
		</div>
		
		<label class="l_title">Groups - </label><label id="Groups_number" class="l_title"></label>
		<label class="l_title">Functions - </label><label id="Functions_number" class="l_title"></label>
		<input value="Add Functions" type="button" class="F_add_aspect" onclick="createAddGroupFunctionWindow();"> </br>
		<div id="G_functions_list" class="IF-tab">
			<p class="default_function_field" style="display:none;" >  
			<img class="F_option" src="image/delete.png" title="Exit" onclick="removeFunctionFromGroup(event);">  
			<label class="F_name" >Name</label>
			</p>
			
			<div id="Group_F_list" class="F_list"></div>			
		</div>
		
		<div id="G_F_tab_aspects" class="IF_tab">
			
			<p class="default_field" style="display:none;">  
			<img class="F_option" src="image/delete.png" title="Delete Aspect" onclick="GroupRemoveAspect(event);">  
			<img class="F_option" src="image/modify.png" title="Modify Aspect" onclick="modifyGroupAspect(event);"> 
			<label class="F_name" >Name</label>
			</p>
			<label class="l_title"> Aspects number (Without duplication) - </label><label id="Aspects_number" class="l_title"></label>
			<div id="G_F_tab_inputs" class="F_div">
				<hr>
				<label class="l_title">Inputs - </label><label id="Input_number" class="l_title">  </label>
				<input value="New I" type="button" class="F_add_aspect" onclick="createGroupAspectEditWindow('Input');"> </br>
				<div id="G_F_list_Input" class="F_list">
				</div>
			</div>
			<div id="G_F_tab_outputs" class="F_div">
				<hr>
				<label class="l_title">Outputs - </label><label id="Output_number" class="l_title">  </label>
				<input value="New O" type="button" class="F_add_aspect" onclick="createGroupAspectEditWindow('Output');"> </br>
				<div id="G_F_list_Output" class="F_list">
				</div>
			</div>
			<div id="G_F_tab_preconditions" class="F_div">
				<hr>
				<label class="l_title">Preconditions - </label><label id="Precondition_number" class="l_title">  </label>
				<input value="New P" type="button" class="F_add_aspect" onclick="createGroupAspectEditWindow('Precondition');"> </br>
				<div id="G_F_list_Precondition" class="F_list"></div>
				
			</div>
			<div id="G_F_tab_resources" class="F_div">
				<hr>
				<label class="l_title">Resources - </label><label id="Resource_number" class="l_title">  </label>
				<input value="New R" type="button" class="F_add_aspect" onclick="createGroupAspectEditWindow('Resource');"> </br>
				<div id="G_F_list_Resource" class="F_list"></div>
			</div>
			<div id="G_F_tab_controls" class="F_div">
				<hr>
				<label class="l_title">Controls - </label><label id="Control_number" class="l_title">  </label>
				<input value="New C" type="button" class="F_add_aspect" onclick="createGroupAspectEditWindow('Control');"> </br>
				<div id="G_F_list_Control" class="F_list"></div>
			</div>
			<div id="G_F_tab_times" class="F_div">
				<hr>
				<label class="l_title">Times - </label><label id="Time_number" class="l_title">  </label>
				<input value="New T" type="button" class="F_add_aspect" onclick="createGroupAspectEditWindow('Time');"> </br>
				<div id="G_F_list_Time" class="F_list"></div>
			</div>
		</div>
		<span id="errmsg_LF" class="error_msg"></span>
	</div>
	
	<!-- Ale: DELETE GROUP dialog -->
	<div id="modal_Group_Delete" style="display:none;" class="IF-window" title="Delete the group.">
	<label  class="l_title">Do you want to remove also the functions in the group? </label>
	</div>
	<!-- Ale: ADD FUNCTIONS DIV for the insertion of a Function in a Group. -->
	<div id="modal_Group_Add_Functions" style="display:none;" class="IF-window" title="Insert Aspect Info.">
	
		<div id="GF_tab_name" class="IF-tab">
			<label class="l_title">Check the functions to add in the group.</label></br>
			<div id="checkboxes" ></div>
						
			<span id="errmsg_IF" class="error_msg"></span>
		</div></br>
		<input value="New Function" type="button" class="G_add_function" onclick="GroupAddNewFunctionIntoList();">
		<input value="New Group" type="button" class="G_add_function" onclick="GroupAddNewFunctionIntoList('true');">
	</div>
	
	<!-- Ale: FUNCTION- DIV for the insertion or modification of a Group -->
	<div id="modal_Function" style="display:none;" class="IF-window" title="Insert Function's Info.">
	
		<div id="F_tab_name" class="IF-tab">
			<label class="l_title">Name:</label></br>
			<input type="text" id="inputname" size=40 style="background-color:white" class="input-if" >
			
			<span id="errmsg_IF" class="error_msg"></span>
		</div>

		<div id="F_tab_description" class="IF-tab">
			<label class="l_title">Description:</label></br>
			<textarea id="inputdescription" size=100 rows="5" cols="40">
			</textarea>
			
			<span id="errmsg_IF" class="error_msg"></span>
		</div>
		<div id="F_color_picker" class="IF-tab">
			<label class="l_title">Color:</label></br>
			<input id="inputcolor" type="color" name="FunctionColor" >
		</div>
		
		<div id="F_tab_aspects" class="IF_tab">
			
			<p class="default_field" style="display:none;">  
			<img class="F_option" src="image/delete.png" title="Delete Aspect" onclick="removeAspect();">  
			<img class="F_option" src="image/modify.png" title="Modify Aspect" onclick="modifyAspect();"> 
			<label class="F_name" >Name</label>
			</p>
			<label class="l_title"> Total Aspects number - </label><label id="Aspects_number" class="l_title"></label>
			<div id="F_tab_inputs" class="F_div">
				<hr>
				<label class="l_title">Inputs - </label><label id="Input_number" class="l_title">  </label>
				<input value="New I" type="button" class="F_add_aspect" onclick="createAspectEditWindow('Input');"> </br>
				<div id="F_list_Input" class="F_list">
				</div>
			</div>
			<div id="F_tab_outputs" class="F_div">
				<hr>
				<label class="l_title">Outputs - </label><label id="Output_number" class="l_title">  </label>
				<input value="New O" type="button" class="F_add_aspect" onclick="createAspectEditWindow('Output');"> </br>
				<div id="F_list_Output" class="F_list">
				</div>
			</div>
			<div id="F_tab_preconditions" class="F_div">
				<hr>
				<label class="l_title">Preconditions - </label><label id="Precondition_number" class="l_title">  </label>
				<input value="New P" type="button" class="F_add_aspect" onclick="createAspectEditWindow('Precondition');"> </br>
				<div id="F_list_Precondition" class="F_list"></div>
				
			</div>
			<div id="F_tab_resources" class="F_div">
				<hr>
				<label class="l_title">Resources - </label><label id="Resource_number" class="l_title">  </label>
				<input value="New R" type="button" class="F_add_aspect" onclick="createAspectEditWindow('Resource');"> </br>
				<div id="F_list_Resource" class="F_list"></div>
			</div>
			<div id="F_tab_controls" class="F_div">
				<hr>
				<label class="l_title">Controls - </label><label id="Control_number" class="l_title">  </label>
				<input value="New C" type="button" class="F_add_aspect" onclick="createAspectEditWindow('Control');"> </br>
				<div id="F_list_Control" class="F_list"></div>
			</div>
			<div id="F_tab_times" class="F_div">
				<hr>
				<label class="l_title">Times - </label><label id="Time_number" class="l_title">  </label>
				<input value="New T" type="button" class="F_add_aspect" onclick="createAspectEditWindow('Time');"> </br>
				<div id="F_list_Time" class="F_list"></div>
			</div>
		</div>
		<span id="errmsg_LF" class="error_msg"></span>
	</div>
	
	<!-- Ale: FUNCTION- DIV that visualize the info of a group or of a function -->
	<div id="modal_Function_Info" style="display:none;" class="IF-window" title="Function's Info.">
	
		<div id="F_tab_name" class="IF-tab">
			<label class="l_title">Name:</label></br>
			<input type="text" id="inputname" size=40 style="background-color:white" class="input-if" disabled>
			
			<span id="errmsg_IF" class="error_msg"></span>
		</div>

		<div id="F_tab_description" class="IF-tab">
			<label class="l_title">Description:</label></br>
			<textarea id="inputdescription" size=100 rows="5" cols="40" disabled>
			</textarea>
			
			<span id="errmsg_IF" class="error_msg"></span>
		</div>
		<div id="F_color_picker" class="IF-tab">
			<label class="l_title">Color:</label></br>
			<input id="inputcolor" type="color" name="FunctionColor" disabled>
		</div>
		
		<div id="G_functions_list" class="IF-tab" style="display:none;">
			<label class="l_title">Groups - </label><label id="Groups_number" class="l_title"></label>
			<label class="l_title">Functions - </label><label id="Functions_number" class="l_title"></label>
			
			<p class="default_function_field" style="display:none;"> <label class="F_name" >Name</label> </p>
			
			<div id="Group_F_list" class="F_list"></div>			
		</div>
		<div id="F_tab_aspects" class="IF_tab">			
			<p class="default_field" style="display:none;">
			<label class="F_name" >Name</label>
			</p>
			<label class="l_title"> Total Aspects number - </label><label id="Aspects_number" class="l_title"></label>
			<div id="F_tab_inputs" class="F_div"><hr>
				<label class="l_title">Inputs - </label><label id="Input_number" class="l_title">  </label>
				<div id="F_list_Input" class="F_list">
				</div>
			</div>
			<div id="F_tab_outputs" class="F_div"><hr>
				<label class="l_title">Outputs - </label><label id="Output_number" class="l_title">  </label>
				<div id="F_list_Output" class="F_list">
				</div>
			</div>
			<div id="F_tab_preconditions" class="F_div"><hr>
				<label class="l_title">Preconditions - </label><label id="Precondition_number" class="l_title">  </label>
				<div id="F_list_Precondition" class="F_list"></div>
				
			</div>
			<div id="F_tab_resources" class="F_div"><hr>
				<label class="l_title">Resources - </label><label id="Resource_number" class="l_title">  </label>
				<div id="F_list_Resource" class="F_list"></div>
			</div>
			<div id="F_tab_controls" class="F_div">	<hr>
				<label class="l_title">Controls - </label><label id="Control_number" class="l_title">  </label>
				<div id="F_list_Control" class="F_list"></div>
			</div>
			<div id="F_tab_times" class="F_div"><hr>
				<label class="l_title">Times - </label><label id="Time_number" class="l_title">  </label>
				<div id="F_list_Time" class="F_list"></div>
			</div>
		</div>
		<span id="errmsg_LF" class="error_msg"></span>
	</div>

<!-- Ale: INSTANCE DIV for the insertion of specific of the function. -->
	<div id="modal_Instance" style="display:none;" class="IF-window" title="Insert Aspect Info.">
	
		<div id="I_tab_type" class="IF-tab">
			<label>Function Type:</label></br>
			<select id="inputtype">
			<option value="0" selected>Undefined</option>
			<option value="1">Technological</option>
			<option value="2">Human</option>
			<option value="3">Organisational</option>
			</select>
			
			<span id="errmsg_IF" class="error_msg"></span>
		</div>

		<div id="I_tab_TP" class="IF-tab">
			<label>Potential Output variability with regard to Time: </label></br>
			<select id="inputtp">
			<option value="-1" selected>Undefined</option>
			<option value="0">Too early</option>
			<option value="1">On time</option>
			<option value="2">Too late</option>
			<option value="3">Not at all</option>
			</select>
			
			<span id="errmsg_IF" class="error_msg"></span>
		</div>
		
		<div id="I_tab_PP" class="IF-tab">
			<label>Potential Output variability with regard to Precision: </label></br>
			<select id="inputpp">
			<option value="-1" selected>Undefined</option>
			<option value="0">Precise</option>
			<option value="1">Acceptable</option>
			<option value="2">Imprecise</option>
			</select>
			
			<span id="errmsg_IF" class="error_msg"></span>
		</div>
	</div>
	
	<!-- Ale: INSTANCE DIV for the insertion of specific of a group. -->
	<div id="modal_GroupInstance" style="display:none;" class="IF-window" title="Insert Aspect Info.">
		<div id="G_tab_name" class="GFI-tab">
			<label class="l_title">Name: </label></label><label id="G_name">No Name Found</label></br>
		</div>

		<div id="G_tab_description" class="GFI-tab">
			<label class="l_title">Description: </label><label id="G_description" >No Description Found</label></br>
		</div>
				
		<label class="l_title">Groups - </label><label id="Groups_number" class="l_title"></label>
		<label class="l_title">Functions - </label><label id="Functions_number" class="l_title"></label>
		<div id="G_functions_list" class="GFI-tab">
			<p class="default_function_field" style="display:none;" >  
			<img class="F_option" src="image/modify.png" title="Edit the Variability" onclick="editGroupFunctionVariability(event);">  
			<label class="F_name" >Name</label>
			</p>
			
			<div id="Group_F_list" class="F_list"></div>			
		</div>
	</div>
	
	<!-- Ale: EXPORT dialog -->
	<div id="div_insert_export_model" style="display:none;" class="IF-window" title="Export to SmartDS.">
		<p>Here you can export a FRAM to Smart DS and create a decision tree for your functions.</p>
		<p>Once choosed a function's output the tool will create the SmartDS tree for you!! </p></br>
		<label class="l_title">Chose the Function:</label></br>
			<select id="listfunctions"></select></br>
			<div id="functions_output" style="display:none;"></br>
				<label class="l_title">Chose the Output for the Function:</label></br>
				<select id="listoutputs"></select>
			</div>
	</div>
	
	<!--  End of the editing windows-->
	<script type="text/javascript">
	
		var target = document.getElementById('loading');
	    var spinner = new Spinner(opts).spin(target);
	
		//Definizione variabili globali  		
		var clientRest; // oggetto classe Client utilizzato per gestire l'aggiunta e la cancellazione di presenze o l'invio di messaggi
		var configParams; // oggetto classe Client utilizzato per gestire l'aggiunta e la cancellazione di presenze o l'invio di messaggi
		
		var view; // oggetto view per interagire con gli oggetti presenti nella pagina e mandare messaggi a video
		var util; // oggetto utilizzando per le conversioni da stringa a XML e viceversa
		
		var user;
		var users;
		
		var json_data = null;
		
		var modelId;
		var modelInstanceId;
		var specific_object;
		var criteriaInstanceId;
		
		var models_tmp = [];
		var models_db = [];
		var models_cloned = [];
		var models_notsaved = [];
		var modelinstances_tmp = [];
		var modelinstances_db = [];
		var modelinstances_notsaved = [];
		var modelinstances_to_import_data = [];
		
		var options_modelinstances = null;
		
		var messageError = null;
		
		var zoom_initial;
		
		var xml_model = null;
		var xml_instance = null;
		
		var xml_data = null;
		
		var id_currentpage = 0;
		var type_rotate = "vertical";
		
		var timer_tooltip_visible = null;
		
		var intervalReloadInstance = null;
		
		var repository = "";
		
		var id_page_section;
		var green_IFinsert = 0.0, white_IFinsert = 0.0, red_IFinsert = 0.0;
		
		var position_button = null;
		
		var undo; // Ale- undo object for turn back from a operation.
		
		$(document).ready(function() 
		{	
			$( "#model_instancemodel_info" ).draggable({ scroll: false });
			
			// Inizializzazione delle funzioni per le richieste REST verso il server
			init();

			openLink("menu.html", 'nav');
			openLink("menuside.html",'menu-side');
			openLink("submenu.html", 'sub-menu');
			openLink("slider.html", 'toppanel');
			
			var $dialog = $('#div_modify_info_model').dialog({
				autoOpen:false,
				resizable: false,
		        height: 400,
		        width: 400,
		        modal: true
			});

		    $('#buttonModifyInfoModel').click(function() {
		    	createModifyInfoModelWindow($dialog);
		    });
		    
<%-- 		    CONTEXT_ROOT = "<%= request.getContextPath() %>"; --%>
		});
		
		function init()
		{
			view  = new View(this, document);
			undo = new UnDo(50);
			util = new Util();
			var http_req_model = new HTTPRequestModel(); 
			var http_req_criteria = new HTTPRequestCriteria();
			var http_req_model_instance = new HTTPRequestModelInstance();
			var http_req_criteria_instance = new HTTPRequestCriteriaInstance();
			var http_req_operation_model = new HTTPRequestOperationModel();
			var http_req_operation_model_instance = new HTTPRequestOperationModelInstance();
			var http_req_user = new HTTPRequestUser();
			
			clientRest = new Client(http_req_model, http_req_criteria, http_req_model_instance, http_req_criteria_instance, http_req_operation_model, http_req_operation_model_instance, http_req_user);
			configParams = new configVariables();
			
			setUserJS();		
		}
		
		function openLink(url, target)
		{
			$("#"+target).load(url);
		}
		
		function setUserJS()
		{
			user = new User();
			user.setUser(<%=user.getId()%>, "<%=user.getName() %>", "<%=user.getEmail() %>", "<%=user.getCountry() %>", <%=user.getType()%>);
			
			<%  int n_permits = user.getPermitsModel().length; 
				for(int i = 0; i < n_permits; i++)
				{%> 
					user.setPermitModel("<%=user.getPermitModel(i).getDescription()%>","<%=user.getPermitModel(i).getValue()%>", <%=i%>);
				<%}
			%>  
			
			if(user.getName() === "Guest")
			{
				messageError = "<%= request.getAttribute("messageError")%>";	
			}
			
			if(user.getType() === 4)
			{
				users = new Array();
				
				<%if(user.getType() == 4)
				{
					int n_users = users.size(); 
					for(int i = 0; i < n_users; i++)
					{%> 
						var user_tmp = new User();
						user_tmp.setUser(<%=users.get(i)[0]%>, "<%=users.get(i)[1]%>", "<%=users.get(i)[2]%>", "<%=users.get(i)[3]%>", <%=users.get(i)[4]%>);
						users.push(user_tmp);
					<%}
				}%>
			}
		}
		
		/*
		 * Funzione che cattura l'evento onbeforeunload (chiusura pagina) di Javascript 
		 * e se avverte l'utente di salvare i modelli modificati dopo il caricamento
		 */
		function checkUnload(){ //TODO CHange this message
			if(models_notsaved.length != 0 || modelinstances_notsaved.length != 0)
				return 'Ci sono dei modelli e/o istanze non salvate desideri comunque abbandonare la pagina? Le modifiche non salvate andranno perse.';
		}

		function deleteTemporaryData()
		{		
			if(models_notsaved.length != 0)
				clientRest.deleteModelsTmpOnServer();
			if(modelinstances_notsaved.length != 0)
				clientRest.deleteModelInstancesTmpOnServer();
		}

		function unloadRequests(){
			this.deleteTemporaryData();
		}

		function debug(){
			clientRest.printModel();
		}
		
		function debugMI(){
			clientRest.printModelInstance();
		}
		
		function viewXML()
		{
			if($("#model_body").length > 0)
				$('#view-xml').attr('href','rest/models/'+modelId);
			if($("#instance_body").length > 0)
				$('#view-xml').attr('href','rest/modelinstances/'+modelInstanceId);
			
// 			if(xml_data != null)
// 				$('#view-xml').attr('href','data:text/xml,' + util.xmlToString(xml_data).replace(/"/gi, "'"));
		}

		function xmlModel(xml)
		{
			xml_data = xml;
		}
		
		function xmlInstance(xml)
		{
			xml_data = xml;
		}
		
		function focusInputObjectiveModifyModel()
		{
			$('#input_objective_modify_model').css('box-shadow', 'inset 0 1px 3px rgba(0,0,0,1.0)');
		}
		
		function selectTextNameInstance()
		{
			var focusedElement = $('#inputNameInstance');
	        setTimeout(function () { focusedElement.select(); }, 50);
		}
		
		function loadingFinished()
		{	
			$(".loading").fadeOut("slow");
		}
		
		/**
		*	Function that calls the undo!
		*/
		function FRAMback(){
			submenuViewBack();
			undo.undo();
		}
		
		/**
		*	Function that calls the forward!
		*/
		function FRAMforward(){
			submenuViewForward();
			undo.forward();
		}
		
		/**Ale
		* Updates the Complexity: Number of function in group, for the model the average number of function for group...or maybe is better the max number.
		* Volume: The total number of functions
		* Cohesion: The number of links over the functions
		*/
		function updateFRAMModelMeasure(){
			var complexity, volumes, cohesion;
			complexity = modelComplexity();
			volumes = modelVolumes();
			cohesion = modelCohesion();
			$("#model_instancemodel_info #ModelComplexity").text(complexity);
			$("#model_instancemodel_info #ModelVolumes").text(volumes);
			$("#model_instancemodel_info #ModelCohesion").text(cohesion.cohesion);
		}
		
		function showInfoIndexComplexity(){
			toastrSettings("indexInfo");
			toastr.info("The Complexity of the FRAM Model is the number of Groups present.<br /><br />", "Cohesion");
			toastrSettings("default");
		}
		
		function showInfoIndexVolumes(){
			toastrSettings("indexInfo");
			toastr.info("The Volumes of the FRAM Model is the number of Functions present.<br /><br />", "Volumes");
			toastrSettings("default");
		}
		
		function showInfoIndexCohesion(){
			toastrSettings("indexInfo");
			toastr.info("The Cohesion of the FRAM Model is the number of Aspects over the number of Functions.<br /><br />", "Functions");
			toastrSettings("default");
		}
	</script>	

</body>

</html>