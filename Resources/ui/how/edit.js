var edit_how = {
	
	config:{
		w: Ti.UI.currentWindow,
		Application: require('ui/common/Application'),
		back: null,
		howTable: null,
		howView: null,
		hiddenRows: null,
		howImageRows: null,
		howFileNames: null,
		dial: null,
		labelRows: null,
		linkRows: null
	},
	
	init: function(){
		
		edit_how.config.back = edit_how.config.Application.createNavButton("Save");
		edit_how.config.w.leftNavButton = edit_how.config.back;

		edit_how.config.back.addEventListener("click", edit_how.closeWindow);
		
		edit_how.config.w.currentlyUploading = false;
		
		edit_how.createDialog();
		edit_how.createHowView();
		
		edit_how.config.w.addEventListener("focus", edit_how.setupHowTo);
		edit_how.config.w.addEventListener("blur", edit_how.saveHowTo);		
		
		edit_how.config.howView.add(edit_how.config.howTable);
		edit_how.config.howView.add(edit_how.config.Application.createPadding());

		edit_how.config.w.add(edit_how.config.howView);
		
		edit_how.config.w.url = null;
		
	},
	
	createHowView: function(){
		
		edit_how.config.howView = Ti.UI.createScrollView({
        	left:0,right:0,
        	top:0,bottom:0,
        	contentHeight:"auto",
    		contentWidth:'auto',
        	showVerticalScrollIndicator:true,
        	layout: "vertical"
		});

		edit_how.config.hiddenRows = [];
		edit_how.config.labelRows = eval('(' + Ti.App.properties.getString("components") + ')');
		edit_how.config.linkRows = eval('(' + Ti.App.properties.getString("links") + ')');
		edit_how.config.howImageRows = eval('(' + Ti.App.properties.getString("howImages") + ')');
		edit_how.config.howFileNames = eval('(' + Ti.App.properties.getString("howFileNames") + ')');

		edit_how.config.howTable = Ti.UI.createTableView({
			top: 10,
			scrollable: false,
			width: 280,
			left: 20,
			height: 350,
			borderRadius: 5,
			footerTitle: "",
			borderColor: "#999"
		});	
				
	},
	
	setupHowTo: function(){
		
		for(i=0;i<8;i++){
	
			switch(i + 1){
				case 6:
					var title = "Tips";
				break;
				case 7:
					var title = "Acknowledgement";
				break;
				default:
					var title = "Step " + (i+1).toString();
				break;
			}
	
			var row = Ti.UI.createTableViewRow({
				title: title,
				height: 50,
				opened: false,
				rightImage: "/images/right-arrow.png",
				selectedBackgroundColor: "#f2f2f2",
				selectedColor: "black",
				position: i
			});
	
			var inputRow = Ti.UI.createTableViewRow({
				height: 200,
				selectedBackgroundColor: "white",
				selectedColor: "black",
				backgroundColor: "#fefefe",
				layout: "vertical"
			});
	
			var infoLabel = Ti.UI.createTextArea({
				color: "#999",
				normalColor: "#666",
				placeholderColor: "#999",
				font:{
					fontWeight: "bold",
					fontSize: 16,
					fontFamily: "Helvetica Neue"
				},
				backgroundColor: "#f2f2f2",
				borderRadius: 5,
				width: 260,
				height: 120,
				borderColor: "#999999",
				top: 11,
				left: 10,
				returnKeyType: Titanium.UI.RETURNKEY_DONE,
				initialValue: "Add your description here..",
				value: edit_how.config.labelRows[i] || "Add your description here..",
				position: i
			});

			var horizontalView = Ti.UI.createView({
				layout: "horizontal",
				top: 10
			});

			var photoHolder = Ti.UI.createView({
   				borderWidth: 5,
				borderColor: "white",
				width: 50,
				height: 50,
				top: 0,
				left: 10
			});

	   		var photoID = edit_how.config.howImageRows[i];

	   		var image = "/images/new-photo.jpg"

	   		if(edit_how.config.howFileNames[i]){
	   		
	  			var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, edit_how.config.howFileNames[i]);
	  	
	  			image = (file.exists() ? file.read() : edit_how.config.howFileNames[i]);		
	   		
	   		}

	   		var photo = Ti.UI.createImageView({
				image: image,
				width: 50,
				height: 50,
				newImage: true,
				position: i,
				id: photoID,
				type: "Step",
				initialImage: image,
				hires: true
			});

			photoHolder.add(photo);

			photoHolder.addEventListener('postlayout', edit_how.postLayoutCallback);
		
			photo.addEventListener("click", edit_how.showDialog);

			inputRow.add(infoLabel);
		
			horizontalView.add(photoHolder);
		
			var url = Ti.UI.createTextField({
    			color:'#666',
    			height:35,
    			top:10,
    			left:15,
    			width:195,
    			borderColor: "#999",
    			borderRadius: 5,
    			backgroundColor: "#f2f2f2",
    			hintText: "Add a link here...",
				font:{
					fontWeight: "bold",
					fontSize: 16,
					fontFamily: "Helvetica Neue"
				},
				returnKeyType: Titanium.UI.RETURNKEY_DONE,
				position: i,
				paddingLeft: 5,
				paddingRight: 5,
				autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
				value: edit_how.config.linkRows[i]
			});
		
			horizontalView.add(url);
		
			var charLimiter = edit_how.config.Application.characterLimiter(140, infoLabel, {top: -22, right: 15});
		
			charLimiter.left = 0;
		
			inputRow.add(charLimiter);
	
			inputRow.add(horizontalView);
	
			edit_how.config.howTable.appendRow(row);
			edit_how.config.hiddenRows.push(inputRow);
	
			infoLabel.addEventListener("focus", edit_how.setCurrentLabel);
	
			infoLabel.addEventListener("blur", edit_how.blurCurrentLabel);
	
			url.addEventListener("focus", edit_how.setURL);
	
			url.addEventListener("blur", edit_how.blurURL);
	
			row.addEventListener("click", edit_how.toggleRow);
		
		}
				
	},
	
	setCurrentLabel: function(e){
		edit_how.config.w.currentLabel = e.source;
	},
	
	blurCurrentLabel: function(e){
		if(e.source.value != e.source.initialValue){
			edit_how.config.labelRows[e.source.position] = e.source.value;
		}
		else{
			edit_how.config.labelRows[e.source.position] = "";
		}
	},
	
	setURL: function(e){
		edit_how.config.w.url = e.source;
	},
	
	blurURL: function(e){
		if(e.source.value){
			edit_how.config.linkRows[e.source.position] = e.source.value;
		}
		else{
			edit_how.config.linkRows[e.source.position] = "";
		}
	},
	
	createDialog: function(){
		
		edit_how.config.dialog = edit_how.config.Application.createDialog();
		
		edit_how.config.dialog.addEventListener("click", edit_how.choosePhoto);
		
	},
	
	showDialog: function(e){
		
		if(!edit_how.config.w.currentlyUploading){
			edit_how.config.w.currentPhoto = e.source;
			edit_how.config.dialog.show();
		}
		else{
			alert("You have another image that is currently uploading. Please wait for this to finish.");
		}
		
	},
	
	toggleRow: function(row){
		
		var rowInfo = row.source,
		position = rowInfo.position,
		index = row.index;
		
		if(!rowInfo.opened){
			rowInfo.rightImage = "/images/selected-down-arrow.png";
			edit_how.config.howTable.insertRowAfter(index, edit_how.config.hiddenRows[position]);
			edit_how.config.howTable.height += edit_how.config.hiddenRows[position].height;
			rowInfo.opened = true;
		}
		else{
		
			var textArea = edit_how.config.howTable.data[0].rows[index + 1].children[0];
		
			textArea.blur();
			edit_how.config.hiddenRows[position] = edit_how.config.howTable.data[0].rows[index + 1];
		
			if(textArea.value != textArea.initialValue){
				edit_how.config.labelRows[position] = textArea.value;
			}
			else{
				edit_how.config.labelRows[position] = "";
			}
				
			rowInfo.rightImage = "/images/right-arrow.png";
			edit_how.config.howTable.deleteRow(index + 1);
			edit_how.config.howTable.height -= edit_how.config.hiddenRows[position].height;
			rowInfo.opened = false;
		}
	
	},
	
	saveHowTo: function(){
		
		Ti.App.properties.setString("components", JSON.stringify(edit_how.config.labelRows));
		Ti.App.properties.setString("howImages", JSON.stringify(edit_how.config.howImageRows));
		Ti.App.properties.setString("howFileNames", JSON.stringify(edit_how.config.howFileNames));
		Ti.App.properties.setString("links", JSON.stringify(edit_how.config.linkRows));
		
	},
	
	closeWindow: function(){
		
		if(edit_how.config.w.currentLabel){
			edit_how.config.w.currentLabel.blur();
		}
		if(edit_how.config.w.url){
			edit_how.config.w.url.blur();
		}
		
		edit_how.config.w.close();
		
	},
	
	postLayoutCallback: function(e){
		
		var view = e.source;
        
        view.setShadow({
             shadowOffset:{x:0, y:2},
             shadowRadius:3,
             shadowOpacity:0.2
         });
		
	},
	
	choosePhoto: function(e){
		
		edit_how.config.Application.uploadImage(edit_how.config.w.currentPhoto, e, edit_how.disableSave, edit_how.enableSave, edit_how.resetImage);
	
	},
	
	disableSave: function(){
		
		edit_how.config.w.currentPhoto.parent.fireEvent("postlayout");	
		edit_how.config.w.currentlyUploading = true;
		edit_how.config.w.imageCancelled = false;
		edit_how.config.back.opacity = 0.5;
		edit_how.config.back.removeEventListener('click', edit_how.closeWindow);
		
	},
	
	enableSave: function(){
	
		edit_how.config.howImageRows[edit_how.config.w.currentPhoto.position] = edit_how.config.w.currentPhoto.id;
		edit_how.config.back.opacity = 1;
	
		if(!edit_how.config.w.imageCancelled){
	
			var fileName = new Date().getTime() + "image.jpg"; // unique name
		    var file = Titanium.Filesystem.applicationDataDirectory + "/"+ fileName;
 	   		var savedFile = Titanium.Filesystem.getFile(file);

	    	savedFile.write(edit_how.config.w.currentPhoto.image);

			edit_how.config.howFileNames[edit_how.config.w.currentPhoto.position] = fileName;
		}

		edit_how.config.back.addEventListener('click', edit_how.closeWindow);
	
		edit_how.config.w.currentlyUploading = false;
		edit_how.config.w.imageCancelled = false;
		
	},
	
	resetImage: function(){
		
		edit_how.config.w.imageCancelled = true;
		edit_how.enableSave();
		
	}
	
}

edit_how.init();
