const cargo = require('./build.js')

let path = __dirname + '/dir/storages'
let name = 'storage'

// Create a new storage, you can have them multiple
let storage = new cargo(name, path, /*'dwadwadwadwadwadwadwadwadawdawdadwadawdwadwa'*/)
/*
// Set Item
storage.setItemHash('age', 18)

// Get item
let age = storage.getItemHash('age')

console.log(age)
*/

// Set Item
storage.setItem('surname', 'James')
storage.setItem('forename', 'Smith')

// Get item
let surname = storage.getItem('surname')
let forename = storage.getItem('forename')

console.log(surname + ' ' + forename)