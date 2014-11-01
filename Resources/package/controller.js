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
        
        // StackTrace App
        // ------------------------------------------------------------------------------------        
        stackTrace: ['default'],
        
        // Add action to stack trace
        // ------------------------------------------------------------------------------------        
        pushStackTrace: function(value) {
            if( this.stackTrace.length ) {
                var pos = this.stackTrace.lastIndexOf(value);
                if( pos !== -1 ) {
                    this.stackTrace = this.stackTrace.slice(0,pos+1);
                } else {
                    this.stackTrace.push(value);                    
                }
            } else {
                this.stackTrace.push(value);
            }
            Ti.API.info(JSON.stringify("Stack Trace: " + this.stackTrace));
        },
        
        // Pops last action from stack trace 
        // ------------------------------------------------------------------------------------        
        popStackTrace: function() {
            return this.stackTrace.pop();
        },
        
        // Current Action
        // ------------------------------------------------------------------------------------
        currentAcion: 'default',
        
        // Action Back
        // ------------------------------------------------------------------------------------
        actionBack: function(params) {
            var regex = /.+Detail/g;
            // If we are in a detail action
            if( regex.test(this.currentAction) ) {
                this.popStackTrace();
                this.action(this.popStackTrace());
            } 
            // If we are in a main action
            else {
                if (!ws.mainMenu.isVisible()) {
                    ws.mainMenu.opacityView.show();
                    ws.mainMenu.setVisible(true);
                    ws.animation.slideFrom({
                        view : ws.mainMenu.view,
                        left: ws.mainMenu.paddingLeft,
                        direction : 'left',
                        onComplete : function(e) {}
                    });
                    var opacity = ws.mainMenu.width / ((ws.mainMenu.width + ws.mainMenu.opacityOffset) * 0.01) / 100;
                    ws.mainMenu.opacityView.animate({
                        opacity : opacity,
                        duration : 300
                    });
                } else {
                    ws.animation.slideTo({
                        view : ws.mainMenu.view,
                        direction : 'left',
                        onComplete : function(e) {
                            ws.mainMenu.setVisible(false);
                        }
                    });
                    ws.mainMenu.opacityView.animate({
                        opacity : 0,
                        duration : 300                    
                    },
                    function(e) {
                        ws.mainMenu.opacityView.hide()
                    });
                }
            }
        },
        
        // Action controller
        // ------------------------------------------------------------------------------------
        action: function(name, params) {
            if( name !== this.currentAction ) {
                ws.animation.showActivityIndicator(ws.mainWindow, {top: ws.topBar.height, height: ws.platform.screenHeight()-ws.topBar.height});
                this.emptyMainAppView();
                this.currentAction = name;
                this.pushStackTrace(name);
                switch(name) {
                    case "default":
                        ws.topBar.mainButton.setText("MotoGP");
                        this.defaultAction();
                        break;
                        
                    case "tracks":
                        ws.topBar.mainButton.setText(ws.translations.translate('tracks').toUpperCase()); 
                        ws.topBar.mainButton.setTextProperty("font", {
                            fontSize : ws.fonts.fontStyles.title.fontSize,
                            fontFamily : ws.fonts.fontStyles.title.fontSize.fontFamily,
                            fontWeight: 'bold',
                            fontStyle: 'italic'                                                   
                        });
                        ws.topBar.mainButton.setImage("/images/menu.png");
                        ws.topBar.mainButton.setImageSize(42);                  
                        this.tracksAction();
                        break;
                        
                    case "classification":
                        ws.topBar.mainButton.setText(ws.translations.translate('classification').toUpperCase());
                        ws.topBar.mainButton.setTextProperty("font", {
                            fontSize : ws.fonts.fontStyles.title.fontSize,
                            fontFamily : ws.fonts.fontStyles.title.fontSize.fontFamily,
                            fontWeight: 'bold',
                            fontStyle: 'italic'                         
                        });
                        ws.topBar.mainButton.setImage("/images/menu.png");
                        ws.topBar.mainButton.setImageSize(42);
                        this.classificationAction();
                        break;
                        
                    case "riders":
                        ws.topBar.mainButton.setText(ws.translations.translate('riders').toUpperCase());
                        ws.topBar.mainButton.setTextProperty("font", {
                            fontSize : ws.fonts.fontStyles.title.fontSize,
                            fontFamily : ws.fonts.fontStyles.title.fontSize.fontFamily,
                            fontWeight: 'bold',
                            fontStyle: 'italic'                                                     
                        });
                        ws.topBar.mainButton.setImage("/images/menu.png");
                        ws.topBar.mainButton.setImageSize(42);                            
                        this.ridersAction();
                        break;
                    
                    case "riderDetail":
                        ws.topBar.mainButton.setTextProperty("font", {
                            fontSize: ws.fonts.fontStyles.subMenu.fontSize                            
                        });
                        ws.topBar.mainButton.setText(ws.translations.translate('riders').toUpperCase());
                        ws.topBar.mainButton.setImage("/images/arrow_back.png");
                        ws.topBar.mainButton.setImageSize(21);
                        this.riderDetailAction(params);
                        break;
                    
                    case "trackDetail":
                        ws.topBar.mainButton.setTextProperty("font", {
                            fontSize: ws.fonts.fontStyles.subMenu.fontSize                            
                        });
                        ws.topBar.mainButton.setText(ws.translations.translate('tracks').toUpperCase());
                        ws.topBar.mainButton.setImage("/images/arrow_back.png");
                        ws.topBar.mainButton.setImageSize(21);
                        this.trackDetailAction(params);
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
            var context = this;
            var onDataReady = function(tracks) {                
                var data = [];
                var time = new Date().getTime();
                for (var i = 0; i < tracks.ids.length; i++) {
                    var trackId = tracks.ids[i];
                    var track = tracks.tracks[trackId];
                    var done = false;
                    if( track.date && new Date() > new Date(track.date) )
                        done = true;
                    data.push({
                        name: {
                            text: track.name.toUpperCase()
                        },
                        trackImage: {
                            image: track.smallImage
                        },
                        textDate: {
                            text: track.textDate
                        },
                        length: {
                            text: track.length + " m"
                        },
                        constructed: {
                            text: ws.translations.translate('constructed') + " " + track.constructed
                        },                        
                        properties: {
                            itemId: trackId,
                            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE,
                            backgroundColor: (done?'#666':'#333')//((i%2==0)?'#fff':'#eee'))
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
                        separatorColor: '#999',
                        width: ws.platform.screenWidth(),// - 16,
                        height: ws.platform.screenHeight() - ws.topBar.height,
                        templates: {
                            default: context.template.get("trackList")
                        },
                        defaultItemTemplate: 'default',
                        sections: [
                            Ti.UI.createListSection({
                                items: data
                            })
                        ],
                        opacity: 0,
                        bubbleParent: false
                    })
                );
                context.actionEnd();                
            }
            // Get riders data            
            this.model.getTracks(onDataReady);
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
                    data.push({
                        iconNumber: {
                            image: rider.image?rider.image:''
                        },
                        number: {
                            text: !rider.image?rider.number:''
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
                        separatorColor: '#ccc',
                        width: ws.platform.screenWidth(),// - 16,
                        height: ws.platform.screenHeight() - ws.topBar.height,
                        templates: {
                            default: context.template.get("riderList")
                        },
                        defaultItemTemplate: 'default',
                        sections: [
                            Ti.UI.createListSection({
                                items: data
                            })
                        ],
                        bubbleParent: false,
                        opacity: 0
                    })
                );
                /*ws.mainAppView.getChildren()[0].setMarker({
                    sectionIndex: 0,
                    itemIndex: riders.ids.length-1
                });
                ws.mainAppView.getChildren()[0].addEventListener("marker", function(e) {
                    Ti.API.info("marker event fired!!");
                });*/
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
            var riderDetailView = Ti.UI.createScrollView({
                top: 0,
                left: 0,//ws.platform.screenWidth(),
                zIndex: 3,
                width: ws.platform.screenWidth(),
                contentWidth: ws.platform.screenWidth(),
                // height: ws.platform.screenHeight() - ws.topBar.height,
                bubbleParent: false,
                backgroundColor: '#fff',
                opacity: 0
            });
            var imageNumber = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/riders/'+ rider.number +'.png');
            var flag = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/riders/'+ rider.flagCountry +'.png');
            if( imageNumber.exists() )
                riderDetailView.add(
                    Ti.UI.createImageView({
                        image: imageNumber.read(),
                        top: 7,
                        left: 2,
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
                        left: 2,
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
                        fontSize: ws.fonts.fontStyles.detailRiderTitle.fontSize,
                        fontFamily: ws.fonts.fontStyles.detailRiderTitle.fontFamily
                    },
                    color: ws.fonts.fontStyles.detailRiderTitle.fontColor
                    // verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
                })
            );
            ws.mainAppView.add( riderDetailView );
            this.actionEnd();            
        },
        
        // Track detail action
        // ------------------------------------------------------------------------------------
        trackDetailAction: function(id) {    
            var track = this.model.getTrack(id);
            // Track detail view
            var mainTrackDetailView = Ti.UI.createView({
                top: 0,
                left: 0,
                zIndex: 3,
                width: ws.platform.screenWidth(),                                
                height: Ti.UI.SIZE,
                bubbleParent: false,
                backgroundColor: '#fff',
                backgroundImage: '/images/bg-aragon.png',
                opacity: 0
            });
            mainTrackDetailView.add(
                Ti.UI.createView({
                    top: 0,
                    left: 0,
                    width: ws.platform.screenWidth(),                                
                    height: Ti.UI.SIZE,
                    backgroundColor: '#000',
                    layout: 'vertical',
                    opacity: 0.75,
                    zIndex: 4
                })
            );
            mainTrackDetailView.children[0].add(
                Ti.UI.createLabel({
                    text: track.name.toUpperCase(),
                    height: Ti.UI.SIZE,
                    left: '2%',    
                    top: 4,      
                    font: {
                        fontWeight: 'bold',
                        fontSize: ws.fonts.fontStyles.detailTitle.fontSize,
                        fontFamily: ws.fonts.fontStyles.detailTitle.fontFamily
                    },
                    opacity: 1,
                    color: ws.fonts.fontStyles.detailTitle.fontColor
                    // verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
                })
            );
            mainTrackDetailView.children[0].add(
                Ti.UI.createLabel({
                    text: track.textDate,
                    height: Ti.UI.SIZE,
                    left: '2%',    
                    top: 1,      
                    font: {
                        fontSize: ws.fonts.fontStyles.detailTrackDate.fontSize,
                        fontFamily: ws.fonts.fontStyles.detailTrackDate.fontFamily
                    },
                    opacity: 1,
                    color: ws.fonts.fontStyles.detailTrackDate.fontColor
                })
            );          
            mainTrackDetailView.children[0].add(
                Ti.UI.createView({
                    top: 0,
                    left: 0,
                    width: ws.platform.screenWidth(),
                    height: 4
                })
            );
            mainTrackDetailView.add(
                Ti.UI.createScrollView({
                    top: 0,
                    left: 0,
                    zIndex: 3,
                    width: ws.platform.screenWidth(),
                    contentWidth: ws.platform.screenWidth(),                
                    // height: ws.platform.screenHeight() - ws.topBar.height,
                    bubbleParent: false,
                    backgroundColor: 'transparent',
                    // backgroundImage: '/images/bg-aragon.png',
                    layout: 'vertical'
                    // opacity: 0
                })
            );  
            mainTrackDetailView.children[1].add(
                Ti.UI.createImageView({
                    image: track.image,
                    top: 70,
                    left: '5%',
                    width: '90%'
                })
            );
            var menuView = Ti.UI.createView({
                width: ws.platform.screenWidth(),
                left: 0,
                top: 0,
                backgroundColor: '#eee',
                height: 39,
                layout: 'horizontal'
            });
            menuView.add(
                Ti.UI.createLabel({
                    html: ws.translations.translate('description').toUpperCase(),
                    height: Ti.UI.FILL,
                    left: 0,
                    width: '50%', 
                    verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER, 
                    top: 0,
                    font: {
                        fontWeight: 'bold',
                        fontSize: ws.fonts.fontStyles.detailTrackMenuView.fontSize,
                        fontFamily: ws.fonts.fontStyles.regular.fontFamily
                    },
                    color: '#fff',
                    backgroundColor: '#b00d35',
                    id: 'description'
                })
            );
            menuView.add(
                Ti.UI.createLabel({
                    html: ws.translations.translate('timeTable').toUpperCase(),
                    height: Ti.UI.FILL,
                    left: 0,
                    width: '50%',
                    verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER, 
                    top: 0,
                    font: {
                        fontWeight: 'bold',
                        fontSize: ws.fonts.fontStyles.detailTrackMenuView.fontSize,
                        fontFamily: ws.fonts.fontStyles.regular.fontFamily
                    },                    
                    color: '#b00d35',
                    id: 'timeTable'
                })
            );
            // menuView singletap event            
            menuView.addEventListener("singletap", function(e) {
                if( e.source.id == 'description' ) {
                    Ti.API.info("singletap on description");
                    e.source.setColor('#fff');
                    e.source.setBackgroundColor('#b00d35');
                    menuView.children[1].setColor('#b00d35');
                    menuView.children[1].setBackgroundColor('#eee');
                    contentView.children[3].hide();
                    contentView.children[2].show();
                } else if( e.source.id == 'timeTable' ) {
                    Ti.API.info("singletap on timeTable");
                    e.source.setColor('#fff');
                    e.source.setBackgroundColor('#b00d35');
                    menuView.children[0].setColor('#b00d35');
                    menuView.children[0].setBackgroundColor('#eee');
                    contentView.children[2].hide();
                    contentView.children[3].show();
                }
            });            
            var contentView = Ti.UI.createView({
                height: Ti.UI.SIZE,
                left: 0,
                width: ws.platform.screenWidth(),
                top: 10,
                zIndex: 1,
                backgroundColor: '#fff'
            });
            contentView.add( menuView );
            contentView.add(
                Ti.UI.createView({
                    width: ws.platform.screenWidth(),
                    left: 0,
                    top: 39,
                    backgroundColor: '#b00d35',
                    height: 1
                })
            );
            // contentView.add(
                // Ti.UI.createLabel({
                    // html: ws.translations.translate('date') + ": " + track.textDate,
                    // height: Ti.UI.SIZE,
                    // left: 4,
                    // width: Ti.UI.SIZE,    
                    // top: 2,
                    // font: {
                        // fontSize: ws.fonts.fontStyles.regular.fontSize,
                        // fontFamily: ws.fonts.fontStyles.regular.fontFamily
                    // },
                    // color: '#fff'
                // })
            // );            
            // contentView.add(
                // Ti.UI.createLabel({
                    // html: ws.translations.translate('length') + ": " + track.length,
                    // height: Ti.UI.SIZE,
                    // left: 4,
                    // width: Ti.UI.SIZE,    
                    // top: 27,
                    // font: {
                        // fontSize: ws.fonts.fontStyles.regular.fontSize,
                        // fontFamily: ws.fonts.fontStyles.regular.fontFamily
                    // },
                    // color: '#fff'
                // })
            // );
            // contentView.add(
                // Ti.UI.createLabel({
                    // html: ws.translations.translate('constructed') + ": " + track.constructed,
                    // height: Ti.UI.SIZE,
                    // left: 4,
                    // width: Ti.UI.SIZE,    
                    // top: 52,
                    // font: {
                        // fontSize: ws.fonts.fontStyles.regular.fontSize,
                        // fontFamily: ws.fonts.fontStyles.regular.fontFamily
                    // },
                    // color: '#fff'
                // })
            // );
            // contentView.add(
                // Ti.UI.createLabel({
                    // text: track.tv_col1,
                    // height: Ti.UI.SIZE,
                    // left: '55%',
                    // width: Ti.UI.SIZE,    
                    // top: 2,
                    // font: {
                        // fontSize: 12,
                        // fontFamily: ws.fonts.fontStyles.regular.fontFamily
                    // },
                    // color: '#fff'
                // })
            // );
            // contentView.add(
                // Ti.UI.createLabel({
                    // text: track.tv_col2,
                    // height: Ti.UI.SIZE,
                    // right: 4,
                    // width: Ti.UI.SIZE,    
                    // top: 2,
                    // font: {
                        // fontSize: 12,
                        // fontFamily: ws.fonts.fontStyles.regular.fontFamily
                    // },
                    // color: '#fff'
                // })
            // );
            contentView.add(
                Ti.UI.createLabel({
                    html: track.description,
                    height: Ti.UI.SIZE,
                    left: '3%',
                    width: '94%',    
                    top: 50,
                    font: {
                        fontSize: ws.fonts.fontStyles.regular.fontSize,
                        fontFamily: ws.fonts.fontStyles.regular.fontFamily
                    },
                    color: '#333'
                })
            );
            // Render Track Schedule
            var timeTableView = Ti.UI.createView({
                height: Ti.UI.SIZE,
                left: '3%',
                width: '94%',
                top: 50,
                visible: false,
                layout: 'vertical'
            });
            contentView.add(timeTableView);            
            for( var d in track.timetable ) {                
                timeTableView.add(
                    Ti.UI.createLabel({
                        text: d,
                        height: Ti.UI.SIZE,
                        left: 0,
                        width: '100%',    
                        top: 0,
                        font: {
                            fontSize: ws.fonts.fontStyles.regular.fontSize,
                            fontFamily: ws.fonts.fontStyles.regular.fontFamily
                        },
                        color: '#b00d35'
                    })
                );
                var rows = track.timetable[d];
                for( var i=0; i<rows.length; i++ ) {
                    var row = rows[i];
                    timeTableView.add(
                        Ti.UI.createView({
                            height: Ti.UI.SIZE,
                            left: 0,
                            width: '100%',
                            top: 0
                        })
                    );
                    timeTableView.children[timeTableView.children.length-1].add(
                        Ti.UI.createLabel({
                            text: row.session,
                            height: Ti.UI.SIZE,
                            left: 0,
                            width: Ti.UI.SIZE,    
                            top: 0,
                            font: {
                                fontSize: ws.fonts.fontStyles.regular.fontSize,
                                fontFamily: ws.fonts.fontStyles.regular.fontFamily
                            },                            
                            color: '#666'
                        })
                    );
                    timeTableView.children[timeTableView.children.length-1].add(
                        Ti.UI.createLabel({
                            text: row.time,
                            height: Ti.UI.SIZE,
                            right: 0,
                            width: Ti.UI.SIZE,    
                            top: 0,
                            font: {
                                fontSize: ws.fonts.fontStyles.regular.fontSize,
                                fontFamily: ws.fonts.fontStyles.regular.fontFamily
                            },                            
                            color: '#666'
                        })
                    );
                }
            }
            mainTrackDetailView.children[1].add( contentView );                   
            ws.mainAppView.add( mainTrackDetailView );
            this.actionEnd();
        },
        
        // Called when action finishes
        // ------------------------------------------------------------------------------------
        actionEnd: function() {
            ws.animation.hideActivityIndicator();
            ws.mainAppView.getChildren()[0].animate({
                opacity: 1,
                duration: 350
            })
        }
        
    };
    
    return Controller;
    /* ------------------------------------------------------------------------------------- */ 
})();
