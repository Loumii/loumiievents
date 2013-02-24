var w = Ti.UI.currentWindow;
var ApplicationWindow = require('ui/common/ApplicationWindow');
var Application = require('ui/common/Application');

var homeView = Ti.UI.createScrollView({
        left:0,right:0,
        top:0,bottom:0,
        contentHeight:"auto",
    	contentWidth:'auto',
        showVerticalScrollIndicator:true,
        layout: "vertical"
});

w.addEventListener("focus", function(){
	var logged_in = Ti.App.Properties.getBool('logged_in');
	if(!logged_in){
		Ti.App.appWindow = new ApplicationWindow();
		setTimeout(function(){
			Ti.App.appWindow.open({modal: true, animated: false});
		}, 50);
	}
	if(logged_in && homeView.children.length <= 0){
		w.showNavBar();
		Ti.App.ctb.show();
		getFollowerInfo();
	}
});

var getFollowerInfo = function(){
	
var url = "http://www.loumii.com/users/" + Ti.App.Properties.getInt('user_id') + "/following.json";
var xhr = Ti.Network.createHTTPClient({
    onload: function(e) {
        
        var events = eval('('+this.responseText+')');
		
		if(homeView.children.length){
			
			for(i=0;i<homeView.children.length;i++){
				homeView.remove(homeView.children[i]);
			}
			
			for(i=0;i<homeView.children.length;i++){
				homeView.remove(homeView.children[i]);
			}
			
		}

		if(events.following_events.length){
			Application.createEvents(events.following_events, homeView);
		}
		else{
			var noFollowing = Ti.UI.createLabel({
				top: 15,
				font: {
					fontSize: "14dp",
					fontWeight: "bold"
				},
				textAlign: "center",
				width: 300,
				text: "No events to show. \n Follow people to see their events here."
			});
			homeView.add(noFollowing);
		}
		
		Ti.App.fireEvent("refresh_profile", {refresh_type: "Following", events: events.following_events});
				 
    },
    onerror: function() {
        alert('Cannot connect to server');
    },
    timeout:30000 
});
xhr.setRequestHeader("Content-Type","application/json");
xhr.open("GET", url);
xhr.send(); 
	
}

w.add(homeView);

Ti.App.addEventListener("refresh_following", function(data){
	if(data.like && !Ti.App.ctb.currentTab() == 0){
		getFollowerInfo();
	}
	else if(!data.like){
		getFollowerInfo();
	}
});
