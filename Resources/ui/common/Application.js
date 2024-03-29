exports.goToAppEvent = function(e){
	
	var event = Titanium.UI.createWindow({
		title: e.source.title,
  		url:'../events/show.js',
  		barImage: "/images/barImage.png",
  		backButtonTitle: ''
	});
	
	event.setTitleControl(exports.createTitle(e.source.title));
		
	Ti.UI.currentTab.open(event, {animated: true});
	
	event.id = e.source.id;
	
	event.addEventListener("refresh", function(data){
		e.source.fireEvent("refresh", {event: data.event, remove: data.remove});
	});
	
}

exports.goToUser = function(user_id){
	
	if(Ti.App.Properties.getInt("user_id") != user_id){
					
		var profile = Titanium.UI.createWindow({
    		title: L(' '),
    		url: '/ui/profile/user.js',
    		tabBarHidden: true,
    		backButtonTitle: "",
    		barImage: "/images/barImage.png"
		});

		profile.setTitleControl(exports.createTitle(" "));
				
		profile.data = {id: user_id};
				
		Ti.UI.currentTab.open(profile);
						
	}
	else{
		Ti.App.ctb.select(3);	
	}
	
}

exports.goToUserExt = function(user_id, current_id){
	
	if(current_id != user_id){
					
		var profile = Titanium.UI.createWindow({
    		title: L(' '),
    		url: '/ui/profile/user.js',
    		tabBarHidden: true,
    		backButtonTitle: "",
    		barImage: "/images/barImage.png"
		});

		profile.setTitleControl(Application.createTitle(" "));
				
		profile.data = {id: user_id};
				
		Ti.UI.currentTab.open(profile);
						
	}
	
}

exports.goToAppEventExt = function(ev){
	
	var event = Titanium.UI.createWindow({
		title: ev.title,
  		url:'../events/show.js',
  		barImage: "/images/barImage.png",
  		backButtonTitle: ''
	});
	
	event.setTitleControl(exports.createTitle(ev.title));
	
	Ti.UI.currentTab.open(event, {animated: true});
	
	event.id = ev.id;
}


exports.createEvents = function(events, view){
		
		var thumbsContainer = Ti.UI.createView({
        	layout:'vertical',
        	height:Ti.UI.SIZE,
        	top:0, left:0
     	});
     						    
	    for(i=0;i<events.length;i++){
			
			var cardView = Application.createEvent(events[i], thumbsContainer);
			
			thumbsContainer.add(cardView);
			
	    }
	    	    
	    view.add(thumbsContainer);
	    view.add(Application.createPadding());
	    
}

exports.createSmallEvents = function(events, view, user_id){
		
		var thumbsContainer = Ti.UI.createView({
        	layout:'vertical',
        	height:Ti.UI.SIZE,
        	top:0, left:10,
        	width: 145
     	});
     	
     	var thumbsContainerRight = Ti.UI.createView({
        	layout:'vertical',
        	height:Ti.UI.SIZE,
        	top:0, left:165,
        	width: 145
     	});
		
		var rows = 0;
		     						    
	    for(i=0;i<events.length;i++){
			
			var cardView = exports.createSmallEvent(events[i], thumbsContainer, user_id);
			
			if((i+1)%2 == 0){
				thumbsContainerRight.add(cardView);	
			}
			else{
				rows++;
				thumbsContainer.add(cardView);
			}
			
	    }
	    	    
	    view.add(thumbsContainer);
	    view.add(thumbsContainerRight);
	    thumbsContainer.add(exports.createPadding());
	    
	    return rows;
}

