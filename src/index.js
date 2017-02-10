/* @flow */
import {Config, CognitoIdentityCredentials} from 'aws-sdk/lib/core';

import refreshToken from './refreshToken';
import signIn from './signIn';
import signOutGlobal from './signOutGlobal';
import signUp from './signUp';
import signUpConfirm from './signUpConfirm';
import signUpConfirmResend from './signUpConfirmResend';
import {forgotPasswordRequest, forgotPasswordConfirm} from './forgotPassword';
import {userGet, userDelete} from './user';

// Shim for
global.navigator = {};

const {
    AWS_REGION,
    AWS_IDENTITY_POOL_ID
} = process.env;

Config.region = AWS_REGION;
Config.credentials = new CognitoIdentityCredentials({
    IdentityPoolId: AWS_IDENTITY_POOL_ID
});

function parseRequest(method: Function, config: Object): Function {
    return (httpEvent: Object, lambdaContext: Object, callback: Function) => {
        try {
            var [, token] = (httpEvent.headers.Authorization) ? httpEvent.headers.Authorization.split(' ') : [];
            const request = {
                ...httpEvent,
                token,
                body: JSON.parse(httpEvent.body)
            };


            method(request, function response(statusCode: number, body: Object) {
                callback(null, {
                    statusCode,
                    headers: {
                        'Content-Type': 'application/json',
                        ...config.headers
                    },
                    body: JSON.stringify(body)
                });
            });

        } catch(err) {
            throw {
                statusCode: 400,
                body: {
                    error: err
                }
            };
        }
    };
}

module.exports = function cognitoGateway(config: Object = {}): Object {
    return {
        // Sign in/out/up
        signIn: parseRequest(signIn, config),
        signOutGlobal: parseRequest(signOutGlobal, config),
        signUp: parseRequest(signUp, config),
        signUpConfirm: parseRequest(signUpConfirm, config),
        signUpConfirmResend: parseRequest(signUpConfirmResend, config),

        // refresh token
        refreshToken: parseRequest(refreshToken, config),

        // forgot password
        forgotPasswordRequest: parseRequest(forgotPasswordRequest, config),
        forgotPasswordConfirm: parseRequest(forgotPasswordConfirm, config),

        // user
        userGet: parseRequest(userGet, config),
        userDelete: parseRequest(userDelete, config)
    };
};
