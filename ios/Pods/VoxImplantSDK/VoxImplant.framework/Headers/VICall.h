/*
 *  Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import "VIError.h"
#import "VIQualityIssueDelegate.h"

@class VICall;
@class VIVideoStream;
@class VICallStats;
@class VIEndpoint;
@class VICallSettings;
@class VIQualityIssue;

/** Enum of incoming call reject modes. */
typedef NS_ENUM(NSInteger, VIRejectMode) {
    /** Indicates that user can't answer the call right now, and VoxEngine will terminate the call and any pending calls to other devices of current user. */
            VIRejectModeDecline = 0,
    /** Indicates that the user is not available only at a particular device. */
            VIRejectModeBusy = 1,
};

NS_ASSUME_NONNULL_BEGIN

/** Delegate that may be used to handle call events. */
@protocol VICallDelegate <NSObject>

@optional

/**
 * Triggered if the call is failed.
 *
 * @param call Call that triggered the event.
 * @param error Error that contains status code and status message of the call failure. See <VICallFailErrorCode> for possible reasons.
 * @param headers Optional headers passed with event.
 */
- (void)call:(VICall *)call didFailWithError:(NSError *)error headers:(nullable NSDictionary *)headers;

/**
 * Triggered after call was successfully connected.
 *
 * @param call Call that triggered the event.
 * @param headers Optional headers passed with event.
 */
- (void)call:(VICall *)call didConnectWithHeaders:(nullable NSDictionary *)headers;

/**
 * Triggered after the call was disconnected.
 *
 * @param call Call that triggered the event.
 * @param headers Optional headers passed with event.
 * @param answeredElsewhere YES if call was answered on another device.
 */
- (void)call:(VICall *)call didDisconnectWithHeaders:(nullable NSDictionary *)headers answeredElsewhere:(NSNumber *)answeredElsewhere;

/**
 * Triggered if the call is ringing. You should start playing call progress tone now.
 *
 * @param call Call that triggered the event.
 * @param headers Optional headers passed with event.
 */
- (void)call:(VICall *)call startRingingWithHeaders:(nullable NSDictionary *)headers;

/**
 * Triggered after audio is started in the call. You should stop playing progress tone when event is received.
 *
 * @param call Call that triggered the event.
 */
- (void)callDidStartAudio:(VICall *)call;

/**
 * Triggered when message is received within the call. Implemented atop SIP INFO for communication between call endpoint and Voximplant cloud, and is separated from Voximplant messaging API.
 *
 * @param call Call that triggered the event.
 * @param message Content of the message.
 * @param headers Optional headers passed with event.
 */
- (void)call:(VICall *)call didReceiveMessage:(NSString *)message headers:(nullable NSDictionary *)headers;

/**
 * Triggered when INFO message is received within the call.
 *
 * @param call Call that triggered the event.
 * @param body Body of INFO message.
 * @param type MIME type of INFO message.
 * @param headers Optional headers passed with event.
 */
- (void)call:(VICall *)call didReceiveInfo:(NSString *)body type:(NSString *)type headers:(nullable NSDictionary *)headers;

/**
 * Triggered when call statistics are available for the call.
 *
 * @param call Call that triggered the event.
 * @param stat Call statistics.
 */
- (void)call:(VICall *)call didReceiveStatistics:(VICallStats *)stat;

/**
 * Triggered when local video stream is added to the call. The event is triggered on the main thread.
 *
 * @param call Call that triggered the event.
 * @param videoStream Local video stream that is added to the call.
 */
- (void)call:(VICall *)call didAddLocalVideoStream:(VIVideoStream *)videoStream;

/**
 * Triggered when local video stream is removed from the call. The event is triggered on the main thread.
 *
 * @param call Call that triggered the event.
 * @param videoStream Local video stream that is removed to the call.
 */
- (void)call:(VICall *)call didRemoveLocalVideoStream:(VIVideoStream *)videoStream;

/**
 * Invoked after endpoint is added to the call.
 *
 * @param call Call that triggered the event.
 * @param endpoint Added endpoint.
 */
- (void)call:(VICall *)call didAddEndpoint:(VIEndpoint *)endpoint;

