import fs from 'fs'
import path from 'path'
import shortid from 'shortid'
import Collection from './collection'
import AsyncNature from './async'
import schema from './schema'
import help from './helper'

// Main Cargo idea.
// All user ready-to-use 
// methods put here.

class Cargo extends AsyncNature {

    public rusty: Function
    public name: string
    public dir: string
    public schemas: Object

    constructor(name: string, dir: string) {
        super(this)
        // Get path relative to the directory
        if (dir && dir[0] === '~') {
            dir = path.join(process.env.PWD, dir.slice(1))
        }
        // Provide a storage name 'string'
        this.name = name || (() => { throw 'No storage name provided' })()
        // Provide storage's location (optional) 'string'
        this.dir = dir || process.env.PWD
        // Create Base Folder Storage
        help.createBase(this)
        // Generate a better charset
        shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#$')
        // Set default behavior for rusty containers
        this.rusty = (location) => {
            const name = path.basename(location)
            console.error(help.textFormat(`
                CargoDB stumbled upon a corrupted .cargo file.
                In order to keep functioning the file is being renamed to
                '${name}.rusty.cargo'.
            `))
        }
        // Create variable to store all schemas
        this.schemas = {}
    }

    // Whenever rusty container is found
    // Run this callback with the path
    public onRusty(cb: (path: string) => void) {
        this.rusty = cb
    }


    // Set Item Method
    // storage : String
    // item : Any
    public setCargo(storage: string, item: any): boolean {
        // Location to the cargo file
        const loc = path.join(
            this.dir, this.name, storage + '.cargo'
        )

        // Validate if given name is correct
        if (!help.validateName(storage)) {
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
                [storage]: item
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
                // If there is rusty cargo handler
                // notify user otherwise
                this.rusty(path.join(this.dir, this.name, storage))
                // Do the rename
                fs.renameSync(loc, rusty)
                // Save the value anyways
                fs.writeFileSync(loc, JSON.stringify({ [storage]: item }))
                return false
            }

        }
        return true
    }


    // Get Item Method
    // storage : String
    public getCargo(storage: string): any {
        // Location to the cargo file
        const loc = path.join(
            this.dir, this.name, storage + '.cargo'
        )

        // Validate if given name is correct
        if (!help.validateName(storage)) {
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
                // If there is rusty cargo handler
                // notify user otherwise
                this.rusty(path.join(this.dir, this.name, storage))
                // Do the rename
                fs.renameSync(loc, rusty)
                return null
            }
        }
        return null
    }


    // Get a collection (any)
    // name : String
    public in(name: string): Collection {
        // Location to the collection dir
        const loc = path.join(this.dir, this.name, name)

        // Validate if given name is correct
        if (!help.validateName(name)) {
            throw `
                Given name '${name}' does not apply 
                to proper key name pattern
                (RegExp: /^[A-Za-z0-9@$\-#%&_()\[\]{}]+$/)
            `
        }

        if (this.schemas[name] == null) {
            throw `
                There is no collection with name: '${name}'
                If this name is not a mistake,
                create one with cargo.create()
                (More info in docs)
            `
        }

        return new Collection(loc, name, this.rusty, this.schemas[name])
    }

    // Create a collection
    // Possibly with a schema
    public create (
        name: string, 
        schema: (
            data: (value: string) => SchemaTag, 
            cache: (value: string) => SchemaTag, 
            ref: (value: string) => SchemaTag
        ) => void | null
    ) {
        // Location to the collection dir
        const loc = path.join(this.dir, this.name, name)
        // Create dir if not exists
        if (!fs.existsSync(loc)) {
            fs.mkdirSync(loc)
        }
        // Assign no-schema symbol if nothing provided
        if (schema == null) this.schemas[name] = this.noSchema
    }
}


// Async wrapper 
// for Cargo database.
// Don't write any logic here
// async wrapper's purpose is to
// handle the code that needs to
// be done asynchronously

class CargoAsync extends Cargo {
    // Cargo constructor
    constructor(name: string, path: string) {
        super(name, path)
    }

    // Expose methods in a 
    // simple to use API

    // Create a synchronous version of Cargo.
    // Warning: possible collisions may occur
    static Sync(name: string, path: string): Cargo {
        return new Cargo(name, path)
    }

    // [Async] This method is used 
    // to set cargo to any value.
    // The item can be any type.
    public set(storage: string, item: any) {
        return super.async('setCargo', [storage, item])
    }

    // [Sync] This method is used to 
    // retrieve data from a cargo.
    // Returned null value means
    // the cargo doesn't exist
    public get(storage: string) {
        return super.getCargo(storage)
    }
}

export default CargoAsync
module.exports = CargoAsync