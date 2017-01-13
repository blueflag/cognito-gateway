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
        signIn: parseRequest(signInMethod, config),
        signOutGlobal: parseRequest(signOutGlobalMethod, config),
        signUp: parseRequest(signUpMethod, config),
        signUpConfirm: parseRequest(signUpConfirmMethod, config),
        signUpConfirmResend: parseRequest(signUpConfirmResendMethod, config),

        // refresh token
        refreshToken: parseRequest(refreshTokenMethod, config),

        // user
        userGet: parseRequest(userGetMethod, config),
        userDelete: parseRequest(userDeleteMethod, config)
    };
};
