/*
 *  Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <AVFoundation/AVFoundation.h>

/**
 * Enum of supported video resize modes
 */
typedef __attribute__((deprecated("Use <VIVideoResizeMode> instead."))) NS_ENUM(NSInteger, VoxImplantVideoResizeMode) {
    /** Clip video to fill the whole container */
            VI_VIDEO_RESIZE_MODE_CLIP,
    /** Shrink video to fit in container */
            VI_VIDEO_RESIZE_MODE_FIT
};

/**
 * Enum of log level
 */
typedef __attribute__((deprecated("Use <VILogLevel> instead."))) NS_ENUM(NSInteger, VoxImplantLogLevel) {
    /** Log verbosity level, to include only error messages. */
            ERROR_LOG_LEVEL,
    /** Default log verbosity level, to include informational messages. */
            INFO_LOG_LEVEL,
    /** Log verbosity level to include debug messages */
            DEBUG_LOG_LEVEL,
    /** Log verbosity level to include trace messages */
            TRACE_LOG_LEVEL
};

@protocol VoxImplantDelegate;

/**
 * Main Voximplant SDK class. Should not be instantiated directly, use <[VoxImplant getInstance]> instead.
 */
DEPRECATED_MSG_ATTRIBUTE("Use <VIClient>, <VICall> instead.")
@interface VoxImplant : NSObject

/**
 * Set delegate object for SDK
 */
@property(nonatomic, weak) id <VoxImplantDelegate> voxDelegate DEPRECATED_MSG_ATTRIBUTE("Use <VIClientSessionDelegate> delegate to handle connection to VoxImplant Cloud events, <VICallDelegate> delegate to handle call events and <VIClientCallManagerDelegate> delegate to handle incoming calls.");

/**
 * Returns current delegate
 *
 * @return Previously set delegate
 */
- (id <VoxImplantDelegate>)getVoxDelegate DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient sessionDelegate]> to get connection delegate, <[VIClient callManagerDelegate]> to get incoming call delegate instead.");

/**
 * Sets a verbosity level for log messages. Note that this method must be called before creating SDK object instance.
 *
 * @param logLevel Log verbosity level
 */
+ (void)setLogLevel:(enum VoxImplantLogLevel)logLevel DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient setLogLevel:]> instead.");

/**
 * Enables save logs to file. Log files located at: Library/Caches/Logs. Note that this method must be called before creating SDK object instance.
 */
+ (void)saveLogToFileEnable DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient writeLogsToFile]> or <[VIClient writeLogsToFileLogger:]> instead.");

/**
 * Returns single SDK object instance
 *
 * @return Voximplant SDK object instance.
 */
+ (VoxImplant *)getInstance DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient initWithDelegateQueue:]> instead.");

/**
 * Returns single SDK object instance
 *
 * You need to use this only if you are going to send push notifications across several iOS apps using a single Voximplant application.
 *
 * @param bundleId Application bundle id
 * @return Voximplant SDK object instance.
 */
+ (VoxImplant *)getInstanceWithBundleId:(NSString *)bundleId DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient initWithDelegateQueue:bundleId:]> instead.");

/**
 * Connect to Voximplant cloud
 */
- (void)connect DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient connect]> instead.");

/**
 * Connect to Voximplant cloud
 *
 * @param connectivityCheck Checks whether UDP traffic will flow correctly between device and Voximplant cloud. This check reduces connection speed.
 */
- (void)connect:(BOOL)connectivityCheck DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient connectWithConnectivityCheck:gateways:]> instead.");

/**
 * Disable TLS encryption for signalling connection. Media data will be encrypted anyway
 */
- (void)disableTLS DEPRECATED_MSG_ATTRIBUTE("No longer available.");

/**
 * Closes connection with media server
 */
- (void)closeConnection DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient disconnect]> instead.");

/**
 * Login to Voximplant using specified username and password
 *
 * @param user     Username combined with an application name, e.g. __testuser@testapp.testaccount.voximplant.com__
 * @param password Password in plain text
 */
- (void)loginWithUsername:(NSString *)user andPassword:(NSString *)password DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient loginWithUser:password:success:failure:]> instead.");

/**
 * Perform login using one time key that was generated before
 *
 * @param user Full user name, including app and account name, like _someuser@someapp.youraccount.voximplant.com_
 * @param hash Hash that was generated using following formula:
 *             ```objectivec
 *             MD5(oneTimeKey+"|"+MD5(user+":voximplant.com:"+password))
 *             ```
 *
 * Please note that here user is just a user name, without app name,
 * account name or anything else after "@". So if you pass _myuser@myapp.myacc.voximplant.com_ as a *username*,
 * you should only use _myuser_ while computing this hash.
 */
- (void)loginWithUsername:(NSString *)user andOneTimeKey:(NSString *)hash DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient loginWithUser:oneTimeKey:success:failure:]> instead.");

/**
 * Login to Voximplant using specified username and password
 *
 * @param user  Username combined with an application name, e.g.  __testuser@testapp.testaccount.voximplant.com__
 * @param token Access token, received in callback: <[VoxImplantDelegate onLoginSuccessfulWithDisplayName:andAuthParams:]>
 */
