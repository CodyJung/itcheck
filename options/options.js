(function (ITCheck, $) {
	const ITCheckStorage = ITCheck.storage;
	const optionsEl = $('#options')[0];
	ITCheckStorage.storageGet(ITCheckStorage.showCohortsEnabledKey, function (valueInStorage) {
		if (valueInStorage) {
			optionsEl.showCohorts.checked = valueInStorage;
		} else {
			ITCheckStorage.storageSet(ITCheckStorage.showCohortsEnabledKey, true);
			valueInStorage = true;
		}
		optionsEl.showCohorts.checked = valueInStorage;
	});
	ITCheckStorage.storageGet(ITCheckStorage.shortcutsEnabledKey, function (valueInStorage) {
		if (valueInStorage) {
			optionsEl.shortcuts.checked = valueInStorage;
		} else {
			ITCheckStorage.storageSet(ITCheckStorage.shortcutsEnabledKey, true);
			valueInStorage = true;
		}
		optionsEl.shortcuts.checked = valueInStorage;
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
		for (let i = 0; i < shortcutKeys.length; i++) {
			var shortcutKey = shortcutKeys[i];
			populateShortcutKey(shortcutKey);
		}
		for (let j = 0; j < shortcutKeys.length; j++) {
			var shortcutKey = shortcutKeys[j];
			options[shortcutKey].onchange = function (e) {
				const target = e.target;
				ITCheckStorage.storageSet(ITCheckStorage.getShortcutKeyKey(target.name), target.value);
			}
		}
	});

	function populateShortcutKey(shortcutKey) {
		ITCheckStorage.storageGet(ITCheckStorage.getShortcutKeyKey(shortcutKey), function (valueInStorage) {
			if (valueInStorage) {
				options[shortcutKey].value = valueInStorage;
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