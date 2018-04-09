const cargo = require('./build.js')

let path = __dirname + '/dir/storages'
let name = 'storage'

// Create a new storage, you can have them multiple
let storage = new cargo(name, path)

// Set age item to be 18
storage.setItem('age',18,()=>{
  // Get the age item
  storage.getItem('age',(err,data)=>{
    // Log the item
    console.log(data)
  })
})
