# Offline PWA Testing Guide

This guide helps you manually test that the offline PWA performs identically to the online browser version.

## Prerequisites

1. Install the PWA on your device (iPhone, Android, or desktop)
2. Have the app open in both browser and PWA modes for comparison
3. Ensure you have a way to toggle airplane mode or disable network

## Basic Offline Testing

### 1. Installation and Setup

**Test Steps:**

1. Open the app in your browser
2. Install the PWA using the download button
3. Launch the PWA from your home screen/app launcher
4. Set up a game with player names in both browser and PWA

**Expected Results:**

- PWA should launch in standalone mode (no browser UI)
- Game setup should work identically in both versions
- Player names should be preserved in both versions

### 2. Core Gameplay Testing

**Test Steps:**

1. Start a game in both browser and PWA
2. Enter bids for all players in both versions
3. Enter actuals for all players in both versions
4. Compare the calculated scores

**Expected Results:**

- Bid entry should work identically
- Actual entry should work identically
- Score calculations should be identical
- Round progression should work identically

### 3. Data Persistence Testing

**Test Steps:**

1. Enter some game data in the PWA
2. Close the PWA completely
3. Reopen the PWA
4. Verify the data is still there

**Expected Results:**

- All entered data should persist
- Game state should be preserved
- No data loss should occur

## Advanced Offline Testing

### 4. Network Transition Testing

**Test Steps:**

1. Start with both browser and PWA online
2. Enter some data in both
3. Enable airplane mode (or disconnect network)
4. Continue using both versions
5. Reconnect to network
6. Continue using both versions

**Expected Results:**

- Both versions should continue working offline
- Data should be preserved during transitions
- No errors should occur during network changes
- Both versions should remain in sync

### 5. Performance Comparison

**Test Steps:**

1. Time how long it takes to load the browser version
2. Time how long it takes to load the PWA version
3. Test interaction responsiveness in both versions
4. Test navigation speed in both versions

**Expected Results:**

- PWA should load as fast or faster than browser
- Interactions should be equally responsive
- Navigation should be equally smooth

### 6. Feature Parity Testing

**Test Steps:**
Test each feature in both browser and PWA:

- [ ] Dealer selection
- [ ] Bid entry and validation
- [ ] Actual entry and validation
- [ ] Score calculation
- [ ] Round navigation
- [ ] Round editing
- [ ] Settings changes
- [ ] Modal dialogs
- [ ] Form validation
- [ ] Error handling

**Expected Results:**

- All features should work identically
- UI should look identical
- Behavior should be identical
- Error messages should be identical

## Edge Case Testing

### 7. Storage Testing

**Test Steps:**

1. Play many rounds to accumulate data
2. Check if the app handles large amounts of data
3. Test on devices with limited storage

**Expected Results:**

- App should handle large datasets gracefully
- No performance degradation with lots of data
- Clear error messages if storage is full

### 8. Long Session Testing

**Test Steps:**

1. Use the PWA for an extended period (30+ minutes)
2. Play multiple games
3. Navigate between different rounds frequently

**Expected Results:**

- App should remain stable
- No memory leaks
- Performance should remain consistent
- Data integrity should be maintained

### 9. Concurrent Usage Testing

**Test Steps:**

1. Open the app in multiple browser tabs
2. Open the PWA
3. Make changes in different instances
4. Check for data consistency

**Expected Results:**

- Multiple instances should work correctly
- Data should be consistent across instances
- No conflicts should occur

## Device-Specific Testing

### iOS Testing

**Test Steps:**

1. Test on iPhone Safari
2. Test on iPhone Chrome
3. Test on iPhone Brave
4. Test on iPad

**Key Areas:**

- Touch interactions
- Screen size adaptation
- iOS-specific behaviors
- Safari-specific features

### Android Testing

**Test Steps:**

1. Test on Android Chrome
2. Test on Android Firefox
3. Test on Samsung Browser
4. Test on Android Brave

**Key Areas:**

- Touch interactions
- Android-specific behaviors
- Different screen densities
- Hardware back button

### Desktop Testing

**Test Steps:**

1. Test on Chrome desktop
2. Test on Firefox desktop
3. Test on Edge desktop
4. Test on Safari desktop

**Key Areas:**

- Keyboard interactions
- Mouse interactions
- Window resizing
- Multiple monitor setups

## Troubleshooting

### Common Issues

**PWA not loading offline:**

- Check if service worker is registered
- Clear browser cache and try again
- Check browser console for errors

**Data not persisting:**

- Check if localStorage is available
- Check for storage quota exceeded errors
- Verify data is being saved correctly

**Performance issues:**

- Check device resources
- Clear unnecessary data
- Restart the app

### Debug Information

When reporting issues, include:

- Device type and model
- Browser and version
- Operating system and version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)
- Network conditions

## Success Criteria

The offline PWA is working correctly when:

1. **Functionality Parity**: All features work identically to the browser version
2. **Performance Parity**: Performance is comparable to the browser version
3. **Data Integrity**: No data loss occurs during offline usage
4. **Network Resilience**: App handles network transitions gracefully
5. **User Experience**: User experience is seamless and intuitive

## Reporting Results

After completing the tests, document:

- [ ] All tests passed
- [ ] Any issues found
- [ ] Performance observations
- [ ] Device-specific behaviors
- [ ] Recommendations for improvements

This ensures the offline PWA provides the same high-quality experience as the online browser version.
