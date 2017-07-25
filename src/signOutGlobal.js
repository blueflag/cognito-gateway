/* @flow */

import Pool from './userPool';
import {GromitError} from 'gromit';

export default function signOut(request: Object): Promise<{statusCode: number, body: Object}> {

    return new Promise((resolve: Function): void => {
        if(!request.token) return resolve({statusCode: 401, body: GromitError.unauthorized()});

        Pool.client.makeUnauthenticatedRequest(
            'globalSignOut',
            {
                AccessToken: request.token
            },
            (err: Object): void => {
                if (err) {
                    return resolve({statusCode: err.statusCode, body: GromitError.wrap(err)});
                }
                return resolve({statusCode: 200, body: {status: 'success'}});
            }
        );
    });

}

