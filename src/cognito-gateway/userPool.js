/* @flow */
import {CognitoUserPool} from 'amazon-cognito-identity-js';

const {
    AWS_USER_POOL_ID,
    AWS_USER_POOL_CLIENT_ID
} = process.env;

const Pool = new CognitoUserPool({
    UserPoolId: AWS_USER_POOL_ID,
    ClientId: AWS_USER_POOL_CLIENT_ID,
    Paranoia: 7
});

export default Pool;
