var w = Ti.UI.currentWindow;
var win = Ti.UI.createWindow();

var navGroup = w.getNavGroup();

var Application = require('ui/common/Application');
var PagingControl = require('ui/common/PagingControl');

var loginView = Ti.UI.createView({
	layout: 'vertical',
	height: Ti.UI.size,
	width: Ti.UI.size
});

var createSeparator = function(){

	var seperator = Ti.UI.createView({
		height: 2,
		width: "100%"
	});

	var black = Ti.UI.createView({
		height: 1,
		borderWidth: 1,
		borderColor: "#000"
	});

	var grey = Ti.UI.createView({
		height: 1,
		borderWidth: 1,
		borderColor: "rgba(56,56,56,0.6)"
	});

	seperator.add(black);
	seperator.add(grey);

	return seperator;
}

var holder = Ti.UI.createView({
	height: 175,
	top: -65
})

image = Ti.UI.createImageView({
		image: "http://loumii.com/assets/Logo.png",
		preventDefaultImage: true,
		height: 230,
		top: -10
});

holder.add(image);

	var accessTokenKey = Ti.App.Properties.getString('twitterAccessTokenKey'),
        accessTokenSecret = Ti.App.Properties.getString('twitterAccessTokenSecret');

	var Twitter = require('/ui/common/twitter').Twitter;

	var client = Twitter({
      consumerKey: "MaKEFppTzjr7r8u57Uyw",
      consumerSecret: "kr835xrY7WZeVK7cQb0qUTlTI1qDFDtbALDhHEY",
      accessTokenKey: accessTokenKey, 
      accessTokenSecret: accessTokenSecret
    });

var facebookButton = Ti.UI.createButton({
	backgroundImage: "/images/fb.png",
	height: 40,
	width: 189,
	top: 3,
	left: 30
});
        	
loginView.add(holder);

var loginButtons = Ti.UI.createView({
	layout: "horizontal",
    height: Ti.UI.SIZE,
    width: Ti.UI.SIZE,
    bottom: 0,
    height: 50,
    background: "#fff"
});

var topBorder = Ti.UI.createView({
	width: "100%",
    height: 1,
	borderWidth: 1,
	borderColor: "#666666",
	top: 0
});

var socialButtons = Ti.UI.createView({
	layout: "horizontal",
    height:Ti.UI.SIZE,
    width: Ti.UI.SIZE,
	bottom: 0,
	height: 45,
	backgroundColor: "#fff",
	backgroundGradient:{
		type:'linear',
		colors:['#fefefe','#e6e6e6']
	},
	width: "100%"
});

socialButtons.add(topBorder);

var moreButton = Ti.UI.createButton({
	backgroundImage: "/images/more.png",
	height: 40,
	width: 73,
	top: 3
});

var tooltipHolder = Ti.UI.createView({
	height: 118,
	width: 150,
	bottom: 25,
	right: 35,
	zIndex: 2,
	layout: "vertical",
	visible: false
});

var tooltip = Ti.UI.createView({
	height: 100,
	width: 150,
	layout: "vertical",
	borderRadius: 10,
	backgroundGradient:{
		type:'linear',
		colors:["rgba(14,14,14,0.9)", "rgba(14,14,14,1)"]
	}
});

var downArrow = Ti.UI.createImageView({
	image: "/images/down-arrow.png",
	height: 28,
	width: 18,
	top: -8,
	left: 112
});

tooltipHolder.add(tooltip);
tooltipHolder.add(downArrow);

var signupButton = Ti.UI.createButton({
	width: "100%",
	height: 31,
	title: "Sign up with email",
	color: "#fff",
	font:{
		fontFamily: "Helvetica Neue",
		fontWeight: "bold",
		fontSize: 13
	},
	style: Titanium.UI.iPhone. SystemButtonStyle.PLAIN,
	textAlign: "center"
});

var twitterButton = Ti.UI.createButton({
	width: "100%",
	height: 31,
	title: "Sign up with Twitter",
	color: "#fff",
	font:{
		fontFamily: "Helvetica Neue",
		fontWeight: "bold",
		fontSize: 13
	},
	style: Titanium.UI.iPhone. SystemButtonStyle.PLAIN,
	textAlign: "center"
});


var loginButton = Ti.UI.createButton({
	width: "100%",
	height: 31,
	title: "Log In",
	color: "#fff",
	font:{
		fontFamily: "Helvetica Neue",
		fontWeight: "bold",
		fontSize: 13
	},
	style: Titanium.UI.iPhone. SystemButtonStyle.PLAIN,
	textAlign: "center"
});

tooltip.add(signupButton);
tooltip.add(createSeparator());
tooltip.add(twitterButton);
tooltip.add(createSeparator());
tooltip.add(loginButton);

var scrollableEvents = Ti.UI.createScrollableView({
    showPagingControl: false,
    height: 195,
    top: 20,
    horizontalWrap: true
});

eventViews = [];

var tr = Ti.UI.create2DMatrix();

tr = tr.rotate(-3);

eventImages = Application.homeImages();

for(i=0;i<eventImages.length;i++){

	var otherView = Ti.UI.createView({
		height: 193,
		width: 180,
		layout: "vertical",
		title: eventImages[i].title,
		date: eventImages[i].date,
		transform: tr
	});

	var holderView = Ti.UI.createView({
		borderColor: "#fff",
		backgroundColor: "#fff",
		borderWidth: 6,
		height: 180,
		width: 180,
		top: 3
	});

	var image = Ti.UI.createImageView({
		image: eventImages[i].url,
		height: 179,
		width: 179
	});

	var shadow = Ti.UI.createImageView({
		image: "/images/shadow2.png",
		height: 10,
		width: 180
	});

	holderView.add(image);

	otherView.add(holderView);
	otherView.add(shadow);

	eventViews.push(otherView);

}

