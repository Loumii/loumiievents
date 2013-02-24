CustomTabBar = function(settings) {
	var tabBarItems = [];
	var	tabCurrent = 0;
	
	var resetTabs = function() {
		for(var i = 0; i < tabBarItems.length; i++) {
			tabBarItems[i].image = tabBarItems[i].backgroundImage;
		}
	};
	
	var assignClick = function(tabItem) {
		tabItem.addEventListener('click', function(e) {
			// Just fetching the 'i' variable from the loop
			var pos = e.source.pos;

			if (tabCurrent == pos) {
				// TODO
				// Change back to root window, like the native tab action.
    			return false;
	        }		
			
			// Switch to the tab associated with the image pressed
			settings.tabBar.tabs[pos].active = true;
			tabCurrent = pos;

			
			// Reset all the tab images
			resetTabs();
			
			// Set the current tab as selected
			tabBarItems[pos].image = settings.imagePath + settings.items[pos].selected;		
		});
	};
	
	// Create the container for our tab items
	var customTabBar = Ti.UI.createWindow({
		height: 45,
		bottom: 0,
		width: "100%",
		backgroundGradient:
		{
		type:'linear',
		colors:['#fefefe','#e6e6e6']
		},
		zIndex: 1
	});
	
	var topBorder = Ti.UI.createView({
		width: "100%",
        height: 1,
        borderWidth: 1,
        borderColor: "#666666",
        top: 1
	});
	
	var iconHolder = Ti.UI.createView({
		layout: "horizontal",
		width: 282,
		top: 1,
		height: 45
	});
	
	customTabBar.add(topBorder);
	
	for(var i = 0; i < settings.items.length; i++) {
		// Go through each item and create an imageView
		tabBarItems[i] = Titanium.UI.createImageView({
			backgroundImage: settings.imagePath + settings.items[i].image,
			width: settings.width,
			height: settings.height
		});

		// Pass the item number (used later for changing tabs)
		tabBarItems[i].pos = i;
		assignClick(tabBarItems[i]);

		// Add to the container window
		iconHolder.add(tabBarItems[i]);
	}

	customTabBar.add(iconHolder);

	if(settings.hidden){
		customTabBar.hide();
	}

	// Display the container and it's items
	customTabBar.open();

	// Set the first item as current :)
	resetTabs();
	tabBarItems[0].image = settings.imagePath + settings.items[0].selected;
	
	return {
		hide: function() { customTabBar.hide(); },
		show: function() { customTabBar.show(); },
		select: function(pos){ tabBarItems[pos].fireEvent("click"); },
		close: function(){ customTabBar.close(); },
		currentTab: function(){ return tabCurrent; },
		open: function(){ customTabBar.open(); }
	};
};
