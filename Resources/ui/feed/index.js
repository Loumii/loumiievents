var w = Ti.UI.currentWindow;

var Application = require('ui/common/Application');

var feedView = Ti.UI.createView({
	layout: "vertical"
});

var rows = [];

var feedTable = Ti.UI.createTableView({
	data: rows
});

w.addEventListener("focus", function(){
	
	var url = "http://www.loumii.com/feed.json";
   	var xhr = Ti.Network.createHTTPClient({
    	onload: function(e) {
    		
    		for(i=0;i<rows.length;i++){
				feedTable.deleteRow(rows[i]);
			}
    		
    		var notifications = eval('('+this.responseText+')').notifications;
    		    		
    		for(i =0;i<notifications.length;i++){
    			
    			var feedRow = Ti.UI.createTableViewRow({
    				selectedBackgroundColor: "white"
    			});
    			
    			var notification = notifications[i];    			    			
    				
    				var rowView = Ti.UI.createView({
    					layout: "horizontal",
    					height: 60,
    					width: "100%"
    				});
    				 
    				var verticalView = Ti.UI.createView({
    					layout: "vertical",
    					height: 50,
    					width: "60%",
    					left: 10,
    					top: 10
    				});
    				
    				var imageHolder = Ti.UI.createView({
    					height: 45,
    					width: 45,
    					top: 7,
    					left: 10,
    					borderRadius: 5,
    					borderColor: "white",
    					borderWidth: 5
    				});
    				
    				imageHolder.addEventListener('postlayout', postLayoutCallback);
    				    				
    				var userImage = Ti.UI.createImageView({
    					image: notification.image,
    					height: 43,
    					width: 43,
    					defaultImage: "/images/default.jpg",
    					hires: true,
    					user_id: notification.user_id
    				});
    				
    				userImage.addEventListener("click", function(e){
    					Application.goToUser(e.source.user_id);
    				});
    				
    				imageHolder.add(userImage);
    				
    				var nameLabel = Ti.UI.createLabel({
    					text: notification.username,
    					font:{
							fontSize: "18dp",
							fontWeight: "bold",
							fontFamily: "Helvetica Neue"
						},
						color: "#343434",
						height: "auto",
						width: "auto",
						textAlign: "left",
						left: 0,
						user_id: notification.user_id
    				});
    				
    				nameLabel.addEventListener("click", function(e){
    					Application.goToUser(e.source.user_id);
    				});
    				
    				if(notification.type == "Copy"){
    					var descriptionText = "copied your event"
    				}    				
    				else if(notification.type == "Like"){
    					var descriptionText = "liked your event"
    				}
    				else if(notification.type == "Follow"){
    					var descriptionText = "is now following you"
    				}
    				
    				var explanationLabel = Ti.UI.createLabel({
    					text: descriptionText,
    					font:{
							fontSize: "14dp",
							fontFamily: "Helvetica Neue"
						},
						color: "#666666",
						height: "auto",
						width: "auto",
						textAlign: "left",
						left: 0,
						top: 2
    				});
    				
    				verticalView.add(nameLabel);
    				verticalView.add(explanationLabel);
    				
    				if(notification.type == "Like" || notification.type == "Copy"){
    				
    					var eventImageHolder = Ti.UI.createView({
    						height: 45,
    						width: 45,
    						top: 7,
    						left: 10,
    						borderRadius: 5,
    						borderColor: "white",
    						borderWidth: 5
    					});
    				
    				eventImageHolder.addEventListener('postlayout', postLayoutCallback);
    				
    					var eventImage = Ti.UI.createImageView({
    						image: notification.event.image,
							height: 43,
    						width: 43,
    						defaultImage: "/images/default.jpg",
    						hires: true
    					});
    				
    				eventImageHolder.add(eventImage);
    				
    					eventImage.addEventListener("click", function(){
    						Application.goToAppEventExt(notification.event);
    					});
    				}
    				rowView.add(imageHolder);
    				rowView.add(verticalView);
    				
    				if(notification.type == "Like" || notification.type == "Copy"){
    					rowView.add(eventImageHolder);
    				}
    				
    				feedRow.add(rowView);
    			
    				rows.push(feedRow);

    				feedTable.appendRow(feedRow);
    			
    		}
    		    		    		
    		w.last_id = notifications[0].id;
    		
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
		id: Ti.App.Properties.getInt("user_id")
	});  // request is actualith this sttement

	
});

feedView.add(feedTable);

w.add(feedView);
w.add(Application.createPadding());

var postLayoutCallback  = function(e) {
	
		var view = e.source;
	
        view.removeEventListener('postlayout', postLayoutCallback);
        view.setShadow({
             shadowOffset:{x:0, y:2},
             shadowRadius:3,
             shadowOpacity:0.2
         });            
}
