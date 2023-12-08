import { parseArgsStringToArgv } from 'string-argv'

const parseValue = (v: unknown): readonly string[] => {
  if (v === undefined) {
    return []
  }
  if (typeof v === 'string') {
    return [v]
  }
  if (typeof v === 'number') {
    return [v.toString()]
  }
  if (Array.isArray(v)) {
    return v.flatMap(parseValue)
  }
  throw new Error(`unknown value: ${v}`)
}

export const shtl = (
  template: TemplateStringsArray,
  ...values: readonly unknown[]
): string[] =>
  template.reduce((acc, next, i) => {
    const fixed = parseArgsStringToArgv(next)

    // need to join with first
    if (i !== 0 && !next.startsWith(' ') && next !== '') {
      const last = acc.pop()
      const first = fixed.shift()
      acc.push(`${last}${first}`)
    }

    acc.push(...fixed)
    const parsedValues = parseValue(values[i])

    // TODO: we could be smarter here in surfacing possible user errors
    // only single value is eligible for joining.
    if (parsedValues.length !== 1) {
      acc.push(...parsedValues)
      return acc
    }

    let value = parsedValues[0]
    // need to join with last
    if (!next.endsWith(' ') && acc.length !== 0) {
      const last = acc.pop()
      value = `${last}${value}`
    }
    acc.push(value)

    return acc
  }, [] as string[])
