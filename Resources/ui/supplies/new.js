var w = Ti.UI.currentWindow;

var Application = require('ui/common/Application');

var editButton;
var back = Application.createNavButton("Save");

var resetEdit = function(){
	
	editButton = Application.createNavButton("Edit");
	
	editButton.addEventListener("click", function(e){
	
		if(editing){
			suppliesTable.editing = false;
			e.source.title = "Edit";
			editing = false;
		}
		else{
			e.source.title = "Cancel";
			editing = true;
			suppliesTable.editing = true;
		}
	
	});
	
}

resetEdit();

back.addEventListener("click", function(){
	w.close();
});

w.leftNavButton = back;

var suppliesView = Ti.UI.createView(),
	editing = false;

var supplyInput = Ti.UI.createTextField({
	color: "#666",
	hintText: "Supply",
	font:{
		fontWeight: "bold",
		fontSize: 18,
		fontFamily: "Helvetica Neue"
	},
	backgroundColor: "white",
	borderColor: "#999999",
	width: 215,
	left: 10,
	height: 45,
	top: 10,
	paddingLeft: 5,
	paddingRight: 5
});

var addButton = Ti.UI.createLabel({
	height: 45,
	width: 85,
	left: 225,
	top: 10,
	text: "Add",
	backgroundColor: "#cb3d29",
	backgroundGradient:{type:'linear',
	colors:['#d25340','#cb3d29'],
	startPoint:{x:0,y:0},
	endPoint:{x:0,y:30},
	backFillStart:false},
	color: "white",
	font:{
		fontSize: 18,
		fontWeight: "bold",
		fontFamily: "Helvetica Neue",
	},
	textAlign: "center",
	shadowColor: "#b53527",
	borderColor: "#e05b48"
});

w.addEventListener("focus", function(){
	
	if(Ti.App.properties.getString("supplies") != null){
	
		var suppliesInfo = eval('('+Ti.App.properties.getString("supplies")+')');
	
		if(suppliesInfo.length > 0){
			w.rightNavButton = editButton;
		}
	
		for(i=0;i<suppliesInfo.length;i++){
			
			var row = Ti.UI.createTableViewRow({
				rowTitle: suppliesInfo[i],
				selectedBackgroundColor: "white",
				selectedColor: "black"
			});
			
			var label = Ti.UI.createLabel({
				text: suppliesInfo[i],
				minimumFontSize: "11dp",
				textAlign: "left",
				font:{
					fontSize: "20dp",
					fontWeight: "bold"
				},
				width: 300,
				left: 10
			});
	
			row.add(label);
			
			suppliesTable.appendRow(row);
		}
	
	}
		
});

var suppliesTable = Ti.UI.createTableView({
	height: 415,
	top: 65,
	borderColor: "#999999",
	editable: true,
	data: [],
	rowHeight: 40
});

suppliesView.add(supplyInput);
suppliesView.add(addButton);
suppliesView.add(suppliesTable);

w.add(suppliesView);

addButton.addEventListener("click", function(){
	supplyAdd();
});

suppliesTable.addEventListener("delete", function(e){
		
	if(suppliesTable.data.length == 0){
		w.rightNavButton = null;
		resetEdit();
		suppliesTable.editing = false;
		editing = false;
	}
	
});

var supplyAdd = function(){
	
		if(supplyInput.value != null){
		
			var row = Ti.UI.createTableViewRow({
				rowTitle: supplyInput.value,
				selectedBackgroundColor: "white",
				selectedColor: "black"
			});
	
			var label = Ti.UI.createLabel({
				text: supplyInput.value,
				minimumFontSize: "11dp",
				textAlign: "left",
				font:{
					fontSize: "20dp",
					fontWeight: "bold"
				},
				width: 300,
				left: 10
			});
	
			row.add(label);
		
			suppliesTable.appendRow(row);
			supplyInput.value = null;
			
			if(!w.rightNavButton){
				w.rightNavButton = editButton;
			}
			
		}
	
}

w.addEventListener("blur", function(){
	
	if(suppliesTable.data[0] != null){
	
		var length = suppliesTable.data[0].rows.length,
			supplies = new Array();
	
		for(i=0;i<length;i++){
			supplies.push(suppliesTable.data[0].rows[i].rowTitle);
		}
	
		Ti.API.log(supplies);
	
		Ti.App.properties.setString("supplies", JSON.stringify(supplies));
	
	}
		
});