/**
 * Triggered when ICE connection is complete.
 *
 * @param call Call that triggered the event.
 */
- (void)iceCompleteForCall:(VICall *)call;

/**
 * Triggered if connection was not established due to network connection problem between 2 peers.
 *
 * @param call Call that triggered the event.
 */
- (void)iceTimeoutForCall:(VICall *)call;

@end

/**
 * Completion callback.
 *
 * @param error An error object that indicates why the operation failed (see <VICallErrorCode> for possible variants), or nil if the operation was successful.
 */
typedef void (^VICompletionBlock)(NSError *__nullable error);

@protocol RTCVideoRenderer;
@class UIView;
@class VIVideoSource;

/**
 * Interface that may be used for call operations like answer, reject, hang up and mid-call operations like hold, start/stop video and others.
 */
@interface VICall : NSObject

/**
 * Direct initialization of this object can produce undesirable consequences.
 */
- (instancetype)init NS_UNAVAILABLE;

/**
 * A preferred video codec, for example: @"H264". Nil by default.
 * Must be set before using <[VICall start]>, if needed.
 */
@property(nonatomic, strong) NSString *preferredVideoCodec DEPRECATED_MSG_ATTRIBUTE("Use <VICallSettings>");

/**
 * A video source. By default <[VICameraManager sharedCameraManager]> is used that gets video from back or front camera.
 * Must be set before using <[VICall start]> and <[VICall answerWithSettings:]>, if needed.
 */
@property(nonatomic, strong) VIVideoSource *videoSource;

/**
 * Add call delegate to handle call events.
 *
 * @param delegate Object registering as an delegate.
 */
- (void)addDelegate:(id <VICallDelegate>)delegate;

/**
 * Remove previously added delegate.
 *
 * @param delegate Previously added delegate.
 */
- (void)removeDelegate:(id <VICallDelegate>)delegate;

/**
 * The call id.
 */
@property(nonatomic, strong, readonly) NSString *callId;

/**
 * An array of the endpoints associated with the call.
 */
@property(nonatomic, strong, readonly) NSArray<VIEndpoint *> *endpoints;

/**
 * A Boolean value that determines whether an audio is transferred from microphone into the call.
 *
 * Setting this property enables or disables audio transfer.
 */
@property(nonatomic, assign) BOOL sendAudio;

/**
 * Get the call duration.
 *
 * @return Call duration.
 */
- (NSTimeInterval)duration;

/**
 * Start outgoing call.
 *
 * @param headers Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK.
 */
- (void)startWithHeaders:(nullable NSDictionary *)headers DEPRECATED_MSG_ATTRIBUTE("Use <[VICall start]>");

/**
 * Start outgoing call.
 */
- (void)start;

/**
 * Terminate established or outgoing processing call.
 *
 * @param headers Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK.
 */
- (void)stopWithHeaders:(nullable NSDictionary *)headers DEPRECATED_MSG_ATTRIBUTE("Use <[VICall hangupWithHeaders:]> or <[VICall rejectWithMode:headers:]> respectively.");

/**
 * Start or stop sending video for the call.
 *
 * @param video      YES if video should be sent, NO otherwise.
 * @param completion Completion block to handle the result of the operation.
 *                   ```objectivec
 *                   typedef void (^VICompletionBlock)(NSError *__nullable error);
 *                   ```
 *                   * error: An error object that indicates why the operation failed (see <VICallErrorCode> for possible variants), or nil if the operation was successful.
 */
- (void)setSendVideo:(BOOL)video completion:(nullable VICompletionBlock)completion;

/**
 * Hold or unhold the call.
 *
 * @param hold       YES if the call should be put on hold, NO for unhold.
 * @param completion Completion block to handle the result of the operation.
 *                   ```objectivec
 *                   typedef void (^VICompletionBlock)(NSError *__nullable error);
 *                   ```
 *                   * error: An error object that indicates why the operation failed (see <VICallErrorCode> for possible variants), or nil if the operation was successful.
 */
- (void)setHold:(BOOL)hold completion:(nullable VICompletionBlock)completion;

