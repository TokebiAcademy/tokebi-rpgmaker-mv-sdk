# Changelog

All notable changes to the Tokebi Analytics RPG Maker MV SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-08-16

### Added
- Initial release of Tokebi Analytics SDK for RPG Maker MV
- Real-time event tracking with `Tokebi.track()` method
- Automatic session start/end tracking
- Auto-detection of development vs production environment
- Plugin parameter configuration (API Key, Game Name, Tracking Enabled, Debug Mode)
- ES5 compatible JavaScript for maximum RPG Maker MV compatibility
- Automatic player ID generation and persistence via localStorage
- Game registration with Tokebi backend API
- Payload flattening for complex nested objects
- Session end deduplication to prevent multiple events
- Debug mode with comprehensive console logging
- Error handling for network failures and API errors
- Support for all RPG Maker MV deployment targets (Web, Desktop, Mobile)

### Features
- **Core Tracking**: Custom event tracking with flexible payload structure
- **Session Management**: Automatic session lifecycle tracking
- **Environment Detection**: Smart detection based on URL protocol and hostname
- **Player Identity**: Anonymous player ID generation and persistence
- **Game Registration**: Automatic game registration with fallback support
- **Network Resilience**: Robust error handling for offline/connection issues
- **Developer Experience**: Comprehensive debugging and testing tools

### Technical Details
- Uses XMLHttpRequest for maximum compatibility
- ES5 syntax for older JavaScript engines
- Plugin Manager integration for easy configuration
- Automatic timestamp handling by backend
- Clean event payload structure without redundant data
- Multiple session end event listeners with deduplication
