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
            if( !this.template )
                this.template = new ws.Template();
            if( !this.model )
                this.model = new ws.Model();
        },
        
        // Template object
        // ------------------------------------------------------------------------------------
        template: null,
        
        // Model object
        // ------------------------------------------------------------------------------------
        model: null,
        
        // App State
        // ------------------------------------------------------------------------------------
        state: 'initial',
        
        // Current Action
        // ------------------------------------------------------------------------------------
        currentAcion: 'default',
        
        action: function(name, params) {
            if( name !== this.currentAction ) {
                ws.animation.showActivityIndicator(ws.mainWindow, {top: ws.topBar.height, height: ws.platform.screenHeight()-ws.topBar.height});           
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
                    
                    case "riderDetail":
                        this.riderDetailAction(params);
                        break;
                }
            }
        },
        
        // Default action
        // ------------------------------------------------------------------------------------
        defaultAction: function() {
            
        },
        
        // Riders action
        // ------------------------------------------------------------------------------------
        ridersAction: function() {
            var context = this;
            var onDataReady = function(riders) {                
                var data = [];
                for (var i = 0; i < riders.ids.length; i++) {
                    var riderId = riders.ids[i];
                    var rider = riders.riders[riderId];
                    var imageNumber = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/riders/'+ rider.number +'.png');
                    var flag = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/riders/'+ rider.flagCountry +'.png');
                    data.push({
                        icon: {
                            image: imageNumber.exists()?imageNumber.read():''
                        },
                        number: {
                            text: !imageNumber.exists()?rider.number:""
                        },
                        flag: {
                            image: flag.exists()?flag.read():''
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
                            itemId: riderId,
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
                            default: context.template.get("main")
                        },
                        defaultItemTemplate: 'default',
                        sections: [
                            Ti.UI.createListSection({
                                items: data
                            })
                        ],
                        bubbleParent: false
                    })
                );
                context.actionEnd();
            }
            // Get riders data            
            this.model.getRiders(onDataReady);
        },
        
        // Rider detail action
        // ------------------------------------------------------------------------------------
        riderDetailAction: function(id) {    
            var rider = this.model.getRider(id);
            // Rider detail view
            var riderDetailView = Ti.UI.createView({
                top: 0,
                left: 0,//ws.platform.screenWidth(),
                zIndex: 3,
                width: ws.platform.screenWidth(),
                height: ws.platform.screenHeight() - ws.topBar.height,
                bubbleParent: false,
                backgroundColor: '#fff'
            });
            riderDetailView.add(
                Ti.UI.createLabel({
                    text: rider.name,
                    height: Ti.UI.SIZE,
                    left: 15,    
                    top: 4,      
                    font: {
                        fontSize: ws.fonts.fontStyles.riderName.fontSize,
                        fontFamily: ws.fonts.fontStyles.riderName.fontFamily
                    },
                    color: ws.fonts.fontStyles.riderName.fontColor
                    // verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
                })
            );
            ws.mainAppView.add( riderDetailView );
            this.actionEnd();
        },
        
        // Called when action finishes
        // ------------------------------------------------------------------------------------
        actionEnd: function() {
            ws.animation.hideActivityIndicator();
        }
        
    };
    
    return Controller;
    /* ------------------------------------------------------------------------------------- */ 
})();
