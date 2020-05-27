import path from 'path'
import fs from 'fs'

/*
    Helper functions module
*/

function textFormat(content: string) {
    return content.replace(/\s+/g, ' ').trim()
}

// Create Base Folder
function createBase(ctx: any): boolean {
    let loc = path.join(ctx.dir, ctx.name)
    if (!fs.existsSync(loc)) {
        fs.mkdir(loc, err => {
            if (err) throw 'CargoDB: ' + err
        })
    }
}

// Check whether passed string
// resembles a name
function validateName(name: string): boolean {
    const reg = /^[A-Za-z0-9@$\-#%&_()\[\]{}]+$/
    const res = reg.test(name)
    if (res && name.length) {
        return true
    }
    return false
}

export default {
    createBase,
    validateName,
    textFormat
}