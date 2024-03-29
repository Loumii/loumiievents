var w = Ti.UI.currentWindow;
var Application = require('ui/common/Application');

var newView = Ti.UI.createScrollView({
        layout: 'vertical'
});

var photoHolder = Ti.UI.createView({
    borderWidth: 5,
	borderColor: "white",
	width: 109,
	height: 109,
	top: 25,
	backgroundColor: "white"
});

var photo = Ti.UI.createImageView({
	image: "/images/new-photo.jpg",
	width: 109,
	height: 109,
	newImage: true,
	id: null,
	type: "AppEvent",
	initialImage: "/images/new-photo.jpg",
	hires: true
});

var shadow = Ti.UI.createImageView({
	image: "/images/shadow2.png",
	height: 6,
	width: 109
});

var	mydate = new Date();

photoHolder.add(photo);

var create = Application.createNavButton("Create");

w.rightNavButton = create;
 
var drop_button =  Titanium.UI.createButton({
		height: 24,
		width: 24,
		backgroundImage: "/images/calendar.png",
		top: 9
});

var picker_view = Titanium.UI.createWindow({
	height:251,
	bottom:-251,
	zIndex: 2
});

var type_picker_view = Titanium.UI.createWindow({
	height:251,
	bottom:-251,
	zIndex: 2
});

var styles_picker_view = Titanium.UI.createWindow({
	height:251,
	bottom:-251,
	zIndex: 2
});
 
var cancel =  Titanium.UI.createButton({
	title:'Cancel',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});
 
var done =  Titanium.UI.createButton({
	title:'Done',
	style:Titanium.UI.iPhone.SystemButtonStyle.DONE
});
 
var spacer =  Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});
 
var toolbar =  Ti.UI.iOS.createToolbar({
	top:0,
	items:[cancel,spacer,done]
});

var cancel2 =  Titanium.UI.createButton({
	title:'Cancel',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});
 
var done2 =  Titanium.UI.createButton({
	title:'Done',
	style:Titanium.UI.iPhone.SystemButtonStyle.DONE
});
 
var spacer2 =  Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});
 
var toolbar2 =  Ti.UI.iOS.createToolbar({
	top:0,
	items:[cancel2,spacer2,done2]
});

var cancel3 =  Titanium.UI.createButton({
	title:'Cancel',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});
 
var done3 =  Titanium.UI.createButton({
	title:'Done',
	style:Titanium.UI.iPhone.SystemButtonStyle.DONE
});
 
var spacer3 =  Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});
 
var toolbar3 =  Ti.UI.iOS.createToolbar({
	top:0,
	items:[cancel3,spacer3,done3]
});
 
var picker = Titanium.UI.createPicker({
		top:43,
		type: Titanium.UI.PICKER_TYPE_DATE,
		minDate: new Date(mydate.getFullYear()-1, mydate.getMonth(), mydate.getDate()),
		value: mydate
});

picker.selectionIndicator=true;

var type_picker = Titanium.UI.createPicker({
		top:43
});

type_picker.selectionIndicator = true;

var picker_data = Application.getCategories();

type_picker.add(picker_data);


var styles_picker = Titanium.UI.createPicker({
		top:43
});

styles_picker.selectionIndicator = true;

var styles_data = Application.getStyles();

styles_picker.add(styles_data);

 
var slide_out =  Titanium.UI.createAnimation({bottom:-251}); 
var slide_in =  Titanium.UI.createAnimation({bottom:0});
 
picker_view.add(toolbar);
type_picker_view.add(toolbar2);
styles_picker_view.add(toolbar3);

picker_view.add(picker);
type_picker_view.add(type_picker);
styles_picker_view.add(styles_picker);

var rows = [];

var nameRow = Ti.UI.createTableViewRow({
	layout: "horizontal",
	height: 42,
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
	left: 10
});

nameRow.add(nameInput);

rows.push(nameRow);

var dateRow = Ti.UI.createTableViewRow({
	layout: "horizontal",
	height: 42,
	backgroundColor: "#fbfbfa",
	selectedBackgroundColor: "fbfbfa"
});

var dateLabel = Ti.UI.createLabel({
	color: "#AAA",
	text: "Date",
	font:{
		fontWeight: "bold",
		fontSize: 18,
		fontFamily: "Helvetica Neue"
	},
	width: 236,
	top: 11,
	left: 10,
	initialValue: "Date"
});

dateRow.add(dateLabel);
dateRow.add(drop_button);

rows.push(dateRow);

var typeRow = Ti.UI.createTableViewRow({
	layout: "horizontal",
	height: 42,
	backgroundColor: "#fbfbfa",
	selectedBackgroundColor: "fbfbfa"
});

var typeLabel = Ti.UI.createLabel({
	color: "#AAA",
	text: "Type",
	font:{
		fontWeight: "bold",
		fontSize: 18,
		fontFamily: "Helvetica Neue"
	},
	width: 280,
	top: 11,
	left: 10,
	initialValue: "Type"
});

typeRow.add(typeLabel);

rows.push(typeRow);

var stylesRow = Ti.UI.createTableViewRow({
	layout: "horizontal",
	height: 42,
	backgroundColor: "#fbfbfa",
	selectedBackgroundColor: "fbfbfa"
});

