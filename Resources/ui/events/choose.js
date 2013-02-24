var choose = {
	
	config:{
		w: Ti.UI.currentWindow,
		Application: require('/ui/common/Application'),
		chooseView: null,
		events: null,
		eventsTable: null,
		eventsChecked: false
	},
	
	init: function(){
		
		var back = choose.config.Application.createNavButton("Cancel");
				
		back.addEventListener("click", function(){
			choose.config.w.close();
		});
		
		choose.config.w.leftNavButton = back;
		
		choose.config.events = choose.config.w.events;
		choose.config.eventsChecked = choose.config.w.eventsChecked;
		
		choose.createChooseView();
		choose.createAdd();
		choose.createEventsTable();
		
		choose.config.w.add(choose.config.chooseView);
		
		choose.config.w.addEventListener("close", choose.saveEvents);
		
	},
	
	createChooseView: function(){
		
		choose.config.chooseView = Ti.UI.createView();
		
	},
	
	createAdd: function(){
		
		var eventInput = Ti.UI.createTextField({
			color: "#666",
			hintText: "Event",
			font:{
				fontWeight: "bold",
				fontSize: 18,
				fontFamily: "Helvetica Neue"
			},
			backgroundColor: "white",
			borderColor: "#999999",
			width: 215,
			left: 10,
			height: 45,
			top: 10,
			paddingLeft: 5,
			paddingRight: 5,
			returnKeyType: Titanium.UI.RETURNKEY_DONE
		});

		eventInput.addEventListener("return", function(){
			choose.addNewEvent(eventInput);
		});

		var addButton = Ti.UI.createLabel({
			height: 45,
			width: 85,
			left: 225,
			top: 10,
			text: "Add",
			backgroundColor: "#cb3d29",
			backgroundGradient:{
				type:'linear',
				colors:['#d25340','#cb3d29'],
				startPoint:{x:0,y:0},
				endPoint:{x:0,y:30},
				backFillStart:false
			},
			color: "white",
			font:{
				fontSize: 18,
				fontWeight: "bold",
				fontFamily: "Helvetica Neue",
			},
			textAlign: "center",
			shadowColor: "#b53527",
			borderColor: "#e05b48"
		});
		
		addButton.addEventListener("click", function(){
			choose.addNewEvent(eventInput);
		});
		
		choose.config.chooseView.add(eventInput);
		choose.config.chooseView.add(addButton);
		
	},
	
	createEventsTable: function(){
		
		var eventsView = Ti.UI.createView({
			height: 415,
			top: 65,
			borderColor: "#999999",
			backgroundColor: "white"
		});
		
		var eventsTable = Ti.UI.createTableView({
			height: 415,
			borderColor: "#999999"
		});
		
		if(!choose.config.eventsChecked){
			
			var loader = Ti.UI.createActivityIndicator({
				style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
				top: 160
			});
		
			eventsView.add(loader);
		
			loader.show();
			
			var url = "http://www.loumii.com/items/" + Ti.App.Properties.getInt('user_id') +"/copy_show.json";
			var xhr = Ti.Network.createHTTPClient({
    			onload: function(e) {
        			
        			var events = eval('('+this.responseText+')').events;
        			
        			choose.config.events = events;
        			
					choose.config.eventsChecked = true;
										
					for(i=0;i<events.length;i++){
						
						var row = Ti.UI.createTableViewRow({
							title: events[i].title,
							id: events[i].id,
							selectedColor: "black",
							selectedBackgroundColor: "#f2f2f2"
						});
						
						row.addEventListener("click", choose.selectEvent);
						
						eventsTable.appendRow(row);
		
					}
					
					loader.hide();
					
					eventsView.add(eventsTable);
					
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
		else{
			
			for(i=0;i<choose.config.events.length;i++){
						
				var row = Ti.UI.createTableViewRow({
					title: choose.config.events[i].title,
					id: choose.config.events[i].id,
					selectedColor: "black",
					selectedBackgroundColor: "#f2f2f2"
				});
				
				row.addEventListener("click", choose.selectEvent);
						
				eventsTable.appendRow(row);
		
			}
			
			eventsView.add(eventsTable);
		}
		
		choose.config.eventsTable = eventsTable;
		
		choose.config.chooseView.add(eventsView);
		
	},
	
	addNewEvent: function(input){
		
		if(input.value){
			
			var url = "http://www.loumii.com/create_event.json";
			var xhr = Ti.Network.createHTTPClient({
    			onload: function(e) {
        			
        			var event = eval('('+this.responseText+')');
						
					var row = Ti.UI.createTableViewRow({
						title: event.title,
						id: event.id,
						selectedColor: "black",
						selectedBackgroundColor: "#f2f2f2"
					});
					
					row.addEventListener("click", choose.selectEvent);
						
					choose.config.eventsTable.appendRow(row);
					
					input.value = "";
					input.blur();
					
					choose.config.events.push(event);
					
    			},
    			onerror: function() {
        			alert('Cannot connect to server');
    			},
    			timeout:30000
				});
			xhr.setRequestHeader("Content-Type","application/json");
			xhr.open("GET", url);
			xhr.send({
				title: input.value,
				user_id: Ti.App.Properties.getInt('user_id')
			});
			
		}
		
	},
	
	saveEvents: function(){
		
		choose.config.w.fireEvent("saveEvents", {eventsChecked: choose.config.eventsChecked, events: choose.config.events});
		
	},
	
	selectEvent: function(e){
		
		choose.config.w.fireEvent("selectEvent", {title: e.source.title, id: e.source.id})
		
		choose.config.w.close();
		
	}
	
};

choose.init();
