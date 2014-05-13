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
        
        // Empty main view
        // ------------------------------------------------------------------------------------
        emptyMainAppView: function() {
            // Remove views and free memory
            while( ws.mainAppView.getChildren().length > 0 ) {
                var child = ws.mainAppView.children[ws.mainAppView.getChildren().length-1];
                Ti.API.info("Remove view " + child + " from main App View");
                ws.mainAppView.remove(child);
                child = null;
            }
        },
        
        // Current Action
        // ------------------------------------------------------------------------------------
        currentAcion: 'default',
        
        action: function(name, params) {
            if( name !== this.currentAction ) {
                ws.animation.showActivityIndicator(ws.mainWindow, {top: ws.topBar.height, height: ws.platform.screenHeight()-ws.topBar.height});
                this.emptyMainAppView();
                this.currentAction = name;
                switch(name) {
                    case "default":
                        this.defaultAction();
                        break;                    
                    
                    case "tracks":
                        this.tracksAction();
                        break;
                        
                    case "classification":
                        this.classificationAction();
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
            this.actionEnd();
        },
        
        // Tracks action
        // ------------------------------------------------------------------------------------
        tracksAction: function() {
            this.actionEnd();
        },
        
        // Classification action
        // ------------------------------------------------------------------------------------
        classificationAction: function() {
            this.actionEnd();
        },
        
        // Riders action
        // ------------------------------------------------------------------------------------
        ridersAction: function() {
            var context = this;
            var onDataReady = function(riders) {                
                var data = [];
                var time = new Date().getTime();
                for (var i = 0; i < riders.ids.length; i++) {
                    var riderId = riders.ids[i];
                    var rider = riders.riders[riderId];
                    var imageNumberFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/riders/'+ rider.number +'.png');
                    // Ti.API.info(Ti.Filesystem.resourcesDirectory + 'images/riders/'+ rider.flagCountry +'.png');
                    var imageNumber = null;
                    if( imageNumberFile.exists() )
                        imageNumber = '/images/riders/'+ rider.number +'.png';//imageNumberFile.read();
                    else
                        imageNumber = null;
                    // var flag = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/riders/'+ rider.flagCountry +'.png');
                    data.push({
                        iconNumber: {
                            image: imageNumber?imageNumber:''
                        },
                        number: {
                            text: !imageNumber?rider.number:''
                        },
                        flag: {
                            image: '/images/riders/'+ rider.flagCountry +'.png'
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
                            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE,
                            backgroundColor: ((i%2==0)?'#fff':'#eee')
                        }
                    });
                }
                var time2 = new Date().getTime();
                Ti.API.info("Time loading items: " + ws.utils.toSec(time2-time));
                
                // ListView            
                ws.mainAppView.add(
                    Ti.UI.createListView({
                        top: 0,
                        left: 0,//16,
                        zIndex: 2,
                        separatorColor: '#eee',
                        width: ws.platform.screenWidth(),// - 16,
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
            var imageNumber = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/riders/'+ rider.number +'.png');
            var flag = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/riders/'+ rider.flagCountry +'.png');
            if( imageNumber.exists() )
                riderDetailView.add(
                    Ti.UI.createImageView({
                        image: imageNumber.read(),
                        top: 7,
                        left: 5,
                        width: 75
                    })
                );
            else
                riderDetailView.add(
                    Ti.UI.createLabel({
                        text: rider.number,
                        font: {
                            fontWeight: 'bold',
                            fontSize: 55,
                            fontFamily: ws.fonts.fontStyles.menu.fontFamily
                        },
                        color: '#333333',
                        top: 0,
                        left: 5,
                        width: 75,
                        zIndex: 0,
                        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
                        height: Ti.UI.SIZE
                    })
                );
            riderDetailView.add(
                Ti.UI.createLabel({
                    text: rider.name,
                    height: Ti.UI.SIZE,
                    left: 90,    
                    top: 7,      
                    font: {
                        fontWeight: 'bold',
                        fontSize: ws.fonts.fontStyles.detailTitle.fontSize,
                        fontFamily: ws.fonts.fontStyles.detailTitle.fontFamily
                    },
                    color: ws.fonts.fontStyles.detailTitle.fontColor
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
