// This is a single context application with mutliple windows in a stack
(function() {

	require('ti.viewshadow');

	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	var ApplicationWindow = require('ui/common/ApplicationWindow');
	Titanium.UI.backgroundImage = "images/background.jpg";

	var logged_in = Ti.App.Properties.getBool('logged_in', false);
	
	Ti.App.tabGroup = new ApplicationTabGroup();
	Ti.App.tabGroup.open();

	Ti.include("/ui/common/customTabBar.js");

	Ti.App.ctb = new CustomTabBar({
    	tabBar: Ti.App.tabGroup,
    	imagePath: 'images/',
    	width: 56,
    	hidden: !logged_in,
    	height: 45,
    	items: [
        	{ image: 'home.png', selected: 'home_over.png' },
        	{ image: 'explore.png', selected: 'explore_over.png' },
        	{ image: 'create.png', selected: 'create_over.png' },
        	{ image: 'profile.png', selected: 'profile_over.png' },
        	{ image: 'feed.png', selected: 'feed_over.png' }
    	]
	});

})();