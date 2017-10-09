/* @flow */
import {CognitoUser} from 'amazon-cognito-identity-js';
import Pool from './userPool';
import {usernameAndVerificationCodeRequired} from './error';
import {GromitError} from 'gromit';
import formatUsername from './util/formatUsername';

export default function signUpConfirm(request: Object): Promise<{statusCode: number, body: Object}> {

    return new Promise((resolve: Function, reject: Function): void => {
        var {username, verificationCode} = request.body;

        if(!username || !verificationCode) {
            return reject(usernameAndVerificationCodeRequired);
        }

        const user = new CognitoUser({
            Username: formatUsername(username),
            Pool
        });

        user.confirmRegistration(verificationCode, true, (err: Object): void => {
            if (err) {
                return reject(GromitError.wrap(err));
            }

            return resolve({statusCode: 200, body: {status: 'success'}});
        });
    });
}

