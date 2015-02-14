(function(window){
	window.ITCheck = window.ITCheck || {};

	// Get things rolling
	chrome.alarms.onAlarm.addListener(ITCheck.getUnreadThreadCount);
	chrome.runtime.onStartup.addListener(function () {
		chrome.alarms.create("updater", { "periodInMinutes": 1 });
	});
	chrome.runtime.onInstalled.addListener(function(details) {
		chrome.alarms.create("updater", { "periodInMinutes": 1 });
	});

	// Update number on navigate to a new thread
	chrome.webNavigation.onCompleted.addListener(function (details) {
		ITCheck.getUnreadThreadCount(null);
	},{url: [{hostSuffix: 'ivorytower.com', pathPrefix: '/IvoryTower/ForumThread.aspx'}]});
});
})(window);