# SneakyAPI
The official API for SneakyHub <br>

##### The ~~archives~~ docs are incomplete

## Classes
### `SneakyAPI`
#### Properties
##### `sneakyhub_session`
The session cookie passed in the `login()` method

##### `_token`
The csrf-token used in requests

##### `user`
An object having basic profile info about the logged in user \[taken from `\profile`\]
```js
{
  username: , 
  email: ,
  credits: ,
  verifiedDiscord: , // boolean: whether the user has a verified Discord 
  verifiedEmail: ,// boolean: whether the user has a verified email
  client: // points back to the client this user belongs to
}
```
##### `servers`
An object of `ServerManager` class that manages servers for the client

#### Methods
##### `login(sneakyhub_session)`
`sneakyhub_session` : A cookie you can get after logging in on the SneakyHub dashboard <br>
**NOTE: the csrf-token is available only after login is complete. Always use login with await/.then()**
