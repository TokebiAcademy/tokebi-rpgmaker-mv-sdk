Tokebi Analytics RPG Maker MV SDK
Real-time game analytics for RPG Maker MV games. Track player behavior, game events, and custom metrics with minimal setup.

🚀 Features

Real-time Event Tracking - Track player actions, level progression, and custom events
Session Analytics - Automatic session start/end tracking with duration calculation
Custom Events - Track any game-specific metrics that matter to your project
Auto-Detection - Automatically detects development vs production environment
Zero Dependencies - Pure JavaScript ES5, works everywhere RPG Maker runs
Privacy-focused - Anonymous player IDs, no personal data collection

📋 Requirements

RPG Maker MV (tested and verified)
Tokebi Analytics account: https://tokebimetrics.com
Your game deployed to web or desktop


📝 Note: For RPG Maker MZ, use our separate MZ SDK (coming soon)

🔧 Installation
Step 1: Download the SDK

Download TokebiSDK.js from Releases
Copy to your RPG Maker MV project's js/plugins/ folder

Step 2: Configure Plugin

Open RPG Maker MV
Go to Tools → Plugin Manager
Enable TokebiSDK
Set your API Key (get it from tokebimetrics.com)
Save your project

Step 3: Test Installation

Playtest your game (F5)
Press F12 to open console
You should see: [Tokebi] SDK initialization started

🎮 Usage
Basic Event Tracking
Track custom events anywhere in your game:
javascript// In RPG Maker Events (Script commands)
Tokebi.track('level_complete', {
    level: 'forest_dungeon',
    score: 1250,
    items_collected: 5
});

Tokebi.track('item_purchased', {
    item: 'magic_sword',
    cost: 500,
    currency: 'gold'
});

Tokebi.track('boss_defeated', {
    boss_name: 'Fire Dragon',
    player_level: 15,
    battle_duration: 180
});
Combat Analytics
javascript// Track battle outcomes
Tokebi.track('battle_end', {
    outcome: 'victory',
    enemy_type: 'goblin',
    exp_gained: 25,
    damage_taken: 45
});

// Track skill usage
Tokebi.track('skill_used', {
    skill_name: 'Fireball',
    mp_cost: 12,
    damage_dealt: 85,
    target_count: 3
});
Player Progression
javascript// Level ups
Tokebi.track('level_up', {
    new_level: 8,
    class: 'mage',
    stats_gained: {
        hp: 15,
        mp: 20,
        attack: 3
    }
});

// Quest completion
Tokebi.track('quest_complete', {
    quest_id: 'find_herbs',
    reward_gold: 100,
    reward_exp: 50,
    completion_time: 300
});
🔧 Configuration
Plugin Parameters
ParameterDescriptionDefaultAPI KeyYour Tokebi Analytics API key(required)Game NameGame title (auto-detected)Project nameEnable TrackingTurn analytics on/offtrueDebug ModeShow console messagestrue
Environment Detection
The SDK automatically detects your environment:

Development: file://, localhost, 127.0.0.1
Production: Real domains like itch.io, kongregate.com

No manual configuration needed!
📊 Built-in Events
These events are tracked automatically:
EventWhen It FiresData Collectedsession_startGame startsPlayer ID, Game IDsession_endGame closes/tab switchesSession duration (calculated)
🧪 Testing & Debugging
Console Output
With Debug Mode enabled, you'll see:
[Tokebi] Player ID: player_1692123456_7834
[Tokebi] ✅ Game registered: game_abc123
[Tokebi] Tracking: level_complete
[Tokebi] ✅ Event sent successfully: level_complete
Verify Events

Open F12 Console during playtest
Run: Tokebi.test()
Should return: "TokebiSDK ES5 is working!"

🌐 Platform Support

PC/Mac (NW.js builds)
Web Browser (HTML5 export)
Mobile (via Cordova/web wrapper)
Steam/itch.io (any web deployment)

🚨 Troubleshooting
"NO VALID API KEY SET" Error

Check Plugin Manager → TokebiSDK → API Key field
Get your key from tokebimetrics.com
Don't use test_key_123 (placeholder value)

Console Shows No Messages

Enable Debug Mode in Plugin Manager
Check F12 Console tab (not Elements)
Ensure plugin is enabled in Plugin Manager

Events Not Sending

Check internet connection
Verify API key is correct
Look for red error messages in console
Ensure trackingEnabled is set to true

📁 Repository Structure
tokebi-rpgmaker-sdk/
├── TokebiSDK.js           # Main SDK file
├── README.md              # This file
├── LICENSE                # MIT License
├── CHANGELOG.md           # Version history

🤝 Contributing
Fork this repository
Create a feature branch: git checkout -b my-feature
Commit changes: git commit -am 'Add feature'
Push to branch: git push origin my-feature
Submit a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
🔗 Links

Dashboard: https://tokebimetrics.com
Documentation: https://www.tokebimetrics.com/documentation-guide

⭐ Support
If this SDK helped your RPG Maker project, please give it a star! ⭐
Found a bug or have a feature request? Open an issue
