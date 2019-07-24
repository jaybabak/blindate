/*
 *  Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>

/**
 * Class that represents statistics for inbound <VIAudioStream>. Available in <VEndpointStats>.
 */
@interface VIInboundAudioStats : NSObject

/**
 * The time at which the call statistics are collected, relative to the UNIX epoch (Jan 1, 1970, UTC), in microseconds.
 */
@property (nonatomic, assign, readonly) NSTimeInterval timestamp;
/**
 * Total number of bytes received within the audio stream.
 */
@property (nonatomic, assign, readonly) NSUInteger bytesReceived;
/**
 * Total number of packets received within the audio stream.
 */
@property (nonatomic, assign, readonly) NSUInteger packetsReceived;
/**
 * Total number of audio packets lost for the audio stream.
 */
@property (nonatomic, assign, readonly) NSUInteger packetsLost;
/**
 * Audio codec name for the audio stream, e.g. "opus".
 */
@property (nonatomic, strong, readonly) NSString *codec;
/**
 * Packet loss in the audio stream. Values are in the range 0..1, where 0 means no loss and 1 means full loss.
 */
@property (nonatomic, assign, readonly) double loss;

/**
 *  Temporary storage buffer used to capture incoming data packets.
 *
 *  It is used to ensure the continuity of streams by smoothing out packet arrival times during
 *  periods of network congestion.
 *
 *  Measured in milliseconds.
 */
@property (nonatomic, assign, readonly) NSTimeInterval jitterBufferMs;

@end
