/*
 *  Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import "VIMessengerEvent.h"

/**
 * Interface that represents messenger events related to conversation enumeration.
 *
 * Extends <VIMessengerEvent> which provides service information
 * (IM user id, action, event type).
 */
@interface VIConversationListEvent : VIMessengerEvent

/**
 * An array of conversations UUIDs.
 */
@property(nonatomic, strong, readonly) NSArray<NSString *> *conversationList;

@end
