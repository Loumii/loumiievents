var w = Ti.UI.currentWindow;
var navGroup = w.getNavGroup();
var Application = require('ui/common/Application');

var image = Ti.UI.createImageView({
		image: "http://loumii.com/assets/loumii2.png",
		preventDefaultImage: true,
		height: 200
});

var loginView = Ti.UI.createScrollView({
	left:0,right:0,
	top:0,bottom:0,
	contentHeight:"auto",
	contentWidth:'auto',
	showVerticalScrollIndicator:true,
	layout: 'vertical',
	height: Ti.UI.size,
	width: Ti.UI.size
});

var login = Application.createNavButton("Log In");

var back = Application.createBackButtonExt();

w.leftNavButton = back;
w.rightNavButton = login;

var rows = [];

var emailRow = Ti.UI.createTableViewRow({
	layout: "horizontal",
	height: 45,
	backgroundColor: "#fbfbfa",
	selectedBackgroundColor: "fbfbfa"
});

var emailLabel = Ti.UI.createTextField({
	color: "#666",
	hintText: "Your Email Address",
	font:{
		fontWeight: "bold",
		fontSize: 18,
		fontFamily: "Helvetica Neue"
	},
	width: 280,
	top: 11,
	left: 10
});

emailRow.add(emailLabel);

rows.push(emailRow);

var passwordRow = Ti.UI.createTableViewRow({
	layout: "horizontal",
	height: 45,
	backgroundColor: "#fbfbfa",
	selectedBackgroundColor: "fbfbfa"
});

var passwordLabel = Ti.UI.createTextField({
	color: "#666",
	text: "Type",
	font:{
		fontWeight: "bold",
		fontSize: 18,
		fontFamily: "Helvetica Neue"
	},
	width: 280,
	top: 11,
	left: 10,
	passwordMask: true,
	hintText: "Your password"
});

passwordRow.add(passwordLabel);

rows.push(passwordRow);

var table = Ti.UI.createTableView({
	data: rows,
	width: 280,
	footerTitle: '',
	scrollable: false,
	borderWidth: 1,
	borderColor: "#999999",
	separatorColor: "#999999",
	height: 90,
	top: 30
});

loginView.add(table);

w.add(loginView);

login.addEventListener("click", function(){
	
	var valid = Application.validate({
		inputs:[
			{
				object: passwordLabel,
				val: passwordLabel.value,
				presence: true
			},
			{
				object: emailLabel,
				val: emailLabel.value,
				presence: true,
				email: true
			}
			]
	});
	
	if(valid){		
		Ti.App.fireEvent("createUser", 
		{user: {email: emailLabel.value, password: passwordLabel.value}, provider: "", url: "http://loumii.com/sign_in.json"}
		);
	}
	
});