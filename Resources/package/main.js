// Main and global objects
// -----------------------------------------
ws.platform = new ws.utils.Platform();
ws.translations = new ws.Translations({
    "defaultLanguage": "es",
    "allowedLanguages": ["ca","es","en"]
});
// -----------------------------------------

// Include App files
// -----------------------------------------
Ti.include('settings.js');
Ti.include('translations.js');
Ti.include('fonts.js');
Ti.include('model.js');
Ti.include('template.js');
Ti.include('controller.js');
// -----------------------------------------

// -----------------------------------------
// Main App Settings
// -----------------------------------------

ws.settings = new ws.Settings();

// -----------------------------------------
// Main UI App
// -----------------------------------------

// Main Window
// ----------------------------------------------------
ws.mainWindow = Ti.UI.createWindow({
    title : 'MotoGP',
    top : 0,
    backgroundColor : '#fff',
    navBarHidden : true,
    exitOnClose : true,
    id: 'mainWindow',
    orientationModes: [
        Ti.UI.PORTRAIT
    ]
});

// TopBar
// ----------------------------------------------------
ws.topBar = new ws.menu.TopBar({
    bgColor: '#eee',
    mainButton: new ws.ui.Button({
        imageUrl : '../images/menu.png',
        text: ws.translations.translate('default').toUpperCase(),
        color: '#b00d35',
        font: {
            fontSize : ws.fonts.fontStyles.title.fontSize,
            fontFamily : ws.fonts.fontStyles.title.fontSize.fontFamily,
            fontWeight: 'bold',
            fontStyle: 'italic'
        },
        onTouchBgColor : '#aaa',
        onClick : function(e) {
            ws.controller.actionBack();
        }
    })
});
ws.topBar.mainButton.setImageLeft(0);
//ws.topBar.mainButton.setTextProperty("left", 0);
ws.mainWindow.add(ws.topBar.view);

// MainMenu
// ----------------------------------------------------
ws.mainMenu = new ws.menu.Main({
    draggable: true,
    top: ws.topBar.height,
    height: ws.platform.screenHeight() - ws.topBar.height,
    width: ws.platform.screenWidth() / 8 * 6,
    bgColor: "#333",
    mainWindow: ws.mainWindow,
    onClick: function(obj) {
        // Temp testing
        ws.animation.slideTo({
            view : ws.mainAppView,
            direction : 'left',
            duration: 125,
            left: 0        
        });
        ws.animation.slideTo({
            view : ws.topBar.mainButton.imageView,
            left: 0,
            direction : 'left',
            duration: 150
        });
        ws.animation.slideTo({
            view: ws.mainMenu.view,
            direction: 'left',
            duration: 150,
            onComplete : function(e) {
                Ti.API.info("CLICK ON " + obj.source.id);
                ws.controller.action(obj.source.id);
                ws.mainMenu.setVisible(false);
                ws.mainMenu.opacityView.hide();
            }
        });
        // End temp testing
        /*ws.mainMenu.opacityView.animate({
            opacity: 0,
            duration: 150,
        },function(e) {                
            Ti.API.info("CLICK ON " + obj.source.id);
            ws.controller.action(obj.source.id);
            ws.mainMenu.setVisible(false);
            ws.mainMenu.opacityView.hide();
        });*/
    }
});

var mainMenuOptions = [
    {
        text: ws.translations.translate('default').toUpperCase(),
        id: "default",
        imageUrl: '/images/home.png'
    },
    {
        text: ws.translations.translate('tracks').toUpperCase(),
        id: "tracks",
        imageUrl: '/images/tracks.png'
    },
    {
        text: ws.translations.translate('classification').toUpperCase(),
        id: "classification",
        imageUrl: '/images/classification.png'
    },
    {
        text: ws.translations.translate('riders').toUpperCase(),
        id: "riders",
        imageUrl: '/images/riders.png'
    },
    {
        text: ws.translations.translate('settings').toUpperCase(),
        id: "settings",
        imageUrl: '/images/settings.png'
    },
    {
        text: ws.translations.translate('credits').toUpperCase(),
        id: "credits",
        imageUrl: '/images/credits.png'
    }
];

for( var i=0; i<mainMenuOptions.length; i++ ) {
    ws.mainMenu.addMenuOption({
        text: mainMenuOptions[i].text,
        id: mainMenuOptions[i].id,
        font: {
            fontSize : ws.fonts.fontStyles.menu.fontSize,
            fontFamily : ws.fonts.fontStyles.menu.fontFamily,
            fontWeight: 'bold'
        },
        color: '#eee',
        imageUrl: mainMenuOptions[i].imageUrl,
        imageSize: 28,
        left: 6,
        textLeft: 8,
        height: 50,
        width: Ti.UI.FILL        
    });
}

// Main App View
// ----------------------------------------------------
ws.mainAppView = Ti.UI.createView({
    width: ws.platform.screenWidth(),
    height: ws.platform.screenHeight() - ws.topBar.height,
    top: ws.topBar.height,
    left: 0,
    backgroundColor: '#fff',
    zIndex: 1
});
ws.mainWindow.add(ws.mainAppView);
ws.animation.showActivityIndicator(ws.mainWindow, {top: ws.topBar.height, height: ws.platform.screenHeight()-ws.topBar.height});
// -----------------------------------------
// End Main UI App
// -----------------------------------------
