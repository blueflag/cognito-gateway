/* @flow */
import Pool from './userPool';

export default function user(request: Object, response: Function) {
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

