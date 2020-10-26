/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"biz/intelecta/portal/INT_PORTAL_INCHCAPE/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});