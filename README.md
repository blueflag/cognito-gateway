# Cognito Gateway API
[![cognito-gateway npm](https://img.shields.io/npm/v/cognito-gateway.svg?style=flat-square)](https://www.npmjs.com/package/cognito-gateway)
[![cognito-gateway circle](https://img.shields.io/circleci/project/github/blueflag/cognito-gateway.svg?style=flat-square)](https://circleci.com/gh/blueflag/cognito-gateway)

## Usage

```js
import cognitoGateway from 'cognito-gateway';

export const {
    signIn,
    signUp,
    signOutGlobal,
    signUpConfirm,
    signUpConfirmResend,
    refreshToken,
    changePassword,
    forgotPasswordRequest,
    forgotPasswordConfirm,
    userGet,
    userDelete
} from cognitoGateway({
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    preSignIn: (requestBody) => requestBody, // custom pre auth logic
    postSignIn: (responseBody) => responseBody, // custom post auth logic
    // more hooks
});

```

## Config


#### `headers`: `Object<string, string>`

An object containing any headers to be added to the http response.

### Hooks

Hooks are called at various points throughout the signup and authentication process. They can be used to add custom authentication or perform additional actions in response to authentication or signup. All hooks are async so you can return a promise. The promise should resolve to an object in the same structure as the request or response body. If the promise is rejected or an error is thrown during the hook execution then cognitoGateway will create a http response from the `err.statusCode` and `err.message` properies of the promise rejection payload or thrown error.

The available hooks are:

```js
preSignIn(
    requestBody: {
        username: string,
        password: string
    },
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<requestBody>

postSignIn(
    error: ?GromitError,
    responseBody: ?{
        accessToken: string,
        refreshToken: string,
        idToken: string,
        time: number
    },
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<responseBody>

preSignUp(
    requestBody: {
        username: string,
        password: string,
        attributes: Object
    },
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<requestBody>

postSignUp(
    error: ?GromitError,
    responseBody: ?{
        user: {
            username: string,
            attributes: Object
        }
    },
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<responseBody>

preSignOutGlobal(
    requestBody: {},
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<requestBody>

postSignOutGlobal(
    error: ?GromitError,
    responseBody: ?{status: 'success'},
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<responseBody>

preSignUpConfirm(
    requestBody: {
        username: string,
        verificationCode: string
    },
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<requestBody>

postSignUpConfirm(
    error: ?GromitError,
    responseBody: ?{status: 'success'},
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<responseBody>

preSignUpConfirmResend(
    requestBody: {
        username: string
    },
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<requestBody>

postSignUpConfirmResend(
    error: ?GromitError,
    responseBody: ?{status: 'success'},
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<responseBody>

preRefreshToken(
    requestBody: {refreshToken: string},
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<requestBody>

postRefreshToken(
    error: ?GromitError,
    responseBody: ?{
        accessToken: string,
        idToken: string
    },
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<responseBody>

preChangePassword(
    requestBody: {
        password: string,
        newPassword: string,
        accessToken: string
    },
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<requestBody>

postChangePassword(
    error: ?GromitError,
    responseBody: ?{status: 'success'},
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<responseBody>

preForgotPasswordRequest(
    requestBody: {
        username: string
    },
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<requestBody>

postForgotPasswordRequest(
    error: ?GromitError,
    responseBody: ?{status: 'success'},
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<responseBody>

preForgotPasswordConfirm(
    requestBody: {
        username: string,
        confirmationCode: string,
        password: string
    },
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<requestBody>

postForgotPasswordConfirm(
    error: ?GromitError,
    responseBody: ?{status: 'success'},
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<responseBody>

preUserGet(
    requestBody: {},
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<requestBody>

postUserGet(
    error: ?GromitError,
    responseBody: ?{status: 'success'},
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<responseBody>

preUserDelete(
    requestBody: {},
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<requestBody>

postUserDelete(
    error: ?GromitError,
    responseBody: ?{status: 'success'},
    httpEvent: AWSLambdaEvent,
    lambdaContext: AWSLambdaContext
) => Promise<responseBody>

```


## Auth

### /signIn [post]
Request a set of tokens via a username and password

```yaml
path: /signIn
method: post
requestBody:
    username: string
    password: string
responseBody:
    accessToken: string
    refreshToken: string
    idToken: string
    time: int
```


### /refreshToken [post]
Request a new access and id token via a refresh token

```yaml
path: /refreshToken
method: post
requestBody:
    refreshToken: string
responseBody:
    accessToken: string
    idToken: string
```


### /signOutGlobal [post]
Sign a user out from all services.

```yaml
path: /signOutGlobal
method: post
headers:
    Authorization: 'Bearer {accessToken}'
responseBody:
    status: string
```


### /signUp [post]
Request the creation of a new user
```yaml
path: /signUp
method: post
requestBody:
    username: string
    password: string
    attributes: array
responseBody: 
    user: cognitoUser
    verificationAttribute: string
    verificationMedium: string
    verificationValue: string

```


### /signUpConfirm [post]
Confirm a user via a verification code
```yaml
path: /signUpConfirm
method: post
requestBody:
    username: string
    verificationCode: string
responseBody:
    status: string
```


### /signUpConfirmResend [post]
Request a new verification code via username
```yaml
path: /signUpConfirmResend
method: post
requestBody:
    username: string
responseBody:
    verificationAttribute: string
    verificationMedium: string
    verificationValue: string
```


## Users


### /user [get]
Request user information via a token
```yaml
path: /user
method: get
headers:
    Authorization: 'Bearer {accessToken}'
responseBody: CognitoUser
```


### /user [delete]
Delete a user via a token
```yaml
path: /user
method: delete
headers:
    Authorization: 'Bearer {accessToken}'
responseBody:
    status: string
```

