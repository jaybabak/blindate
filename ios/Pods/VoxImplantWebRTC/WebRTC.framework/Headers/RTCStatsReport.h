/*
 *  Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>

#import <WebRTC/RTCMacros.h>

@class RTCStats;

NS_ASSUME_NONNULL_BEGIN

RTC_EXPORT
@interface RTCStatsReport : NSObject

@property (nonatomic, assign, readonly) CFTimeInterval timestampUs;

@property (nonatomic, strong, readonly) NSDictionary<NSString *, RTCStats *> *stats;

@end

NS_ASSUME_NONNULL_END