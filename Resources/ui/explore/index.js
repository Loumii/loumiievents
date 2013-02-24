var explore = {
	
	config: {
		w: Ti.UI.currentWindow,
		Application: require('ui/common/Application')
	},
	
	init: function(){
				
		explore.createTypeTable();
		
	},
	
	createTypeTable: function(){
		
		var exploreSearch = Titanium.UI.createView({
			layout: 'vertical',
			height: "100%",
			width: "100%"
		});

		var categories = explore.config.Application.getPlainCategories();

		var tableData= [
			Ti.UI.createTableViewRow({
				title: "All", 
				selectedBackgroundColor: "#f2f2f2", 
				rightImage: "/images/right-arrow.png",
				selectedColor: "#000"
			})
		];

		for(i = 0;i < categories.length;i++){
			var row = Ti.UI.createTableViewRow({
				title: categories[i],
				selectedBackgroundColor: "#f2f2f2",
				selectedColor: "#000",
				rightImage: "/images/right-arrow.png"
			});
	
			tableData.push(row);
	
		}

		var spacer = Ti.UI.createView({
			height: 50
		});

		var exploreTable = Ti.UI.createTableView({
			data: tableData,
			width: "auto",
			height: "auto",
			footerView: spacer
		});

		exploreSearch.add(exploreTable);

		explore.config.w.add(exploreSearch);

		exploreTable.addEventListener("click", explore.showStylesWindow);
		
	},
	
	showStylesWindow: function(e){
		
		/*var styles = Titanium.UI.createWindow({
				title: "Event style",
  				url:'../explore/styles.js',
  				barImage: "/images/barImage.png",
  				backButtonTitle: ''
		});
	
		styles.setTitleControl(explore.config.Application.createTitle("Event style"));
	
		styles.addEventListener("focus", function(){
			styles.setTitleControl(explore.config.Application.createTitle("Event style"));
		});
	
		Ti.UI.currentTab.open(styles, {animated: true});
	
		styles.type = e.row.title;*/
		
	var explores = Titanium.UI.createWindow({
		title: e.row.title,
  		url:'../explore/show.js',
  		barImage: "/images/barImage.png",
  		backButtonTitle: ''
	});
	
	explores.setTitleControl(explore.config.Application.createTitle(e.row.title));
	
	Ti.UI.currentTab.open(explores, {animated: true});
	
	explores.type = e.row.title;
		
		
	}
	
}

explore.init();