exports.createSmallEvent = function(event, thumbsContainer, user_id){
	
			var cardView = Ti.UI.createView({
				height: 195,
				top: 5,
				layout:'vertical'
			});
						
			var myImage = Ti.UI.createView({
				width: 145,
				height: 145,
				borderColor: "white",
				borderWidth: 10,
				backgroundColor: "white"
			});
			
			var baseImage = Application.crImageView(event.image, {
				height: 145, 
				width: 145, 
				title: event.title, 
				id: event.id,
				position: i,
				hires: true
			});
			
			var statsView = Ti.UI.createView({
				width: 145,
				height: 40,
				layout: "horizontal",
				backgroundColor: "white"
			});
			
			var userImage = Ti.UI.createImageView({
				image: event.user_image,
				defaultImage: "/images/default.jpg",
				height: 30,
				width: 30,
				top: 3,
				left: 10,
				hires: true
			});
			
			userImage.addEventListener("click", function(){
				Application.goToUserExt(event.user_id, user_id)
			});
						
			var userInformation = Ti.UI.createView({
				layout: "vertical",
				height: 30,
				width: 80,
				top: 3,
				left: 10
			});
			
			var userName = Ti.UI.createLabel({
				text: event.username,
				minimumFontSize: "9dp",
				font:{
					fontSize: "11dp",
					fontWeight: "bold"
				},
				color: "#343434",
				height: 11,
				textAlign: "left",
				left: 0,
				width: 80
			});
			
			var eventName = Ti.UI.createLabel({
				text: event.title,
				minimumFontSize: "9dp",
				font:{
					fontSize: "11dp"
				},
				color: "#666666",
				height: "auto",
				textAlign: "left",
				left: 0,
				width: 80,
				height: 15,
				top: 0
			});
			
			userInformation.add(userName);
			userInformation.add(eventName);
			
			var likeImage = Ti.UI.createImageView({
				image: '/images/like.png',
				width: 20,
				top: 10,
				left: 0,
				event_id: event.id
			});
			
			var addImage = Ti.UI.createImageView({
				image: '/images/add.png',
				width: 20,
				top: 7,
				left: 15,
				event_id: event.id
			});
			
			statsView.add(userImage);
			statsView.add(userInformation);			
			statsView.add(likeImage);
			statsView.add(addImage);
						
			myImage.add(baseImage);
			
			cardView.add(myImage);
			cardView.add(statsView);
			
			var shadow = Ti.UI.createImageView({
				image: "/images/shadow3.png",
				height: 5,
				width: 145
			});
			
			cardView.add(shadow);
												
			baseImage.addEventListener("click", Application.goToAppEvent);
			
			likeImage.addEventListener("click", Application.likeEvent);
		 	addImage.addEventListener("click", Application.copyEvent);
		 			 	
		 	baseImage.addEventListener("refresh", function(data){
		 		if(!data.remove){
		 			baseImage.image = data.event.image;
		 			eventName.text = data.event.title;
		 		}
		 		else{
		 			thumbsContainer.remove(cardView);
		 		}
		 	});

			return cardView;
		
}

