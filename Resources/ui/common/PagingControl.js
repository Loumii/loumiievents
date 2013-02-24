PagingControl = function(scrollableView, args){
	
	var container = Titanium.UI.createView({
		height:Ti.UI.SIZE,
		width:Ti.UI.SIZE,
        layout: 'horizontal',
        top: args.top || 0
	});
	// Keep a global reference of the available pages
	var numberOfPages = scrollableView.getViews().length;

	var pages = []; // without this, the current page won't work on future references of the module

	// Go through each of the current pages available in the scrollableView
	for (var i = 0; i < numberOfPages; i++) {
		var page = Titanium.UI.createView({
			borderRadius: 4,
			width: 8,
			height: 8,
			right: 10,
			backgroundColor: "#999999",
			bottom: 10
		});
		// Store a reference to this view
		
		if(args.first && (pages.length == 0 || pages.length %10 == 0)){
			page.left = 10;
		}
		
		pages.push(page);
		// Add it to the container
		container.add(page);
	}

	// Mark the initial selected page
	pages[scrollableView.getCurrentPage()].backgroundColor = "#666666";
		
	// Callbacks
	onScroll = function(event){
						
		// This will cover all it needs to
		if(pages[event.currentPage-1]){
			pages[event.currentPage-1].backgroundColor = "#999999";
		}
		if(pages[event.currentPage+1]){
			pages[event.currentPage+1].backgroundColor = "#999999";
		}
		// Bump the opacity of the new current page
		pages[event.currentPage].backgroundColor = "#666666";

	};

	// Attach the scroll event to this scrollableView, so we know when to update things
	scrollableView.addEventListener("scroll", onScroll);
	
	scrollableView.addEventListener("refresh", function(){
		Ti.API.log(scrollableView.getCurrentPage());
		pages[scrollableView.getCurrentPage()].backgroundColor = "#666666";
	});
	
	// Reset page control to default page when scollableView refresh
	//scrollableView.addEventListener("postlayout", onPostLayout);

	Ti.App.addEventListener("refreshPagination", function(data){
		
		if(!data.destroy){
		
			if(scrollableView.type == data.itemType){
			
				var page = Titanium.UI.createView({
					borderRadius: 4,
					width: 8,
					height: 8,
					right: 10,
					backgroundColor: "#999999",
					bottom: 10
				});
			
				pages.push(page);
			
				container.add(page);
							
			}
		}
		else{
						
			if(scrollableView.type == data.itemType){
				
				pages.splice(data.page, 1);
				container.remove(container.children[data.page]);
				
			}
			
		}
		
	});
	
	return container;
};

module.exports = PagingControl;