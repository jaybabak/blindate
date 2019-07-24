/*
 *  Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import "VIVideoFlags.h"

/**
 *
 */
typedef NS_ENUM(NSInteger, VIVideoCodec) {
    /** Video codec for call will be chosen automatically */
            VIVideoCodecAuto = 0,
    /** Call will try to use VP8 video codec */
            VIVideoCodecVP8 = 1,
    /** Call will try to use H264 video codec */
            VIVideoCodecH264 = 2,
};

/**
 * Call settings with additional call parameters, such as preferred video codec, custom data, extra headers etc.
 */
@interface VICallSettings : NSObject

/**
 * A custom string associated with the call session.
 *
 * It can be passed to the cloud to be obtained from the [CallAlerting](https://voximplant.com/docs/references/voxengine/appevents#callalerting)
 * event or [Call History](https://voximplant.com/docs/references/httpapi/managing_history#getcallhistory) using HTTP API.
 *
 * Maximum size is 200 bytes. Use the <[VICall sendMessage:]> method to pass a string over the limit;
 * in order to pass a large data use [media_session_access_url](https://voximplant.com/docs/references/httpapi/managing_scenarios#startscenarios)
 * on your backend.
 */
@property(nonatomic, strong) NSString *customData;

/**
 * An optional set of headers to be sent to the Voximplant cloud. Names must begin with "X-" to be processed by SDK.
 */
@property(nonatomic, strong) NSDictionary<NSString *, NSString *> *extraHeaders;

/**
 * Specify video settings (send and receive) for the new call. Video is enabled by default.
 */
@property(nonatomic, strong) VIVideoFlags *videoFlags;

/**
 * A preferred video codec for a particular call that this VICallSettings are applied to.
 * <VIVideoCodec.VIVideoCodecAuto> by default.
 */
@property(nonatomic, assign) VIVideoCodec preferredVideoCodec;

@end
