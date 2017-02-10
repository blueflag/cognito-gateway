/* @flow */
import cognitoRequest from './util/cognitoRequest';

export default cognitoRequest('changePassword', ({request}: Object): Object => {
    return {
        PreviousPassword: request.body.password,
        ProposedPassword: request.body.newPassword,
        AccessToken: request.body.accessToken
    };
});
