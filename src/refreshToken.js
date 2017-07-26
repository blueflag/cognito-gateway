/* @flow */
import Pool from './userPool';
import {GromitError} from 'gromit';

export default function refreshToken(request: Object): Promise<{statusCode: number, body: Object}> {
    return new Promise((resolve: Function, reject: Function): void => {
        if(!request.body.refreshToken) return reject({statusCode: 401, body: GromitError.unauthorized()});

        Pool.client.makeUnauthenticatedRequest(
            'initiateAuth',
            {
                AuthFlow: 'REFRESH_TOKEN_AUTH',
                ClientId: Pool.getClientId(),
                AuthParameters: {
                    REFRESH_TOKEN: request.body.refreshToken
                }
            },
            (err: Object, data: Object): Object => {
                if (err) {
                    return reject(GromitError.wrap(err));
                }

                if(data && data.AuthenticationResult) {
                    return resolve({statusCode: 200, body: {
                        accessToken: data.AuthenticationResult.AccessToken,
                        idToken: data.AuthenticationResult.IdToken
                    }});
                } else {
                    return reject(GromitError.internal('Refresh token failed', 'REFRESH_TOKEN_FAILED'));
                }
            }
        );
    });
}

