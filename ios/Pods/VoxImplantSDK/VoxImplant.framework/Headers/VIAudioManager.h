/*
 *  Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import "VIAudioDevice.h"
#import "VIError.h"

/**
 *
 */
@protocol VIAudioManagerDelegate <NSObject>

/**
 * Event is triggered when active audio device or audio device that will be used for a further call is changed.
 *
 * @param audioDevice Activated audio device.
 */
- (void)audioDeviceChanged:(VIAudioDevice *)audioDevice;

/**
 * Event is triggered when audio device can not be selected due to it is not available at this moment.
 *
 * @param audioDevice Failed audio device.
 */
- (void)audioDeviceUnavailable:(VIAudioDevice *)audioDevice;

/**
 * Event is triggered when new audio device connected / old audio device disconnected.
 *
 * @param availableAudioDevices List of newly available audio devices.
 */
- (void)audioDevicesListChanged:(NSSet<VIAudioDevice *> *)availableAudioDevices;

@end

/**
 * Interface that may be used to manage audio devices on iOS device.
 */
@interface VIAudioManager : NSObject

/**
 * Direct initialization of this object can produce undesirable consequences.
 */
- (instancetype)init NS_UNAVAILABLE;

/**
 * Obtain audio manager instance.
 *
 * @return Audio manager instance.
 */
+ (instancetype)sharedAudioManager;

/**
 * Enable or disable loudspeaker.
 */
@property(nonatomic,assign) BOOL useLoudSpeaker DEPRECATED_MSG_ATTRIBUTE("Use <[VIAudioManager selectAudioDevice:]>");

/**
 * A delegate to monitor audio session route changes.
 */
@property (nonatomic, weak) id<VIAudioManagerDelegate> delegate;

/**
 * Changes selection of the current active audio device.
 *
 * There are two cases:
 *
 * 1. Before a call. The method doesn't activate an audio device, it just selects (i.e. points to) the audio device that will be activated.
 *
 * 2. During a call. If the selected audio device is available, the method activates this audio device.
 *
 * Please note that active audio device can be later changed if new device is connected.
 * In this case <[VIAudioManagerDelegate audioDeviceChanged:]> will be triggered to notify about new active device.
 *
 * If the application uses CallKit, you should take into consideration:
 *
 * * In case if Bluetooth headset is connected, audio routing depends on where a call is answered (from bluetooth headset or from phone screen).
 *   Bluetooth headset will be activated only in case if a call is answered via Bluetooth headset controls. In other case the audio will be played via Receiver.
 *
 * * Audio is always routed to Bluetooth headset only in case if user selects "Bluetooth headset" as Call Audio Routing in the phone preferences.
 *
 * * In case if audio device is selected before CallKit activates the audio session, it is required to reselect this audio device after [[CXProviderDelegate provider:didActivateAudioSession:]](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1833281-provider?language=objc) is called.
 *
 * Otherwise audio routing may be reset to default.
 *
 * @param audioDevice Preferred audio device to use.
 */
- (void)selectAudioDevice:(VIAudioDevice *)audioDevice;

/**
 * Returns active audio device during the call or audio device that will be used for a call if there is no calls at this moment.
 *
 * Please note that active audio device can be later changed if new device is connected.
 * In this case <[VIAudioManagerDelegate audioDeviceChanged:]> will be triggered to notify about new active device.
 *
 * @return Currently active audio device.
 */
- (VIAudioDevice *)currentAudioDevice;

/**
 * Returns the list of available audio devices.
 *
 * @return List of currently available audio devices.
 */
- (NSSet<VIAudioDevice *> *)availableAudioDevices;

@end

@interface VIAudioManager (CallKit)
/**
 * Required for the correct CallKit integration only. Otherwise don't use this method.
 *
 * Initializes [AVAudioSession](https://developer.apple.com/documentation/avfoundation/avaudiosession?language=objc) for use with CallKit integration.
 *
 * Should be called in [[CXProviderDelegate provider:performStartCallAction:]](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1648260-provider?language=objc)
 * and [[CXProviderDelegate provider:performAnswerCallAction:]](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1648270-provider?language=objc).
 *
 * @param error Error during configuration steps.
 */
- (void)callKitConfigureAudioSession:(NSError **)error;

/**
 * Required for the correct CallKit integration only. Otherwise don't use this method.
 *
 * Restores default [AVAudioSession](https://developer.apple.com/documentation/avfoundation/avaudiosession?language=objc) initialization routines, MUST be called if CallKit becomes disabled.
 */
- (void)callKitReleaseAudioSession;

/**
 * Required for the correct CallKit integration only. Otherwise don't use this method.
 *
 * Starts [AVAudioSession](https://developer.apple.com/documentation/avfoundation/avaudiosession?language=objc).
 *
 * Should be called in [[CXProviderDelegate provider:didActivateAudioSession:]](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1833281-provider?language=objc)
 * and [[CXProviderDelegate provider:performSetHeldCallAction:]](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1648256-provider?language=objc).
 */
- (void)callKitStartAudio;

/**
 * Required for the correct CallKit integration only. Otherwise don't use this method.
 *
 * Stops [AVAudioSession](https://developer.apple.com/documentation/avfoundation/avaudiosession?language=objc).
 *
 * Should be called in [[CXProviderDelegate provider:performEndCallAction:]](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1648264-provider?language=objc)
 * and [[CXProviderDelegate provider:performSetHeldCallAction:]](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1648256-provider?language=objc).
 */
- (void)callKitStopAudio;

@end
