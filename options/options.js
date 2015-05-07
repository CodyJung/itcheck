(function(ITCheckStorage, $){
	ITCheckStorage.storageGet(ITCheckStorage.shortcutKeys, function(shortcutKeys){
		ITCheckStorage.storageGet(ITCheckStorage.showCohortsEnabledKey, function(val){
			if(val){
				options.showCohorts.checked = val;
			}else{
				ITCheckStorage.storageSet(ITCheckStorage.showCohortsEnabledKey, true);
				val = true;
			}
			options.showCohorts.checked = val;
		});
		ITCheckStorage.storageGet(ITCheckStorage.shortcutsEnabledKey, function(val){
			if(val){
				options.shortcuts.checked = val;
			}else{
				ITCheckStorage.storageSet(ITCheckStorage.shortcutsEnabledKey, true);
				val = true;
			}
			options.shortcuts.checked = val;
		});
		for(var i = 0; i < shortcutKeys.length; i++){
			var shortcutKey = shortcutKeys[i];
			populateShortcutKey(shortcutKey);
		}
		for(var i = 0; i < shortcutKeys.length; i++){
			var shortcutKey = shortcutKeys[i];
			options[shortcutKey].onchange = function(e){
				var target = e.target;
				ITCheckStorage.storageSet(ITCheckStorage.getShortcutKeyKey(target.name), target.value);
			}
		}
	});
	
	function populateShortcutKey(shortcutKey){
		ITCheckStorage.storageGet(ITCheckStorage.getShortcutKeyKey(shortcutKey), function(val){
			if(val){
				options[shortcutKey].value = val;
			}
		});
	}

	var options = $('#options')[0];
	options.showCohorts.onchange = function() {
		ITCheckStorage.storageSet(ITCheckStorage.showCohortsEnabledKey, options.showCohorts.checked);
	};
	
	options.shortcuts.onchange = function() {
		ITCheckStorage.storageSet(ITCheckStorage.showCohortsEnabledKey, options.shortcuts.checked);
		$('#shortcutSection').toggle(options.shortcuts.checked);
	};
})(window.ITCheck.storage, jQuery);