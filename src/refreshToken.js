/* @flow */
import Pool from './userPool';
import {GromitError} from 'gromit';

export default function refreshToken(request: Object, response: Function) {

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
                return response(err.statusCode, GromitError.wrap(err));
            }

            if(data && data.AuthenticationResult) {
                return response(200, {
                    accessToken: data.AuthenticationResult.AccessToken,
                    idToken: data.AuthenticationResult.IdToken
                });
            } else {
                return response(500, GromitError.internal('Refresh token failed', 'REFRESH_TOKEN_FAILED'));
            }
        }
    );
}

