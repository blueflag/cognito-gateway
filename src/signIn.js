/* @flow */
import {
    AuthenticationDetails,
    CognitoUser
} from 'amazon-cognito-identity-js';

import Pool from './userPool';
import {usernameAndPasswordRequired} from './error';
import {GromitError} from 'gromit';
import formatUsername from './util/formatUsername';

export default async function signIn(request: Object): Promise<{statusCode: number, body: Object}> {

    return new Promise((resolve: Function, reject: Function): void => {

        const {username, password} = request.body;

        if(!username || !password) {
            return reject(usernameAndPasswordRequired);
        }

        const authenticationDetails = new AuthenticationDetails({
            Username: formatUsername(username),
            Password: password
        });

        const user = new CognitoUser({
            Username: formatUsername(username),
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


                resolve({statusCode: 200, body: result});
            },
            onFailure(error: Object) {
                reject(GromitError.wrap(error));
            },
            mfaRequired() {
                reject(GromitError.notImplemented('MFA support has not been implemented yet'));
            }
        });
    });

}

