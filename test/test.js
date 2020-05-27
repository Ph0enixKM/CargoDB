const fs = require('fs')
const path = require('path')
const Cargo = require('./dist/cargodb')

// Create a new storage, you can have them multiple
let storage = new Cargo('storage', '~/test')
storage.onRusty(() => {})
start()
    
// The ready set go function
async function start() {
    // Set Item
    let v1 = await storage.set('forename', 'James')
    let v2 = await storage.set('surname', 'Smith')
    equal('Setting values works correctly', v1 + v2, 2)

    // Get undefined item
    let undef = storage.get('beep-boop')
    equal('Gets non-existing item from storage', undef, null)

    // Mess with data
    fs.writeFileSync(process.env.PWD + '/test/storage/forename.cargo', 'Joe')
    fs.writeFileSync(process.env.PWD + '/test/storage/hello.cargo', 'World')

    // Try to save the data that is messed up
    let allGood1 = await storage.set('forename', 'Joe')
    equal('Error when saving in corrupted cargo', allGood1, false)

    // Try to get the data that is messed up
    let allGood2 = await storage.get('hello')
    equal('Error on getting data from corrupted cargo', allGood2, null)

    // Get item
    let surname = storage.get('surname')
    let forename = storage.get('forename')
    equal('Gets surname from storage', typeof surname, 'string')
    equal('Gets forename from storage', typeof surname, 'string')

    // MAKE LIB SUPPORT FOR THAT

    // // Invalid name throw
    // equal('I can\'t use invalid key syntax to access data', () => {
    //     expect(async () => await storage.set('text me', 'tonight')).toThrow()
    //     expect(() => storage.get('text me')).toThrow()
    // })

    log(forename + ' ' + surname)

    // ---COLLECTIONS --- 

    // Create storage
    storage.create('users')

    // Create a cargo
    let myID = await storage.in('users').add({
        name: 'Phoenix',
        age: 20,
        pass: '123456'
    })

    // Get a cargo by ID
    let getUser = storage.in('users').get(myID)

    // Filter cargos and find the desired ones
    let users = storage.in('users').find(user => user.age > 18)

    // Overwrite a cargo
    let overwrited = await storage.in('users').set(myID, {
        name: 'Phoenix',
        age: 20,
        gender: 'male'
    })

    // Update cargo with additional values
    // or overwrite existing ones
    let updated = await storage.in('users').update(myID, {
        dev: true,
        gender: undefined
    })
    
    // Remove a cargo by id
    let removed = await storage.in('users').remove(myID)

    // Adding cargos to a collection
    equal('I can add a cargo to a collection', typeof myID, 'string')

    // Getting cargos from a collection
    equal('I can get a cargo from a collection', typeof getUser, 'object')

    // Finding cargos from a collection
    equal('I can find cargos from a collection', users.length, 1)

    // Setting cargos in a collection
    equal('I can set cargos in a collection', typeof overwrited, 'string')

    // Updating cargos in a collection
    equal('I can update cargos in a collection', typeof updated, 'string')

    // Removing cargos from a collection
    equal('I can remove cargos from a collection', typeof removed, 'string')

}