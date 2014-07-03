(function(win, $){	
	function doNextUnreadThread(){
		console.log('next unread');
		var masterLink = $('#Master_ctl08 a')[0];
		if(masterLink.href.indexOf('Action=Ignore') === -1
			&& masterLink.href.indexOf('Action=Unignore') === -1){
			masterLink.click();
		}else{
			console.log('no unread threads');
		}
	};
	
    function jumpToNextPost(){
        if( $("#Post" + (currentPostNumber + 1)).length > 0 ){  
            $("#Post" + currentPostNumber).css({"border-left-width": 1, "padding-left": 11});
            currentPostNumber++;
            location.hash = 'Post'+currentPostNumber;
            $("#Post" + currentPostNumber).css({"border-left-width": 3, "padding-left": 10});
        }
    };
    
	function jumpToPreviousPost(){
        if( $("#Post" + (currentPostNumber - 1)).length > 0 ){  
            $("#Post" + currentPostNumber).css({"border-left-width": 1, "padding-left": 11});
            currentPostNumber--;
            location.hash = 'Post'+currentPostNumber;
            $("#Post" + currentPostNumber).css({"border-left-width": 3, "padding-left": 10});
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
	
	window.onkeypress = function(e){
		var tagKeyedIn = e.target.tagName.toLowerCase();
		if(tagKeyedIn !== 'input' && tagKeyedIn !== 'textarea'){
			if(e.which === 106){
				// j for next post
				jumpToNextPost();
			}else if(e.which === 107){
				// k for previous post
				jumpToPreviousPost();
			}else if(e.which === 117){
				// u for next unread thread
				doNextUnreadThread();
			}else if(e.which === 97){
				// a for rate up
				ratePost(true);
			}else if(e.which === 102){
				// f for rate down
				ratePost(false);
			}else if(e.which === 104){
				// h for hidden
				showHiddenPosts();
			}
		}
	};
	
	//determine current post number
	var firstNewPostId = $('span#New').parent().id;
	if(!firstNewPostId || firstNewPostId.indexOf('Post') !== 0){
		firstNewPostId = $('.ForumThread td').last()[0].id
	}
	if(location.hash && location.hash.indexOf('Post') === 1){
		firstNewPostId = location.hash.substring(1);
	}
	var currentPostNumber = firstNewPostId.substring(4);
}(window, jQuery))