exports.createEvent = function(event, thumbsContainer){
	
			var currentUser = (event.user_id == Ti.App.Properties.getInt('user_id')),
				liked = false;
			
			if(Ti.App.Properties.getString("user_details") != null){
				var details = JSON.parse(Ti.App.Properties.getString("user_details"));
								
				for(j=0;j<details.liked_events.length;j++){
					if(details.liked_events[j].id == event.id){
						liked = true;
						break;
					}
				}
				
			}
			else if(Ti.App.Properties.getString("liked_events") != null){
				
				var details = JSON.parse(Ti.App.Properties.getString("liked_events"));
				
				for(j=0;j<details.length;j++){
					if(details[j].id == event.id){
						liked = true;
						break;
					}
				}
				
			}
	
			var cardView = Ti.UI.createView({
				height: 318,
				top: 15,
				layout:'vertical'
			});
						
			var myImage = Ti.UI.createView({
				width: 260,
				height: 260,
				borderColor: "white",
				borderWidth: 10,
				backgroundColor: "white"
			});
			
			var baseImage = Application.crImageView(event.image, {
				height: 260, 
				width: 260, 
				title: event.title, 
				id: event.id,
				position: i,
				hires: true
			});
			
			var statsView = Ti.UI.createView({
				width: 260,
				height: 50,
				layout: "horizontal",
				backgroundColor: "white"
			});
			
			var userImage = Ti.UI.createImageView({
				image: event.user_image,
				height: 40,
				width: 40,
				top: 3,
				defaultImage: "/images/default.jpg",
				left: 10,
				hires: true
			});
			
			userImage.addEventListener("click", function(){
				Application.goToUser(event.user_id);
			});
			
			var userInformation = Ti.UI.createView({
				layout: "vertical",
				height: 50,
				width: 135,
				top: 5,
				left: 10
			});
			
			var userName = Ti.UI.createLabel({
				text: event.username,
				minimumFontSize: "11dp",
				font:{
					fontSize: "13dp",
					fontWeight: "bold"
				},
				color: "#343434",
				height: 13,
				textAlign: "left",
				left: 0,
				width: 160
			});
			
			var eventName = Ti.UI.createLabel({
				text: event.title,
				minimumFontSize: "11dp",
				font:{
					fontSize: "13dp"
				},
				color: "#666666",
				textAlign: "left",
				left: 0,
				width: 100,
				height: 20,
				top: 0
			});
			
			userInformation.add(userName);
			userInformation.add(eventName);
			
			statsView.add(userImage);
			statsView.add(userInformation);
			
			if(!currentUser){
				
				var likeImage = Ti.UI.createImageView({
					image: liked ? '/images/liked.png' : "/images/like.png",
					width: 20,
					top: 10,
					left: 0,
					event: event,
					event_id: event.id
				});
			
				if(liked){
					likeImage.addEventListener("click", Application.unlikeEvent);
				}
				else{
					likeImage.addEventListener("click", Application.likeEvent);
				}
			
				statsView.add(likeImage);
				
			}
			
			var addImage = Ti.UI.createImageView({
				image: '/images/add.png',
				width: 20,
				top: 7,
				left: currentUser ? 35 : 15,
				event_id: event.id
			});
			
			statsView.add(addImage);
						
			myImage.add(baseImage);
			
			cardView.add(myImage);
			cardView.add(statsView);
			cardView.add(Application.createShadow());
												
			baseImage.addEventListener("click", Application.goToAppEvent);
			
		 	addImage.addEventListener("click", Application.copyEvent);
		 			 	
		 	baseImage.addEventListener("refresh", function(data){
		 		if(!data.remove){
		 			baseImage.image = data.event.image;
		 			eventName.text = data.event.title;
		 		}
		 		else{
		 			thumbsContainer.remove(cardView);
		 		}
		 	});

			return cardView;
		
}

exports.getCategories = function(){

	var categories = [
	"Birthday",
	"Dinner",
	"Afternoon & morning tea",
	"Child's play",
	"Christmas",
	"Wedding",
	"Valentine's day",
	"Anniversary",
	"Mother's Day",
	"Father's Day",
	"High tea",
	"Baby Shower"
	]
 
var picker_data = []; 
 
for(i=0;i<categories.length;i++){
	picker_data.push(Titanium.UI.createPickerRow({title: categories[i]}))
} 

return picker_data;
	
}

exports.getPlainCategories = function(){

	var categories = [
	"Birthday",
	"Dinner",
	"Afternoon & morning tea",
	"Child's play",
	"Christmas",
	"Wedding",
	"Valentine's day",
	"Anniversary",
	"Mother's Day",
	"Father's Day",
	"High tea",
	"Baby Shower"
	]
	
	return categories;
	
}

exports.getStyles = function(){

	var styles = [
	"Classic",
	"Eco",
    "Edgy",
    "Elegant",
    "Fun",
    "Hip",
    "Stylish",
    "Vintage"
    ]
	
	var picker_data = []; 
 
	for(i=0;i<styles.length;i++){
		picker_data.push(Titanium.UI.createPickerRow({title: styles[i]}))
	} 

	return picker_data;
	
}

