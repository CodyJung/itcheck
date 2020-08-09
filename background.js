(function (ITCheck) {
	function addUpdaterAlarm() {
		ITCheck.storage.storageGet(ITCheck.storage.checkIntervalKey, function (checkIntervalMinutes) {
			if (!checkIntervalMinutes) {
				checkIntervalMinutes = ITCheck.DefaultCheckIntervalMinutes;
			}
			chrome.alarms.create("updater", {
				"periodInMinutes": checkIntervalMinutes
			});
		});
	}

	// Get things rolling
	chrome.alarms.onAlarm.addListener(ITCheck.getUnreadThreadCount);
	chrome.runtime.onStartup.addListener(addUpdaterAlarm);

	// According to https://developer.chrome.com/extensions/runtime#event-onInstalled this runs on install, update, and when chrome is updated
	chrome.runtime.onInstalled.addListener(function (details) {
		ITCheck.storage.storageGet(ITCheck.storage.hasInstalledKey, function (hasAlreadyInstalled) {
			addUpdaterAlarm();
			if (hasAlreadyInstalled) {
				return;
			}
			ITCheck.storage.storageSet(ITCheck.storage.hasInstalledKey, true);
			chrome.tabs.create({
				url: "/options/options.html"
			}, function (tab) {});
		});
	});

	// Update number on navigate to a new thread
	chrome.webNavigation.onCompleted.addListener(function (details) {
		ITCheck.getUnreadThreadCount(null);
	}, {
		url: [{
			hostSuffix: 'ivorytower.com',
			pathPrefix: '/IvoryTower/ForumThread.aspx'
		}]
	});
})(window.ITCheck);