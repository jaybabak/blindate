/*
 *  Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import "VIError.h"

@class VIClient;
@class VICall;
@class VIMessenger;
@class VICallSettings;

NS_ASSUME_NONNULL_BEGIN

/**
 * Log message types.
 */
typedef NS_OPTIONS(NSUInteger, VILogSeverity) {
    /** Error level message. */
            VILogSeverityError = (1 << 20),
    /** Warning level message. */
            VILogSeverityWarning = (1 << 21),
    /** Info level message. */
            VILogSeverityInfo = (1 << 22),
    /** Debug level message. */
            VILogSeverityDebug = (1 << 23),
    /** Verbose level message. */
            VILogSeverityVerbose = (1 << 24),
};

/**
 * Logging level.
 */
typedef NS_ENUM(NSUInteger, VILogLevel) {
    /** Mutes all log messages. */
            VILogLevelDisabled = 0,
    /** Log verbosity level to include only error messages. */
            VILogLevelError = (VILogSeverityError),
    /** Log verbosity level to include error and warnings messages. */
            VILogLevelWarning = (VILogLevelError | VILogSeverityWarning),
    /** Log verbosity level to include error, warnings and info messages. */
            VILogLevelInfo = (VILogLevelWarning | VILogSeverityInfo),
    /** Log verbosity level to include error, warnings, info and debug messages. */
            VILogLevelDebug = (VILogLevelInfo | VILogSeverityDebug),
    /** Log verbosity level to include error, warnings, info, debug and verbose messages. */
            VILogLevelVerbose = (VILogLevelDebug | VILogSeverityVerbose),
};

/**
 * Logging delegate
 */
@protocol VILogDelegate <NSObject>

/**
 * Invoked for each log message from Voximplant iOS SDK
 *
 * @param message Log message
 * @param severity Severity of message
 */
- (void)didReceiveLogMessage:(NSString *)message severity:(VILogSeverity)severity;

@end

/**
 * VIClient states.
 */
typedef NS_ENUM(NSUInteger, VIClientState) {
    /** The client is currently disconnected. */
            VIClientStateDisconnected,
    /** The client is currently connecting. */
            VIClientStateConnecting,
    /** The client is currently connected. */
            VIClientStateConnected,
    /** The client is currently logging in. */
            VIClientStateLoggingIn,
    /** The client is currently logged in. */
            VIClientStateLoggedIn
};

/** Interface that may be used to connect and login to Voximplant Cloud, make and receive audio/video calls. */
@interface VIClient : NSObject

/**
 * Get client version.
 *
 * @return Voximplant Client version.
 */
+ (NSString *)clientVersion;

/**
 * Get underlying WebRTC version.
 *
 * @return WebRTC version.
 */
+ (NSString *)webrtcVersion;

/**
 * Set log delegate to handle Voximplant iOS SDK log messages.
 *
 * @param logDelegate Log delegate instance
 */
+ (void)setLogDelegate:(id <VILogDelegate>)logDelegate;

/**
 * Set a verbosity level for log messages. This method must be called before creating SDK object instance.
 *
 * @param logLevel Log verbosity level.
 */
+ (void)setLogLevel:(VILogLevel)logLevel;

/**
 * Enable saving of the logs to file. Log files are located at: Library/Caches/Logs.
 */
+ (void)saveLogToFileEnable DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient writeLogsToFile]> or <[VIClient writeLogsToFileLogger:]> instead.");

/**
 * Direct initialization of this object can produce undesirable consequences.
 */
- (instancetype)init NS_UNAVAILABLE;

/**
 * Initialize client instance.
 *
 * @param queue All delegates methods will be called in this queue. Queue should be serial, but not concurrent (main queue is applicable).
 * @return Client instance.
 */
- (instancetype)initWithDelegateQueue:(dispatch_queue_t)queue;

/**
 * Initialize client instance.
 *
 * You need to use this only if you are going to send push notifications across several iOS apps using a single Voximplant application.
 *
 * @param queue All delegates methods will be called in this queue. Queue should be serial, but not concurrent (main queue is applicable).
 * @param bundleId Application bundle id
 * @return Client instance.
 */
- (instancetype)initWithDelegateQueue:(dispatch_queue_t)queue bundleId:(nullable NSString *)bundleId;

/**
 * Get instance of messaging subsystem.
 *
 * Messenger instance, or nil if user is not logged in.
 */
