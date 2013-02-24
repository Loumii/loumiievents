var w = Ti.UI.currentWindow;

var Application = require('ui/common/Application');

var back = Application.createNavButton("Save");
w.leftNavButton = back;
w.url = null;

var closeWindow = function(){
	if(w.currentLabel){
		w.currentLabel.blur();
	}
	if(w.url){
		w.url.blur();
	}
	w.close();
}

back.addEventListener("click", closeWindow);

w.currentlyUploading = false;

var dialog = Application.createDialog();

var howView = Ti.UI.createScrollView({
        left:0,right:0,
        top:0,bottom:0,
        contentHeight:"auto",
    	contentWidth:'auto',
        showVerticalScrollIndicator:true,
        layout: "vertical"
});

var hiddenRows = [];
var labelRows = eval('(' + Ti.App.properties.getString("components") + ')');
var linkRows = eval('(' + Ti.App.properties.getString("links") + ')');
var howImageRows = eval('(' + Ti.App.properties.getString("howImages") + ')');
var howFileNames = eval('(' + Ti.App.properties.getString("howFileNames") + ')');

var howTable = Ti.UI.createTableView({
	top: 10,
	scrollable: false,
	width: 280,
	left: 20,
	height: 350,
	borderRadius: 5,
	footerTitle: "",
	borderColor: "#999"
});

w.addEventListener("focus", function(){

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
			value: labelRows[i] || "Add your description here..",
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

	   var photoID = howImageRows[i];

	   var image = "/images/new-photo.jpg"

	   if(howFileNames[i]){
	   		
	  	var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, howFileNames[i]);
	  	
	  	image = file.read();		
	   		
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

		photoHolder.addEventListener('postlayout', postLayoutCallback);
		
		photo.addEventListener("click", function(e){
			showDialog(e);
		});

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
			value: linkRows[i]
		});
		
		horizontalView.add(url);
		
		var charLimiter = Application.characterLimiter(140, infoLabel, {top: -22, right: 15});
		
		charLimiter.left = 0;
		
		inputRow.add(charLimiter);
		inputRow.add(horizontalView);
	
		howTable.appendRow(row);
		hiddenRows.push(inputRow);
	
		infoLabel.addEventListener("focus", function(e){
			w.currentLabel = e.source;
		});
	
		infoLabel.addEventListener("blur", function(e){
			if(e.source.value != e.source.initialValue){
				labelRows[e.source.position] = e.source.value;
			}
			else{
				labelRows[e.source.position] = "";
			}
			w.currentLabel = null;
		});
	
		url.addEventListener("focus", function(e){
			w.url = e.source;
		});
	
		url.addEventListener("blur", function(e){
			if(e.source.value){
				linkRows[e.source.position] = e.source.value;
			}
			else{
				linkRows[e.source.position] = "";
			}
			w.url = null;
		});
	
		row.addEventListener("click", function(e){  
			toggleRow(e);
		});
		
	}

});

var toggleRow = function(row){
		
	var rowInfo = row.source,
		position = rowInfo.position,
		index = row.index;
		
	if(!rowInfo.opened){
		rowInfo.rightImage = "/images/selected-down-arrow.png";
		howTable.insertRowAfter(index, hiddenRows[position]);
		howTable.height += hiddenRows[position].height;
		rowInfo.opened = true;
	}
	else{
		
		var textArea = howTable.data[0].rows[index + 1].children[0];
		
		textArea.blur();
		hiddenRows[position] = howTable.data[0].rows[index + 1];
		
		if(textArea.value != textArea.initialValue){
			labelRows[position] = textArea.value;
		}
		else{
			labelRows[position] = "";
		}
				
		rowInfo.rightImage = "/images/right-arrow.png";
		howTable.deleteRow(index + 1);
		howTable.height -= hiddenRows[position].height;
		rowInfo.opened = false;
	}
	
}

howView.add(howTable);
howView.add(Application.createPadding());

w.add(howView);

var postLayoutCallback = function(e) {
	
		var view = e.source;
        
        view.setShadow({
             shadowOffset:{x:0, y:2},
             shadowRadius:3,
             shadowOpacity:0.2
         });            
}

var showDialog = function(e){
	if(!w.currentlyUploading){
		w.currentPhoto = e.source;
		dialog.show();
	}
	else{
		alert("You have another image that is currently uploading. Please wait for this to finish.");
	}
}

w.addEventListener("blur", function(){
	Ti.App.properties.setString("components", JSON.stringify(labelRows));
	Ti.App.properties.setString("howImages", JSON.stringify(howImageRows));
	Ti.App.properties.setString("howFileNames", JSON.stringify(howFileNames));
	Ti.App.properties.setString("links", JSON.stringify(linkRows));
});

var disableSave = function(){
	w.currentPhoto.parent.fireEvent("postlayout");	
	w.currentlyUploading = true;
	w.imageCancelled = false;
	back.opacity = 0.5;
	back.removeEventListener('click', closeWindow);
}

var enableSave = function(){
		
	howImageRows[w.currentPhoto.position] = w.currentPhoto.id;
	back.opacity = 1;
	
	if(!w.imageCancelled){
	
		var fileName = new Date().getTime() + "image.jpg"; // unique name
	    var file = Titanium.Filesystem.applicationDataDirectory + "/"+ fileName;
    	var savedFile = Titanium.Filesystem.getFile(file);

    	savedFile.write(w.currentPhoto.image);

		howFileNames[w.currentPhoto.position] = fileName;
		
	}

	back.addEventListener('click', closeWindow);
	
	w.currentlyUploading = false;
	w.imageCancelled = false;
}

var resetImage = function(){
	w.imageCancelled = true;
	enableSave();
}

dialog.addEventListener("click", function(e){
		
	Application.uploadImage(w.currentPhoto, e, disableSave, enableSave, resetImage);
		
});
