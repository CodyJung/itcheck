(function(window, $){
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
		return shouldSkip;
	}

	function getUnreadThreadCount(alarm) {
		if(shouldSkipRequest()) return;
		
		// Scrape the unread thread count page
		$.get(baseUrl + 'Forums.asmx/GetUnreadThreadCount', function(data) {
			var numberOfUnread = $(data).find('int').text();
			if(numberOfUnread == 0){
				updateBadge("");
			} else {
				updateBadge(numberOfUnread);
			}
		}, "xml")
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
	
	var storage = {
		storageGet: function(key, callback){
			var k = key;
			chrome.storage.sync.get(k, function(storageObj){
				callback(storageObj[k]);
			});
		},
		
		storageSet: function(key, val){
			var pair = {};
			pair[key] = val;
			chrome.storage.sync.set(pair);
		},
		
		shortcutsEnabledKey: 'ITCheck.shortcuts',
		showCohortsEnabledKey: 'ITCheck.showCohorts',
		shortcutKeys: 'ITCheck.shortcutKeys',
		shortcutKeyKeys: ["nextPost","previousPost", "unreadThread", "rateUp", "rateDown", "showHidden"],

		getShortcutKeyKey: function(name){
			return 'ITCheck.shortcutKey.'+name;
		},
		
	};
	
	storage.storageSet(storage.shortcutKeys, storage.shortcutKeyKeys);
	
	// core exports
	window.ITCheck.getUnreadThreadCount = getUnreadThreadCount;
	window.ITCheck.shouldSkipRequest = shouldSkipRequest;
	window.ITCheck.updateBadge = updateBadge;
	window.ITCheck.setTitle = setTitle;
	window.ITCheck.baseUrl = baseUrl;
	window.ITCheck.storage = storage;
	//window.ITCheck.storageSet = storageSet;
	//window.ITCheck.shortcutKeys = shortcutKeys;
	
})(window, jQuery);