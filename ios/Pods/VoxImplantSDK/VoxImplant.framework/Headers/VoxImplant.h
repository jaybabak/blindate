/*
 *  Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <UIKit/UIKit.h>

//! Project version number for Voximplant.
FOUNDATION_EXPORT double VoxImplantVersionNumber;

//! Project version string for Voximplant.
FOUNDATION_EXPORT const unsigned char VoxImplantVersionString[];

// In this header, you should import all the public headers of your framework using statements like #import <VoxImplant/PublicHeader.h>

#import <Foundation/Foundation.h>

#import <VoxImplant/VIClient.h>
#import <VoxImplant/VICall.h>
#import <VoxImplant/VIEndpoint.h>
#import <VoxImplant/VIAudioManager.h>
#import <VoxImplant/VIVideoSource.h>
#import <VoxImplant/VICameraManager.h>
#import <VoxImplant/VIVideoRenderer.h>
#import <VoxImplant/VIVideoRendererView.h>
#import <VoxImplant/VIVideoStream.h>
#import <VoxImplant/VICallStats.h>
#import <VoxImplant/VIOutboundAudioStats.h>
#import <VoxImplant/VIOutboundVideoStats.h>
#import <VoxImplant/VIEndpointStats.h>
#import <VoxImplant/VIInboundAudioStats.h>
#import <VoxImplant/VIInboundVideoStats.h>
#import <VoxImplant/VICallSettings.h>
#import <VoxImplant/VIVideoFlags.h>
#import <VoxImplant/VIQualityIssueDelegate.h>
#import <VoxImplant/VIError.h>

// Messenger
#import <VoxImplant/VIConversation.h>
#import <VoxImplant/VIConversationConfig.h>
#import <VoxImplant/VIConversationEvent.h>
#import <VoxImplant/VIConversationListEvent.h>
#import <VoxImplant/VIConversationParticipant.h>
#import <VoxImplant/VIConversationServiceEvent.h>
#import <VoxImplant/VIErrorEvent.h>
#import <VoxImplant/VIMessage.h>
#import <VoxImplant/VIMessageEvent.h>
#import <VoxImplant/VIMessenger.h>
#import <VoxImplant/VIMessengerCompletion.h>
#import <VoxImplant/VIMessengerEvent.h>
#import <VoxImplant/VIMessengerPushNotificationProcessing.h>
#import <VoxImplant/VIRetransmitEvent.h>
#import <VoxImplant/VIStatusEvent.h>
#import <VoxImplant/VISubscriptionEvent.h>
#import <VoxImplant/VIUser.h>
#import <VoxImplant/VIUserEvent.h>

// legacy API
#import <VoxImplant/LegacyAPI.h>
#import <VoxImplant/VoxImplantDelegate.h>

