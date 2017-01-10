/* @flow */
import {CognitoUser} from 'amazon-cognito-identity-js';
import Pool from './userPool';

export default function confirmRegistration(request: Object, response: Function) {
    var {username, verificationCode} = request.body;

    const user = new CognitoUser({
        Username: username,
        Pool
    });

    user.confirmRegistration(verificationCode, true, (err: Object, result: Object) => {
        if (err) {
            response(err.statusCode, err);
        }

        response(200, result);
    });
}

