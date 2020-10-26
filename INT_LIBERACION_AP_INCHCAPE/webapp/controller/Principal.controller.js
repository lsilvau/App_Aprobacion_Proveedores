sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/Token",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"aprobacionproveedor/aprobacionProveedor/model/formatter",
	"aprobacionproveedor/aprobacionProveedor/model/models",
	"aprobacionproveedor/aprobacionProveedor/model/config"

], function (Controller, JSONModel, Device, MessageBox, MessageToast, Token, Filter, FilterOperator, formatter, models,config
	//configGlobal

	
	) {
	"use strict";
				//+LESU 13.10.2020
				//var url_ap_shr_pt  = 'https://inchcapelatam.sharepoint.com/sites/Documentos_Aprobacion_ProveedoresQA/',
				var url_ap_shr_pt  = '',
				sh_pt_clientid = '',
				sh_pt_clientsecret = '',
				sh_pt_targethost = '',
				sh_pt_principal = '',
				sh_pt_realm = '';

	return Controller.extend("aprobacionproveedor.aprobacionProveedor.controller.Principal", {

		formatter: formatter,

		onInit: function () { 
			var urlGlobal = config.getUrlGlobal(),
			//var urlGlobal = "/sap/bc/zservice_mm_lib?sap-client=800",
				//var urlGlobal = "/ServiceRest/zservice_mm_lib?sap-client=800", 


				opo_number = [],
				opo_liberadores = [],
				aData = [];



			sap.ui.getCore().setModel(urlGlobal, "urlGlobal");
			sap.ui.getCore().setModel(opo_number, "opo_number");
			sap.ui.getCore().setModel(opo_liberadores, "opo_liberadores");
			sap.ui.getCore().setModel(aData, "aData");

			sap.ui.getCore().setModel(new JSONModel({}), "allData"); //Contendra todos los datos
			sap.ui.getCore().setModel(new JSONModel({}), "oCurrentOrdCom"); //Orden de compra selectionada

			//Validar si es Mobile
			if (Device.system.phone) {
				this.getView().byId("idPageSolPedi").setShowNavButton(true);
				this.getView().byId("pnCabecera").setExpandable(true);
				this.getView().byId("pnCabecera").setExpanded(true);
			}

			//Ocultar Tree
			this.getView().byId("Tree").setVisible(false);

		},

		onBeforeRendering: function () {
			if(localStorage.getItem("sUser") === null ||  localStorage.getItem("sUser") === ""){
				var urlWeb = config.getUrlWeb();
				window.open(urlWeb,"_self");
			}
			this.fnLoadAllData();			//Cargar todos los datos
		},

		//Obtener al control Split App
		fnGetSplitAppObj: function () {
			var result = this.byId("idSplitApp");
			return result;
		},

		fnSearch: function (oEvent) {

			var textSearched = this.getView().byId("idSearchField").getValue(),
				oTableOrdCom = this.getView().byId("idListSolPedi"),
				oBinding = oTableOrdCom.getBinding("items"),
				aFilter = [];


			aFilter.push(new Filter({
				filters: [
					new Filter("cod_vend", FilterOperator.Contains, textSearched),
 					new Filter("po_number", FilterOperator.Contains, textSearched),
					new Filter("currency", FilterOperator.Contains, textSearched),
					new Filter("vend_name", FilterOperator.Contains, textSearched),
					new Filter("doc_date", FilterOperator.Contains, textSearched),
					new Filter("created_by", FilterOperator.Contains, textSearched),
					new Filter("created_on", FilterOperator.Contains, textSearched)
				],
				and: false
			}));

			oBinding.filter(aFilter);

		},

		onGetToken: function () {
			 debugger;
			var sRusult,
				//oParameterSharepoint = config.getParameterSharepoint(),
				//sUrl = "https://cors-anywhere.herokuapp.com/"+"https://accounts.accesscontrol.windows.net/"+oParameterSharepoint.Realm+"/tokens/OAuth/2";
				sUrl = "https://cors-anywhere.herokuapp.com/"+"https://accounts.accesscontrol.windows.net/"+sh_pt_realm+"/tokens/OAuth/2";
			$.ajax(sUrl, {
				method: "POST",
				timeout: 0,
				headers: {


					"appReg_clientId": sh_pt_clientid,
					"appReg_clientSecret": sh_pt_clientsecret,
					"targetHost": sh_pt_targethost,
					"principal": sh_pt_principal,
					"realm": sh_pt_realm,

					"Content-Type": "application/x-www-form-urlencoded"
				},
				data: {

					"grant_type": "client_credentials",
					"client_id": sh_pt_clientid + "@" + sh_pt_realm,
					"client_secret": sh_pt_clientsecret,
					"resource": sh_pt_principal + "/" + sh_pt_targethost + "@" + sh_pt_realm					


				},
				async: false,
				success: function (result) {
					//Obtener Token
					sRusult = result.access_token;
				},
				error: function (error) {
					sRusult = false;
				},
			});	
			return sRusult;
		},

		/******************************************************************************************************** */

		onGetUrlFile: function (sUrlDocSap) { debugger;
				//var sUrl = "https://inchcapelatam.sharepoint.com/sites/intranet_pe/finanzas/_api/web/GetFileByUrl(@url)?@url='" + sUrlDocSap +"'", // --@LESU 13.10.2020
				var sUrl =  url_ap_shr_pt + "/_api/web/GetFileByUrl(@url)?@url='" + sUrlDocSap +"'", // ++@LESU 13.10.2020
				//var sUrl =  url_ap_shr_pt + "/_api/web/GetFileByUrl(@url)?@url='" + sUrlDocSap +"'", // ++@LESU 13.10.2020
				sToken = this.onGetToken(),
				sRelativeUrl;
				
			$.ajax(sUrl, {
				type: "GET",
				cache: false,
				"headers": {
					"Authorization": "Bearer " + sToken,
					"accept": "application/json;odata=verbose"
				},
				async: false,
				success: function (result) {
					//Obtener url
					sRelativeUrl = result.d.ServerRelativeUrl;
				},
				error: function (error) {
					sRelativeUrl = false;
				},
			});	
			
			return {
				"value" : sRelativeUrl,
				"token" : sToken
			};
		},

		onGetFile: function (sUrlDocSap, bFlagRelativeUrl) { debugger;
			sap.ui.core.BusyIndicator.show(0);
			var sRelativeUrl = bFlagRelativeUrl !== true ? this.onGetUrlFile(sUrlDocSap): sUrlDocSap;
			
			if(sRelativeUrl.value !== false){
				//var sUrl = "https://inchcapelatam.sharepoint.com/sites/intranet_pe/finanzas/_api/web/getFileByServerRelativeUrl('"+sRelativeUrl.value+"')/$value"; // --@LESU 13.10.2020
				var sUrl = url_ap_shr_pt + "/_api/web/getFileByServerRelativeUrl('"+sRelativeUrl.value+"')/$value"; // ++@LESU 13.10.2020
				var aName = sRelativeUrl.value.split("/");
				var sName = aName[aName.length -1];
				
				var xhr = new window.XMLHttpRequest();
				   
				xhr.open("GET", sUrl, true);
				xhr.responseType = 'arraybuffer';
				xhr.setRequestHeader("Authorization", "Bearer "+sRelativeUrl.token);
	
				xhr.addEventListener('load', function () {
					if (xhr.status === 200) {                    
						var sampleBytes = new Uint8Array(xhr.response);
						var a = document.createElement("a");
						document.body.appendChild(a);
						a.style = "display: none";
						var blob = new Blob([xhr.response]),
						url = window.URL.createObjectURL(blob);
						a.href = url;
						a.download =sName;
						a.click();
					}
				})
				xhr.send();
				sap.ui.core.BusyIndicator.hide();
			}else{
				sap.ui.core.BusyIndicator.hide();
				return false;
			}
		},

		/******************************************************************************************************** */

		onGetUniqueId: function(sUrlDocSap) { debugger;
				//var sUrl = "https://inchcapelatam.sharepoint.com/sites/intranet_pe/finanzas/_api/SP.RemoteWeb(@url)/web/GetSharingLinkData(@url)?@url='" + sUrlDocSap + "'", // --@LESU 13.10.2020
				var sUrl = url_ap_shr_pt + "/_api/SP.RemoteWeb(@url)/web/GetSharingLinkData(@url)?@url='" + sUrlDocSap + "'", // ++@LESU 13.10.2020
				sToken = this.onGetToken(),
				sUniqueId;
			
			$.ajax(sUrl, {
				type: "GET",
				cache: false,
				"headers": {
			    	"Authorization": "Bearer " + sToken,
			    	"accept": "application/json;odata=verbose"
				},
				async: false,
				success: function (result) {
					//Obtener Unique Id
					sUniqueId = result.d.GetSharingLinkData.ObjectUniqueId;
				},
				error: function (error) {
					sUniqueId = false;
				},
			});	
			
			return {
				"value" : sUniqueId,
				"token" : sToken
			};
		},

		onGetUrlFolder: function(sUrlDocSap){ debugger;
		
			var sUniqueId = this.onGetUniqueId(sUrlDocSap),
				// sUrl = "https://inchcapelatam.sharepoint.com/sites/intranet_pe/finanzas/_api/web/GetFolderById(@url)?@url='" + sUniqueId.value + "'", // --@LESU 13.10.2020
				sUrl = url_ap_shr_pt + "/_api/web/GetFolderById(@url)?@url='" + sUniqueId.value + "'", // ++@LESU 13.10.2020
		
			sRelativeUrl;
				
			$.ajax(sUrl, {
				type: "GET",
				cache: false,
				"headers": {
			    	"Authorization": "Bearer " + sUniqueId.token,
			    	"accept": "application/json;odata=verbose"
				},
				async: false,
				success: function (result) {
					//Obtener url
					sRelativeUrl = result.d.ServerRelativeUrl;
				},
				error: function (error) {
					sRelativeUrl = false;
				},
			});	
			
			return sRelativeUrl
		},

		onGetFileByFolder: function (sRelativeUrl) { debugger;
			var sResult,
				sToken = this.onGetToken(),
				//sUrl = "https://inchcapelatam.sharepoint.com/sites/intranet_pe/finanzas/_api/web/GetFolderByServerRelativeUrl('"+ sRelativeUrl +"')?$expand=Folders,Files"; // --@LESU 13.10.2020
				sUrl = url_ap_shr_pt + "/_api/web/GetFolderByServerRelativeUrl('"+ sRelativeUrl +"')?$expand=Folders,Files"; // ++@LESU 13.10.2020
			
			$.ajax(sUrl, {
				type: "GET",
				cache: false,
				"headers": {
			    	"Authorization": "Bearer " + sToken,
			    	"accept": "application/json;odata=verbose"
				},
				async: false,
				success: function (result) {
					//Obtener file
					sResult = result.d;
				},
				error: function (error) {
					sResult = false;
				},
			});	
			return sResult;
		},

		/******************************************************************************************************** */
		/******************************************************************************************************** */

		fnIntemSolPedPress: function (oEvent) {  //debugger;
			var that = this,
				urlGlobal = sap.ui.getCore().getModel("urlGlobal");
			that.getView().byId("idPageSolPedi").setBusy(true);

			sap.ui.getCore().setModel([], "aData");

			var oTablePosicion = this.getView().byId("idTablePosiciones"),
				allPosicion = sap.ui.getCore().getModel("allData").getProperty("/po_items"),
				opo_liberadores = sap.ui.getCore().getModel("opo_liberadores"),
				oPageLibOrdComp = this.getView().byId("idPageSolPedi"),
				oPageListLiberador = this.getView().byId("idListLiberador"),
				oPageColumnResp = this.getView().byId("idColumnResp"),
				oITFPosiciones = this.getView().byId("idITFPosiciones"),									//Icon Tab Filter de posiciones
				count = 0,
				bFlagResp,

				//Seleccion de carga (Primer registro)
				oSelectedOrdComp = (oEvent.content === undefined) ? oEvent.getSource().getBindingContext().getObject() /*Orden de compra seleccionada*/ : oEvent.content,
				aPosiciones = [];
			var aLiberaciones = [];

			//Limpiar Texto Descripcion
			that.getView().byId("idTextDesc").setValue("");

			oPageLibOrdComp.setModel(new JSONModel(oSelectedOrdComp));

			$.each(allPosicion, function (key, value) {

				if (value.po_number === oSelectedOrdComp.po_number) {
					aPosiciones.push(value);
					count++;
				}

			});

			oITFPosiciones.setCount(count);
			oTablePosicion.setModel(new JSONModel(aPosiciones));

			//Add OOrt - Liberadores
			$.each(opo_liberadores, function (key, value) {
				if (value.po_number === oSelectedOrdComp.po_number) {
					value.estado_visible = (value.estado === "X") ? true : false;

					if(bFlagResp !== false){
						if(value.responsable === ""){
							bFlagResp = true;
						}else{
							bFlagResp = false;
						}	
					}
					
					aLiberaciones.push(value);
				}
			});
			oPageListLiberador.setModel(new JSONModel(aLiberaciones));

			//Ocultar Columna Responsable
			if(bFlagResp){
				oPageColumnResp.setVisible(false);
			}else{
				oPageColumnResp.setVisible(true);
			}


			var sCantLib = aLiberaciones.length;
			sCantLib = (sCantLib > 4) ? 4 : sCantLib;
			oPageListLiberador.setVisibleRowCount(sCantLib);
			//Add OOrt

			// var	oModel  = sap.ui.getCore().getModel("oModel"),
			// 	aFilter = [];

			// aFilter.push(new Filter("PoNumber", FilterOperator.EQ, oSelectedOrdComp.po_number));
			// aFilter.push(new Filter("Document", FilterOperator.EQ, "SolPed"));

			var that = this,
				urlDocAdjuntos = urlGlobal + "&ID=04&LIB=SolPed&COD=" + oSelectedOrdComp.po_number,
				urlDescCab = urlGlobal + "&ID=05&LIB=SP&COD=" + oSelectedOrdComp.po_number;

			//Texto - Descricion Cabecera
			$.ajax({
				url: urlDescCab,
				cache: false,
				type: "GET",
				headers: {
					"Authorization": "Basic " + localStorage.getItem("sUserLogin"),
					"X-Requested-With": "XMLHttpRequest"
				},
				success: function (result, status, xhr) {
					var allText = ""; 
					var allData = JSON.parse(result.json); //Obtener todos los datos en JSON
 
					$.each(allData,function(index,item){
						allText = allText + item.tdline + "\n";
					});
					that.getView().byId("idTextDesc").setValue(allText);
				},
				error: function (xhr, status, error) {
					
				}
			});	

			//Documentos Adjuntos 
			//DOCUMENTOS ADJUNTOS URL LESU
			$.ajax({
				url: urlDocAdjuntos,
				cache: false,
				type: "GET",
				headers: {
					"Authorization": "Basic " + localStorage.getItem("sUserLogin"),
					"X-Requested-With": "XMLHttpRequest"
				},
				success: function (result, status, xhr) {
					console.log(result)
					var aFiles = [],
						oTableDocAdj = that.getView().byId("idTableDocAdj");

					debugger;
					$.each(result, function (key, value) {

						//Recorrer los archivos retornaos y ordenarlos
						var file = {};
						//file.Name = value.line --@LESU_22.10.2020
						file.Name = value.attached_url; //++@LESU_22.10.2020
						file.Country_sh_pt_url = value.land_sh_pt_url; //++@LESU_22.10.2020 "URL SharePoint específica del país
						file.Type = "";
						file.Document = "";
						aFiles.push(file);
					});

					//Mostrar numero de archivos
					that.getView().byId("idITFAdjuntos").setCount(aFiles.length);

					oTableDocAdj.setModel(new JSONModel(aFiles));


					oPageLibOrdComp.setBusy(false);

				},
				error: function (xhr, status, error) {
					oPageLibOrdComp.setBusy(false);
				}
			});
			// oModel.read("/FileSet", {

			// 	filters: aFilter,

			// 	success: function (result, status, xhr) {

			// 		var aFiles			= [],
			// 			oTableDocAdj	= that.getView().byId("idTableDocAdj");

			// 			$.each(result.results, function (key, value) {

			// 				//Recorrer los archivos retornaos y ordenarlos
			// 				var file	= {},
			// 					objeto	= [];

			// 					objeto			= value.Name.split("|")	;
			// 					file.Name		= objeto[0];
			// 					file.Type		= objeto[1];
			// 					file.Document	= value.Document;

			// 				aFiles.push(file);
			// 			});

			// 		//Mostrar numero de archivos
			// 		that.getView().byId("idITFAdjuntos").setCount(aFiles.length);    

			// 		oTableDocAdj.setModel(new JSONModel(aFiles));

			// 		oPageLibOrdComp.setBusy(false);

			// 	},
			// 	error: function () {
			// 		oPageLibOrdComp.setBusy(false);
			// 	}
			// });
			//debugger;
			sap.ui.getCore().setModel(new JSONModel(oSelectedOrdComp), "oCurrentOrdComp");
			
			//Ocultar Tree
			that.getView().byId("Tree").setVisible(false);

		},

		//Permitir al descarga de archivos
		onGoLink: function (oEvent) { debugger;
			var oView = this.getView();
			var url = oEvent.getSource().getProperty("text");
			url_ap_shr_pt = oEvent.getSource().getBindingContext().getObject().Country_sh_pt_url; //++@LESU_22.10.2020

			//Validar Archivo
			var sUrlFile = this.onGetFile(url, false);
			var Tree = this.getView().byId("Tree");

			if(sUrlFile === false) {
				//Get Relative Url
				var oMetaDataFolder = this.onGetUrlFolder(url);

				if(oMetaDataFolder === false){
					MessageToast.show("URL Inválida");
				}else{
					var oModel = new JSONModel();
					oModel.setSizeLimit(999999999); 

					this.byId("Tree").setModel(oModel);
					oView.byId("Tree").setVisible(true);
					this.onGetData(oModel, "", "", oMetaDataFolder);
					sap.ui.core.BusyIndicator.hide();
					oView.byId("treeTitle").setText("Ruta principal: (" + oMetaDataFolder + ")");
					
				}
				
			}

			//var url = file.name;
			//var url = 'https://inchcapelatam.sharepoint.com/sites/intranet_pe/finanzas/Cotizaciones/Forms/AllItems.aspx?viewid=58e36185%2Dc2cc%2D4591%2D97a8%2Dfd41bb0cd6f6&id=%2Fsites%2Fintranet%5Fpe%2Ffinanzas%2FCotizaciones%2F01%20Repuestos';
			//var url = 'https://inchcapelatam.sharepoint.com/sites/intranet_pe/finanzas/Cotizaciones/01%20Repuestos/2019-04.%20Compras%20Abril%202019.pdf';
			//var url = 'https://inchcapelatam.sharepoint.com/:w:/r/sites/intranet_pe/finanzas/_layouts/15/Doc.aspx?sourcedoc=%7B9A8D0AF4-C04F-4EC3-9594-CFC3F3D19EF5%7D&file=COT.%20GLOBAL%20PERU.doc&action=default&mobileredirect=true';
			
			//window.open(url);

			/* Comentado por pruebas
			var oModel = new JSONModel();
			oModel.setSizeLimit(999999999);
			var objeto = this.onFormatearURL(url);
			if (objeto[0].tipo === "folder") {
				this.byId("Tree").setModel(oModel);
				this.onGetData(oModel, "", "", "/" + objeto[0].urlRuta);
				oView.byId("treeTitle").setText("Ruta principal: (/" + objeto[0].urlRuta + ")");
				oView.byId("Tree").setVisible(true);
			} else if (objeto[0].tipo === "archivo") {
				this.onGetValor("/" + objeto[0].urlRuta, objeto[0].nombre);
				oView.byId("Tree").setVisible(true);
			} else {
				MessageToast.show("URL INVÁLIDA");
			}*/
		},
		fnDownload: function (oEvent) {

			var file = oEvent.getSource().getBindingContext().getObject(),
				obase64 = this.hexToBase64(file.Document),
				sfilename = file.Name,
				stype = file.Type,
				element = document.createElement('a');

			element.setAttribute('href', 'data:' + stype + ';base64,' + obase64);
			element.setAttribute('download', sfilename);

			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
		},

		//Convertir hexa a base64
		hexToBase64: function (hexstring) {
			return btoa(hexstring.match(/\w{2}/g).map(function (a) {
				return String.fromCharCode(parseInt(a, 16));
			}).join(""));
		},

		//Cargar todos los datos
		fnLoadAllData: function () {
			debugger;
			sap.ui.core.BusyIndicator.show(0);
			var that = this,
				urlGlobal = sap.ui.getCore().getModel("urlGlobal"),
				opo_headers = sap.ui.getCore().getModel("opo_headers"),
				opo_number = sap.ui.getCore().getModel("opo_number"),
				opo_liberadores = sap.ui.getCore().getModel("opo_liberadores");
		


			//aFilter.push(new Filter("Id", FilterOperator.EQ, "SP"));
			//urlGlobal = urlGlobal + "&ID=02&LIB=SP&USER=" + localStorage.getItem("sUser");	 --LESU		
			urlGlobal = urlGlobal + "&ID=02&LIB=AP&USER=" + localStorage.getItem("sUser");       //++LESU
			//urlGlobal = urlGlobal + "&ID=02&LIB=SP&USER=FORTIZ";
			$.ajax({
				url: urlGlobal,
				cache: false,
				type: "GET",
				headers: {
					"Authorization": "Basic " + localStorage.getItem("sUserLogin"),
					"X-Requested-With": "XMLHttpRequest"
				},
				success: function (result, status, xhr) {
					sap.ui.getCore().setModel([], "aData");
					var allData = JSON.parse(result.json), //Obtener todos los datos en JSON
						oListSolPedi = that.getView().byId("idListSolPedi");

					if(allData.length === 0){
						that.getView().byId("idPageSolPedi").setVisible(false);
						oListSolPedi.setModel(new JSONModel([])); 
						that.getView().byId("il6").setText(allData.length);
						MessageBox.information("No tiene documentos para liberar");

					}else{
						that.getView().byId("idPageSolPedi").setVisible(true);
						allData = allData[0];
						sap.ui.getCore().setModel(new JSONModel(allData), "allData"); //Asignar todos los datos a allData
						opo_headers = allData.po_headers;
						opo_number = allData.po_items;
						opo_liberadores = allData.po_liberadores;
						sap.ui.getCore().setModel(opo_liberadores, "opo_liberadores");

				
				//+LESU 13.10.2020
				debugger;
				url_ap_shr_pt     = allData.url_ap_shr_pt;
				sh_pt_clientid     = allData.sh_pt_clientid;
				sh_pt_clientsecret =  allData.sh_pt_clientsecret;
				sh_pt_targethost   = allData.sh_pt_targethost;
				sh_pt_principal    = allData.sh_pt_principal;
				sh_pt_realm		   = allData.sh_pt_realm;						

						//Cabecera
						$.each(opo_headers, function (index, item) {
							var target_val = item.target_val;

							var costTotal = formatter.onFormatterPriceTotal(target_val);

							item.target_val = costTotal;
						});

						//Posicion
						$.each(opo_number, function (index, item) {
							var disp_quan = item.disp_quan;
							var net_price = item.net_price;

							var importe = formatter.onValorTotal(disp_quan, net_price);

							item.importe = importe;
						});

						var ListSolPedi = new JSONModel(opo_headers);
						ListSolPedi.setSizeLimit(999999999);
						oListSolPedi.setModel(ListSolPedi);

						//Contador Lista de liberacion Individual
						that.getView().byId("il6").setText(allData.po_headers.length);

						//Cargar la primera fila
						var sFirstContent = {};
						sFirstContent.content = allData.po_headers[0];
						that.fnIntemSolPedPress(sFirstContent);
					}
					sap.ui.core.BusyIndicator.hide();
					
				},
				error: function (xhr, status, error) {
					console.log(error);
					sap.ui.core.BusyIndicator.hide();
				},
			});
		},

		onLiberar: function () { //debugger;
			var that = this;
			var ITFPosiciones = that.getView().byId("idITFPosiciones"),
				spo_number = ITFPosiciones.getModel().getData().po_number,
				TablePosiciones = that.getView().byId("idTablePosiciones"),
				TablePosicionesData = TablePosiciones.getModel().getData(),
				sUser = sap.ui.getCore().getModel("sUser"),
				urlGlobal = sap.ui.getCore().getModel("urlGlobal"),
				aData = sap.ui.getCore().getModel("aData"),
				sTitleDialog;

			sTitleDialog = "Estado de liberación para la Solicitud de Pedido";

			if (TablePosicionesData.length !== 0) {
				MessageBox.confirm("¿Liberar el documento " + spo_number + " ?", {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (oAction) {
						switch (oAction) {
							case 'YES':
								sap.ui.core.BusyIndicator.show(0);
/*
								$.each(TablePosicionesData, function (index, item) {
									aData.push({
										"documento": item.po_number,
										"posicion": item.po_item,
										"indicador": item.frgco,
										"usuario": localStorage.getItem("sUser")
									});
								});
*/
							if(aData.length !== 0){
								var jsonModel = new sap.ui.model.json.JSONModel();
								jsonModel.setData(aData);
								var jsonString = jsonModel.getJSON();

								urlGlobal = urlGlobal + "&ID=01&LIB=S";

								$.ajax({
									url: urlGlobal,
									cache: false,
									type: "POST",
									data: jsonString,
									headers: {
										"Authorization": "Basic " + localStorage.getItem("sUserLogin"),
										"X-Requested-With": "XMLHttpRequest"
									},
									success: function (result, status, xhr) {
										var sText = "";
										var sType = "";
										var oMessage;

										oMessage = result;

										if (oMessage.length === 1) {
											//sNumDoc = oMessage[0].documento;
											//sPosicion = oMessage[0].posicion;

											var sTypeMessage = oMessage[0].type;
											var sMessage = oMessage[0].message;

											//Tipo de Mensaje de retorno
											if (sTypeMessage === "S") {
												MessageBox.success(sMessage);
											} else if (sTypeMessage === "W") {
												MessageBox.warning(sMessage);
											} else if (sTypeMessage === "E") {
												MessageBox.error(sMessage);
											}

										} else {
											var Dialogo = new sap.m.Dialog({ title: sTitleDialog });
											$.each(oMessage, function (k, v) {
												sText = v.message;
												sType = v.type;

												//Tipo de Mensaje de retorno													
												if (sType === "I") {
													sType = "Information";
												} else if (sType === "W") {
													sType = "Warning";
												} else if (sType === "S") {
													sType = "Success";
												} else {
													sType = "Error";
												}

												var oMessageStrip = new sap.m.MessageStrip({ text: sText, type: sType, showIcon: true });
												var oLabel = new sap.m.Label({ text: "" });
												Dialogo.addContent(oMessageStrip);
												Dialogo.addContent(oLabel);
											});
											var ButtonCerrar = Dialogo.addButton(new sap.m.Button({
												text: "Cerrar", type: "Accept",
												press: function () {
													Dialogo.destroy();
												}
											})
											);
											Dialogo.open();
										}
										sap.ui.getCore().setModel([], "aData");
										that.fnLoadAllData();
										sap.ui.core.BusyIndicator.hide();

									},
									error: function (xhr, status, error) {
										sap.ui.core.BusyIndicator.hide();
										MessageBox.error(xhr.statusText);
									}
								});	
							}else{
								sap.m.MessageBox.alert("Debe seleccionar al menos una posición");
								sap.ui.core.BusyIndicator.hide();
							}

								break;
							case 'NO':
								sap.ui.core.BusyIndicator.hide();
						}
					}
				});
			} else {
				sap.m.MessageBox.error("Debe seleccionar al menos un registro");
			}
		},

		fnChangeCheck: function () {
			MessageToast.show("a item a Changed");
		},

		fnRemoveDuplicates: function (originalArray, prop) {
			var newArray = [];
			var lookupObject = {};

			for (var i in originalArray) {
				lookupObject[originalArray[i][prop]] = originalArray[i];
			}

			for (i in lookupObject) {
				newArray.push(lookupObject[i]);
			}

			return newArray;
		},

		onInfoUser: function (oEvent) {
			var oButton = oEvent.getSource();

			if (!this._actionSheet) {
				this._actionSheet = sap.ui.xmlfragment("aprobacionproveedor.aprobacionProveedor.fragment.FrgUserInformacion", this);
				this.getView().addDependent(this._actionSheet);
			}

			this._actionSheet.openBy(oButton);
		},

		onInicio: function () {
			alert("Inicio");
		},

		//Formatear URL
		onFormatearURL: function (url) {
			var aRetornar = [];
			var rRetornar = {};
			var formatUrl = unescape(url);
			var formatUrlLowerCase = formatUrl.toLowerCase();
			var aExtensionesComunes = ['.aac', '.adt', '.adts', '.accdb', '.accde', '.accdr', '.accdt', '.aif', '.aifc', '.aiff', '.avi', '.bat', '.bin', '.bmp', '.cab', '.cda', '.csv', '.dif', '.dll', '.doc', '.docm', '.docx', '.dot', '.dotx', '.eml', '.eps', '.exe', '.flv', '.gif', '.htm', '.html', '.ini', '.iso', '.jar', '.jpg', '.jpeg', '.m4a', '.mdb', '.mid', '.midi', '.mov', '.mp3', '.mp4', '.mpeg', '.mpg', '.msi', '.mui', '.pdf', '.png', '.pot', '.potm', '.potx', '.ppam', '.pps', '.ppsm', '.ppsx', '.ppt', '.pptm', '.pptx', '.psd', '.pst', '.pub', '.rar', '.rtf', '.sldm', '.sldx', '.swf', '.sys', '.tif', '.tiff', '.tmp', '.txt', '.vob', '.vsd', '.vsdm', '.vsdx', '.vss', '.vssm', '.vst', '.vstm', '.vstx', '.wav', '.wbk', '.wks', '.wma', '.wmd', '.wmv', '.wmz', '.wms', '.wpd', '.wp5', '.xla', '.xlam', '.xll', '.xlm', '.xls', '.xlsm', '.xlsx', '.xlt', '.xltm', '.xltx', '.xps', '.zip'];

			for (var i = 0; i < aExtensionesComunes.length; i++) {
				if (formatUrlLowerCase.includes(aExtensionesComunes[i])) {
					var aSplitUrlByCom = [];
					var nombre = []
					aSplitUrlByCom = formatUrl.split('https://inchcapelatam.sharepoint.com/');
					/*if(formatUrlLowerCase.includes('.doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx')){
						var aSplitUrlByR = [];
						aSplitUrlByR = formatUrl.split('/r/');
						var urlRuta = aSplitUrlByR[aSplitUrlByR.length-1].toString();
						rRetornar.urlRuta = urlRuta;
						rRetornar.tipo = 'archivo';
						var nombre = []
						nombre = urlRuta.split('/');
						rRetornar.nombre = nombre[nombre.length-1]
						aRetornar.push(rRetornar)
						
					}else{*/
					if (formatUrlLowerCase.includes('&action=', '&parent=')) {
						rRetornar.urlRuta = '';
						rRetornar.tipo = 'invalido';
						rRetornar.nombre = '';
						aRetornar.push(rRetornar);
					} else {
						var urlRuta = aSplitUrlByCom[aSplitUrlByCom.length - 1].toString();
						rRetornar.urlRuta = urlRuta;
						rRetornar.tipo = 'archivo';
						nombre = urlRuta.split('/');
						rRetornar.nombre = nombre[nombre.length - 1]
						aRetornar.push(rRetornar);
					}
				}
				//}
			}
			if (formatUrl.includes('&id=/')) {
				var aSplitUrlById = [];
				aSplitUrlById = formatUrl.split('&id=/');
				var urlRuta = aSplitUrlById[aSplitUrlById.length - 1].toString();
				rRetornar.tipo = 'folder';
				rRetornar.urlRuta = urlRuta;
				rRetornar.nombre = '';
				aRetornar.push(rRetornar);
			} else {
				rRetornar.urlRuta = '';
				rRetornar.tipo = 'invalido';
				rRetornar.nombre = '';
				aRetornar.push(rRetornar);
			}
			return aRetornar;
		},

		/* Cambios Archivos Share Point Teo
		onTabAdjuntos: function () {
			var oModel = new JSONModel();
			oModel.setSizeLimit(999999999);
			var urlRuta = this.onFormatearURL();
			this.byId("Tree").setModel(oModel);
			this.onGetData(oModel, "", "", "/" + urlRuta);
		},*/

		onGetData: function (oModel, sPath, val, sRuta) { //debugger;
			var aNewNodes = [];
			var oTree = this.byId("Tree");
				oTree.setBusy(true);
			var oItem = {};

			//GetContent
			var oContent = this.onGetFileByFolder(sRuta);

			//Folder
			$.each(oContent.Folders.results, function(index, item) {
				oItem = {
					ref: "sap-icon://open-folder",
					sTipo: "Folder",
					text: item.Name,
					ruta: item.ServerRelativeUrl,
					nodes: [{ // This dummy node is required to get an expandable item.
						text: "",
						dummy: true
					}]
				};

				aNewNodes.push(oItem);
			});

			//Files
			$.each(oContent.Files.results, function(index, item) {
				oItem = {
					ref: "sap-icon://document",
					sTipo: "Documento",
					text: item.Name,
					ruta: item.ServerRelativeUrl
				};

				aNewNodes.push(oItem);
			});
			
			oModel.setProperty(sPath ? sPath + "/nodes" : "/", aNewNodes);
			oTree.getModel().refresh(0);
			oTree.setBusy(false);

		},

		/*
		onGetData: function (oModel, sPath, iLevel, sRuta) {
			var that = this;
			var oTree = this.byId("Tree");
			oTree.setBusy(true);
			var oDataSend = {
				sOrigen: 'sites/intranet_pe/finanzas',
				sRuta: sRuta
				// sNombre: 'Texto_prueba_inchcape.txt'
			}
			$.ajax("/sharepointrest/api/Contenido", {
				type: "POST",
				cache: false,
				data: JSON.stringify(oDataSend),
				async: true,
				success: function (data) {
					var aFiles = JSON.parse(data);
					var aNewNodes = [];
					if (aFiles.length > 0) {
						for (var i = 0; i < aFiles.length; i++) {
							var oItem = {};
							switch (aFiles[i]["__metadata"]["type"]) {
								case "SP.File":
									oItem = {
										ref: "sap-icon://document",
										sTipo: "Documento",
										text: aFiles[i]["Name"],
										ruta: aFiles[i]["ServerRelativeUrl"]
									};
									aNewNodes.push(oItem);
									break;
								case "SP.Folder":
									oItem = {
										ref: "sap-icon://open-folder",
										sTipo: "Folder",
										text: aFiles[i]["Name"],
										ruta: aFiles[i]["ServerRelativeUrl"],
										nodes: [{ // This dummy node is required to get an expandable item.
											text: "",
											dummy: true
										}]
									};
									aNewNodes.push(oItem);
									break;

							}
							oModel.setProperty(sPath ? sPath + "/nodes" : "/", aNewNodes);
						}
						oTree.getModel().refresh(0);
						oTree.setBusy(false);
					} else {
						var oItem2 = {
							ref: "sap-icon://document",
							sTipo: "Blank",
							text: "No se encontraron archivos",
							ruta: ""
						};
						aNewNodes.push(oItem2);
						oModel.setProperty(sPath ? sPath + "/nodes" : "/", aNewNodes);
						oTree.getModel().refresh(0);
						oTree.setBusy(false);
					}
				},
				error: function (error) { }
			});
		}, 
		*/

		onToggleOpenState: function (oEvent) {
			var iItemIndex = oEvent.getParameter("itemIndex");
			var oItemContext = oEvent.getParameter("itemContext");
			var bExpanded = oEvent.getParameter("expanded");
			var oTree = this.byId("Tree");
			var oModel = oTree.getModel();
			var sPath = oItemContext.getPath();
			var bChildIsDummyNode = oModel.getProperty(sPath + "/nodes/0").dummy === true;
			if (bExpanded && bChildIsDummyNode) {
				this.onGetData(oModel, sPath, oTree.getItems()[iItemIndex].getLevel(), oModel.getProperty(sPath).ruta);
			}
		},
		onDescargarDocumento: function () {
			var sRuta = "";
			var aValida = this.byId("Tree").getSelectedContextPaths();
			if (aValida.length == 0) {
				//Selecione un Documento
				MessageBox.error("Selecione un documento.");
			} else {
				var oValor = this.byId("Tree").getModel().getProperty(aValida[0]);
				if (oValor.sTipo === "Folder") {
					MessageBox.error("No se puede descargar el folder, selecione un documento.");
				} else {
					this.onGetValor(oValor.ruta, oValor.text);
				}
			}
		},
		onGetValor: function (sRuta, sDocumento) {
			var that = this;
			var oDataSend = {
				sOrigen: 'sites/intranet_pe/finanzas',
				sRuta: sRuta,
				sNombre: sDocumento
			}
			$.ajax("/sharepointrest/api/Valores", {
				type: "POST",
				cache: false,
				data: JSON.stringify(oDataSend),
				async: true,
				success: function (data) {

					var file = JSON.parse(data);

					var element = document.createElement('a');

					element.setAttribute('href', 'data:' + models.getMimeTypes(file.sNombre) + ';base64,' + file.sValor);
					element.setAttribute('download', file.sNombre);

					element.style.display = 'none';
					document.body.appendChild(element);
					element.click();
					document.body.removeChild(element);
				},
				error: function (error) {

				},
			});
		},
		onSelectTab: function (oEvent) {
			var that = this,
				urlGlobal = sap.ui.getCore().getModel("urlGlobal");
			var oKey = oEvent.getSource().getSelectedKey();
			switch (oKey) {
				case "keyArchivos":
					var urlGlobal = urlGlobal + "&ID=04&LIB=SolPed&COD=0010016093";
					$.ajax({
						url: urlGlobal,
						cache: false,
						type: "GET",
						headers: {
							"Authorization": "Basic " + localStorage.getItem("sUserLogin"),
							"X-Requested-With": "XMLHttpRequest"
						},
						beforeSend: function () {
							console.log("beforeSend")
						},
						success: function (result, status, xhr) {
							console.log(result);
							console.log("success");
						},
						error: function (xhr, status, error) {
							console.log("error")
						},
						complete: function () {
							console.log("complete")
						}

					});
					break;
			}
			console.log("Select")
		},
		onListItemPress: function (oEvent) {
			var that = this;
			var sId = (!oEvent) ? " " : (oEvent.getId === "listLibMas") ? oEvent.getId : oEvent.getId();
			
			var sToPageId = (sId === "itemPress") ? "idPageSolPedi" : 
								(sId === "navButtonPress") ? "idMasterSolPedi" : "idMasterSolPedi";
										
			that.byId("idSplitApp").toDetail(this.createId(sToPageId));
		},

		onSelectItemTable: function (oEvent){
			var aData = [],
				oSelectItem = oEvent.getSource().getSelectedItems();

            sap.ui.getCore().setModel(aData, "aData");
			
			if(oSelectItem.length !== 0){
			    $.each(oSelectItem,function(index, item){
					var oItem = item.getBindingContext().getObject();

					aData.push({
						"documento": oItem.po_number,
						"posicion": oItem.po_item,
						"indicador": oItem.frgco,
						"usuario": localStorage.getItem("sUser")
					});
				});	
			}
			
			sap.ui.getCore().setModel(aData, "aData");
		}
	});
});