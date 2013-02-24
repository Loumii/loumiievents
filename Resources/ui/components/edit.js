var edit_component = {
	
	config:{
		w: Ti.UI.currentWindow,
		Application: require('ui/common/Application'),
		component: null,
		dialog: null,
		updateButton: null,
		name: null,
		howFileNames:  ["","","","","","",""],
		howImages:  ["","","","","","",""],
		labelRows:  ["","","","","","",""],
		linkRows: ["","","","","","",""] 
	},
	
	init: function(){
			
		edit_component.config.component = edit_component.config.w.data;	
		
		Ti.API.log(edit_component.config.component);
			
		var back = edit_component.config.Application.createBackButton();
				
		back.removeEventListener("click", edit_component.config.Application.closeWindow);
		
		back.addEventListener("click", function(){
			edit_component.config.w.close();
		});
		
		edit_component.config.w.leftNavButton = back;
		
		edit_component.config.updateButton = edit_component.config.Application.createNavButton("Update");

		edit_component.config.w.rightNavButton = edit_component.config.updateButton;	
		
		edit_component.config.updateButton.addEventListener("click", edit_component.updateComponent);
		
		edit_component.config.w.addEventListener("close", function(e){
			e.source.fireEvent("refresh", {component: edit_component.config.component});
		});
		
		edit_component.createEditScreen();
		
		Ti.App.properties.setString("supplies",  null);
		
		if(edit_component.config.component.supplies != null){
			
			var initialSupplies = [];
			
			for(i=0;i<edit_component.config.component.supplies.length;i++){
				initialSupplies.push(edit_component.config.component.supplies[i].name);
			}
						
			Ti.App.properties.setString("supplies",  JSON.stringify(initialSupplies));
			
		}

		if(edit_component.config.component.steps != null){
			
			var steps = edit_component.config.component.steps;
									
			for(i=0;i<steps.length;i++){
				var step = steps[i];
								
				if(step.id != null){
					edit_component.config.howImages[step.number - 1] = step.id;
				}
				
				if(step.description != null){
					edit_component.config.labelRows[step.number - 1] = step.description;
				}
				
				if(step.image != null){
					edit_component.config.howFileNames[step.number - 1] = step.image;
				}
				
				if(step.url != null){
					edit_component.config.linkRows[step.number - 1] = step.url;
				}
				
			}
			
		}

		Ti.App.properties.setString("components", JSON.stringify(edit_component.config.labelRows));

		Ti.App.properties.setString("howImages", JSON.stringify(edit_component.config.howImages));

		Ti.App.properties.setString("howFileNames", JSON.stringify(edit_component.config.howFileNames));
		
		Ti.App.properties.setString("links", JSON.stringify(edit_component.config.linkRows));
			
	},
	
	createEditScreen: function(){
		
		var editComponent = Ti.UI.createScrollView({
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
			top: 50
		});

		var photo = Ti.UI.createImageView({
			image: edit_component.config.component.image || "/images/new-photo.jpg",
			width: 109,
			height: 109,
			id: edit_component.config.component.id,
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

		var name = Ti.UI.createTextField({
			color: "#666",
			hintText: "What are you making?",
			font:{
				fontWeight: "bold",
				fontSize: 18,
				fontFamily: "Helvetica Neue"
			},
			width: 280,
			top: 11,
			backgroundColor: "#fbfbfa",
			borderColor: "#999999",
			borderWidth: 1,
			height: 45,
			paddingLeft: 10,
			value: edit_component.config.component.name
		});

		edit_component.config.name = name;

		editComponent.add(photoHolder);
		editComponent.add(shadow);
		editComponent.add(name);

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
		editComponent.add(suppliesButton);
		editComponent.add(howToButton);

		editComponent.add(edit_component.config.Application.createPadding());

		edit_component.config.w.add(editComponent);
		
		photo.addEventListener("click", edit_component.choosePhoto);
		suppliesButton.addEventListener("click", edit_component.editSupplies);
		howToButton.addEventListener("click", edit_component.editHowTo);
		
		edit_component.createDialog();
		
	},
	
	createDialog: function(){
		
		edit_component.config.dialog = edit_component.config.Application.createDialog();
		
		edit_component.config.dialog.addEventListener("click", edit_component.updateImage);
		
	},
	
	choosePhoto: function(e){
		
		edit_component.config.w.currentPhoto = e.source;
		edit_component.config.dialog.show();
		
	},
	
	disableUpdate: function(){
		edit_component.config.updateButton.opacity = 0.5;
		edit_component.config.updateButton.removeEventListener('click', edit_component.updateComponent);
	},

	enableUpdate: function(){
		edit_component.config.updateButton.opacity = 1;
		edit_component.config.updateButton.addEventListener('click', edit_component.updateComponent);
	},

	resetImage: function(){
		edit_component.enableUpdate();
	},
	
	updateImage: function(e){
		
		edit_component.config.Application.uploadImage(edit_component.config.w.currentPhoto, e, edit_component.disableUpdate, edit_component.enableUpdate, edit_component.resetImage);
		
	},
	
	editSupplies: function(){
		
		var suppliesWindow = Ti.UI.createWindow({
			title: "Edit Supplies",
			url: "/ui/supplies/edit.js",
			backButtonTitle: "",
			barImage: "/images/barImage.png"
		});
	
		suppliesWindow.setTitleControl(edit_component.config.Application.createTitle("Edit Supplies"));
	
		Ti.UI.currentTab.open(suppliesWindow, {animated: true});	
	
	},
	
	editHowTo: function(){
		
		var howToWindow = Ti.UI.createWindow({
			title: "Edit How To",
			url: "/ui/how/edit.js",
			backButtonTitle: "",
			barImage: "/images/barImage.png"
		});
	
		howToWindow.setTitleControl(edit_component.config.Application.createTitle("Edit How To"));
	
		Ti.UI.currentTab.open(howToWindow, {animated: true});
		
	},
	
	updateComponent: function(){
		
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
	
		var valid = edit_component.config.Application.validate({
			inputs:[
			{
				object: edit_component.config.name,
				val: edit_component.config.name.value,
				presence: true
			}
			]
		});
	
		if(valid){
	
		var url = "http://loumii.com/items/" + edit_component.config.component.id + "/update.json";
		var xhr = Ti.Network.createHTTPClient({
    		onload: function(e) {
        		var component = eval('('+this.responseText+')');
        		
        		edit_component.config.component = component;
        		
				edit_component.config.w.close();
    		},
    		onerror: function() {
        		alert('Cannot connect to server');
    		},
    		timeout:30000
			});
		xhr.setRequestHeader("Content-Type","application/json");
		xhr.open("POST", url);
		xhr.send({
			name: edit_component.config.name.value,
			type: edit_component.config.component.type,
			event_id: edit_component.config.component.event_id,
			supplies: JSON.stringify(supplies),
			steps: JSON.stringify(steps),
			stepIDs: JSON.stringify(stepIDs),
			stepURLs: JSON.stringify(stepURLs)
		});
		}

	}

}

edit_component.init();