export function* stringToLines(s: string, targetLength: number): Generator<string, void, undefined> {
    // turn \n into a "force-break"
    s = s.replace(/\n+/g, ' '.repeat(targetLength) + '* ')
    let line: string[] = []
    for (let i = 0; i < s.length; ++i) {
        if (line.length > targetLength - 8 && s[i].match(/\s/)) {
            yield line.join('')
            line = []
            while (i + 1 < s.length && s[i + 1].match(/\s/)) i += 1
        } else {
            line.push(s[i])
        }
    }
    if (line.some(c => !c.match(/^\s*$/))) yield line.join('')
}

const intGenerator = (() => {
    function* _intStream() {
        let i = 0
        while (true) {
            yield i++
        }
    }
    return _intStream()
})()

export const varName = (prefix: string | null = null) => `${prefix ?? '_'}${intGenerator.next().value!}`