exports.getPlainStyles = function(){
	
	var styles = [
	"Classic",
	"Eco",
    "Edgy",
    "Elegant",
    "Fun",
    "Hip",
    "Stylish",
    "Vintage"
    ]
	
	return styles;
	
}

exports.createTitle = function(title){
	
return Titanium.UI.createLabel({
    color:'#da6453',
    text: title,
    height: 25,
    width: 170,
    textAlign:'center',
    font:{fontSize: 20, fontWeight:'bold'}
});
	
}

exports.createNavButton = function(title){
	
var button = Titanium.UI.createButton({
	title: title,
	style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	backgroundImage: "/images/buttonbg.png",
	width: 60,
	height: 30,
	color: "#666",
	font:{
		fontWeight: "bold",
		fontSize: 12
	}
});

var navButton = Ti.UI.createWindow({
	height: 30,
	width: 60
});

navButton.add(button);

return navButton;
	
};

exports.createBackButton = function(){
	
var button = Titanium.UI.createButton({
	title: "  Back",
	style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	backgroundImage: "/images/backButton.png",
	backgroundRepeat: false,
	width: 60,
	height: 30,
	color: "#666",
	font:{
		fontWeight: "bold",
		fontSize: 12
	}
});

var backButton = Ti.UI.createWindow({
	height: 30,
	width: 60
});

backButton.add(button);

backButton.addEventListener("click", exports.closeWindow);

return backButton;

}

exports.closeWindow = function(){		
	w.close();
};

exports.createWebBackButton = function(w){

var button = Titanium.UI.createButton({
	title: "  Back",
	style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	backgroundImage: "/images/backButton.png",
	backgroundRepeat: false,
	width: 60,
	height: 30,
	color: "#666",
	font:{
		fontWeight: "bold",
		fontSize: 12
	}
});

var backButton = Ti.UI.createWindow({
	height: 30,
	width: 60
});

backButton.add(button);

backButton.addEventListener("click", function(){		
	w.close();
});

return backButton;

};

exports.createBackButtonExt = function(){
	
var button = Titanium.UI.createButton({
	title: "  Back",
	style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	backgroundImage: "/images/backButton.png",
	backgroundRepeat: false,
	width: 60,
	height: 30,
	color: "#666",
	font:{
		fontWeight: "bold",
		fontSize: 12
	}
});

var backButton = Ti.UI.createWindow({
	height: 30,
	width: 60
});

backButton.add(button);

backButton.addEventListener("click", function(){		
	navGroup.close(w);
});

return backButton;
	
};

exports.openWebView = function(url){
	
	var webView = Ti.UI.createWebView({
		url: url,
		height: 375,
		top: 0
	});

	var linkWindow = Ti.UI.createWindow({
		title: "Loumii",
		url: "/ui/links/show.js",
		backButtonTitle: "",
		barImage: "/images/barImage.png"
	});
		
	linkWindow.setTitleControl(Application.createTitle("Loumii"));
		
	linkWindow.add(webView);
	
	var back = Application.createWebBackButton(linkWindow);
	linkWindow.leftNavButton = back;
	
	var customTabBar = Ti.UI.createWindow({
		height: 45,
		bottom: 0,
		width: "100%",
		backgroundGradient:
		{
		type:'linear',
		colors:['#fefefe','#e6e6e6']
		},
		zIndex: 1
	});
	
	var topBorder = Ti.UI.createView({
		width: "100%",
        height: 1,
        borderWidth: 1,
        borderColor: "#666666",
        top: 0
	});
	
	var iconHolder = Ti.UI.createView();
	
	var backButton = Ti.UI.createImageView({
		image: "/images/web-back.png",
		left: 10,
		top: 15,
		height: 20,
		width: 16,
		opacity: 0.5
	});
	
	var forwardButton = Ti.UI.createImageView({
		image: "/images/web-forward.png",
		left: 150,
		top: 15,
		height: 20,
		width: 16,
		opacity: 0.5
	});
	
	var reloadButton = Ti.UI.createImageView({
		image: "/images/web-reload.png",
		right: 10,
		top: 15,
		height: 20,
		width: 16
	});
	
	reloadButton.addEventListener("click", function(){
		webView.reload();
	});
	
	forwardButton.addEventListener("click", function(){
		
		if(webView.canGoForward()){
			webView.goForward();
		}
		
	});
	
	backButton.addEventListener("click", function(){
		
		if(webView.canGoBack()){
			webView.goBack();
		}
		
	});
	
	webView.addEventListener("load", function(){
		
		forwardButton.opacity = webView.canGoForward() ? 1 : 0.5;
		backButton.opacity = webView.canGoBack() ? 1 : 0.5;
		
	});
	
	iconHolder.add(backButton);
	iconHolder.add(forwardButton);
	iconHolder.add(reloadButton);
	
	customTabBar.add(topBorder);
	customTabBar.add(iconHolder);
		 
	linkWindow.add(customTabBar);

	linkWindow.open({modal: true});
	
}

