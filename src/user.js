/* @flow */
import Pool from './userPool';

export function userGet(request: Object, response: Function) {
    Pool.client.makeUnauthenticatedRequest(
        'getUser',
        {
            AccessToken: request.token
        },
        (err: Object, data: Object) => {
            if (err) {
                response(err.statusCode, err);
            }
            response(200, data);
        }
    );
}


export function userDelete(request: Object, response: Function) {
    Pool.client.makeUnauthenticatedRequest(
        'deleteUser',
        {
            AccessToken: request.token
        },
        (err: Object) => {
            if (err) {
                response(err.statusCode, err);
            }
            response(200, {status: 'success'});
        }
    );
}

