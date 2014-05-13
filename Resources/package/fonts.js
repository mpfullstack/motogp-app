// Package
// --------------------------------------------------------------------------------------------
/** 
 * @classDescription        Creates a Font object
 */
ws.Fonts = (function(){
    
    /* PRIVATE VARIABLES
    /* ------------------------------------------------------------------------------------- */ 
    
    /* ------------------------------------------------------------------------------------- */ 
    
    var Fonts = function(options){
        if( !options )
            options = {};
        this.initialize(options);
    };
        
    /* PUBLIC VARIABLES AND METHODS
    /* ------------------------------------------------------------------------------------- */
    Fonts.prototype = {
        // Initialize
        // ------------------------------------------------------------------------------------
        initialize: function(options) {
            this.fontFamily = options.fontFamily;
            this.fontColor  = options.fontColor;
            this.fontSize   = options.fontSize;  
        },
        
        // Main fonts object
        // ------------------------------------------------------------------------------------
        fonts: {},
        
        // Main fonts styles
        // ------------------------------------------------------------------------------------
        fontStyles: {},
        
        // Default font family
        // ------------------------------------------------------------------------------------
        fontFamily: null,
        
        // Default font color
        // ------------------------------------------------------------------------------------
        fontSize: null,
        
        // Default font size
        // ------------------------------------------------------------------------------------
        fontColor: null,
            
        // Add font
        // ------------------------------------------------------------------------------------
        add: function(font) {
            if( font.id in this.fonts ) {
                return null;
            } else {
                this.fonts[font.id] = {
                    "name": font.name,
                    "getFontStyle": function(fontStyleId) {
                        return this[fontStyleId];
                    }
                }; 
            }
        },
        
        // Remove font
        // ------------------------------------------------------------------------------------
        remove: function(fontId) {
            if( fontId in this.fonts )
                this.fonts[fontId] = null;
        },
        
        // Get font
        // ------------------------------------------------------------------------------------
        get: function(fontId) {
            if( fontId in this.fonts )
                return this.fonts[fontId];
        },
        
        // Add font style
        // ------------------------------------------------------------------------------------
        addFontStyle: function(fontStyle) {
            this.fontStyles[fontStyle.id] = {
                fontSize:   fontStyle.fontSize?fontStyle.fontSize:this.fontSize,
                fontFamily: this.fonts[fontStyle.fontId]?this.fonts[fontStyle.fontId].name:this.fontFamily,
                fontColor:  fontStyle.fontColor?fontStyle.fontColor:this.fontColor
            }
        },
        
        // Get font style
        // ------------------------------------------------------------------------------------
        getFontStyle: function(fontStyleId) {
            if( fontStyle.id in this.fontStyles )
                return this.fontStyles[fontStyleId];
            return null;
        }
    };
    
    return Fonts;
    /* ------------------------------------------------------------------------------------- */ 
})();

// Declare App fonts and styles
// -----------------------------------------
ws.fonts = new ws.Fonts({
    fontFamily: 'OpenSans-Light',
    fontColor: '#333',
    fontSize: 16
});
ws.fonts.add({
    id: 'oSansLight',
    name: 'OpenSans-Light'
});
ws.fonts.add({
    id: 'oSansRegular', 
    name: 'OpenSans-Regular'
});
ws.fonts.addFontStyle({
    id: 'title',
    fontSize: 20,
    fontColor: '#fff'
});
ws.fonts.addFontStyle({
    id: 'menu',    
    fontSize: 18,
    fontColor: '#eee'
});
ws.fonts.addFontStyle({
    id: 'riderName',    
    fontSize: 18,
    fontColor: '#000'
});
ws.fonts.addFontStyle({
    id: 'team',    
    fontSize: 14,
    fontColor: '#333'
});
ws.fonts.addFontStyle({
    id: 'town',    
    fontSize: 12,
    fontColor: '#999'
});
ws.fonts.addFontStyle({
    id: 'detailTitle',
    fontSize: 28,
    fontColor: '#000'
});
// -----------------------------------------