scrollableEvents.views = eventViews;

var scrollablePagingControl = new PagingControl(scrollableEvents, {top: 15});

var title = Ti.UI.createLabel({
	text: eventViews[0].title,
	font:{
		fontWeight: "bold",
		fontSize: 18
	},
	top: 8,
	textAlign: "center",
	height: 18,
	left: 0,
	width: "100%",
	color: "#333333"
});

var date = Ti.UI.createLabel({
	text: eventViews[0].date,
	textAlign: "center",
	left: 0,
	width: "100%",
	color: "#333333"
});

loginView.add(scrollableEvents);
loginView.add(title);
loginView.add(date);
loginView.add(scrollablePagingControl);

socialButtons.add(facebookButton);
socialButtons.add(moreButton);

win.add(loginView);
win.add(socialButtons);
win.add(tooltipHolder);
w.add(win);

	var signupWindow = Ti.UI.createWindow({
		url: '/ui/pages/signup.js',
		navBarHidden: false,
		backButtonTitle: "Back",
		barImage: "/images/barImage.png",
		backButtonTitle: ''
	});		

	signupWindow.setTitleControl(Application.createTitle("Sign Up"));

	signupWindow.getNavGroup = function(){
		return navGroup;
	}

	var signinWindow = Ti.UI.createWindow({
		url: '/ui/pages/signin.js',
		navBarHidden: false,
		backButtonTitle: "Back",
		barImage: "/images/barImage.png",
		backButtonTitle: ''
	});		

	signinWindow.setTitleControl(Application.createTitle("Log In"));

	signinWindow.getNavGroup = function(){
		return navGroup;
	}

    twitterButton.addEventListener("click", function(){
    	twitterButton.backgroundColor = "rgba(76,76,76,0.3)"
    	client.authorize();
    });

    Ti.Facebook.appid = '338560002896302';
    Ti.Facebook.permissions = ['publish_stream, email'];
    Ti.Facebook.addEventListener('login', function(e) {
        if (e.success) {
        	var user = e.data;
        	user.image = "https://graph.facebook.com/" + user.id + "/picture?type=large";
        	createUser(user, "facebook");
        }
        else if (e.error) {
            alert(e.error);
            facebookButton.addEventListener("click", function(){
				Titanium.Facebook.authorize();
			});
        } 
        else if (e.cancelled) {
            alert("Canceled");
            facebookButton.addEventListener("click", function(){
				Titanium.Facebook.authorize();
			});
        }
    });

	client.addEventListener('login', function(e) {
      if (e.success){
      	Ti.App.Properties.setString('twitterAccessTokenKey', e.accessTokenKey);
        Ti.App.Properties.setString('twitterAccessTokenSecret', e.accessTokenSecret);

        client.request("1/account/verify_credentials.json", {}, 'GET', function(e) {
          if (e.success) {
			var user = eval('('+e.result.text+')');
			user.image = user.profile_image_url;
			createUser(user, "twitter");
          } else  {
            alert(e.error);
                twitterButton.addEventListener("click", function(){
    				twitterButton.backgroundColor = "rgba(76,76,76,0.3)"
    				client.authorize();
    			});
          }
         });
         
       } 
      else{
          alert(e.error);
          twitterButton.addEventListener("click", function(){
    	  	twitterButton.backgroundColor = "rgba(76,76,76,0.3)"
    		client.authorize();
    	  });
      }
    });

	signupButton.addEventListener("click", function(){
		signupButton.backgroundColor = "rgba(76,76,76,0.3)";
		navGroup.open(signupWindow);
		tooltipHolder.hide();
	});

	loginButton.addEventListener("click", function(){
		loginButton.backgroundColor = "rgba(76,76,76,0.3)";
		navGroup.open(signinWindow);
		tooltipHolder.hide();
	});

createUser = function(user, provider, url){

	var url = url || "http://loumii.com/social/users.json";
	var xhr = Ti.Network.createHTTPClient({
    	onload: function(e) {
        	var user = eval('('+this.responseText+')');
        	
        	if(user.valid && !user.taken_email){
        	
        		Ti.App.Properties.setBool('logged_in',true);
        		Ti.App.Properties.setBool('social', user.social);
        		Ti.App.Properties.setInt('user_id', user.id);
        		Ti.App.Properties.setString('liked_events', JSON.stringify(user.liked_events));
        	
        		if(win){
        			navGroup.close(signinWindow);
        			navGroup.close(signupWindow);
        		}
        	
    			Ti.App.appWindow.close();
    		}
    		else if(user.taken_email){
    			alert("Sorry that email address has already been taken, please try another.")
    		}
    		else{
    			alert("Invalid Username/Password");
    		}
    		
    	},
    	onerror: function() { 		
        	alert('Cannot connect to server');
    	},
    	timeout:30000
	});
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.open("POST", url);
	xhr.send({
		name: user.name,
		uid: user.id,
		provider: provider,
		email: user.email,
		password: user.password,
		image: user.image,
		_method: user.method
	});
}

facebookButton.addEventListener("click", function(){
	Titanium.Facebook.authorize();
});

moreButton.addEventListener("click", function(){
	tooltipHolder.visible = !tooltipHolder.visible;
});

scrollableEvents.addEventListener("scrollEnd", function(event){
	title.text = event.view.title;
	date.text = event.view.date;
})

Ti.App.addEventListener("createUser", function(data){
	createUser(data.user, data.provider, data.url);
});

w.addEventListener("focus", function(){
	twitterButton.backgroundColor = null;
	signupButton.backgroundColor = null;
	loginButton.backgroundColor = null;
});