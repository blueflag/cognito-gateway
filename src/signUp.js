/* @flow */
import {CognitoUserAttribute} from 'amazon-cognito-identity-js';
import Pool from './userPool';
import {usernameAndPasswordRequired} from './error';

export default async function signUp(request: Object, response: Function, config: Object): Promise<> {
    var {username, password, attributes} = request.body;

    if(!username || !password) {
        return response(401, usernameAndPasswordRequired);
    }

    if(config.preSignUp) {
        try {
            await config.preSignUp(request.body);
        } catch(err) {
            return response(err.statusCode || 500, {message: err.message});
        }
    }

    const attributeList = Object
        .keys(attributes)
        .map((key: string): Object[] => {
            return new CognitoUserAttribute({
                Name: key, Value: attributes[key]
            });
        });

    Pool.signUp(username, password, attributeList, null, async (err: Object, result: Object): Promise<> => {
        if (err) {
            return response(err.statusCode, err);
        }

        if(config.postSignUp) {
            try {
                await config.postSignUp(request.body, result);
            } catch(err) {
                return response(err.statusCode || 500, {message: err.message});
            }
        }
        // Delete password from response
        delete request.body.password;
        return response(200, {
            user: request.body
        });
    });
}

