// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"async.ts":[function(require,module,exports) {
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// Async base for extending 
// classes of an async behavior
var AsyncNature = /** @class */ (function () {
    function AsyncNature(context) {
        this.queue = [];
        this.busy = false;
        this.context = context !== null && context !== void 0 ? context : this;
    }
    // Run until all of
    // of the operations
    // are finished
    AsyncNature.prototype.asyncLoop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, method, args, callback;
            var _b;
            return __generator(this, function (_c) {
                // If there is what to iter
                // get yourself to work
                if (this.queue.length)
                    this.busy = true;
                // Loop'n'run all the ops in queue
                while (this.busy) {
                    // If done - headphones off and tada
                    if (!this.queue.length) {
                        this.busy = false;
                    }
                    // If stil something to do
                    // roll up your sleeves
                    else {
                        _a = this.queue[0], method = _a.method, args = _a.args, callback = _a.callback;
                        callback((_b = this.context)[method].apply(_b, args));
                        this.queue.shift();
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    // Add operation and
    // trigger the loop
    AsyncNature.prototype.async = function (action, args) {
        var _this = this;
        return new Promise(function (res) {
            // Add a cargo operation to queue
            _this.queue.push({
                args: args,
                method: action,
                callback: function () {
                    var val = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        val[_i] = arguments[_i];
                    }
                    res.apply(void 0, val);
                }
            });
            // Trigger loop
            if (!_this.busy) {
                _this.asyncLoop();
            }
        });
    };
    return AsyncNature;
}());
exports.default = AsyncNature;

},{}],"collection.ts":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var shortid_1 = __importDefault(require("shortid"));
var async_1 = __importDefault(require("./async"));
var Collection = /** @class */ (function (_super) {
    __extends(Collection, _super);
    function Collection(loc, name, rusty) {
        var _this = _super.call(this, _this) || this;
        // Set global variables
        _this.path = loc;
        _this.name = name;
        _this.rusty = rusty;
        // If ship does not
        // exist then create one
        if (!fs_1.default.existsSync(loc)) {
            fs_1.default.mkdirSync(loc);
        }
        return _this;
    }
    // Add a cargo file
    // to the ship and
    // return generated ID
    Collection.prototype.addCargo = function (cargo) {
        if (cargo.ID != null) {
            throw "\n                Cannot add an element with \n                existing ID field (" + cargo.ID + ")\n            ";
        }
        var genID = shortid_1.default.generate();
        // Location of the future cargo file
        var loc = path_1.default.join(this.path, genID + '.cargo');
        // what if such file exists and screwed screwed the job
        // This won't happen tho (99.99% of the time)
        if (fs_1.default.existsSync(loc)) {
            genID = shortid_1.default.generate();
        }
        // Set the ID to the cargo
        cargo.ID = genID;
        // Create a JSON out of the given cargo
        var json = JSON.stringify(cargo);
        // Save Cargo file
        fs_1.default.writeFileSync(loc, json);
        return genID;
    };
    // Get a cargo file
    // from the ship 
    // by id
    Collection.prototype.getCargo = function (id) {
        var isValid = shortid_1.default.isValid(id);
        if (!isValid) {
            throw "Given ID is invalid (" + id + ")";
        }
        // Location to the desired cargo
        var loc = path_1.default.join(this.path, id + '.cargo');
        // If such cargo does not exist
        if (!fs_1.default.existsSync(loc)) {
            console.error("CargoDB couldn't find such cargo id: " + id);
            return null;
        }
        // Read JSON carefully
        try {
            return JSON.parse(fs_1.default.readFileSync(loc, 'utf-8'));
        }
        // What if it fails to read?
        catch (err) {
            var rusty = path_1.default.join(this.path, id + '.rusty.cargo');
            // If there is rusty cargo handler
            // notify user otherwise
            this.rusty(path_1.default.join(this.dir, id));
            // Do the rename
            fs_1.default.renameSync(loc, rusty);
            return null;
        }
    };
    // filter the cargos
    // that you need
    Collection.prototype.findCargos = function (callback) {
        var matches = [];
        var files = fs_1.default.readdirSync(this.path);
        // Iterate over files
        for (var i = 0; i < files.length; i++) {
            var loc = path_1.default.join(this.path, files[i]);
            var raw = fs_1.default.readFileSync(loc, 'utf-8');
            // Read JSON and be careful
            try {
                var obj = JSON.parse(raw);
                if (callback(obj)) {
                    matches.push(obj);
                }
            }
            // What if it fails to read?
            catch (err) {
                // Only if JSON failes to parse
                if (err instanceof SyntaxError) {
                    // Get only name of the file
                    var name = path_1.default.basename(files[i], path_1.default.extname(files[i]));
                    var rusty = path_1.default.join(this.path, name + '.rusty.cargo');
                    // If there is rusty cargo handler
                    // notify user otherwise
                    this.rusty(path_1.default.join(this.dir, id));
                    // Do the rename
                    fs_1.default.renameSync(loc, rusty);
                }
            }
        }
        return matches;
    };
    // Set an existing cargo file
    // to a certain cargo
    Collection.prototype.setCargo = function (id, cargo) {
        var isValid = shortid_1.default.isValid(id);
        if (!isValid) {
            throw "Given ID is invalid (" + id + ")";
        }
        // Location to the desired cargo
        var loc = path_1.default.join(this.path, id + '.cargo');
        // If such cargo does not exist
        if (!fs_1.default.existsSync(loc)) {
            console.error("CargoDB couldn't find such cargo id: " + id);
            return null;
        }
        // Write JSON cargo
        cargo.ID = id;
        var json = JSON.stringify(cargo);
        // Save cargo
        fs_1.default.writeFileSync(loc, json);
        return id;
    };
    // Update given fields
    // (fields with
    // undefined values
    // will be removed)
    Collection.prototype.updateCargo = function (id, cargo) {
        var isValid = shortid_1.default.isValid(id);
        if (!isValid) {
            throw "Given ID is invalid (" + id + ")";
        }
        // Location to the desired cargo
        var loc = path_1.default.join(this.path, id + '.cargo');
        // If such cargo does not exist
        if (!fs_1.default.existsSync(loc)) {
            console.error("CargoDB couldn't find such cargo id: " + id);
            return null;
        }
        // Read JSON carefully
        try {
            var obj = JSON.parse(fs_1.default.readFileSync(loc, 'utf-8'));
            // Update values
            for (var item in cargo) {
                if (item == 'ID')
                    continue;
                // Update item
                obj[item] = cargo[item];
                // Remove if it's supposed to be undefined
                if (cargo[item] === undefined) {
                    delete obj[item];
                }
            }
            var json = JSON.stringify(obj);
            fs_1.default.writeFileSync(loc, json);
            return id;
        }
        // What if it fails to read?
        catch (err) {
            // Only if JSON failes to parse
            if (err instanceof SyntaxError) {
                var rusty = path_1.default.join(this.path, id + '.rusty.cargo');
                // If there is rusty cargo handler
                // notify user otherwise
                this.rusty(path_1.default.join(this.dir, id));
                // Do the rename
                fs_1.default.renameSync(loc, rusty);
                return null;
            }
        }
    };
    // Remove the cargo
    // from collection
    Collection.prototype.removeCargo = function (id) {
        var isValid = shortid_1.default.isValid(id);
        if (!isValid) {
            throw "Given ID is invalid (" + id + ")";
        }
        // Location to the desired cargo
        var loc = path_1.default.join(this.path, id + '.cargo');
        // If such cargo does not exist
        if (!fs_1.default.existsSync(loc)) {
            console.error("CargoDB couldn't find such cargo id: " + id);
            return null;
        }
        fs_1.default.unlinkSync(loc);
        return id;
    };
    return Collection;
}(async_1.default));
// Async wrapper 
// for Cargo's Collection.
// Don't write any logic here
// async wrapper's purpose is to
// handle the code that needs to
// be done asynchronously
var CollectionAsync = /** @class */ (function (_super) {
    __extends(CollectionAsync, _super);
    // Collection constructor
    function CollectionAsync(loc, name, rusty) {
        return _super.call(this, loc, name, rusty) || this;
    }
    // Expose methods in a 
    // simple to use API
    // [Async] It's is used to
    // add cargo to the collection.
    // The object can be any type
    // or should follow a schema
    // defined optionally in
    // collection constructor
    CollectionAsync.prototype.add = function (cargo) {
        return _super.prototype.async.call(this, 'addCargo', [cargo]);
    };
    // [Sync] It retrieves
    // desired cargo by it's id.
    // If one doesn't exits
    // a null value is
    // being returned
    CollectionAsync.prototype.get = function (id) {
        return _super.prototype.getCargo.call(this, id);
    };
    // [Sync] It seeks for
    // cargos that match
    // given criteria resolved
    // in a callback function.
    // It always returns an array
    // even if nothing was found
    CollectionAsync.prototype.find = function (callback) {
        return _super.prototype.findCargos.call(this, callback);
    };
    // [Async] it searches
    // cargo of given ID and
    // overwrites it's contents.
    // If the cargo doesn't exist
    // returns null value
    CollectionAsync.prototype.set = function (id, cargo) {
        return _super.prototype.async.call(this, 'setCargo', [id, cargo]);
    };
    // [Async] It commits
    // a mutation on a cargo
    // ruled by cargo object
    // config. In another words
    // merges the old cargo with
    // the new data model
    CollectionAsync.prototype.update = function (id, cargo) {
        return _super.prototype.async.call(this, 'updateCargo', [id, cargo]);
    };
    // [Async] It removes
    // a cargo that is found
    // by ID. As always - null
    // value indicates that 
    // the cargo wasn't found
    CollectionAsync.prototype.remove = function (id) {
        return _super.prototype.async.call(this, 'removeCargo', [id]);
    };
    return CollectionAsync;
}(Collection));
exports.default = CollectionAsync;

},{"./async":"async.ts"}],"helper.ts":[function(require,module,exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
/*
    Helper functions module
*/
function textFormat(content) {
    return content.replace(/\s+/g, ' ').trim();
}
// Create Base Folder
function createBase(ctx) {
    var loc = path_1.default.join(ctx.dir, ctx.name);
    if (!fs_1.default.existsSync(loc)) {
        fs_1.default.mkdir(loc, function (err) {
            if (err)
                throw 'CargoDB: ' + err;
        });
    }
}
// Check whether passed string
// resembles a name
function validateName(name) {
    var reg = /^[A-Za-z0-9@$\-#%&_()\[\]{}]+$/;
    var res = reg.test(name);
    if (res && name.length) {
        return true;
    }
    return false;
}
exports.default = {
    createBase: createBase,
    validateName: validateName,
    textFormat: textFormat
};

},{}],"cargo.ts":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var shortid_1 = __importDefault(require("shortid"));
var collection_1 = __importDefault(require("./collection"));
var async_1 = __importDefault(require("./async"));
var helper_1 = __importDefault(require("./helper"));
// Main Cargo idea.
// All user ready-to-use 
// methods put here.
var Cargo = /** @class */ (function (_super) {
    __extends(Cargo, _super);
    function Cargo(name, dir) {
        var _this = _super.call(this, _this) || this;
        // Get path relative to the directory
        if (dir && dir[0] === '~') {
            dir = path_1.default.join(process.env.PWD, dir.slice(1));
        }
        // Provide a storage name 'string'
        _this.name = name || (function () { throw 'No storage name provided'; })();
        // Provide storage's location (optional) 'string'
        _this.dir = dir || process.env.PWD;
        // Create Base Folder Storage
        helper_1.default.createBase(_this);
        // Generate a better charset
        shortid_1.default.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#$');
        // Set default behavior for rusty containers
        _this.rusty = function (location) {
            var name = path_1.default.basename(location);
            console.error(helper_1.default.textFormat("\n                CargoDB stumbled upon a corrupted .cargo file.\n                In order to keep functioning the file is being renamed to\n                '" + name + ".rusty.cargo'.\n            "));
        };
        // Create variable to store all schemas
        _this.schemas = {};
        return _this;
    }
    // Whenever rusty container is found
    // Run this callback with the path
    Cargo.prototype.onRusty = function (cb) {
        this.rusty = cb;
    };
    // Set Item Method
    // storage : String
    // item : Any
    Cargo.prototype.setCargo = function (storage, item) {
        var _a, _b;
        // Location to the cargo file
        var loc = path_1.default.join(this.dir, this.name, storage + '.cargo');
        // Validate if given name is correct
        if (!helper_1.default.validateName(storage)) {
            throw "\n          Given name '" + storage + "' does not apply \n          to proper key name pattern\n          (RegExp: /^[A-Za-z0-9@$-#%&_()[]{}]+$/)\n        ";
        }
        // Create container if does not exist
        if (!fs_1.default.existsSync(loc)) {
            fs_1.default.writeFileSync(loc, '{}');
        }
        // Get the already existing file
        var objectContainer = fs_1.default.readFileSync(loc, 'utf-8');
        // If it's a new file
        if (objectContainer == null) {
            fs_1.default.writeFileSync(loc, JSON.stringify((_a = {},
                _a[storage] = item,
                _a)));
        }
        // if the file actually exists 
        // to just "append" the data
        else {
            try {
                // Try to parse JSON inside of the file
                objectContainer = JSON.parse(objectContainer);
                objectContainer[storage] = item;
                fs_1.default.writeFileSync(loc, JSON.stringify(objectContainer));
            }
            // if the data is corrupted
            catch (err) {
                // Location to the rusty cargo file
                var rusty = path_1.default.join(this.dir, this.name, storage + '.rusty.cargo');
                // If there is rusty cargo handler
                // notify user otherwise
                this.rusty(path_1.default.join(this.dir, this.name, storage));
                // Do the rename
                fs_1.default.renameSync(loc, rusty);
                // Save the value anyways
                fs_1.default.writeFileSync(loc, JSON.stringify((_b = {}, _b[storage] = item, _b)));
                return false;
            }
        }
        return true;
    };
    // Get Item Method
    // storage : String
    Cargo.prototype.getCargo = function (storage) {
        // Location to the cargo file
        var loc = path_1.default.join(this.dir, this.name, storage + '.cargo');
        // Validate if given name is correct
        if (!helper_1.default.validateName(storage)) {
            throw "\n                Given name '" + storage + "' does not apply \n                to proper key name pattern\n                (RegExp: /^[A-Za-z0-9@$-#%&_()[]{}]+$/)\n            ";
        }
        // If not exists then return undefined
        if (fs_1.default.existsSync(loc)) {
            try {
                // Try to parse JSON inside of the file
                var objectContainer = JSON.parse(fs_1.default.readFileSync(loc, 'utf-8'));
                return objectContainer[storage];
            }
            // if the data is corrupted
            catch (err) {
                // Location to the rusty cargo file
                var rusty = path_1.default.join(this.dir, this.name, storage + '.rusty.cargo');
                // If there is rusty cargo handler
                // notify user otherwise
                this.rusty(path_1.default.join(this.dir, this.name, storage));
                // Do the rename
                fs_1.default.renameSync(loc, rusty);
                return null;
            }
        }
        return null;
    };
    // Get a collection (any)
    // name : String
    Cargo.prototype.in = function (name) {
        // Location to the collection dir
        var loc = path_1.default.join(this.dir, this.name, name);
        // Validate if given name is correct
        if (!helper_1.default.validateName(name)) {
            throw "\n                Given name '" + name + "' does not apply \n                to proper key name pattern\n                (RegExp: /^[A-Za-z0-9@$-#%&_()[]{}]+$/)\n            ";
        }
        if (this.schemas[name] == null) {
            throw "\n                There is no collection with name: '" + name + "'\n                If this name is not a mistake,\n                create one with cargo.create()\n                (More info in docs)\n            ";
        }
        return new collection_1.default(loc, name, this.rusty, this.schemas[name]);
    };
    // Create a collection
    // Possibly with a schema
    Cargo.prototype.create = function (name, schema) {
        // Location to the collection dir
        var loc = path_1.default.join(this.dir, this.name, name);
        // Create dir if not exists
        if (!fs_1.default.existsSync(loc)) {
            fs_1.default.mkdirSync(loc);
        }
        // Create generic schema if nothing provided
        if (schema == null)
            this.schemas[name] = 'no-schema';
    };
    return Cargo;
}(async_1.default));
// Async wrapper 
// for Cargo database.
// Don't write any logic here
// async wrapper's purpose is to
// handle the code that needs to
// be done asynchronously
var CargoAsync = /** @class */ (function (_super) {
    __extends(CargoAsync, _super);
    // Cargo constructor
    function CargoAsync(name, path) {
        return _super.call(this, name, path) || this;
    }
    // Expose methods in a 
    // simple to use API
    // Create a synchronous version of Cargo.
    // Warning: possible collisions may occur
    CargoAsync.Sync = function (name, path) {
        return new Cargo(name, path);
    };
    // [Async] This method is used 
    // to set cargo to any value.
    // The item can be any type.
    CargoAsync.prototype.set = function (storage, item) {
        return _super.prototype.async.call(this, 'setCargo', [storage, item]);
    };
    // [Sync] This method is used to 
    // retrieve data from a cargo.
    // Returned null value means
    // the cargo doesn't exist
    CargoAsync.prototype.get = function (storage) {
        return _super.prototype.getCargo.call(this, storage);
    };
    return CargoAsync;
}(Cargo));
exports.default = CargoAsync;
module.exports = CargoAsync;

},{"./collection":"collection.ts","./async":"async.ts","./helper":"helper.ts"}]},{},["cargo.ts"], null)
//# sourceMappingURL=cargodb.js.map