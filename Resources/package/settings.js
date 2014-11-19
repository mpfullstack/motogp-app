// Package
// --------------------------------------------------------------------------------------------
/** 
 * @classDescription        Class to set/get app property settings
 */
ws.Settings = (function(){
    
    /* PRIVATE VARIABLES
    /* ------------------------------------------------------------------------------------- */
      
    /* ------------------------------------------------------------------------------------- */ 
    
    var Settings = function(options){
        if( !options )
            options = {};
        this.initialize(options);
    };
        
    /* PUBLIC VARIABLES AND METHODS
    /* ------------------------------------------------------------------------------------- */
    Settings.prototype = {
        // App properties
        // ------------------------------------------------------------------------------------
        properties: {
            "analytics": {
                "name":         "analytics_data",
                "type":         "String",
                "defaultValue": "enabled"
            }
        },
        
        // Initialize
        // ------------------------------------------------------------------------------------
        initialize: function(options) {
            for( var property in this.properties ) {
                if( "defaultValue" in this.properties[property] ) {
                    if( !Ti.App.Properties.hasProperty(this.properties[property].name) ) {
                        this.set(this.properties[property], this.properties[property].defaultValue);
                    }
                }
            }
        },
        
        // Set App property
        // ------------------------------------------------------------------------------------
        set: function(property, value) {            
            switch(property.type) {
                case "String":
                    Ti.App.Properties.setString(property.name, String(value));
                    break;
                case "Integer":
                    Ti.App.Properties.setString(property.name, Number(value));
                    break;
                case "Boolean":
                    Ti.App.Properties.setBool(property.name, Boolean(value));
                    break;
            }
        },
        
        // Get App property
        // ------------------------------------------------------------------------------------
        get: function(property) {
            var value = null;            
            switch(property.type) {
                case "String":
                    value = Ti.App.Properties.getString(property.name);
                    break;
                case "Integer":
                    value = Ti.App.Properties.getInt(property.name);
                    break;
                case "Boolean":
                    value = Ti.App.Properties.getBool(property.name);
                    if( value !== true )
                        value = false;
                    break;
            }
            return value;
        }
    };
    
    return Settings;
    /* ------------------------------------------------------------------------------------- */ 
})();       
