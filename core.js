(function(window){
	window.ITCheck = window.ITCheck || {};
	
	var baseUrl = "http://ivorytower.com/IvoryTower/";
	var isLoggedIn = false;
	var lastCheck = 1;
	var delayIfLoggedOut = 1000 * 60 * 10; // 10 minutes

	function shouldSkipRequest(){
		if(isLoggedIn) return false;
		var shouldSkip = (lastCheck + delayIfLoggedOut > Date.now());
		if(!shouldSkip){
			lastCheck = Date.now();
		}
	}

	function getUnreadThreadCount(alarm) {
		if(shouldSkipRequest()) return;
		lastCheck = Date.now();
		
		// Scrape the unread thread count page
		$.get(baseUrl + 'Forums.asmx/GetUnreadThreadCount', function(data) {
			// Grab the number of unread threads
			var myRegex = /">(\d+)</;
			
			if(data.match(myRegex)){
				// If there are unread threads, update the badge
				var matches = myRegex.exec(data);
				numberOfUnread = matches[1];
				if(numberOfUnread == 0){
					updateBadge("");
				} else {
					updateBadge(numberOfUnread);
				}
			} else {
				// Or set it to blank
				updateBadge("");
			}
		}, "html")
		.fail(function(){
			updateBadge("X"); // Let the user know they're probably not logged in.
		});
	}

	function updateBadge(unreadCount) {
		if(unreadCount == "X"){
			isLoggedIn = false;
			setBadgeBackgroundColor([120, 120, 120, 255]);
			setTitle("Logged Out");
		} else {
			isLoggedIn = true;
			setBadgeBackgroundColor([0, 0, 255, 255]);
			setTitle((unreadCount == "" ? "No " : unreadCount) + " unread threads");
		}	
		setBadgeText(unreadCount);
	}
	
	function setBadgeText(newText){
		chrome.browserAction.setBadgeText({text:newText});
	}
	
	function setBadgeBackgroundColor(colorArray){
		chrome.browserAction.setBadgeBackgroundColor({color:colorArray});
	}

	function setTitle(newTitle){
		chrome.browserAction.setTitle({ title: newTitle});
	}
	
	window.ITCheck.getUnreadThreadCount = getUnreadThreadCount;
	window.ITCheck.shouldSkipRequest = shouldSkipRequest;
	window.ITCheck.updateBadge = updateBadge;
	window.ITCheck.setTitle = setTitle;
	window.ITCheck.baseUrl = baseUrl;
})(window);