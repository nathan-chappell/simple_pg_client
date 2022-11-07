export function* stringToLines(
    s: string,
    targetLength: number,
    indent = 0
): Generator<string, void, undefined> {
    // turn \n into a "force-break"
    s = s.replace(/\n+/g, ' '.repeat(targetLength) + '* ')
    let isFirstLine = true
    let line: string[] = []
    const _indent = (s: string) => (isFirstLine ? '' : ' '.repeat(indent)) + s
    for (let i = 0; i < s.length; ++i) {
        const lineIsLongEnough = line.length > targetLength - 8 - (isFirstLine ? 0 : indent)
        if (lineIsLongEnough && s[i].match(/\s/)) {
            yield _indent(line.join(''))
            isFirstLine = false
            line = []
            while (i + 1 < s.length && s[i + 1].match(/\s/)) i += 1
        } else {
            line.push(s[i])
        }
    }
    if (line.some(c => !c.match(/^\s*$/))) yield _indent(line.join(''))
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
