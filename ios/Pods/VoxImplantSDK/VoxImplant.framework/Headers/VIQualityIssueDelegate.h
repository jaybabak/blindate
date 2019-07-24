/*
 *  Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

typedef NSString *VIQualityIssueType NS_STRING_ENUM;
/**
 * Indicates that local video is encoded by a codec different from the specified one.
 * See <[VIQualityIssueDelegate call:didDetectCodecMismatch:issueLevel:]>  for details.
 */
FOUNDATION_EXPORT VIQualityIssueType const VIQualityIssueTypeCodecMismatch;
/**
 * Indicates that the video resolution sent to the endpoint is lower than a captured video resolution.
 * See <[VIQualityIssueDelegate call:didDetectLocalVideoDegradation:targetSize:issueLevel:]>
 * for details.
 */
FOUNDATION_EXPORT VIQualityIssueType const VIQualityIssueTypeLocalVideoDegradation;
/**
 * Indicates that network-based media latency is detected in the call.
 * See <[VIQualityIssueDelegate call:didDetectHighMediaLatency:issueLevel:]> for details.
 */
FOUNDATION_EXPORT VIQualityIssueType const VIQualityIssueTypeHighMediaLatency;
/**
 * Indicates that ICE connection is switched to the "disconnected" state during the call.
 * See <[VIQualityIssueDelegate call:didDetectIceDisconnected:]> for details.
 */
FOUNDATION_EXPORT VIQualityIssueType const VIQualityIssueTypeIceDisconnected;
/**
 * Indicates that current bitrate is insufficient for sending video in current resolution.
 * See <[VIQualityIssueDelegate call:didDetectLowBandwidth:targetBitrate:issueLevel:]>
 * for details.
 */
FOUNDATION_EXPORT VIQualityIssueType const VIQualityIssueTypeLowBandwidth;
/**
 * Indicates that no audio is captured by the microphone.
 * See <[VIQualityIssueDelegate call:didDetectNoAudioSignal:]> for details.
 */
FOUNDATION_EXPORT VIQualityIssueType const VIQualityIssueTypeNoAudioSignal;
/**
 * Indicates packet loss for last 2.5 seconds.
 * See <[VIQualityIssueDelegate call:didDetectPacketLoss:issueLevel:]> for details.
 */
FOUNDATION_EXPORT VIQualityIssueType const VIQualityIssueTypePacketLoss;

typedef NS_ENUM(NSUInteger, VIQualityIssueLevel) {
    /**
     * The quality issue level to indicate that an issue is not detected or is resolved.
     */
            VIQualityIssueLevelNone,
    /**
     * The quality issue level to indicate that an issue may have minor impact on the call quality.
     *
     * For audio calls it may result in temporary audio artifacts.
     *
     * For video calls it may result in video artifacts in case of a dynamically changing video stream.
     */
            VIQualityIssueLevelMinor,
    /**
     * The quality issue level to indicate that a detected issue may have a major impact on the call
     * quality.
     *
     * For audio calls it may result in a corrupted stream (discord or robotic voice) for call participants,
     * audio delays and glitches.
     *
     * For video calls it may result in significant video artifacts (pixelating, blurring, color
     * bleeding, flickering, noise), one-way/no video stream between the call participants.
     */
            VIQualityIssueLevelMajor,
    /**
     * The quality issue level to indicate that a detected issue has a critical impact on the call quality.
     *
     * In most cases it results in lost media stream between call participants or broken functionality.
     */
            VIQualityIssueLevelCritical
};

@class VICall;

/**
 * Interface to monitor issues that affect call quality during a call.
 */
@protocol VIQualityIssueDelegate <NSObject>

/**
 * BETA
 *
 * Invoked on packet loss detection. Packet loss can lead to missing of entire sentences,
 * awkward pauses in the middle of a conversation or robotic voice during the call.
 *
 * Issue level may vary during the call.
 *
 * Possible reasons:
 * 1. Network congestion
 * 2. Bad hardware (parts of the network infrastructure)
 *
 * @param call       Call the issue belongs to.
 * @param packetLoss Average packet loss for 2.5 seconds.
 * @param level      Issue level.
 */
- (void)call:(VICall *)call didDetectPacketLoss:(double)packetLoss issueLevel:(VIQualityIssueLevel)level;

/**
 * BETA
 *
 * Invoked if local video is encoded by a codec different from specified in <[VICallSettings preferredVideoCodec]>.
 *
 * Issue level is <VIQualityIssueLevel.VIQualityIssueLevelCritical> if video is not sent,
 * <VIQualityIssueLevel.VIQualityIssueLevelMajor> in case of codec mismatch or <VIQualityIssueLevel.VIQualityIssueLevelNone>
 * if the issue is not detected.
 *
 * Possible reasons:
 * 1. The video is not sent for some reasons. In this case codec will be nil
 * 2. Different codecs are specified in the call endpoints
 *
 * @param call  Call the issue belongs to.
 * @param codec Codec that is currently used, or nil if the video is not sent.
 * @param level Issue level.
 */
