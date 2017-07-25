/* @flow */
import Pool from '../userPool';
import {GromitError} from 'gromit';

export default function cognitoRequest(requestString: string, bodyCreator: Function): Function {
    return (request: Object) => new Promise((resolve: Function) => {
        Pool.client.makeUnauthenticatedRequest(
            requestString,
            bodyCreator({
                pool: Pool,
                request
            }),
            (err: Object, data: Object): Object => {
                if (err) {
                    return resolve({statusCode: err.statusCode, body: GromitError.wrap(err)});
                }

                if(data && Object.keys(data).length > 0 && data.constructor === Object) {
                    return resolve({statusCode: 200, body: data});
                }

                return resolve({statusCode: 200, body: {status: 'success'}});
            }
        );
    });
}
