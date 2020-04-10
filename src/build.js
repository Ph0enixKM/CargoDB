
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
  const shortid = require('shortid')

  // Create Base Folder (Private Function)
  function createBase(x) {
    let loc = path.join(x.dir, x.name)

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
      // Generate a better charset
      shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#$')
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
            In order to keep functioning the file is being renamed to
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
                In order to keep functioning the file is being renamed to
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
    constructor(loc, name) {
      // Set global variables
      this.path = loc
      this.name = name
      // If freighter does not
      // exist then create one
      if (!fs.existsSync(loc)) {
        fs.mkdirSync(loc)
      }
    }

    // Add a cargo file
    // to the freighter
    add(object) {
      if (object.ID != null) {
        throw `
          Cannot add an element with 
          existing ID field (${object.ID})
        `
      }
      const genID = shortid.generate()
      // Location of the future cargo file
      const loc = path.join(this.path, genID + '.cargo')

      // what if such file exists and screwed screwed the job
      // This won't happen tho (99.99% of the time)
      if(fs.existsSync(loc)) {
        genID = shortid.generate()
      }

      // Set the ID to the object
      object.ID = genID
      // Create a JSON out of the given cargo
      const json = JSON.stringify(object)
      
      // Save Cargo file
      fs.writeFileSync(loc, json)
      return genID
    }

    // Get a cargo file
    // from the freighter 
    // by id
    get(id) {
      let isValid = shortid.isValid(id)
      if (!isValid) {
        throw `Given ID is invalid (${id})`
      }
      // Location to the desired cargo
      const loc = path.join(this.path, id + '.cargo')
      // If such cargo does not exist
      if (!fs.existsSync(loc)) {
        console.error(`CargoDB couldn't find such cargo id: ${id}`)
        return undefined
      }
      // Read JSON carefully
      try {
        return JSON.parse(fs.readFileSync(loc, 'utf-8'))
      }
      // What if it fails to read?
      catch(err) {
        const rusty = path.join(this.path, id + '.rusty.cargo')
        console.error(`
          CargoDB stumbled upon a corrupted .cargo file.
          The cargo file is in freighter called '${this.name}'.
          In order to keep functioning the file is being renamed to
          '${id + '.rusty.cargo'}'.
        `)
        // Do the rename
        fs.renameSync(loc, rusty)
        return null
      }
    }

    // filter the cargos
    // that you need
    find(callback) {
      const matches = []
      let files = fs.readdirSync(this.path)
      // Iterate over files
      for (let i = 0; i < files.length; i++) {
        const loc = path.join(this.path, files[i])
        const raw = fs.readFileSync(loc, 'utf-8')
        // Read JSON and be careful
        try {
          const obj = JSON.parse(raw)
          if (callback(obj)) {
            matches.push(obj)
          }
        }
        // What if it fails to read?
        catch(err) {
          // Only if JSON failes to parse
          if (err instanceof SyntaxError) {
            // Get only name of the file
            const name = path.basename(files[i], path.extname(files[i]))
            const rusty = path.join(this.path, name + '.rusty.cargo')
            console.error(`
              CargoDB stumbled upon a corrupted .cargo file.
              The cargo file is in freighter called '${this.name}'.
              In order to keep functioning the file is being renamed to
              '${name + '.rusty.cargo'}'.
            `)
            // Do the rename
            fs.renameSync(loc, rusty)
          }
        }
      }
      return matches
    }

    // Set an existing cargo file
    // to a certain object
    set(id, object) {
      let isValid = shortid.isValid(id)
      if (!isValid) {
        throw `Given ID is invalid (${id})`
      }
      // Location to the desired cargo
      const loc = path.join(this.path, id + '.cargo')
      // If such cargo does not exist
      if (!fs.existsSync(loc)) {
        console.error(`CargoDB couldn't find such cargo id: ${id}`)
        return undefined
      }
      // Write JSON cargo
      object.ID = id
      const json = JSON.stringify(object)
      // Save cargo
      fs.writeFileSync(loc, json)
      return id
    }

    // Update given fields
    // (fields with
    // undefined values
    // will be removed)
    update(id, object) {
      let isValid = shortid.isValid(id)
      if (!isValid) {
        throw `Given ID is invalid (${id})`
      }
      // Location to the desired cargo
      const loc = path.join(this.path, id + '.cargo')
      // If such cargo does not exist
      if (!fs.existsSync(loc)) {
        console.error(`CargoDB couldn't find such cargo id: ${id}`)
        return undefined
      }
      // Read JSON carefully
      try {
        let obj = JSON.parse(fs.readFileSync(loc, 'utf-8'))
        // Update values
        for (const item in object) {
          if (item == 'ID') continue
          // Update item
          obj[item] = object[item]
          // Remove if it's supposed to be undefined
          if (object[item] === undefined) {
            delete obj[item]
          }
        }
        const json = JSON.stringify(obj)
        fs.writeFileSync(loc, json)
        return id
      }
      // What if it fails to read?
      catch(err) {
        // Only if JSON failes to parse
        if (err instanceof SyntaxError) {
          const rusty = path.join(this.path, id + '.rusty.cargo')
          console.error(`
            CargoDB stumbled upon a corrupted .cargo file.
            The cargo file is in freighter called '${this.name}'.
            In order to keep functioning the file is being renamed to
            '${id + '.rusty.cargo'}'.
          `)
          // Do the rename
          fs.renameSync(loc, rusty)
          return null
        }
      }
    }

    // Throw a cargo 
    // from the freighter
    // to the water by id
    remove(id) {
      let isValid = shortid.isValid(id)
      if (!isValid) {
        throw `Given ID is invalid (${id})`
      }
      // Location to the desired cargo
      const loc = path.join(this.path, id + '.cargo')
      // If such cargo does not exist
      if (!fs.existsSync(loc)) {
        console.error(`CargoDB couldn't find such cargo id: ${id}`)
        return undefined
      }
      fs.unlinkSync(loc)
      return id
    }
  }

  return Cargo
})()
