// ==UserScript==
// @name IvoryTower Cohort Thing
// @description Adds cohort year to IT years
// @include http://ivorytower.com/*
// @include http://www.ivorytower.com/*
// @include http://ivorytower.dyndns.org/*
// @include http://ivorytower.go.dyndns.org/*
// ==/UserScript==

var years = {
	// Sanitized for GitHub. Added back on building.
};

var elements = document.evaluate("//a[starts-with(@href,'ProfileShow.aspx')]",
		document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for(var i = 0; i < elements.snapshotLength; i++) {
	var cur = elements.snapshotItem(i);
	var name = cur.getAttribute('href').split('=')[1];
	var year = document.createTextNode(" (" + years[name] + ")");
	cur.appendChild(year);
}