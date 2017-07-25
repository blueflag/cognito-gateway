/* @flow */
import {CognitoUserAttribute} from 'amazon-cognito-identity-js';
import Pool from './userPool';
import {usernameAndPasswordRequired} from './error';
import {GromitError} from 'gromit';

export default async function signUp(request: Object, response: Function): Promise<> {
    var {username, password, attributes} = request.body;

    if(!username || !password) {
        return response(401, usernameAndPasswordRequired);
    }

    const attributeList = Object
        .keys(attributes)
        .map((key: string): Object[] => {
            return new CognitoUserAttribute({
                Name: key, Value: attributes[key]
            });
        });

    Pool.signUp(username, password, attributeList, null, async (err: Object): Promise<> => {
        if (err) {
            return response(err.statusCode, GromitError.wrap(err));
        }

        // Delete password from response
        delete request.body.password;
        return response(200, {
            user: request.body
        });
    });
}

