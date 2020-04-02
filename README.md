<div align="center">
  <img width="200" height="200" src="https://raw.githubusercontent.com/Ph0enixKM/CargoDB/master/cargo.png">
  <br>
  <br>
</div>

## CargoDB
Provides quick Local Storage API which can be used to store big data in Electron app.
Browser built-it local storage prevents from storing more than 10MB on client side.
This is why CargoDB has come to life!

### API
First of all you must create the storage.
Actually you can create as many storages as you want (but do you need to?).

```js
const cargodb = require('cargodb')

const storage = new cargodb('my_storage')
```
  
You can also provide a path parameter to the storage
(because right now it's initing in the *node_modules* and you probably don't really want it)
  
```js
const storage = new cargodb('my_storage','path/to/storage')
```
  
Now let's add an Item to storage and get it.
You might notice that syntax is pretty similar to localStorage's one!

```js
storage.setItem('key','value')
    
let result = storage.getItem('key')
```

It all provides you a quick and easy way to store big information which doesn't
need to be secured!

CargoDB also provides data encryption. This can be usefull for keeping sensitive
information safe. Notice that all the encrypted data is stored in one file
called "_hash.crypt"

You have to keep in mind that you have to provide a secret key (16 characters long minimum)
in order to use the functionality.

```js
const storage = new cargodb('my_storage','path/to/storage','this is my secret code which is really long')
```

and then you can just use the following methods:

```js
storage.setItemHash('key','value')
    
let result = storage.getItemHash('key')
```

That's it. That's all it does. Quite easy isn't it?