@property(nonatomic, strong, readonly) VIMessenger *messenger;

/**
 * Current client state.
 */
@property(nonatomic, readonly) VIClientState clientState;

@end

/**
 * Delegate that may be used to handle events for connection with Voximplant Cloud.
 */
@protocol VIClientSessionDelegate <NSObject>

/**
 * Triggered after connection to Voximplant Cloud was established successfully.
 *
 * @param client Client instance.
 */
- (void)clientSessionDidConnect:(VIClient *)client;

/**
 * Triggered if connection to Voximplant Cloud was closed.
 *
 * @param client Client instance.
 */
- (void)clientSessionDidDisconnect:(VIClient *)client;

/**
 * Triggered if connection to Voximplant Cloud couldn't be established.
 *
 * @param client Client instance.
 * @param error  Occurred error. See <VIConnectivityErrorCode> for possible variants.
 */
- (void)client:(VIClient *)client sessionDidFailConnectWithError:(NSError *)error;

@end

@interface VIClient (Session)

/**
 * Session delegate that handles events for connection with Voximplant Cloud.
 */
@property(nonatomic, weak) id <VIClientSessionDelegate> sessionDelegate;

/**
 * Connect to Voximplant Cloud.
 *
 * @return YES if the attempt to connect can be performed, NO otherwise. Return value "NO" means that the connection to Voximplant Cloud is currently establishing or already established. In this case please check the current client state via <[VIClient clientState]> property and proceed according to the current state.
 */
- (BOOL)connect;

/**
 * Connect to Voximplant Cloud.
 *
 * @param connectivityCheck Checks whether UDP traffic will flow correctly between device and Voximplant Cloud. This check reduces connection speed.
 * @param gateways          Array of server names of particular media gateways for connection.
 * @return                  YES if the attempt to connect can be performed, NO otherwise.
 *                          Return value NO means that the connection to Voximplant Cloud is currently establishing or already established. In this case please check the current client state via <[VIClient clientState]> property and proceed according to the current state.
 */
- (BOOL)connectWithConnectivityCheck:(BOOL)connectivityCheck gateways:(nullable NSArray *)gateways;

/**
 * Disconnect from Voximplant Cloud.
 */
- (void)disconnect;

@end

/**
 * Completion handler, triggered when login operation is completed successfully.
 *
 * @param displayName Display name of logged in user.
 * @param authParams  Auth parameters that can be used to login using access token.
 */
typedef void (^VILoginSuccess)(NSString *displayName, NSDictionary *authParams);

/**
 * Completion handler, triggered when login process failed.
 *
 * @param error Occurred error. See <VILoginErrorCode> for possible variants.
 */
typedef void (^VILoginFailure)(NSError *error);

/**
 * Completion handler, triggered when one time key generated by the login server.
 *
 * @param oneTimeKey One time key.
 * @param error      Occurred error. See <VILoginErrorCode> for possible variants.
 */
typedef void (^VIOneTimeKeyResult)(NSString *__nullable oneTimeKey, NSError *__nullable error);

/**
 * Completion handler, triggered when refresh of login tokens completed.
 *
 * @param authParams Auth parameters that can be used to login using access token.
 * @param error      Occurred error. See <VILoginErrorCode> for possible variants.
 */
typedef void (^VIRefreshTokenResult)(NSDictionary *__nullable authParams, NSError *__nullable error);

@interface VIClient (Login)

/**
 * Login to Voximplant Cloud using password.
 *
 * @param user     Full user name, including app and account name, like someuser@someapp.youraccount.voximplant.com.
 * @param password User password.
 * @param success  Completion handler triggered if operation is completed successfully.
 *                 ```objectivec
 *                 typedef void (^VILoginSuccess)(NSString *displayName, NSDictionary *authParams);
 *                 ```
 *                 * displayName: Display name of logged in user.
 *                 * authParams:  Auth parameters that can be used to login using access token.
 * @param failure  Completion handler failure triggered if operation is failed.
 *                 ```objectivec
 *                 typedef void (^VILoginFailure)(NSError *error);
 *                 ```
 *                 * error: Occurred error. See <VILoginErrorCode> for possible variants.
 */
- (void)loginWithUser:(NSString *)user
             password:(NSString *)password
              success:(nullable VILoginSuccess)success
              failure:(nullable VILoginFailure)failure;

