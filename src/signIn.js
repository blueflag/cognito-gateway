/* @flow */
import {
    AuthenticationDetails,
    CognitoUser
} from 'amazon-cognito-identity-js';

import Pool from './userPool';
import {usernameAndPasswordRequired} from './error';
import {GromitError} from 'gromit';

export default async function signIn(request: Object, response: Function): Promise<>{
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
        async onSuccess(session: Object): Promise<> {
            const accessToken = session.getAccessToken().getJwtToken();
            const idToken = session.getIdToken().getJwtToken();
            const refreshToken = session.getRefreshToken().token;

            const result = {
                accessToken,
                refreshToken,
                idToken,
                time: Math.round(Date.now() / 1000)
            };


            response(200, result);
        },
        onFailure(error: Object) {
            response(error.statusCode, GromitError.wrap(error));
        },
        mfaRequired() {
            response(501, GromitError.notImplemented('MFA support has not been implemented yet'));
        }
    });
}

