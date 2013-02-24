var w = Ti.UI.currentWindow;

var Application = require('ui/common/Application');

var back = Application.createBackButton();
w.leftNavButton = back;

Ti.App.properties.setString("supplies", null);

var labelRows =  ["","","","","","",""];

Ti.App.properties.setString("components", JSON.stringify(labelRows));

var linkRows =  ["","","","","","",""];

Ti.App.properties.setString("links", JSON.stringify(linkRows));

var howImages =  ["","","","","","",""];

Ti.App.properties.setString("howImages", JSON.stringify(howImages));

var howFileNames =  ["","","","","","",""];

Ti.App.properties.setString("howFileNames", JSON.stringify(howFileNames));

var addComponent = Ti.UI.createScrollView({
	layout: "vertical",
    left:0,right:0,
	top:0,bottom:0,
	contentHeight:"auto",
	contentWidth:'auto',
	showVerticalScrollIndicator:true
});

var photoHolder = Ti.UI.createView({
    borderWidth: 5,
	borderColor: "white",
	width: 109,
	height: 109,
	top: 25
});

var photo = Ti.UI.createImageView({
	image: "/images/new-photo.jpg",
	width: 109,
	height: 109,
	newImage: true,
	id: null,
	type: "Item",
	initialImage: "/images/new-photo.jpg",
	hires: true

});

var shadow = Ti.UI.createImageView({
	image: "/images/shadow2.png",
	height: 6,
	width: 109
});

photoHolder.add(photo);

var dialog = Application.createDialog();

var name = Ti.UI.createTextField({
	color: "#666",
	hintText: "What are you making?",
	font:{
		fontWeight: "bold",
		fontSize: 18,
		fontFamily: "Helvetica Neue"
	},
	width: 280,
	top: 20,
	backgroundColor: "#fbfbfa",
	borderColor: "#999999",
	borderWidth: 1,
	height: 45,
	paddingLeft: 10
});

addComponent.add(photoHolder);
addComponent.add(shadow);
addComponent.add(name);

var addButton = Application.createNavButton("Add");

w.rightNavButton = addButton;

var image = Ti.UI.createImageView({
	image: "/images/right-arrow.png",
	right: 10
});

var howImage = Ti.UI.createImageView({
	image: "/images/right-arrow.png",
	right: 10
});

var suppliesButton = Ti.UI.createButton({
	title: "Supplies",
	color: "#666",
	selectedColor: "#666",
	borderRadius: 5,
	borderColor: "#999",
	style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	top: 10,
	width: 280,
	height: 45,
	zIndex: 2,
	backgroundColor: "#fbfbfa",
	textAlign: "left",
	font:{
		fontWeight: "bold",
		fontSize: 18,
		fontFamily: "Helvetica Neue"
	}
});

suppliesButton.add(image);

var howToButton = Ti.UI.createButton({
	title: "How To",
	color: "#666",
	selectedColor: "#666",
	borderRadius: 5,
	borderColor: "#999",
	style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	top: 10,
	width: 280,
	height: 45,
	zIndex: 2,
	backgroundColor: "#fbfbfa",
	textAlign: "left",
	font:{
		fontWeight: "bold",
		fontSize: 18,
		fontFamily: "Helvetica Neue"
	}
});

howToButton.add(howImage);
addComponent.add(suppliesButton);
addComponent.add(howToButton);

		var shareLabel = Ti.UI.createLabel({
			text: "Share on",
			font:{
				fontSize: 18,
				fontWeight: "bold",
				fontFamily: "Helvetica Neue"
			},
			left: 20,
			top: 15,
			color: "#222"
		});
		
		var shareTable = Ti.UI.createTableView({
			top: 5,
			scrollable: false,
			width: 280,
			left: 20,
			height: 120,
			borderRadius: 5,
			footerTitle: "",
			borderColor: "#999"
		});
		
		var twitterRow = Ti.UI.createTableViewRow({
			height: 60,
			selectedBackgroundColor: "#white",
			selectedColor: "black"
		});

		var twitterRowView = Ti.UI.createView({
			layout: "horizontal",
			height: 60
		});

		var twitterTitle = Ti.UI.createLabel({
			font:{
				fontWeight: "bold",
				fontSize: 18,
				fontFamily: "Helvetica Neue"
			},
			color: "black",
			left: 10,
			top: 20,
			width: 100,
			text: "Twitter"
		});
		
		var twitterSwitch = Ti.UI.createSwitch({
			value: true,
			left: 80,
			top: 20
		});
		
		twitterRowView.add(twitterTitle);
		twitterRowView.add(twitterSwitch);
		twitterRow.add(twitterRowView);
		
		shareTable.appendRow(twitterRow);

		var facebookRow = Ti.UI.createTableViewRow({
			height: 60,
			selectedBackgroundColor: "#white",
			selectedColor: "black"
		});

		var facebookRowView = Ti.UI.createView({
			layout: "horizontal",
			height: 60
		});

		var facebookTitle = Ti.UI.createLabel({
			font:{
				fontWeight: "bold",
				fontSize: 18,
				fontFamily: "Helvetica Neue"
			},
			color: "black",
			left: 10,
			top: 20,
			width: 100,
			text: "Facebook"
		});
		
		var facebookSwitch = Ti.UI.createSwitch({
			value: true,
			left: 80,
			top: 20
		});
		
		facebookRowView.add(facebookTitle);
		facebookRowView.add(facebookSwitch);
		facebookRow.add(facebookRowView);
		
		shareTable.appendRow(facebookRow);
		
		addComponent.add(shareLabel);
		addComponent.add(shareTable);
		addComponent.add(Application.createPadding());

