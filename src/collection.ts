import fs from 'fs'
import path from 'path'
import shortid from 'shortid'
import AsyncNature from './async'

class Collection extends AsyncNature {
    constructor(loc: string, name: string, rusty: Function) {
        super(this)
        // Set global variables
        this.path = loc
        this.name = name
        this.rusty = rusty
        // If ship does not
        // exist then create one
        if (!fs.existsSync(loc)) {
            fs.mkdirSync(loc)
        }
    }

    // Add a cargo file
    // to the ship and
    // return generated ID
    public addCargo(cargo: Object): string {
        if (cargo.ID != null) {
            throw `
                Cannot add an element with 
                existing ID field (${cargo.ID})
            `
        }
        const genID = shortid.generate()
            // Location of the future cargo file
        const loc = path.join(this.path, genID + '.cargo')

        // what if such file exists and screwed screwed the job
        // This won't happen tho (99.99% of the time)
        if (fs.existsSync(loc)) {
            genID = shortid.generate()
        }

        // Set the ID to the cargo
        cargo.ID = genID
            // Create a JSON out of the given cargo
        const json = JSON.stringify(cargo)

        // Save Cargo file
        fs.writeFileSync(loc, json)
        return genID
    }

    // Get a cargo file
    // from the ship 
    // by id
    public getCargo(id: string): Object | null {
        let isValid = shortid.isValid(id)
        if (!isValid) {
            throw `Given ID is invalid (${id})`
        }
        // Location to the desired cargo
        const loc = path.join(this.path, id + '.cargo')
            // If such cargo does not exist
        if (!fs.existsSync(loc)) {
            console.error(`CargoDB couldn't find such cargo id: ${id}`)
            return null
        }
        // Read JSON carefully
        try {
            return JSON.parse(fs.readFileSync(loc, 'utf-8'))
        }
        // What if it fails to read?
        catch (err) {
            const rusty = path.join(this.path, id + '.rusty.cargo')
            // If there is rusty cargo handler
            // notify user otherwise
            this.rusty(path.join(this.dir, id))
            // Do the rename
            fs.renameSync(loc, rusty)
            return null
        }
    }

    // filter the cargos
    // that you need
    public findCargos(callback: (cargo: Object) => boolean): Array<Object> {
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
            catch (err) {
                // Only if JSON failes to parse
                if (err instanceof SyntaxError) {
                    // Get only name of the file
                    const name = path.basename(files[i], path.extname(files[i]))
                    const rusty = path.join(this.path, name + '.rusty.cargo')
                    // If there is rusty cargo handler
                    // notify user otherwise
                    this.rusty(path.join(this.dir, id))
                    // Do the rename
                    fs.renameSync(loc, rusty)
                }
            }
        }
        return matches
    }

    // Set an existing cargo file
    // to a certain cargo
    public setCargo(id: string, cargo: Object): string | null {
        let isValid = shortid.isValid(id)
        if (!isValid) {
            throw `Given ID is invalid (${id})`
        }
        // Location to the desired cargo
        const loc = path.join(this.path, id + '.cargo')
            // If such cargo does not exist
        if (!fs.existsSync(loc)) {
            console.error(`CargoDB couldn't find such cargo id: ${id}`)
            return null
        }
        // Write JSON cargo
        cargo.ID = id
        const json = JSON.stringify(cargo)
            // Save cargo
        fs.writeFileSync(loc, json)
        return id
    }

    // Update given fields
    // (fields with
    // undefined values
    // will be removed)
    public updateCargo(id: string, cargo: Object): string | null {
        let isValid = shortid.isValid(id)
        if (!isValid) {
            throw `Given ID is invalid (${id})`
        }
        // Location to the desired cargo
        const loc = path.join(this.path, id + '.cargo')
            // If such cargo does not exist
        if (!fs.existsSync(loc)) {
            console.error(`CargoDB couldn't find such cargo id: ${id}`)
            return null
        }
        // Read JSON carefully
        try {
            let obj = JSON.parse(fs.readFileSync(loc, 'utf-8'))
                // Update values
            for (const item in cargo) {
                if (item == 'ID') continue
                    // Update item
                obj[item] = cargo[item]
                    // Remove if it's supposed to be undefined
                if (cargo[item] === undefined) {
                    delete obj[item]
                }
            }
            const json = JSON.stringify(obj)
            fs.writeFileSync(loc, json)
            return id
        }
        // What if it fails to read?
        catch (err) {
            // Only if JSON failes to parse
            if (err instanceof SyntaxError) {
                const rusty = path.join(this.path, id + '.rusty.cargo')
                // If there is rusty cargo handler
                // notify user otherwise
                this.rusty(path.join(this.dir, id))
                // Do the rename
                fs.renameSync(loc, rusty)
                return null
            }
        }
    }

    // Remove the cargo
    // from collection
    public removeCargo(id: string): string | null {
        let isValid = shortid.isValid(id)
        if (!isValid) {
            throw `Given ID is invalid (${id})`
        }
        // Location to the desired cargo
        const loc = path.join(this.path, id + '.cargo')
        // If such cargo does not exist
        if (!fs.existsSync(loc)) {
            console.error(`CargoDB couldn't find such cargo id: ${id}`)
            return null
        }
        fs.unlinkSync(loc)
        return id
    }
}


// Async wrapper 
// for Cargo's Collection.
// Don't write any logic here
// async wrapper's purpose is to
// handle the code that needs to
// be done asynchronously

class CollectionAsync extends Collection {

    // Collection constructor
    constructor(loc: string, name: string, rusty: Function) {
        super(loc, name, rusty)
    }

    // Expose methods in a 
    // simple to use API

    // [Async] It's is used to
    // add cargo to the collection.
    // The object can be any type
    // or should follow a schema
    // defined optionally in
    // collection constructor
    public add(cargo: Object): string {
        return super.async('addCargo', [cargo])
    }

    // [Sync] It retrieves
    // desired cargo by it's id.
    // If one doesn't exits
    // a null value is
    // being returned
    public get(id: string): Object | null {
        return super.getCargo(id)
    }

    // [Sync] It seeks for
    // cargos that match
    // given criteria resolved
    // in a callback function.
    // It always returns an array
    // even if nothing was found
    public find(callback: (cargo: Object) => boolean): Array<Object> {
        return super.findCargos(callback)
    }

    // [Async] it searches
    // cargo of given ID and
    // overwrites it's contents.
    // If the cargo doesn't exist
    // returns null value
    public set(id: string, cargo: Object): string | null {
        return super.async('setCargo', [id, cargo])
    }

    // [Async] It commits
    // a mutation on a cargo
    // ruled by cargo object
    // config. In another words
    // merges the old cargo with
    // the new data model
    public update(id: string, cargo: Object): string | null {
        return super.async('updateCargo', [id, cargo])
    }

    // [Async] It removes
    // a cargo that is found
    // by ID. As always - null
    // value indicates that 
    // the cargo wasn't found
    public remove(id: string): string | null {
        return super.async('removeCargo', [id])
    }
}

export default CollectionAsync