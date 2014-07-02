function getUnreadThreads(alarm) {
	// Scrape the unread thread count page
	$.get("http://ivorytower.com/IvoryTower/Forums.asmx/GetUnreadThreadCount", function(data) {
	
		// Grab the number of unreads
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
		// Let the user know they're probably not logged in.
		updateBadge("X");
	});
}

function updateBadge(unread) {
	if(unread == "X"){
		chrome.browserAction.setBadgeBackgroundColor({color:[120, 120, 120, 255]});
		chrome.browserAction.setTitle({title: "Logged Out"});
	} else {
		chrome.browserAction.setBadgeBackgroundColor({color:[0, 0, 255, 255]});
		if(unread == ""){
			chrome.browserAction.setTitle({title:"No unread threads"});
		} else {
			chrome.browserAction.setTitle({title: unread + " unread threads"});
		}
	}
	
	chrome.browserAction.setBadgeText({text:unread});
}

// Get things rolling
chrome.alarms.onAlarm.addListener(getUnreadThreads);
chrome.runtime.onStartup.addListener(function () {
	chrome.alarms.create("updater", { "periodInMinutes": 1 });
});
chrome.runtime.onInstalled.addListener(function(details) {
	chrome.alarms.create("updater", { "periodInMinutes": 1 });
});

// Update number on navigate to a new thread
chrome.webNavigation.onCompleted.addListener(function (details) {
	getUnreadThreads(null);
},{url: [{hostSuffix: 'ivorytower.com', pathPrefix: '/IvoryTower/ForumThread.aspx'}]});

// Add cohort information to the current page
chrome.webNavigation.onCompleted.addListener(function (details) {
	addYearInfo();
},{url: [{hostSuffix: 'ivorytower.com'}]});