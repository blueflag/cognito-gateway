# Cognito Gateway API

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
    preAuthentication: ({username, password}) => {}, // custom pre auth logic
    postAuthentication: ({accessToken, refreshToken, idToken}) => {}, // custom post auth logic
    preSignUp: ({username, password, attributes}) => {}, // custom pre sign up logic
    postSignUp: ({username, password, attributes}, result) => {}, // custom post sign up logic
});

```

## Config


#### `headers`: `Object<string, string>`

An object containing any headers to be added to the http response.

### Hooks

Hooks are called at various points throughout the signup and authentication process. They can be used to add custom authentication or perform additional actions in response to authentication or signup. All hooks are async so you can return a promise. If the promise is rejected or an error is thrown during the hook execution then cognitoGateway will create a http response from the `err.statusCode` and `err.message` properies of the promise rejection payload or thrown error.

#### `preAuthentication`: `({username, password}) => Promise<void>`

Called before authentication is attempted.

#### `postAuthentication`: `({accessToken, refreshToken, idToken}) => Promise<void>`

Called after authentication is attempted.


#### `preSignUp`: `({username, password, attributes}) => Promise<void>`

Called before user has signed up. Can be used to perform additional validation on attributes or to block certain users.


#### `postSignUp`: `({username, password, attributes}, result: CognitoAuthenticationResult) => Promise<void>`

Called after a user has successfully signed up. See [here](https://github.com/aws/amazon-cognito-identity-js/blob/master/src/CognitoUserPool.js#L96) for info on `CognitoAuthenticationResult`


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
responseBody: cognitoUser
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
    status: string
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

