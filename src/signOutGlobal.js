/* @flow */

import Pool from './userPool';
import {GromitError} from 'gromit';

export default function signOut(request: Object): Promise<{statusCode: number, body: Object}> {

    return new Promise((resolve: Function, reject: Function): void => {
        if(!request.token) return reject(GromitError.unauthorized());

        Pool.client.makeUnauthenticatedRequest(
            'globalSignOut',
            {
                AccessToken: request.token
            },
            (err: Object): void => {
                if (err) {
                    return reject(GromitError.wrap(err));
                }
                return resolve({statusCode: 200, body: {status: 'success'}});
            }
        );
    });

}

