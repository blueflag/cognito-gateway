# Cognito Gateway API

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

