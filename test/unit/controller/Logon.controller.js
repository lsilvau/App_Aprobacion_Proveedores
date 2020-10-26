/*global QUnit*/

sap.ui.define([
	"biz/intelecta/portal/INT_PORTAL_INCHCAPE/controller/Logon.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Logon Controller");

	QUnit.test("I should test the Logon controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});