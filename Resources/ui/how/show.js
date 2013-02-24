var w = Ti.UI.currentWindow;
var Application = require('/ui/common/Application');

var back = Application.createBackButton();
w.leftNavButton = back;

var steps = w.data;

var howView = Ti.UI.createScrollView({
        left:0,right:0,
        top:0,bottom:0,
        contentHeight:"auto",
    	contentWidth:'auto',
        showVerticalScrollIndicator:true,
        layout: "vertical"
});

var hiddenRows = [];

validURL = function(str) {
	var pattern = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");
	if(pattern.test(str)) {
        return true;
	}
	else{
		return false;
	}
}

extractURL = function(str){
	var pattern = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");
	return str.match(pattern)[0];
}

var howTable = Ti.UI.createTableView({
	top: 10,
	scrollable: false,
	width: 280,
	left: 20,
	height: 50 * steps.length,
	borderRadius: 5,
	footerTitle: "",
	borderColor: "#999"
});

	for(i=0;i<steps.length;i++){
	
		switch(steps[i].number){
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
			height: 125,
			selectedBackgroundColor: "white",
			selectedColor: "black",
			layout: "vertical"
		});
		
		var infoLabel = Ti.UI.createLabel({
			color: "#666",
			editable: false,
			font:{
				fontWeight: "bold",
				fontSize: 16,
				fontFamily: "Helvetica Neue"
			},
			width: 260,
			height: Ti.UI.SIZE,
			top: 11,
			left: 10,
			text: steps[i].description,
			position: i
		});
				
		inputRow.add(infoLabel);
		
		var urlHeight = 0;
		
		if(steps[i].url){
		
			var url = Ti.UI.createLabel({
				color: "#666",
				editable: false,
				font:{
					fontWeight: "bold",
					fontSize: 16,
					fontFamily: "Helvetica Neue"
				},
				width: 260,
				height: 16,
				wordwrap:false,
				ellipsize: true,
				top: 10,
				left: 10,
				text: "Link: " + steps[i].url,
				position: i
			});
		
			url.addEventListener("click", function(e){
				checkLink(e);
			});
			
			inputRow.add(url);
			
			urlHeight = 16;
			inputRow.height += 16;
			
		}
				
		if(steps[i].image){
			
			var photoHolder = Ti.UI.createView({
				height: 260,
				width: 260,
				borderColor: "white",
				borderWidth: 10,
				top: 15
			});
			
			var photo = Ti.UI.createImageView({
				width: 260,
				height: 260,
				image: steps[i].image,
				defaultImage: "/images/default.jpg",
				hires: true
			});
			
			photoHolder.add(photo);
			
			photoHolder.addEventListener("postlayout", function(e){
				
				var view = e.source;
        
        		view.setShadow({
             		shadowOffset:{x:0, y:2},
             		shadowRadius:3,
             		shadowOpacity:0.2
         		});
         		         		            
			});
			
			inputRow.add(photoHolder);
			
			var labelLines = Math.round(infoLabel.text.length / 30);
			
			if(infoLabel.text.length != 0 && labelLines == 0){
				labelLines = 1;
			}	
			
			var width = infoLabel.toImage().width
			
			var labelSize = labelLines == 1 ? 22 : (width * labelLines / 600 - 1) * 22;
			
			inputRow.height = Math.round(labelSize) + urlHeight + photo.height + 45;
											
		}
		
		howTable.appendRow(row);
		hiddenRows.push(inputRow);
		
		row.addEventListener("click", function(e){
			toggleRow(e);
		});
		
	}

var toggleRow = function(row){
		
	var rowInfo = row.source,
		position = rowInfo.position,
		index = row.index;
		
	if(!rowInfo.opened){
		rowInfo.rightImage = "/images/selected-down-arrow.png";
		howTable.height += hiddenRows[position].height;
		howTable.insertRowAfter(index, hiddenRows[position]);
		rowInfo.opened = true;
	}
	else{
		
		var textArea = howTable.data[0].rows[index + 1].children[0];
						
		rowInfo.rightImage = "/images/right-arrow.png";
		howTable.height -= hiddenRows[position].height;
		howTable.deleteRow(index + 1);
		rowInfo.opened = false;
	}
	
}

var checkLink = function(e){
	
	var description = e.source.text;
		
	if(validURL(description)){
			Application.openWebView(extractURL(description));
	}
	
}

howView.add(howTable);
howView.add(Application.createPadding());

w.add(howView);