exports.homeImages = function(){
	
	var images = [
		{url: "/images/home/Afternoon_tea_with_grandma.JPG", title: "Afternoon tea with grandma", date: "Sep 18, 2012"},
		{url: "/images/home/Christmas_lunch.JPG", title: "Christmas Lunch", date: "Dec 25, 2012"},
		{url: "/images/home/Jonah's_birthday_bake-off.JPG", title: "Jonah's birthday bake-off", date: "Dec 13, 2012"},
		{url: "/images/home/Mother's_Day_high_tea.JPG", title: "Mother's Day high tea", date: "Feb 02, 2012"},
		{url: "/images/home/Nanna's_birthday_dinner.JPG", title: "Nanna's birthday dinner", date: "Oct 29, 2012"},
		{url: "/images/home/Sashimi_&_sake_dinner_party.JPG", title: "Sashimi & sake dinner party", date: "May 11, 2012"},
		{url: "/images/home/Summer_brunch.JPG", title: "Summer brunch", date: "Jan 17, 2012"}
	]
	
	return images;
	
}

exports.createPadding = function(){
	
	var padding = Ti.UI.createView({
		height: 50,
		width: "100%"
	});
	
	return padding;
	
}

exports.createShadow = function(){
	
	var shadow = Ti.UI.createImageView({
		image: "/images/shadow.png",
		height: 9,
		width: 260
	});
	
	return shadow;
}

exports.crImageView = function(url, opts) {
    var photo = Ti.UI.createImageView({
        image: url,
        defaultImage: "/images/default.jpg",
        width:opts.width, 
        height:opts.height,
        title: opts.title,
        id: opts.id,
        zIndex: 1,
        hires: opts.hires || false
    });
    
    var didLoad=false;
    var fnLoad=function() { 
        didLoad=true;
    }
    var fnTimer=function() {
        if (!didLoad) {
            photo.image=url;    //retry!
        }
    }
    // if loaded then everything is ok..
    photo.addEventListener('load', function(e) {
        fnLoad();
    	if(opts.rotation){
    		Ti.API.log(e.source.parent.parent);
    		setTimeout(function() {
    			show_event.createRotationLabel(e.source.parent.parent);
    		}, 50);
    	}
    });
    setTimeout(function() {
            fnTimer();
    },3000);    // seconds load time
    return photo;
}

exports.uploadPhoto = function(type, id, image, callback){
	
	var url = "http://www.loumii.com/new_photo";
	var xhr = Ti.Network.createHTTPClient({
    	onload: function(e) {
    		photo.image = "/images/new-photo.jpg";
    		photo.newImage = true;
        	callback.apply();	    
    	},
    	onerror: function() {
        	alert('Could not connect to server');
        	photo.image = "/images/new-photo.jpg";
    		photo.newImage = true; 
    	},
    	timeout:60000
	});
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.open("POST", url);
	xhr.send({
		my_image: image,
		id: id,
		type: type
	});
	
}

