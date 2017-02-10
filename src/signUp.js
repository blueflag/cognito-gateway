/* @flow */
import {CognitoUserAttribute} from 'amazon-cognito-identity-js';
import Pool from './userPool';
import {usernameAndPasswordRequired} from './error';

export default function signUp(request: Object, response: Function) {
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

    Pool.signUp(username, password, attributeList, null, (err: Object, result: Object) => {
        if (err) {
            return response(err.statusCode, err);
        }

        return response(200, result);
    });
}

