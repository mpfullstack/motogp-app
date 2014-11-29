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
            var context = this;
            context.startAction = options.startAction; 
            if( !context.template )
                context.template = new ws.Template();
            // if( !this.model )
            context.model = new ws.Model({
                onDataReady: function(){
                    context.action(context.startAction);
                }
            });
        },
        
        // Reset/Reload App
        // ------------------------------------------------------------------------------------
        reload: function(action) {
            this.state = 'initial';
            this.stackTrace = [];
            this.currentAction = '';            
            this.emptyMainAppView();
            ws.mainMenu.reload();
            this.action(action);          
        },
        
        // Start action name
        // ------------------------------------------------------------------------------------
        startAction: null,
        
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
        stackTrace: [],
        
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
        currentAction: '',
        
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
                if( this.currentAction != '' )
                    ws.animation.showActivityIndicator(ws.mainWindow, {top: ws.topBar.height, height: ws.platform.screenHeight()-ws.topBar.height});
                this.emptyMainAppView();
                this.currentAction = name;
                this.pushStackTrace(name);
                switch(name) {
                    case "default":
                        ws.topBar.mainButton.setText(ws.translations.translate('default').toUpperCase()); 
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
                    case "settings":
                        ws.topBar.mainButton.setText(ws.translations.translate('settings').toUpperCase());
                        ws.topBar.mainButton.setTextProperty("font", {
                            fontSize : ws.fonts.fontStyles.title.fontSize,
                            fontFamily : ws.fonts.fontStyles.title.fontSize.fontFamily,
                            fontWeight: 'bold',
                            fontStyle: 'italic'                                                     
                        });
                        ws.topBar.mainButton.setImage("/images/menu.png");
                        ws.topBar.mainButton.setImageSize(42); 
                        this.settingsAction(params);
                }
            }
        },
        
        // Default action
        // ------------------------------------------------------------------------------------
        defaultAction: function() {
            var context = this;
            var onDataReady = function(track) {
                var homeContainerView = Ti.UI.createView({
                    width: ws.platform.screenWidth(),
                    height: Ti.UI.FILL,
                    bubbleParent: false,
                    backgroundImage: '/images/bg-jerez.png',
                    id: 'home',
                    opacity: 0,
                    top: 0,
                    zIndex: 3
                });
                ws.mainAppView.add(homeContainerView);
                // Adding Header container
                homeContainerView.add(
                    Ti.UI.createView({
                        width: ws.platform.screenWidth(),
                        height: 67,
                        backgroundColor: '#fff',
                        top: 0,
                        opacity: 0.8
                    })
                );
                homeContainerView.add(
                    Ti.UI.createView({
                        width: ws.platform.screenWidth(),
                        height: 67,
                        backgroundColor: 'transparent',
                        layout: 'vertical',         
                        top: 0
                    })
                );
                // Adding Header title
                homeContainerView.children[1].add(
                    Ti.UI.createLabel({
                        text: track.name,
                        height: Ti.UI.SIZE,
                        left: 10,
                        top: 0,      
                        font: {
                            fontWeight: 'bold',
                            fontSize: ws.fonts.fontStyles.homeTrackTitle.fontSize,
                            fontFamily: ws.fonts.fontStyles.homeTrackTitle.fontFamily
                        },
                        color: ws.fonts.fontStyles.homeTrackTitle.fontColor
                    })
                );
                // Adding Header sub title (date and tv)
                homeContainerView.children[1].add(
                    Ti.UI.createLabel({
                        text: track.textDate[ws.translations.getLanguage()] + (track.tv[ws.translations.getLanguage()]?" - " + track.tv[ws.translations.getLanguage()]:""),
                        height: Ti.UI.SIZE,
                        left: 10,
                        top: 0,      
                        font: {
                            fontSize: 16,
                            fontWeight: 'bold',
                            fontFamily: ws.fonts.fontStyles.detailTrackDate.fontFamily
                        },
                        color: ws.fonts.fontStyles.homeTrackTitle.fontColor
                    })
                );
                
                // Adding content homeView
                var homeView = Ti.UI.createView({
                    width: ws.platform.screenWidth(),
                    height: Ti.UI.FILL,                                                
                    top: 73,
                    layout: 'vertical'
                })
                homeContainerView.add(homeView);
                // Addding countdown
                homeView.add(
                    Ti.UI.createLabel({
                        text: ws.translations.translate('coming_in'),
                        height: Ti.UI.SIZE,
                        width: ws.platform.screenWidth(),
                        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
                        top: 0,      
                        font: {
                            fontSize: 16,
                            fontFamily: ws.fonts.fontStyles.regular.fontFamily
                        },
                        shadowColor: '#000',
                        shadowOffset: {x:2, y:2},
                        shadowRadius: 3,
                        color: '#fff'
                    })
                );
                homeView.add(
                    Ti.UI.createLabel({
                        text: "",
                        height: Ti.UI.SIZE,
                        width: ws.platform.screenWidth(),
                        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
                        top: 2,      
                        font: {
                            fontSize: 30,
                            fontFamily: ws.fonts.fontStyles.regular.fontFamily
                        },
                        shadowColor: '#000',
                        shadowOffset: {x:2, y:2},
                        shadowRadius: 3,
                        color: '#fff'
                    })
                );
                // Get left seconds to start date time race
                now = new Date();
                // Ti.API.info("start Date " + track.startDate);
                var startDate = ws.utils.newDateAsUTC(new Date(Date.parse(track.startDate)));
                // Ti.API.info("now : " + now);
                // Ti.API.info("startDate : " + startDate);
                var leftSeconds = parseInt(Number(startDate.getTime() - now.getTime()) / 1000);
                var countdown = new ws.utils.CountDown({
                    seconds: leftSeconds, 
                    tick: function(context) {
                        if(
                            ws.mainAppView.children.length
                            &&
                            ws.mainAppView.children[0].id == 'home' 
                        ) {
                            homeView.children[1].setText(
                                context.time.d + "d " + context.time.h + "h " + context.time.m + "m " + context.time.s + "s"
                            );
                        } else {
                            countdown.stop();
                            countdown = null;
                        }
                    },
                    end: function() {
                        
                    }
                });                
                countdown.start();
                
                // Track image
                homeView.add(
                    Ti.UI.createImageView({
                        image: track.image,
                        top: -20,
                        left: '15%',
                        width: '70%'
                    })
                );
                
                // Add detail view container
                homeView.add(
                    Ti.UI.createView({
                        width: ws.platform.screenWidth(),
                        left: 0,
                        height: Ti.UI.FILL,
                        layout: 'vertical',
                        top: -15,
                        backgroundColor: '#333'
                    })
                );
                
                var labelWidth = '35%';
                
                // Fastest lap label
                homeView.children[homeView.children.length-1].add(
                    Ti.UI.createView({
                        // width: '80%',
                        left: 10,
                        height: Ti.UI.SIZE,
                        layout: 'horizontal',
                        top: 13
                        // backgroundColor: '#444'
                    })
                );                
                homeView.children[homeView.children.length-1].children[
                    homeView.children[homeView.children.length-1].children.length - 1
                ].add(
                    Ti.UI.createLabel({
                        text: ws.translations.translate('fastest_lap'),
                        width: labelWidth,//Ti.UI.SIZE,
                        left: 0,
                        top: 0,
                        font: {
                            fontWeight: 'bold',
                            fontSize: ws.fonts.fontStyles.homeDetails.fontSize,
                            fontFamily: ws.fonts.fontStyles.homeDetails.fontFamily
                        },
                        color: ws.fonts.fontStyles.homeDetails.fontColor
                    })
                );
                // Fastest lap value
                homeView.children[homeView.children.length-1].children[
                    homeView.children[homeView.children.length-1].children.length - 1
                ].add(
                    Ti.UI.createLabel({
                        text: track.fastest_lap,
                        width: Ti.UI.SIZE,
                        left: 0,
                        top: 0,      
                        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                        font: {                            
                            fontSize: ws.fonts.fontStyles.homeDetails.fontSize,
                            fontFamily: ws.fonts.fontStyles.homeDetails.fontFamily
                        },
                        color: ws.fonts.fontStyles.homeDetails.fontColor
                    })
                );
                
                // Length track label
                homeView.children[homeView.children.length-1].add(
                    Ti.UI.createView({
                        // width: '80%',
                        left: 10,
                        height: Ti.UI.SIZE,
                        layout: 'horizontal',
                        top: 2
                        // backgroundColor: '#444'
                    })
                );
                homeView.children[homeView.children.length-1].children[
                    homeView.children[homeView.children.length-1].children.length - 1
                ].add(
                    Ti.UI.createLabel({
                        text: ws.translations.translate('length'),
                        width: labelWidth,//Ti.UI.SIZE,
                        left: 0,
                        top: 0,
                        font: {
                            fontWeight: 'bold',
                            fontSize: ws.fonts.fontStyles.homeDetails.fontSize,
                            fontFamily: ws.fonts.fontStyles.homeDetails.fontFamily
                        },
                        color: ws.fonts.fontStyles.homeDetails.fontColor
                    })
                );
                // Length track value
                homeView.children[homeView.children.length-1].children[
                    homeView.children[homeView.children.length-1].children.length - 1
                ].add(
                    Ti.UI.createLabel({
                        text: track.length + " m",
                        width: Ti.UI.SIZE,
                        left: 0,
                        top: 0,      
                        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                        font: {
                            fontSize: ws.fonts.fontStyles.homeDetails.fontSize,
                            fontFamily: ws.fonts.fontStyles.homeDetails.fontFamily
                        },
                        color: ws.fonts.fontStyles.homeDetails.fontColor
                    })
                );
                
                // Laps track label
                homeView.children[homeView.children.length-1].add(
                    Ti.UI.createView({
                        // width: '80%',
                        left: 10,
                        height: Ti.UI.SIZE,
                        layout: 'horizontal',
                        top: 2
                        // backgroundColor: '#444'
                    })
                );
                homeView.children[homeView.children.length-1].children[
                    homeView.children[homeView.children.length-1].children.length - 1
                ].add(
                    Ti.UI.createLabel({
                        text: ws.translations.translate('laps'),
                        width: labelWidth,//Ti.UI.SIZE,
                        left: 0,
                        top: 0,
                        font: {
                            fontWeight: 'bold',
                            fontSize: ws.fonts.fontStyles.homeDetails.fontSize,
                            fontFamily: ws.fonts.fontStyles.homeDetails.fontFamily
                        },
                        color: ws.fonts.fontStyles.homeDetails.fontColor
                    })
                );
                // Laps track value
                homeView.children[homeView.children.length-1].children[
                    homeView.children[homeView.children.length-1].children.length - 1
                ].add(
                    Ti.UI.createLabel({
                        text: track.laps,
                        width: Ti.UI.SIZE,
                        left: 0,
                        top: 0,      
                        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                        font: {
                            fontSize: ws.fonts.fontStyles.homeDetails.fontSize,
                            fontFamily: ws.fonts.fontStyles.homeDetails.fontFamily
                        },
                        color: ws.fonts.fontStyles.homeDetails.fontColor
                    })
                );
                
                // Constructed label
                homeView.children[homeView.children.length-1].add(
                    Ti.UI.createView({
                        // width: '80%',
                        left: 10,
                        height: Ti.UI.SIZE,
                        layout: 'horizontal',
                        top: 2
                        // backgroundColor: '#444'
                    })
                );
                homeView.children[homeView.children.length-1].children[
                    homeView.children[homeView.children.length-1].children.length - 1
                ].add(
                    Ti.UI.createLabel({
                        text: ws.translations.translate('constructed'),
                        width: labelWidth,//Ti.UI.SIZE,
                        left: 0,
                        top: 0,
                        font: {
                            fontWeight: 'bold',
                            fontSize: ws.fonts.fontStyles.homeDetails.fontSize,
                            fontFamily: ws.fonts.fontStyles.homeDetails.fontFamily
                        },
                        color: ws.fonts.fontStyles.homeDetails.fontColor
                    })
                );
                // Constructed value
                homeView.children[homeView.children.length-1].children[
                    homeView.children[homeView.children.length-1].children.length - 1
                ].add(
                    Ti.UI.createLabel({
                        text: track.constructed,
                        width: Ti.UI.SIZE,
                        left: 0,
                        top: 0,      
                        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                        font: {
                            fontSize: ws.fonts.fontStyles.homeDetails.fontSize,
                            fontFamily: ws.fonts.fontStyles.homeDetails.fontFamily
                        },
                        color: ws.fonts.fontStyles.homeDetails.fontColor
                    })
                );
                                
                context.actionEnd();  
            }            
            // Get next Track            
            this.model.getNextTrack(onDataReady);
        },
        
        // Tracks action
        // ------------------------------------------------------------------------------------
        tracksAction: function() {
            var context = this;
            var onDataReady = function(tracks) {                
                var data = [];
                // var time = new Date().getTime();
                for (var i = 0; i < tracks.ids.length; i++) {
                    var trackId = tracks.ids[i];
                    var track = tracks.tracks[trackId];
                    var done = false;
                    if( track.startDate && new Date() > ws.utils.newDateAsUTC(new Date(Date.parse(track.startDate))) )
                        done = true;
                    data.push({
                        name: {
                            text: track.name.toUpperCase()
                        },
                        trackImage: {
                            image: track.smallImage
                        },
                        textDate: {
                            text: track.textDate[ws.translations.getLanguage()]
                        },
                        tv: {
                            text: track.tv[ws.translations.getLanguage()]
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
                // var time2 = new Date().getTime();
                // Ti.API.info("Time loading items: " + ws.utils.toSec(time2-time));
                
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
            var riderDetailView = Ti.UI.createView({
                top: 0,
                left: 0,
                zIndex: 3,
                width: ws.platform.screenWidth(),
                height: Ti.UI.SIZE,                                
                bubbleParent: false,
                backgroundColor: '#fff',
                opacity: 0 
            });
                        
            var headerHeight = (ws.platform.screenWidth() / 5) * 2;
            // Rider photo
            riderDetailView.add(
                Ti.UI.createImageView({
                    image: rider.photo,
                    top: 0,
                    left: 0,
                    width: headerHeight 
                })
            );
            // Rider details right                 
            riderDetailView.add(
                Ti.UI.createView({
                    top: 0,
                    left: '41%',
                    backgroundColor: '#fff',
                    width: '59%',
                    layout: 'vertical'
                })
            );
            riderDetailView.children[riderDetailView.children.length-1].add(
                Ti.UI.createLabel({
                    text: rider.name,
                    height: Ti.UI.SIZE,
                    left: 2,
                    top: 3,      
                    font: {
                        fontWeight: 'bold',
                        fontSize: ws.fonts.fontStyles.detailRiderTitle.fontSize,
                        fontFamily: ws.fonts.fontStyles.detailRiderTitle.fontFamily
                    },
                    color: ws.fonts.fontStyles.detailRiderTitle.fontColor
                })
            );
            riderDetailView.children[riderDetailView.children.length-1].add(
                Ti.UI.createLabel({
                    text: rider.team,
                    height: Ti.UI.SIZE,
                    left: 2,
                    top: 1,      
                    font: {
                        fontSize: ws.fonts.fontStyles.detailRiderTeam.fontSize,
                        fontFamily: ws.fonts.fontStyles.detailRiderTeam.fontFamily
                    },
                    color: ws.fonts.fontStyles.detailRiderTeam.fontColor
                })
            );
            riderDetailView.children[riderDetailView.children.length-1].add(
                Ti.UI.createLabel({
                    text: rider.town,
                    height: Ti.UI.SIZE,
                    left: 2,
                    top: 1,      
                    font: {
                        fontSize: ws.fonts.fontStyles.detailRiderTown.fontSize,
                        fontFamily: ws.fonts.fontStyles.detailRiderTown.fontFamily
                    },
                    color: ws.fonts.fontStyles.detailRiderTown.fontColor
                })
            );
            var flag = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/riders/'+ rider.flagCountry +'.png');
            riderDetailView.children[riderDetailView.children.length-1].add(
                Ti.UI.createImageView({
                    image: flag.read(),
                    top: 5,
                    left: 3,
                    width: 24
                })
            );
            var imageNumber = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/riders/'+ rider.number +'.png');
            if( imageNumber.exists() )
                riderDetailView.add(
                    Ti.UI.createImageView({
                        image: imageNumber.read(),
                        top: headerHeight - 40,
                        right: 6,
                        width: 70
                    })
                );
            else
                riderDetailView.add(
                    Ti.UI.createLabel({
                        text: rider.number,
                        font: {
                            fontWeight: 'bold',
                            fontSize: 48,
                            fontFamily: ws.fonts.fontStyles.menu.fontFamily
                        },
                        color: '#333333',
                        top: headerHeight - 58,
                        right: 6,                        
                        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
                        verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
                        height: Ti.UI.SIZE
                    })
                );
                
            // Border bottom header
            riderDetailView.add(
                Ti.UI.createView({
                    top: headerHeight,
                    left: 0,
                    width: ws.platform.screenWidth(),
                    height: 1,
                    backgroundColor: '#aaa'
                })
            );
            
            var trophySectionHeight = 44;
            headerHeight += 1;
            // Trophy section
            riderDetailView.add(
                Ti.UI.createView({
                    top: headerHeight,
                    left: 0,
                    width: '100%',
                    height: trophySectionHeight,
                    backgroundColor: '#eee',
                    layout: 'horizontal'
                })
            );      
            var propertiesLabelTrophy = {
                height: Ti.UI.FILL,
                left: 10,
                bottom: 1,
                font: {
                    fontWeight: 'bold',
                    fontSize: ws.fonts.fontStyles.trophy.fontSize,
                    fontFamily: ws.fonts.fontStyles.trophy.fontFamily
                },
                color: ws.fonts.fontStyles.trophy.fontColor,
                verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM
            };
            Ti.API.info("Ti.Platform.displayCaps.logicalDensityFactor " +  Ti.Platform.displayCaps.logicalDensityFactor);
            var propertiesImageTrophy = {
                image: Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/trophy'+rider.motogp+'.png'),
                left: 3,
                width: ws.platform.toDip(32),
                bottom: 5,
                verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM
            };
            
            // Trophy MotoGP
            propertiesLabelTrophy.text = 'Moto';
            riderDetailView.children[riderDetailView.children.length-1].add(
                Ti.UI.createLabel(propertiesLabelTrophy)
            );
            propertiesLabelTrophy.text = 'GP';
            propertiesLabelTrophy.left = 0;
            propertiesLabelTrophy.color = '#b00d35';
            riderDetailView.children[riderDetailView.children.length-1].add(
                Ti.UI.createLabel(propertiesLabelTrophy)
            );
            riderDetailView.children[riderDetailView.children.length-1].add(
                Ti.UI.createImageView(propertiesImageTrophy)
            );
            
            // Trophy Moto2
            propertiesLabelTrophy.text = 'Moto';
            propertiesLabelTrophy.left = 10;
            propertiesLabelTrophy.color = '#000';            
            riderDetailView.children[riderDetailView.children.length-1].add(
                Ti.UI.createLabel(propertiesLabelTrophy)
            );            
            propertiesLabelTrophy.text = '2';
            propertiesLabelTrophy.left = 0;
            propertiesLabelTrophy.color = '#b00d35';
            riderDetailView.children[riderDetailView.children.length-1].add(
                Ti.UI.createLabel(propertiesLabelTrophy)
            );
            // propertiesImageTrophy.width = 36;
            propertiesImageTrophy.image = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/trophy'+rider.moto2+'.png'),
            riderDetailView.children[riderDetailView.children.length-1].add(
                Ti.UI.createImageView(propertiesImageTrophy)
            );
            
            // Trophy Moto3
            propertiesLabelTrophy.text = 'Moto';
            propertiesLabelTrophy.left = 10;
            propertiesLabelTrophy.color = '#000';
            riderDetailView.children[riderDetailView.children.length-1].add(
                Ti.UI.createLabel(propertiesLabelTrophy)
            );
            propertiesLabelTrophy.text = '3';
            propertiesLabelTrophy.left = 0;
            propertiesLabelTrophy.color = '#b00d35';
            riderDetailView.children[riderDetailView.children.length-1].add(
                Ti.UI.createLabel(propertiesLabelTrophy)
            );
            // propertiesImageTrophy.width = 36;
            propertiesImageTrophy.image = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/trophy'+rider.moto3+'.png'),
            riderDetailView.children[riderDetailView.children.length-1].add(
                Ti.UI.createImageView(propertiesImageTrophy)
            );
            
            // Border bottom header
            // riderDetailView.add(
                // Ti.UI.createView({
                    // top: headerHeight + trophySectionHeight,
                    // left: 0,
                    // width: ws.platform.screenWidth(),
                    // height: 1,
                    // backgroundColor: '#aaa'
                // })
            // );
            riderDetailView.add(
                Ti.UI.createScrollView({
                    top: headerHeight + trophySectionHeight,
                    left: 0,//ws.platform.screenWidth(),
                    zIndex: 3,
                    width: ws.platform.screenWidth(),
                    contentWidth: ws.platform.screenWidth(),
                    contentHeight: 'auto',
                    height: Ti.UI.FILL,                
                    backgroundColor: '#333'
                })
            );
            riderDetailView.children[riderDetailView.children.length-1].add(
                Ti.UI.createLabel({
                    html: rider.description,
                    height: Ti.UI.SIZE,
                    left: 10,
                    width: ws.platform.screenWidth() - (20), 
                    top: 8,
                    font: {
                        fontSize: ws.fonts.fontStyles.regular.fontSize,
                        fontFamily: ws.fonts.fontStyles.regular.fontFamily
                    },
                    color: '#fff'
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
                backgroundImage: '/images/bg-jerez.png',
                opacity: 0
            });
            mainTrackDetailView.add(
                Ti.UI.createView({
                    top: 0,
                    left: 0,
                    width: ws.platform.screenWidth(),                                
                    height: 65,
                    backgroundColor: '#000',
                    opacity: 0.8,
                    zIndex: 4
                })
            );
            mainTrackDetailView.add(
                Ti.UI.createView({
                    top: 0,
                    left: 0,
                    width: ws.platform.screenWidth(),                                
                    height: Ti.UI.SIZE,
                    backgroundColor: 'transparent',
                    layout: 'vertical',                    
                    zIndex: 5
                })
            );
            mainTrackDetailView.children[1].add(
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
            mainTrackDetailView.children[1].add(
                Ti.UI.createLabel({
                    text: track.textDate[ws.translations.getLanguage()] + (track.tv[ws.translations.getLanguage()]?" - " + track.tv[ws.translations.getLanguage()]:""),
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
            /*mainTrackDetailView.children[1].add(
                Ti.UI.createView({
                    top: 0,
                    left: 0,
                    width: ws.platform.screenWidth(),
                    height: 4
                })
            );*/
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
            mainTrackDetailView.children[2].add(
                Ti.UI.createImageView({
                    image: track.image,
                    top: 50,
                    left: '12%',
                    width: '76%'
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
                top: -5,
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
            var topDate = 0;            
            for( var d in track.timetable ) {                
                timeTableView.add(
                    Ti.UI.createLabel({
                        text: d,
                        height: Ti.UI.SIZE,
                        left: 0,
                        width: '100%',    
                        top: topDate,
                        font: {
                            fontSize: ws.fonts.fontStyles.regular.fontSize,
                            fontFamily: ws.fonts.fontStyles.regular.fontFamily
                        },
                        color: '#b00d35'
                    })
                );
                topDate = 5;
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
            mainTrackDetailView.children[2].add( contentView );                   
            ws.mainAppView.add( mainTrackDetailView );
            this.actionEnd();
        },
        
        // Settings action
        // ------------------------------------------------------------------------------------
        settingsAction: function() {
            // Settings view
            var settingsView = Ti.UI.createView({
                top: 0,
                left: 0,
                zIndex: 3,
                width: ws.platform.screenWidth(),                                
                height: Ti.UI.SIZE,
                bubbleParent: false,
                backgroundColor: '#eee',
                opacity: 0,
                layout: 'vertical'
            });
            // Language option
            // ------------------------------------------------------------------------------------------------
            settingsView.add(
                Ti.UI.createView({
                    height: 50,
                    width: ws.platform.screenWidth(),
                    bubbleParent: false,
                    top: 0,
                    left: 0
                })
            );
            settingsView.children[settingsView.children.length-1].addEventListener('singletap', function(e){
                ws.mainAppView.add(
                    Ti.UI.createView({
                        width: ws.platform.screenWidth(),
                        height: Ti.UI.FILL,
                        top: 0,
                        left: 0,
                        zIndex: 100,
                        opacity: 0,
                        backgroundColor: '#000'                                 
                    })
                );
                ws.mainAppView.add(
                    Ti.UI.createView({
                        width: ws.platform.screenWidth(),
                        height: Ti.UI.FILL,
                        top: 0,
                        left: 0,
                        zIndex: 101,
                        opacity: 0,
                        backgroundColor: 'transparent',
                        layout: 'vertical'                                      
                    })
                );
                var languages = ws.translations.getLanguages();
                var top = 80;
                ws.mainAppView.children[ws.mainAppView.children.length-1].add(
                    Ti.UI.createLabel({
                        width: '60%',
                        height: 40,
                        left: '20%',
                        top: top,
                        verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
                        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
                        backgroundColor: '#666',
                        font: {
                            fontWeight: 'bold',
                            fontSize: ws.fonts.fontStyles.regular.fontSize,
                            fontFamily: ws.fonts.fontStyles.regular.fontFamily
                        },
                        color: '#fff',
                        text: ws.translations.translate('language').toUpperCase()
                    })
                );
                top = 0;
                for( var i=0; i<languages.length; i++ ) {
                    ws.mainAppView.children[ws.mainAppView.children.length-1].add(
                        Ti.UI.createView({
                            width: '60%',
                            height: 1,
                            left: '20%',
                            top: 0,
                            backgroundColor: '#999'
                        })
                    );
                    ws.mainAppView.children[ws.mainAppView.children.length-1].add(
                        Ti.UI.createLabel({
                            width: '60%',
                            height: 40,
                            left: '20%',
                            top: top,
                            verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
                            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
                            backgroundColor: '#eee',
                            font: {
                                fontWeight: (ws.translations.getLanguage()==languages[i]?'bold':''),
                                fontSize: ws.fonts.fontStyles.regular.fontSize,
                                fontFamily: ws.fonts.fontStyles.regular.fontFamily
                            },
                            color: (ws.translations.getLanguage()==languages[i]?'#000':'#333'),
                            text: languages[i].toUpperCase(),
                            id: languages[i]
                        })
                    );                    
                }
                ws.mainAppView.children[ws.mainAppView.children.length-1].addEventListener('singletap', function(e){
                    var language = e.source.id;
                    if( language && language != ws.translations.getLanguage() ) {
                        ws.translations.setLanguage(language);
                        ws.controller.reload('settings');
                    } else {
                        ws.mainAppView.remove(ws.mainAppView.children[ws.mainAppView.children.length-1]);
                        ws.mainAppView.children[ws.mainAppView.children.length-1] = null;
                        ws.mainAppView.remove(ws.mainAppView.children[ws.mainAppView.children.length-1]);
                        ws.mainAppView.children[ws.mainAppView.children.length-1] = null;
                    }
                });
                ws.mainAppView.children[ws.mainAppView.children.length-2].setOpacity(0.8); 
                ws.mainAppView.children[ws.mainAppView.children.length-1].setOpacity(1);                    
            });
            settingsView.children[settingsView.children.length-1].add(
                Ti.UI.createLabel({
                    text: ws.translations.translate("language").toUpperCase(),
                    height: Ti.UI.SIZE,
                    width: Ti.UI.SIZE,
                    verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
                    left: 7,     
                    font: {
                        fontSize: ws.fonts.fontStyles.regular.fontSize,
                        fontFamily: ws.fonts.fontStyles.regular.fontFamily
                    },
                    color: ws.fonts.fontStyles.regular.fontColor,
                    id: ws.translations.getLanguage()
                })
            );
            settingsView.children[settingsView.children.length-1].add(
                Ti.UI.createLabel({
                    text: ws.translations.getLanguage().toUpperCase(),
                    height: Ti.UI.SIZE,
                    width: Ti.UI.SIZE,
                    verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
                    right: 10,     
                    font: {
                        fontWeight: 'bold',
                        fontSize: ws.fonts.fontStyles.regular.fontSize,
                        fontFamily: ws.fonts.fontStyles.regular.fontFamily
                    },
                    color: ws.fonts.fontStyles.regular.fontColor,
                    id: ws.translations.getLanguage()
                })
            );   
            // END Language option
            // ------------------------------------------------------------------------------------------------
            
            settingsView.add(
                Ti.UI.createView({
                    height: 1,
                    width: ws.platform.screenWidth(),
                    top: 0,
                    left: 0,
                    backgroundColor: '#999'
                })
            );  
            
            // Analytics option
            // ------------------------------------------------------------------------------------------------
            settingsView.add(
                Ti.UI.createView({
                    height: 50,
                    width: ws.platform.screenWidth(),
                    bubbleParent: false,
                    top: 0,
                    left: 0
                })
            );
            settingsView.children[settingsView.children.length-1].addEventListener('singletap', function(e){
                // Ti.API.info("singletap in language option. Current Language Id: " + e.source.id);         
                ws.mainAppView.add(
                    Ti.UI.createView({
                        width: ws.platform.screenWidth(),
                        height: Ti.UI.FILL,
                        top: 0,
                        left: 0,
                        zIndex: 100,
                        opacity: 0,
                        backgroundColor: '#000'                                 
                    })
                );
                ws.mainAppView.add(
                    Ti.UI.createView({
                        width: ws.platform.screenWidth(),
                        height: Ti.UI.FILL,
                        top: 0,
                        left: 0,
                        zIndex: 101,
                        opacity: 0,
                        backgroundColor: 'transparent',
                        layout: 'vertical'                                      
                    })
                );
                var options = ['enabled','disabled'];
                var top = 80;
                ws.mainAppView.children[ws.mainAppView.children.length-1].add(
                    Ti.UI.createLabel({
                        width: '80%',
                        height: 40,
                        left: '10%',
                        top: top,
                        verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
                        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
                        backgroundColor: '#666',
                        font: {
                            fontWeight: 'bold',
                            fontSize: ws.fonts.fontStyles.regular.fontSize,
                            fontFamily: ws.fonts.fontStyles.regular.fontFamily
                        },
                        color: '#fff',
                        text: ws.translations.translate('analytics').toUpperCase()
                    })
                );
                top = 0;
                ws.mainAppView.children[ws.mainAppView.children.length-1].add(
                    Ti.UI.createLabel({
                        width: '80%',
                        height: Ti.UI.SIZE,
                        left: '10%',
                        top: top,
                        verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
                        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
                        backgroundColor: '#666',
                        font: {
                            fontSize: ws.fonts.fontStyles.details.fontSize,
                            fontFamily: ws.fonts.fontStyles.regular.fontFamily
                        },
                        color: '#eee',
                        text: ws.translations.translate('analytics_info')
                    })
                );
                ws.mainAppView.children[ws.mainAppView.children.length-1].add(
                    Ti.UI.createView({
                        width: '80%',
                        height: 14,
                        left: '10%',
                        top: top,
                        backgroundColor: '#666'
                    })
                );
                for( var i=0; i<options.length; i++ ) {                    
                    ws.mainAppView.children[ws.mainAppView.children.length-1].add(
                        Ti.UI.createView({
                            width: '80%',
                            height: 1,
                            left: '10%',
                            top: 0,
                            backgroundColor: '#333'
                        })
                    );
                    ws.mainAppView.children[ws.mainAppView.children.length-1].add(
                        Ti.UI.createLabel({
                            width: '80%',
                            height: 40,
                            left: '10%',
                            top: top,
                            verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
                            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
                            backgroundColor: '#eee',
                            font: {
                                fontWeight: (ws.settings.get(ws.settings.properties.analytics)==options[i]?'bold':''),
                                fontSize: ws.fonts.fontStyles.regular.fontSize,
                                fontFamily: ws.fonts.fontStyles.regular.fontFamily
                            },
                            color: (ws.settings.get(ws.settings.properties.analytics)==options[i]?'#000':'#333'),
                            text: ws.translations.translate(options[i]).toUpperCase(),
                            id: options[i]
                        })
                    );
                }
                ws.mainAppView.children[ws.mainAppView.children.length-1].addEventListener('singletap', function(e){
                    var option = e.source.id;
                    if( option && option != ws.settings.get(ws.settings.properties.analytics) ) {
                        ws.settings.set(ws.settings.properties.analytics, option);
                        settingsView.children[settingsView.children.length-1].children[
                            settingsView.children[settingsView.children.length-1].children.length-1
                        ].setText(
                            ws.translations.translate(ws.settings.get(ws.settings.properties.analytics)).toUpperCase()
                        );                        
                    }
                    ws.mainAppView.remove(ws.mainAppView.children[ws.mainAppView.children.length-1]);
                    ws.mainAppView.children[ws.mainAppView.children.length-1] = null;
                    ws.mainAppView.remove(ws.mainAppView.children[ws.mainAppView.children.length-1]);
                    ws.mainAppView.children[ws.mainAppView.children.length-1] = null;
                });
                ws.mainAppView.children[ws.mainAppView.children.length-2].setOpacity(0.8); 
                ws.mainAppView.children[ws.mainAppView.children.length-1].setOpacity(1);                                  
            });        
            settingsView.children[settingsView.children.length-1].add(
                Ti.UI.createLabel({
                    text: ws.translations.translate("analytics").toUpperCase(),
                    height: Ti.UI.SIZE,
                    width: Ti.UI.SIZE,
                    verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
                    left: 7,     
                    font: {
                        fontSize: ws.fonts.fontStyles.regular.fontSize,
                        fontFamily: ws.fonts.fontStyles.regular.fontFamily
                    },
                    color: ws.fonts.fontStyles.regular.fontColor
                })
            );
            settingsView.children[settingsView.children.length-1].add(
                Ti.UI.createLabel({
                    text: ws.translations.translate(ws.settings.get(ws.settings.properties.analytics)).toUpperCase(),
                    height: Ti.UI.SIZE,
                    width: Ti.UI.SIZE,
                    verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
                    right: 10,     
                    font: {
                        fontWeight: 'bold',
                        fontSize: ws.fonts.fontStyles.regular.fontSize,
                        fontFamily: ws.fonts.fontStyles.regular.fontFamily
                    },
                    color: ws.fonts.fontStyles.regular.fontColor
                })
            );
            // END Analytics option
            // ------------------------------------------------------------------------------------------------
            ws.mainAppView.add( settingsView );
            this.actionEnd();
        },
        
        // Called when action finishes
        // ------------------------------------------------------------------------------------
        actionEnd: function() {
            ws.animation.hideActivityIndicator();
            ws.mainAppView.getChildren()[0].animate({
                opacity: 1,
                duration: 250
            })
        }
        
    };
    
    return Controller;
    /* ------------------------------------------------------------------------------------- */ 
})();