- (void)call:(VICall *)call didDetectCodecMismatch:(NSString *)codec issueLevel:(VIQualityIssueLevel)level;

/**
 * BETA
 *
 * Invoked if the video resolution sent to the endpoint is lower than a captured video resolution.
 * As a result it affects remote video quality on the remote participant side, but do not affect
 * the quality of local video preview on the android application.
 *
 * The issue level may vary during the call.
 *
 * Possible reasons:
 * 1. High CPU load during the video call
 * 2. Network issues such as poor internet connection or low bandwidth
 *
 * @param call       Call the issue belongs to.
 * @param actualSize Sent frame size.
 * @param targetSize Captured frame size.
 * @param level      Issue level.
 */
- (void)call:(VICall *)call didDetectLocalVideoDegradation:(CGSize)actualSize targetSize:(CGSize)targetSize issueLevel:(VIQualityIssueLevel)level;

/**
 * BETA
 *
 * Invoked if ICE connection is switched to the "disconnected" state during the call.
 *
 * Issue level is always <VIQualityIssueLevel.VIQualityIssueLevelCritical>, because there is no media in the call
 * until the issue is resolved.
 *
 * Event may be triggered intermittently and be resolved just as spontaneously on less reliable networks,
 * or during temporary disconnections.
 *
 * Possible reasons:
 * 1. Network issues
 *
 * @param call  Call the issue belongs to.
 * @param level Issue level.
 */
- (void)call:(VICall *)call didDetectIceDisconnected:(VIQualityIssueLevel)level;

/**
 * BETA
 *
 * Invoked if network-based media latency is detected in the call. Network-based media latency
 * is calculated based on rtt (round trip time) and jitter buffer. Latency refers to the time it
 * takes a voice/video packet to reach its destination. Sufficient latency causes call participants
 * to speak over the top of each other.
 *
 * Issue level may vary during the call.
 *
 * Possible reasons:
 * 1. Network congestion/delays
 * 2. Lack of bandwidth
 *
 * @param call    Call the issue belongs to.
 * @param latency Network-based latency measured in milliseconds at the moment the issue triggered.
 * @param level   Issue level.
 */
- (void)call:(VICall *)call didDetectHighMediaLatency:(NSTimeInterval)latency issueLevel:(VIQualityIssueLevel)level;

/**
 * BETA
 *
 * Invoked if current bitrate is insufficient for sending video with current resolution.
 *
 * Issue level may vary during the call. SDK may report <VIQualityIssueLevel.VIQualityIssueLevelMajor> or
 * <VIQualityIssueLevel.VIQualityIssueLevelMinor> while detecting network capabilities right after the call start.
 *
 * Target bitrate depends on the sent video frame resolution. If the resolution of video frames
 * sent is changed, target bitrate can also be changed (increased or degraded).
 *
 * It is not recommended to change the resolution or other video call parameters once the issue is
 * detected; in such case, SDK tries to adapt to the current congestion automatically. Only if the issue level
 * is constantly <VIQualityIssueLevel.VIQualityIssueLevelMajor> or <VIQualityIssueLevel.VIQualityIssueLevelCritical>, you can
 * change the video call parameters.
 *
 * Issue may be triggered and constantly report <VIQualityIssueLevel.VIQualityIssueLevelMajor> or
 * <VIQualityIssueLevel.VIQualityIssueLevelCritical> if the application is running in the background.
 *
 * Possible reasons:
 * 1. Network issues
 * 2. Background state of an application
 *
 * @param call          Call the issue belongs to.
 * @param actualBitrate Actual bitrate. Measured in bits per second.
 * @param targetBitrate Bitrate required to send video with current resolution with a good quality.
 *                      Measured in bits per second.
 * @param level         Issue level.
 */
- (void)call:(VICall *)call didDetectLowBandwidth:(double)actualBitrate targetBitrate:(double)targetBitrate issueLevel:(VIQualityIssueLevel)level;

/**
 * BETA
 *
 * Invoked if no audio is captured by the microphone.
 *
 * Issue level can be only <VIQualityIssueLevel.VIQualityIssueLevelCritical> if the issue is detected or
 * <VIQualityIssueLevel.VIQualityIssueLevelNone> if the issue is not detected or resolved.
 *
 * Possible reasons:
 * 1. Access to microphone is denied
 * 2. Category of AVAudioSession is not AVAudioSessionCategoryPlayAndRecord
 *
 * @param call  Call the issue belongs to.
 * @param level Issue level.
 */
- (void)call:(VICall *)call didDetectNoAudioSignal:(VIQualityIssueLevel)level;

@end
