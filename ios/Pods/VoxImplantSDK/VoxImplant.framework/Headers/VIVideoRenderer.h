/*
 *  Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <WebRTC/WebRTC.h>

/**
 * Delegate that may be used to handle renderer events.
 */
@protocol VIVideoRenderer <RTCVideoRenderer>

@optional
/**
 * Triggered when the video renderer is started.
 */
- (void)didStart;

/**
 * Triggered when the video renderer is stopped.
 */
- (void)didStop;

@end
