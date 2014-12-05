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
    var _classificationData = {};
    /* ------------------------------------------------------------------------------------- */ 
    
    var Model = function(options){
        if( !options )
            options = {};
        if( options.onDataReady )
            this.onDataReady = options.onDataReady;
        this.initialize(options);
    };
        
    /* PUBLIC VARIABLES AND METHODS
    /* ------------------------------------------------------------------------------------- */
    Model.prototype = {
        // Template object
        // ------------------------------------------------------------------------------------
        timeout: 6000,
        
        // Minimum time between index updates (milliseconds)
        // ------------------------------------------------------------------------------------
        refreshTime: 1,//30000, // 5 minutes
        
        // Callback function to call when data model is ready on start up
        // ------------------------------------------------------------------------------------
        onDataReady: null,
        
        // Default host
        // ------------------------------------------------------------------------------------
        host: 'http://clients.welvisolutions.com', //'http://motogp.welvi.com',  
        
        // Initialize
        // ------------------------------------------------------------------------------------
        initialize: function(options) {
            _xhr = Ti.Network.createHTTPClient({                    
                timeout: this.timeout
            });
            this.newDataCheck();
        },
        
        // Checks for data updates.
        // If more than refreshTime seconds since lastTime, then get new index 
        // ------------------------------------------------------------------------------------
        newDataCheck: function() {
            var context = this;
            var dataPath = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'data');
            if( !dataPath.exists() )
                dataPath.createDirectory();
            var lastCheckTime = this.getLastCheckTime();
            var currentTime = new Date().getTime();
            if( (currentTime - lastCheckTime) > this.refreshTime ) {                
                _xhr.onload = function() {
                    var indexFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'data', 'index.json');
                    if( !indexFile.exists() ) {
                        indexFile.write(this.responseData);
                        context.index = JSON.parse(this.responseText);
                    } else {
                        context.index = JSON.parse(indexFile.read().text);                         
                    }
                    context.lastIndex = JSON.parse(this.responseText);
                    // Ti.API.info("index: " + context.index.tracksLastUpdate);
                    // Ti.API.info("lastIndex: " + context.lastIndex.tracksLastUpdate);
                    if( context.onDataReady )
                        context.onDataReady();
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
                if( context.onDataReady )
                    context.onDataReady();
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
            Ti.API.info("getRiders()");
            if( this.lastIndex && this.index && Date.parse(this.lastIndex.ridersLastUpdate) > Date.parse(this.index.ridersLastUpdate) ) {
                // Ti.API.info("Last index: " + Date.parse(this.lastIndex.ridersLastUpdate));
                // Ti.API.info("Current index: " + Date.parse(this.index.ridersLastUpdate));
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
            
            // Function to sort tracks by date ascending being first 
            // the ones pending and after the ones already done.
            var sortTracks = function(tracksData) {
                Ti.API.info("sortTracks");
                var trackIds = tracksData.ids;
                var doneTrackIds = [];
                var pendingTrackIds = [];
                for( var i=0; i<trackIds.length; i++ ) {
                    var track = tracksData.tracks[trackIds[i]];
                    track = formatTimeTableData(track);
                    if( new Date() > ws.utils.newDateAsUTC(new Date(Date.parse(track.startDate))) ) {
                        doneTrackIds.push(trackIds[i]);
                    } else {
                        pendingTrackIds.push(trackIds[i]);
                    }
                }
                tracksData.ids = pendingTrackIds.concat(doneTrackIds);
                return tracksData;
            }      
            
            // Function to format timetable data
            var formatTimeTableData = function(trackData) {
                var data = {};
                var key;
                for( var language in trackData.timetable ) {
                    data[language] = {};
                    var timetable = String(trackData.timetable[language]);
                    var rows = timetable.split("\n");
                    for( var i=0; i<rows.length; i++ ) {
                        var row = rows[i];
                        var columns = row.split("-");
                        if( columns.length == 1 ) {
                            key = columns[0];
                            data[language][key] = [];
                        } else {
                            data[language][key].push({
                                "session": columns[0],
                                "time":    columns[1]
                            });  
                        }             
                    }
                    trackData.timetable[language] = data[language];
                }
                return trackData;
            }
            
            Ti.API.info("getTracks()");
            if( this.lastIndex && this.index && Date.parse(this.lastIndex.tracksLastUpdate) > Date.parse(this.index.tracksLastUpdate) ) {
                // Ti.API.info("Last index: " + Date.parse(this.lastIndex.tracksLastUpdate));
                // Ti.API.info("Current index: " + Date.parse(this.index.tracksLastUpdate));
                newDataAvailable = true;
                this.index.tracksLastUpdate = this.lastIndex.tracksLastUpdate;
                // Update index data to disk
                this.saveIndex();
            }
            var jsonTracksFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'data', 'tracks.json');
            if( !jsonTracksFile.exists() || newDataAvailable ) {
                _xhr.onload = function() {
                    jsonTracksFile.write(this.responseData);
                    _tracksData = sortTracks(JSON.parse(jsonTracksFile.read().text));
                    callback(_tracksData);
                };
                _xhr.open('GET', this.host + '/data/tracks/tracks.json');
                // if( bcn.BASIC_HTTP_AUTH )
                    // xhr2.setRequestHeader('Authorization','Basic ' + Ti.Utils.base64encode(bcn.USERNAME + ':' + bcn.PASSWORD));
                _xhr.send();
            } else {
                if( !_tracksData )
                    _tracksData = sortTracks(JSON.parse(jsonTracksFile.read().text));
                callback(_tracksData);
            }                    
        },
        
        // Get track data
        // ------------------------------------------------------------------------------------
        getTrack: function(id) {
            return _tracksData.tracks[id];
        },
        
        // Get next track
        // ------------------------------------------------------------------------------------
        getNextTrack: function(callback) {
            Ti.API.info("getNextTrack()");
            var context = this;
            var onGetTracksReady = function(tracksData){
                var id = tracksData.ids[0];
                callback(context.getTrack(id));
            }
            this.getTracks(onGetTracksReady);            
        },
        
        // Get classification data
        // ------------------------------------------------------------------------------------
        getClassification: function(callback, year, category) {
            var newDataAvailable = false;
            Ti.API.info("getClassification()");
            // Ti.API.info(this.index.classificationsLastUpdate[year][category]);
            // Ti.API.info(this.lastIndex.classificationsLastUpdate[year][category]);
            // Ti.API.info(
                // Date.parse(this.lastIndex.classificationsLastUpdate[year][category]) > Date.parse(this.index.classificationsLastUpdate[year][category])
            // );
            if( 
                this.lastIndex 
                && 
                this.index 
                &&
                this.lastIndex.classificationsLastUpdate && this.index.classificationsLastUpdate
                &&
                this.lastIndex.classificationsLastUpdate[year] && this.index.classificationsLastUpdate[year]
                &&
                this.lastIndex.classificationsLastUpdate[year][category] && this.index.classificationsLastUpdate[year][category]
                &&
                Date.parse(this.lastIndex.classificationsLastUpdate[year][category]) > Date.parse(this.index.classificationsLastUpdate[year][category]) 
            ){
                // Ti.API.info("bingo!!!");
                // Ti.API.info(this.index.classificationsLastUpdate[year][category]);
                // Ti.API.info(this.lastIndex.classificationsLastUpdate[year][category]);
                // Ti.API.info("Last index: " + Date.parse(this.index.classificationsLastUpdate[year][category]));
                // Ti.API.info("Current index: " + Date.parse(this.lastIndex.classificationsLastUpdate[year][category]));
                newDataAvailable = true;
                this.index.classificationsLastUpdate[year][category] = this.lastIndex.classificationsLastUpdate[year][category];
                // Update index data to disk
                this.saveIndex();
            }
            var filename = String(year)+'_'+String(category)+'.json';
            var jsonClassificationFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,
                'data', filename);
            if( !jsonClassificationFile.exists() || newDataAvailable ) {
                _xhr.onload = function() {
                    // Ti.API.info("Getting data json GET");
                    jsonClassificationFile.write(this.responseText);
                    _classificationData[year] = {};
                    // Ti.API.info("data : " + jsonClassificationFile.read().text);
                    _classificationData[year][category] = JSON.parse(jsonClassificationFile.read().text).classification; 
                    callback(_classificationData[year][category]);
                };
                _xhr.open('GET', this.host + '/data/classification/' + filename);
                // if( bcn.BASIC_HTTP_AUTH )
                    // xhr2.setRequestHeader('Authorization','Basic ' + Ti.Utils.base64encode(bcn.USERNAME + ':' + bcn.PASSWORD));
                _xhr.send();
            } else {
                if( !_classificationData[year] ) {
                    _classificationData[year] = {};
                    _classificationData[year][category] = JSON.parse(jsonClassificationFile.read().text).classification;
                } else if( !_classificationData[year][category] ) {
                    _classificationData[year][category] = JSON.parse(jsonClassificationFile.read().text).classification;
                }
                // Ti.API.info("file "+ _classificationData[year][category]);
                callback(_classificationData[year][category]);
            }            
        }
    };
    
    return Model;
    /* ------------------------------------------------------------------------------------- */ 
})();
