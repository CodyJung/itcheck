(function (ITCheck, $) {
	const ITCheckStorage = ITCheck.storage;
	const optionsEl = $('#options')[0];
	ITCheckStorage.storageGet(ITCheckStorage.showCohortsEnabledKey, function (val) {
		if (val) {
			optionsEl.showCohorts.checked = val;
		} else {
			ITCheckStorage.storageSet(ITCheckStorage.showCohortsEnabledKey, true);
			val = true;
		}
		optionsEl.showCohorts.checked = val;
	});
	ITCheckStorage.storageGet(ITCheckStorage.shortcutsEnabledKey, function (val) {
		if (val) {
			optionsEl.shortcuts.checked = val;
		} else {
			ITCheckStorage.storageSet(ITCheckStorage.shortcutsEnabledKey, true);
			val = true;
		}
		optionsEl.shortcuts.checked = val;
	});
	ITCheckStorage.storageGet(ITCheckStorage.checkIntervalKey, function (checkIntervalMinutes) {
		if (checkIntervalMinutes) {
			optionsEl.unreadCheckerInterval.value = checkIntervalMinutes;
		} else {
			ITCheckStorage.storageSet(ITCheckStorage.checkIntervalKey, ITCheck.DefaultCheckIntervalMinutes);
			checkIntervalMinutes = ITCheck.DefaultCheckIntervalMinutes;
		}
		optionsEl.unreadCheckerInterval.value = checkIntervalMinutes;
	});

	ITCheckStorage.storageGet(ITCheckStorage.shortcutKeys, function (shortcutKeys) {
		for (var i = 0; i < shortcutKeys.length; i++) {
			var shortcutKey = shortcutKeys[i];
			populateShortcutKey(shortcutKey);
		}
		for (var i = 0; i < shortcutKeys.length; i++) {
			var shortcutKey = shortcutKeys[i];
			options[shortcutKey].onchange = function (e) {
				var target = e.target;
				ITCheckStorage.storageSet(ITCheckStorage.getShortcutKeyKey(target.name), target.value);
			}
		}
	});

	function populateShortcutKey(shortcutKey) {
		ITCheckStorage.storageGet(ITCheckStorage.getShortcutKeyKey(shortcutKey), function (val) {
			if (val) {
				options[shortcutKey].value = val;
			}
		});
	}

	optionsEl.showCohorts.onchange = function () {
		ITCheckStorage.storageSet(ITCheckStorage.showCohortsEnabledKey, options.showCohorts.checked);
	};

	optionsEl.shortcuts.onchange = function () {
		ITCheckStorage.storageSet(ITCheckStorage.shortcutsEnabledKey, options.shortcuts.checked);
		$('#shortcutSection').toggle(options.shortcuts.checked);
	};

	optionsEl.unreadCheckerInterval.onchange = function () {
		ITCheckStorage.storageSet(ITCheckStorage.checkIntervalKey, parseInt(options.unreadCheckerInterval.value));
	};
})(window.ITCheck, jQuery);