/* @flow */
import {CognitoUser} from 'amazon-cognito-identity-js';
import Pool from './userPool';
import {usernameRequired} from './error';
import {GromitError} from 'gromit';

export default function signUpConfirmResend(request: Object): Promise<{statusCode: number, body: Object}> {
    return new Promise((resolve: Function, reject: Function): void => {
        var {username} = request.body;

        if(!username) {
            return reject(usernameRequired);
        }

        const user = new CognitoUser({
            Username: username,
            Pool
        });

        user.resendConfirmationCode((err: Object, result: Object): void => {
            if (err) {
                return reject(GromitError.wrap(err));
            }

            const delivery = result.CodeDeliveryDetails || {};

            return resolve({
                statusCode: 200,
                body: {
                    verificationAttribute: delivery.AttributeName,
                    verificationMedium: delivery.DeliveryMedium,
                    verificationValue: delivery.Destination
                }
            });
        });
    });
}

