var w = Ti.UI.currentWindow;
var Application = require('ui/common/Application');

var profileView = Ti.UI.createScrollView({
        left:0,
        top: 0,
        contentHeight:"auto",
    	contentWidth:'auto',
    	showVerticalScrollIndicator:true
});

var tabHolder = Ti.UI.createView({
	width: "100%",
	height: 30,
	top: 185
});

var logoutButton = Application.createNavButton("Log Out"),
	nameLabel,
	bioLabel;

w.rightNavButton = logoutButton;

w.addEventListener("focus", function(){
	if(profileView.children.length <= 0){
		getUserInfo();
	}
	else{
		getFollowInfo();
	}
});

var tabViews = [];

var eventView = Ti.UI.createView({
	height: "auto",
	width: "auto",
	top: 213,
	backgroundColor: "#efefef",
	zIndex: 2,
	currentTab: 0,
	selectedTab: null
});

var eventsView = Ti.UI.createView({
	top: 5,
	height: "auto",
	width: "auto",
	position: 0
});

var followingView = Ti.UI.createView({
	height: 0,
	top: 5,
	width: "auto",
	position: 1
});

var likedView = Ti.UI.createView({
	height: 0,
	top: 5,
	width: "auto",
	position: 2
});

tabViews.push(eventsView);
tabViews.push(followingView);
tabViews.push(likedView);

eventView.add(tabViews);

var signOut = function(){
	var url = "http://loumii.com/signout.json";
	var xhr = Ti.Network.createHTTPClient({
    	onload: function(e) {
    		Ti.App.Properties.setBool('logged_in', false);
        	Ti.App.Properties.setInt('user_id', null);
        	
        	if(Titanium.Facebook.loggedIn){
        		Titanium.Facebook.logout();
        	}
			Ti.App.fireEvent("logout");
			
    	},
    	onerror: function() {
        	alert('Cannot connect to server');
    	},
    	timeout:30000
	});
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.open("GET", url);
	xhr.send();	
}

logoutButton.addEventListener("click", signOut);

var getUserInfo = function(){

w.loaded = false;
	
var url = "http://www.loumii.com/users/" + Ti.App.Properties.getInt('user_id') + ".json";
var xhr = Ti.Network.createHTTPClient({
    onload: function(e) {
        
        var user = eval('('+this.responseText+')');

		w.current_user = user;

		w.setTitleControl(Application.createTitle(user.name));

		Ti.App.properties.setString("user_details", JSON.stringify(user));

		var cardView = Ti.UI.createView({
			width: 90,
			height: 90,
			top: 20,
			left: 10,
			backgroundColor: "white",
			borderColor: "white",
			borderWidth: 5
		});

		var shadow = Ti.UI.createImageView({
			image: "/images/shadow2.png",
			height: 5,
			width: 90,
			left: 10,
			top: 110
		});

		image = Ti.UI.createImageView({
			image: user.image,
			defaultImage: "/images/default.jpg",
			width: 90,
			height: 90,
			hires: true
		});
		
		cardView.add(image);	
		
		var accountTable = Ti.UI.createTableView({
			height: 40,
			width: 200,
			scrollable: false,
			borderRadius: 5,
			left: 110,
			top: 70,
			borderColor: "#ccc",
			borderWidth: 1
		});
		
		var accountRow = Ti.UI.createTableViewRow({
			title: "Edit your profile",
			rightImage: "/images/right-arrow.png",
			width: 200,
			height: 40,
			selectedColor: "black",
			selectedBackgroundColor: "#f2f2f2",
			borderColor: "#ccc",
			font:{
				fontSize: "16dp",
				fontWeight: "bold"
			}
		});
						
		accountTable.appendRow(accountRow);				
		
		accountRow.addEventListener("click", function(){
			editUser();
		});
		
		profileView.add(accountTable);			
						
		profileView.add(cardView);
		profileView.add(shadow);
						
		following = createRoundedLabel(user.following + " Following", '13dp', {top: 20, left: 110}),		
		followers = createRoundedLabel(user.followers + " Followers", '13dp', {top: 20, left: 210});
		
		following.addEventListener("click", function(){
			showFollow("Following", Ti.App.Properties.getInt('user_id'));
		});
		
		followers.addEventListener("click", function(){
			showFollow("Followers", Ti.App.Properties.getInt('user_id'));
		});
		
		bioLabel = createLabel(user.bio, '12dp', {top: 120, left: 11, weight: "normal", width: 300, height: "auto", align: "left", dontAdd: true});	
		
		profileView.add(bioLabel);
		
		positionTabs();
		
		Application.createSmallEvents(user.events, eventsView, user.id);
		Application.createSmallEvents(user.following_events, followingView, user.id);
		Application.createSmallEvents(user.liked_events, likedView, user.id);
				
		profileView.add(eventView);
				
		createViewTabs();
		setEventViewSize();
		
		w.loaded = true;
		 
    },
    onerror: function() {
        alert('Cannot connect to server');
    },
    timeout:30000 
});
xhr.setRequestHeader("Content-Type","application/json");
xhr.open("GET", url);
xhr.send(); 
	
}

