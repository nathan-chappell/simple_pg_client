export class Configurable<TOptions> {
    options: TOptions
    constructor(defaultOptions: TOptions) {
        this.options = defaultOptions
    }

    with(options: Partial<TOptions>): this {
        const _options: TOptions = { ...this.options, options }
        return new Proxy(this, {
            get(target, p, receiver) {
                if (p === 'options') {
                    return _options
                } else {
                    return Reflect.get(target, p, receiver)
                }
            },
        })
    }
}
