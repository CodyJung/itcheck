(function(window, $){
	//window.ITCheck = window.ITCheck || {};
	
	var ITCheck = {
		baseUrl: "https://www.ivorytower.com/IvoryTower/",
		getUnreadThreadCount: function(alarm) {
			if(ITCheck.shouldSkipRequest()) return;
			
			// Scrape the unread thread count page
			$.get(ITCheck.baseUrl + 'Forums.asmx/GetUnreadThreadCount', function(data) {
				var numberOfUnread = $(data).find('int').text();
				if(numberOfUnread == 0){
					ITCheck.updateBadge("");
				} else {
					ITCheck.updateBadge(numberOfUnread);
				}
			}, "xml")
			.fail(function(){
				ITCheck.updateBadge("X"); // Let the user know they're probably not logged in.
			});
		},
		
		updateBadge: function(unreadCount) {
			if(unreadCount == "X"){
				isLoggedIn = false;
				setBadgeBackgroundColor([120, 120, 120, 255]);
				ITCheck.setTitle("Logged Out");
			} else {
				isLoggedIn = true;
				setBadgeBackgroundColor([0, 0, 255, 255]);
				ITCheck.setTitle((unreadCount == "" ? "No" : unreadCount) + " unread threads");
			}	
			setBadgeText(unreadCount);
		},
		shouldSkipRequest: function(){
			if(isLoggedIn) return false;
			var shouldSkip = (lastCheck + delayIfLoggedOut > Date.now());
			if(!shouldSkip){
				lastCheck = Date.now();
			}
			return shouldSkip;
		},
		setTitle: function(newTitle){
			chrome.browserAction.setTitle({ title: newTitle});
		},
		storage: {
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
			
		}
	};
	var storage = ITCheck.storage;
	storage.storageSet(storage.shortcutKeys, storage.shortcutKeyKeys);
	var isLoggedIn = false;
	var lastCheck = 1;
	var delayIfLoggedOut = 1000 * 60 * 10; // 10 minutes

	function setBadgeText(newText){
		chrome.browserAction.setBadgeText({text:newText});
	}
	
	function setBadgeBackgroundColor(colorArray){
		chrome.browserAction.setBadgeBackgroundColor({color:colorArray});
	}

	// export on window
	window.ITCheck = ITCheck;
})(window, jQuery);