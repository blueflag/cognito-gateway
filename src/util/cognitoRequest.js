/* @flow */
import Pool from '../userPool';
import {GromitError} from 'gromit';

export default function cognitoRequest(requestString: string, bodyCreator: Function): Function {
    return (request: Object, response: Function) => {
        Pool.client.makeUnauthenticatedRequest(
            requestString,
            bodyCreator({
                pool: Pool,
                request,
                response
            }),
            (err: Object, data: Object): Object => {
                if (err) {
                    return response(err.statusCode, GromitError.wrap(err));
                }

                if(data && Object.keys(data).length > 0 && data.constructor === Object) {
                    return response(200, data);
                }

                return response(200, {status: 'success'});
            }
        );
    };
}
