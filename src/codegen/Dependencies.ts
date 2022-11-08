export class Dependencies {
    static cwd(): string {
        return Deno.cwd()
    }

    static readTextFileSync(path: string): string {
        return Deno.readTextFileSync(path)
    }

    static writeTextFileSync(outputPath: string, data: string): void {
        Deno.writeTextFileSync(outputPath, data)
    }
}
