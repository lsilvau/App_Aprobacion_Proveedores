sap.ui.define([], function () {
	"use strict";
	return {
		getUrlBase : function () {
			//var oUrlBase = "/SapService/sap/bc/z_liblogistica?sap-client=300"; 	//QAS
			//var oUrlBase = "sap/bc/z_liblogistica?sap-client=300"; 			//PRD //--LESU
			//var oUrlBase = "https://apiapqa.inchcapelatam.app/api?sap-client=300"; 			//--LESU
			var oUrlBase = "https://apilibqa.inchcapelatam.app/api?sap-client=300"; //++LESU SERVICIO PREEXISTENTE
			return oUrlBase;
		},
		getCookieNames: function(){
			return  ["MYSAPSSO2", "sap-usercontext"]
		}
	};

});