// Function to handle strikethrough
function check(id){
	console.log("3",id);
	var item = document.getElementById(id);
	if(item.style.textDecoration!=="line-through"){
		item.style.textDecoration="line-through";
		item.style.backgroundColor="#ff6666";
	}
	else{
		item.style.textDecoration="none";
		var idNo = id.replace("item","");
		if(idNo%2==0)//even numbered rows, setting darker colour
			item.style.backgroundColor="#ff9999";
		else//setting darker colour
			item.style.backgroundColor="#ffcccc";
	}
	
}

//Make GET call to DB to fecth item list
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

var response = httpGet("http://localhost:3000/todo/v1/getItems"); //returns string of array of json
console.log(response);
var dataObjArray = JSON.parse(response); //array of json objects

//Populate UL with retrieved list
console.log("Hi2");

function setId(id){
	return function(){check(id)};
}

function populateList(){
	console.log(dataObjArray);
	for(var dataObj=0; dataObj<dataObjArray.length; dataObj++){
		li = document.createElement("li");
		var txt = document.createTextNode(dataObjArray[dataObj].item_name);
		li.appendChild(txt);
		li.id = "item"+(dataObj+1); 
		console.log("1",li.id);
		li.onclick=setId(li.id);	//Closure!	
		document.getElementById("itemList").appendChild(li);	

		if(dataObjArray[dataObj].item_status == "Checked"){
			check(li.id);
		}
		else if(dataObjArray[dataObj].item_status == "Deleted"){
			li.style.display = "none";
		}
	}
}

populateList();

console.log("hi3");


//----------------------

var myNodelist = document.getElementsByTagName("li");
var i;

//spawning close
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("X");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
/*  myNodelist[i].onclick=function(){ //Why can't i set this dynamically?
	check(myNodelist[i].id)};  */
}   
//Coding close
var close = document.getElementsByClassName("close");
for(i=0;i<close.length;i++){
	close[i].onclick=function(){
		var div = this.parentElement.style.display = "none"; //Why this? why does close[i].parentElement not work
	}
}

function newElement(){
	var myNodelist = document.getElementsByTagName("li");
	var item = document.getElementById("item").value;
	if(item ==="");
	else{
		var li = document.createElement("li");
		var txt = document.createTextNode(item);
		li.appendChild(txt);
		li.id = "item"+(myNodelist.length+1); //how often does myNodelist update it value?
		li.onclick=function(){check(li.id)};
		document.getElementById("itemList").appendChild(li);
		document.getElementById("item").value="";
		
		//spwaning close 
		for (i = 0; i < myNodelist.length; i++) {
			var span = document.createElement("SPAN");
			var txt = document.createTextNode("X");
			span.className = "close";
			span.appendChild(txt);
			myNodelist[i].appendChild(span);
		}	
	
		//Coding close
		var close = document.getElementsByClassName("close");
		for(i=0;i<close.length;i++){
			close[i].onclick=function(){
				var div = this.parentElement.style.display = "none"; //Why this? why does close[i].parentElement not work
			}
		}
	}

}

//Save to DB
function save(){	
	//Creating Post call to flush out all DB records (bad method, i know)
	var http = new XMLHttpRequest();
	var url = "http://localhost:3000/todo/v1/deleteItems";
	http.open("POST", url, true);

	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			console.log(http.responseText);
		}
	}
	http.send( null );


	var myNodelist = document.getElementsByTagName("li");
	for (i = 0; i < myNodelist.length; i++) {
		console.log(myNodelist[i].innerHTML);
		var str = myNodelist[i].innerHTML;
		//removing span 
		var index = str.indexOf("<span class");
		str = str.substring(0,index);
		console.log(str);
		var status = "New";
		if(myNodelist[i].style.textDecoration==="line-through"){
			status = "Checked";
		}
		if(myNodelist[i].style.display === "none"){ //Not else if because, the deleted ones also have linethrough
			status = "Deleted";
		}
		console.log(status);

		//Creating a post call to insert List elements into the DB
		http = new XMLHttpRequest();
		url = "http://localhost:3000/todo/v1/saveItem";
		var params = "name="+str+"&status="+status;
		http.open("POST", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http.onreadystatechange = function() {//Call a function when the state changes.
			if(http.readyState == 4 && http.status == 200) {
				console.log(http.responseText);
			}
		}
		http.send( params );
	}

}