w.add(profileView);

var getFollowInfo = function(){

		var url = "http://loumii.com/users/" + Ti.App.Properties.getInt('user_id')  + "/follow_info.json";
		var xhr = Ti.Network.createHTTPClient({
    		onload: function(e) {
				
				var info = eval('('+this.responseText+')');
				
				followers.text = info.followers + " Followers";
				following.text = info.following + " Following";
										    		    		    		
    		},
    		onerror: function(e) {
        		Ti.API.log(e.error);
    		},
    		timeout:30000
		});
		xhr.setRequestHeader("Content-Type","application/json");
		xhr.open("GET", url);
		xhr.send();
		
}

var setEventViewSize = function(){
	
	var tabHeight = tabViews[eventView.currentTab].toImage().height
	
	if(tabHeight > 50 && tabViews[eventView.currentTab].children.length > 0){
		if(tabHeight > 253){
			eventView.height = tabHeight;
		}
		else{
			eventView.height = 253;
		}
	}
	else{
		eventView.height = 253;
	}
	
}

var positionTabs = function(){
	
	if(bioLabel.text){	
		tabHolder.top = eventView.top = bioLabel.toImage().height + bioLabel.top + 40;
	}
	else{
		tabHolder.top = eventView.top = 158;
	}
		
	tabHolder.top -= 28;
	
}

var refreshDetails = function(user){
	
	if(bioLabel.text != user.bio){
		bioLabel.text = user.bio;
		positionTabs();
	}
	
	image.image = user.image;
	
	w.setTitleControl(Application.createTitle(user.name));
	
	w.current_user = JSON.parse(Ti.App.Properties.getString("user_details"));
	
}

var showFollow = function(type, id){
	
	var title = type;
	
	follow = Ti.UI.createWindow({
		title: type,
		url: "/ui/profile/follow.js",
		barImage: "/images/barImage.png",
		backButtonTitle: ''
	});
	
	follow.setTitleControl(Application.createTitle(title));
	
	follow.id = id;
	follow.type = type.toLowerCase();
	
	Ti.UI.currentTab.open(follow, {animated: true});
	
}

var editUser = function(){
	
	var title = "Account";
	
	updateUser = Ti.UI.createWindow({
		title: "Edit " + title,
		url: "/ui/profile/edit.js",
		barImage: "/images/barImage.png",
		backButtonTitle: ''
	});
	
	updateUser.setTitleControl(Application.createTitle(title));
	
	updateUser.data = w.current_user;
	
	Ti.UI.currentTab.open(updateUser, {animated: true});
	
	updateUser.addEventListener("refresh", function(data){
		refreshDetails(data.user);
	});
	
}

var createLabel = function(text, size, position){
		var label = Ti.UI.createLabel({
			text: text,
			font:{
	            fontSize: size || '16dp',
		    	fontWeight: position.weight || 'bold',
		    	fontFamily: "Helvetica Neue"
			},
			height: position.height || 'auto',
			width: position.width || 'auto',
			color:'#333',
			touchEnabled:false,
			top: position.top,
			textAlign: position.align || "left",
			left: position.left,
			shadowColor: "rgba(255,255,255,0.5)"
		});
		
		if(!position.dontAdd){
			profileView.add(label);
		}
		return label;
}

var createRoundedLabel = function(text, size, position){
		
		var label = Ti.UI.createLabel({
			text: text,
			font:{
	            fontSize: size || '16dp',
		    	fontWeight:'bold',
		    	fontFamily: "Helvetica Neue"
			},
			height: 35,
			color:'#333',
			width: 95,
			borderRadius: 8,
			borderColor: "#999",
			top: position.top,
			left: position.left,
			textAlign: "center",
			backgroundColor: "rgba(153,153,153,0.1)",
			shadowColor: "rgba(255,255,255,0.5)"
		});
		
		profileView.add(label);
		
		return label;	

}

