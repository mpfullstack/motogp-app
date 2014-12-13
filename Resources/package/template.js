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
            // Classification item list
            "classificationList": {
                properties: {
                    height: 35,
                    selectedBackgroundColor: '#bbb',
                    layout: 'horizontal'
                },
                events: {
                    // Bind event callbacks for bubbled events
                    // Events caught here are fired by the subcomponent views of the ListItem
                    click: function(e) {
                        Ti.API.info("click item id: " +e.itemId);
                        // ws.controller.action('riderDetail', e.itemId);
                    }
                },
                childTemplates: [
                // Rider position
                // -----------------------------------
                {
                   type: 'Ti.UI.Label',
                    bindId: 'position',
                    properties: {
                        font: {
                            fontWeight: 'bold',
                            fontSize: ws.fonts.fontStyles.position.fontSize,
                            fontFamily: ws.fonts.fontStyles.position.fontFamily
                        },
                        color: ws.fonts.fontStyles.position.fontColor,                       
                        left: 0,
                        width: 24,
                        zIndex: 0,
                        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
                        verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
                        height: 35
                    } 
                },
                {
                    type: 'Ti.UI.View',
                    properties: {                        
                        left: 8,
                        width: '63%',
                        height: 35,
                        layout: 'horizontal'
                    },
                    childTemplates: [
                    // Rider name
                    // -----------------------------------
                    {
                        type: 'Ti.UI.Label',
                        bindId: 'name',
                        properties: {
                            font: {
                                fontSize: ws.fonts.fontStyles.classification.fontSize,
                                fontFamily: ws.fonts.fontStyles.classification.fontFamily,
                                fontWeight: 'bold'
                            },
                            color: ws.fonts.fontStyles.classification.fontColor,
                            left: 0,
                            width: Ti.UI.SIZE,
                            textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                            verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,                      
                            height: 35
                        }
                    },
                    // Rider Team
                    // -----------------------------------
                    {
                        type: 'Ti.UI.Label',
                        bindId: 'team',
                        properties: {
                            font: {
                                fontSize: 14,
                                fontFamily: ws.fonts.fontStyles.classification.fontFamily
                            },
                            color: ws.fonts.fontStyles.classification.fontColor,
                            left: 4,
                            width: Ti.UI.SIZE,
                            textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                            verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,                      
                            height: 35
                        }
                    }]
                },
                // Rider wins
                // -----------------------------------
                {
                    type: 'Ti.UI.Label',
                    bindId: 'wins',
                    properties: {
                        font: {
                            fontSize: ws.fonts.fontStyles.classification.fontSize,
                            fontFamily: ws.fonts.fontStyles.classification.fontFamily
                        },
                        color: ws.fonts.fontStyles.classification.fontColor,
                        left: 4,
                        width: 34,
                        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
                        verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,                      
                        height: 35
                    }
                },
                // Rider points
                // -----------------------------------
                {
                    type: 'Ti.UI.Label',
                    bindId: 'points',
                    properties: {
                        font: {
                            fontWeight: 'bold',
                            fontSize: ws.fonts.fontStyles.classification.fontSize,
                            fontFamily: ws.fonts.fontStyles.classification.fontFamily
                        },
                        color: ws.fonts.fontStyles.classification.fontColor,
                        left: 4,
                        width: 38,
                        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
                        verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,                      
                        height: 35
                    }
                }]
            },
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
                        image: '/images/arrow_light.png',
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
                    selectedBackgroundColor: '#999'
                },
                events: {
                    // Bind event callbacks for bubbled events
                    // Events caught here are fired by the subcomponent views of the ListItem
                    click: function(e) {
                        Ti.API.info("click item id: " +e.itemId);
                        ws.controller.action('trackDetail', e.itemId);
                    }
                },
                childTemplates: [
                {
                    type: 'Ti.UI.Label',
                    bindId: 'name',
                    properties: {
                        font: {
                            fontSize: ws.fonts.fontStyles.trackName.fontSize,
                            fontFamily: ws.fonts.fontStyles.trackName.fontFamily,
                            fontWeight: 'bold'
                        },
                        color: ws.fonts.fontStyles.trackName.fontColor,
                        top: 4,
                        left: 11,
                        width: Ti.UI.SIZE,
                        height: Ti.UI.SIZE
                    }
                },
                {
                    type: 'Ti.UI.ImageView',
                    bindId: 'trackImage',
                    properties: {
                        image: '',
                        top: 20,
                        left: 11,
                        width: 130,
                        zIndex: 1
                    }
                },
                {
                    type: 'Ti.UI.View',
                    properties: {                        
                        top: 45,
                        left: 150,
                        width: Ti.UI.FILL,
                        height: Ti.UI.SIZE,
                        layout: 'vertical'
                    },
                    childTemplates: [
                    // Date
                    // -----------------------------------
                    {
                        type: 'Ti.UI.Label',
                        bindId: 'textDate',
                        properties: {
                            font: {
                                fontSize: ws.fonts.fontStyles.details.fontSize,
                                fontFamily: ws.fonts.fontStyles.details.fontFamily,
                                fontWeight: 'bold'
                            },
                            color: ws.fonts.fontStyles.details.fontColor,
                            top: 0,
                            left: 5,
                            width: Ti.UI.SIZE,
                            height: Ti.UI.SIZE
                        }
                    },
                    // Time
                    // -----------------------------------                
                    {
                        type: 'Ti.UI.Label',
                        bindId: 'time',
                        properties: {
                            font: {
                                fontSize: ws.fonts.fontStyles.details.fontSize,
                                fontFamily: ws.fonts.fontStyles.details.fontFamily
                            },
                            color: ws.fonts.fontStyles.details.fontColor,
                            top: 8,
                            left: 5,
                            width: Ti.UI.SIZE,
                            height: Ti.UI.SIZE
                        }
                    },
                    // TV
                    // -----------------------------------    
                                
                    {
                        type: 'Ti.UI.View',
                        properties: {                        
                            top: 8,
                            left: 5,
                            width: Ti.UI.FILL,
                            height: Ti.UI.SIZE,
                            layout: 'horizontal'
                        },
                        childTemplates: [                 
                        {
                            type: 'Ti.UI.ImageView',
                            bindId: 'tv_icon',
                            properties: {
                                top: 0,
                                left: 0,
                                width: ws.platform.toDip(20)
                            }
                        },
                        {
                            type: 'Ti.UI.Label',
                            bindId: 'tv',
                            properties: {
                                font: {
                                    fontSize: ws.fonts.fontStyles.details.fontSize,
                                    fontFamily: ws.fonts.fontStyles.details.fontFamily
                                },
                                color: ws.fonts.fontStyles.details.fontColor,
                                top: 0,
                                left: 5,
                                verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
                                width: Ti.UI.SIZE,
                                height: Ti.UI.SIZE
                            }
                        }]
                    }/*,
                    // Length Label
                    // -----------------------------------                
                    {
                        type: 'Ti.UI.Label',
                        bindId: 'length',
                        properties: {
                            font: {
                                fontSize: ws.fonts.fontStyles.details.fontSize,
                                fontFamily: ws.fonts.fontStyles.details.fontFamily
                            },
                            color: ws.fonts.fontStyles.details.fontColor,
                            top: 5,
                            left: 5,
                            width: Ti.UI.SIZE,
                            height: Ti.UI.SIZE
                        }
                    },
                    // Constructed Label
                    // -----------------------------------
                    {
                        type: 'Ti.UI.Label',
                        bindId: 'constructed',
                        properties: {
                            font: {
                                fontSize: ws.fonts.fontStyles.details.fontSize,
                                fontFamily: ws.fonts.fontStyles.details.fontFamily
                            },
                            color: ws.fonts.fontStyles.details.fontColor,
                            top: 5,
                            left: 5,
                            width: Ti.UI.SIZE,
                            height: Ti.UI.SIZE
                        }
                    }*/
                    ]
                },
                {
                    type: 'Ti.UI.ImageView',
                    bindId: 'arrow',
                    properties: {
                        image: '/images/arrow.png',
                        top: 63,
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