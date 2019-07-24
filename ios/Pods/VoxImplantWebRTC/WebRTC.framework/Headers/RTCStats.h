/*
 *  Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */
#import <Foundation/Foundation.h>

#import <WebRTC/RTCMacros.h>

NS_ASSUME_NONNULL_BEGIN

RTC_EXPORT
@interface RTCStats : NSObject

@property (nonatomic, assign, readonly) CFTimeInterval timestampUs;

@property (nonatomic, strong, readonly) NSString *type;

@property (nonatomic, strong, readonly) NSString *id;

@property (nonatomic, strong, readonly) NSDictionary<NSString *, id> *members;

@end

NS_ASSUME_NONNULL_END