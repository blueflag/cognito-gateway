/* @flow */
import cognitoRequest from './util/cognitoRequest';
import formatUsername from './util/formatUsername';

export const forgotPasswordRequest = cognitoRequest('forgotPassword', ({pool, request}: Object): Object => {
    return {
        ClientId: pool.getClientId(),
        Username: formatUsername(request.body.username)
    };
});

export const forgotPasswordConfirm = cognitoRequest('confirmForgotPassword', ({pool, request}: Object): Object => {
    return {
        ClientId: pool.getClientId(),
        Username: formatUsername(request.body.username),
        ConfirmationCode: request.body.confirmationCode,
        Password: request.body.password
    };
});
