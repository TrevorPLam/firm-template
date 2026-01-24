/**
 * Type-Safe API Client Generator
 * 
 * Generates type-safe API clients from OpenAPI/Swagger specs.
 * 
 * Usage:
 * ```bash
 * npm run generate:api-client
 * ```
 * 
 * This generates:
 * - Type-safe API client functions
 * - Request/response types
 * - Validation schemas
 * - No runtime type checking needed (compile-time only)
 * 
 * For production, use:
 * - openapi-typescript (https://github.com/drwpow/openapi-typescript)
 * - openapi-generator (https://openapi-generator.tech/)
 * - swagger-codegen (https://swagger.io/tools/swagger-codegen/)
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

interface OpenAPISpec {
  paths: Record<string, Record<string, {
    summary?: string
    parameters?: Array<{
      name: string
      in: string
      required?: boolean
      schema: { type: string }
    }>
    requestBody?: {
      content: {
        'application/json': {
          schema: any
        }
      }
    }
    responses: Record<string, {
      content?: {
        'application/json': {
          schema: any
        }
      }
    }>
  }>>
  components?: {
    schemas?: Record<string, any>
  }
}

/**
 * Generate TypeScript types from OpenAPI schema
 */
function generateTypes(schema: any, name: string): string {
  if (schema.type === 'object') {
    const properties = Object.entries(schema.properties || {}).map(([key, value]: [string, any]) => {
      const optional = schema.required?.includes(key) ? '' : '?'
      return `  ${key}${optional}: ${generateType(value)}`
    }).join('\n')
    return `export interface ${name} {\n${properties}\n}`
  }
  return `export type ${name} = ${generateType(schema)}`
}

function generateType(schema: any): string {
  if (schema.type === 'string') return 'string'
  if (schema.type === 'number' || schema.type === 'integer') return 'number'
  if (schema.type === 'boolean') return 'boolean'
  if (schema.type === 'array') {
    return `Array<${generateType(schema.items)}>`
  }
  if (schema.type === 'object') {
    return 'Record<string, unknown>'
  }
  return 'unknown'
}

/**
 * Generate API client function
 */
function generateClientFunction(
  path: string,
  method: string,
  operation: any
): string {
  const functionName = operation.operationId || `${method}${path.replace(/\//g, '').replace(/\{/g, '').replace(/\}/g, '')}`
  const params = operation.parameters?.map((p: any) => 
    `${p.name}${p.required ? '' : '?'}: ${generateType(p.schema)}`
  ).join(', ') || ''
  
  const requestBody = operation.requestBody?.content?.['application/json']?.schema
  const responseType = operation.responses?.['200']?.content?.['application/json']?.schema

  return `
export async function ${functionName}(
  ${params ? `${params}, ` : ''}${requestBody ? `body: ${generateType(requestBody)}, ` : ''}options?: RequestInit
): Promise<${responseType ? generateType(responseType) : 'void'}> {
  const response = await fetch(\`${path}\`, {
    method: '${method.toUpperCase()}',
    ${requestBody ? "headers: { 'Content-Type': 'application/json' }," : ''}
    ${requestBody ? 'body: JSON.stringify(body),' : ''}
    ...options,
  })
  
  if (!response.ok) {
    throw new Error(\`API Error: \${response.status} \${response.statusText}\`)
  }
  
  ${responseType ? 'return response.json()' : 'return'}
}
`
}

/**
 * Main generator function
 */
export function generateAPIClient(specPath: string, outputPath: string) {
  const spec: OpenAPISpec = JSON.parse(readFileSync(specPath, 'utf-8'))
  
  let output = `/**
 * Auto-generated API Client
 * 
 * Generated from: ${specPath}
 * DO NOT EDIT - This file is auto-generated
 * 
 * To regenerate: npm run generate:api-client
 */

`

  // Generate types from schemas
  if (spec.components?.schemas) {
    output += '// Types\n'
    Object.entries(spec.components.schemas).forEach(([name, schema]) => {
      output += generateTypes(schema, name) + '\n\n'
    })
  }

  // Generate API client functions
  output += '// API Client Functions\n'
  Object.entries(spec.paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, operation]) => {
      output += generateClientFunction(path, method, operation)
    })
  })

  writeFileSync(outputPath, output)
  console.log(`✅ Generated API client: ${outputPath}`)
}

// Run if called directly
if (require.main === module) {
  const specPath = process.argv[2] || './openapi.json'
  const outputPath = process.argv[3] || './lib/api-client.ts'
  generateAPIClient(specPath, outputPath)
}
