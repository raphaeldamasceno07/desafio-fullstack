import { jsonSchemaTransform } from 'fastify-type-provider-zod'

export function customTransform(schema: any, ...rest: any[]) {
  const result = jsonSchemaTransform(schema, ...rest)

  function removePattern(obj: any) {
    if (!obj || typeof obj !== 'object') return

    delete obj.pattern

    Object.values(obj).forEach(removePattern)
  }

  removePattern(result)

  return result
}
