/* @flow */
import {CognitoUser} from 'amazon-cognito-identity-js';
import Pool from './userPool';
import {usernameAndVerificationCodeRequired} from './error';
import {GromitError} from 'gromit';

export default function signUpConfirm(request: Object, response: Function): void {
    var {username, verificationCode} = request.body;

    if(!username || !verificationCode) {
        return response(401, usernameAndVerificationCodeRequired);
    }

    const user = new CognitoUser({
        Username: username,
        Pool
    });

    user.confirmRegistration(verificationCode, true, (err: Object): void => {
        if (err) {
            return response(err.statusCode, GromitError.wrap(err));
        }

        return response(200, {status: 'success'});
    });
}

