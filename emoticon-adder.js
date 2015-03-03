/* TODO: Fix these overly-broad selectors */
$(document).ready(function() {

	var emoticons = [
		[":)", "Bitmaps/Emo/Smiley.png"],
		[":|", "Bitmaps/Emo/Unsure.png"],
		[":(", "Bitmaps/Emo/Frown.png"],
		[":O", "Bitmaps/Emo/Gasp.png"],
		[";)", "Bitmaps/Emo/Wink.png"],
		[":P", "Bitmaps/Emo/Silly.png"],
		[":D", "Bitmaps/Emo/Grin.png"],
		["^_^", "Bitmaps/Emo/Pleased.png"],
		[">.<", "Bitmaps/Emo/Wince.png"],
		["-_-", "Bitmaps/Emo/Glare.png"],
		["(hqf)", "Bitmaps/Emo/Harlequin.png"],
		["(cy)", "Bitmaps/Emo/Cylon.png"],
		["E(", "Bitmaps/Emo/Emo.png"],
		[":-J", "Bitmaps/Emo/Jmote.png"],
		["<3", "Bitmaps/Emo/Heart.png"],
		["</3", "Bitmaps/Emo/HeartBroken.png"],
		["(tmyk)", "Bitmaps/Emo/TMYK.png"],
		["(nyan)", "Bitmaps/Emo/Nyan.png"],
		["(usa)", "Bitmaps/Emo/USA.png"]
	];
	
	$( ".maincontent" ).on( "click", "#ITCheck_emotes a", function( event ) {
		event.preventDefault();
		insertEmote( $(this).attr("href") );
		return false;
	});
	
	function emoticon_html() {
		var emote_html = "<div id='ITCheck_emotes' style='margin:2px'>";
		
		for( var i=0; i < emoticons.length; i++ ) {
			emote_html += "<a href='" + i + "'><img src='" + emoticons[i][1] + "' class='emo' width='12' height='12' alt='" + emoticons[i][0] + "' title='" + emoticons[i][0] + "'/></a>";	
		}
		
		emote_html += "</div>";
		return emote_html;
	}
	
	function insertEmote( emoteIdx ) {
		$( "#ReplyText" ).insertAtCaret( emoticons[emoteIdx][0] );	/* New Post */
		$( "#MessageBox" ).insertAtCaret( emoticons[emoteIdx][0] ); /* Editing */
	}
	
	$( "#ReplyExpander .small" ).after( emoticon_html() ); /* New Post */
	$( "#MessageBox" ).before( emoticon_html() );		/* Editing */
});

// http://stackoverflow.com/questions/946534/insert-text-into-textarea-with-jquery
jQuery.fn.extend({
insertAtCaret: function(myValue){
  return this.each(function(i) {
    if (document.selection) {
      //For browsers like Internet Explorer
      this.focus();
      var sel = document.selection.createRange();
      sel.text = myValue;
      this.focus();
    }
    else if (this.selectionStart || this.selectionStart == '0') {
      //For browsers like Firefox and Webkit based
      var startPos = this.selectionStart;
      var endPos = this.selectionEnd;
      var scrollTop = this.scrollTop;
      this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
      this.focus();
      this.selectionStart = startPos + myValue.length;
      this.selectionEnd = startPos + myValue.length;
      this.scrollTop = scrollTop;
    } else {
      this.value += myValue;
      this.focus();
    }
  });
}
});