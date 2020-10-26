sap.ui.define([], function () {
    "use strict";
    
    var sAmbiente = "PRD"; //QAS - PRD

	return {
		getParameterSharepoint: function(){
			var sClienteId,
				sClienteSecrect,

				sTarjetHost = "inchcapelatam.sharepoint.com",
				sRealm = "12dc5b3a-8b0e-48d6-ac99-2059a023c04e",
				sPrincipal = "00000003-0000-0ff1-ce00-000000000000";
				

				switch(sAmbiente) {
					case "QAS":
						sClienteId = "f219070f-583c-41ca-b5a5-98b47d94501b";
						sClienteSecrect = "TOrbX09FWtDTCoDluQOOZ7J8tqWHeGP9xXIGpR4IG+o=";
					  break;
					case "PRD":
						sClienteId = "0656834d-61cf-490f-b539-59caedf08d6c";
						sClienteSecrect = "9yTt53IvKh35HRvtgGosUgKoIodnHoVgrP4OiiUiijo=";
					  break;
				  }
			
			return {
				ClienteId : sClienteId,
				ClienteSecret : sClienteSecrect,
				Realm :sRealm,
				TarjeHost : sTarjetHost,
				Principal : sPrincipal,
				ClienteSecret : sClienteSecrect,
				Realm : sRealm
			}
        },
        
        getUrlGlobal: function(){
			//var sUrlGlobal = "/sap/bc/z_liblogistica?sap-client=300"; --LESU
			//var sUrlGlobal = "https://apiapqa.inchcapelatam.app/api?sap-client=300";	//--LESU 08.10.2020		
			var sUrlGlobal = "https://apilibqa.inchcapelatam.app/api?sap-client=300";	//++LESU 08.10.2020	            
            switch(sAmbiente) {
                case "QAS":
                    sUrlGlobal = "/SapService" + sUrlGlobal;
                  break;
                case "PRD":
                    //sUrlGlobal = sUrlGlobal;
                  break;
              }
            return sUrlGlobal;
		},
		getUrlWeb: function(){
			var sUrlWeb = "";
            
            switch(sAmbiente) {
                case "QAS":
                    sUrlWeb = "https://aprobacionesqa.inchcapelatam.app";
                  break;
                case "PRD":
                    sUrlWeb = "https://aprobacionessap.inchcapelatam.app";
                  break;
              }
            return sUrlWeb;

		}


	};

});