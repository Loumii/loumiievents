var follow = {
	
	config:{
		w: Ti.UI.currentWindow,
		Application: require('ui/common/Application'),
		back: null,
		followTable: null,
		followView: null
	},
	
	init: function(){
		
		follow.config.back = follow.config.Application.createBackButton();
		follow.config.w.leftNavButton = follow.config.back;

		follow.config.back.removeEventListener("click", follow.config.Application.closeWindow);
		follow.config.back.addEventListener("click", follow.closeWindow);
		
		follow.createView();
		
		follow.config.w.add(follow.config.followView);
		
	},
	
	closeWindow: function(){
		
		follow.config.w.close();
		
	},
	
	createView: function(){
		
		follow.config.followView = Ti.UI.createView({
			layout: "vertical"
		})
		
		follow.config.followTable = Ti.UI.createTableView();
		
		follow.config.followView.add(follow.config.followTable);
		
		follow.getFollow();
		
	},
	
	getFollow: function(){
				
		var url = "http://www.loumii.com/" + follow.config.w.id + "/" + follow.config.w.type + ".json";
   		var xhr = Ti.Network.createHTTPClient({
    		onload: function(e) {
    		
    		var users = eval('('+this.responseText+')').users; 
    		     		    		
    		for(i =0;i<users.length;i++){
    			
    			var followRow = Ti.UI.createTableViewRow({
    				selectedBackgroundColor: "white",
    				touchEnabled: false
    			});
    			    			
    			var user = users[i];    			    			
    				
    				var rowView = Ti.UI.createView({
    					layout: "horizontal",
    					height: 60,
    					width: "100%"
    				});
    				 
    				var verticalView = Ti.UI.createView({
    					layout: "vertical",
    					height: 20,
    					width: 145,
    					left: 10,
    					top: 20
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
    				
    				imageHolder.addEventListener('postlayout', follow.postLayoutCallback);
    				    				
    				var userImage = Ti.UI.createImageView({
    					image: user.image,
    					height: 43,
    					width: 43,
    					defaultImage: "/images/default.jpg",
    					id: user.id,
    					hires: true
    				});
    				
    				imageHolder.add(userImage);
    				
    				var nameLabel = Ti.UI.createLabel({
    					text: user.name,
    					minimumFontSize: "16dp",
    					font:{
							fontSize: "18dp",
							fontWeight: "bold",
							fontFamily: "Helvetica Neue"
						},
						color: "#343434",
						height: 20,
						width: 145,
						textAlign: "left",
						left: 0,
						id: user.id
    				});
    				 
    				userImage.addEventListener("click", follow.visitUser); 
    				nameLabel.addEventListener("click", follow.visitUser);
    				
    				verticalView.add(nameLabel);
    				
    				rowView.add(imageHolder);
    				rowView.add(verticalView);
    				
    				if(user.id != Ti.App.Properties.getInt('user_id')){
    				    				
    					var following = user.following;
    					var buttonText = following ? "Following" : "Follow";
    				
    					var followButton = Ti.UI.createLabel({
							height: 30,
							width: 90,
							top: 15,
							left: 10,
							text: buttonText,
							borderRadius: 4,
							backgroundColor: "#cb3d29",
							backgroundGradient:
							{
								type:'linear',
								colors:['#d25340','#cb3d29'],
								startPoint:{x:0,y:0},
								endPoint:{x:0,y:30},
								backFillStart:false
							},
							color: "white",
							font:{
								fontSize: 16,
								fontWeight: "bold",
								fontFamily: "Helvetica Neue",
							},
							textAlign: "center",
							shadowColor: "#b53527",
							borderColor: "#e05b48",
							follow: following,
							id: user.id
						});	
    				
    					followButton.addEventListener("click", follow.followUser);
    				
    					rowView.add(followButton);
    					
    				}
    				
    				followRow.add(rowView);

    				follow.config.followTable.appendRow(followRow);
    			
    		}
    		
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
			id: follow.config.w.id
		});
		
	},
	
	postLayoutCallback: function(e){
		
		var view = e.source;
	
    	view.removeEventListener('postlayout', follow.postLayoutCallback);
        view.setShadow({
             shadowOffset:{x:0, y:2},
             shadowRadius:3,
             shadowOpacity:0.2
         });
           
	},
	
	followUser: function(e){
	
		var followButton = e.source;
	
		var url = "http://loumii.com/users/" + followButton.id  + "/follow.json";
		var xhr = Ti.Network.createHTTPClient({
    		onload: function(e) {
    		    		
    		if(followButton.follow){    			
    			followButton.follow = false;
    			followButton.text = "Follow";	
    		}
    		else{
    			followButton.follow = true;
    			followButton.text = "Following";
    		}
    		
    		Ti.App.fireEvent("refresh_following");    		
    		
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
	},
	
	visitUser: function(e){
		
		follow.config.Application.goToUser(e.source.id);
		
	}
	
};

follow.init();