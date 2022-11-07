// Usage: deno.exe run --allow-read --allow-write .\src\codegen\ad_hoc\generate_index.ts [targetDirectory]
// Synopsis:
//  Generates an "index" file by doing rudimentary search for exports in files in the same directory.
//
// NOTE: this apparently doesn't work will with Deno.  So we'll just ouput what you could import from the directory...

const indexDirectory = Deno.args[0]
if (!indexDirectory) throw new Error('relative path to targetDirectory must be specified')

function* fileLines(path: string) {
    yield* Deno.readTextFileSync(path).split(/\n/)
}

function* getExportNames(path: string) {
    for (const line of fileLines(path)) {
        const match = line.match(/^export\s+(const|function[*]?|interface|class)\s+(?<name>\w+)\s/)
        if (match?.groups) {
            yield match.groups.name
        }
    }
}

const getExports = (dirEntry: Deno.DirEntry) =>
    `export { ${[...getExportNames(`${indexDirectory}/${dirEntry.name}`)].join(', ')} } from './${
        dirEntry.name
    }'`

const dirEntryFilter = (dirEntry: Deno.DirEntry) => dirEntry.isFile && !dirEntry.name.match(/index/)
const dirEntries = [...Deno.readDirSync(indexDirectory)].filter(dirEntryFilter)

const lines = dirEntries.map(getExports)
console.log('New index:')
console.log(lines.join('\n'))

// Deno.writeTextFileSync(`${targetDirectory}\\index.ts`, lines.join("\n"))
