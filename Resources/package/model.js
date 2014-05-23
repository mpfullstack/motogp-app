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
    var _tracksData = null;  
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
        timeout: 6000,
        
        // Minimum time between index updates
        // ------------------------------------------------------------------------------------
        refreshTime: 1,//30000, // 5 minutes
        
        // Default host
        // ------------------------------------------------------------------------------------
        host: 'http://motogp.welvi.com',  
        
        // Initialize
        // ------------------------------------------------------------------------------------
        initialize: function(options) {
            _xhr = Ti.Network.createHTTPClient({                    
                timeout: this.timeout
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
            if( (currentTime - lastCheckTime) > this.refreshTime ) {
                _xhr.onload = function() {
                    var indexFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'data', 'index.json');
                    if( !indexFile.exists() ) {
                        indexFile.write(this.responseData);
                        context.index = JSON.parse(this.responseText);
                    } else {
                        context.index = JSON.parse(indexFile.read().text);
                    }
                    Ti.API.info("index.json: " + this.responseText);                    
                    context.lastIndex = JSON.parse(this.responseText);
                };
                _xhr.onerror = function(){
                    Ti.API.info("Error getting index.json");
                    var indexFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'data', 'index.json');
                    context.index = JSON.parse(indexFile.read().text);
                    context.lastIndex = context.index;
                }
                _xhr.open('GET', this.host + '/data/index.json');
                // if( bcn.BASIC_HTTP_AUTH )
                    // xhr2.setRequestHeader('Authorization','Basic ' + Ti.Utils.base64encode(bcn.USERNAME + ':' + bcn.PASSWORD));
                _xhr.send();
                this.setLastCheckTime(new Date().getTime());
            } else {
                var indexFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'data', 'index.json');
                context.index = JSON.parse(indexFile.read().text);
                context.lastIndex = context.index;
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
            Ti.API.info("getRiders()")
            if( this.lastIndex && this.index && Date.parse(this.lastIndex.ridersLastUpdate) > Date.parse(this.index.ridersLastUpdate) ) {
                Ti.API.info("Last index: " + Date.parse(this.lastIndex.ridersLastUpdate));
                Ti.API.info("Current index: " + Date.parse(this.index.ridersLastUpdate));
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
        },
        
        // Get tracks data
        // ------------------------------------------------------------------------------------
        getTracks: function(callback) {
            var newDataAvailable = false;
            Ti.API.info("getTracks()")
            if( this.lastIndex && this.index && Date.parse(this.lastIndex.tracksLastUpdate) > Date.parse(this.index.tracksLastUpdate) ) {
                Ti.API.info("Last index: " + Date.parse(this.lastIndex.tracksLastUpdate));
                Ti.API.info("Current index: " + Date.parse(this.index.tracksLastUpdate));
                newDataAvailable = true;
                this.index.tracksLastUpdate = this.lastIndex.tracksLastUpdate;
                // Update index data to disk
                this.saveIndex();
            }
            var jsonTracksFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'data', 'tracks.json');
            if( !jsonTracksFile.exists() || newDataAvailable ) {
                _xhr.onload = function() {
                    jsonTracksFile.write(this.responseData);
                    _tracksData = JSON.parse(jsonTracksFile.read().text); 
                    callback(_tracksData);
                };
                _xhr.open('GET', this.host + '/data/tracks/tracks.json');
                // if( bcn.BASIC_HTTP_AUTH )
                    // xhr2.setRequestHeader('Authorization','Basic ' + Ti.Utils.base64encode(bcn.USERNAME + ':' + bcn.PASSWORD));
                _xhr.send();
            } else {
                if( !_tracksData )
                    _tracksData = JSON.parse(jsonTracksFile.read().text);
                callback(_tracksData);
            }            
        },
    };
    
    return Model;
    /* ------------------------------------------------------------------------------------- */ 
})();
