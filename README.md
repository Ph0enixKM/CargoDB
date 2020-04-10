<div align="center">
  <img width="200" height="200" src="https://raw.githubusercontent.com/Ph0enixKM/CargoDB/master/cargo.png">
  <br>
  <br>
</div>

# CargoDB

CargoDB is a database which can be used as a lightweight standalone 
storage with really simple API.

# API

First of all you must create the storage.
Actually you can create as many storages as you want.

```js
const CargoDB = require('cargodb')

const storage = new CargoDB('my_storage')
```

You can also provide a path parameter to the storage
(because right now it's initing in the *node_modules* and you probably don't really want it)

```js
const storage = new CargoDB('my_storage','path/to/storage')
```

## Static Cargos

Static cargos are basically what you would need 
for instance when writing an Electron app.


Static cargos behave the same way as JavsScript's **localStorage** does.
You can just *get item* and *set item*.

```js
storage.setItem('key','value')

let result = storage.getItem('key')
```

#### Important note:

When cargo can't find the data under the key it returns **undefined** 
however when the data container (*.cargo* file) happens to be corrupted
it returns **null** when getting data and **false** when setting data.

## Freighters

Freighters are really just collections of data. They behave similarly to the way for instance *MongoDB*  does. These can store big number of cargos and they provide really convenient methods on manipulating the data.



Accessing such freighter can be done using *in* method

```js
storage.in('articles')
```

Let's put some cargo into our freighter:

```js
// Add a Cargo to the Freighter
// The method returns the newly 
// created cargo's ID
storage.in('users').add({
    name: 'Joe',
    age: 20,
    dev: true
})
```

From now on we can basically do whatever we want with the data inside of the freighters. Here are some usage examples:

```js
const users = storage.in('users')

// Add new cargo file.
const id = users.add({
    name: 'Ann',
    age: 19,
    dev: false
})

// Get a cargo by ID.
users.get(id)

// Find cargos by criteria.
// If function returns true,
// then the cargo fits the criteria.
// Get all users older or equal to 18.
users.find(user => {
    return user.age >= 18
})

// Overwrites the whole cargo
// with this new one.
users.set(id, {
    name: 'Anna',
    age: 20,
    happy: true
})

// Updates only the fields provided
// (undefined value removes the property).
users.update(id, {
    age: 21,
    happy: undefined,
    dev: true    
})

// Remove a cargo by ID.
users.remove(id)
```

#### Important note:

When cargo can't find the cargo under given ID it returns **undefined**. 
however when the data container (*.cargo* file) happens to be corrupted
it returns **null** after completing operation *(find method is an exception - it still logs error however)*