/**
 * Login to Voximplant Cloud using access token.
 *
 * @param user    Full user name, including app and account name, like someuser@someapp.youraccount.voximplant.com.
 * @param token   Access token obtained from authParams.
 * @param success Completion handler triggered if operation is completed successfully.
 *                ```objectivec
 *                typedef void (^VILoginSuccess)(NSString *displayName, NSDictionary *authParams);
 *                ```
 *                * displayName: Display name of logged in user.
 *                * authParams:  Auth parameters that can be used to login using access token.
 * @param failure Completion handler failure triggered if operation is failed.
 *                ```objectivec
 *                typedef void (^VILoginFailure)(NSError *error);
 *                ```
 *                * error: Occurred error. See <VILoginErrorCode> for possible variants.
 */
- (void)loginWithUser:(NSString *)user
                token:(NSString *)token
              success:(nullable VILoginSuccess)success
              failure:(nullable VILoginFailure)failure;

/**
 * Login to Voximplant Cloud using one time key.
 *
 * @param user       Full user name, including app and account name, like someuser@someapp.youraccount.voximplant.com.
 * @param oneTimeKey Hash that was generated using following formula:
 *                   ```objectivec
 *                   MD5(oneTimeKey+"|"+MD5(user+":voximplant.com:"+password))
 *                   ```
 *
 * Please note that here user is just a user name, without app name, account name or anything else after "@".
 *
 * So if you pass myuser@myapp.myacc.voximplant.com as a username, you should only use myuser while computing this hash.
 *
 * @param success    Completion handler triggered if operation is completed successfully.
 *                   ```objectivec
 *                   typedef void (^VILoginSuccess)(NSString *displayName, NSDictionary *authParams);
 *                   ```
 *                   * displayName: Display name of logged in user.
 *                   * authParams:  Auth parameters that can be used to login using access token.
 * @param failure    Completion handler failure triggered if operation is failed.
 *                   ```objectivec
 *                   typedef void (^VILoginFailure)(NSError *error);
 *                   ```
 *                   * error: Occurred error. See <VILoginErrorCode> for possible variants.
 */
- (void)loginWithUser:(NSString *)user
           oneTimeKey:(NSString *)oneTimeKey
              success:(nullable VILoginSuccess)success
              failure:(nullable VILoginFailure)failure;

/**
 * Perform refresh of login tokens required for login using access token.
 *
 * @param user   Full user name, including app and account name, like someuser@someapp.youraccount.voximplant.com.
 * @param token  Refresh token obtained from authParams.
 * @param result Completion handler that is triggered when the operation is completed.
 *               ```objectivec
 *               typedef void (^VIRefreshTokenResult)(NSDictionary *authParams, NSError *error);
 *               ```
 *               * authParams: Auth parameters that can be used to login using access token.
 *               * error: Occurred error. See <VILoginErrorCode> for possible variants.
 */
- (void)refreshTokenWithUser:(NSString *)user token:(NSString *)token result:(nullable VIRefreshTokenResult)result;

/**
 * Generates one time login key to be used for automated login process.
 *
 * For additional information please see:
 * * <[VIClient loginWithUser:oneTimeKey:success:failure:]>.
 * * [Information about automated login on Voximplant website](http://voximplant.com/docs/quickstart/24/automated-login/).
 *
 * @param user   Full user name, including app and account name, like someuser@someapp.youraccount.voximplant.com.
 * @param result Completion handler that is triggered when the operation is completed.
 *               ```objectivec
 *               typedef void (^VIOneTimeKeyResult)(NSString *oneTimeKey, NSError *error);
 *               ```
 *               * oneTimeKey: Resulting One Time Key.
 *               * error:      Occurred error. See <VILoginErrorCode> for possible variants.
 */
- (void)requestOneTimeKeyWithUser:(NSString *)user result:(VIOneTimeKeyResult)result;

@end

/**
 * Delegate that may be used to handle incoming calls.
 */
@protocol VIClientCallManagerDelegate <NSObject>

/**
 * Triggered when there is a new incoming call to current user.
 *
 * @param client  Client instance.
 * @param call    Call instance.
 * @param video   YES if incoming call offers video, NO otherwise.
 * @param headers Optional headers passed with event.
 */
- (void)client:(VIClient *)client didReceiveIncomingCall:(VICall *)call withIncomingVideo:(BOOL)video headers:(nullable NSDictionary *)headers;

