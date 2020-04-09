<div align="center">
  <img width="200" height="200" src="https://raw.githubusercontent.com/Ph0enixKM/CargoDB/master/cargo.png">
  <br>
  <br>
</div>

# CargoDB

Provides quick Local Storage API which can be used to store big data in Electron app.
Browser built-it local storage prevents from storing more than 10MB on client side.
This is why CargoDB has come to life!

## API

First of all you must create the storage.
Actually you can create as many storages as you want (but do you need to?).

```js
const CargoDB = require('cargodb')

const storage = new CargoDB('my_storage')
```

You can also provide a path parameter to the storage
(because right now it's initing in the *node_modules* and you probably don't really want it)

```js
const storage = new CargoDB('my_storage','path/to/storage')
```

Now let's add an Item to storage and get it.
You might notice that syntax is pretty similar to localStorage's one.

```js
storage.setItem('key','value')

let result = storage.getItem('key')
```

### Important note:

When cargo can't find the data under the key it returns **undefined** 
however when the data container (*.cargo* file) happens to be corrupted
it returns **null** when getting data and **false** when setting data.


