function ApplicationTabGroup() {
	//create module instance
	var self = Ti.UI.createTabGroup();
	var Application = require('ui/common/Application');

	//create app tabs

	Ti.App.tabs = createTabs();

	Ti.App.addEventListener('logout', function(e) {
    	    	
    	self.close();
    	Ti.App.ctb.close();
		
		for(i=0;i<Ti.App.tabs.length;i++){
			self.removeTab(Ti.App.tabs[i]);
		}
    	
    	Ti.App.tabs = createTabs();
    	
    	for(i=0;i<Ti.App.tabs.length;i++){
			Ti.App.tabGroup.addTab(Ti.App.tabs[i]);
		}
    	
		Ti.App.tabGroup.open();
		
		Ti.App.ctb = new CustomTabBar({
    		tabBar: Ti.App.tabGroup,
    		imagePath: 'images/',
    		width: 56,
    		hidden: true,
    		height: 45,
    		items: [
        		{ image: 'home.png', selected: 'home_over.png' },
        		{ image: 'explore.png', selected: 'explore_over.png' },
        		{ image: 'create.png', selected: 'create_over.png' },
        		{ image: 'profile.png', selected: 'profile_over.png' },
        		{ image: 'feed.png', selected: 'feed_over.png' }
    		]
   		});
				
	});

	for(i=0;i<Ti.App.tabs.length;i++){
		self.addTab(Ti.App.tabs[i]);
	}

	return self;

};

var createTabs = function(){
	
	var logged_in = Ti.App.Properties.getBool('logged_in', false);
	var Application = require('ui/common/Application');
	
	var tabs = [];
	
	var home = Titanium.UI.createWindow({
    	title: L('Loumii'),
    	url: '/ui/pages/home.js',
    	tabBarHidden: true,
    	navBarHidden: !logged_in,
    	barImage: "/images/barImage.png"
	});

	home.setTitleControl(Application.createTitle("Loumii"));

	var homeTab = Ti.UI.createTab({
		title: L('home'),
		icon: '/images/KS_nav_ui.png',
		window: home
	});

	home.containingTab = homeTab;
	
	tabs.push(homeTab);
	
	var explore = Titanium.UI.createWindow({
		title: L('Explore'),
    	url: '/ui/explore/index.js',
    	tabBarHidden: true,
    	barImage: "/images/barImage.png"
	});

	explore.setTitleControl(Application.createTitle("Explore"));

	var exploreTab = Ti.UI.createTab({
		title: L('Explore'),
		icon: '/images/KS_nav_views.png',
		window: explore
	});
	explore.containingTab = exploreTab;

	tabs.push(exploreTab);

	var create = Titanium.UI.createWindow({
    	title: L('New Event'),
    	url: '/ui/events/create.js',
    	tabBarHidden: true,
    	barImage: "/images/barImage.png"
	});

	create.setTitleControl(Application.createTitle("New Event"));

	var createTab = Ti.UI.createTab({
		title: L('New Event'),
		icon: '/images/KS_nav_ui.png',
		window: create
	});

	create.containingTab = createTab;

	tabs.push(createTab);

	var profile = Titanium.UI.createWindow({
    	title: L(' '),
    	url: '/ui/profile/show.js',
    	tabBarHidden: true,
    	barImage: "/images/barImage.png"
	});

	profile.setTitleControl(Application.createTitle(" "));

	var profileTab = Ti.UI.createTab({
		title: L('Profile'),
		icon: '/images/KS_nav_views.png',
		window: profile
	});
	profile.containingTab = profileTab;
	
	tabs.push(profileTab);

	var feed = Titanium.UI.createWindow({
    	title: L('Feed'),
    	url: '/ui/feed/index.js',
    	tabBarHidden: true,
    	barImage: "/images/barImage.png"
	});

	feed.setTitleControl(Application.createTitle("Feed"));

	var feedTab = Ti.UI.createTab({
		title: L('Feed'),
		icon: '/images/KS_nav_views.png',
		window: feed
	});
	feed.containingTab = feedTab;
	
	tabs.push(feedTab);
	
	return tabs;
		
}

module.exports = ApplicationTabGroup;