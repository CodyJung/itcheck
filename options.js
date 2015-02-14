$(function(){
	window.ITCheck = window.ITCheck || {};

	window.addEventListener('load', function() {
		ITCheck.storageGet('showCohorts', function(val){
			options.showCohorts.checked = val;
		});
		ITCheck.storageGet('shortcuts', function(val){
			options.shortcuts.checked = val;
		});
	});

	options.showCohorts.onchange = function() {
		ITCheck.storageSet('showCohorts', options.showCohorts.checked);
	};
	
	options.shortcuts.onchange = function() {
		ITCheck.storageSet('shortcuts', options.shortcuts.checked);
	};
});