var stylesLabel = Ti.UI.createLabel({
	color: "#AAA",
	text: "Style",
	font:{
		fontWeight: "bold",
		fontSize: 18,
		fontFamily: "Helvetica Neue"
	},
	width: 280,
	top: 11,
	left: 10,
	initialValue: "Style"
});

stylesRow.add(stylesLabel);

//rows.push(stylesRow);

// Height with Styles = 168

var table = Ti.UI.createTableView({
	data: rows,
	width: 280,
	footerTitle: '',
	scrollable: false,
	borderWidth: 1,
	borderColor: "#999999",
	separatorColor: "#999999",
	height: 126,
	top: 20
});

var dialog = Application.createDialog();

newView.add(photoHolder);
newView.add(shadow);

newView.add(table);

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
		
		newView.add(shareLabel);
		newView.add(shareTable);
		newView.add(Application.createPadding());

w.add(newView);

picker_view.open();
type_picker_view.open();
styles_picker_view.open();

cancel.addEventListener('click',function() {
	picker_view.animate(slide_out);
});

cancel2.addEventListener('click',function() {
	type_picker_view.animate(slide_out);
});

cancel3.addEventListener('click',function() {
	styles_picker_view.animate(slide_out);
});

drop_button.addEventListener('click',function() {
	nameInput.blur();
	type_picker_view.animate(slide_out);
	styles_picker_view.animate(slide_out);
	picker_view.animate(slide_in);
});

picker.addEventListener('change',function(e){
 	mydate = e.value;
});

done.addEventListener('click', function(){
	dateLabel.text = String.formatDate(mydate, "medium");
	dateLabel.color = "#666";
	picker_view.animate(slide_out);
});

done2.addEventListener('click', function(){
	typeLabel.text = type_picker.getSelectedRow(0).title;
	typeLabel.color = "#666";
	type_picker_view.animate(slide_out);
});

done3.addEventListener("click", function(){
	stylesLabel.text = styles_picker.getSelectedRow(0).title;
	stylesLabel.color = "#666";
	styles_picker_view.animate(slide_out);

});

typeRow.addEventListener('click',function() {
	nameInput.blur();
	picker_view.animate(slide_out);
	styles_picker_view.animate(slide_out);
	type_picker_view.animate(slide_in);
});

stylesRow.addEventListener("click", function(){
	nameInput.blur();
	picker_view.animate(slide_out);
	type_picker_view.animate(slide_out);
	styles_picker_view.animate(slide_in);
});

var createEvent = function(){
	
	var valid = Application.validate({
		inputs:[
			{
				object: nameInput,
				val: nameInput.value,
				presence: true
			},
			{
				object: dateLabel,
				val: dateLabel.text,
				presence: true
			},
			{
				object: typeLabel,
				val: typeLabel.text,
				presence: true
			}/*,
			{
				object: stylesLabel,
				val: stylesLabel.text,
				presence: true
			}*/
			]
	});
	
	if(valid){
	
	if(!photo.id){
		var url = "http://www.loumii.com/create_event.json";
	}
	else{
		var url = "http://www.loumii.com/app_events/" + photo.id + "/update.json";
	}
	var xhr = Ti.Network.createHTTPClient({
    	onload: function(e) {
        	var event = eval('('+this.responseText+')');
        	nameInput.value = null;
        	dateLabel.text = "Date";
        	dateLabel.color = "#AAA";
        	typeLabel.text = "Type";
        	typeLabel.color = "#AAA";
        	stylesLabel.text = "Style";
        	stylesLabel.color = "#AAA";
        	Application.goToAppEventExt(event);
        	photo.id = null;
        	photo.image = "/images/new-photo.jpg";	
        	
        	if(Ti.App.properties.getString("user_details")){
    			var user = JSON.parse(Ti.App.properties.getString("user_details"));
    			user.events.push(event);
				Ti.App.properties.setString("user_details", JSON.stringify(user));
				Ti.App.fireEvent("refresh_profile", {refresh_type: "Events", events: user.events});
    		}
        	    
    	},
    	onerror: function() {
        	alert('Cannot connect to server');
    	},
    	timeout: 30000
	});
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.open("POST", url);
	xhr.send({
		title: nameInput.value,
		date: dateLabel.text,
		type: typeLabel.text,
		style: stylesLabel.text,
		user_id: Ti.App.Properties.getInt("user_id")
	});
	}
}

create.addEventListener('click', createEvent);

photo.addEventListener("click", function(e){
	w.currentPhoto = e.source;
	dialog.show();
});

var disableCreate = function(){
	create.opacity = 0.5;
	create.removeEventListener('click', createEvent);
}

var enableCreate = function(){
	create.opacity = 1;
	create.addEventListener('click', createEvent);
}

var resetImage = function(){
	enableCreate();
}

dialog.addEventListener("click", function(e){
		
	Application.uploadImage(w.currentPhoto, e, disableCreate, enableCreate, resetImage);
		
});

w.addEventListener("focus", function(){
	var social = Ti.App.Properties.getBool("social");
	twitterSwitch.value = social;
	facebookSwitch.value = social;
});
