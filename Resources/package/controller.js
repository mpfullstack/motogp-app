// Package
// --------------------------------------------------------------------------------------------
/** 
 * @classDescription        Creates a Controller object
 */
ws.Controller = (function(){
    
    var Controller = function(options){
        if( !options )
            options = {};
        this.initialize(options);
    };
        
    /* PUBLIC VARIABLES AND METHODS
    /* ------------------------------------------------------------------------------------- */
    Controller.prototype = {
        // Initialize
        // ------------------------------------------------------------------------------------
        initialize: function(options) {
            if( !ws.template )
                this.template = new ws.Template();
        },
        
        // Template object
        // ------------------------------------------------------------------------------------
        template: null,
        
        // App State
        // ------------------------------------------------------------------------------------
        state: 'initial',
        
        // Current Action
        // ------------------------------------------------------------------------------------
        currentAcion: 'default',
        
        action: function(name) {
            if( name !== this.currentAction ) {            
                this.currentAction = name;            
                switch(name) {
                    case "default":
                        this.defaultAction();
                        break;                    
                    
                    case "tracks":
                    
                        break;
                        
                    case "classification":
                    
                        break;
                        
                    case "riders":            
                        this.ridersAction();
                        break;
                }
            }
        },
        
        // Riders action
        // ------------------------------------------------------------------------------------
        ridersAction: function() {
            
            var jsonRidersFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'data/riders.json');
            var riders = JSON.parse(jsonRidersFile.read().text);
            var data = [];
            for (var i = 0; i < riders.length; i++) {
                var rider = riders[i];
                data.push({
                    number: {
                        text: rider.number
                    },
                    name: {
                        text: rider.name
                    },
                    team: {
                        text: rider.team
                    },
                    town: {
                        text: rider.town
                    },
                    properties: {
                        itemId: 'rider_' + rider.id,
                        accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
                    }
                });
            }
            
            // ListView            
            ws.mainAppView.add(
                Ti.UI.createListView({
                    top: 0,
                    left: 16,
                    zIndex: 2,
                    separatorColor: '#eee',
                    width: ws.platform.screenWidth() - 16,
                    height: ws.platform.screenHeight() - ws.topBar.height,
                    templates: {
                        default: this.template.get("main")
                    },
                    defaultItemTemplate: 'default',
                    sections: [
                        Ti.UI.createListSection({
                            items: data
                        })
                    ]
                })
            );
        }
        
    };
    
    return Controller;
    /* ------------------------------------------------------------------------------------- */ 
})();