@end

@interface VIClient (CallManager)

/**
 * Call manager delegate that handles incoming calls.
 */
@property(nonatomic, weak, nullable) id <VIClientCallManagerDelegate> callManagerDelegate;

/**
 * Dictionary of actual calls with their ids.
 */
@property(nonatomic, strong, readonly) NSDictionary<NSString *, VICall *> *calls;

/**
 * Create a new call instance. Call must be then started using <[VICall start]>.
 *
 * @param user         SIP URI, username or phone number to make call to. Actual routing is then performed by VoxEngine scenario.
 * @param sendVideo    Specify if video send is enabled for a call.
 * @param receiveVideo Specify if video receive is enabled for a call.
 * @param customData   Custom string associated with the call session. It can be passed to the cloud to be obtained from the [CallAlerting](https://voximplant.com/docs/references/voxengine/appevents#callalerting) event or [Call History](https://voximplant.com/docs/references/httpapi/managing_history#getcallhistory) using HTTP API. Maximum size is 200 bytes. Use the <[VICall sendMessage:]> method to pass a string over the limit; in order to pass a large data use [media_session_access_url](https://voximplant.com/docs/references/httpapi/managing_scenarios#startscenarios) on your backend.
 * @return             Call instance or nil if client is not logged in or user is nil
 */
- (nullable VICall *)callToUser:(NSString *)user withSendVideo:(BOOL)sendVideo receiveVideo:(BOOL)receiveVideo customData:(nullable NSString *)customData DEPRECATED_MSG_ATTRIBUTE("Use <[VIClient call:settings:]>");

/**
 * Create a new call instance. Call must be then started using <[VICall start]>.
 *
 * @param number   SIP URI, username or phone number to make call to. Actual routing is then performed by VoxEngine scenario.
 * @param settings Call settings with additional call parameters, such as preferred video codec, custom data, extra headers etc.
 * @return         Call instance or nil if client is not logged in or user is nil
 */
- (nullable VICall *)call:(NSString *)number settings:(VICallSettings *)settings;

/**
 * Create call to a dedicated conference without proxy session. Call must be then started using <[VICall start]>.
 * For details see [the video conferencing guide](https://voximplant.com/blog/video-conference-through-voximplant-media-servers).
 *
 * @param conference The number to call. For SIP compatibility reasons it should be a non-empty string even if the number itself is not used by a Voximplant cloud scenario.
 * @param settings   Call settings with additional call parameters, such as preferred video codec, custom data, extra headers etc.
 * @return           Call instance or nil if client is not logged in or conference is nil
 */
- (nullable VICall *)callConference:(NSString *)conference settings:(VICallSettings *)settings;

@end

@interface VIClient (Push)
/**
 * Register Apple Push Notifications token.
 *
 * After calling this function application will receive push notifications from Voximplant Server.
 *
 * @param voipToken The APNS token for VoIP push notifications which comes from [[PKPushRegistryDelegate pushRegistry:didUpdatePushCredentials:forType:]](https://developer.apple.com/documentation/pushkit/pkpushregistrydelegate/1614470-pushregistry?language=objc).
 * @param imToken The APNS token for IM push notifications.
 */
- (void)registerPushNotificationsToken:(nullable NSData *)voipToken imToken:(nullable NSData *)imToken;

/**
 * Unregister Apple Push Notifications token.
 *
 * After calling this function application stops receive push notifications from Voximplant Server.
 *
 * @param voipToken The APNS token for VoIP push notifications which comes from [[PKPushRegistryDelegate pushRegistry:didUpdatePushCredentials:forType:]](https://developer.apple.com/documentation/pushkit/pkpushregistrydelegate/1614470-pushregistry?language=objc).
 * @param imToken The APNS token for IM push notification.
 */
- (void)unregisterPushNotificationsToken:(nullable NSData *)voipToken imToken:(nullable NSData *)imToken;

/**
 * Handle incoming push notification.
 *
 * @param notification The incoming notification which comes from [[PKPushRegistryDelegate pushRegistry:didReceiveIncomingPushWithPayload:forType:withCompletionHandler:]](https://developer.apple.com/documentation/pushkit/pkpushregistrydelegate/2875784-pushregistry?language=objc).
 */
- (void)handlePushNotification:(NSDictionary *)notification;

@end

NS_ASSUME_NONNULL_END
