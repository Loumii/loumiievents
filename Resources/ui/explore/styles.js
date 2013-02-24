var w = Ti.UI.currentWindow;
var Application = require('ui/common/Application');

var back = Application.createBackButton();
w.leftNavButton = back;

var stylesSearch = Titanium.UI.createView({
	layout: 'vertical',
	height: "100%",
	width: "100%"
});

var styles = Application.getPlainStyles();

var tableData= [
	Ti.UI.createTableViewRow({
		title: "All", 
		selectedBackgroundColor: "#f2f2f2", 
		rightImage: "/images/right-arrow.png",
		selectedColor: "#000"
	})
];

for(i = 0;i < styles.length;i++){
	var row = Ti.UI.createTableViewRow({
		title: styles[i],
		selectedBackgroundColor: "#f2f2f2",
		selectedColor: "#000",
		rightImage: "/images/right-arrow.png"
	});
	
	tableData.push(row);
	
	row = null;
}

styles = null;

var spacer = Ti.UI.createView({
	height: 50
});

var stylesTable = Ti.UI.createTableView({
	data: tableData,
	width: "auto",
	height: "auto",
	footerView: spacer
});

stylesSearch.add(stylesTable);

w.add(stylesSearch);

stylesTable.addEventListener("click", function(e){
	
	var explore = Titanium.UI.createWindow({
		title: e.row.title,
  		url:'../explore/show.js',
  		barImage: "/images/barImage.png",
  		backButtonTitle: ''
	});
	
	explore.setTitleControl(Application.createTitle(e.row.title));
	
	Ti.UI.currentTab.open(explore, {animated: true});
	
	explore.type = w.type;
	explore.style = e.row.title;
		
});

