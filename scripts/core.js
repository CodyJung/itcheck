(function (window, $) {
	let isLoggedIn = undefined;
	let lastUnreadThreadCheck = -1;
	const delayIfLoggedOut = 1000 * 60 * 60 * 24; // 24 hours
	var ITCheck = {
		DefaultCheckIntervalMinutes: 5,
		baseUrl: "https://www.ivorytower.com/IvoryTower/",
		getUnreadThreadCount: function (alarm, fromNavigation) {
			if (ITCheck.shouldSkipRequest(fromNavigation)) return;

			// Scrape the unread thread count page
			$.get(ITCheck.baseUrl + 'Forums.asmx/GetUnreadThreadCount', function (data) {
					var numberOfUnread = $(data).find('int').text();
					ITCheck.updateBadge(numberOfUnread);
				}, "xml")
				.fail(function () {
					ITCheck.setLoggedOut(); // Let the user know they're probably not logged in.
				});
		},

		setLoggedOut: function () {
			isLoggedIn = false;
			setBadgeBackgroundColor([120, 120, 120, 255]);
			ITCheck.setTitle("Logged Out");
			setBadgeText("X");
		},

		updateBadge: function (unreadCount) {
			isLoggedIn = true;
			setBadgeBackgroundColor([0, 0, 255, 255]);
			ITCheck.setTitle((unreadCount === 0 ? "No" : unreadCount) + " unread threads");
			const newBadgeText = unreadCount === 0 ? "" : unreadCount;
			setBadgeText(newBadgeText);
		},
		shouldSkipRequest: function (fromNavigation) {
			if (fromNavigation || isLoggedIn === false) {
				// Don't skip updates if the request came from a navigation event on IT 
				// OR if user is logged in
				// isLoggedIn will be undefined initially, allowing us to set isLoggedIn
				return false;
			}
			const nextCheckTime = lastUnreadThreadCheck + delayIfLoggedOut;
			var nextTimeIsHere = (nextCheckTime <= Date.now());
			if (nextTimeIsHere) {
				lastUnreadThreadCheck = Date.now();
			}
			return !nextTimeIsHere;
		},
		setTitle: function (newTitle) {
			chrome.browserAction.setTitle({
				title: newTitle
			});
		},
		storage: {
			storageGet: function (key, callback) {
				var k = key;
				chrome.storage.sync.get(k, function (storageObj) {
					callback(storageObj[k]);
				});
			},

			storageSet: function (key, val) {
				var pair = {};
				pair[key] = val;
				chrome.storage.sync.set(pair);
			},

			shortcutsEnabledKey: 'ITCheck.shortcuts',
			showCohortsEnabledKey: 'ITCheck.showCohorts',
			checkIntervalKey: 'ITCheck.checkInterval',
			shortcutKeys: 'ITCheck.shortcutKeys',
			hasInstalledKey: 'ITCheck.hasInstalled',
			shortcutKeyKeys: ["nextPost", "previousPost", "unreadThread", "rateUp", "unRate", "rateDown", "flagPost", "replyToPost", "showHidden"],

			getShortcutKeyKey: function (name) {
				return 'ITCheck.shortcutKey.' + name;
			},

		}
	};
	var storage = ITCheck.storage;
	storage.storageSet(storage.shortcutKeys, storage.shortcutKeyKeys);

	function setBadgeText(newText) {
		chrome.browserAction.setBadgeText({
			text: newText
		});
	}

	function setBadgeBackgroundColor(colorArray) {
		chrome.browserAction.setBadgeBackgroundColor({
			color: colorArray
		});
	}

	// export on window
	window.ITCheck = ITCheck;
})(window, jQuery);