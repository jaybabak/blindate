/*
 *  Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>

typedef NSErrorDomain VIErrorDomain NS_STRING_ENUM;
FOUNDATION_EXPORT VIErrorDomain const VIErrorDomainLogin;
FOUNDATION_EXPORT VIErrorDomain const VIErrorDomainCallFail;
FOUNDATION_EXPORT VIErrorDomain const VIErrorDomainCall;
FOUNDATION_EXPORT VIErrorDomain const VIErrorDomainConnectivity;
FOUNDATION_EXPORT VIErrorDomain const VIErrorDomainMessenger;

/**
 * Login error codes.
 */
typedef NS_ERROR_ENUM(VIErrorDomainLogin, VILoginErrorCode) {
    /** Invalid login or password. */
            VILoginErrorCodeInvalidPassword = 401,
    /** Account frozen. */
            VILoginErrorCodeAccountFrozen = 403,
    /** Invalid username. */
            VILoginErrorCodeInvalidUsername = 404,
    /** Login is failed due to timeout. */
            VILoginErrorCodeTimeout = 408,
    /** Connection to the Voximplant Cloud is closed as a result of <[VIClient disconnect]> method call. */
            VILoginErrorCodeConnectionClosed = 409,
    /** Login is failed due to invalid state. */
            VILoginErrorCodeInvalidState = 491,
    /** Internal error. */
            VILoginErrorCodeInternalError = 500,
    /** Connection to the Voximplant Cloud is closed due to network issues. */
            VILoginErrorCodeNetworkIssues = 503,
    /** Token expired. */
            VILoginErrorCodeTokenExpired = 701,
};

/**
 * Call failure error codes.
 */
typedef NS_ERROR_ENUM(VIErrorDomainCallFail, VICallFailErrorCode) {
    /** Insufficient funds. */
            VICallFailErrorCodeInsufficientFunds = 402,
    /** Invalid number. */
            VICallFailErrorCodeInvalidNumber = 404,
    /** Connection Closed. */
            VICallFailErrorCodeConnectionClosed = 409,
    /** Destination number is temporary unavailable. */
            VICallFailErrorCodeTemporaryUnavailable = 480,
    /** Destination number is busy. */
            VICallFailErrorCodeNumberBusy = 486,
    /** Request terminated. */
            VICallFailErrorCodeRequestTerminated = 487,
    /** Internal error. */
            VICallFailErrorCodeInternalError = 500,
    /** Service Unavailable. */
            VICallFailErrorCodeServiceUnavailable = 503,
    /** Call was rejected. */
            VICallFailErrorCodeRejected = 603,
};

/**
 * Call error codes.
 */
typedef NS_ERROR_ENUM(VIErrorDomainCall, VICallErrorCode) {
    /** Operation is rejected. */
            VICallErrorCodeRejected = 10004,
    /** Operation is not completed in time. */
            VICallErrorCodeTimeout = 10005,
    /** Operation is not permitted while media is on hold. Call <[VICall setHold:completion:]> and repeat operation. */
            VICallErrorCodeMediaIsOnHold = 10007,
    /** The call is already in requested state. */
            VICallErrorCodeAlreadyInThisState = 10008,
};

/**
 * Connectivity error codes.
 */
typedef NS_ERROR_ENUM(VIErrorDomainConnectivity, VIConnectivityErrorCode) {
    /** Connectivity check failed. */
            VIConnectivityErrorCodeConnectivityCheckFailed = 10000,
    /** Connection failed. */
            VIConnectivityErrorCodeConnectionFailed = 10001,
    /** Connection closed. */
            VIConnectivityErrorCodeConnectionClosed = 409,
};
