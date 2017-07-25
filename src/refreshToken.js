/* @flow */
import Pool from './userPool';
import {GromitError} from 'gromit';

export default function refreshToken(request: Object): Promise<{statusCode: number, body: Object}> {
    return new Promise((resolve: Function): void => {
        if(!request.body.refreshToken) return resolve({statusCode: 401, body: GromitError.unauthorized()});

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
                    return resolve({statusCode: err.statusCode, body: GromitError.wrap(err)});
                }

                if(data && data.AuthenticationResult) {
                    return resolve({statusCode: 200, body: {
                        accessToken: data.AuthenticationResult.AccessToken,
                        idToken: data.AuthenticationResult.IdToken
                    }});
                } else {
                    return resolve({statusCode: 500, body: GromitError.internal('Refresh token failed', 'REFRESH_TOKEN_FAILED')});
                }
            }
        );
    });
}

