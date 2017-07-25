/* @flow */

import Pool from './userPool';
import {GromitError} from 'gromit';

export default function signOut(request: Object, response: Function) {
    var [, token] = request.headers.Authorization.split(' ');

    Pool.client.makeUnauthenticatedRequest(
        'globalSignOut',
        {
            AccessToken: token
        },
        (err: Object): void => {
            if (err) {
                return response(err.statusCode, GromitError.wrap(err));
            }
            return response(200, {status: 'success'});
        }
    );

}

