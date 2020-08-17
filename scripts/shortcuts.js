(function (window, ITCheckStorage, $) {

	function runJavascript(commandToRun) {
		location.href = `javascript:${commandToRun}; void 0;`;
	}

	function activateKonamiCode() {
		document.body.style.background = "url('https://ivorytowerimages.blob.core.windows.net/user/eclymer/hall-kauffman.jpg') no-repeat center center fixed";
		document.body.style.backgroundSize = "cover";
		runJavascript(`OpenPostBox('ReplyExpander','ReplyExpandButton','ReplyText')`);
		const newText = 'Whoa, I just learned that the <a href="https://www.ivorytower.com/MessageSend.aspx?name=csmolinsky">IvoryTower Checker chrome extension</a> responds to the Konami Code. This is NEAT-o Burrito!';
		runJavascript(`ReplaceSelection(document.getElementById('ReplyText'), '${newText}')`);
		console.log('konami code activated');
	}

	let cursor = 0;
	const KONAMI_CODE = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
	document.addEventListener('keydown', (e) => {
		cursor = (e.keyCode == KONAMI_CODE[cursor]) ? cursor + 1 : 0;
		if (cursor == KONAMI_CODE.length) activateKonamiCode();
	});


	function runShortcuts(val) {
		let currentPostNumberInThread = -1;
		let currentITPostNumber = -1;
		if (!val) {
			return;
		}

		function doNextUnreadThread() {
			var masterLink = $('#Master_ctl08 a[href*="ForumThread.aspx"]');
			if (masterLink.length > 0) {
				masterLink[0].click();
			}
		}

		function getPostEl(postNumberInThread) {
			const postEl = $("#Post" + postNumberInThread);
			return postEl;
		}

		function doesPostExist(postNumberInThread) {
			const postEl = getPostEl(postNumberInThread);
			return postEl.length > 0;
		}

		function jumpToNextPost() {
			const nextPostNumberToLookFor = currentPostNumberInThread + 1;
			if (doesPostExist(nextPostNumberToLookFor)) {
				revertStyleOfPost(currentPostNumberInThread);
				jumpToNewPost(nextPostNumberToLookFor);
			}
		};

		function jumpToPreviousPost() {
			const prevPostNumberToLookFor = currentPostNumberInThread - 1;
			if (doesPostExist(prevPostNumberToLookFor)) {
				revertStyleOfPost(currentPostNumberInThread);
				jumpToNewPost(prevPostNumberToLookFor);
			}
		}

		function showHiddenPosts() {
			$('.Clipped a')[0].click();
		}


		ITCheckStorage.storageGet(ITCheckStorage.shortcutKeys, function (shortcutKeys) {
			var shortcutCodes = {};

			function initializeShortcutKeyCode(shortcutKey) {
				ITCheckStorage.storageGet(ITCheckStorage.getShortcutKeyKey(shortcutKey), function (val) {
					if (val) {
						shortcutCodes[shortcutKey] = val.charCodeAt(0);
					}
				});
			}

			for (var i = 0; i < shortcutKeys.length; i++) {
				initializeShortcutKeyCode(shortcutKeys[i]);
			}

			window.onkeypress = function (e) {
				var tagKeyedIn = e.target.tagName.toLowerCase();
				if (tagKeyedIn !== 'input' && tagKeyedIn !== 'textarea') {
					if (e.which === (shortcutCodes["nextPost"] || 'j'.charCodeAt())) {
						jumpToNextPost();
					} else if (e.which === (shortcutCodes["previousPost"] || 'k'.charCodeAt())) {
						jumpToPreviousPost();
					} else if (e.which === (shortcutCodes["unreadThread"] || 'n'.charCodeAt())) {
						doNextUnreadThread();
					} else if (e.which === (shortcutCodes["rateUp"] || 'u'.charCodeAt())) {
						runJavascript(`RatePost(${currentITPostNumber}, 1)`);
					} else if (e.which === (shortcutCodes["unRate"] || 'z'.charCodeAt())) {
						runJavascript(`RatePost(${currentITPostNumber}, 0)`);
					} else if (e.which === (shortcutCodes["rateDown"] || 'd'.charCodeAt())) {
						runJavascript(`RatePost(${currentITPostNumber}, -1)`);
					} else if (e.which === (shortcutCodes["flagPost"] || 'f'.charCodeAt())) {
						flagCurrentPost();
					} else if (e.which === (shortcutCodes["replyToPost"] || 'r'.charCodeAt())) {
						replyToCurrentPost();
						e.preventDefault();
					} else if (e.which === (shortcutCodes["showHidden"] || 'h'.charCodeAt())) {
						showHiddenPosts();
					} else if (e.which === 63 && e.shiftKey === true) {
						// slash + shift = question mark opens the options page
						const optionsUrl = chrome.extension.getURL('options/options.html');
						window.open(optionsUrl, '_blank');
					}
				}
			};
		});

		function replyToCurrentPost() {
			const currentPostEl = getPostEl(currentPostNumberInThread);
			const replyEl = currentPostEl.find('span>a').last()[0];
			if (replyEl) {
				replyEl.click();
			}
		}

		function flagCurrentPost() {
			const flagImgEl = $(`#Flag${currentITPostNumber}>img`)[0];
			const shouldFlag = flagImgEl.title === "Click to flag post.";
			runJavascript(`FlagPost(${currentITPostNumber}, ${shouldFlag})`);
		}

		function revertStyleOfPost(postNumber) {
			var revertEl = getPostEl(postNumber)
			if (revertEl.length) {
				revertEl.css({
					"border-left-width": 1,
					"padding-left": 11
				});
			}
		}

		function jumpToNewPost(newCurrentPostNumberInThread) {
			var newEl = getPostEl(newCurrentPostNumberInThread);
			currentPostNumberInThread = newCurrentPostNumberInThread;
			location.hash = 'Post' + newCurrentPostNumberInThread;
			newEl.css({
				"border-left-width": 3,
				"padding-left": 10
			});
			updateITPostIdOfCurrentPost(newCurrentPostNumberInThread);
		}

		function updateITPostIdOfCurrentPost(postNumberInThread) {
			const currentEl = getPostEl(postNumberInThread);
			const rateUpImage = currentEl.find('img.RatingImage')[0];
			const newITPostNumber = rateUpImage.id.substring(6);
			currentITPostNumber = newITPostNumber;
		}

		//determine current post number
		var firstNewPostId = $('span#New').parent().id;
		if (!firstNewPostId || firstNewPostId.indexOf('Post') !== 0) {
			var threadTds = $('.ForumThread td');
			if (threadTds.length) {
				firstNewPostId = threadTds.last()[0].id;
			}
		}
		if (location.hash && location.hash.indexOf('Post') === 1) {
			firstNewPostId = location.hash.substring(1);
		}
		if (firstNewPostId) {
			currentPostNumberInThread = parseInt(firstNewPostId.substring(4));
			jumpToNewPost(currentPostNumberInThread);
		}
	}

	ITCheckStorage.storageGet(ITCheckStorage.shortcutsEnabledKey, runShortcuts);
})(window, window.ITCheck.storage, jQuery);