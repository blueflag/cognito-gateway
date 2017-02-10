/* @flow */
import cognitoRequest from './util/cognitoRequest';

export const forgotPasswordRequest = cognitoRequest('forgotPassword', ({pool, request}: Object): Object => {
    return {
        ClientId: pool.getClientId(),
        Username: request.body.username
    };
});

export const forgotPasswordConfirm = cognitoRequest('confirmForgotPassword', ({pool, request}: Object): Object => {
    return {
        ClientId: pool.getClientId(),
        Username: request.body.username,
        ConfirmationCode: request.body.confirmationCode,
        Password: request.body.password
    };
});
