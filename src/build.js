
// ###
//  -- CargoDB.js --
// Library providing simple storage access for electron
// Licence MIT
// Author: Paweł Karaś
// ###

module.exports = (
  function(){

  // Required modules
  const fs = require('fs')
  const path = require('path')

  // Create Base Folder (Private Function)
  function createBase(x) {
    let loc = x.dir + '/' + x.name

    if (!fs.existsSync(loc)) {
      fs.mkdir(loc, err => {
        if (err) throw 'CargoDB: ' + err
      })
    }
  }

  // Check whether passed string
  // resembles a name
  function validateName(name) {
    const reg = /^[A-Za-z0-9@$\-#%&_()\[\]{}]+$/
    const res = reg.test(name)
    if (res && name.length) {
      return true
    }

    return false
  }

  // Main Cargo idea.
  // All user ready-to-use 
  // methods put here.

  class Cargo {

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


    // Set Item Method
    // storage : String
    // item : Any
    setItem (storage, item) {
      // Location to the cargo file
      const loc = path.join(
        this.dir, this.name, storage + '.cargo'
      )

      // Validate if given name is correct
      if (!validateName(storage)) {
        throw `
          Given name '${storage}' does not apply 
          to proper key name pattern
          (RegExp: /^[A-Za-z0-9@$\-#%&_()\[\]{}]+$/)
        `
      }

      // Create container if does not exist
      if (!fs.existsSync(loc)) {
        fs.writeFileSync(loc, '{}')
      }

      // Get the already existing file
      let objectContainer = fs.readFileSync(loc, 'utf-8')

      // If it's a new file
      if (objectContainer == null) {
        fs.writeFileSync(loc, JSON.stringify({
          [storage] : item
        }))
      }

      // if the file actually exists 
      // to just "append" the data
      else {
        try {
          // Try to parse JSON inside of the file
          objectContainer = JSON.parse(objectContainer)
          objectContainer[storage] = item
          fs.writeFileSync(loc, JSON.stringify(objectContainer))
        }

        // if the data is corrupted
        catch (err) {
          // Location to the rusty cargo file
          const rusty = path.join(
            this.dir, this.name, storage + '.rusty.cargo'
          )
          // Spit error message
          console.error(`
            CargoDB stumbled upon a corrupted .cargo file.
            In oreder to keep functioning the file is being renamed to
            '${storage + '.rusty.cargo'}'.
          `)
          // Do the rename
          fs.renameSync(loc, rusty)
          // Save the value anyways
          fs.writeFileSync(loc, JSON.stringify({
            [storage] : item
          }))
          return false
        }

      }
      return true
    }


    // Get Item Method
    // storage : String
    getItem (storage) {
        // Location to the cargo file
        const loc = path.join(
          this.dir, this.name, storage + '.cargo'
        )

        // Validate if given name is correct
        if (!validateName(storage)) {
          throw `
            Given name '${storage}' does not apply 
            to proper key name pattern
            (RegExp: /^[A-Za-z0-9@$\-#%&_()\[\]{}]+$/)
          `
        }

        // If not exists then return undefined
        if (fs.existsSync(loc)) {
            try {
              // Try to parse JSON inside of the file
              let objectContainer = JSON.parse(fs.readFileSync(loc, 'utf-8'))
              return objectContainer[storage]
            }

            // if the data is corrupted
            catch (err) {
              // Location to the rusty cargo file
              const rusty = path.join(
                this.dir, this.name, storage + '.rusty.cargo'
              )
              // Spit error message
              console.error(`
                CargoDB stumbled upon a corrupted .cargo file.
                In oreder to keep functioning the file is being renamed to
                '${storage + '.rusty.cargo'}'.
              `)
              // Do the rename
              fs.renameSync(loc, rusty)
              return null
            }
        }
        return undefined
    }


    // Get a Freighter (any)
    // name : String
    in(name) {
      // Location to the freighter dir
      const loc = path.join(this.dir, this.name, name)

      // Validate if given name is correct
      if (!validateName(name)) {
        throw `
          Given name '${name}' does not apply 
          to proper key name pattern
          (RegExp: /^[A-Za-z0-9@$\-#%&_()\[\]{}]+$/)
        `
      }

      return new Freighter(loc, name)
    }

  }

  class Freighter {
    constructor(path, name) {
      this.path = path
      this.name = name
    }

    // Add a cargo file
    // to the freighter
    add(object) {
      
    }

    // Get a cargo file
    // from the freighter 
    // by id
    get(id) {
      
    }

    // filter the cargos
    // that you need
    find(callback, one = false) {

    }

    // Set an existing cargo file
    // to a certain object
    set(id, object) {

    }

    // Update given fields
    // (fields with null or
    // undefined values
    // will be removed)
    update(id, object) {

    }

    // Throw a cargo 
    // from the freighter
    // to the water by id
    remove(id) {
      
    }
  }

  return Cargo
})()
