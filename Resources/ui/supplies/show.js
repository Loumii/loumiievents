var w = Ti.UI.currentWindow;
var Application = require('/ui/common/Application');

var back = Application.createBackButton();
w.leftNavButton = back;

var suppliesTable = Ti.UI.createTableView({
	rowHeight: 40
});

for(i=0;i< w.data.length;i++){
	
	var row = Ti.UI.createTableViewRow({
		selectedBackgroundColor: "white",
		selectedColor: "black"
	});
	
	var label = Ti.UI.createLabel({
		text: w.data[i].name,
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
	
w.add(suppliesTable);
w.add(Application.createPadding());
