/* @flow */
import {CognitoUser} from 'amazon-cognito-identity-js';
import Pool from './userPool';
import {usernameRequired} from './error';
import {GromitError} from 'gromit';

export default function signUpConfirmResend(request: Object): Promise<{statusCode: number, body: Object}> {
    return new Promise((resolve: Function): void => {
        var {username} = request.body;

        if(!username) {
            return resolve({statusCode: 401, body: usernameRequired});
        }

        const user = new CognitoUser({
            Username: username,
            Pool
        });

        user.resendConfirmationCode((err: Object): void => {
            if (err) {
                return resolve({statusCode: err.statusCode, body: GromitError.wrap(err)});
            }

            return resolve({statusCode: 200, body: {status: 'success'}});
        });
    });
}

