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
ws.controller = new ws.Controller();
//ws.controller.action("default");

// Start App
ws.mainWindow.open();
