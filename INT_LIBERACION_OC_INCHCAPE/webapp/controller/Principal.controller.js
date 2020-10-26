sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/m/Token",
	"sap/m/Button",
	"sap/m/MultiInput",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/ButtonType",
	"sap/ui/model/FilterOperator",
	"sap/m/ToolbarSpacer",
	"sap/m/ToggleButton",
	"intordendecompras/intOrdenDeCompras/model/formatter",
	"intordendecompras/intOrdenDeCompras/model/models",
	"intordendecompras/intOrdenDeCompras/model/config"

], function (Controller, JSONModel, Device, MessageBox, MessageToast, Filter, Token, Button, MultiInput, Dialog, Text, ButtonType, FilterOperator, ToolbarSpacer, ToggleButton, formatter, models, config
		) {
	"use strict";

	var icountDoc,
		oMultiInput,
		oButtonSearch,
		oButtonRemove,
		oToggleButton,
		oToolbarSpacer;

	return Controller.extend("intordendecompras.intOrdenDeCompras.controller.Principal", {

		formatter: formatter, 
		onInit: function () {  
			var urlGlobal = config.getUrlGlobal(),
			//var urlGlobal = "/sap/bc/zservice_mm_lib?sap-client=800",
			//var urlGlobal = "/ServiceRest/zservice_mm_lib?sap-client=800", 
				
				opo_items = [],
				opo_headers = [],
				opo_liberadores = [],
				oToken = [],
				oThes = this, 
				bModeSearch;

			var oListSelectItems = [],
				oListSelectItemsSearch = [];

			sap.ui.getCore().setModel(urlGlobal, "urlGlobal"); 
			sap.ui.getCore().setModel(opo_items, "opo_items");
			sap.ui.getCore().setModel(opo_headers, "opo_headers");
			sap.ui.getCore().setModel(opo_liberadores, "opo_liberadores");
			sap.ui.getCore().setModel(oToken, "oToken");
			sap.ui.getCore().setModel(oThes, "oThes");
			sap.ui.getCore().setModel(bModeSearch, "bModeSearch");

			sap.ui.getCore().setModel(oListSelectItems, "oListSelectItems");
			sap.ui.getCore().setModel(oListSelectItemsSearch, "oListSelectItemsSearch");

			sap.ui.getCore().setModel(new JSONModel({}), "allData");
			sap.ui.getCore().setModel(new JSONModel({}), "oCurrentOrdCom");

			/**********************************************************************************************************************************************/
			//Cargar Botones

			//Boton Buscar OC Masivo
			oButtonSearch = new Button("idBtnSearch", {
				icon: "sap-icon://refresh",
				type: "Accept",
				press: function(){
					var oThes = sap.ui.getCore().getModel("oThes");
					oThes.fnLoadAllData();
					var TableLibMas = oThes.getView().byId("idTableLibMas");
						TableLibMas.setModel(new JSONModel([]));
				} 
			});

			//Boton Cancelar Busqueda OC Masivo							
			oButtonRemove = new Button("idBtnRemove", {
				icon: "sap-icon://decline",
				press: function () {
					var oThes = sap.ui.getCore().getModel("oThes"),
						oMultiInput = oThes.getView().byId("idNroDocumento"),
						opo_headers = oThes.getView().byId("idListOrdComp").getModel().getData(),
						//opo_headers			= sap.ui.getCore().setModel(opo_headers, "opo_headers"),
						oItemsSelectGlobal = [],
						oListSelectItems,
						ListOrdCompMas;

					sap.ui.getCore().setModel("", "bModeSearch");		//Indicar Seleccion sin busqueda

					oButtonRemove.setVisible(false);
					oMultiInput.setWidth("85%");
					oMultiInput.setTokens([]);
					sap.ui.getCore().setModel([], "oToken");

					ListOrdCompMas = new JSONModel(opo_headers);
					ListOrdCompMas.setSizeLimit(999999999);
					oThes.getView().byId("idListOrdCompMas").setModel(ListOrdCompMas);

					//Leer contenido de la tabla liberacion Masiva
					oListSelectItems = oThes.getView().byId("idTableLibMas").getModel().getData();

					setTimeout(function (that) {
						var oTableItems = oThes.getView().byId("idListOrdCompMas").getItems();
						$.each(oListSelectItems, function (index, item) {
							$.each(oTableItems, function (idx, itm) {
								if (item.Documento === itm.getProperty("title")) {
									oItemsSelectGlobal.push(itm);
								}
							});
						});

						$.each(oItemsSelectGlobal, function (index, item) {
							oThes.getView().byId("idListOrdCompMas").setSelectedItem(item);
						});
					}, 100);
				}
			});

			var thes = this;

			oToggleButton = new ToggleButton("idLibMasiva", {
				icon: "sap-icon://flag",
				type: "Accept",
				text: "Liberación Masiva",
				visible: false,
				//press: [Controller.fnToggleButton]
				//press: this.fnToggleButton(sap.ui.base.EventProvider)
				press: function (oEvent) { 
					var oThes = sap.ui.getCore().getModel("oThes"),
					oToolbarMas = oThes.getView().byId("idToolbarMas"),
					oTOken = sap.ui.getCore().getModel("oToken");
				
					//this.onListItemPress(false);
					oThes.byId("idSplitApp").to(thes.createId("idMasterLibOrdCompMas"));
	
				if (oEvent.getSource().getPressed()) {
					
					if(Device.system.phone){
						oThes.fnChangePage("idMasterLibOrdCompMas", true);									//To Mater Liberacion OC Masivo
						//oThes.fnChangePage("idPageLibMasOrdComp", false);									//To Detail Liberacion OC Masivo
					}else{
						oThes.fnChangePage("idMasterLibOrdCompMas", true);									//To Mater Liberacion OC Masivo
						oThes.fnChangePage("idPageLibMasOrdComp", false);									//To Detail Liberacion OC Masivo
					}
					
					//Limpiar tabla Liberacion Masiva
					var TableLibMas = oThes.getView().byId("idTableLibMas");
					//	TableLibMas.setModel(new JSONModel([]));
	
					//Evaluar Visibilidad de Boton Libear
					if (TableLibMas.getModel() === undefined) {
						oThes.getView().byId("btnLibMasLiberar").setEnabled(false);
					}
	
					/**********************************************************************************/
					//Add Token en MultiInput
					var oMultiInput = oThes.getView().byId("idNroDocumento");
					oMultiInput.addValidator(function (args) {
						var text = args.text;
						return new Token({ key: text, text: text });
					});
	
					oMultiInput.attachTokenUpdate(function (args) {
						var sAddedTokens = args.getParameters().addedTokens;
						var sRemovedTokens = args.getParameters().removedTokens;
						oTOken = sap.ui.getCore().getModel("oToken");
	
						if (sAddedTokens.length !== 0) {
							$.each(sAddedTokens, function (index, item) {
								var sText = item.getProperty("text");
								oTOken.push({ "value": sText });
							});
							if (oMultiInput.getTokens().length !== 0) {
								oMultiInput.setWidth("70%");
							}
							oButtonRemove.setVisible(true);
						}
	
						if (sRemovedTokens.length !== 0) {
							var sToken = oMultiInput.getTokens();
							var sText = sRemovedTokens[0].getProperty("text");
							opo_headers = oThes.getView().byId("idListOrdComp").getModel().getData();
	
							for (var x = 0; x < sToken.length; x++) {
								var sDoc = oMultiInput.getTokens()[x].getProperty("text");
								if (sDoc === sText) {
									oTOken.splice(x, 1);
								}
							}
							if (oMultiInput.getTokens().length === 1) {
								// var opo_headers		= sap.ui.getCore().getModel("opo_headers");
								// 	oThes.getView().byId("idListOrdCompMas").setModel(new JSONModel(opo_headers))		//Resetear contenido de lista
	
								oButtonRemove.setVisible(false);
								oMultiInput.setWidth("85%");
	
	
								var ListOrdCompMas = new JSONModel(opo_headers);
								ListOrdCompMas.setSizeLimit(999999999);
								oThes.getView().byId("idListOrdCompMas").setModel(ListOrdCompMas);
	
								//Select Item - Obs convertilo a function
								var oListSelectItems = sap.ui.getCore().getModel("oListSelectItems");
								var oListSelectItemsSearch = sap.ui.getCore().getModel("oListSelectItemsSearch");
	
								/**********************************************************************************/
	
								/**********////*****************/
								//Leer contenido de la tabla liberacion Masiva
								oListSelectItems = oThes.getView().byId("idTableLibMas").getModel().getData();
								var oItemsSelectGlobal = [];
	
								var oTableItems = oThes.getView().byId("idListOrdCompMas").getItems();
								$.each(oListSelectItems, function (index, item) {
									$.each(oTableItems, function (idx, itm) {
										if (item.Documento === itm.getProperty("title")) {
											oItemsSelectGlobal.push(itm);
										}
									});
								});
	
								$.each(oItemsSelectGlobal, function (index, item) {
									oThes.getView().byId("idListOrdCompMas").setSelectedItem(item);
								});
	
								//Select Item - Obs convertilo a function
	
							}
						}
						var oOverflosToolbarMas = oThes.getView().byId("idMasterLibOrdCompMas");
						oOverflosToolbarMas.addContent(oButtonRemove);
					});
					/**********************************************************************************/
					//Agregar Botones Footer a Page Master "Liberacion OC Masivo"
	
					oToolbarMas.addContent(oButtonSearch);
					oToolbarMas.addContent(oToolbarSpacer);
					oToolbarMas.addContent(oToggleButton);
	
				} else {
					sap.ui.core.BusyIndicator.show(0);
	
					var oMultiInput = oThes.getView().byId("idNroDocumento");
					//oMultiInput
					
					if(Device.system.phone){
						oThes.fnChangePage("idMasterLibOrdComp", true);											//To Master Liberacion OC Individual
					}else{
						oThes.fnChangePage("idMasterLibOrdComp", true);											//To Master Liberacion OC Individual
						oThes.fnChangePage("idPageLibOrdComp", false);											//To Detail Liberacion OC Individual
					}
					
	
					oTolbar.addContent(oButtonSearch);
					oTolbar.addContent(oToolbarSpacer);
					oTolbar.addContent(oToggleButton);
	
					sap.ui.core.BusyIndicator.hide();
				}
			}
				});
	
				oToolbarSpacer = new ToolbarSpacer();
				/***********************************************************************************************************************************************/
	
				var oTolbar = this.getView().byId("idToolbar");
				oTolbar.addContent(oButtonSearch);
				oTolbar.addContent(oToolbarSpacer);
				oTolbar.addContent(oToggleButton);
	
				/***********************************************************************************************************************************************/
				//Validar si es Mobile
				
				if(Device.system.phone){
					oThes.getView().byId("idPageLibOrdComp").setShowNavButton(true);
					oThes.getView().byId("pnCabecera").setExpandable(true);
					oThes.getView().byId("pnCabecera").setExpanded(true);
					
					
					//Liberacion Masiva
					oThes.getView().byId("idNextPage").setVisible(true);
					oThes.getView().byId("idPageLibMasOrdComp").setShowNavButton(true)
					
				}else{}
				
				//Ocultar Tree
				oThes.getView().byId("Tree").setVisible(false);
		},
		
		onBeforeRendering: function () {
			if(localStorage.getItem("sUser") === null ||  localStorage.getItem("sUser") === ""){
				var urlWeb = config.getUrlWeb();
				window.open(urlWeb,"_self");
			}
			this.fnLoadAllData();	//Cargar todos los datos
		},

		// fnToggleButton: function(){
		// 	var oThes = sap.ui.getCore().getModel("oThes"),
		// 		oToolbarMas = oThes.getView().byId("idToolbarMas"),
		// 		oTOken = sap.ui.getCore().getModel("oToken");
			
		// 		this.onListItemPress(false);

		// 	if (oEvent.getSource().getPressed()) {
		// 		oThes.fnChangePage("idMasterLibOrdCompMas", true);									//To Mater Liberacion OC Masivo
		// 		oThes.fnChangePage("idPageLibMasOrdComp", false);									//To Detail Liberacion OC Masivo

		// 		//Limpiar tabla Liberacion Masiva
		// 		var TableLibMas = oThes.getView().byId("idTableLibMas");
		// 		//	TableLibMas.setModel(new JSONModel([]));

		// 		//Evaluar Visibilidad de Boton Libear
		// 		if (TableLibMas.getModel() === undefined) {
		// 			oThes.getView().byId("btnLibMasLiberar").setEnabled(false);
		// 		}

		// 		/**********************************************************************************/
		// 		//Add Token en MultiInput
		// 		var oMultiInput = oThes.getView().byId("idNroDocumento");
		// 		oMultiInput.addValidator(function (args) {
		// 			var text = args.text;
		// 			return new Token({ key: text, text: text });
		// 		});

		// 		oMultiInput.attachTokenUpdate(function (args) {
		// 			var sAddedTokens = args.getParameters().addedTokens;
		// 			var sRemovedTokens = args.getParameters().removedTokens;
		// 			oTOken = sap.ui.getCore().getModel("oToken");

		// 			if (sAddedTokens.length !== 0) {
		// 				$.each(sAddedTokens, function (index, item) {
		// 					var sText = item.getProperty("text");
		// 					oTOken.push({ "value": sText });
		// 				});
		// 				if (oMultiInput.getTokens().length !== 0) {
		// 					oMultiInput.setWidth("70%");
		// 				}
		// 				oButtonRemove.setVisible(true);
		// 			}

		// 			if (sRemovedTokens.length !== 0) {
		// 				var sToken = oMultiInput.getTokens();
		// 				var sText = sRemovedTokens[0].getProperty("text");
		// 				opo_headers = oThes.getView().byId("idListOrdComp").getModel().getData();

		// 				for (var x = 0; x < sToken.length; x++) {
		// 					var sDoc = oMultiInput.getTokens()[x].getProperty("text");
		// 					if (sDoc === sText) {
		// 						oTOken.splice(x, 1);
		// 					}
		// 				}
		// 				if (oMultiInput.getTokens().length === 1) {
		// 					// var opo_headers		= sap.ui.getCore().getModel("opo_headers");
		// 					// 	oThes.getView().byId("idListOrdCompMas").setModel(new JSONModel(opo_headers))		//Resetear contenido de lista

		// 					oButtonRemove.setVisible(false);
		// 					oMultiInput.setWidth("85%");


		// 					var ListOrdCompMas = new JSONModel(opo_headers);
		// 					ListOrdCompMas.setSizeLimit(999999999);
		// 					oThes.getView().byId("idListOrdCompMas").setModel(ListOrdCompMas);

		// 					//Select Item - Obs convertilo a function
		// 					var oListSelectItems = sap.ui.getCore().getModel("oListSelectItems");
		// 					var oListSelectItemsSearch = sap.ui.getCore().getModel("oListSelectItemsSearch");

		// 					/**********************************************************************************/

		// 					/**********////*****************/
		// 					//Leer contenido de la tabla liberacion Masiva
		// 					oListSelectItems = oThes.getView().byId("idTableLibMas").getModel().getData();
		// 					var oItemsSelectGlobal = [];

		// 					var oTableItems = oThes.getView().byId("idListOrdCompMas").getItems();
		// 					$.each(oListSelectItems, function (index, item) {
		// 						$.each(oTableItems, function (idx, itm) {
		// 							if (item.Documento === itm.getProperty("title")) {
		// 								oItemsSelectGlobal.push(itm);
		// 							}
		// 						});
		// 					});

		// 					$.each(oItemsSelectGlobal, function (index, item) {
		// 						oThes.getView().byId("idListOrdCompMas").setSelectedItem(item);
		// 					});

		// 					//Select Item - Obs convertilo a function

		// 				}
		// 			}
		// 			var oOverflosToolbarMas = oThes.getView().byId("idMasterLibOrdCompMas");
		// 			oOverflosToolbarMas.addContent(oButtonRemove);
		// 		});
		// 		/**********************************************************************************/
		// 		//Agregar Botones Footer a Page Master "Liberacion OC Masivo"

		// 		oToolbarMas.addContent(oButtonSearch);
		// 		oToolbarMas.addContent(oToolbarSpacer);
		// 		oToolbarMas.addContent(oToggleButton);

		// 	} else {
		// 		sap.ui.core.BusyIndicator.show(0);

		// 		var oMultiInput = oThes.getView().byId("idNroDocumento");
		// 		oMultiInput
		// 		oThes.fnChangePage("idMasterLibOrdComp", true);											//To Master Liberacion OC Individual
		// 		oThes.fnChangePage("idPageLibOrdComp", false);											//To Detail Liberacion OC Masivo

		// 		oTolbar.addContent(oButtonSearch);
		// 		oTolbar.addContent(oToolbarSpacer);
		// 		oTolbar.addContent(oToggleButton);

		// 		sap.ui.core.BusyIndicator.hide();
		// 	}
			
		// },

		fnChangePage: function (pIdPageApp, pFlag) {
			var oThat = this;
			if (pFlag) {
				oThat.byId("idSplitApp").toMaster(oThat.createId(pIdPageApp));
			} else {
				oThat.byId("idSplitApp").to(oThat.createId(pIdPageApp));
			}
		},


		//Alternar con liberación masiva
		fnToggleLibMasOrdComp: function (oEvent) {
			var that = this,
				oThes = sap.ui.getCore().getModel("oThes"),
				oTOken = sap.ui.getCore().getModel("oToken");
			//idMaster= this.createId("idPageLibMasOrdComp");
			if (oEvent.getSource().getPressed()) {


				//var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				// var oRouter = this.getOwnerComponent().getRouter();
				// oRouter.navTo("LibMasOrdComp");

				//To Mater
				//oThes.fnGetSplitAppObj().toMaster(oThes.createId("idMasterLibOrdCompMas"));
				oThes.byId("idSplitApp").toMater(idMaster);
				//to Detail
				this.fnGetSplitAppObj().to();
				//this.getView().byId("idListOrdComp").setIncludeItemInSelection(false);
				var ListOrdComp = this.getView().byId("idListOrdCompMas");
				//ListOrdComp.setMode("MultiSelect");

				//Limpiar tabla Liberacion Masiva
				var TableLibMas = that.getView().byId("idTableLibMas");
				TableLibMas.setModel(new JSONModel([]));

				// //Desactivar boton Liberar
				// that.getView().byId("btnLibMasLiberar").setEnabled(false);	

				// this.getView().byId("idBtnSearch").setVisible(true);
				// this.getView().byId("idNroDocumento").setVisible(true);

				/***************/

				// <MultiInput id="idNroDocumento" showValueHelp="false" placeholder="Ingrese uno o varios Documentos" width="85%" visible="false"/>
				// 	<Button id="idBtnSearch" icon="sap-icon://search" press="fnSearch" visible="false"/>

				// oMultiInput  =	new MultiInput( "idNroDocumento",
				// 					{
				// 					  "showValueHelp": false,
				// 					  "placeholder" : "Ingrese uno o varios Documentos",
				// 					  "width"		: "85%"
				// 					}
				// 				);

				// oButtonSearch = new Button( "idBtnSearch",
				// 					{
				// 						"icon": "sap-icon://search",
				// 						press: function() { 
				// 							debugger;
				// 								var textSearched	= this.getView().byId("idSearchField").getValue(),
				// 								oTableOrdCom	= this.getView().byId("idListOrdComp"),
				// 								aFilter 		= [], //Filtro
				// 								oBinding		= oTableOrdCom.getBinding("items"); //Obtener  datos manipulables - creo

				// 							aFilter.push(new Filter({
				// 								filters: [
				// 									new Filter("po_number", FilterOperator.Contains, textSearched), //Buscar en Orden de Compra
				// 									new Filter("currency", FilterOperator.Contains, textSearched), //Buscar en moneda
				// 									new Filter("vend_name", FilterOperator.Contains, textSearched),	//Buscar en Proveedor
				// 									new Filter("created_on", FilterOperator.Contains, textSearched) //Buscar en fecha - PENDIENTE - busca en fecha sin formato
				// 								],
				// 								and: false
				// 							}));	

				// 							oBinding.filter(aFilter);

				// 						},
				// 					}
				// 				);

				// this.getView().byId("idOverflowToolbar").addContent(oMultiInput);
				// this.getView().byId("idOverflowToolbar").addContent(oButtonSearch);		//Button Buscar Documentos

				//this.getView().byId("idBtnSearch").setVisible(true);			//Activar Boton Buscar Documento
				//this.getView().byId("idNroDocumento").setVisible(true);			//Activar Busqueda Masiva

				//Add Token en MultiInput
				// 	var oMultiInput	= this.getView().byId("idNroDocumento");
				// 	oMultiInput.addValidator(function(args){
				// 		var text = args.text;	
				// 		return new Token({key: text, text: text});
				// 	});

				// 	oMultiInput.attachTokenUpdate(function(args){
				// 		debugger;
				// 		var sAddedTokens	= args.getParameters().addedTokens;
				// 		var sRemovedTokens	= args.getParameters().removedTokens;

				// 		if(sAddedTokens.length !== 0){
				// 			$.each(sAddedTokens, function(index, item){
				// 				var sText = item.getProperty("text");
				// 				oTOken.push({"value": sText});
				// 			});	
				// 		}

				// 		if(sRemovedTokens.length !== 0){
				// 			var sToken	= oMultiInput.getTokens();
				// 			var sText	= sRemovedTokens[0].getProperty("text");

				// 			for(var x = 0; x < sToken.length ; x++){
				// 				var sDoc = oMultiInput.getTokens()[x].getProperty("text");
				// 				if(sDoc === sText){
				// 					oTOken.splice(x, 1);
				// 				}	
				// 			}
				// 		}
				// 	});

				// 	this.getView().byId("idSearchField").setVisible(false);			//Desactivar Busqueda Individual

				// 	/*************************************/

			} else {
				// 	sap.ui.core.BusyIndicator.show(0);

				//To Mater
				this.fnGetSplitAppObj().toMaster(this.createId("idMasterLibOrdComp"));
				this.fnGetSplitAppObj().to(this.createId("idPageLibOrdComp"));
				this.getView().byId("idListOrdComp").setMode("None");

				// 	this.getView().byId("idSearchField").setVisible(true);			//Activar Busqueda Individual

				// 	this.getView().byId("idBtnSearch").setVisible(false);
				// 	this.getView().byId("idNroDocumento").setVisible(false);
				// 	// oButtonSearch.destroy(true);
				// 	// oMultiInput.destroy(true);

				// 	//this.getView().byId("idMasterLibOrdComp").setBusy(false);
				// 	sap.ui.core.BusyIndicator.hide();
			}
		},

		// fnGetSplitAppObj: function () { debugger;
		// 	var result = this.byId("idSplitApp");
		// 	return result;
		// },

		//Ir a Liberación Orden de Compra
		// fnNavToLibOrdComp: function() {
		// 	this.fnGetSplitAppObj().toMaster(this.createId("idMasterLibOrdComp"));
		// 	this.fnGetSplitAppObj().to(this.createId("idPageLibOrdComp"));
		// },

		//Mostrar detalle de liberación masiva
		// fnNavToDetailOrdCompLibMas: function(oEvent) {
		// 	this.fnGetSplitAppObj().toDetail(this.createId("idPageLibMasOrdComp"));
		// },

		fnSearch: function (pType) {
			var textSearched = this.getView().byId("idSearchField").getValue(),
				oTableOrdCom = this.getView().byId("idListOrdComp"),
				aFilter = [], //Filtro
				oBinding = oTableOrdCom.getBinding("items");

			sap.ui.getCore().setModel("x", "bModeSearch");				//Para seleccion de busqueda

			const oSelectItemsList = sap.ui.getCore().getModel("oListSelectItems");
			var oItem = [];


			if (pType === true) {
				//var oMultiInput	= this.getView().byId("idNroDocumento");
				var oToken = sap.ui.getCore().getModel("oToken");
				oTableOrdCom = this.getView().byId("idListOrdCompMas");
				oBinding = oTableOrdCom.getBinding("items");


				var opo_headers = sap.ui.getCore().getModel("opo_headers"),
					opo_filter = opo_headers;

				var oFilter = [];

				if (oToken.length === 0) {
					var oDialog = new Dialog({
						title: "Alerta",
						type: "Message",
						state: "Warning",
						content: new Text({
							text: "Debe ingresar uno o varios Documentos"
						}),
						beginButton: new Button({
							type: ButtonType.Emphasized,
							text: "OK",
							press: function () {
								oDialog.close();
							}
						}),
						afterClose: function () {
							oDialog.destroy();
						}
					});

					oDialog.open();
				} else {
					$.each(oToken, function (index, item) {
						oFilter.push(new Filter("po_number", FilterOperator.Contains, item.value));
					});

					aFilter.push(new Filter({
						filters: oFilter,
						and: false
					}));

					oBinding.filter(aFilter);

					// $.each(oToken,function(idx, itm){
					// 	var sNumDocFilter = itm.value;
					// 	$.each(opo_filter,function(index, item){
					// 		var sNumDoc = item.po_number;
					// 		if(sNumDocFilter === sNumDoc){
					// 			oItem.push({
					// 				po_number		: item.po_number,
					// 				net_priceTotal	: item.net_priceTotal,
					// 				currency		: item.currency,
					// 				vend_name		: item.vend_name,
					// 				created_on		: item.created_on
					// 			});
					// 		}
					// 	});
					// });

					//var oItemModel = new JSONModel(oItem);
					//oTableOrdCom.setModel(oItemModel);

					// oTableOrdCom.getBinding("items").refresh(true);

					// setTimeout(function(that){debugger; 
					// 	//Seleccionar Listar
					// 	$.each(oItem, function(index,item){
					// 		var sNumDocSearch = item.po_number;
					// 		$.each(oSelectItemsList, function(idx, itm){
					// 			if(sNumDocSearch === itm.numDoc){
					// 				oTableOrdCom.setSelectedItem(itm.item);
					// 			}
					// 		});
					// 	});
					// }, 1000);


					//new Filter({
					//   path: 'Quantity',
					//   operator: FilterOperator.LT,
					//   value1: 20
					// }),

					// $.each(oToken,function(index, item){
					// 	textSearched = item.value;
					// 	aFilter.push(new Filter({
					// 		filters: [
					// 			new Filter("po_number", FilterOperator.Contains, "4500018068")
					// 		],
					// 		and: false
					// 	}));
					// });

					// oBinding.filter(aFilter);



				}

			} else {
				aFilter.push(new Filter({
					filters: [
						new Filter("po_number", FilterOperator.Contains, textSearched) //Buscar en Orden de Compra

					],
					and: false
				}));

				oBinding.filter(aFilter);
			}
		},

		
		onGetToken: function () { //debugger;
			var sRusult,
				oParameterSharepoint = config.getParameterSharepoint(),
				sUrl = "https://cors-anywhere.herokuapp.com/"+"https://accounts.accesscontrol.windows.net/"+oParameterSharepoint.Realm+"/tokens/OAuth/2";
			$.ajax(sUrl, {
				method: "POST",
				timeout: 0,
				headers: {
					"appReg_clientId": oParameterSharepoint.ClienteId,
					"appReg_clientSecret": oParameterSharepoint.ClienteSecret,
					"targetHost": oParameterSharepoint.TarjeHost,
					"principal": oParameterSharepoint.Principal,
					"realm": oParameterSharepoint.Realm,
					"Content-Type": "application/x-www-form-urlencoded"
				},
				data: {
					"grant_type": "client_credentials",
					"client_id": oParameterSharepoint.ClienteId + "@" + oParameterSharepoint.Realm,
					"client_secret": oParameterSharepoint.ClienteSecret,
					"resource": oParameterSharepoint.Principal + "/" + oParameterSharepoint.TarjeHost + "@" + oParameterSharepoint.Realm
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

		onGetUrlFile: function (sUrlDocSap) { //debugger;
				var sUrl = "https://inchcapelatam.sharepoint.com/sites/intranet_pe/finanzas/_api/web/GetFileByUrl(@url)?@url='" + sUrlDocSap +"'",
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

		onGetFile: function (sUrlDocSap, bFlagRelativeUrl) { //debugger;
			sap.ui.core.BusyIndicator.show(0);
			var sRelativeUrl = bFlagRelativeUrl !== true ? this.onGetUrlFile(sUrlDocSap): sUrlDocSap;
			
			if(sRelativeUrl.value !== false){
				var sUrl = "https://inchcapelatam.sharepoint.com/sites/intranet_pe/finanzas/_api/web/getFileByServerRelativeUrl('"+sRelativeUrl.value+"')/$value";
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

		onGetUniqueId: function(sUrlDocSap) { //debugger;
				var sUrl = "https://inchcapelatam.sharepoint.com/sites/intranet_pe/finanzas/_api/SP.RemoteWeb(@url)/web/GetSharingLinkData(@url)?@url='" + sUrlDocSap + "'",
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

		onGetUrlFolder: function(sUrlDocSap){ //debugger;
		
			var sUniqueId = this.onGetUniqueId(sUrlDocSap),
				sUrl = "https://inchcapelatam.sharepoint.com/sites/intranet_pe/finanzas/_api/web/GetFolderById(@url)?@url='" + sUniqueId.value + "'",
		
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
				sUrl = "https://inchcapelatam.sharepoint.com/sites/intranet_pe/finanzas/_api/web/GetFolderByServerRelativeUrl('"+ sRelativeUrl +"')?$expand=Folders,Files";
			
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

		fnIntemOrdCompPress: function (oEvent) { //debugger;
			var that = this;
			var urlGlobal = sap.ui.getCore().getModel("urlGlobal");
			that.getView().byId("idPageLibOrdComp").setBusy(true);
			var icountDoc = 0;			//Cantidad de archivos

			var bFlagResp;

			var oTablePosicion = this.getView().byId("idTablePosiciones"),
				allPosicion = sap.ui.getCore().getModel("allData").getProperty("/po_items"),
				opo_liberadores = sap.ui.getCore().getModel("opo_liberadores"),
				oPageLibOrdComp = this.getView().byId("idPageLibOrdComp"),
				oPageListLiberador = this.getView().byId("idListLiberador"),
				oPageColumnResp = this.getView().byId("idColumnResp"),
				oITFPosiciones = this.getView().byId("idITFPosiciones"), //Icon Tab Filter de posiciones
				oITFAdjuntos = this.getView().byId("idITFAdjuntos"), //Icon Tab Filter de archivos adjuntos

				//Seleccion de carga (Primer registro)
				oSelectedOrdComp = (oEvent.content === undefined) ? oEvent.getSource().getBindingContext().getObject() /*Orden de compra seleccionada*/ : oEvent.content;

				//Limpiar Texto Descripcion
				that.getView().byId("idTextDesc").setValue("");

			var aPosiciones = [];
			var aLiberaciones = [];

			//Coleccionar las posiciones de cada orden de compra y mostrarlas
			var count = 0; //Conteo de posiciones
			$.each(allPosicion, function (key, value) {

				icountDoc = key;

				// var target_val		= oSelectedOrdComp.target_val;
				// var result_target_val		= 0;

				if (value.po_number === oSelectedOrdComp.po_number) {
					//value.net_price 	= formatter.onSetConvertFormaterMoney(value.net_price);               	//Formato
					// result_target_val	= value.net_price + result_target_val;									//Suma Valor Neto
					aPosiciones.push(value);
					count++;

					// target_val = result_target_val;
				}
			});

			oITFPosiciones.setCount(count); //Cargar la cantidad de posiciones
			oITFAdjuntos.setCount();

			aPosiciones.sort(function(a, b) {
			  return a.po_item - b.po_item;
			});

			//Ordenar posiciones 	
			/*
			aPosiciones.sort(function(a, b) {
				var ia = parseInt(a.po_item);
				var ib = parseInt(b.po_item);
				if (ia > ib) {
					return 1;
				  }
				  if (ia < ib) {
					return -1;
				  }
				  return 0;
			});*/

			var aPosxDoc = new JSONModel(aPosiciones);
			aPosxDoc.setSizeLimit(999999999);
			oTablePosicion.setModel(aPosxDoc); //cargar las posiciones

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

			//Enviar datos a liberación de orden de compra
			oPageLibOrdComp.setModel(new JSONModel(oSelectedOrdComp));

			var that = this,
			urlDocAdjuntos = urlGlobal + "&ID=04&LIB=OC&COD=" + oSelectedOrdComp.po_number,
			urlDescCab = urlGlobal + "&ID=05&LIB=OC&COD=" + oSelectedOrdComp.po_number;

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

			//Cargar los datos adjuntos
			$.ajax({
				url: urlDocAdjuntos,
				cache: false,
				type: "GET",
				headers: {
					"Authorization": "Basic " + localStorage.getItem("sUserLogin"),
					"X-Requested-With": "XMLHttpRequest"
				},
				success: function (result, status, xhr) {
					var aFiles = [],
						oTableDocAdj = that.getView().byId("idTableDocAdj");

					$.each(result, function (key, value) {

						//Recorrer los archivos retornaos y ordenarlos
						var file = {};
						file.Name = value.line
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

			//Guardar la orden compra seleccionada
			sap.ui.getCore().setModel(new JSONModel(oSelectedOrdComp), "oCurrentOrdComp");

			//Ocultar Tree
			that.getView().byId("Tree").setVisible(false);

		},

		onGoLink: function (oEvent) { //debugger;
			sap.ui.core.BusyIndicator.hide();
			var oView = this.getView(),
				url = oEvent.getSource().getProperty("text");
				
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
			//var url = 'https://inchcapelatam.sharepoint.com/sites/intranet_pe/finanzas/Cotizaciones/Forms/AllItems.aspx?id=%2Fsites%2Fintranet%5Fpe%2Ffinanzas%2FCotizaciones%2F02%20Importaciones%2F100%20Unid%20BYD%20Nov%2Epdf&parent=%2Fsites%2Fintranet%5Fpe%2Ffinanzas%2FCotizaciones%2F02%20Importaciones';
			//var url = 'https://inchcapelatam.sharepoint.com/sites/intranet_pe/finanzas/Cotizaciones/01%20Repuestos/2019-04.%20Compras%20Abril%202019.pdf';
			//var url = 'https://inchcapelatam.sharepoint.com/:w:/r/sites/intranet_pe/finanzas/_layouts/15/Doc.aspx?sourcedoc=%7B9A8D0AF4-C04F-4EC3-9594-CFC3F3D19EF5%7D&file=COT.%20GLOBAL%20PERU.doc&action=default&mobileredirect=true';
			
			/* Comentado para pruebas

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

		//Formatear URL
		onFormatearURL: function (url) {
			var aRetornar = [];
			var rRetornar = {};
			var bStatus = false;
			var formatUrl = unescape(url);
			var formatUrlLowerCase = formatUrl.toLowerCase();
			var aExtensionesComunes = ['.aac', '.adt', '.adts', '.accdb', '.accde', '.accdr', '.accdt', '.aif', '.aifc', '.aiff', '.avi', '.bat', '.bin', '.bmp', '.cab', '.cda', '.csv', '.dif', '.dll', '.doc', '.docm', '.docx', '.dot', '.dotx', '.eml', '.eps', '.exe', '.flv', '.gif', '.htm', '.html', '.ini', '.iso', '.jar', '.jpg', '.jpeg', '.m4a', '.mdb', '.mid', '.midi', '.mov', '.mp3', '.mp4', '.mpeg', '.mpg', '.msi', '.mui', '.pdf', '.png', '.pot', '.potm', '.potx', '.ppam', '.pps', '.ppsm', '.ppsx', '.ppt', '.pptm', '.pptx', '.psd', '.pst', '.pub', '.rar', '.rtf', '.sldm', '.sldx', '.swf', '.sys', '.tif', '.tiff', '.tmp', '.txt', '.vob', '.vsd', '.vsdm', '.vsdx', '.vss', '.vssm', '.vst', '.vstm', '.vstx', '.wav', '.wbk', '.wks', '.wma', '.wmd', '.wmv', '.wmz', '.wms', '.wpd', '.wp5', '.xla', '.xlam', '.xll', '.xlm', '.xls', '.xlsm', '.xlsx', '.xlt', '.xltm', '.xltx', '.xps', '.zip'];

			if (formatUrl.includes('&id=/')) {
				var aSplitUrlById = [];
				aSplitUrlById = formatUrl.split('&id=/');
				var urlRuta = aSplitUrlById[aSplitUrlById.length - 1].toString();
				rRetornar.tipo = 'folder';
				rRetornar.urlRuta = urlRuta;
				rRetornar.nombre = '';
				aRetornar.push(rRetornar);
			} else {
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
							bStatus = true;
						}
					}
					//}
			    }
                
                if(!bStatus){
					rRetornar.urlRuta = '';
					rRetornar.tipo = 'invalido';
					rRetornar.nombre = '';
					aRetornar.push(rRetornar);                	
                }

			}
			return aRetornar;
		},
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
		}, */

		//Permitir al descarga de archivos
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

		//Liberar orden de compra
		fnLibOrdCompPress: function (oEvent) {

			var that = this,
				oModel = sap.ui.getCore().getModel("oModel"),
				oCurrentOrdComp = sap.ui.getCore().getModel("oCurrentOrdComp").getData(), //PENDIENTE - buscar para obtener el dato directamente del modelo
				data = {
					documento: oCurrentOrdComp.po_number,
					indicador: oCurrentOrdComp.ref_1
				};

			data = JSON.stringify(data); //Convertir a cadena

			MessageBox.confirm("¿Está seguro de liberar los documentos seleccionados?", {
				onClose: function (selectedOption) {

					if (selectedOption === MessageBox.Action.OK) {

						//Armar la cadena de parametros
						var urlParameters = "[" + data + "]" + "|X|O"; // "O" = orden de compra, "X" = Liberado

						oModel.read("/Aprobacion_RechazoSet", {

							urlParameters: {
								search: urlParameters
							},

							success: function (result, status, xhr) {

								that.fnLoadAllData(); //Cargar los datos de nuevo
								MessageBox.information("La liberación se realizó correctamente");

							},
							error: function (xhr, status, error) {
								MessageBox.error(xhr.statusText);
								sap.ui.core.BusyIndicator.hide();
							}

						});

					}
				}
			});
		},

		//Liberación masiva de ordenes de compra	
		onLiberar: function (pTypeLib) {
			var that = this;
			var ITFPosiciones = that.getView().byId("idITFPosiciones"),
				//TablePosiciones		= that.getView().byId("idTablePosiciones"), 
				TablePosiciones = that.getView().byId("idListOrdComp"),
				TableItems = TablePosiciones.getSelectedItems(),
				sTipoLib = (pTypeLib) ? "Individual" : "Masivo",
				TablePosicionesData = TablePosiciones.getModel().getData(),
				urlGlobal = sap.ui.getCore().getModel("urlGlobal"),
				arreglo = [],
				sTitleDialog, spo_number, titlemsg;

			sTitleDialog = "Estado de liberación Órden de Compra";

			if (sTipoLib === "Individual") {
				spo_number = ITFPosiciones.getModel().getData().po_number;
				titlemsg = "¿Liberar el documento " + spo_number + " ?";

			} else if (sTipoLib === "Masivo") {
				spo_number = [];
				TablePosiciones = that.getView().byId("idListOrdCompMas");
				TableItems = TablePosiciones.getSelectedItems();

				$.each(TableItems, function (index, item) {
					var sDoc = item.mProperties.title;
					TablePosiciones = that.getView().byId("idListOrdCompMas"),
						TableItems = TablePosiciones.getSelectedItems(),

						spo_number.push({ "po_number": sDoc });
				});
				titlemsg = "¿Esta seguro que desea liberar?";
			}

			MessageBox.confirm(titlemsg, {
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose: function (oAction) {
					switch (oAction) {
						case 'YES':
							sap.ui.core.BusyIndicator.show(0);

							if (sTipoLib === "Individual") {
								$.each(TablePosicionesData, function (index, item) {
									if (spo_number === item.po_number) {
										arreglo.push({
											"documento": item.po_number,
											"indicador": item.ref_1, 
											"usuario": localStorage.getItem("sUser")
										});
 
									}
								});
							} else if (sTipoLib === "Masivo") {
								$.each(spo_number, function (idx, itm) {
									$.each(TablePosicionesData, function (index, item) {
										if (itm.po_number === item.po_number) {
											arreglo.push({
												"documento": item.po_number,
												"indicador": item.ref_1, 
												"usuario": localStorage.getItem("sUser") 
											});
										}
									});
								});
							}

							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel.setData(arreglo);
							var jsonString = jsonModel.getJSON();

							urlGlobal = urlGlobal + "&ID=01&LIB=O";

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
									var sText = "",
										sType = "",
										oMessage;

									oMessage = result;

									if (oMessage.length === 1) {
										var sTypeMessage = oMessage[0].type;
										var sMessage = oMessage[0].message;

										//Tipo de Mensaje de retorno
										if (sTypeMessage === "S") {
											MessageBox.success(sMessage, {

												beginButton: new Button({
													type: ButtonType.Emphasized,
													text: "OK",
													press: function () {
														this.pressDialog.close();
													}.bind(this)
												})
											});
										} else if (sTypeMessage === "W") {
											MessageBox.warning(sMessage);
										} else if (sTypeMessage === "E") {
											MessageBox.error(sMessage);
										}

										that.fnLoadAllData();

									} else {
										var Dialogo = new sap.m.Dialog({ title: sTitleDialog });
										$.each(oMessage, function (k, v) {
											sText = v.message;
											sType = v.type;
											//										
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
												that.fnLoadAllData();
												Dialogo.destroy();
											}
										}));
										Dialogo.open();
									}
									//Limpiar tabla Liberacion Masiva
									var TableLibMas = that.getView().byId("idTableLibMas");
									TableLibMas.setModel(new JSONModel([]));

									sap.ui.core.BusyIndicator.hide();
								},
								error: function (xhr, status, error) {
									MessageBox.error(xhr.statusText);
									sap.ui.core.BusyIndicator.hide();
								} 
							}); 
					}
				}
			});
		},

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
					var oParam = {};
						oParam.value = oValor.ruta;
						oParam.token = this.onGetToken();
					this.onGetFile(oParam, true);
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

		//Cargar todos los datos
		fnLoadAllData: function () { //debugger;
			sap.ui.core.BusyIndicator.show(0);
			var that = this,
				urlGlobal = sap.ui.getCore().getModel("urlGlobal"),
				opo_headers = sap.ui.getCore().getModel("opo_headers"),
				opo_items = sap.ui.getCore().getModel("opo_items"),
				opo_liberadores = sap.ui.getCore().getModel("opo_liberadores"),
				oThes = sap.ui.getCore().getModel("oThes");

			if(localStorage.getItem("sUser") === null ||  localStorage.getItem("sUser") === ""){
				window.open("https://aprobacionesqa.inchcapelatam.app/","_self");
			}

			urlGlobal = urlGlobal + "&ID=02&LIB=OC&USER="+localStorage.getItem("sUser");
			//urlGlobal = urlGlobal + "&ID=02&LIB=OC&USER=FORTIZ";

			$.ajax({
				url: urlGlobal,
				cache: false,
				type: "GET",
				headers: {
					"Authorization": "Basic " + localStorage.getItem("sUserLogin"),
					"X-Requested-With": "XMLHttpRequest"
				},
				success: function (result, status, xhr) {
					var allData = JSON.parse(result.json), //Obtener todos los datos en JSON
						oListOrdComp = oThes.getView().byId("idListOrdComp"),
						oListOrdCompMas = oThes.getView().byId("idListOrdCompMas");

					if(allData.length === 0){
						oThes.getView().byId("idPageLibOrdComp").setVisible(false);
						oListOrdComp.setModel(new JSONModel([])); 
						oThes.getView().byId("il6").setText(allData.length);
						MessageBox.information("No tiene documentos para liberar");
					}else{
						oThes.getView().byId("idPageLibOrdComp").setVisible(true);
						allData = allData[0];
						sap.ui.getCore().setModel(new JSONModel(allData), "allData"); //Asignar todos los datos a allData

						opo_headers = allData.po_headers;
						opo_items = allData.po_items;
						opo_liberadores = allData.po_liberadores;

						sap.ui.getCore().setModel(opo_items, "opo_items");
						sap.ui.getCore().setModel(opo_headers, "opo_headers");
						sap.ui.getCore().setModel(opo_liberadores, "opo_liberadores");

						$.each(opo_headers, function (index, item) {
							$.each(opo_items, function (idx, itm) {
								if (item.po_number === itm.po_number) {
									var price = itm.net_price;
									price = formatter.onRemoveComma(price);

									if (item.net_priceTotal !== undefined) {

										var priceTotal = item.net_priceTotal;
										priceTotal = formatter.onRemoveComma(priceTotal);


										//var cndtn = price.toString().indexOf(".");

										var sDecimal = price.split(".")[0].substr(-2);
										var sEntero = price.split(".")[0].substr(0, (price.split(".")[0].length - 2));

										price = sEntero + "." + sDecimal;

										//SUMA
										price = parseFloat(priceTotal) + parseFloat(price);
										var decimal = price.toString().split(".")[1];

										if (decimal === undefined) {
											decimal = "00";
										} else {
											decimal = decimal + "0000";
											decimal = decimal.substring(0, 2);
										}

										price = price.toString().split(".")[0] + decimal;

									}
									//Item
									itm.net_price = formatter.onSetConvertFormaterMoney(itm.net_price);

									//Formatear Centro de Costo(Kost) y Centro Contable (Sakto)
									itm.kostl = formatter.onRemoveCeroLeft(itm.kostl);
									itm.sakto = formatter.onRemoveCeroLeft(itm.sakto);
									//Item

									price = formatter.onSetConvertFormaterMoney(price);
									item.net_priceTotal = price;


								}
							});
						});
						var ListOrdComp = new JSONModel(allData.po_headers);
						ListOrdComp.setSizeLimit(999999999);
						oListOrdComp.setModel(ListOrdComp); //solo ordenes de compra
						oListOrdCompMas.setModel(ListOrdComp);
						
						//Contador Lista de liberacion Individual
						oThes.getView().byId("il6").setText(allData.po_headers.length);
						
						//Contador Lista de liberacion masiva
						oThes.getView().byId("il5").setText(allData.po_headers.length);
						
						//Caragar la primera fila
						var sFirstContent = {};
						sFirstContent.content = allData.po_headers[0];
						oThes.fnIntemOrdCompPress(sFirstContent);
					}

					
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (xhr, status, error) {
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},

		onSelectionChange: function (oEvent) {
			var that = this;
			var ListItem = oEvent.getParameters().listItem;
			var bSelected = oEvent.getParameters().selected;

			var sDocumento = ListItem.getProperty("title");
			var sNumber = ListItem.getProperty("number");
			var sNumberUnit = ListItem.getProperty("numberUnit");
			var TableLibMas = that.getView().byId("idTableLibMas");
			var oModelTableLibMas = TableLibMas.getModel();

			oModelTableLibMas = (oModelTableLibMas === undefined) ? [] : oModelTableLibMas.getData();

			if (bSelected) {
				var opo_headers = sap.ui.getCore().getModel("opo_headers");
				var sLiberador;
				var sSigLiberador;

				$.each(opo_headers, function (index, item) {
					if (item.po_number === sDocumento) {
						sLiberador = item.codlib_name;
						sSigLiberador = item.frgct;
					}
				});

				oModelTableLibMas.push({
					"Documento": sDocumento,
					"Liberador": sLiberador,
					"SigLiberador": sSigLiberador,
					"Importe": sNumber + " " + sNumberUnit
				});
				TableLibMas.setModel(new JSONModel(oModelTableLibMas));

				// if(TableLibMas.getModel().getData().length === 1){
				that.getView().byId("btnLibMasLiberar").setEnabled(true);
				// }

				//Para activar o desactivar boton de Liberacion
				//that.getView().byId("btnLibMasLiberar").setEnabled(true);

				//Limpiar variable globar para guardar items Seleccionados
				var bModeSearch = sap.ui.getCore().getModel("bModeSearch");
				if (bModeSearch === "x") {
					sap.ui.getCore().setModel([], "oListSelectItemsSearch");
				} else {
					sap.ui.getCore().setModel([], "oListSelectItems");
				}


				//Guardar Items Seleccionados
				that.fnSelectListItem(true);

			} else {
				var status = false;
				var oTable = this.getView().byId("idTableLibMas");
				var ilength = oModelTableLibMas.length;

				var oTableItems = oTable.getItems();

				for (var x = 0; x < oTableItems.length; x++) {
					if (!status) {
						var sModelDocumento = oTableItems[x].mAggregations.cells[0].mProperties.text;
						if (sDocumento === sModelDocumento) {
							var oJSONData = TableLibMas.getModel().getData();
							oJSONData.splice(x, 1);
							TableLibMas.getModel().setData(oJSONData);
							status = true;
						}
					}
				}

				//Eliminar Items Seleccionados
				that.fnSelectListItem(false);

				//Para activar o desactivar boton de Liberacion
				if (ilength === 1) {
					//Desactivar boton Liberar
					that.getView().byId("btnLibMasLiberar").setEnabled(false);
				}
			}
		},

		fnSelectListItem: function (pTypeSelect) {
			var oSelectItems = this.getView().byId("idListOrdCompMas").getSelectedItems(),
				oItems = [];

			var bModeSearch = sap.ui.getCore().getModel("bModeSearch");

			if (oSelectItems.length !== 0) {
				$.each(oSelectItems, function (index, item) {
					oItems.push({
						"numDoc": item.getProperty("title"),
						"item": item
					});
				});
			} else {
				if (pTypeSelect) {												//Agregar Item Seleccionados
					oItems.push({
						item: oSelectItems[0],
						numDoc: oSelectItems[0].getProperty("title")
					});
				}
			}

			if (bModeSearch === "x") {
				sap.ui.getCore().setModel(oItems, "oListSelectItemsSearch");
			} else {
				sap.ui.getCore().setModel(oItems, "oListSelectItems");
			}
		},
		
		onListItemPress: function (oEvent) {
			var oThes = sap.ui.getCore().getModel("oThes");
			var sId = (!oEvent) ? " " : (oEvent.getId === "listLibMas") ? oEvent.getId : oEvent.getId();
			
			var sToPageId = (sId === "itemPress") ? "idPageLibOrdComp" : 
								(sId === "navButtonPress") ? "idMasterLibOrdComp" : 
									(sId === "press") ? "idPageLibMasOrdComp" : 
										(sId === "listLibMas") ? "idMasterLibOrdCompMas" : "idMasterLibOrdCompMas";
										
			oThes.byId("idSplitApp").toDetail(this.createId(sToPageId));
		},
	});
});