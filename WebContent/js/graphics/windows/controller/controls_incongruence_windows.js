/**
 * 
 */

function focusIFUser()
{
	$("#IFCalculated_div").css("opacity", 0.5);
	$("#IFCalculated_div").css("filter", "alpha(opacity=50)");
	
	$("#IFUser_div").css("opacity", 1.0);
	$("#IFUser_div").css("filter", "alpha(opacity=100)");
}

function confirmIFUser()
{
	$("#IFCalculated_div").css("opacity", 0.2);
	$("#IFCalculated_div").css("filter", "alpha(opacity=20)");
	
	$("body").off("mouseover",'#IFUser_div');			
	$("body").off("mouseover",'#IFCalculated_div');
	
	
	$("#IFUser_div").css("opacity", 1.0);
	$("#IFUser_div").css("filter", "alpha(opacity=100)");
	
}

function focusIFCalculated()
{
	$("#IFUser_div").css("opacity", 0.5);
	$("#IFUser_div").css("filter", "alpha(opacity=50)");
	
	$("#IFCalculated_div").css("opacity", 1.0);
	$("#IFCalculated_div").css("filter", "alpha(opacity=100)");
}

function confirmIFCalculated()
{
	$("#IFUser_div").css("opacity", 0.2);
	$("#IFUser_div").css("filter", "alpha(opacity=20)");
	
	$("body").off("mouseover",'#IFUser_div');			
	$("body").off("mouseover",'#IFCalculated_div');
	
	$("#IFCalculated_div").css("opacity", 1.0);
	$("#IFCalculated_div").css("filter", "alpha(opacity=100)");
	
}