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
            // Rider item list
            "riderList": {
                properties: {
                    height: 100,
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
                        top: 7,
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
                        top: 2,
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
                        bottom: 30,
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
                            fontFamily: ws.fonts.fontStyles.riderName.fontFamily,
                            fontWeight: 'bold'
                        },
                        color: ws.fonts.fontStyles.riderName.fontColor,
                        top: 7,
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
                        top: 34,
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
                        top: 58,
                        left: 79,
                        width: Ti.UI.SIZE,
                        height: Ti.UI.SIZE
                    }
                }, {
                    type: 'Ti.UI.ImageView',
                    bindId: 'arrow',
                    properties: {
                        image: '/images/arrow.png',
                        top: 38,
                        right: 5,
                        width: 24,
                        height: 24
                    }
                }]
            },
            // Track item list
            "trackList": {
                properties: {
                    height: 150,
                    selectedBackgroundColor: '#bbb'
                },
                events: {
                    // Bind event callbacks for bubbled events
                    // Events caught here are fired by the subcomponent views of the ListItem
                    click: function(e) {
                        Ti.API.info("click item id: " +e.itemId);
                        //ws.controller.action('trackDetail', e.itemId);
                    }
                },
                childTemplates: [{
                    type: 'Ti.UI.ImageView',
                    bindId: 'trackImage',
                    properties: {
                        image: '',
                        top: 15,
                        left: 11,
                        width: 130,
                        zIndex: 1
                    }
                },
                {
                    type: 'Ti.UI.Label',
                    bindId: 'name',
                    properties: {
                        font: {
                            fontSize: ws.fonts.fontStyles.riderName.fontSize,
                            fontFamily: ws.fonts.fontStyles.riderName.fontFamily,
                            fontWeight: 'bold'
                        },
                        color: ws.fonts.fontStyles.riderName.fontColor,
                        top: 4,
                        left: 11,
                        width: Ti.UI.SIZE,
                        height: Ti.UI.SIZE
                    }
                },
                {
                    type: 'Ti.UI.View',
                    properties: {                        
                        top: 10,
                        left: 150,
                        width: Ti.UI.FILL,
                        height: Ti.UI.SIZE,
                        layout: 'vertical'
                    },
                    childTemplates: [
                    // Dates Label
                    // -----------------------------------
                    {
                        type: 'Ti.UI.View',
                        properties: {                        
                            top: 5,
                            left: 0,
                            width: Ti.UI.FILL,
                            height: Ti.UI.SIZE,
                            layout: 'horizontal'
                        },
                        childTemplates: [{
                            type: 'Ti.UI.Label',
                            properties: {
                                font: {
                                    fontSize: ws.fonts.fontStyles.details.fontSize,
                                    fontFamily: ws.fonts.fontStyles.details.fontFamily,
                                    fontWeight: 'bold'
                                },
                                color: ws.fonts.fontStyles.details.fontColor,
                                top: 0,
                                left: 0,
                                text: 'Fecha:',
                                width: Ti.UI.SIZE,
                                height: Ti.UI.SIZE
                            }
                        },
                        {
                            type: 'Ti.UI.Label',
                            bindId: 'textDate',
                            properties: {
                                font: {
                                    fontSize: ws.fonts.fontStyles.details.fontSize,
                                    fontFamily: ws.fonts.fontStyles.details.fontFamily
                                },
                                color: ws.fonts.fontStyles.details.fontColor,
                                top: 0,
                                left: 5,
                                width: Ti.UI.SIZE,
                                height: Ti.UI.SIZE
                            }
                        }]
                    },
                    // Length Label
                    // -----------------------------------
                    {
                        type: 'Ti.UI.View',
                        properties: {                        
                            top: 0,
                            left: 0,
                            width: Ti.UI.FILL,
                            height: Ti.UI.SIZE,
                            layout: 'horizontal'
                        },
                        childTemplates: [{
                            type: 'Ti.UI.Label',
                            properties: {
                                font: {
                                    fontSize: ws.fonts.fontStyles.details.fontSize,
                                    fontFamily: ws.fonts.fontStyles.details.fontFamily,
                                    fontWeight: 'bold'
                                },
                                color: ws.fonts.fontStyles.details.fontColor,
                                top: 0,
                                left: 0,
                                text: 'Longitud:',
                                width: Ti.UI.SIZE,
                                height: Ti.UI.SIZE
                            }
                        },
                        {
                            type: 'Ti.UI.Label',
                            bindId: 'length',
                            properties: {
                                font: {
                                    fontSize: ws.fonts.fontStyles.details.fontSize,
                                    fontFamily: ws.fonts.fontStyles.details.fontFamily
                                },
                                color: ws.fonts.fontStyles.details.fontColor,
                                top: 0,
                                left: 5,
                                width: Ti.UI.SIZE,
                                height: Ti.UI.SIZE
                            }
                        }],
                    },
                    // Constructed Label
                    // -----------------------------------
                    {
                        type: 'Ti.UI.View',
                        properties: {                        
                            top: 0,
                            left: 0,
                            width: Ti.UI.FILL,
                            height: Ti.UI.SIZE,
                            layout: 'horizontal'
                        },
                        childTemplates: [{
                            type: 'Ti.UI.Label',
                            properties: {
                                font: {
                                    fontSize: ws.fonts.fontStyles.details.fontSize,
                                    fontFamily: ws.fonts.fontStyles.details.fontFamily,
                                    fontWeight: 'bold'
                                },
                                color: ws.fonts.fontStyles.details.fontColor,
                                top: 0,
                                left: 0,
                                text: 'Construido:',
                                width: Ti.UI.SIZE,
                                height: Ti.UI.SIZE
                            }
                        },
                        {
                            type: 'Ti.UI.Label',
                            bindId: 'constructed',
                            properties: {
                                font: {
                                    fontSize: ws.fonts.fontStyles.details.fontSize,
                                    fontFamily: ws.fonts.fontStyles.details.fontFamily
                                },
                                color: ws.fonts.fontStyles.details.fontColor,
                                top: 0,
                                left: 5,
                                width: Ti.UI.SIZE,
                                height: Ti.UI.SIZE
                            }
                        }],
                    }]
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