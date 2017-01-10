/* @flow */
import {CognitoUser} from 'amazon-cognito-identity-js';
import Pool from './userPool';

export default function signUpConfirmResend(request: Object, response: Function) {
    var {username} = request.body;

    const user = new CognitoUser({
        Username: username,
        Pool
    });

    user.resendConfirmationCode((err: Object, result: Object) => {
        if (err) {
            response(err.statusCode, err);
        }

        response(200, {status: 'success'});
    });
}

