/* @flow */
import {CognitoUser} from 'amazon-cognito-identity-js';
import Pool from './userPool';
import {usernameRequired} from './error';

export default function signUpConfirmResend(request: Object, response: Function) {
    var {username} = request.body;

    if(!username) {
        return response(401, usernameRequired);
    }

    const user = new CognitoUser({
        Username: username,
        Pool
    });

    user.resendConfirmationCode((err: Object, result: Object) => {
        if (err) {
            return response(err.statusCode, err);
        }

        return response(200, {status: 'success'});
    });
}

