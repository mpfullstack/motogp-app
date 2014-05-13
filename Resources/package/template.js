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
                    height: 80,
                    selectedBackgroundColor: '#bbb'
                },
                events: {
                    // Bind event callbacks for bubbled events
                    // Events caught here are fired by the subcomponent views of the ListItem
                    click: function(e) {
                        Ti.API.info("click item id: " +e.itemId);
                        ws.controller.action('riderDetail', e.itemId);
                    }
                },
                childTemplates: [{
                    type: 'Ti.UI.ImageView',
                    bindId: 'iconNumber',
                    properties: {
                        image: '',
                        top: 5,
                        left: 6,
                        width: 60,
                        zIndex: 1
                    }
                }, 
                {
                   type: 'Ti.UI.Label',
                    bindId: 'number',
                    properties: {
                        font: {
                            fontWeight: 'bold',
                            fontSize: 40,
                            fontFamily: ws.fonts.fontStyles.menu.fontFamily
                        },
                        color: '#333333',
                        top: 0,
                        left: 6,
                        width: 60,
                        zIndex: 0,
                        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
                        height: Ti.UI.SIZE
                    } 
                },
                {
                    type: 'Ti.UI.ImageView',
                    bindId: 'flag',
                    properties: {
                        image: '',
                        bottom: 12,
                        left: 42,
                        width: 24,
                        zIndex: 3
                    }
                },
                {
                    type: 'Ti.UI.Label',
                    bindId: 'name',
                    properties: {
                        font: {
                            fontSize: ws.fonts.fontStyles.riderName.fontSize,
                            fontFamily: ws.fonts.fontStyles.riderName.fontFamily
                        },
                        color: ws.fonts.fontStyles.riderName.fontColor,
                        top: 4,
                        left: 79,
                        width: Ti.UI.SIZE,
                        height: Ti.UI.SIZE
                    }
                }, {
                    type: 'Ti.UI.Label',
                    bindId: 'team',
                    properties: {
                        font: {
                            fontSize: ws.fonts.fontStyles.team.fontSize,
                            fontFamily: ws.fonts.fontStyles.team.fontFamily
                        },
                        color: ws.fonts.fontStyles.team.fontColor,
                        top: 31,
                        left: 79,
                        width: Ti.UI.SIZE,
                        height: Ti.UI.SIZE
                    }
                }, {
                    type: 'Ti.UI.Label',
                    bindId: 'town',
                    properties: {
                        font: {
                            fontSize: ws.fonts.fontStyles.town.fontSize,
                            fontFamily: ws.fonts.fontStyles.team.fontFamily
                        },
                        color: ws.fonts.fontStyles.town.fontColor,
                        top: 55,
                        left: 79,
                        width: Ti.UI.SIZE,
                        height: Ti.UI.SIZE
                    }
                }, {
                    type: 'Ti.UI.ImageView',
                    bindId: 'arrow',
                    properties: {
                        image: '/images/arrow.png',
                        top: 28,
                        right: 5,
                        width: 24,
                        height: 24
                    }
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