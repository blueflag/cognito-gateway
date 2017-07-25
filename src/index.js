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
import {GromitError} from 'gromit';

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

function parseRequest(method: Function, methodName: string, config: Object): Function {
    return async (httpEvent: Object, lambdaContext: Object, callback: Function): Promise<void> => {

        const authHeader = httpEvent.headers.Authorization || '';
        const [, token] = authHeader.split(' ');

        const headers = {
            'Content-Type': 'application/json',
            ...config.headers
        };

        const response = (statusCode: number, body: Object) => {
            callback(null, {
                statusCode: statusCode,
                body: JSON.stringify(body),
                headers
            });
        };

        if(!token) return response(401, {message: 'Not Authorized'});

        try {
            let requestBody = httpEvent.body ? JSON.parse(httpEvent.body) : {};

            const preHook = config[`pre${methodName[0].toUpperCase()}${methodName.slice(1)}`];
            const postHook = config[`post${methodName[0].toUpperCase()}${methodName.slice(1)}`];

            if(preHook) {
                try {
                    requestBody = await preHook(requestBody, httpEvent, lambdaContext);
                } catch(err) {
                    return response(err.statusCode || 500, GromitError.wrap(err));
                }
            }

            const request = {
                ...httpEvent,
                token,
                body: requestBody
            };

            let {statusCode, body: responseBody} = await method(request);

            if(postHook) {
                try {
                    responseBody = await postHook(responseBody, httpEvent, lambdaContext);
                } catch(err) {
                    return response(err.statusCode || 500, GromitError.wrap(err));
                }
            }

            return response(statusCode, responseBody);

        } catch(err) {
            return response(500, GromitError.wrap(err));
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
            exp[method] = parseRequest(methods[method], method, config);
            return exp;
        }, {});
};
