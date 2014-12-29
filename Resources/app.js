/* Include WS Modules */
/* ------------------ */
Ti.include("ws/dependencies.js");

ws.dependencies.include("ui");
ws.dependencies.include("menu");
ws.dependencies.include("animation");
ws.dependencies.include("translations");
/* ------------------ */

/* Include App main package */
/* ------------------------ */
Ti.include("package/main.js");

// Main App Controller
ws.controller = new ws.Controller({
    startAction: 'default',
    onOpen: function(e) {
        // alert("onOpen");
    },    
    onPause: function(e) {
        // alert("onPause");
    },
    onResume: function(e) {
        // alert("onResume");
    },
    onDestroy: function(e) {
        // alert("onDestroy");
    }
});

// Start App
ws.mainWindow.open();
