// Include App files
// -----------------------------------------
Ti.include('fonts.js');
Ti.include('template.js');
Ti.include('controller.js');
// -----------------------------------------

ws.platform = new ws.utils.Platform();

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
    mainButton: new ws.ui.Button({
        imageUrl : '../images/menu.png',
        text: 'MotoGP',
        color: ws.fonts.fontStyles.title.fontColor,
        font: {
            fontSize : ws.fonts.fontStyles.title.fontSize,
            fontFamily : ws.fonts.fontStyles.title.fontSize.fontFamily
        },
        onTouchBgColor : '#666',
        onClick : function(e) {
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
    })
});
ws.mainWindow.add(ws.topBar.view);

// TopBar
// ----------------------------------------------------
ws.mainMenu = new ws.menu.Main({
    draggable: true,
    top: ws.topBar.height,
    height: ws.platform.screenHeight() - ws.topBar.height,
    width: ws.platform.screenWidth() / 8 * 6,
    bgColor: "#fff",
    mainWindow: ws.mainWindow
});

var onClickMainMenuOption = function(obj) {
    ws.animation.slideTo({
        view: ws.mainMenu.view,
        direction: 'left',
        duration: 150,
        onComplete: function(e) {}
    });
    ws.mainMenu.opacityView.animate({
        opacity: 0,
        duration: 150,
    },function(e) {
        ws.animation.showActivityIndicator(ws.mainWindow, {top: ws.topBar.height, height: ws.platform.screenHeight()-ws.topBar.height});        
        Ti.API.info("CLICK ON " + obj.source.id);
        ws.controller.action(obj.source.id);
        ws.animation.hideActivityIndicator();
        ws.mainMenu.setVisible(false);
        ws.mainMenu.opacityView.setVisible(false);
    });
}

var mainMenuOptions = [
    {
        text: "TRACKS",
        id: "tracks",
        imageUrl: '/images/tracks.png'
    },
    {
        text: "CLASSIFICATION",
        id: "classification",
        imageUrl: '/images/classification.png'
    },
    {
        text: "RIDERS",
        id: "riders",
        imageUrl: '/images/riders.png'
    }
];

for( var i=0; i<mainMenuOptions.length; i++ ) {
    ws.mainMenu.addMenuOption({
        text: mainMenuOptions[i].text,
        id: mainMenuOptions[i].id,
        font: {
            fontSize : ws.fonts.fontStyles.menu.fontSize,
            fontFamily : ws.fonts.fontStyles.menu.fontFamily
        },
        color: '#333',
        imageUrl: mainMenuOptions[i].imageUrl,
        imageSize: 28,
        height: 50,
        width: Ti.UI.FILL,
        left: 5,
        onClick: onClickMainMenuOption
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

// -----------------------------------------
// End Main UI App
// -----------------------------------------
