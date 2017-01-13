/* @flow */
import {CognitoUser} from 'amazon-cognito-identity-js';
import Pool from './userPool';
import {usernameAndVerificationCodeRequired} from './error';

export default function signUpConfirm(request: Object, response: Function) {
    var {username, verificationCode} = request.body;

    if(!username || !verificationCode) {
        response(401, usernameAndVerificationCodeRequired);
    }

    const user = new CognitoUser({
        Username: username,
        Pool
    });

    user.confirmRegistration(verificationCode, true, (err: Object) => {
        if (err) {
            response(err.statusCode, err);
        }

        response(200, {status: 'success'});
    });
}