exports.uploadImage = function(photo, e, start, callback, error){
	
	var loader = Ti.UI.createActivityIndicator({
		style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK
	});
		
	if(e.index == 0){	
		Titanium.Media.showCamera({
			allowEditing: true,
			animated: true,
			saveToPhotoGallery: true,
			success:function(event) {
            	
            	start.apply();
            	
            	var image = event.media;
            	
				photo.image = "/images/default.jpg";
            	photo.parent.add(loader);
            	loader.show(); 

				exports.sendImageToServer(photo, e, event, loader, start, callback, error);

    		}
		});
	}
	else if(e.index == 1){
		Titanium.Media.openPhotoGallery({
			allowEditing: true,
			animated: true,
    		success:function(event) {
    			
    			start.apply();
    			
            	var image = event.media;
            	
            	photo.image = "/images/default.jpg";
            	photo.parent.add(loader);
            	loader.show(); 
            	
            	exports.sendImageToServer(photo, e, event, loader, start, callback, error); 
				            	
    		}
		});		
	}	
	
}

exports.sendImageToServer = function(photo, photoType, event, loader, start, callback, error){
	
	var resizedImage = event.media.imageAsResized(400,400);
		
	var url = "http://www.loumii.com/new_photo";
	var xhr = Ti.Network.createHTTPClient({
	onload: function(e) {
		photo.id = parseInt(this.responseText);
		photo.image = resizedImage;
		photo.initialImage = resizedImage;
		loader.hide();
    	callback.apply();	    
    },
	onerror: function() {
		
    	var alertDialog = Titanium.UI.createAlertDialog({
    		title: 'Whoops!',
    		message: 'There was some trouble uploading your image',
    		buttonNames: ['Try Again','Cancel']
		});
		alertDialog.show();

		alertDialog.addEventListener("click", function(e){
			
			if(e.index == 0){
				exports.sendImageToServer(photo, photoType, event, loader, start, callback, error);
			}
			else{
				photo.image = photo.initialImage;
				loader.hide();
				error.apply();	
			}
			
		});
		
    },
	timeout:60000
	});
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.open("POST", url);
	xhr.send({
		my_image: resizedImage,
		id: photo.id,
		type: photo.type
	});
}

exports.characterLimiter = function(limit, textArea, opts){
	
	if(textArea.value == textArea.initialValue){
		length = 0
	}
	else{
		length = textArea.value.length
	}
	
	var limiterLabel = Ti.UI.createLabel({
		text: limit - length,
		color: "#999",
		font:{
			fontSize: 16,
			fontFamily: "Helvetica Neue"
		},
		top: opts.top || 0,
		right: opts.right,
		textAlign: "right"
	});
	
	textArea.addEventListener("focus", function(){
		if(textArea.value == textArea.initialValue){
			textArea.value = "";
			textArea.color = textArea.normalColor;
			limiterLabel.text = limit;
		}
	});
	
	textArea.addEventListener("blur", function(){
		if(textArea.value == ""){
			textArea.value = textArea.initialValue;
			textArea.color = textArea.placeholderColor;
			limiterLabel.text = limit;
		}
	});
	
	textArea.addEventListener("change", function(){
		
		newLength = (limit - textArea.value.length);
		
		if(newLength <= -1){
			limiterLabel.color = "#cc0000";
			textArea.value = textArea.value.slice(0, limit);	
			return false;
		}
		
		else{
			limiterLabel.color = "#999";
			limiterLabel.text = newLength;
		}
		
	});
	
	return limiterLabel;
	
}

