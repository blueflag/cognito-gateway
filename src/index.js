/* @flow */
import {Config, CognitoIdentityCredentials} from 'aws-sdk/lib/core';

import changePassword from './changePassword';
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
                body: httpEvent.body ? JSON.parse(httpEvent.body) : {}
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
            }, config);

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
    const methods = {
        // Sign in/out/up
        signIn,
        signOutGlobal,
        signUp,
        signUpConfirm,
        signUpConfirmResend,

        // refresh token
        refreshToken,

        // change/forgot password
        changePassword,
        forgotPasswordRequest,
        forgotPasswordConfirm,

        // user
        userGet,
        userDelete
    };

    // Apply parse request to eeach method;
    return Object.keys(methods)
        .reduce((exp: Object, method: string): Object => {
            exp[method] = parseRequest(methods[method], config);
            return exp;
        }, {});
};
