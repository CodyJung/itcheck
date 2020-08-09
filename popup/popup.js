/* global chrome */
/* global jQuery */
/* global ITCheck */
(function (ITCheck, $) {
	function createTab(url) {
		chrome.tabs.create({
			'url': url
		});
	}

	function getUnreadThreads() {
		if (ITCheck.shouldSkipRequest()) return;

		// Download the main page
		$.get(ITCheck.baseUrl, function (data) {
				// Grab the number of unreads from the title
				var myRegex = /<title>\s+IvoryTower \((\d+)\)/;
				var notLoggedRegex = /<title>\s+IvoryTower - login\s+/;

				if (data.match(notLoggedRegex)) {
					// Let the user know if they're not logged in.
					ITCheck.updateBadge("X");
					updatePopup("You must <a href='#' id='signIn'>log in</a> to IvoryTower first!");
					$("#signIn").click(function () {
						openSignInPage();
					});
				} else if (data.match(myRegex)) {
					// If there are unread threads, update the badge
					var matches = myRegex.exec(data);
					var numberOfUnread = matches[1];
					ITCheck.updateBadge(numberOfUnread);

					var firstUnread = /<a href="ForumThread.aspx\?Thread=(\d+)#New">([^<]+)</;
					var unread = firstUnread.exec(data);
					// TODO assemble this less manually
					var popupString = "First Unread Thread:<br /><a href='#' id='readThread'>" + unread[2] + "</a><br /><br />";
					var skipString = "<span id='skipThread'>Mark as read</span>";
					updatePopup(popupString + skipString);

					$("#readThread").click(function () {
						openThread(unread[1]);
					});

					$("#skipThread").click(function () {
						skipThread(unread[1]);
					});
				} else {
					// Or set it to blank
					ITCheck.updateBadge("");
					// TODO assemble this less manually
					updatePopup("No unread threads.<div><a href='#' id='ITToday'>Go to IvoryTower Today</a></div>");

					$("#ITToday").click(function () {
						openIvoryTowerToday();
					});
				}
			})
			.fail(function () {
				ITCheck.updateBadge("X");
				updatePopup("Error contacting IT - is the server ok?");
			});
	}

	// Replaces or appends the text in the popup.
	function updatePopup(text) {
		const newHtml = text + `<div><a href='/options/options.html'>View Options Page</a></div>`;
		$("#result").html(newHtml);
	}

	// Opens a thread in a new window.
	function openThread(threadID) {
		createTab(ITCheck.baseUrl + 'ForumThread.aspx?Thread=' + threadID + '#New');
		getUnreadThreads();
	}

	// Open IvoryTower Today
	function openIvoryTowerToday() {
		createTab(ITCheck.baseUrl);
	}

	// Open Sign-in page
	function openSignInPage() {
		createTab(ITCheck.baseUrl + 'Login.aspx');
	}

	// Marks a thread as read without opening it.
	function skipThread(threadID) {
		$.get(ITCheck.baseUrl + "ForumThread.aspx?Thread=" + threadID, function (data2) {
				var nextUnread = /<a href="ForumThread.aspx\?Thread=(\d+)#New">([^<]+)</;
				if (data2.match(nextUnread)) {
					var unread = nextUnread.exec(data2);
					// TODO assemble this less manually
					var popupString = "First Unread Thread:<br /><a href='#' id='readThread'>" + unread[2] + "</a><br /><br />";
					var skipString = "<span id='skipThread'>Mark as read</span>";
					updatePopup(popupString + skipString);

					$("#readThread").click(function () {
						openThread(unread[1]);
					});

					$("#skipThread").click(function () {
						skipThread(unread[1]);
					});
				} else {
					// TODO assemble this less manually
					updatePopup("No unread threads.<br /><a href='#' id='ITToday'>Go to IvoryTower Today</a>");

					$("#ITToday").click(function () {
						openIvoryTowerToday();
					});
				}
			})
			.fail(function () {
				ITCheck.updateBadge("X");
				updatePopup("Error contacting IT - is the server ok?");
			});

		getUnreadThreads();
	}

	$(document).ready(function () {
		getUnreadThreads();
	});
})(window.ITCheck, jQuery);