var show_event = {
	
	config:{
		w: Ti.UI.currentWindow,
		PagingControl: require('ui/common/PagingControl'),
		Application: require('/ui/common/Application'),
		componentViews: [],
		eventView: null,
		detailsView: null,
		scrollableFood: null,
		scrollableDrink: null,
		scrollableStyling: null,
		cardView: null,
		create: null,
		remove: false,
		currentUser: false
	},
	
	init: function(){
		
		show_event.config.create = show_event.config.Application.createNavButton("Create");
		
		show_event.config.create.addEventListener("click", show_event.newComponent);
		
		var back = show_event.config.Application.createBackButton();
		
		back.removeEventListener("click", show_event.config.Application.closeWindow);
		
		back.addEventListener("click", function(){
			show_event.config.w.close();
		});
		
		show_event.config.w.leftNavButton = back;
		
		show_event.config.eventView = Ti.UI.createView({
			layout: 'vertical',
			height: Ti.UI.SIZE,
			width: Ti.UI.SIZE,
			top: 0
		});	
				
		show_event.createTabbedBar();
		show_event.createComponentViews();
		
		show_event.config.w.add(show_event.config.eventView);
		
		show_event.config.w.addEventListener("blur", function(){
			show_event.config.w.fireEvent("refresh", {event: show_event.config.w.event, remove: show_event.config.remove});	
		});
		
	},
	
	newComponent: function(){
	
		var type = show_event.config.w.selected_type;
	
		var newComponent = Titanium.UI.createWindow({
			title: "Add " + type,
  			url:'../components/new.js',
  			barImage: "/images/barImage.png",
  			backButtonTitle: ''
		});
	
		newComponent.setTitleControl(show_event.config.Application.createTitle("Add " + type));
	
		Ti.UI.currentTab.open(newComponent, {animated: true});
	
		newComponent.id = show_event.config.w.id;
		newComponent.type = type.toLowerCase();
	},
	
	createComponentViews: function(){
		
		for(i=0;i<5;i++){
	
			var view = Ti.UI.createScrollView({
        		left:0,right:0,
        		top:0,bottom:0,
        		contentHeight:"auto",
    			contentWidth:'auto',
        		showVerticalScrollIndicator:true,
        		layout: 'vertical'
    		});

			show_event.config.componentViews.push(view);
	
		}

		show_event.config.detailsView = show_event.config.componentViews[0];
		
		show_event.getEventDetails();
		
	},
	
	createTabbedBar: function(){
		
		var tabbedBar = Ti.UI.createView({
			height: 45,
			backgroundImage: "/images/tabbed.jpg",
			backgroundRepeat: true,
			top: 0
		});

		var tabbedBarBorder = Ti.UI.createView({
			bottom: 0,
			height: 1,
			borderWidth: 1,
			borderColor: "#999"
		});

		tabbedBar.add(tabbedBarBorder);

		var tabbedBarInner = Ti.UI.createView({
			width: 260,
			height: 45,
			top: 0,
			layout: "horizontal"
		});

		var detailIcon = Ti.UI.createImageView({
			image: "/images/details_selected.png",
			height: 24,
			width: 24,
			top: 11,
			index: 0,
			initialImage: "/images/details.png",
			selectedImage: "/images/details_selected.png" 
		});

		var foodIcon = Ti.UI.createImageView({
			image: "/images/food.png",
			height: 24,
			width: 24,
			top: 11,
			index: 1,
			left: 55,
			initialImage: "/images/food.png",
			selectedImage: "/images/food_selected.png",
			type: "Food"
		});

		var drinkIcon = Ti.UI.createImageView({
			image: "/images/drink.png",
			height: 24,
			width: 24,
			top: 11,
			index: 2,
			left: 53,
			initialImage: "/images/drink.png",
			selectedImage: "/images/drink_selected.png",
			type: "Drink" 
		});

		var stylingIcon = Ti.UI.createImageView({
			image: "/images/styling.png",
			height: 24,
			width: 24,
			left: 45,
			top: 11,
			index: 3,
			initialImage: "/images/styling.png",
			selectedImage: "/images/styling_selected.png",
			type: "Styling"
		}); 

		tabbedBarInner.add(detailIcon);
		tabbedBarInner.add(foodIcon);
		tabbedBarInner.add(drinkIcon);
		tabbedBarInner.add(stylingIcon);

		tabbedBar.add(tabbedBarInner);

		show_event.config.eventView.add(tabbedBar);
		
		tabbedBarInner.addEventListener('click', show_event.selectTab);
		
	},
	
	selectTab: function(e){
		
		var tabbedBarInner = e.source.parent;
		
		if(e.source.index != null){
	
		for(i=0;i<show_event.config.componentViews.length;i++){
			if(i !== e.source.index){
				show_event.config.componentViews[i].height = 0;
				show_event.config.componentViews[i].hide(); 
			}
		}
	
		if(e.source.index > 0){
			if(show_event.config.currentUser){
				show_event.config.w.rightNavButton = show_event.config.create;
			}
			show_event.config.w.selected_type = tabbedBarInner.children[e.source.index].type;
		}
		else{
			show_event.config.w.rightNavButton = null;
		}
		
		for(i=0;i< tabbedBarInner.children.length;i++){
			tabbedBarInner.children[i].image = tabbedBarInner.children[i].initialImage; 
		}
		
		tabbedBarInner.children[e.source.index].image = tabbedBarInner.children[e.source.index].selectedImage; 
		
		show_event.config.componentViews[e.source.index].show();
		show_event.config.componentViews[e.source.index].height = "auto";
	
		
		}
		
	},
	
	getEventDetails: function(){
		
	var url = "http://www.loumii.com/app_events/" + show_event.config.w.id + ".json";
	var xhr = Ti.Network.createHTTPClient({
    	onload: function(e) {
                
        	var event = eval('('+this.responseText+')');
		
			show_event.config.w.event = event;
		
			show_event.config.currentUser = (event.user_id == Ti.App.Properties.getInt('user_id'));
		
			var liked = false;
			
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
		
			var detailsHolder = Ti.UI.createScrollView({
        		left:0,right:0,
        		top:0,bottom:0,
        		contentHeight:"auto",
    			contentWidth:'auto',
        		showVerticalScrollIndicator:true,
        		layout: 'vertical'
			});
		
			var otherView = Ti.UI.createView({
				height: 260,
				width: 260
			});
		
			var cardView = Ti.UI.createView({
				width: 260,
				height: 260,
				top: 15,
				backgroundColor: "white",
				borderColor: "white",
				borderWidth: 10

			});
			
			var cardBack = Ti.UI.createView({
				width: 260,
				height: 260,
				backgroundColor: "white",
				borderColor: "white",
				borderWidth: 10
			});
			
			var cardFront = Ti.UI.createView({
				width: 260,
				height: 260,
				backgroundColor: "white",
				borderColor: "white",
				borderWidth: 10
			});
			
			var name = Ti.UI.createLabel({
				text: event.title,
				font:{
					fontWeight: "bold",
					fontSize: 22
				},
				textAlign: "center",
				top: 80,
				width: 250
			});
							
			var date = Ti.UI.createLabel({
				text: event.date,
				font:{
					fontWeight: "bold",
					fontSize: "18dp"
				},
				top: 120
			});
			
			var type = Ti.UI.createLabel({
				text: event.type,
				font:{
					fontWeight: "bold",
					fontSize: "18dp"
				},
				top: 150
			});
						
			var eventImage = show_event.config.Application.crImageView(event.image, {
				height: 260, 
				width: 260, 
				title: event.title, 
				id: event.id,
				rotation: true,
				hires: true
			});
			
			cardFront.add(eventImage);
											
			cardBack.add(name);	
			cardBack.add(date);
			cardBack.add(type);
			
			if(show_event.config.currentUser){
				
				var buttons = Ti.UI.createView({
					top: 10,
					height: 31,
					left: 10
				});
			
				var deleteButton = Ti.UI.createImageView({
					height: 31,
					width: 31,
					left: 0,
					data: event,
					image: "/images/delete.png"
				});
			
				var editButton = Ti.UI.createImageView({
					height: 31,
					width: 28,
					left: 0,
					data: event,
					image: "/images/edit.png",
					left: 41
				});
				
				buttons.add(deleteButton);
				buttons.add(editButton);
			
				deleteButton.addEventListener("click", show_event.deleteEvent);
				editButton.addEventListener("click", show_event.editEvent);
				
				cardBack.add(buttons);
				
			};
			
			cardView.add(cardBack);
			cardView.add(cardFront);
						
			otherView.add(cardView);
			
			cardView.addEventListener("refresh", function(e){
				
				var event = e.event;
				
				show_event.config.w.event = event;
				
				editButton.data = event;
				deleteButton.data = event;
				
				name.text = event.title;
				date.text = event.date;
				type.text = event.type;
				
				eventName.text = event.title;
				
				cardFront.remove(eventImage);
				
				eventImage = show_event.config.Application.crImageView(event.image, {
					height: 260, 
					width: 260, 
					title: event.title, 
					id: event.id,
					rotation: true
				});
				
				cardFront.add(eventImage);
				
				show_event.config.w.setTitleControl(show_event.config.Application.createTitle(event.title));
				
			});
			
			show_event.config.cardView = cardView;
			
			var statsView = Ti.UI.createView({
				width: 260,
				height: 50,
				backgroundColor: "white"
			});
			
			var userImage = Ti.UI.createImageView({
				image: event.user_image,
				height: 40,
				width: 40,
				top: 5,
				left: 10,
				hires: true,
				defaultImage: "/images/default.jpg"
			});
			
			userImage.addEventListener("click", function(){
				show_event.config.Application.goToUser(event.user_id);
			});
			
			var userInformation = Ti.UI.createView({
				height: 50,
				width: 120,
				top: 7,
				left: 60
			});
			
			var userName = Ti.UI.createLabel({
				text: event.username,
				minimumFontSize: "11dp",
				font:{
					fontSize: "13dp",
					fontWeight: "bold"
				},
				color: "#343434",
				height: "auto",
				textAlign: "left",
				left: 0,
				width: 100
			});
			
			var eventName = Ti.UI.createLabel({
				text: event.title,
				minimumFontSize: "11dp",
				font:{
					fontSize: "13dp"
				},
				color: "#666666",
				height: "auto",
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
			
			var addImage = Ti.UI.createImageView({
				image: '/images/add.png',
				width: 20,
				top: 7,
				left: 232
			});
			
			if(!show_event.config.currentUser){
			
				var likeImage = Ti.UI.createImageView({
					image: liked ? '/images/liked.png' : '/images/like.png',
					width: 20,
					top: 10,
					left: 197,
					event: event,
					event_id: event.id
				});
				
				if(liked){
					likeImage.addEventListener("click", show_event.config.Application.unlikeEvent);
				}
				else{
					likeImage.addEventListener("click", show_event.config.Application.likeEvent);
				}
					
				statsView.add(likeImage);
			}
			
			statsView.add(addImage);
			
			var socialButtons = Ti.UI.createView({
				top: 5,
				width: 260
			});
			
			var facebook = Ti.UI.createImageView({
				height: 24,
				width: 12,
				image: "/images/facebook.png",
				left: 200,
				top: 0
			});
			
			var twitter = Ti.UI.createImageView({
				height: 22,
				width: 15,
				image: "/images/twitter.png",
				left: 237,
				top: 2
			});
			
			socialButtons.add(facebook);
			socialButtons.add(twitter);
			
			detailsHolder.add(otherView);
			detailsHolder.add(statsView);
			detailsHolder.add(show_event.config.Application.createShadow());
			detailsHolder.add(socialButtons);
			detailsHolder.add(show_event.config.Application.createPadding());
		
			setTimeout(function(){				
				show_event.config.detailsView.add(detailsHolder);
				var nameHeight = name.toImage().height;
				date.top = nameHeight + name.top + 10;
				type.top = nameHeight + name.top + 40;
			}, 50);
														 	
		 	addImage.addEventListener("click", show_event.copyEvent);
		 	
		 	show_event.config.eventView.add(show_event.config.detailsView);	
			show_event.createScrollable();

		    
    },
    onerror: function() {
		// this function is called when an error occurs, including a timeout
        alert('Cannot connect to server');
    },
    timeout:30000 
	});
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.open("GET", url);
	xhr.send();  // request is actualith this sttement
		
	},
	
	createScrollable: function(){
		
		var scrollableFood = Ti.UI.createScrollableView({
			views: [],
    		showPagingControl: false,
    		type: "food",
    		height: 260,
    		index: 1
		});
				
		var scrollableDrink = Ti.UI.createScrollableView({
			views: [],
    		showPagingControl: false,
    		type: "drink",
    		height: 260,
    		index: 2
		});
		
		var scrollableStyling = Ti.UI.createScrollableView({
			views: [],
   			showPagingControl: false,
   			type: "styling",
   			height: 260,
   			index: 3
		});

		var views = [];

		var url = "http://www.loumii.com/event_components/" + show_event.config.w.id + ".json";
		var xhr = Ti.Network.createHTTPClient({
    		onload: function(e) {
        
        	var items = eval('('+this.responseText+')').items;
				
			var foodViews = [];
			var drinkViews = [];
			var stylingViews = [];
				
			for(i=0;i<items.length;i++){
					
				cardView = show_event.createComponent(items[i]);
										
				switch(items[i].type){
					case 'food':
						foodViews.push(cardView);
					break;
					case 'drink':
						drinkViews.push(cardView);
					break;
					case 'styling':
						stylingViews.push(cardView);
					break;
				}
			
				cardView = null;
						
			}	
				
			scrollableFood.views = foodViews;
			scrollableDrink.views = drinkViews;
			scrollableStyling.views = stylingViews;	
		
			foodViews = null;
			drinkViews = null;
			stylingViews = null;
			items =  null;
		
			show_event.config.scrollableFood = scrollableFood;
			show_event.config.scrollableDrink = scrollableDrink;
			show_event.config.scrollableStyling = scrollableStyling;
			
			show_event.newScrollable(show_event.config.scrollableFood, 1);
			show_event.newScrollable(show_event.config.scrollableDrink, 2);
			show_event.newScrollable(show_event.config.scrollableStyling, 3);
				    
    	},
    	onerror: function() {
        	alert('Cannot connect to server');
    	},
    	timeout:30000
	});
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.open("GET", url);
	xhr.send();

	for(i=1;i<show_event.config.componentViews.length;i++){
		show_event.config.eventView.add(show_event.config.componentViews[i]);
		show_event.config.componentViews[i].hide();
	}
		
	},
	
	newScrollable: function(scrollable, index){	
			
			setTimeout(function(){
			
				if(scrollable.views.length > 0){
			
					show_event.config.componentViews[index].add(scrollable);
			
					var userImage = Ti.UI.createImageView({
						image: show_event.config.w.event.user_image || "/images/default.jpg",
						height: 40,
						width: 40,
						top: 5,
						left: 10,
						hires: true,
						defaultImage: "/images/default.jpg"
					});
			
					userImage.addEventListener("click", function(){
						show_event.config.Application.goToUser(show_event.config.w.event.user_id);
					});
			
					var userInformation = Ti.UI.createView({
						layout: "vertical",
						height: 50,
						width: 160,
						top: 7,
						left: 10
					});
			
					var userName = Ti.UI.createLabel({
						text: show_event.config.w.event.username,
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
						text: scrollable.views[0].name,
						minimumFontSize: "11dp",
						font:{
							fontSize: "13dp"
						},
						color: "#666666",
						height: "auto",
						textAlign: "left",
						left: 0,
						width: 160,
						height: 20,
						top: 0
					});
			
					userInformation.add(userName);
					userInformation.add(eventName);
						
					var addImage = Ti.UI.createImageView({
						image: '/images/add.png',
						width: 20,
						top: 8,
						left: 10,
						data: scrollable.views[0].data
					});
			
					addImage.addEventListener("click", show_event.copyComponent);
			
					var statsView = Ti.UI.createView({
						width: 260,
						height: 50,
						layout: "horizontal",
						backgroundColor: "white",
						eventName: eventName
					});
			
					statsView.add(userImage);
					statsView.add(userInformation);			
					statsView.add(addImage);
				
				if(show_event.config.componentViews[index].children){
					show_event.config.componentViews[index].add(statsView);
					show_event.config.componentViews[index].add(show_event.config.Application.createShadow());
				}
	
				scrollable.addEventListener("scroll", function(event){
					eventName.text = event.view.name;
					addImage.data = event.view.data;				
				});
		
				scrollable.addEventListener("refresh", function(){
					eventName.text = scrollable.views[scrollable.getCurrentPage()].name;
					 addImage.data = scrollable.views[scrollable.getCurrentPage()].data;
				});
		
				scrollable.currentPage = 0;
				
				var socialSection = Ti.UI.createView({
					width: 260,
					top: 5,
					layout: "horizontal"
				});
				
				var facebook = Ti.UI.createImageView({
					height: 24,
					width: 12,
					image: "/images/facebook.png",
					left: 0,
					top: 0
				});
			
				var twitter = Ti.UI.createImageView({
					height: 22,
					width: 15,
					image: "/images/twitter.png",
					left: 20,
					top: 2
				});
				
				var scrollableHolder = Ti.UI.createView({
					width: 200
				});
						
				var scrollablePagingControl = new show_event.config.PagingControl(scrollable, {top: 9, first: true});
																	
				scrollableHolder.add(scrollablePagingControl);
				
				socialSection.add(scrollableHolder);
				socialSection.add(facebook);
				socialSection.add(twitter);
		
				show_event.config.componentViews[index].add(socialSection);
				show_event.config.componentViews[index].add(show_event.config.Application.createPadding());
				
			}
		
		}, 100);
		
	},
	
	createComponent: function(component, index){
	
			var component = component;
	
			var cardView = Ti.UI.createView({
				width: 260,
				height: 260,
				top: 15,
				borderColor: "#fefefe",
				borderWidth: 10,
				name: component.name,
				type: component.type,
				id: component.id,
				data: component
			});
						
			var cardBack = Ti.UI.createView({
				width: 260,
				height: 260,
				backgroundColor: "#fefefe",
				borderColor: "fefefe",
				borderWidth: 10
			});
			
			var myImage = show_event.config.Application.crImageView(component.image, {height: 260, width: 260, title: component.name, id: component.id, rotation: true, hires: true})
			
			var cardFront = Ti.UI.createView({
				width: 260,
				height: 260,
				backgroundColor: "#fefefe",
				borderColor: "fefefe",
				borderWidth: 10
			});
			
			var suppliesButton = Ti.UI.createButton({
				title: "What you'll need",
				top: 80,
				width: 240,
				height: 50,
				font:{
					fontWeight: "bold",
					fontSize: "18dp"
				},
				borderColor: "#999",
				borderWidth: 1,
				color: "#888",
				selectedColor: "#666",
				textAlign: "center",
				style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
			});
			
			suppliesButton.addEventListener("click", function(){
				show_event.showSupplies(component.supplies)
			});
			
			var howButton = Ti.UI.createButton({
				title: "How to do it",
				top: 140,
				width: 240,
				height: 50,
				font:{
					fontWeight: "bold",
					fontSize: "18dp"
				},
				borderColor: "#999",
				borderWidth: 1,
				color: "#888",
				selectedColor: "#666",
				textAlign: "center",
				style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
			});
			
			howButton.addEventListener("click", function(){
				show_event.showHow(component.steps);
			});

			if(show_event.config.currentUser){

				var buttons = Ti.UI.createView({
					top: 10,
					left: 10,
					height: 31
				});
			
				var deleteButton = Ti.UI.createImageView({
					height: 31,
					width: 31,
					left: 0,
					data: component,
					image: "/images/delete.png"
				});
			
				var editButton = Ti.UI.createImageView({
					height: 31,
					width: 28,
					left: 0,
					data: component,
					image: "/images/edit.png",
					left: 41
				});
			
				buttons.add(deleteButton);
				buttons.add(editButton);
			
				deleteButton.addEventListener("click", show_event.deleteComponent);
				
				editButton.addEventListener("click", function(e){
					show_event.editComponent(e, cardView);
				});
				
				cardBack.add(buttons);
				
			}
			
			cardBack.add(suppliesButton);	
			cardBack.add(howButton);
						
			cardFront.add(myImage);			
						
			cardView.add(cardBack);
			cardView.add(cardFront);
			
			cardView.addEventListener("refresh", function(data){
				component = data.component;
				editButton.data = component;
				deleteButton.data = component;
				cardView.name = component.name;
				myImage.image = component.image;
			});
							
			return cardView;
	},
	
	createRotationLabel: function(view){
						
		var flipBack = Ti.UI.createImageView({
			image: "/images/info.png",
			top: 10,
			right: 10,
			width: 29,
			height: 29,
			zIndex: 2
		});
			
		var flipForward = Ti.UI.createImageView({
			image: "/images/info.png",
			top: 10,
			right: 10,
			width: 29,
			height: 29,
			zIndex: 2
		});

		view.children[0].add(flipForward);
		view.children[1].add(flipBack);

		flipBack.addEventListener("click", function(e){
			cardView = e.source.parent.parent;
			cardView.animate({view: cardView.children[0], transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT, duration: 500});
		});
			
		flipForward.addEventListener("click", function(e){
			cardView = e.source.parent.parent;
			cardView.animate({view: cardView.children[1], transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT, duration: 500});
		});
	
	},
	
	deleteEvent: function(e){
		
		var alertDialog = Titanium.UI.createAlertDialog({
    		title: 'Delete Event',
    		message: 'Are you sure you want to delete this event?',
    		buttonNames: ['OK','Cancel']
		});
		
		alertDialog.show();

		alertDialog.addEventListener("click", function(e){
			
			if(e.index == 0){
				show_event.removeEvent();
			}
			
		});
		
	},
	
	removeEvent: function(){
		
		var url = "http://www.loumii.com/app_events/" + show_event.config.w.id + "/destroy.json";
   		var xhr = Ti.Network.createHTTPClient({
    		onload: function(e) {
    			show_event.config.remove = true;   
        		
        		if(Ti.App.properties.getString("user_details")){
    				var user = JSON.parse(Ti.App.properties.getString("user_details"));
    				
    				for(i=0;i<user.events.length;i++){
    					if(user.events[i].id == show_event.config.w.id){
    						user.events.splice(i, 1);
    						break;
    					}
    				}
    				
					Ti.App.properties.setString("user_details", JSON.stringify(user));
					Ti.App.fireEvent("refresh_profile", {refresh_type: "Events", events: user.events});
    			}
        		
        		show_event.config.w.close();
        		 
    		},
    		onerror: function() {
				// this function is called when an error occurs, including a timeout
        		alert('Cannot connect to server');
    		},
    		timeout:30000  
		});
		xhr.setRequestHeader("Content-Type","application/json");
		xhr.open("POST", url);
		xhr.send();  // request is actualith this sttement	

	},
	
	editEvent: function(e){
	
		var title = "Edit " + e.source.data.title;
	
		updateEvent = Ti.UI.createWindow({
			title: "Edit " + e.source.data.title,
			url: "/ui/events/edit.js",
			barImage: "/images/barImage.png",
			backButtonTitle: ''
		});
	
		updateEvent.setTitleControl(show_event.config.Application.createTitle(title));
	
		updateEvent.data = e.source.data;
		Ti.UI.currentTab.open(updateEvent, {animated: true});
		
		updateEvent.addEventListener("update", function(e){
			show_event.config.cardView.fireEvent("refresh", e);
		});
		
	},
	
	editComponent: function(e, cardView){
	
		var title = "Edit " + e.source.data.name;
	
		updateComponent = Ti.UI.createWindow({
			title: "Edit " + title,
			url: "/ui/components/edit.js",
			barImage: "/images/barImage.png",
			backButtonTitle: ''
		});
	
		updateComponent.setTitleControl(show_event.config.Application.createTitle(title));
	
		updateComponent.data = e.source.data;
		
		updateComponent.addEventListener("refresh", function(data){
			cardView.fireEvent("refresh", {component: data.component});
		});
		
		Ti.UI.currentTab.open(updateComponent, {animated: true});
	},
	
	likeEvent: function(e){
	
		var image = e.source;
	
		var url = "http://www.loumii.com/app_events/" + show_event.config.w.id + "/like.json";
   		var xhr = Ti.Network.createHTTPClient({
    		onload: function(e) {
    			image.image = "/images/liked.png"			   
    		},
    		onerror: function() {
        		alert('Cannot connect to server');
    		},
    		timeout:30000 
		});
		xhr.setRequestHeader("Content-Type","application/json");
		xhr.open("POST", url);
		xhr.send({
			user_id: Ti.App.Properties.getInt("user_id")
		});
				
	},
	
	copyEvent: function(){
	
		var url = "http://www.loumii.com/app_events/" + show_event.config.w.id + "/copy.json";
   		var xhr = Ti.Network.createHTTPClient({
    		onload: function(data) {
    			var event = eval('('+this.responseText+')');
    			show_event.config.Application.goToAppEventExt(event);		   
    		},
    		onerror: function() {
        		alert('Cannot connect to server');
    		},
    		timeout:30000  
		});
		xhr.setRequestHeader("Content-Type","application/json");
		xhr.open("POST", url);
		xhr.send({
			user_id: Ti.App.Properties.getInt("user_id")
		});
				
	},
	
	copyComponent: function(e){
		
		var component = e.source.data;
		
		var copyWindow = Ti.UI.createWindow({
			title: "Copy",
			url: "/ui/components/copy.js",
			backButtonTitle: "",
			barImage: "/images/barImage.png"
		});
	
		copyWindow.setTitleControl(show_event.config.Application.createTitle("Copy"));
	
		copyWindow.data = component;
	
		copyWindow.addEventListener("next", function(data){
			show_event.config.Application.goToAppEventExt(data.event);
			copyWindow.close();
		});
	
		Ti.UI.currentTab.open(copyWindow, {animated: true});	

	},
	
	showSupplies: function(supplies){
		
		var suppliesWindow = Ti.UI.createWindow({
			title: "Supplies",
			url: "/ui/supplies/show.js",
			backButtonTitle: "",
			barImage: "/images/barImage.png"
		});
	
		suppliesWindow.setTitleControl(show_event.config.Application.createTitle("Supplies"));
	
		suppliesWindow.data = supplies;
		Ti.UI.currentTab.open(suppliesWindow, {animated: true});	
	
	},
	
	showHow: function(steps){
		
		var howWindow = Ti.UI.createWindow({
			title: "How To",
			url: "/ui/how/show.js",
			backButtonTitle: "",
			barImage: "/images/barImage.png"
		});
	
		howWindow.setTitleControl(show_event.config.Application.createTitle("How To"));
	
		howWindow.data = steps;
		Ti.UI.currentTab.open(howWindow, {animated: true});	
	
	},
	
	refreshComponent: function(data){ 
      
		var url = "http://www.loumii.com/items/" + data.id + ".json";
   		var xhr = Ti.Network.createHTTPClient({
    	onload: function(e) {
        
        	var component= eval('('+this.responseText+')');
				
			var cardView = show_event.createComponent(component);
				
			switch(component.type){
				case 'food':
					show_event.config.scrollableFood.addView(cardView);
					if(show_event.config.scrollableFood.views.length -1 <= 0){
						show_event.newScrollable(show_event.config.scrollableFood, 1);
					}
					else{
						Ti.App.fireEvent('refreshPagination', {itemType: show_event.config.scrollableFood.type});
					}
				break;
				case 'drink':
					show_event.config.scrollableDrink.addView(cardView);
					if(show_event.config.scrollableDrink.views.length -1 <= 0){
						show_event.newScrollable(show_event.config.scrollableDrink, 2);
					}
					else{
						Ti.App.fireEvent('refreshPagination', {itemType: show_event.config.scrollableDrink.type});
					}
				break;
				case 'styling':
					show_event.config.scrollableStyling.addView(cardView);
					if(show_event.config.scrollableStyling.views.length -1 <= 0){
						show_event.newScrollable(show_event.config.scrollableStyling, 3);
					}
					else{
						Ti.App.fireEvent('refreshPagination', {itemType: show_event.config.scrollableStyling.type});
					}
				break;
			}
    	},
    	onerror: function() {
        	alert('Cannot connect to server');
    	},
    	timeout:30000 
	});
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.open("GET", url);
	xhr.send();  // request is actualith this sttement

	},
	
	deleteComponent: function(e){
		
		var component = e.source.parent.parent.parent;
		
		var alertDialog = Titanium.UI.createAlertDialog({
    		title: 'Delete Item',
    		message: 'Are you sure you want to delete this item?',
    		buttonNames: ['OK','Cancel']
		});
		
		alertDialog.show();

		alertDialog.addEventListener("click", function(e){
			
			if(e.index == 0){
				show_event.removeComponent(component);
			}
			
		});
		
	},
	
	removeComponent: function(component){
		
		switch(component.type){
			case 'food':
				show_event.removeScrollComponent(show_event.config.scrollableFood, component);
			break;
			case 'drink':
				show_event.removeScrollComponent(show_event.config.scrollableDrink, component);
			break;
			case 'styling':
				show_event.removeScrollComponent(show_event.config.scrollableStyling, component);
			break;
		}
		
	},
	
	removeScrollComponent: function(scrollable, component){
		
		var page = scrollable.currentPage;
		var lastPage = false;
		
		var url = "http://www.loumii.com/items/" + component.id + "/destroy.json";
   		var xhr = Ti.Network.createHTTPClient({
    		onload: function(e) {
    			
    			Ti.App.fireEvent('refreshPagination', {
					itemType: scrollable.type,
					destroy: true,
					page: page
				});
				
				scrollable.removeView(component);
								
				if(scrollable.views.length == 0){
					
					var componentView = show_event.config.componentViews[scrollable.index];
					
					setTimeout(function(){
					
						for(i=0;i<componentView.children.length;i++){
							componentView.remove(componentView.children[i]);
						}
						
						for(i=0;i<componentView.children.length;i++){
							componentView.remove(componentView.children[i]);
						}

						
					}, 200);
					
					lastPage = true;
				}
								
				if(!lastPage){
					scrollable.fireEvent("refresh");
				}
						   
    		},
    		onerror: function() {
        		alert('Cannot connect to server');
    		},
    		timeout:30000 
		});
		xhr.setRequestHeader("Content-Type","application/json");
		xhr.open("POST", url);
		xhr.send();
				
	}
		
}

show_event.init();

Ti.App.addEventListener('refreshComponent', function(data){
	show_event.refreshComponent(data);
});
