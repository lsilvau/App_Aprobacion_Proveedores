jQuery.sap.declare("intordendecompras.intOrdenDeCompras.model.formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");

intordendecompras.intOrdenDeCompras.model.formatter = {
    
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
    
    numero: function(value){
    	return Number(value);
    },
    
    onSetConvertFormaterMoney : function(value){
    	var sValorNeto 	= value;
		var sPrecio		= sValorNeto.split(".");
			sPrecio		= sPrecio[0];
		var sDecimal;
		var sEntero;
		
	        sDecimal	= sPrecio.substr(-2); 
	        sEntero		= sPrecio.substr(0, (sPrecio.length-2));
	        //iCondition	= sPrecio.toString().indexOf(".");
      
    		sEntero 	= sEntero.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
    		sValorNeto	= sEntero + "." + sDecimal;
      
     //   if(iCondition === -1){
     // 		sValorNeto  = sEntero + ".00";
    	// }else{
	    //   	sDecimal 	= sDecimal + "0000";
	    //     sDecimal	= sDecimal.substring(0,2);
	    //     sEntero 	= sEntero.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
	    //     sValorNeto 	= sEntero + "." + sDecimal;
     //   }
        
    	return sValorNeto;
    },
    
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
    
    onRemoveCeroLeft: function(pValor){
    	return pValor.replace(/^0+/, "");
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
    }
};