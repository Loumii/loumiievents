var edit_event = {
	
	config:{
		w: Ti.UI.currentWindow,
		data: Ti.UI.currentWindow.data,
		Application: require('ui/common/Application'),
		editView: null,
		datePicker: null,
		typePicker: null,
		stylesPicker: null,
		dateLabel: null,
		typeLabel: null,
		nameLabel: null,
		stylesLabel: null,
		update: null,
		myDate: new Date(),
		slide_out: Titanium.UI.createAnimation({bottom:-251}), 
		slide_in:  Titanium.UI.createAnimation({bottom:0})
	},
	
	init: function(){

		var back = edit_event.config.Application.createBackButton();		
		edit_event.config.update = edit_event.config.Application.createNavButton("Update");
		
		edit_event.config.w.rightNavButton = edit_event.config.update;
		edit_event.config.w.leftNavButton = back;
		
		back.removeEventListener("click", edit_event.config.Application.closeWindow);
		
		edit_event.config.update.addEventListener("click", edit_event.updateEvent);
		
		back.addEventListener("click", function(){
			edit_event.config.w.close();
		});
		
		edit_event.config.editView = Ti.UI.createScrollView({
        	layout: 'vertical'
		});
		
		edit_event.createPhoto();
		edit_event.createInputs();
		edit_event.createPickers();
		
		edit_event.config.w.add(edit_event.config.editView);
						
	},
	
	createPhoto: function(){
		
		var dialog = edit_event.config.Application.createDialog();
				
		var photoHolder = Ti.UI.createView({
    		borderWidth: 5,
			borderColor: "white",
			width: 109,
			height: 109,
			top: 30,
			backgroundColor: "white"
		});

		var photo = Ti.UI.createImageView({
			image: edit_event.config.data.image,
			width: 109,
			height: 109,
			id: edit_event.config.data.id,
			type: "AppEvent",
			initialImage: edit_event.config.data.image,
			hires: true
		});

		var shadow = Ti.UI.createImageView({
			image: "/images/shadow2.png",
			height: 6,
			width: 109
		});

		photoHolder.add(photo);
		
		edit_event.config.editView.add(photoHolder);
		edit_event.config.editView.add(shadow);
		
		photo.addEventListener("click", function(e){
			edit_event.config.w.currentPhoto = e.source;
			dialog.show();
		});
		
		dialog.addEventListener("click", function(e){
		
			edit_event.config.Application.uploadImage(edit_event.config.w.currentPhoto, e, edit_event.disableUpdate, edit_event.enableUpdate, edit_event.resetImage);
		
		});
		
	},
	
	createInputs: function(){
		
		var rows = [];

		var drop_button =  Titanium.UI.createButton({
			height: 24,
			width: 24,
			backgroundImage: "/images/calendar.png",
			top: 11
		});


		var nameRow = Ti.UI.createTableViewRow({
			layout: "horizontal",
			height: 45,
			backgroundColor: "#fbfbfa",
			selectedBackgroundColor: "fbfbfa"
		});

		var nameInput = Ti.UI.createTextField({
			color: "#666",
			hintText: "Name",
			font:{
				fontWeight: "bold",
				fontSize: 18,
				fontFamily: "Helvetica Neue"
			},
			width: 280,
			top: 11,
			left: 10,
			value: edit_event.config.data.title || null
		});

		nameRow.add(nameInput);

		rows.push(nameRow);

		var dateRow = Ti.UI.createTableViewRow({
			layout: "horizontal",
			height: 45,
			backgroundColor: "#fbfbfa",
			selectedBackgroundColor: "fbfbfa"
		});

		var dateLabel = Ti.UI.createLabel({
			color: "#666",
			font:{
				fontWeight: "bold",
				fontSize: 18,
				fontFamily: "Helvetica Neue"
			},
			width: 236,
			top: 11,
			left: 10,
			text: edit_event.config.data.date
		});

		dateRow.add(dateLabel);
		dateRow.add(drop_button);

		rows.push(dateRow);

		var typeRow = Ti.UI.createTableViewRow({
			layout: "horizontal",
			height: 45,
			backgroundColor: "#fbfbfa",
			selectedBackgroundColor: "fbfbfa"
		});

		var typeLabel = Ti.UI.createLabel({
			color: edit_event.config.data.type ? "#666" : "#AAA",
			text: edit_event.config.data.type || "Type",
			font:{
				fontWeight: "bold",
				fontSize: 18,
				fontFamily: "Helvetica Neue"
			},
			width: 280,
			top: 11,
			left: 10
		});

		typeRow.add(typeLabel);

		rows.push(typeRow);

		var stylesRow = Ti.UI.createTableViewRow({
			layout: "horizontal",
			height: 45,
			backgroundColor: "#fbfbfa",
			selectedBackgroundColor: "fbfbfa"
		});

		var stylesLabel = Ti.UI.createLabel({
			color: edit_event.config.data.style ? "#666" : "#AAA",
			text: edit_event.config.data.style || "Style",
			font:{
				fontWeight: "bold",
				fontSize: 18,
				fontFamily: "Helvetica Neue"
			},
			width: 280,
			top: 11,
			left: 10
		});

		stylesRow.add(stylesLabel);

		//rows.push(stylesRow);

		//Height with type row = 180

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
		
		edit_event.config.editView.add(table);
		
		edit_event.config.dateLabel = dateLabel;
		edit_event.config.typeLabel = typeLabel;
		edit_event.config.stylesLabel = stylesLabel;
		edit_event.config.nameLabel = nameInput;
		
		drop_button.addEventListener("click", edit_event.showDatePicker)
		typeRow.addEventListener("click", edit_event.showTypePicker);
		stylesRow.addEventListener("click", edit_event.showStylesPicker);
				
	},
	
	createPickers: function(){
		
		edit_event.createDatePicker();
		edit_event.createTypePicker();
		edit_event.createStylesPicker();
		
		edit_event.config.datePicker.open();
		edit_event.config.typePicker.open();
		edit_event.config.stylesPicker.open();
		
		edit_event.config.datePicker.addEventListener("change", function(e){
			edit_event.selectDate(e)
		});
		
	},
	
	createDatePicker: function(){
		
		var	mydate = new Date();
		
		var picker_view = edit_event.createPicker();
		
		var dateArray = edit_event.config.data.date.split("/")
		
		edit_event.config.myDate = new Date(dateArray[2],dateArray[1],dateArray[0]);
		
		var picker = Titanium.UI.createPicker({
			top:43,
			type: Titanium.UI.PICKER_TYPE_DATE,
			minDate: new Date(mydate.getFullYear()-1, mydate.getMonth(), mydate.getDate()),
			value: edit_event.config.myDate
		});
		
		var done = edit_event.createDone();
		 
		var spacer =  edit_event.createSpacer();
 
 		var cancel =  edit_event.createCancel(picker_view);
 		 
		var toolbar =  Ti.UI.iOS.createToolbar({
			top:0,
			items:[cancel,spacer,done]
		});
		
		picker.selectionIndicator=true;
		
		picker_view.add(picker);
		picker_view.add(toolbar);
		
		edit_event.config.datePicker = picker_view;
		
		done.addEventListener("click", edit_event.changeDate);
				
	},
	
	createTypePicker: function(){
		
		var type_picker = Titanium.UI.createPicker({
			top:43
		});

		type_picker.selectionIndicator = true;

		var picker_data = edit_event.config.Application.getCategories();
		
		var picker_view = edit_event.createPicker();

		type_picker.add(picker_data);
		
		var done = edit_event.createDone();
		 
		var spacer =  edit_event.createSpacer();
 
 		var cancel =  edit_event.createCancel(picker_view);
 		 
		var toolbar =  Ti.UI.iOS.createToolbar({
			top:0,
			items:[cancel,spacer,done]
		});
		
		picker_view.add(type_picker);
		picker_view.add(toolbar);
		
		edit_event.config.typePicker = picker_view;
		
		done.addEventListener("click", edit_event.changeType);
		
	},
	
	createStylesPicker: function(){
		
		var styles_picker = Titanium.UI.createPicker({
			top:43
		});

		styles_picker.selectionIndicator = true;

		var picker_data = edit_event.config.Application.getStyles();
		
		var picker_view = edit_event.createPicker();

		styles_picker.add(picker_data);
		
		var done = edit_event.createDone();
		 
		var spacer =  edit_event.createSpacer();
 
 		var cancel =  edit_event.createCancel(picker_view);
 		 
		var toolbar =  Ti.UI.iOS.createToolbar({
			top:0,
			items:[cancel,spacer,done]
		});
		
		picker_view.add(styles_picker);
		picker_view.add(toolbar);
		
		edit_event.config.stylesPicker = picker_view;
		
		done.addEventListener("click", edit_event.changeStyles);
		
	},
	
	createPicker: function(){
		
		var picker = Titanium.UI.createWindow({
			height:251,
			bottom:-251,
			zIndex: 2
		});
		
		return picker;
		
	},
	
	createDone: function(){
		
		var done =  Titanium.UI.createButton({
			title:'Done',
			style:Titanium.UI.iPhone.SystemButtonStyle.DONE
		});
	
		return done;
		
	},
	
	createSpacer: function(){
		
		var spacer =  Titanium.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});	
		
		return spacer;
		
	},
	
	createCancel: function(picker){
		
		var cancel =  Titanium.UI.createButton({
			title:'Cancel',
			style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
		});
		
		cancel.addEventListener("click", function(){
			edit_event.closePicker(picker)
		});
		
		return cancel;
		
	},
	
	closePicker: function(picker){
	
		picker.animate(edit_event.config.slide_out);
		
	},
	
	showDatePicker: function(){
		
		edit_event.config.nameLabel.blur();
		edit_event.config.typePicker.animate(edit_event.config.slide_out);
		edit_event.config.stylesPicker.animate(edit_event.config.slide_out);
		edit_event.config.datePicker.animate(edit_event.config.slide_in);
		
	},
	
	showTypePicker: function(){
		
		edit_event.config.nameLabel.blur();
		edit_event.config.datePicker.animate(edit_event.config.slide_out);
		edit_event.config.stylesPicker.animate(edit_event.config.slide_out);		
		edit_event.config.typePicker.animate(edit_event.config.slide_in);
		
	},
	
	showStylesPicker: function(){
		
		edit_event.config.nameLabel.blur();
		edit_event.config.typePicker.animate(edit_event.config.slide_out);
		edit_event.config.datePicker.animate(edit_event.config.slide_out);
		edit_event.config.stylesPicker.animate(edit_event.config.slide_in);
		
	},
		
	selectDate: function(e){
		
		edit_event.config.mydate = e.value;
		
	},
	
	changeDate: function(){
		
		edit_event.config.dateLabel.text = String.formatDate(edit_event.config.mydate, "medium");
		edit_event.config.dateLabel.color = "#666";
		edit_event.config.datePicker.animate(edit_event.config.slide_out);
		
	},
	
	changeType: function(){
				
		edit_event.config.typeLabel.text = edit_event.config.typePicker.children[0].getSelectedRow(0).title;
		edit_event.config.typeLabel.color = "#666";
		edit_event.config.typePicker.animate(edit_event.config.slide_out);
		
	},
	
	changeStyles: function(){
				
		edit_event.config.stylesLabel.text = edit_event.config.stylesPicker.children[0].getSelectedRow(0).title;
		edit_event.config.stylesLabel.color = "#666";
		edit_event.config.stylesPicker.animate(edit_event.config.slide_out);
		
	},
	
	disableUpdate: function(){
	
		edit_event.config.update.opacity = 0.5;	
		edit_event.config.update.removeEventListener("click", edit_event.updateEvent);
		
	},
	
	enableUpdate: function(){
		
		edit_event.config.update.opacity = 1;	
		edit_event.config.update.addEventListener("click", edit_event.updateEvent);
		
	},
	
	resetImage: function(){
		
		edit_event.enableUpdate();
		
	},
	
	updateEvent: function(){
		
		var valid = edit_event.config.Application.validate({
			inputs:[
				{
					object: edit_event.config.nameLabel,
					val: edit_event.config.nameLabel.value,
					presence: true
				}
			]
		});
		
		if(valid){
		var url = "http://www.loumii.com/app_events/" + edit_event.config.data.id + "/update.json";
		var xhr = Ti.Network.createHTTPClient({
    		onload: function(e) {
    			var event = eval('('+this.responseText+')');
    			edit_event.config.w.fireEvent("update", {event: event});
    			
    			if(Ti.App.properties.getString("user_details")){
    				var user = JSON.parse(Ti.App.properties.getString("user_details"));
    				
    				for(i=0;i<user.events.length;i++){
    					if(user.events[i].id == edit_event.config.data.id){
    						user.events[i] = event;
    						break;
    					}
    				}
    				
					Ti.App.properties.setString("user_details", JSON.stringify(user));
					Ti.App.fireEvent("refresh_profile", {refresh_type: "Events", events: user.events});
    			}

        		edit_event.config.w.close();
        		
        	},
    		onerror: function() {
        		alert('Cannot connect to server');
    		},
    		timeout: 30000
		});
		xhr.setRequestHeader("Content-Type","application/json");
		xhr.open("POST", url);
		xhr.send({
			title: edit_event.config.nameLabel.value,
			date: edit_event.config.dateLabel.text,
			type: edit_event.config.typeLabel.text,
			style: edit_event.config.stylesLabel.text,
			user_id: Ti.App.Properties.getInt("user_id")
		});
		}
		
	}
	
}

edit_event.init();
