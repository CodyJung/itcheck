(function(window, $){
	window.ITCheck = window.ITCheck || {};
	
	ITCheck.storageGet("ITCheck.shortcutKeys", function(shortcutKeys){
		ITCheck.storageGet('ITCheck.showCohorts', function(val){
			if(val){
				options.showCohorts.checked = val;
			}else{
				ITCheck.storageSet('ITCheck.showCohorts', true);
			}
		});
		ITCheck.storageGet('ITCheck.shortcuts', function(val){
			if(val){
				options.shortcuts.checked = val;
			}else{
				ITCheck.storageSet('ITCheck.shortcuts', true);
			}
		});
		for(var i = 0; i < shortcutKeys.length; i++){
			var shortcutKey = shortcutKeys[i];
			populateShortcutKey(shortcutKey);
		}
		for(var i = 0; i < shortcutKeys.length; i++){
			var shortcutKey = shortcutKeys[i];
			options[shortcutKey].onchange = function(e, shortcutKey){
				var target = e.target;
				ITCheck.storageSet('ITCheck.shortcutKey.'+target.name, target.value);
			}
		}
	});
	
	function populateShortcutKey(shortcutKey){
		ITCheck.storageGet('ITCheck.shortcutKey.'+shortcutKey, function(val){
			if(val){
				options[shortcutKey].value = val;
			}
		});
	}

	var options = $('#options')[0];
	options.showCohorts.onchange = function() {
		ITCheck.storageSet('ITCheck.showCohorts', options.showCohorts.checked);
	};
	
	options.shortcuts.onchange = function() {
		ITCheck.storageSet('ITCheck.shortcuts', options.shortcuts.checked);
		$('#shortcutSection').toggle(options.shortcuts.checked);
	};
})(window, jQuery);