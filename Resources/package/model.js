// Package
// --------------------------------------------------------------------------------------------
/** 
 * @classDescription        Creates a Model object
 */
ws.Model = (function(){
    
    /* PRIVATE VARIABLES
    /* ------------------------------------------------------------------------------------- */
    var _LAST_CHECK_TIME_KEY = "lastCheckTime"; 
    var _xhr = null;
    var _ridersData = null;    
    /* ------------------------------------------------------------------------------------- */ 
    
    var Model = function(options){
        if( !options )
            options = {};
        this.initialize(options);
    };
        
    /* PUBLIC VARIABLES AND METHODS
    /* ------------------------------------------------------------------------------------- */
    Model.prototype = {
        // Template object
        // ------------------------------------------------------------------------------------
        timeout: 3000,
        
        // Default host
        // ------------------------------------------------------------------------------------
        host: 'http://motogp.welvi.com',  
        
        // Initialize
        // ------------------------------------------------------------------------------------
        initialize: function(options) {
            _xhr = Ti.Network.createHTTPClient({                    
                timeout: this.timeout,
                onerror: function(e){}
            });
            this.newDataCheck();
        },
        
        // Checks for data updates
        // ------------------------------------------------------------------------------------
        newDataCheck: function() {
            var context = this;
            var dataPath = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'data');
            if( !dataPath.exists() )
                dataPath.createDirectory();
            var lastCheckTime = this.getLastCheckTime();
            var currentTime = new Date().getTime();
            Ti.API.info("lastCheckTime: " + lastCheckTime);
            Ti.API.info("currentTime: " + currentTime);
            if( (currentTime - lastCheckTime) > 300000 ) {// 5 minutes
                _xhr.onload = function() {
                    var indexFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'data', 'index.json');
                    if( !indexFile.exists() )
                        indexFile.write(this.responseData);
                    context.index = JSON.parse(indexFile.read().text);
                    context.lastIndex = JSON.parse(this.responseText);
                };
                _xhr.open('GET', this.host + '/data/index.json');
                // if( bcn.BASIC_HTTP_AUTH )
                    // xhr2.setRequestHeader('Authorization','Basic ' + Ti.Utils.base64encode(bcn.USERNAME + ':' + bcn.PASSWORD));
                _xhr.send();
                this.setLastCheckTime(new Date().getTime());
            }
        },
        
        // Set last check time
        // ------------------------------------------------------------------------------------
        setLastCheckTime: function(value) {
            Ti.API.info("Set last check time");
            Ti.App.Properties.setString(_LAST_CHECK_TIME_KEY, String(value));
        },
        
        // Get last check time
        // ------------------------------------------------------------------------------------
        getLastCheckTime: function() {
            Ti.API.info("Get last check time");            
            return Number(Ti.App.Properties.getString(_LAST_CHECK_TIME_KEY, 0));
        },
        
        // Data index
        // ------------------------------------------------------------------------------------
        index: null,
        
        // Last data index
        // ------------------------------------------------------------------------------------
        lastIndex: null,
        
        // Save index to disk
        // ------------------------------------------------------------------------------------
        saveIndex: function(callback) {
            var indexFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'data', 'index.json');
            indexFile.write(JSON.stringify(this.index));
        },
        
        // Get riders data
        // ------------------------------------------------------------------------------------
        getRiders: function(callback) {
            var newDataAvailable = false;
            // Ti.API.info("getRiders()")
            // Ti.API.info("Last index: " + Date.parse(this.lastIndex.ridersLastUpdate));
            // Ti.API.info("Current index: " + Date.parse(this.index.ridersLastUpdate));
            if( this.lastIndex && this.index && Date.parse(this.lastIndex.ridersLastUpdate) > Date.parse(this.index.ridersLastUpdate) ) {
                newDataAvailable = true;
                this.index.ridersLastUpdate = this.lastIndex.ridersLastUpdate;
                // Update index data to disk
                this.saveIndex();
            }
            var jsonRidersFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'data', 'riders.json');
            if( !jsonRidersFile.exists() || newDataAvailable ) {
                _xhr.onload = function() {
                    jsonRidersFile.write(this.responseData);
                    _ridersData = JSON.parse(jsonRidersFile.read().text); 
                    callback(_ridersData);
                };
                _xhr.open('GET', this.host + '/data/riders/riders.json');
                // if( bcn.BASIC_HTTP_AUTH )
                    // xhr2.setRequestHeader('Authorization','Basic ' + Ti.Utils.base64encode(bcn.USERNAME + ':' + bcn.PASSWORD));
                _xhr.send();
            } else {
                if( !_ridersData )
                    _ridersData = JSON.parse(jsonRidersFile.read().text);
                callback(_ridersData);
            }            
        },
        
        // Get rider data
        // ------------------------------------------------------------------------------------
        getRider: function(id) {
            return _ridersData.riders[id];
        }
    };
    
    return Model;
    /* ------------------------------------------------------------------------------------- */ 
})();
