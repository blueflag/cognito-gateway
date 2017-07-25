/* @flow */
import {CognitoUserAttribute} from 'amazon-cognito-identity-js';
import Pool from './userPool';
import {usernameAndPasswordRequired} from './error';
import {GromitError} from 'gromit';

export default async function signUp(request: Object): Promise<{statusCode: number, body: Object}> {

    return new Promise((resolve: Function): void => {
        var {username, password, attributes} = request.body;

        if(!username || !password) {
            return resolve({statusCode: 401, body: usernameAndPasswordRequired});
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
                return resolve({statusCode: err.statusCode, body: GromitError.wrap(err)});
            }

            // Delete password from response
            delete request.body.password;
            return resolve({statusCode: 200, body: {
                user: request.body
            }});
        });
    });

}

