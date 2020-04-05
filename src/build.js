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
  const path = require('path')

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
      // Create Base Folder Storage
      createBase(this)
    }

    /** Set Item Method
     * @param {storage} string
     * @param {item} string
    */
    setItem (storage, item) {
      let loc = path.join(this.dir, this.name, storage + '.cargo')

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
        let loc = path.join(this.dir, this.name, storage + '.cargo')

        if (fs.existsSync(loc)) {
            let objectContainer = JSON.parse(fs.readFileSync(loc, 'utf-8'))
            return objectContainer[storage]
        }
        return undefined
    }


  }
  return CARGO
})()
