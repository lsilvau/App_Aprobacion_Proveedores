jQuery.sap.declare("aprobacionproveedor.aprobacionProveedor.model.formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");

aprobacionproveedor.aprobacionProveedor.model.formatter = {
    
	statusText :  function (value) {
		var bundle = this.getModel("i18n").getResourceBundle();
		return bundle.getText("StatusText" + value, "?");
	},
	
	statusState :  function (value) {
		var map = sap.ui.demo.myFiori.util.Formatter._statusStateMap;
		return (value && map[value]) ? map[value] : "None";
	},
	
	quantity :  function (value) {
		try {
			return (value) ? parseFloat(value).toFixed(0) : value;
		} catch (err) {
			return "Not-A-Number";
		}
	},
	
	time : function (value) {
			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({  
			     source:{pattern:"KKmmss"},  
			     pattern: "KK:mm:ss"}  
			);  
			    value = oDateFormat.parse(value);  
				return oDateFormat.format(new Date(value)); 
	},
	
	dates : function (value) { 
		if (value === "00000000" || value === undefined || value === null){
			return "";
		} else{
			value = value.toString();
			return  value.substring(6,8) + "." + value.substring(4,6) + "." + value.substring(0,4);
		}

	},
    
    prueba: function(value){
        console.log(value);
    },
    
    onSetMoney: function(value) {
        value = parseFloat(value + "").toFixed(2);
    	return Number(value).toLocaleString();
    },
    
   // onSetPriceTotal: function(value){
   // 	var result;
   // 	var condition = value.toString().indexOf(".");
    	
   // 	if(condition === -1){
   // 		result = value.toString() + "." + "00";
   // 	}else{
   // 		var div 		= value.toString().split(".");
			// var entero		= div[0];
			// var decimal 	= div[1];
		
			// var aument = "0000";
			// var val = decimal.toString() + aument;
		  
			// decimal = val.substring(0, 2);
		  
			// result = entero + "." + decimal ;	
   // 	}
		 // return result;
   // },
    
    onRemoveComma: function(pTotal){
    	var condition = pTotal.toString().indexOf(",");

		if(condition !== -1){
			var reExp 	= /,/gi;
			pTotal 	= pTotal.replace(reExp,"");
		}else{
			pTotal 	= pTotal;
		}
		
		return pTotal;
    },
    
    numero: function(value){
    	return Number(value);
    },
    
    onValorTotal: function (cantidad, importe)  {
    	
    	if (cantidad !== "" && importe !== "") {
    		var iImporte  = Number(importe),
    			iCantidad = Number(cantidad),
    			iTotal    = 0;
    			
    			iTotal = iImporte * iCantidad;
    			iTotal = parseFloat(iTotal + "").toFixed(2);
        		return iTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    	}
    },
    
    onFormatterPriceTotal: function(value){
    	var entero  = value.split(".")[0];
		var decimal = value.split(".")[1].substring(0, 2);
		  
		return entero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + decimal;
    }
};