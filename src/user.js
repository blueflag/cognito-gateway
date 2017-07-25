/* @flow */
import Pool from './userPool';
import {GromitError} from 'gromit';
export function userGet(request: Object, response: Function) {
    Pool.client.makeUnauthenticatedRequest(
        'getUser',
        {
            AccessToken: request.token
        },
        (err: Object, data: Object): void => {
            if (err) {
                return response(err.statusCode, GromitError.wrap(err));
            }
            return response(200, data);
        }
    );
}


export function userDelete(request: Object, response: Function) {
    Pool.client.makeUnauthenticatedRequest(
        'deleteUser',
        {
            AccessToken: request.token
        },
        (err: Object): void => {
            if (err) {
                return response(err.statusCode, GromitError.wrap(err));
            }
            return response(200, {status: 'success'});
        }
    );
}

