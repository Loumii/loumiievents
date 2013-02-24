var w = Ti.UI.currentWindow;
var Application = require('ui/common/Application');

var back = Application.createBackButton();
w.leftNavButton = back;

var exploreSearch = Ti.UI.createScrollView({
        left:0,right:0,
        top:0,bottom:0,
        contentHeight:"auto",
    	contentWidth:'auto',
        showVerticalScrollIndicator:true,
        layout: "vertical"
});

var url = "http://www.loumii.com/explore.json";
var xhr = Ti.Network.createHTTPClient({
    onload: function(e) {
        var events = eval('('+this.responseText+')').events;
		Application.createEvents(events, exploreSearch);
    },
    onerror: function() {
        alert('Cannot connect to server');
    },
    timeout:30000
});
xhr.setRequestHeader("Content-Type","application/json");
xhr.open("GET", url);
xhr.send({
	type: w.type,
	style: w.style
});  // request is actually sent with this statement

w.add(exploreSearch);

w.addEventListener("close", function(){
	Ti.App.Properties.setInt("deleteEvent", null);
});
