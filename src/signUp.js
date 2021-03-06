/* @flow */
import {CognitoUserAttribute} from 'amazon-cognito-identity-js';
import Pool from './userPool';
import {usernameAndPasswordRequired} from './error';
import {GromitError} from 'gromit';
import formatUsername from './util/formatUsername';

export default async function signUp(request: Object): Promise<{statusCode: number, body: Object}> {

    return new Promise((resolve: Function, reject: Function): void => {
        var {username, password, attributes} = request.body;

        if(!username || !password) {
            return reject(usernameAndPasswordRequired);
        }

        const attributeList = Object
            .keys(attributes)
            .map((key: string): Object[] => {
                return new CognitoUserAttribute({
                    Name: key, Value: attributes[key]
                });
            });

        Pool.signUp(formatUsername(username), password, attributeList, null, async (err: Object, result: Object): Promise<> => {
            if (err) {
                return reject(GromitError.wrap(err));
            }

            const delivery = result.CodeDeliveryDetails || {};

            // Delete password from response
            delete request.body.password;
            return resolve({statusCode: 200, body: {
                user: {
                    ...request.body,
                    username: formatUsername(username),
                    sub: result.userSub
                },
                verificationAttribute: delivery.AttributeName,
                verificationMedium: delivery.DeliveryMedium,
                verificationValue: delivery.Destination
            }});
        });
    });

}