- (void)loginWithUsername:(NSString *)user andToken:(NSString *)token DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient loginWithUser:token:success:failure:]> instead.");

/**
 * Perform refresh of login tokens required for login using access token
 *
 * @param user  Username combined with an application name, e.g. __testuser@testapp.testaccount.voximplant.com__
 * @param token Refresh token
 */
- (void)refreshTokenWithUsername:(NSString *)user andToken:(NSString *)token DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient refreshTokenWithUser:token:result:]> instead.");

/**
 * Generates one time login key to be used for automated login process.
 *
 * For additional details see:
 *  * [Information about automated login on Voximplant website](http://voximplant.com/docs/quickstart/24/automated-login/)
 *  * <[VoxImplant loginWithUsername:andOneTimeKey:]>
 *
 * @param user Full user name, including app and account name, like _someuser@someapp.youraccount.voximplant.com_
 */
- (void)requestOneTimeKeyWithUsername:(NSString *)user DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient requestOneTimeKeyWithUser:result:]> instead.");

/**
 * Create new call instance. Call must be then started using <[VoxImplant startCall:withHeaders:]> method.
 *
 * @param to         SIP URI, username or phone number to make call to. Actual routing is then performed by VoxEngine scenario
 * @param video      Enable video support in call
 * @param customData Custom data passed with call. Will be available in VoxEngine scenario
 * @return           String representation of the call id
 */
- (NSString *)createCall:(NSString *)to withVideo:(BOOL)video andCustomData:(NSString *)customData DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient call:settings:]> instead.");

/**
 * Send start call request.
 *
 * @param callId  id of previously created call
 * @param headers Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK
 * @return        YES in case of success, NO otherwise (f.ex. if call with specified id is not found)
 */
- (BOOL)startCall:(NSString *)callId withHeaders:(NSDictionary *)headers DEPRECATED_MSG_ATTRIBUTE("Use <[VICall start]> instead.");

/**
 * Attach audio and video to specified call
 *
 * @param callId id of previously created call
 * @return       YES in case of success, NO otherwise (f.ex. if call with specified id is not found)
 */
- (BOOL)attachAudioTo:(NSString *)callId DEPRECATED_MSG_ATTRIBUTE("No longer available.");

/**
 * Sends DTMF digit in specified call.
 *
 * @param callId id of previously created call
 * @param digit  Digit can be 0-9 for 0-9, 10 for * and 11 for #
 */
- (void)sendDTMF:(NSString *)callId digit:(int)digit DEPRECATED_MSG_ATTRIBUTE("Use <[VICall sendDTMF:]> instead.");

/**
 * Terminates specified call. Call must be either established, or outgoing progressing
 *
 * @param callId  id of previously created call
 * @param headers Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK
 * @return        YES in case of success, NO otherwise (f.ex. if call with specified id is not found)
 */
- (BOOL)disconnectCall:(NSString *)callId withHeaders:(NSDictionary *)headers DEPRECATED_MSG_ATTRIBUTE("Use <[VICall hangupWithHeaders:]> instead.");

/**
 * Rejects incoming alerting call
 *
 * @param callId  id of previously created call
 * @param headers Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK
 */
- (void)declineCall:(NSString *)callId withHeaders:(NSDictionary *)headers DEPRECATED_MSG_ATTRIBUTE("Use <[VICall rejectWithMode:headers:]> instead.");

/**
 * Answers incoming alerting call
 *
 * @param callId     id of previously created call
 * @param customData Optional custom data passed with call. Will be available in VoxEngine scenario
 * @param headers    Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK
 */
- (void)answerCall:(NSString *)callId withCustomData:(NSString *)customData headers:(NSDictionary *)headers DEPRECATED_MSG_ATTRIBUTE("Use <[VICall answerWithSettings:]> instead.");

/**
 * Sends instant message within established call
 *
 * @param callId  id of previously created call
 * @param text    Message text
 */
- (void)sendMessage:(NSString *)callId withText:(NSString *)text DEPRECATED_MSG_ATTRIBUTE("Use <[VICall sendMessage:headers:]> instead.");

/**
 * Sends info within established call
 *
 * @param callId   id of previously created call
 * @param mimeType MIME type of info
 * @param content  Custom string data
 * @param headers  Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK
 */
- (void)sendInfo:(NSString *)callId withType:(NSString *)mimeType content:(NSString *)content andHeaders:(NSDictionary *)headers DEPRECATED_MSG_ATTRIBUTE("Use <[VICall sendInfo:mimeType:headers:]> instead.");

/**
 * Get call duration for established call
 *
 * @param callId id of previously created call
 * @return       Call duration. 0 if call already disconnected.
 */
- (NSTimeInterval)getCallDuration:(NSString *)callId DEPRECATED_MSG_ATTRIBUTE("Use <[VICall duration]> instead.");

/**
 * Mute or unmute microphone. This is reset after audio interruption
 *
 * @param b Enable/disable flag
 */
