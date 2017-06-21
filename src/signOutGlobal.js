/* @flow */

import Pool from './userPool';

export default function signOut(request: Object, response: Function) {
    var [, token] = request.headers.Authorization.split(' ');

    Pool.client.makeUnauthenticatedRequest(
        'globalSignOut',
        {
            AccessToken: token
        },
        (err: Object): void => {
            if (err) {
                return response(err.statusCode, err);
            }
            return response(200, {status: 'success'});
        }
    );

}

