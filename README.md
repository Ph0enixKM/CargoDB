<div align="center">
  <img src="arts/logo-banner.png" width="500">
</div>

# CargoDB

CargoDB is a database which uses filesystem to store data in files (cargos). It provides really simple API and omits bullshit solutions that make your code even more complex.

# API 🎍

First of all you must create the storage.
Actually you can create as many storages as you want.

```js
import Cargo  from 'cargodb'
const Cargo = require('cargodb')

const storage = new Cargo('my_storage')
```

You can also provide a path parameter which can point some other place in your directory
(because right now it's initing in the root of your project)

```js
const storage = new Cargo('my_storage','/absolute/path/to/create/storage')

// Path from root of the project
const storage = new Cargo('my_storage','~/path/to/dir/from/root')
```

## Static Cargos 🚛

Trucks are basically what you would need 
for instance when writing an Electron app.

Trucks behave the same way as JavaScript's **localStorage** does.
You can just *get item* and *set item*.

```js
// Setting item
storage.set('key', 'value')

// Getting item
let result = storage.get('key')
```

#### Important note ⚓

Static cargo name (and collection names) shall match the following regular expression: `/^[A-Za-z0-9@$\-#%&_()\[\]{}]+$/`. 

## Cargo Collections 🚢

Cargo collections are really just collections of data. They behave similarly to the way for instance *MongoDB*  does. These can store big number of cargos and they provide really convenient methods on manipulating the data.

You can create a collection with provided schema or without.

```js
// Creating collection without schema
storage.create('articles')
```

However... Creating collections using schema is highly recommended. The reason is that they can be much more optimized.

```js
// Create collection with a schema
storage.create('articles', (data, cache, refer) => ({
    title: cache('Untitled Article'),
    content: data('Lorem ipsum...'),
    tags: refer([]),
    photos: {
        name: cache('Untitled Photo'),
        data: data(''),
        resolution: data([0, 0]),
        author: refer()
    }
}))

// You can create a collection with schema written in cargo schema language
storage.create('articles', `
    title = 'Untitled Article' cache
    age = 20
    date = 0
    achievements = [refer]
    photos:
        name = 'Untitled Photo' cache
        data = ''
        resolution = [0, 0]
        author = <refer>
`)

// or you can point cargo to used directory containing schemas saved in files
storage.createFrom('/path/to/schemas')

/*
 schemas
 |- users.cargosl
 |- photos.cargosl
*/
```

Accessing such ship can be done using *in* method

```js
storage.in('articles')
```

Let's put some cargo into our ship:

```js
// Add a Cargo to the collection
// The method returns the newly 
// created cargo's ID
storage.in('users').add({
    name: 'Joe',
    age: 20,
    dev: true
})
```

From now on we can basically do whatever we want with the data inside of the ships. Here are some usage examples:

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

## Rusty Containers 🗝️

Rusty containers are basically files that are corrupted in some way. When cargo finds one it changes given file extension to **.rusty.cargo**. If you want to handle those situation, you can listen to a "rusty" event dispatched by cargo instance. Remember that listening to rusty event removes errors from the console.

```js
storage.onRusty(path => {
    console.log(`My cargo file has been corrupted ${path}`)
    // Remove the file / Fix the file
})
```

<div align="center">
    <br>
    <img src="arts/logo.png" width="200">
</div>
