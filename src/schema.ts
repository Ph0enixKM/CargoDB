interface SchemaTag {
    kind: string
    type: string
    value: any
}

// Data type generator
function data(value) {
    return <SchemaTag> {
        kind: 'DATA',
        type: typeof value,
        value
    }
}

// Cached type generator
function cache(value) {
    return <SchemaTag> {
        kind: 'CACHE',
        type: typeof value,
        value
    }
}

// Reference type generator
function ref(value) {
    // Test reference type
    if (value != null && value !== []) 
        throw 'Bad Reference type'

    return <SchemaTag> {
        kind: 'REF',
        type: typeof value,
        value
    }
}

export default {
    SchemaTag,
    data,
    cache,
    ref
}