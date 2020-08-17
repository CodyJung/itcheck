(function (window, $) {
	let userIsLoggedIn = undefined;
	let lastUnreadThreadCheck = -1;
	const ITCheck = {
		OneDayDelayWhenLoggedOut: 1000 * 60 * 60 * 24,
		DefaultCheckIntervalMinutes: 5,
		baseUrl: "https://www.ivorytower.com/",
		getUnreadThreadCount: function (alarm, fromNavigation) {
			if (ITCheck.shouldSkipRequest(fromNavigation)) return;

			// Parse the Unread Count XML endpoint
			$.get(ITCheck.baseUrl + 'Forums.asmx/GetUnreadThreadCount', function (data) {
					const numberOfUnread = $(data).find('int').text();
					ITCheck.updateBadge(numberOfUnread);
				}, "xml")
				.fail(function () {
					ITCheck.setLoggedOut(); // Let the user know they're probably not logged in.
				});
		},

		setLoggedOut: function () {
			userIsLoggedIn = false;
			ITCheck.browserAction.updateBadgeAndTitle("X", "Logged Out", [120, 120, 120, 255]);
			ITCheck.popup.setLoadingSpinner(false);
			ITCheck.popup.showSignInParent(true);
		},

		updateBadge: function (unreadCount) {
			unreadCount = parseInt(unreadCount);
			userIsLoggedIn = true;
			const newBadgeText = unreadCount === 0 ? "" : unreadCount;
			const newTitle = (unreadCount === 0 ? "No" : unreadCount) + " unread threads";
			ITCheck.browserAction.updateBadgeAndTitle(newBadgeText, newTitle, [0, 0, 255, 255]);
			ITCheck.popup.setLoadingSpinner(false);
			ITCheck.popup.showITToday(unreadCount === 0);
			if (unreadCount === 0) {
				ITCheck.popup.setReadThread();
				ITCheck.popup.updatePopup('No unread threads.');
			}
		},
		shouldSkipRequest: function (requestCameFromNavigation) {
			if (requestCameFromNavigation) {
				// Don't skip request if the request came from a navigation event
				return false;
			} else if (userIsLoggedIn === undefined) {
				// userIsLoggedIn will be undefined when the extension loads the first time
				// and we definitely want to allow the first request to set it
				return false;
			} else if (userIsLoggedIn === true) {
				// if user is logged in, don't skip request
				return false;
			} else {
				// last we checked, the user was logged out. 
				// The extension indicates that in the badge, so no need to send regular requests
				const nextTimeToRequestAgain = lastUnreadThreadCheck + ITCheck.OneDayDelayWhenLoggedOut;
				const nextTimeIsHere = (nextTimeToRequestAgain <= Date.now());
				if (nextTimeIsHere) {
					lastUnreadThreadCheck = Date.now();
				}
				// if it's time to check again, do not skip request
				// if it's not time yet... skip request
				return !nextTimeIsHere;
			}
		},
		popup: {
			setReadThread: function (threadName) {
				if (threadName) {
					$('#readThread').text(threadName);
				} else {
					$('#readThread').text('');
				}
				ITCheck.popup.showUnreadThread(!!threadName);
			},

			showUnreadThread: function (shouldShow) {
				$('#unreadThreadParent').toggle(shouldShow);
			},

			showSignInParent: function (shouldShow) {
				$('#signInParent').toggle(shouldShow);
			},

			updatePopup: function (resultHtml) {
				$("#result").html(resultHtml);
			},

			setLoadingSpinner: function (active) {
				$('#loadingGif').toggle(active);
			},

			showITToday: function (shouldShow) {
				$('#ITToday').toggle(shouldShow);
			},
		},
		browserAction: {
			setBadgeText: function (newText) {
				chrome.browserAction.setBadgeText({
					text: newText.toString()
				});
			},

			setBadgeBackgroundColor: function (colorArray) {
				chrome.browserAction.setBadgeBackgroundColor({
					color: colorArray
				});
			},
			setTitle: function (newTitle) {
				chrome.browserAction.setTitle({
					title: newTitle
				});
			},
			updateBadgeAndTitle: function (badgeText, newTitle, badgeBackgroundColor) {
				ITCheck.browserAction.setBadgeText(badgeText);
				ITCheck.browserAction.setBadgeBackgroundColor(badgeBackgroundColor);
				ITCheck.browserAction.setTitle(newTitle);
			},
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
		},
		tabs: {
			createTab: function (url) {
				chrome.tabs.create({
					'url': url
				});
			},
			openIvoryTowerToday: function () {
				ITCheck.tabs.createTab(ITCheck.baseUrl);
			},
			openSignInPage: function () {
				ITCheck.tabs.createTab(ITCheck.baseUrl + 'Login.aspx');
			},
			openThread: function (threadId) {
				ITCheck.tabs.createTab(ITCheck.baseUrl + 'ForumThread.aspx?Thread=' + threadId + '#New');
			}
		}
	};
	const strg = ITCheck.storage;
	strg.storageSet(strg.shortcutKeys, strg.shortcutKeyKeys);
	// export on window
	window.ITCheck = ITCheck;
})(window, jQuery);