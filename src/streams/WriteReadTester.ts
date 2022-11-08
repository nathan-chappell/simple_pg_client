export class WriteReadTester {
    _readable: ReadableStream | null = null
    writable: WritableStream

    get readable(): ReadableStream {
        if (this._readable === null) throw new Error('[WriteReadTester] You must write to the stream first')
        return this._readable
    }

    // prettier-ignore
    constructor() {
        const setReadable = (readable: ReadableStream) => { this._readable = readable }
        this.writable = new WritableStream({
            write(chunk) {
                setReadable( new ReadableStream({ start(controller) { controller.enqueue(chunk) }, }) )
            },
        })
    }
}
