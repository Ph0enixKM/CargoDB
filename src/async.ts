// It's a virtual representation
// of a cargo operation method
interface CargoOperation {
    args: Array<any>
    method: string
    callback: Function
}

// Async base for extending 
// classes of an async behavior

export default class AsyncNature {

    private busy: boolean
    private queue: Array<CargoOperation>
    private noSchema: Symbol = Symbol('no-schema')

    constructor(context: Object) {
        this.queue = []
        this.busy = false
        this.context = context ?? this
    }

    // Run until all of
    // of the operations
    // are finished
    private async asyncLoop() {
        // If there is what to iter
        // get yourself to work
        if (this.queue.length) 
            this.busy = true
        // Loop'n'run all the ops in queue
        while (this.busy) {
            // If done - headphones off and tada
            if (!this.queue.length) {
                this.busy = false
            }
            // If stil something to do
            // roll up your sleeves
            else {
                const {method, args, callback} = this.queue[0]
                callback(this.context[method](...args))
                this.queue.shift()
            }
        }
    }

    // Add operation and
    // trigger the loop
    private async(action: string, args: Array<any>) {
        return new Promise(res => {
            // Add a cargo operation to queue
            this.queue.push( <CargoOperation> {
                args: args,
                method: action,
                callback(...val) { res(...val) }
            })
            // Trigger loop
            if (!this.busy) {
                this.asyncLoop()
            }
        })
    }

}