- (void)setMute:(BOOL)b DEPRECATED_MSG_ATTRIBUTE("Use <[VICall sendAudio]> instead.");

/**
 * Enable/disable loudspeaker (doesn't make sence for iPad, since it has only loudspeaker)
 *
 * @param b Enable/disable flag
 */
- (BOOL)setUseLoudspeaker:(BOOL)b DEPRECATED_MSG_ATTRIBUTE("Use <[VIAudioManager selectAudioDevice:]> instead.");

/**
 * Set video display mode. Applies to both incoming and outgoing stream
 *
 * @param mode Resize mode
 */
- (void)setVideoResizeMode:(enum VoxImplantVideoResizeMode)mode DEPRECATED_MSG_ATTRIBUTE("Use <[VIVideoRendererView resizeMode]> instead.");

/**
 * Get video display mode. Applies to both incoming and outgoing streams
 *
 * @return Resize mode
 */
- (enum VoxImplantVideoResizeMode)getVideoResizeMode DEPRECATED_MSG_ATTRIBUTE("Use <[VIVideoRendererView resizeMode]> instead.");

/**
 * Stop/start sending video during the call
 *
 * @param doSend Specify if video should be sent
 */
- (void)sendVideo:(BOOL)doSend DEPRECATED_MSG_ATTRIBUTE("Use <[VICall setSendVideo:completion:]> instead.");

/**
 * Set container for local video preview
 *
 * @param view UIView
 */
- (void)setLocalPreview:(UIView *)view DEPRECATED_MSG_ATTRIBUTE("Use <[VIVideoStream addRenderer:]> instead.");

/**
 * Set container for remote video display
 *
 * @param view UIView
 */
- (void)setRemoteView:(UIView *)view DEPRECATED_MSG_ATTRIBUTE("Use <[VIVideoStream addRenderer:]> instead.");

/**
 * Set container for remote video display for call
 *
 * @param view   UIView
 * @param callId id of the call
 */
- (void)setRemoteView:(UIView *)view forCall:(NSString *)callId DEPRECATED_MSG_ATTRIBUTE("Use <[VIVideoStream addRenderer:]> instead.");

/**
 * Set resolution of video being sent to remote participant
 *
 * @param width  Camera resolution width
 * @param height Camera resolution height
 */
- (void)setResolution:(int)width andHeight:(int)height DEPRECATED_MSG_ATTRIBUTE("Use <[VICameraManager changeCaptureFormat:]> instead.");

/**
 * Connect to particular Voximplant media gateway
 *
 * @param host Server name of particular media gateway for connection
 */
- (void)connectTo:(NSString *)host DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient connectWithConnectivityCheck:gateways:]> instead.");

/**
 * Check if device has front facing camera
 *
 * @return  YES if device has front facing camera, NO otherwise
 */
- (BOOL)hasFrontFacingCamera DEPRECATED_MSG_ATTRIBUTE("No longer available.");

/**
 * Switch to front/back camera
 *
 * @param position Capture device position
 * @return         YES in case of success, NO otherwise
 */
- (BOOL)switchToCameraWithPosition:(AVCaptureDevicePosition)position DEPRECATED_MSG_ATTRIBUTE("Use <[VICameraManager useBackCamera]>");

/**
 * Hold/unhold the call
 *
 * @param hold   YES if the call should be put on hold, NO otherwise
 * @param callId The call id
 */
- (void)setHold:(BOOL)hold forCall:(NSString *)callId DEPRECATED_MSG_ATTRIBUTE("Use <[VICall setHold:completion:]>");

@end

@interface VoxImplant (PushNotifications)

/**
 * Register Apple Push Notifications token,
 * after calling this function, application will receive push notifications from Voximplant Server.
 *
 * @param token The APNS token which comes from [[PKPushRegistryDelegate pushRegistry:didUpdatePushCredentials:forType:]](https://developer.apple.com/documentation/pushkit/pkpushregistrydelegate/1614470-pushregistry?language=objc)
 */
- (void)registerPushNotificationsToken:(NSData *)token DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient registerPushNotificationsToken:imToken:]> instead.");

/**
 * Unregister Apple Push Notifications token,
 * after calling this function, application stops receive push notifications from Voximplant Server.
 *
 * @param token The APNS token which comes from [[PKPushRegistryDelegate pushRegistry:didUpdatePushCredentials:forType:]](https://developer.apple.com/documentation/pushkit/pkpushregistrydelegate/1614470-pushregistry?language=objc)
 */
- (void)unregisterPushNotificationsToken:(NSData *)token DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient unregisterPushNotificationsToken:imToken:]> instead.");

/**
 * Handle incoming push notification
 *
 * @param  notification The incomming notification which comes from [[PKPushRegistryDelegate pushRegistry:didReceiveIncomingPushWithPayload:forType:withCompletionHandler:]](https://developer.apple.com/documentation/pushkit/pkpushregistrydelegate/2875784-pushregistry?language=objc)
 */
- (void)handlePushNotification:(NSDictionary *)notification DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient handlePushNotification:]> instead.");

@end
