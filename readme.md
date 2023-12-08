# shtl

Template Literals for Shell Commands.

Lets you use template strings to build shell commands with argument processing
that makes sense. It doesn't run the commands for you -- that's for you to
handle however you see fit. It returns the `argv` style `string[]` that can
trivially be used with `spawn` etc.

## Usage

You'll wrap this to make your own template string function that will do your
command execution. For example, a wrapper around `spawn` might look like this:

```typescript
import { spawn } from 'node:child_process'
import { shtl } from '@daaku/shtl'

const $ = (template: TemplateStringsArray, ...values: readonly unknown[]) =>
  new Promise<void>((resolve, reject) => {
    const [command, ...args] = shtl(template, ...values)
    const p = spawn(command, args, { stdio: 'inherit' })
    p.on('close', code =>
      code === 0 ? resolve() : reject(`${command} exited with ${code}`),
    )
  })

const greet = 'hello world'
await $`echo ${greet}`
```
