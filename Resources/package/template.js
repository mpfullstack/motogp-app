// Package
// --------------------------------------------------------------------------------------------
/** 
 * @classDescription        Creates a Template object
 */
ws.Template = (function(){
    
    var Template = function(options){
        if( !options )
            options = {};
        this.initialize(options);
    };
        
    /* PUBLIC VARIABLES AND METHODS
    /* ------------------------------------------------------------------------------------- */
    Template.prototype = {
        // Initialize
        // ------------------------------------------------------------------------------------
        initialize: function(options) {
              
        },
        
        // Templates
        // ------------------------------------------------------------------------------------
        templates: {
            "main": {
                properties: {
                    height: 80
                },
                events: {
                    // Bind event callbacks for bubbled events
                    // Events caught here are fired by the subcomponent views of the ListItem
                    click: function(e) {
                        Ti.API.info("click item id: " +e.itemId);
                    }
                },
                childTemplates: [{
                    // type: 'Ti.UI.ImageView',
                    // bindId: 'icon',
                    // properties: {
                        // image: '/images/icon.png',
                        // top: 0,
                        // left: 0,
                        // width: 50,
                        // height: 50,
                        // bubbleParent: false
                    // }
                    // ,
                    // events: {
                        // click: function (e) {
                            // alert('You clicked icon.');
                            // Ti.API.debug(e);
                        // }
                    // }
                }, {
                   type: 'Ti.UI.Label',
                    bindId: 'number',
                    properties: {
                        font: {
                            fontWeight: 'bold',
                            fontSize: 34,
                            fontFamily: ws.fonts.fontStyles.menu.fontFamily
                        },
                        color: '#333333',
                        top: 7,
                        left: 0,
                        width: 47,
                        height: Ti.UI.SIZE,
                        bubbleParent: false
                    } 
                }, {
                    type: 'Ti.UI.Label',
                    bindId: 'name',
                    properties: {
                        font: {
                            fontSize: ws.fonts.fontStyles.riderName.fontSize,
                            fontFamily: ws.fonts.fontStyles.riderName.fontFamily
                        },
                        color: ws.fonts.fontStyles.riderName.fontColor,
                        top: 4,
                        left: 50,
                        width: Ti.UI.SIZE,
                        height: Ti.UI.SIZE,
                        bubbleParent: false
                    }
                    // ,
                    // events: {
                        // click: function (e) {
                            // alert('You clicked name.');
                            // Ti.API.debug(e);
                        // }
                    // }
                }, {
                    type: 'Ti.UI.Label',
                    bindId: 'team',
                    properties: {
                        font: {
                            fontSize: ws.fonts.fontStyles.team.fontSize,
                            fontFamily: ws.fonts.fontStyles.team.fontFamily
                        },
                        color: ws.fonts.fontStyles.team.fontColor,
                        top: 28,
                        left: 50,
                        width: Ti.UI.SIZE,
                        height: Ti.UI.SIZE,
                        bubbleParent: false
                    }
                    // ,
                    // events: {
                        // click: function (e) {
                            // alert('You clicked epoch.');
                            // Ti.API.debug(e);
                        // }
                    // }
                }, {
                    type: 'Ti.UI.Label',
                    bindId: 'town',
                    properties: {
                        font: {
                            fontSize: ws.fonts.fontStyles.town.fontSize,
                            fontFamily: ws.fonts.fontStyles.team.fontFamily
                        },
                        color: ws.fonts.fontStyles.town.fontColor,
                        top: 48,
                        left: 50,
                        width: Ti.UI.SIZE,
                        height: Ti.UI.SIZE,
                        bubbleParent: false
                    }
                    // ,
                    // events: {
                        // click: function (e) {
                            // alert('You clicked epoch.');
                            // Ti.API.debug(e);
                        // }
                    // }
                }, {
                    type: 'Ti.UI.ImageView',
                    bindId: 'arrow',
                    properties: {
                        image: '/images/arrow.png',
                        top: 28,
                        right: 5,
                        width: 24,
                        height: 24,
                        bubbleParent: false
                    }
                    // ,
                    // events: {
                        // click: function (e) {
                            // alert('You clicked icon.');
                            // Ti.API.debug(e);
                        // }
                    // }
                }]
            }    
        },
        
        // Get Template
        // ------------------------------------------------------------------------------------
        get: function(name) {
            return this.templates[name];
        }
        
    };
    
    return Template;
    /* ------------------------------------------------------------------------------------- */ 
})();