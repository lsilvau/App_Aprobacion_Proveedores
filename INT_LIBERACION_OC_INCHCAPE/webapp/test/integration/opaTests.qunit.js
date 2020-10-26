/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"intordendecompras/intOrdenDeCompras/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});