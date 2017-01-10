/* @flow */
import {Config, CognitoIdentityCredentials} from 'aws-sdk/lib/core';

import refreshTokenMethod from './refreshToken';
import signInMethod from './signIn';
import signOutGlobalMethod from './signOutGlobal';
import signUpConfirmMethod from './signUpConfirm';
import signUpConfirmResendMethod from './signUpConfirmResend';
import signUpMethod from './signUp';
import {userGet as userGetMethod, userDelete as userDeleteMethod} from './user';


const {
    AWS_REGION,
    AWS_IDENTITY_POOL_ID
} = process.env;

Config.region = AWS_REGION;
Config.credentials = new CognitoIdentityCredentials({
    IdentityPoolId: AWS_IDENTITY_POOL_ID
});

function parseRequest(method: Function): Function {
    return (httpEvent: Object, lambdaContext: Object, callback: Function) => {
        var [, token] = (httpEvent.headers.Authorization) ? httpEvent.headers.Authorization.split(' ') : [];

        const request = {
            ...httpEvent,
            token,
            body: JSON.parse(httpEvent.body)
        };

        function response(statusCode: number, body: Object) {
            callback(null, {
                statusCode,
                body: JSON.stringify(body)
            });
        }
        method(request, response);
    };
}

// Sign in/out/up
export const signIn = parseRequest(signInMethod);
export const signOutGlobal = parseRequest(signOutGlobalMethod);
export const signUp = parseRequest(signUpMethod);
export const signUpConfirm = parseRequest(signUpConfirmMethod);
export const signUpConfirmResend = parseRequest(signUpConfirmResendMethod);

// refresh token
export const refreshToken = parseRequest(refreshTokenMethod);

// user
export const userGet = parseRequest(userGetMethod);
export const userDelete = parseRequest(userDeleteMethod);
