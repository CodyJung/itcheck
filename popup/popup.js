/* global chrome */
/* global jQuery */
/* global ITCheck */
(function (ITCheck, $) {
	const firstUnreadRegex = /<a href="ForumThread.aspx\?Thread=(\d+)#New">([^<]+)</;
	const unreadThreadCountRegex = /<title>\s+IvoryTower \((\d+)\)/;
	const notLoggedInRegex = /<title>\s+IvoryTower - login\s+/;

	function updateUnreadThread(data, updateCount) {
		if (updateCount) {
			const matches = unreadThreadCountRegex.exec(data);
			const numberOfUnread = matches[1];
			ITCheck.updateBadge(numberOfUnread);
		}
		const unread = firstUnreadRegex.exec(data);
		ITCheck.popup.setReadThread(unread[2]);
		$("#readThread").click(function () {
			openThread(unread[1]);
		});

		$("#skipThread").click(function () {
			skipThread(unread[1]);
		});
	}

	function getUnreadThreadInfoForPopup() {
		if (ITCheck.shouldSkipRequest(true)) return;
		ITCheck.popup.setLoadingSpinner(true);
		// Download the main page
		$.get(ITCheck.baseUrl, function (data) {
				// Grab the number of unreads from the title
				const userIsNotLoggedIn = data.match(notLoggedInRegex);
				const thereAreUnreadThreads = data.match(unreadThreadCountRegex);
				if (userIsNotLoggedIn) {
					ITCheck.setLoggedOut();
				} else if (thereAreUnreadThreads) {
					updateUnreadThread(data, true);
				} else {
					ITCheck.updateBadge(0);
				}
			})
			.fail(function () {
				ITCheck.setLoggedOut();
				ITCheck.popup.updatePopup("Error contacting IT - is the server ok?");
			});
	}

	// Opens a thread in a new window.
	function openThread(threadID) {
		ITCheck.tabs.openThread(threadID);
		getUnreadThreadInfoForPopup();
	}

	// Marks a thread as read by "opening it" silently without the user seeing it
	function skipThread(threadID) {
		ITCheck.popup.setLoadingSpinner(true);
		$.get(ITCheck.baseUrl + "ForumThread.aspx?Thread=" + threadID, function (data2) {
				const thereAreUnreadThreads = data2.match(firstUnreadRegex);
				if (thereAreUnreadThreads) {
					updateUnreadThread(data2, false);
				} else {
					ITCheck.updateBadge(0);
					ITCheck.popup.showUnreadThread(false);
				}
			})
			.fail(function () {
				ITCheck.setLoggedOut();
				ITCheck.popup.updatePopup("Error contacting IT - is the server ok?");
			}).done(getUnreadThreadInfoForPopup);
	}

	$(document).ready(function () {
		$("#signIn").click(function () {
			ITCheck.tabs.openSignInPage();
		});
		$("#ITToday").click(function () {
			ITCheck.tabs.openIvoryTowerToday();
		});
		getUnreadThreadInfoForPopup();
	});
})(window.ITCheck, jQuery);