const cargo = require('./build.js')

let path = __dirname + '/dir/storages'
let name = 'storage'

// Create a new storage, you can have them multiple
let storage = new cargo(name, path, 'dwadwadwadwadwadwadwadwadawdawdadwadawdwadwa')

// Set Item
storage.setItemHash('age', 18)

// Get item
let age = storage.getItemHash('age')

console.log(age)