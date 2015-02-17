(function(win, $){	
	
	function runShortcuts(val){
		if(!val){
			return;
		}
		
		function doNextUnreadThread(){
			var masterLink = $('#Master_ctl08 a[href*="ForumThread.aspx"]');
			if(masterLink.length > 0){
				console.log('moving to next unread thread');
				masterLink[0].click();
			}else{
				console.log('no unread threads');
			}
		};
		
		function jumpToNextPost(){
			var nextEl = $("#Post" + (parseInt(currentPostNumber) + 1));
			if(nextEl.length){  
				var currentEl = $("#Post" + currentPostNumber);
				currentEl.css({"border-left-width": 1, "padding-left": 11});
				currentPostNumber++;
				location.hash = 'Post'+currentPostNumber;
				nextEl.css({"border-left-width": 3, "padding-left": 10});
			}
		};
		
		function jumpToPreviousPost(){
			var previousEl = $("#Post" + (parseInt(currentPostNumber) - 1));
			if(previousEl.length){  
				var currentEl = $("#Post" + currentPostNumber);
				currentEl.css({"border-left-width": 1, "padding-left": 11});
				currentPostNumber--;
				location.hash = 'Post'+currentPostNumber;
				previousEl.css({"border-left-width": 3, "padding-left": 10});
			}
		}
		
		function ratePost(up){
			var postIdSelector = '#Post' + currentPostNumber;
			var rateLinks = $(postIdSelector + ' span.Button a');
			if(up){
				rateLinks[0].click();
			}else{
				rateLinks[1].click();
			}
		}
		
		function showHiddenPosts(){
			$('.Clipped a')[0].click();
		}
		
		storageGet("ITCheck.shortcutKeys", function(shortcutKeys){
			var shortcutCodes = {};
			
			function initializeShortcutKeyCode(shortcutKey){
				storageGet('ITCheck.shortcutKey.'+shortcutKey, function(val){
					shortcutCodes[shortcutKey] = val.charCodeAt(0);
				});
			}
			
			for(var i = 0; i < shortcutKeys.length; i++){
				initializeShortcutKeyCode(shortcutKeys[i]);
			}
			
			win.onkeypress = function(e){
				var tagKeyedIn = e.target.tagName.toLowerCase();
				if(tagKeyedIn !== 'input' && tagKeyedIn !== 'textarea'){
					if(e.which === (shortcutCodes["nextPost"] || 106)){
						jumpToNextPost();
					}else if(e.which === (shortcutCodes["previousPost"] || 107)){
						jumpToPreviousPost();
					}else if(e.which === (shortcutCodes["unreadThread"] || 110)){
						doNextUnreadThread();
					}else if(e.which === (shortcutCodes["rateUp"] || 117)){
						ratePost(true);
					}else if(e.which === (shortcutCodes["rateDown"] || 100)){
						ratePost(false);
					}else if(e.which === (shortcutCodes["showHidden"] || 104)){
						showHiddenPosts();
					}
				}
			};
		});
		//determine current post number
		var firstNewPostId = $('span#New').parent().id;
		if(!firstNewPostId || firstNewPostId.indexOf('Post') !== 0){
			var threadTds = $('.ForumThread td');
			if(threadTds.length){
				firstNewPostId = threadTds.last()[0].id
			}
		}
		if(location.hash && location.hash.indexOf('Post') === 1){
			firstNewPostId = location.hash.substring(1);
		}
		if(firstNewPostId){
			var currentPostNumber = firstNewPostId.substring(4);
			location.hash = 'Post'+currentPostNumber;
			$("#Post" + currentPostNumber).css({"border-left-width": 3, "padding-left": 10});
		}
	}
	
	function storageGet(key, callback){
		var k = key;
		chrome.storage.sync.get(k, function(storageObj){
			callback(storageObj[k]);
		});
	}
	storageGet('ITCheck.shortcuts', runShortcuts);
}(window, jQuery))