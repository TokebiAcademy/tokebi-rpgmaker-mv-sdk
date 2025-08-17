//=============================================================================
// Tokebi Analytics SDK for RPG Maker MV (ES5 Compatible)
//=============================================================================

/*:
 * @target MV
 * @plugindesc [v1.0.0] TokebiSDK
 * @author Tokebi Academy
 * @version 1.0.0
 * @description Real-time game analytics for RPG Maker
 * 
 * @param apiKey
 * @text API Key
 * @desc Your Tokebi Analytics API Key from tokebimetrics.com
 * @type string
 * @default
 * 
 * @param gameName
 * @text Game Name
 * @desc Your game's name (auto-detected if empty)
 * @type string
 * @default
 * 
 * @param trackingEnabled
 * @text Enable Tracking
 * @desc Enable/disable analytics tracking
 * @type boolean
 * @default true
 * 
 * @param debugMode
 * @text Debug Mode
 * @desc Show debug messages in console
 * @type boolean
 * @default true
 */

(function() {
    'use strict';
    
    // Try multiple ways to get parameters
    var parameters = PluginManager.parameters('TokebiSDK') || 
                    PluginManager.parameters('Tokebi Analytics SDK') ||
                    PluginManager.parameters('[v1.0.0] TokebiSDK') || {};
    
    // Get values
    var API_KEY = parameters['apiKey'] || '';
    var GAME_NAME = parameters['gameName'] || ($dataSystem ? $dataSystem.gameTitle : 'RPG Maker Game');
    var TRACKING_ENABLED = parameters['trackingEnabled'] === 'true';
    var DEBUG_MODE = parameters['debugMode'] === 'true';
    var ENDPOINT = 'https://tokebi-api.vercel.app';
    
    // Auto-detect environment - NO developer input needed!
    var ENVIRONMENT = (window.location.protocol === 'file:' || 
                      window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1') ? 'development' : 'production';
    
    if (DEBUG_MODE) {
        console.log('[Tokebi] Environment detected: ' + ENVIRONMENT);
        console.log('[Tokebi] URL: ' + window.location.href);
    }
    
    // STOP if no API key
    if (!API_KEY || API_KEY === '' || API_KEY === 'test_key_123') {
        console.error("🚨 NO VALID API KEY SET!");
        console.error("🚨 Go to Plugin Manager → Tokebi Analytics SDK → Set your real API key!");
        alert("TOKEBI ERROR: No API key set! Check Plugin Manager parameters.");
        return;
    }
    
    // ES5 Constructor function instead of class
    function TokebiSDK() {
        this.apiKey = API_KEY;
        this.gameName = GAME_NAME;
        this.playerId = null;
        this.gameId = 'game_temp_' + Date.now(); // Fallback game ID
        this.isInitialized = false;
        this.sessionEnded = false; // Prevent duplicate session_end
        
        if (!TRACKING_ENABLED) {
            this.log('Tracking disabled');
            return;
        }
        
        if (!this.apiKey) {
            this.log('ERROR: API Key is required. Set it in Plugin Parameters.');
            return;
        }
        
        this.init();
        this.setupSessionTracking();
    }
    
    // Add methods to prototype (ES5 way)
    TokebiSDK.prototype.log = function(message) {
        if (DEBUG_MODE) {
            console.log('[Tokebi] ' + message);
        }
    };
    
    TokebiSDK.prototype.init = function() {
        try {
            // Load or generate player ID
            this.playerId = this.getOrCreatePlayerId();
            this.log('Player ID: ' + this.playerId);
            
            // Register game with API (don't set initialized until this completes)
            this.registerGame();
            this.log('SDK initialization started - waiting for registration...');
            
        } catch (error) {
            this.log('Initialization error: ' + error.message);
        }
    };
    
    TokebiSDK.prototype.getOrCreatePlayerId = function() {
        var storageKey = 'tokebi_player_id';
        var playerId = null;
        
        // Try to load from localStorage
        if (typeof localStorage !== 'undefined') {
            playerId = localStorage.getItem(storageKey);
        }
        
        // Generate new ID if not found
        if (!playerId) {
            var timestamp = Math.floor(Date.now() / 1000);
            var random = Math.floor(Math.random() * 10000);
            playerId = 'player_' + timestamp + '_' + random;
            
            // Save to localStorage
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(storageKey, playerId);
            }
        }
        
        return playerId;
    };
    
    // Main tracking function
    TokebiSDK.prototype.track = function(eventType, payload) {
        if (!TRACKING_ENABLED || !this.isInitialized) {
            this.log('Tracking disabled or not initialized');
            return;
        }
        
        try {
            // Ensure payload exists
            payload = payload || {};
            
            // Flatten complex data
            var flatPayload = this.flattenPayload(payload);
            
            var eventBody = {
                eventType: eventType,
                payload: flatPayload,
                gameId: this.gameId,
                playerId: this.playerId,
                platform: 'rpgmaker-mv',
                environment: ENVIRONMENT
            };
            
            this.log('Tracking: ' + eventType);
            
            // Actually send the HTTP request
            this.sendToAPI(eventBody);
            
        } catch (error) {
            this.log('Tracking error: ' + error.message);
        }
    };
    
    // Flatten nested objects (ES5 way)
    TokebiSDK.prototype.flattenPayload = function(obj, prefix) {
        var flattened = {};
        prefix = prefix || '';
        
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var value = obj[key];
                var newKey = prefix ? prefix + '_' + key : key;
                
                if (Array.isArray(value)) {
                    // Flatten arrays
                    for (var i = 0; i < value.length; i++) {
                        var item = value[i];
                        if (typeof item === 'object' && item !== null) {
                            var nestedFlat = this.flattenPayload(item, newKey + '_' + (i + 1));
                            for (var nestedKey in nestedFlat) {
                                flattened[nestedKey] = nestedFlat[nestedKey];
                            }
                        } else {
                            flattened[newKey + '_' + (i + 1)] = item;
                        }
                    }
                    flattened[newKey + '_count'] = value.length;
                } else if (typeof value === 'object' && value !== null) {
                    // Flatten nested objects
                    var nestedFlat = this.flattenPayload(value, newKey);
                    for (var nestedKey in nestedFlat) {
                        flattened[nestedKey] = nestedFlat[nestedKey];
                    }
                } else {
                    // Simple values
                    flattened[newKey] = value;
                }
            }
        }
        
        return flattened;
    };
    
    // Send data to API
    TokebiSDK.prototype.sendToAPI = function(eventBody) {
        var self = this;
        
        try {
            // Use XMLHttpRequest for better compatibility with RPG Maker MV
            var xhr = new XMLHttpRequest();
            xhr.open('POST', ENDPOINT + '/api/track', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', this.apiKey);
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        self.log('✅ Event sent successfully: ' + eventBody.eventType);
                    } else {
                        self.log('❌ API Error: ' + xhr.status + ' - ' + xhr.statusText);
                    }
                }
            };
            
            xhr.onerror = function() {
                self.log('❌ Network error sending event');
            };
            
            var jsonData = JSON.stringify(eventBody);
            xhr.send(jsonData);
            
        } catch (error) {
            this.log('❌ HTTP request error: ' + error.message);
        }
    };
    
    // Register game with API
    TokebiSDK.prototype.registerGame = function() {
        var self = this;
        
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', ENDPOINT + '/api/games', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', this.apiKey);
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 201) { // Accept both 200 and 201
                        var response = JSON.parse(xhr.responseText);
                        self.gameId = response.game_id;
                        self.isInitialized = true; // Only set after successful registration
                        self.log('✅ Game registered: ' + self.gameId);
                        
                        // NOW send session_start with correct game ID
                        self.track('session_start', {});
                        
                    } else {
                        self.log('❌ Game registration failed: ' + xhr.status);
                        // Use fallback game ID and allow tracking
                        self.gameId = 'game_fallback_' + Date.now();
                        self.isInitialized = true;
                    }
                }
            };
            
            xhr.onerror = function() {
                self.log('❌ Network error during registration');
                self.gameId = 'game_fallback_' + Date.now();
                self.isInitialized = true; // Allow tracking with fallback ID
            };
            
            var registrationData = JSON.stringify({
                gameName: this.gameName,
                platform: 'rpgmaker-mv',
                rpgmakerVersion: 'MV',
                playerCount: 1
            });
            
            xhr.send(registrationData);
            
        } catch (error) {
            this.log('❌ Registration error: ' + error.message);
            this.gameId = 'game_fallback_' + Date.now();
        }
    };
    
    // Test method
    TokebiSDK.prototype.test = function() {
        return "TokebiSDK ES5 is working!";
    };
    
    // Setup session tracking (start/end)
    TokebiSDK.prototype.setupSessionTracking = function() {
        var self = this;
        
        // Track session end when page/game closes
        window.addEventListener('beforeunload', function() {
            self.trackSessionEnd();
        });
        
        // Track session end when page becomes hidden (mobile/tab switching)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                self.trackSessionEnd();
            }
        });
        
        // Fallback for older browsers
        window.addEventListener('unload', function() {
            self.trackSessionEnd();
        });
    };
    
    // Track session end with duration
    TokebiSDK.prototype.trackSessionEnd = function() {
        if (!this.isInitialized || this.sessionEnded) {
            return; // Already sent or not ready
        }
        
        this.sessionEnded = true; // Mark as sent to prevent duplicates
        this.track('session_end', {});
        this.log('Session ended');
    };
    
    // Create instance and assign to global
    var tokebiInstance = new TokebiSDK();
    window.Tokebi = tokebiInstance;
    
})();
