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
            // Setup App events            
            ws.mainWindow.addEventListener('open', function(e) {
                // Android
                Ti.API.info("Opening App...");
                if( ws.platform.android() ) {
                    var currentActivity = e.source.activity;
                    ws.mainWindow.addEventListener('androidback', function() {
                        context.actionBack({backButton: true});
                    });
                    // onOpen
                    if( 'onOpen' in options )
                        options.onOpen();
                    // onPause
                    if( 'onPause' in options )
                        currentActivity.addEventListener('pause', options.onPause);
                    // onResume
                    if( 'onResume' in options )
                        currentActivity.addEventListener('resume', options.onResume);
                    // onDestroy
                    if( 'onDestroy' in options )
                        currentActivity.addEventListener('destroy', options.onDestroy);
                                        
                    //TODO: It was supposed to use settings button to show and hide menu
                    /*currentActivity.onCreateOptionsMenu = function(e) {
                        Ti.API.info('onCreateOptionsMenu!');
                        if( ws.mainMenu.isVisible() )
                            ws.mainMenu.hide();
                        else
                            ws.mainMenu.show();
                    }
                    currentActivity.onPrepareOptionsMenu = function(e) {
                        Ti.API.info('onPrepareOptionsMenu!');
                        if( ws.mainMenu.isVisible() )
                            ws.mainMenu.hide();
                        else
                            ws.mainMenu.show();
                    }  */                  
                }
                // iOS 
                else {
                    // onOpen
                    if( 'onOpen' in options )
                        options.onOpen();
                }
            });
            if( ws.platform.iphone() ) {
                // onResume
                if( 'onResume' in options )
                    Ti.App.addEventListener('resumed', options.onResume);
            }          
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
            this.stackTrace = ['default'];            
            this.currentAction = '';            
            this.emptyMainAppView();
            ws.mainMenu.reload();
            this.action(action);          
        },
        
        // Called when android back button is pressed
        // ------------------------------------------------------------------------------------
        // androidBackButton: function(context) {
            // context.actionBack();
        // },
        
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
                child.removeAllChildren();
                child = null;
            }
        },
        
        // It does what is says
        // ------------------------------------------------------------------------------------
        hideMainAppView: function() {
            if( ws.mainAppView )
                ws.mainAppView.hide();
        },
        
        // It does what is says
        // ------------------------------------------------------------------------------------
        showMainAppView: function() {
            if( ws.mainAppView )
                ws.mainAppView.show();
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
            Ti.API.info("StackTrace " + this.stackTrace);            
            return this.stackTrace.pop();
        },
        
        // Current Action
        // ------------------------------------------------------------------------------------
        currentAction: '',
        
        // Check if app in a detail action
        // ------------------------------------------------------------------------------------
        inDetailAction: function() {
            var regex = /.+Detail/g;
            return regex.test(this.currentAction);
        },
        
        // Action Back
        // ------------------------------------------------------------------------------------
        actionBack: function(params) {
            if( !params )
                params = {};
            if( ws.mainMenu.isVisible() ) {
                ws.mainMenu.hide();
            }
            // If we are in a detail action 
            else if( this.inDetailAction() ) {
                if( this.stackTrace.length == 1 ) {
                    ws.mainWindow.close();
                    return;
                }
                this.popStackTrace();
                this.action(this.popStackTrace());
            } 
            // If we are in a main action
            else {             
                if( "backButton" in params ) {
                    if( this.stackTrace.length == 1 ) {
                        ws.mainWindow.close();
                        return;
                    }
                    this.popStackTrace();
                    this.action(this.popStackTrace());
                } else {   
                    ws.mainMenu.show();
                }
            }
        },
        
        // Last rider id visited
        // ------------------------------------------------------------------------------------
        lastRiderId: null,
        
        // Last track id visited
        // ------------------------------------------------------------------------------------
        lastTrackId: null,
        
        // Action controller
        // ------------------------------------------------------------------------------------
        action: function(name, params) {
            if( name !== this.currentAction ) {
                this.hideMainAppView();
                if( this.currentAction != '' )
                    ws.animation.showActivityIndicator(ws.mainWindow, {top: ws.topBar.height, height: ws.platform.screenHeight()-ws.topBar.height});
                this.emptyMainAppView();                                
                this.currentAction = name;
                this.pushStackTrace(name);
                switch(name) {
                    case "default":
                        this.defaultAction();
                        ws.topBar.mainButton.toMainState(ws.translations.translate('default').toUpperCase());                   
                        break;
                        
                    case "tracks":
                        this.tracksAction();
                        ws.topBar.mainButton.toMainState(ws.translations.translate('tracks').toUpperCase());
                        break;
                        
                    case "classification":
                        this.classificationAction();
                        ws.topBar.mainButton.toMainState(ws.translations.translate('classification').toUpperCase() + ' 2014');                      
                        break;
                        
                    case "riders":
                        this.ridersAction();
                        ws.topBar.mainButton.toMainState(ws.translations.translate('riders').toUpperCase());
                        break;
                    
                    case "riderDetail":
                        this.riderDetailAction(params);
                        ws.topBar.mainButton.toDetailState(ws.translations.translate('riders').toUpperCase());
                        break;
                    
                    case "trackDetail":
                        this.trackDetailAction(params);
                        ws.topBar.mainButton.toDetailState(ws.translations.translate('tracks').toUpperCase());           
                        break;
                    case "settings":
                        this.settingsAction(params);
                        ws.topBar.mainButton.toMainState(ws.translations.translate('settings').toUpperCase());
                        break;
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
                var headerHeight = 44;
                // Adding Header container
                homeContainerView.add(
                    Ti.UI.createView({
                        width: ws.platform.screenWidth(),
                        height: headerHeight,
                        backgroundColor: '#fff',
                        top: 0,
                        opacity: 0.8
                    })
                );
                homeContainerView.add(
                    Ti.UI.createView({
                        width: ws.platform.screenWidth(),
                        height: headerHeight,
                        backgroundColor: 'transparent',
                        layout: 'horizontal',         
                        top: 0
                    })
                );
                // Adding Header title
                homeContainerView.children[1].add(
                    Ti.UI.createLabel({
                        text: track.name, //.toUpperCase(),
                        height: Ti.UI.FILL,
                        left: 10,
                        bottom: 4,  
                        verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
                        font: {
                            fontWeight: 'bold',
                            fontSize: ws.fonts.fontStyles.homeTrackTitle.fontSize,
                            fontFamily: ws.fonts.fontStyles.homeTrackTitle.fontFamily
                        },
                        color: ws.fonts.fontStyles.homeTrackTitle.fontColor
                    })
                );
                // Adding Header sub title (date and time)
                homeContainerView.children[1].add(
                    Ti.UI.createLabel({
                        text: track.textDate[ws.translations.getLanguage()],// + (track.time?' - ' + track.time + 'h (CET)':''), 
                        //(track.tv[ws.translations.getLanguage()]?" - " + track.tv[ws.translations.getLanguage()]:""),
                        height: Ti.UI.FILL,
                        left: 10,
                        bottom: 7,
                        verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,          
                        font: {
                            fontSize: 17,
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
                    top: 48,
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
                var w = ws.platform.screenWidth() * 0.7;
                homeView.add(
                    Ti.UI.createView({
                        top: -20,
                        left: '15%',
                        width: w,
                        height: w                                    
                    })
                );
                
                
                // Ti.UI.createImageView({
                    // image: track.image,
                    // top: -20,
                    // left: '15%',
                    // width: '70%'
                // })
                
                var eResource = new ws.utils.ExternalResource();
                eResource.getImage(
                    track.image,
                    homeView.children[homeView.children.length-1]
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
                        time: {
                            text: track.time + ' (CET)'
                        },
                        tv: {
                            text: track.tv[ws.translations.getLanguage()]
                        },
                        tv_icon: {
                            image: track.tv_icon
                        }/*,
                        length: {
                            text: track.length + " m"
                        },
                        constructed: {
                            text: ws.translations.translate('constructed') + " " + track.constructed
                        }*/,                        
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
            var context = this;
            var onDataReady = function(classificationData) {
                var data = [];
                var time = new Date().getTime();
                for (var i = 0; i < classificationData.length; i++) {
                    var result = classificationData[i];
                    data.push({
                        position: {
                            text: result.position
                        },
                        name: {
                            text: result.name
                        },
                        team: {
                            text: result.team
                        },
                        wins: {
                            text: result.wins
                        },
                        points: {
                            text: result.points
                        },
                        properties: {
                            itemId: result.riderId,
                            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE,
                            backgroundColor: ((i%2==0)?'#fff':'#eee')
                        }
                    });
                }
                var time2 = new Date().getTime();
                Ti.API.info("Time loading items: " + ws.utils.toSec(time2-time));
                
                var headerHeight = 35;
                ws.mainAppView.add(
                    Ti.UI.createView({
                        width: ws.platform.screenWidth(),
                        height: Ti.UI.FILL,
                        top: 0,
                        backgroundColor: 'transparent',
                        layout: 'vertical',
                        opacity: 0
                    })
                );
                // Header
                ws.mainAppView.children[0].add(
                    Ti.UI.createView({
                        width: ws.platform.screenWidth(),
                        height: headerHeight,
                        top: 0,
                        backgroundColor: '#333',
                        layout: 'horizontal'
                    })
                );
                // Position
                ws.mainAppView.children[0].children[0].add(
                    Ti.UI.createLabel({
                        text: ws.translations.translate('position_abbr'),
                        left: 0,
                        top: 7,
                        width: 24,
                        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
                        font: {
                            fontWeight: 'bold',
                            fontSize: ws.fonts.fontStyles.classification.fontSize,
                            fontFamily: ws.fonts.fontStyles.classification.fontFamily
                        },
                        color: '#fff'
                    })  
                );
                // Name
                ws.mainAppView.children[0].children[0].add(
                    Ti.UI.createLabel({
                        text: ws.translations.translate('rider'),
                        left: 8,
                        width: '63%',
                        top: 7,
                        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                        font: {
                            fontWeight: 'bold',
                            fontSize: ws.fonts.fontStyles.classification.fontSize,
                            fontFamily: ws.fonts.fontStyles.classification.fontFamily
                        },
                        color: '#fff'
                    })  
                );
                // Wins
                ws.mainAppView.children[0].children[0].add(
                    Ti.UI.createLabel({
                        text: ws.translations.translate('wins_abbr'),
                        left: 4,
                        width: 34,
                        top: 7,
                        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
                        font: {
                            fontWeight: 'bold',
                            fontSize: ws.fonts.fontStyles.classification.fontSize,
                            fontFamily: ws.fonts.fontStyles.classification.fontFamily
                        },
                        color: '#fff'
                    })  
                );
                // Points
                ws.mainAppView.children[0].children[0].add(
                    Ti.UI.createLabel({
                        text: ws.translations.translate('points_abbr'),
                        left: 4,
                        width: 38,
                        top: 7,
                        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
                        font: {
                            fontWeight: 'bold',
                            fontSize: ws.fonts.fontStyles.classification.fontSize,
                            fontFamily: ws.fonts.fontStyles.classification.fontFamily
                        },
                        color: '#fff'
                    })  
                );
                // ListView            
                ws.mainAppView.children[0].add(
                    Ti.UI.createListView({
                        top: 0,
                        left: 0,
                        zIndex: 2,
                        separatorColor: 'transparent',
                        width: ws.platform.screenWidth(),// - 16,
                        height: ws.platform.screenHeight() - ws.topBar.height - headerHeight,
                        templates: {
                            default: context.template.get("classificationList")
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
            };
            this.model.getClassification(onDataReady,2014,'motogp');            
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
            if( !id )
                id = this.lastRiderId;
            else 
                this.lastRiderId = id;
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
                Ti.UI.createView({
                    top: 0,
                    left: 0,
                    width: headerHeight,
                    height: headerHeight
                })
            );
            var eResource = new ws.utils.ExternalResource();
            eResource.getImage(
                rider.photo,
                riderDetailView.children[0]
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
            if( !id )
                id = this.lastTrackId;
            else 
                this.lastTrackId = id;
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
            var titleViewHeight = 44;
            mainTrackDetailView.add(
                Ti.UI.createView({
                    top: 0,
                    left: 0,
                    width: ws.platform.screenWidth(),                                
                    height: titleViewHeight,
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
                    height: titleViewHeight,
                    backgroundColor: 'transparent',
                    layout: 'horizontal',                    
                    zIndex: 5
                })
            );
            mainTrackDetailView.children[1].add(
                Ti.UI.createLabel({
                    text: track.name, //.toUpperCase(),
                    left: '2%',    
                    height: Ti.UI.FILL,
                    bottom: 4,  
                    verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,     
                    font: {
                        fontWeight: 'bold',
                        fontSize: ws.fonts.fontStyles.detailTrackTitle.fontSize,
                        fontFamily: ws.fonts.fontStyles.detailTrackTitle.fontFamily
                    },
                    color: ws.fonts.fontStyles.detailTitle.fontColor
                    // verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
                })
            );
            mainTrackDetailView.children[1].add(
                Ti.UI.createLabel({
                    text: track.textDate[ws.translations.getLanguage()],// + (track.time?' - ' + track.time + 'h (CET)':''),
                    height: Ti.UI.FILL,
                    left: 10,    
                    bottom: 7,  
                    verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,     
                    font: {
                        fontSize: ws.fonts.fontStyles.detailTrackDate.fontSize,
                        fontFamily: ws.fonts.fontStyles.detailTrackDate.fontFamily
                    },
                    color: ws.fonts.fontStyles.detailTrackDate.fontColor
                })
            );          
            mainTrackDetailView.add(
                Ti.UI.createScrollView({
                    top: 0,
                    left: 0,
                    zIndex: 3,
                    width: ws.platform.screenWidth(),
                    contentWidth: ws.platform.screenWidth(),   
                    contentHeight: 'auto',
                    height: ws.platform.screenHeight(),   
                    bubbleParent: false,
                    backgroundColor: 'transparent',
                    layout: 'vertical'                    
                })
            );  
            
            // Add image and details view
            mainTrackDetailView.children[2].add(
                Ti.UI.createView({
                    width: ws.platform.screenWidth(),
                    left: 0,
                    top: 0,
                    height: Ti.UI.SIZE
                })                
            );
            var imageFactor = 0.7;
            switch(track.position) {
                case 'top-left': // Lemans, Brno
                    var containerDetailsWidth = '57%';
                    var containerDetailsLeft = '43%';
                    // Calculate height of resulting track image and divide by two to positioning view 
                    // in the center plus/minux x points top because of track image
                    var containerDetailsTop = (ws.platform.screenWidth()*imageFactor/2 ) + 57; 
                    var leftImage = '5%';
                    var topImage  = 24;
                    break;
                case 'top': // Montmelo
                    var containerDetailsWidth = '55%';
                    var containerDetailsLeft = '45%';
                    // Calculate height of resulting track image and divide by two to positioning view 
                    // in the center plus/minux x points top because of track image
                    var containerDetailsTop = (ws.platform.screenWidth()*imageFactor/2 ) + 70; 
                    var leftImage = '5%';
                    var topImage  = 30;
                    break;
                case 'top-right': // Argentina, Mugello, Assen, Sachsenring, Silverstone, Indianapolis, Sepang
                    var containerDetailsWidth = '55%';
                    var containerDetailsLeft = 8;
                    // Calculate height of resulting track image and divide by two to positioning view 
                    // in the center plus/minux x points top because of track image
                    var containerDetailsTop = (ws.platform.screenWidth()*imageFactor/2 ) + 70;
                    var leftImage = '21%';
                    var topImage  = 13;
                    if( track.qname == 'mugello' || track.qname == 'silverstone' || track.qname == 'indianapolis' ) {
                        topImage  = 26;
                    } else if( track.qname == "sepang" ) {
                        topImage = 42
                        containerDetailsTop += 18;
                        leftImage = '28%';
                    }
                    break;
                case 'left': // Austin, Misano
                    var containerDetailsWidth = '55%';
                    var containerDetailsLeft = '45%';
                    // Calculate height of resulting track image and divide by two to positioning view 
                    // in the center plus/minux x points top because of track image
                    var containerDetailsTop = (ws.platform.screenWidth()*imageFactor/2 ) + 45;                                                                 
                    var leftImage = '-5%';
                    var topImage  = 50;
                    if( track.qname == 'misano' ) {
                        leftImage = '2%';
                        topImage = 44;
                        containerDetailsTop += 5;
                    }                    
                    
                    break;
                case 'right': // Motorland, Jerez, Qatar, Phillip Island
                    var containerDetailsWidth = '55%';
                    var containerDetailsLeft = 8;
                    // Calculate height of resulting track image and divide by two to positioning view 
                    // in the center plus/minux x points top because of track image
                    var containerDetailsTop = (ws.platform.screenWidth()*imageFactor/2 ) + 70;
                    var leftImage = '21%';
                    var topImage  = 45;
                    if( track.qname == 'jerez' ) {
                        containerDetailsTop -= 40;
                        leftImage = '36%';
                        topImage = 45; 
                    } else if( track.qname == 'qatar') {
                        containerDetailsTop -= 115;
                        leftImage = '28%';
                        topImage = 65; 
                    } else if( track.qname == 'phillip_island') {
                        containerDetailsTop -= 10;
                        leftImage = '24%';
                        topImage = 35;  
                    }
                    break;
                case 'bottom-left': // Motegui
                    var containerDetailsWidth = '52%';
                    var containerDetailsLeft = '48%';
                    // Calculate height of resulting track image and divide by two to positioning view 
                    // in the center plus/minux x points top because of track image
                    var containerDetailsTop = (ws.platform.screenWidth()*imageFactor/2 ) + 15;
                    var leftImage = '-5%';
                    var topImage  = 55;
                    break;
                case 'bottom-right':
                    var containerDetailsWidth = '45%';
                    var containerDetailsLeft = 8;
                    // Calculate height of resulting track image and divide by two to positioning view 
                    // in the center plus/minux x points top because of track image
                    var containerDetailsTop = (ws.platform.screenWidth()*imageFactor/2 ) - 35; 
                    var leftImage = '21%';
                    var topImage  = 60;
                    break;
                // TODO: Make a special case for QATAR
                default:
                    var containerDetailsWidth = '55%';
                    var containerDetailsLeft = '45%';
                    // Calculate height of resulting track image and divide by two to positioning view 
                    // in the center plus 50 points top cus of track image
                    var containerDetailsTop = (ws.platform.screenWidth()*imageFactor/2 )+ 50; 
                    var leftImage = '15%';
                    var topImage  = 50;
                    break;
            }       
            
            topImage -= 18;
            containerDetailsTop -= 18;
            
            // Adding track image container
            var w = ws.platform.screenWidth() * imageFactor;                 
            mainTrackDetailView.children[2].children[0].add(
                Ti.UI.createView({
                    top: topImage,
                    left: leftImage,
                    width: w,
                    height: w
                })
            ); 
            var eResource = new ws.utils.ExternalResource();
            eResource.getImage(
                track.image,
                mainTrackDetailView.children[2].children[0].children[0]
            );
            // Adding container track details
            mainTrackDetailView.children[2].children[0].add(
                Ti.UI.createView({
                    height: Ti.UI.SIZE,
                    width: containerDetailsWidth,                    
                    left: containerDetailsLeft,                    
                    top: containerDetailsTop, 
                    layout: 'vertical'
                })  
            );
            // Adding fastest lap label
            mainTrackDetailView.children[2].children[0].children[1].add(
                 Ti.UI.createLabel({
                    text: ws.translations.translate('fastest_lap'),
                    height: Ti.UI.SIZE,
                    width: Ti.UI.SIZE,
                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                    left: 0,
                    top: 0,    
                    font: {
                        fontSize: ws.fonts.fontStyles.trackDetails.fontSize,
                        fontFamily: ws.fonts.fontStyles.details.fontFamily
                    },
                    shadowColor: '#000',
                    shadowOffset: {x:2, y:2},
                    shadowRadius: 3,
                    color: ws.fonts.fontStyles.trackDetails.fontColor
                })
            );
            // Adding fastest lap value
            mainTrackDetailView.children[2].children[0].children[1].add(
                 Ti.UI.createLabel({
                    text: track.fastest_lap,
                    height: Ti.UI.SIZE,
                    width: Ti.UI.SIZE,
                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                    left: 0,
                    top: 1,    
                    font: {
                        fontWeight: 'bold',
                        fontSize: ws.fonts.fontStyles.trackDetails.fontSize,
                        fontFamily: ws.fonts.fontStyles.details.fontFamily
                    },
                    shadowColor: '#000',
                    shadowOffset: {x:2, y:2},
                    shadowRadius: 3,
                    color: ws.fonts.fontStyles.trackDetails.fontColor
                })
            );
            // Adding track length
            mainTrackDetailView.children[2].children[0].children[1].add(
                 Ti.UI.createLabel({
                    text: track.length + " m",
                    height: Ti.UI.SIZE,
                    width: Ti.UI.SIZE,
                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                    left: 0,
                    top: (track.qname=='qatar'?45:0),    
                    font: {
                        fontSize: ws.fonts.fontStyles.trackDetails.fontSize,
                        fontFamily: ws.fonts.fontStyles.details.fontFamily
                    },
                    shadowColor: '#000',
                    shadowOffset: {x:2, y:2},
                    shadowRadius: 3,
                    color: ws.fonts.fontStyles.trackDetails.fontColor
                })
            );
            // Adding laps number
            mainTrackDetailView.children[2].children[0].children[1].add(
                 Ti.UI.createLabel({
                    text: track.laps + " " + ws.translations.translate('laps').toLowerCase(),
                    height: Ti.UI.SIZE,
                    width: Ti.UI.SIZE,
                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                    left: 0,
                    top: 1,    
                    font: {
                        fontSize: ws.fonts.fontStyles.trackDetails.fontSize,
                        fontFamily: ws.fonts.fontStyles.details.fontFamily
                    },
                    shadowColor: '#000',
                    shadowOffset: {x:2, y:2},
                    shadowRadius: 3,
                    color: ws.fonts.fontStyles.trackDetails.fontColor
                })
            );
            // Adding construced year
            mainTrackDetailView.children[2].children[0].children[1].add(
                 Ti.UI.createLabel({
                    text: ws.translations.translate('constructed') + " " + track.constructed,
                    height: Ti.UI.SIZE,
                    width: Ti.UI.SIZE,
                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                    left: 0,
                    top: 1,    
                    font: {
                        fontSize: ws.fonts.fontStyles.trackDetails.fontSize,
                        fontFamily: ws.fonts.fontStyles.details.fontFamily
                    },
                    shadowColor: '#000',
                    shadowOffset: {x:2, y:2},
                    shadowRadius: 3,
                    color: ws.fonts.fontStyles.trackDetails.fontColor
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
                top: 5,
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
            for( var d in track.timetable[ws.translations.getLanguage()] ) {                
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
                var rows = track.timetable[ws.translations.getLanguage()][d];
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
            mainTrackDetailView.children[2].add(
                Ti.UI.createView({
                    width: Ti.UI.FILL,
                    height: 10
                }) 
            );     
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
            this.showMainAppView();
            ws.mainAppView.getChildren()[0].animate({
                opacity: 1,
                duration: 50//250
            })
            // Testing
            /*ws.mainAppView.getChildren()[0].setOpacity(1);
            ws.animation.slideFrom({
                direction: 'left',
                view: ws.mainAppView.getChildren()[0],
                duration: 300
            });*/
        }
        
    };
    
    return Controller;
    /* ------------------------------------------------------------------------------------- */ 
})();