w.add(addComponent);

var createComponent = function(){
	
	var suppliesInfo = eval('('+Ti.App.properties.getString("supplies")+')'),
		supplies = new Array();
	
	
	var how = eval('(' + Ti.App.properties.getString("components") + ')');
	var howImages = eval('(' + Ti.App.properties.getString("howImages") + ')');
	var links = eval('(' + Ti.App.properties.getString("links") + ')');

	var steps = {
		1: how[0],
		2: how[1],
		3: how[2],
		4: how[3],
		5: how[4],
		6: how[5],
		7: how[6]
	}
	
	var stepIDs = {
		1: howImages[0],
		2: howImages[1],
		3: howImages[2],
		4: howImages[3],
		5: howImages[4],
		6: howImages[5],
		7: howImages[6]
	}
	
	var stepURLs ={
		1: links[0],
		2: links[1],
		3: links[2],
		4: links[3],
		5: links[4],
		6: links[5],
		7: links[6]
	}
			
	if(suppliesInfo != null){
	
		var length = suppliesInfo.length;
	
		for(i=0;i<length;i++){
			supplies.push(suppliesInfo[i]);
		}
		
	}
	
	var valid = Application.validate({
		inputs:[
			{
				object: name,
				val: name.value,
				presence: true
			}
			]
	});
	
	if(valid){
	
	if(!photo.id){
		var url = "http://loumii.com/create_item.json";
	}
	else{
		var url = "http://loumii.com/items/" + photo.id + "/update.json";
	}
	var xhr = Ti.Network.createHTTPClient({
    	onload: function(e) {
        	var component = eval('('+this.responseText+')');
        	name.value = null;
        	Ti.App.fireEvent('refreshComponent', {type: component.type, id: component.id});
			w.close();
    	},
    	onerror: function() {
        	alert('Cannot connect to server');
    	},
    	timeout:30000
	});
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.open("POST", url);
	xhr.send({
		name: name.value,
		type: w.type,
		event_id: w.id,
		supplies: JSON.stringify(supplies),
		steps: JSON.stringify(steps),
		stepIDs: JSON.stringify(stepIDs),
		stepURLs: JSON.stringify(stepURLs)
	});
	}

}

addButton.addEventListener("click", createComponent);

suppliesButton.addEventListener("click", function(e){	
	
	var suppliesWindow = Ti.UI.createWindow({
		title: "Supplies",
		url: "/ui/supplies/new.js",
		backButtonTitle: "",
		barImage: "/images/barImage.png"
	});
	
	suppliesWindow.setTitleControl(Application.createTitle("Supplies"));
	
	Ti.UI.currentTab.open(suppliesWindow, {animated: true});	

});

photo.addEventListener("click", function(e){
	w.currentPhoto = e.source;
	dialog.show();
});

var disableAdd = function(){
	addButton.opacity = 0.5;
	addButton.removeEventListener('click', createComponent);
}

var enableAdd = function(){
	addButton.opacity = 1;
	addButton.addEventListener('click', createComponent);
}

var resetImage = function(){
	enableAdd();
}

dialog.addEventListener("click", function(e){
		
	Application.uploadImage(w.currentPhoto, e, disableAdd, enableAdd, resetImage);
		
});

howToButton.addEventListener("click", function(){
	
	var howToWindow = Ti.UI.createWindow({
		title: "How To",
		url: "/ui/how/new.js",
		backButtonTitle: "",
		barImage: "/images/barImage.png"
	});
	
	howToWindow.setTitleControl(Application.createTitle("How To"));
	
	Ti.UI.currentTab.open(howToWindow, {animated: true});
	
});

w.addEventListener("close", function(){
	
	for(i=0;i<howFileNames.length;i++){
	
		if(howFileNames[i]){
	   		
	  		var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, howFileNames[i]);
	  	
	  		file.deleteFile();
	  	}
	  		   		
	}
	
});

w.addEventListener("focus", function(){
	var social = Ti.App.Properties.getBool("social");
	twitterSwitch.value = social;
	facebookSwitch.value = social;
});