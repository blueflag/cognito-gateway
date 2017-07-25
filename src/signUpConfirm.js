/* @flow */
import {CognitoUser} from 'amazon-cognito-identity-js';
import Pool from './userPool';
import {usernameAndVerificationCodeRequired} from './error';
import {GromitError} from 'gromit';

export default function signUpConfirm(request: Object): Promise<{statusCode: number, body: Object}> {

    return new Promise((resolve: Function): void => {
        var {username, verificationCode} = request.body;

        if(!username || !verificationCode) {
            return resolve({statusCode: 401, body: usernameAndVerificationCodeRequired});
        }

        const user = new CognitoUser({
            Username: username,
            Pool
        });

        user.confirmRegistration(verificationCode, true, (err: Object): void => {
            if (err) {
                return resolve({statusCode: err.statusCode, body: GromitError.wrap(err)});
            }

            return resolve({statusCode: 200, body: {status: 'success'}});
        });
    });
}

