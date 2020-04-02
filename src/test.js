const cargo = require('./build.js')

// Create a new storage, you can have them multiple
let storage = new cargo('storage')

// Set Item
let v1 = storage.setItem('surname', 'James')
let v2 = storage.setItem('forename', 'Smith')
test('Sets values in storage', () => {
    expect(v1 + v2).toBe(2)
})

// Get undefined item
let undef = storage.getItem('beep-boop')
test('Gets non-existing item from storage', () => {
    expect(undef).toBe(undefined)
})

// Get item
let surname = storage.getItem('surname')
let forename = storage.getItem('forename')
test('Gets existing items from storage', () => {
    expect(typeof surname).toBe('string')
    expect(typeof forename).toBe('string')
})

console.log(surname + ' ' + forename)
