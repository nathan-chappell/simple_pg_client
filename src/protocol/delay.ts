export const delay = (t: number) => {
    let cancel: (value?: unknown) => void = () => {}
    const promise = new Promise(res => {
        cancel = res
    })
    const id = setTimeout(() => cancel(), t)

    return {
        promise,
        id,
        cancel,
        then: promise.then.bind(promise),
    }
}
