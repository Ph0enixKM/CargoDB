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
     * @param {callback(error)} function
    */
    setItem (storage, item, callback) {
      let loc = this.dir + '/' + this.name + '/' + storage + '.json'
      let arg = false

      fs.writeFile(loc, item, err => {
        if (err) arg = 'CargoDB: ' + err
        if (callback) callback(arg)
      })
    }

    /** Set Item Sync Method
     * @param {storage} string
     * @param {item} string
    */
    setItemSync (storage, item) {
      return new Promise(res => {
        this.setItem(storage, item, arg => {
          return res(arg)
        })
      })
    }

    /** Get Item Method
     * @param {storage} string
     * @param {callback(error,data)} function
    */
    getItem (storage, callback) {
        let loc = this.dir + '/' + this.name + '/' + storage + '.json'
        let arg = false

        fs.readFile(loc, 'utf-8', (err, item) => {
          if (err) arg = 'CargoDB: ' + err
          if (callback) callback(arg,item)
        })
    }

    /** Get Item Method
     * @param {storage} string
    */
    getItemSync (storage) {
      return new Promise(res => {
        this.getItem(storage, (_arg, item) => {
          return res(item)
        })
      })
    }

    /** Set Item In Encrypted File Method
     * @param {storage} string
     * @param {item} string
     * @param {callback(error)} function
    */
    setItemHash (storage, value, callback) {
      let loc = this.dir + '/' + this.name + '/_hash.crypt'

      fs.readFile(loc, 'utf-8', (_err, item) => {
        let dehash
        let hash

        if (this.encrypt == null) return console.error('CargoDB: Set encryption key first (at least 16 characters long)')
        if (item == undefined) dehash = {}
        else dehash = JSON.parse(this.encrypt.decrypt(item))
        dehash[storage] = value
        hash = this.encrypt.encrypt(JSON.stringify(dehash))

        fs.writeFile(loc, hash, err => {
          if (callback) callback(err)
        })
      })
    }


    /** Set Item In Encrypted File Async/Await Method 
     * @param {storage} string
     * @param {item} string
    */
    setItemHashSync (storage, value) {
      return new Promise(res => {
        this.setItemHash(storage, value, err => {
          res(err)
        })
      })
    }


    /** Get Item In Encrypted File Method
     * @param {storage} string
     * @param {callback(error, item)} function
    */
    getItemHash (storage, callback) {
      let loc = this.dir + '/' + this.name + '/_hash.crypt'
      let arg = false

      fs.readFile(loc, 'utf-8', (_err, item) => {
        let dehash

        if (this.encrypt == null) return console.error('CargoDB: Set encryption key first (at least 16 characters long)')
        if (item == undefined) arg = 'Such item doesn\'t exist'
        else dehash = JSON.parse(this.encrypt.decrypt(item))
        if (callback) callback(arg, dehash[storage])
      })
    }

    /** Get Item In Encrypted File Method
     * @param {storage} string
    */
    getItemHashSync (storage) {
      return new Promise(res => {
        this.getItemHash(storage, (_err, item) =>{
          res(item)
        })
      })
    }

  }
  return CARGO
})()
