/* @flow */
import {
    AuthenticationDetails,
    CognitoUser
} from 'amazon-cognito-identity-js';

import Pool from './userPool';
import {usernameAndPasswordRequired} from './error';

export default function signIn(request: Object, response: Function) {
    const {username, password} = request.body;

    if(!username || !password) {
        return response(401, usernameAndPasswordRequired);
    }

    const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password
    });
    const user = new CognitoUser({
        Username: username,
        Pool
    });

    user.authenticateUser(authenticationDetails, {
        onSuccess(session: Object) {
            const accessToken = session.getAccessToken().getJwtToken();
            const idToken = session.getIdToken().getJwtToken();
            const refreshToken = session.getRefreshToken().token;

            return response(200, {
                accessToken,
                refreshToken,
                idToken,
                time: Math.round(Date.now() / 1000)
            });
        },
        onFailure(error: Object) {
            return response(error.statusCode, error);
        },
        mfaRequired() {
            return response(500, new Error('MFA support has not been implemented yet'));
        }
    });
}