/**
 * Start receive video if video receive was not enabled before. Stop receiving video during the call is not supported.
 *
 * @param completion Completion block to handle the result of operation.
 *                   ```objectivec
 *                   typedef void (^VICompletionBlock)(NSError *__nullable error);
 *                   ```
 *                   * error: An error object that indicates why the operation failed (see <VICallErrorCode> for possible variants), or nil if the operation was successful.
 */
- (void)startReceiveVideoWithCompletion:(nullable VICompletionBlock)completion;

/**
 * Send message within the call.
 * Implemented atop SIP INFO for communication between call endpoint and Voximplant cloud, and is separated from Voximplant messaging API.
 *
 * @param message Message text.
 */
- (void)sendMessage:(NSString *)message;

/**
 * Send INFO message within the call.
 *
 * @param body     Custom string data.
 * @param mimeType MIME type of info.
 * @param headers  Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK
 */
- (void)sendInfo:(NSString *)body mimeType:(NSString *)mimeType headers:(nullable NSDictionary *)headers;

/**
 * Send DTMF within the call.
 *
 * @param dtmf DTMFs.
 * @return     YES if DTMFs are sent successfully, NO otherwise.
 */
- (BOOL)sendDTMF:(NSString *)dtmf;

/**
 * Answer incoming call.
 *
 * @param sendVideo    Specify if video send is enabled for a call.
 * @param receiveVideo Specify if video receive is enabled for a call.
 * @param customData   Custom string associated with the call session. It can be passed to the cloud to be obtained from the [CallAlerting](https://voximplant.com/docs/references/voxengine/appevents#callalerting) event or [Call History](https://voximplant.com/docs/references/httpapi/managing_history#getcallhistory) using HTTP API. Maximum size is 200 bytes. Use the <[VICall sendMessage:]> method to pass a string over the limit; in order to pass a large data use [media_session_access_url](https://voximplant.com/docs/references/httpapi/managing_scenarios#startscenarios) on your backend.
 * @param headers      Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK.
 */
- (void)answerWithSendVideo:(BOOL)sendVideo
               receiveVideo:(BOOL)receiveVideo
                 customData:(nullable NSString *)customData
                    headers:(nullable NSDictionary *)headers DEPRECATED_MSG_ATTRIBUTE("Use <[VICall answerWithSettings:]>");

/**
 * Answer incoming call.
 *
 * @param settings Call settings with additional call parameters, such as preferred video codec, custom data, extra headers etc.
 */
- (void)answerWithSettings:(VICallSettings *)settings;

/**
 * Reject incoming call with mode <VIRejectMode.VIRejectModeBusy>.
 *
 * @param headers Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK.
 */
- (void)rejectWithHeaders:(nullable NSDictionary *)headers DEPRECATED_MSG_ATTRIBUTE("Introduce of <VIRejectMode>, use <[VICall rejectWithMode:headers:]> instead.");

/**
 * Reject incoming call.
 *
 * @param mode Specify mode of call rejection.
 * @param headers Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK.
 */
- (void)rejectWithMode:(VIRejectMode)mode headers:(nullable NSDictionary *)headers;

/**
 * Terminates call. Call should be either established, or outgoing progressing.
 *
 * @param headers Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK.
 */
- (void)hangupWithHeaders:(nullable NSDictionary *)headers;

/**
 * Set <VIQualityIssueDelegate> to monitor issues that affect call quality.
 */
@property(weak, nonatomic, nullable) id <VIQualityIssueDelegate> qualityIssueDelegate;

/**
 * Get all quality issues types.
 *
 * @return array of <VIQualityIssueType>.
 */
- (NSArray<VIQualityIssueType> *)qualityIssues;

/**
 * Get current level of specific quality issue.
 *
 * @param type Quality issue type.
 * @return Issue level for that type.
 */
- (VIQualityIssueLevel)issueLevelForType:(VIQualityIssueType)type;

@end

@interface VICall (Streams)

/**
 * The local video streams associated with the call.
 */
@property(nonatomic, strong, readonly) NSArray<VIVideoStream *> *localVideoStreams;

@end

NS_ASSUME_NONNULL_END
