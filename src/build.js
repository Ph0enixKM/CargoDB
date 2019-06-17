/**
 *  -- CargoDB.js --
 * Library providing simple storage access for electron
 * Licence MIT
 * Author: Paweł Karaś
*/

module.exports = (
  function(){
  // Modules required
  const fs = require('fs')
  const encryptor = require('simple-encryptor')

  // Create Base Folder Private Function
  function createBase(x) {
    let loc = x.dir + '/' + x.name

    if (!fs.existsSync(loc)) {
      fs.mkdir(loc, err => {
        if (err) throw 'CargoDB: ' + err
      })
    }
  }

  class CARGO {
    constructor(name, dir, key) {
      // Provide a storage name 'string'
      this.name = name || (function () {
        throw 'No storage name provided'
      })()
      // Provide storage's location (optional) 'string'
      this.dir = dir || __dirname
      // Create key for encrypting (at least 16 characters long)
      this.encrypt = key == null ? key : encryptor(key)
      // Create Base Folder Storage
      createBase(this)
    }

    /** Set Item Method
     * @param {storage} string
     * @param {item} string
    */
    setItem (storage, item) {
      let loc = this.dir + '/' + this.name + '.json'
      //let arg = false
      if (!fs.existsSync(loc)) {
        fs.writeFileSync(loc, '{}')
      }
      let objectContainer = fs.readFileSync(loc, 'utf-8')
      objectContainer = JSON.parse(objectContainer)
      objectContainer[storage] = item
      fs.writeFileSync(loc, JSON.stringify(objectContainer))
      return true
    }

    /** Get Item Method
     * @param {storage} string
    */
    getItem (storage) {
        let loc = this.dir + '/' + this.name + '.json'
        //let arg = false
        let objectContainer = JSON.parse(fs.readFileSync(loc, 'utf-8'))
        return objectContainer[storage]
    }

    /** Set Item In Encrypted File Method
     * @param {storage} string
     * @param {item} string
    */
    setItemHash (storage, value) {
      let loc = this.dir + '/' + this.name + '/_hash.crypt'

      let item = fs.readFileSync(loc, 'utf-8')
      let dehash

      if (this.encrypt == null) return console.error('CargoDB: Set encryption key first (at least 16 characters long)')
      if (item == undefined) dehash = {}
      else dehash = JSON.parse(this.encrypt.decrypt(item))
      dehash[storage] = value
      let hash = this.encrypt.encrypt(JSON.stringify(dehash))

      fs.writeFileSync(loc, hash)
      return true
    }


    /** Get Item In Encrypted File Method
     * @param {storage} string
    */
    getItemHash (storage) {
      let loc = this.dir + '/' + this.name + '/_hash.crypt'
      let item = fs.readFileSync(loc, 'utf-8')
      let dehash = JSON.parse(this.encrypt.decrypt(item))
      return dehash ? dehash[storage] : null
    }

  }
  return CARGO
})()
