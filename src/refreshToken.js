/* @flow */
import Pool from './userPool';

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
                return response(err.statusCode, err);
            }

            if(data && data.AuthenticationResult) {
                return response(200, {
                    accessToken: data.AuthenticationResult.AccessToken,
                    idToken: data.AuthenticationResult.IdToken
                });
            } else {
                return response(err.statusCode, err);
            }
        }
    );
}