exports.likeEvent = function(e){
		
	var image = e.source;
	
	var url = "http://www.loumii.com/app_events/" + image.event_id + "/like.json";
   	var xhr = Ti.Network.createHTTPClient({
    	onload: function(e) {
    		
    		image.image = "/images/liked.png";
    		
    		if(Ti.App.properties.getString("user_details")){
    			var user = JSON.parse(Ti.App.properties.getString("user_details"));
    			user.liked_events.push(image.event);
    			Ti.App.properties.setString("user_details", JSON.stringify(user));
    			Ti.App.fireEvent("refresh_following", {like: true});
				Ti.App.fireEvent("refresh_profile", {refresh_type: "Like", events: user.liked_events});
    		}
    		
    		image.removeEventListener("click", exports.likeEvent);
    		image.addEventListener("click", exports.unlikeEvent);
    				   
    	},
    	onerror: function() {
			// this function is called when an error occurs, including a timeout
        	alert('Cannot connect to server');
    	},
    	timeout:30000  /* in millisecon */
	});
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.open("POST", url);
	xhr.send({
		user_id: Ti.App.Properties.getInt("user_id")
	});
				
}

exports.unlikeEvent = function(e){
		
	var image = e.source;
	
	var url = "http://www.loumii.com/app_events/" + image.event_id + "/like.json";
   	var xhr = Ti.Network.createHTTPClient({
    	onload: function(e) {
    		
    		image.image = "/images/like.png";
    		
    		if(Ti.App.properties.getString("user_details")){
    			var user = JSON.parse(Ti.App.properties.getString("user_details"));
    			
    			for(i=0;i<user.liked_events.length;i++){
    				if(user.liked_events[i].id == image.event.id){
    					user.liked_events.splice(i,1);
    					break;
    				}
    			}
    			
				Ti.App.properties.setString("user_details", JSON.stringify(user));
    			Ti.App.fireEvent("refresh_following", {like: true});
				Ti.App.fireEvent("refresh_profile", {refresh_type: "Like", events: user.liked_events});

    		}
    			
    		image.removeEventListener("click", exports.unlikeEvent);
    		image.addEventListener("click", exports.likeEvent);
    		    				   
    	},
    	onerror: function() {
			// this function is called when an error occurs, including a timeout
        	alert('Cannot connect to server');
    	},
    	timeout:30000  /* in millisecon */
	});
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.open("POST", url);
	xhr.send({
		user_id: Ti.App.Properties.getInt("user_id")
	});
				
}

exports.copyEvent = function(e){
	
	var image = e.source;
	
	var url = "http://www.loumii.com/app_events/" + image.event_id + "/copy.json";
   	var xhr = Ti.Network.createHTTPClient({
    	onload: function(data) {
    		var event = eval('('+this.responseText+')');
    		Application.goToAppEventExt(event);		   
    	},
    	onerror: function() {
			// this function is called when an error occurs, including a timeout
        	alert('Cannot connect to server');
    	},
    	timeout:30000  /* in millisecon */
	});
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.open("POST", url);
	xhr.send({
		user_id: Ti.App.Properties.getInt("user_id")
	});
				
}

exports.createDialog = function(){
	
	return Ti.UI.createOptionDialog({
    	options:['Take A New Photo', 'Choose Existing', 'Cancel'],
    	cancel:2
	});
	
}

exports.validate = function(fields){
	
	var valid = true,
		alertMessage = false,
		missingFields = [],
		invalidFields = [],
		re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		
	for(i=0;i<fields.inputs.length;i++){
		var input = fields.inputs[i];
		
		if(input.presence){
			if((input.val == "" || input.val == null) || (input.object.initialValue && input.val == input.object.initialValue)){
				valid = false;
				alertMessage = true;
				
				if(input.object.initialValue){
					missingFields.push(input.object.initialValue + " can't be blank\n");
				}
				else{
					missingFields.push(input.object.hintText + " can't be blank\n");
				}	
				
			}
		}
		
		if(input.email){
			if(input.val != "" && re.test(input.val) == false){
				valid = false;
				alertMessage = true;
				invalidFields.push(input.object.hintText + " is invalid\n");
			}
		}
		 
	}
	
	if(alertMessage){
		missingFields2 = missingFields.join("");
		invalidFields2 = invalidFields.join("");
		alert("Please fix the following errors: \n\n" + missingFields2 + invalidFields2);
	}
	
	return valid;
	
}
