interface valueType {
    defaultValue: string | boolean | string[] | boolean[] | number | number[] | object,
    canChangeDefaultValue: boolean
}

const ValueTypes: Map<string, valueType> = new Map([
    ['number', {
        defaultValue: 0,
        canChangeDefaultValue: true
    }],
    ['boolean', {
        defaultValue: false,
        canChangeDefaultValue: true
    }],
    ['string', {
        defaultValue: "",
        canChangeDefaultValue: true
    }],
    ['object', {
        defaultValue: {},
        canChangeDefaultValue: false
    }],
    ['number[]', {
        defaultValue: [],
        canChangeDefaultValue: false
    }],
    ['boolean[]', {
        defaultValue: [],
        canChangeDefaultValue: false
    }],
    ['string[]', {
        defaultValue: [],
        canChangeDefaultValue: false
    }]
])

export default ValueTypes;