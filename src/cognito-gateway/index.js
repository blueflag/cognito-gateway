/* @flow */
import {Config, CognitoIdentityCredentials} from 'aws-sdk/lib/core';
import signInMethod from './signIn';
import signOutGlobalMethod from './signOutGlobal';
import updateTokenMethod from './updateToken';
import userMethod from './user';


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

// export function updateToken(httpEvent: Object, lambdaContext: Object, callback: Function) {
//     callback(null, response(200, {type: 'updateToken'}));
// }

export const updateToken = parseRequest(updateTokenMethod);
export const signIn = parseRequest(signInMethod);
export const signOutGlobal = parseRequest(signOutGlobalMethod);
export const user = parseRequest(userMethod);

// export function signOut(httpEvent: Object, lambdaContext: Object, callback: Function) {
//     callback(null, response(200, {type: 'signOut'}));
// }
// export function signUp(httpEvent: Object, lambdaContext: Object, callback: Function) {
//     callback(null, response(200, {type: 'signUp'}));
// }
// export function confirmRegistration(httpEvent: Object, lambdaContext: Object, callback: Function) {
//     callback(null, response(200, {type: 'confirmRegistration'}));
// }
// export function resendConfirmationCode(httpEvent: Object, lambdaContext: Object, callback: Function) {
//     callback(null, response(200, {type: 'resendConfirmationCode'}));
// }