var createViewTabs = function(){
	
	createActiveTab("Events", {top: 0, left: 10, index: 0});
	createInactiveTab("Following", {top: 0, left: 113, index: 1});
	createInactiveTab("Liked", {top: 0, left: 215, index: 2});
	
	var tabBottom = Ti.UI.createView({
		height: 2,
		width: "100%",
		bottom: 2,
		borderColor: "#da6453"
	});
	
	tabHolder.add(tabBottom);
		
	profileView.add(tabHolder);
	
}

var resetTabs = function(tab, previousTab){

	tab.color = "white";
	tab.borderColor = "#e05b48";
	tab.backgroundGradient = {
		type:'linear',
		colors:['#d25340','#cb3d29']
	};
	tab.shadowColor = "#b53527"
	
	previousTab.color = "#7a7a7a";
	previousTab.borderColor = "#9a9896";
	previousTab.backgroundGradient = {
		type:'linear',
		colors:['#dfdfdf','#d0d0d0']
	};
	previousTab.shadowColor = "#dfdfdf";
	
}

var showEvents = function(e){

	var tab = e.source,
		previousTab = eventView.selectedTab; 

	tabViews[eventView.currentTab].height = 0;
	
	tabViews[tab.index].height = "auto";
		
	eventView.currentTab = tab.index;
	
	setEventViewSize();
	
	if(tab != previousTab){
	
		resetTabs(tab, previousTab);
	
		eventView.selectedTab = tab;
	}
	
}

var createActiveTab = function(title, position){
	
	var tab = Ti.UI.createLabel({
		height: 30,
		width: 95,
		top: position.top,
		left: position.left,
		text: title,
		borderRadius: 4,
		backgroundColor: "#cb3d29",
		backgroundGradient:{type:'linear',
		colors:['#d25340','#cb3d29'],
		startPoint:{x:0,y:0},
		endPoint:{x:0,y:20},
		backFillStart:false},
		color: "white",
		index: position.index,
		font:{
			fontSize: 16,
			fontWeight: "bold",
			fontFamily: "Helvetica Neue",
		},
		textAlign: "center",
		shadowColor: "#b53527",
		borderColor: "#e05b48"
	});
	
	tab.addEventListener("click", showEvents);
	
	eventView.selectedTab = tab;
	
	tabHolder.add(tab);
	
}

var createInactiveTab = function(title, position){
	
	var tab = Ti.UI.createLabel({
		height: 30,
		width: 95,
		top: position.top,
		left: position.left,
		text: title,
		borderRadius: 4,
		backgroundColor: "#d0d0d0",
		backgroundGradient:{type:'linear',
		colors:['#dfdfdf','#d0d0d0'],
		startPoint:{x:0,y:0},
		endPoint:{x:0,y:20},
		backFillStart:false},
		color: "#7a7a7a",
		index: position.index,
		font:{
			fontSize: 16,
			fontWeight: "bold",
			fontFamily: "Helvetica Neue",
		},
		textAlign: "center",
		shadowColor: "#dfdfdf",
		borderColor: "#9a9896"
	});
	
	tab.addEventListener("click", showEvents);
	
	tabHolder.add(tab);
	
}

var refresh = function(events, view, tab){
	
	if(view.children.length){
			
		for(i=0;i<view.children.length;i++){
			
			try{
				view.remove(view.children[i]);
			}
			catch(err){
				Ti.API.log(err);
			}	
		}
			
		for(i=0;i<view.children.length;i++){
			
			try{
				view.remove(view.children[i]);
			}
			catch(err){
				Ti.API.log(err);
			}
			
		}
			
	}

	var rows = Application.createSmallEvents(events, view, Ti.App.Properties.getInt('user_id'));
		
	if(eventView.currentTab == tab){
		eventView.height = (rows > 0) ? (200 * rows + 50) : 253;
	}
	
}

var followUser = function(e){
	
	var followButton = e.source;
	
	var url = "http://loumii.com/users/" + w.current_user.id  + "/follow.json";
	var xhr = Ti.Network.createHTTPClient({
    	onload: function(e) {
			followButton.text = "Unfollow";
    	},
    	onerror: function() {
        	alert('Cannot connect to server');
    	},
    	timeout:30000
	});
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.open("GET", url);
	xhr.send({
		user_id: Ti.App.Properties.getInt('user_id')
	});		
	
}

Ti.App.addEventListener("refresh_profile", function(data){
						
	switch(data.refresh_type){
		case "Following":
			refresh(data.events, followingView, 1);
		break;
		case "Like":
			refresh(data.events, likedView, 2);
		break;
		case "Events":
			refresh(data.events, eventsView);
		break;
	}
	
});
