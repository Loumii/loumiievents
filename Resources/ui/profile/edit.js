var Application = require('ui/common/Application');

var w = Ti.UI.currentWindow;

var update = Application.createNavButton("Update");
var back = Application.createBackButton();

var editView = Ti.UI.createScrollView({
	left:0,right:0,
	top:0,bottom:0,
	contentHeight:"auto",
	contentWidth:'auto',
	showVerticalScrollIndicator:true,
	layout: 'vertical',
	height: Ti.UI.size,
	width: Ti.UI.size
});

w.leftNavButton = back;
w.rightNavButton = update;

var photoHolder = Ti.UI.createView({
    borderWidth: 5,
	borderColor: "white",
	width: 109,
	height: 109,
	top: 50,
	backgroundColor: "white"
});

var photo = Ti.UI.createImageView({
	image: w.data.image,
	defaultImage: "/images/default.jpg",
	width: 109,
	height: 109,
	id: w.data.id,
	type: "User",
	hires: true
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
	value: w.data.name,
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
	value: w.data.email,
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
	hintText: "New password"
});

passwordRow.add(passwordLabel);

var bioRow = Ti.UI.createTableViewRow({
	height: 165,
	layout: "vertical",
	backgroundColor: "#fbfbfa",
	selectedBackgroundColor: "fbfbfa"
});

var bioLabel = Ti.UI.createTextArea({
	color: "#999",
	normalColor: "#666",
	placeholderColor: "#999",
	font:{
		fontWeight: "bold",
		fontSize: 16,
		fontFamily: "Helvetica Neue"
	},
	backgroundColor: "#f2f2f2",
	borderRadius: 5,
	width: 260,
	height: 120,
	borderColor: "#999999",
	top: 11,
	left: 10,
	initialValue: "Provide a description of yourself and the events you like in 140 characters or less.",
	value: w.data.bio || "Provide a description of yourself and the events you like in 140 characters or less."
});

bioRow.add(bioLabel);
bioRow.add(Application.characterLimiter(140, bioLabel, {top: 5, right: 10}));

rows.push(passwordRow);
rows.push(bioRow);

var table = Ti.UI.createTableView({
	data: rows,
	width: 280,
	footerTitle: '',
	scrollable: false,
	borderWidth: 1,
	borderColor: "#999999",
	separatorColor: "#999999",
	height: 300,
	top: 30
});

var dialog = Application.createDialog();

var buttonsView = Ti.UI.createView({
	top: 0,
	left: 20,
	height: 50,
	width: 280
});

var socialLabel = Ti.UI.createLabel({
	text: "Sharing options",
	color: "#666",
	font:{
		fontWeight: "bold",
		fontSize: 16,
		fontFamily: "Helvetica Neue"
	},
	left: 0,
	top: 10
})

var socialSwitch = Ti.UI.createSwitch({
	value: w.data.social,
	left: 150,
	top: 10,
});

var notificationsLabel = Ti.UI.createLabel({
	text: "Push notifications",
	color: "#666",
	font:{
		fontWeight: "bold",
		fontSize: 16,
		fontFamily: "Helvetica Neue"
	},
	top: 50,
	left: 0
})

var notificationsSwitch = Ti.UI.createSwitch({
	value: w.data.notify,
	top: 50,
	left: 150
});

buttonsView.add(socialLabel);
buttonsView.add(socialSwitch);
//buttonsView.add(notificationsLabel);
//buttonsView.add(notificationsSwitch);


editView.add(photoHolder);
editView.add(shadow);
editView.add(table);
editView.add(buttonsView);

editView.add(Application.createPadding());

w.add(editView);

photo.addEventListener("click", function(e){
	w.currentPhoto = e.source;
	dialog.show();
});

var disableUpdate = function(){
	update.opacity = 0.5;
	update.removeEventListener("click", updateUser);
}

var enableUpdate = function(){
	update.opacity = 1;
	update.addEventListener("click", updateUser);
}

var resetImage = function(){
	enableUpdate();
}

dialog.addEventListener("click", function(e){
	Application.uploadImage(w.currentPhoto, e, disableUpdate, enableUpdate, resetImage);
});

var updateUser = function(){
	
	var bioText = "";
	
	if(bioLabel.value != bioLabel.initialValue){
		bioText = bioLabel.value;
	}
	
	social_connection = JSON.parse(Ti.App.properties.getString("user_details")).social_connection;
	
	var validateInputs = [
		{
			object: nameLabel,
			val: nameLabel.value,
			presence: true
		}
	]
	
	if(!social_connection){
			
		validateInputs.push({
				object: emailLabel,
				val: emailLabel.value,
				presence: true,
				email: true
		});
		
	}
	
	var valid = Application.validate({
		inputs: validateInputs
	});
	
	if(valid){
	
	var url = "http://loumii.com/users/" + w.data.id + ".json";
	var xhr = Ti.Network.createHTTPClient({
    	onload: function(e) {
    		
    		var user = eval('('+this.responseText+')');
    		
    		if(!user.taken_email){
    			var user_details = JSON.parse(Ti.App.properties.getString("user_details"));
    		
    			user_details.name = nameLabel.value;
    			user_details.bio = bioText;
    			user_details.email = emailLabel.value;
    			user_details.notify = notificationsSwitch.value;
    			user_details.social = socialSwitch.value;
    			user_details.image = user.image;
    		
    			if(w.data.image != user.image){
    		
    				for(i=0;i<user_details.events.length;i++){
    					user_details.events[i].user_image = user.image;
    					Ti.App.fireEvent("refresh_profile", {refresh_type: "Events", events: user_details.events});
    				}
    			
    			}
    		
    			Ti.App.properties.setString("user_details", JSON.stringify(user_details));
    		
    			Ti.App.Properties.setBool("social", socialSwitch.value);
    		
    			w.fireEvent("refresh", {user: user_details});
    		
				w.close();
			}
			else{
				alert("Sorry that email address has already been taken, please try another.");
			}
    	},
    	onerror: function() {
        	alert('Cannot connect to server');
    	},
    	timeout:30000
	});
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.open("POST", url);
	xhr.send({
		name: nameLabel.value,
		email: emailLabel.value,
		bio: bioText,
		password: passwordLabel.value,
		notify: notificationsSwitch.value,
		social: socialSwitch.value,
		_method: "PUT"
	});
	
	}
	
}

update.addEventListener("click", updateUser);