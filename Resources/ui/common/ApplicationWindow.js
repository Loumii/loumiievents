//Application Window Component Constructor
function ApplicationWindow() {

	var main = Ti.UI.createWindow({
		navBarHidden: true,
		backgroundImage: "/images/background.jpg"
	});

	var window1 = Ti.UI.createWindow({
		title: "Home",
		url: '/ui/pages/login.js',
		navBarHidden: true,
		barImage: "/images/barImage.png"
	});

	window1.getNavGroup = function(){
		return navGroup;
	}

	var navGroup = Ti.UI.iPhone.createNavigationGroup({
		window: window1
	});

	main.add(navGroup);

	return main;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;