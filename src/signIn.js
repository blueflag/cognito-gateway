/* @flow */
import {
    AuthenticationDetails,
    CognitoUser
} from 'amazon-cognito-identity-js';

import Pool from './userPool';
import {usernameAndPasswordRequired} from './error';

export default async function signIn(request: Object, response: Function, config: Object): Promise<>{
    const {username, password} = request.body;

    if(!username || !password) {
        return response(401, usernameAndPasswordRequired);
    }

    if(config.preAuthentication) {
        try {
            await config.preAuthentication(request.body);
        } catch(err) {
            return response(err.statusCode || 500, {message: err.message});
        }
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

            if(config.postAuthentication) {
                try {
                    await config.postAuthentication(result);
                } catch(err) {
                    return response(err.statusCode || 500, {message: err.message});
                }
            }

            response(200, result);
        },
        onFailure(error: Object) {
            response(error.statusCode, error);
        },
        mfaRequired() {
            response(500, new Error('MFA support has not been implemented yet'));
        }
    });
}

