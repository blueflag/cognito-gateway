/* @flow */
import {
    CognitoUserPool,
    AuthenticationDetails,
    CognitoUser,
    CognitoUserAttribute
} from 'amazon-cognito-identity-js';

import Pool from './userPool';
import {userNotFound} from './error';
import jsonwebtoken from 'jsonwebtoken';


export default function signOut(request: Object, response: Function) {
    var [, token] = request.headers.Authorization.split(' ');

    Pool.client.makeUnauthenticatedRequest(
        'globalSignOut',
        {
            AccessToken: token
        },
        (err: Object) => {
            if (err) {
                response(err.statusCode, err);
            }
            response(200, {status: 'success'});
        }
    );

    // user.getSession((err, session) => {
    //     response(200, session);
    // });

    // response(200, user);
    // const {username, password} = request.body;

    // const authenticationDetails = new AuthenticationDetails({
    //     Username: username,
    //     Password: password
    // });
    // const user = new CognitoUser({
    //     Username: username,
    //     Pool
    // });

    // user.authenticateUser(authenticationDetails, {
    //     onSuccess(session: Object) {
    //         const token = session.getAccessToken().getJwtToken();

    //         response(200, {
    //             token,
    //             time: Math.round(Date.now() / 1000)
    //         });
    //     },
    //     onFailure(error: Object) {
    //         response(error.statusCode, error);
    //     },
    //     mfaRequired() {
    //         response(500, new Error('MFA support has not been implemented yet'));
    //     }
    // });
}

