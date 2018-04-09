## CargoDB
Provides quick Local Storage API which can be used to store big data in Electron app.
Browser built-it local storage prevents from storing more than 10MB on client side.
This is why CargoDB has come to live!

### API
First of all you must create the storage.
Actually you can create as many storages as you want (but do you need to?).

```js
const cargodb = require('cargodb')

const storage = new cargodb('my_storage')
```
  
You can also provide a path parameter to the storage:
  
```js
const storage = new cargodb('my_storage','path/to/storage')
```
  
Now let's add an Item to storage and get it.
You might notice that syntax is pretty similar to localStorage's one!

```js
storage.setItem('key','value', function (error) {
   // Callback
})
    
storage.getItem('key', function (error, item) {
  // Callback
})
```

That's it. That's all it does. Quite easy isn't it?
It all provides you a quick and easy way to store big information which doesn't
need to be secured!
