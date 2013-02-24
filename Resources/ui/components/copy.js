var copy = {
	
	config:{
		w: Ti.UI.currentWindow,
		Application: require('/ui/common/Application'),
		data: null,
		selectionView: null,
		chooseRow: null,
		addButton: null,
		events: null,
		twitterSwitch: null,
		facebookSwitch: null,
		eventsChecked: false
	},
	
	init: function(){
		
		var back = copy.config.Application.createNavButton("Cancel");
		
		copy.config.addButton = copy.config.Application.createNavButton("Add");
		
		copy.config.addButton.addEventListener("click", copy.copyComponent);
				
		back.addEventListener("click", function(){
			copy.config.w.close();
		});
		
		copy.config.w.leftNavButton = back;

		copy.config.data = copy.config.w.data;

		copy.createSelectionView();

		copy.createSelectionTable();		
		copy.createShareTable();
		
		copy.config.w.add(copy.config.selectionView);
		
	},
	
	createSelectionView: function(){
		
		copy.config.selectionView = Ti.UI.createView({
			layout: "vertical"
		});
		
	},
	
	createSelectionTable: function(){
		
		var selectionTable = Ti.UI.createTableView({
			top: 20,
			scrollable: false,
			width: 280,
			left: 20,
			height: 120,
			borderRadius: 5,
			footerTitle: "",
			borderColor: "#999"
		});
		
		var componentRow = Ti.UI.createTableViewRow({
			height: 60,
			selectedBackgroundColor: "#white",
			selectedColor: "black"
		});

		var componentRowView = Ti.UI.createView({
			layout: "horizontal",
			height: 60
		});

		var componentTitle = Ti.UI.createLabel({
			minimumFontSize: 16,
			font:{
				fontWeight: "bold",
				fontSize: 18,
				fontFamily: "Helvetica Neue"
			},
			wordWrap: false,
			ellipsize: true,
			color: "black",
			left: 15,
			top: 20,
			height: 18,
			text: copy.config.data.name
		});

		var photoHolder = Ti.UI.createView({
   			borderWidth: 5,
			borderColor: "white",
			width: 40,
			height: 40,
			top: 10,
			left: 10
		});

		photoHolder.addEventListener('postlayout', copy.postLayoutCallback);

		var photo = Ti.UI.createImageView({
			image: copy.config.data.image,
			width: 40,
			height: 40 
		});

		photoHolder.add(photo);
		
		componentRowView.add(photoHolder);
		componentRowView.add(componentTitle);
		
		componentRow.add(componentRowView);

		selectionTable.appendRow(componentRow);
		
		copy.config.chooseRow = Ti.UI.createTableViewRow({
			title: "Choose an event",
			height: 60,
			id: null,
			rightImage: "/images/right-arrow.png",
			selectedBackgroundColor: "#fff",
			selectedColor: "black",
			font:{
				fontWeight: "bold",
				fontSize: 20,
				fontFamily: "Helvetica Neue"
			}
		});
				
		selectionTable.appendRow(copy.config.chooseRow);
		
		copy.config.chooseRow.addEventListener("click", copy.chooseEvent);
		
		copy.config.selectionView.add(selectionTable);
		
	},
	
	createShareTable: function(){
		
		var shareLabel = Ti.UI.createLabel({
			text: "Share on",
			font:{
				fontSize: 18,
				fontWeight: "bold",
				fontFamily: "Helvetica Neue"
			},
			left: 20,
			top: 20,
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
				fontSize: 20,
				fontFamily: "Helvetica Neue"
			},
			color: "black",
			left: 10,
			top: 20,
			width: 100,
			text: "Twitter"
		});
		
		copy.config.twitterSwitch = Ti.UI.createSwitch({
			value: true,
			left: 80,
			top: 20
		});
		
		twitterRowView.add(twitterTitle);
		twitterRowView.add(copy.config.twitterSwitch);
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
				fontSize: 20,
				fontFamily: "Helvetica Neue"
			},
			color: "black",
			left: 10,
			top: 20,
			width: 100,
			text: "Facebook"
		});
		
		copy.config.facebookSwitch = Ti.UI.createSwitch({
			value: true,
			left: 80,
			top: 20
		});
		
		facebookRowView.add(facebookTitle);
		facebookRowView.add(copy.config.facebookSwitch);
		facebookRow.add(facebookRowView);
		
		shareTable.appendRow(facebookRow);
		
		copy.config.selectionView.add(shareLabel);
		copy.config.selectionView.add(shareTable);
		
	},
	
	postLayoutCallback: function(e){
		
		var view = e.source;
        
        view.setShadow({
             shadowOffset:{x:0, y:2},
             shadowRadius:3,
             shadowOpacity:0.2
         });
         
	},
	
	chooseEvent: function(){
		
		var chooseWindow = Ti.UI.createWindow({
			title: "My events",
			url: "/ui/events/choose.js",
			backButtonTitle: "",
			barImage: "/images/barImage.png"
		});
	
		chooseWindow.setTitleControl(copy.config.Application.createTitle("My events"));
		
		chooseWindow.addEventListener("saveEvents", function(data){
			copy.saveEventData(data);
		});
		
		chooseWindow.addEventListener("selectEvent", function(data){
			copy.selectEvent(data);
		});
		
		chooseWindow.eventsChecked = copy.config.eventsChecked; 
		chooseWindow.events = copy.config.events;
		
		Ti.UI.currentTab.open(chooseWindow, {animated: true});	
		
	},
	
	saveEventData: function(data){
		
		copy.config.eventsChecked = data.eventsChecked;
		copy.config.events = data.events;
		
	},
	
	selectEvent: function(data){
				
		copy.config.chooseRow.title = data.title;
		copy.config.chooseRow.id = data.id;
		
		copy.config.w.rightNavButton = copy.config.addButton;
		
	},
	
	copyComponent: function(){
		
		var url = "http://www.loumii.com/items/" + copy.config.data.id  +"/copy.json";
		var xhr = Ti.Network.createHTTPClient({
    		onload: function(e) {
				copy.config.w.fireEvent("next", {event: {id: copy.config.chooseRow.id, title: copy.config.chooseRow.title}});        						
    		},
    		onerror: function() {
        		alert('Cannot connect to server');
    		},
    		timeout:30000
		});
		xhr.setRequestHeader("Content-Type","application/json");
		xhr.open("POST", url);
		xhr.send({
			event_id: copy.config.chooseRow.id,
			fb: copy.config.facebookSwitch.value,
			twitter: copy.config.twitterSwitch.value
		});

		
	}
	
}

copy.init();
