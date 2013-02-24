var w = Ti.UI.currentWindow;
var navGroup = w.getNavGroup();
var Application = require('ui/common/Application');

var image = Ti.UI.createImageView({
		image: "http://loumii.com/assets/loumii2.png",
		preventDefaultImage: true,
		height: 200
});

var signupView = Ti.UI.createScrollView({
	left:0,right:0,
	top:0,bottom:0,
	contentHeight:"auto",
	contentWidth:'auto',
	showVerticalScrollIndicator:true,
	layout: 'vertical',
	height: Ti.UI.size,
	width: Ti.UI.size
});

var signup = Application.createNavButton("Sign Up");
var back = Application.createBackButtonExt();

w.leftNavButton = back;
w.rightNavButton = signup;

var photoHolder = Ti.UI.createView({
    borderWidth: 5,
	borderColor: "white",
	width: 109,
	height: 109,
	top: 50
});

var photo = Ti.UI.createImageView({
	image: "/images/new-photo.jpg",
	width: 108,
	height: 108,
	id: null,
	type: "User",
	initialImage: "/images/new-photo.jpg"
});

var shadow = Ti.UI.createImageView({
	image: "/images/shadow2.png",
	height: 6,
	width: 109
});

photoHolder.add(photo);

var rows = [];

var nameRow = Ti.UI.createTableViewRow({
	layout: "horizontal",
	height: 45,
	backgroundColor: "#fbfbfa",
	selectedBackgroundColor: "fbfbfa"
});

var nameLabel = Ti.UI.createTextField({
	color: "#666",
	hintText: "Your Full Name",
	font:{
		fontWeight: "bold",
		fontSize: 18,
		fontFamily: "Helvetica Neue"
	},
	width: 280,
	top: 11,
	left: 10
});

nameRow.add(nameLabel);

rows.push(nameRow);

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
	hintText: "Your Password"
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
	height: 135,
	top: 30
});

var dialog = Application.createDialog();

signupView.add(photoHolder);
signupView.add(shadow);

signupView.add(table);

w.add(signupView);

createNewUser = function(){
		
	var valid = Application.validate({
			inputs:[
				{
					object: nameLabel,
					val: nameLabel.value,
					presence: true
				},
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
	
		if(photo.id){
			var url = "http://loumii.com/users/" + photo.id + ".json",
			method = "put"
		}
		else{
			var url = "http://loumii.com/create_user.json", 
			method = "post"
		}
			
		Ti.App.fireEvent("createUser", 
		{user: {password: passwordLabel.value, name: nameLabel.value, email: emailLabel.value, method: method}, provider: "", url: url}
		)
	}
	
}

signup.addEventListener("click", createNewUser);

photo.addEventListener("click", function(e){
	w.currentPhoto = e.source;
	dialog.show();
});

var disableSignup = function(){
	signup.opacity = 0.5;
	signup.removeEventListener('click', createNewUser);
}

var enableSignup = function(){
	signup.opacity = 1;
	signup.addEventListener('click', createNewUser);
}

var resetImage = function(){
	enableSignup();
}

dialog.addEventListener("click", function(e){
	Application.uploadImage(w.currentPhoto, e, disableSignup, enableSignup, resetImage);
});