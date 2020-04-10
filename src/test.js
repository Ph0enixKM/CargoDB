const fs = require('fs')
const cargo = require('./build.js')

// Create a new storage, you can have them multiple
let storage = new cargo('storage')

// Set Item
let v1 = storage.setItem('forename', 'James')
let v2 = storage.setItem('surname', 'Smith')
test('Sets values in storage', () => {
    expect(v1 + v2).toBe(2)
})

// Get undefined item
let undef = storage.getItem('beep-boop')
test('Gets non-existing item from storage', () => {
    expect(undef).toBe(undefined)
})

// Mess with data
fs.writeFileSync(__dirname + '/storage/forename.cargo', 'Joe')
fs.writeFileSync(__dirname + '/storage/hello.cargo', 'World')

// Try to save the data that is messed up
let allGood1 = storage.setItem('forename', 'Joe')
test('Error when saving in corrupted cargo', () => {
    expect(allGood1).toBe(false)
})

// Try to get the data that is messed up
let allGood2 = storage.getItem('hello')
test('Error on getting data from corrupted cargo', () => {
    expect(allGood2).toBe(null)
})

// Get item
let surname = storage.getItem('surname')
let forename = storage.getItem('forename')
test('Gets existing items from storage', () => {
    expect(typeof surname).toBe('string')
    expect(typeof forename).toBe('string')
})

// Invalid name throw
test('I can\'t use invalid key syntax to access data', () => {
    expect(() => storage.setItem('text me', 'tonight')).toThrow()
    expect(() => storage.getItem('text me')).toThrow()
})


console.warn('Some errors should be shown above')
console.log(forename + ' ' + surname)

// --- FREIGHTERS --- 

// Create a cargo
let myID = storage.in('users').add({
    name: 'Phoenix',
    age: 20,
    pass: '123456'
})

// Get a cargo by ID
let getUser = storage.in('users').get(myID)

// Filter cargos and find the desired ones
let users = storage.in('users').find(user => user.age > 18)

// Overwrite a cargo
let overwrited = storage.in('users').set(myID, {
    name: 'Phoenix',
    age: 20,
    gender: 'male'
})

// Update cargo with additional values
// or overwrite existing ones
let updated = storage.in('users').update(myID, {
    dev: true,
    gender: undefined
})

// Remove a cargo by id
let removed = storage.in('users').remove(myID)

// Adding cargos to freighters
test('I can add a cargo to a freigher', () => {  
    expect(typeof myID).toBe('string')
})

// Getting cargos from freighters
test('I can get a cargo from a freigher', () => {  
    expect(typeof getUser).toBe('object')
})

// Finding cargos from freighters
test('I can find cargos from a freigher', () => {  
    expect(users.length).toBe(1)
})

// Setting cargos in freighters
test('I can set cargos in a freigher', () => {  
    expect(typeof overwrited).toBe('string')
})

// Updating cargos in freighters
test('I can update cargos in a freigher', () => {  
    expect(typeof updated).toBe('string')
})

// Removing cargos from freighters
test('I can remove cargos from a freigher', () => {  
    expect(typeof removed).toBe('string')
})



// let cargo = new CargoDB('instakilogram_db')

// cargo.in('users').add({
//     name: 'Nickname',
//     password: 'eeb7048c69b088739908f5f5144cd1f5', // Hash :D
// })


// cargo.in('users').get('id')

// cargo.in('users').set('id', {
//     name: 'MLG_Pu$$y_Destroyer'
// })

// cargo.in('users').remove('id')

