function getUnreadThreads() {
	// Download the main page
	$.get("http://ivorytower.com/IvoryTower/", function(data) {
	
		// Grab the number of unreads from the title
		var myRegex = /<title>\s+IvoryTower \((\d+)\)/;
		var notLoggedRegex = /<title>\s+IvoryTower - login\s+/;
		
		if(data.match(notLoggedRegex)){
			// Let the user know if they're not logged in.
			updateBadge("X");
			updatePopup("You must <a href='#' id='signIn'>log in</a> to IvoryTower first!");
			$("#signIn").click(function() {
				openSignInPage();
			});
		}else if(data.match(myRegex)){
			// If there are unread threads, update the badge
			var matches = myRegex.exec(data);
			numberOfUnread = matches[1];
			updateBadge(numberOfUnread);
			
			var firstUnread = /<a href="ForumThread.aspx\?Thread=(\d+)#New">([^<]+)</;
			var unread = firstUnread.exec(data);
			var popupString = "First Unread Thread:<br /><a href='#' id='readThread'>" + unread[2] + "</a><br /><br />";
			var skipString = "<span id='skipThread'>Mark as read</span>";
			updatePopup(popupString + skipString);
			
			$("#readThread").click(function() {
				openThread(unread[1]);
			});
			
			$("#skipThread").click(function() {
				skipThread(unread[1]);
			});
		} else {
			// Or set it to blank
			updateBadge("");
			updatePopup("No unread threads.<br /><a href='#' id='ITToday'>Go to IvoryTower Today</a>");
			
			$("#ITToday").click(function() {
				openIvoryTowerToday();
			});
		}
	})
	.fail(function() {
		updateBadge("X");
		updatePopup("Error contacting IT - is the server ok?");
	});
}

// Updates that little counter with either a number (if there are unread threads) or an "X" if not logged in.
// Also changes the color appropriately
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

// Replaces or appends the text in the popup.
function updatePopup(text){
	$("#result").html(text);
}

// Opens a thread in a new window.
function openThread(threadID){
	chrome.tabs.create({"url": "http://ivorytower.com/IvoryTower/ForumThread.aspx?Thread=" + threadID + "#New"});
	getUnreadThreads();
}

// Open IvoryTower Today
function openIvoryTowerToday(){
	chrome.tabs.create({"url": "http://ivorytower.com/IvoryTower/"});
}

// Open Sign-in page
function openSignInPage(){
	chrome.tabs.create({'url':'http://ivorytower.com/IvoryTower/Login.aspx'});
}

// Marks a thread as read without opening it.
function skipThread(threadID){
	$.get("http://ivorytower.com/IvoryTower/ForumThread.aspx?Thread=" + threadID, function(data2){					
		var nextUnread = /<a href="ForumThread.aspx\?Thread=(\d+)#New">([^<]+)</;
		if(data2.match(nextUnread)){
			var unread = nextUnread.exec(data2);
			var popupString = "First Unread Thread:<br /><a href='#' id='readThread'>" + unread[2] + "</a><br /><br />";
			var skipString = "<span id='skipThread'>Mark as read</span>";
			updatePopup(popupString + skipString);
			
			$("#readThread").click(function() {
				openThread(unread[1]);
			});
			
			$("#skipThread").click(function() {
				skipThread(unread[1]);
			});
		} else {
			updatePopup("No unread threads.<br /><a href='#' id='ITToday'>Go to IvoryTower Today</a>");
			
			$("#ITToday").click(function() {
				openIvoryTowerToday();
			});
		}
	})
	.fail(function() {
		updateBadge("X");
		updatePopup("Error contacting IT - is the server ok?");
	});
	
	getUnreadThreads();
}

$(document).ready(function() {
	getUnreadThreads();
});