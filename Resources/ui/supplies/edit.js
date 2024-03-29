var edit_supplies = {
	
	config:{
		w: Ti.UI.currentWindow,
		Application: require('ui/common/Application'),
		editButton: null,
		editing: false,
		suppliesTable: null,
		editButton: null
	},
	
	init: function(){
		
		var back = edit_supplies.config.Application.createBackButton();
				
		back.removeEventListener("click", edit_supplies.config.Application.closeWindow);
		
		back.addEventListener("click", function(){
			edit_supplies.config.w.close();
		});
	
		edit_supplies.config.w.leftNavButton = back;	
		
		edit_supplies.createSuppliesView();
		
		edit_supplies.resetEdit();
		
		edit_supplies.config.w.addEventListener("focus", edit_supplies.setupSupplies);
		edit_supplies.config.w.addEventListener("blur", edit_supplies.saveSupplies);
		
	},
	
	setupSupplies: function(){
		
		if(Ti.App.properties.getString("supplies") != null){
	
			var suppliesInfo = eval('('+Ti.App.properties.getString("supplies")+')');
		
			if(suppliesInfo.length > 0){
				edit_supplies.config.w.rightNavButton = edit_supplies.config.editButton;
				
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
					
					edit_supplies.config.suppliesTable.appendRow(row);
										
				}
			
			}
	
		}
	
	},
	
	saveSupplies: function(){
		
		if(edit_supplies.config.suppliesTable.data[0] != null){
	
			var length = edit_supplies.config.suppliesTable.data[0].rows.length,
				supplies = new Array();
	
			for(i=0;i<length;i++){
				supplies.push(edit_supplies.config.suppliesTable.data[0].rows[i].rowTitle);
			}
	
			Ti.App.properties.setString("supplies", JSON.stringify(supplies));
	
		}
		else{
			Ti.App.properties.setString("supplies", null);
		}
			
	},
	
	createSuppliesView: function(){
		
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

		edit_supplies.config.w.add(suppliesView);
		
		edit_supplies.config.suppliesTable = suppliesTable;
		
		addButton.addEventListener("click", function(){
			edit_supplies.addSupply(supplyInput);
		});
		
		suppliesTable.addEventListener("delete", edit_supplies.deleteSupply);
		
	},
	
	addSupply: function(supplyInput){
		
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
		
			edit_supplies.config.suppliesTable.appendRow(row);
			supplyInput.value = null;
			
			if(!edit_supplies.config.w.rightNavButton){
				edit_supplies.config.w.rightNavButton = edit_supplies.config.editButton;
			}
			
		}	
		
	},
	
	resetEdit: function(){
	
		edit_supplies.config.editButton = edit_supplies.config.Application.createNavButton("Edit");
	
		edit_supplies.config.editButton.addEventListener("click", edit_supplies.toggleEdit);
	
	},
	
	toggleEdit: function(e){
	
		if(edit_supplies.config.editing){
			edit_supplies.config.suppliesTable.editing = false;
			e.source.title = "Edit";
			edit_supplies.config.editing = false;
		}
		else{
			e.source.title = "Cancel";
			edit_supplies.config.editing = true;
			edit_supplies.config.suppliesTable.editing = true;
		}
		
	},
	
	deleteSupply: function(e){
		
		if(edit_supplies.config.suppliesTable.data.length == 0){
			edit_supplies.config.w.rightNavButton = null;
			edit_supplies.resetEdit();
			edit_supplies.config.suppliesTable.editing = false;
			edit_supplies.config.editing = false;
		}
	
	}

}

edit_supplies.init();
