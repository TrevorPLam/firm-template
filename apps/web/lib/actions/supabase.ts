// AI-META-BEGIN
// 
// AI-META: Utility functions and helpers
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Imported by application code
// DEPENDENCIES: Supabase (database)
// DANGER: Secret/API key handling - never log or expose; Database operations - ensure proper error handling
// CHANGE-SAFETY: Add functions: safe. Modify existing: check all call sites first
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

import { validatedEnv } from '../env'

export type SupabaseLeadRow = {
  id: string
}

function getSupabaseRestUrl() {
  return `${validatedEnv.SUPABASE_URL}/rest/v1/leads`
}

function getSupabaseHeaders() {
  return {
    apikey: validatedEnv.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${validatedEnv.SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  }
}

export async function insertLead(payload: Record<string, unknown>): Promise<SupabaseLeadRow> {
  const response = await fetch(getSupabaseRestUrl(), {
    method: 'POST',
    headers: {
      ...getSupabaseHeaders(),
      Prefer: 'return=representation',
    },
    body: JSON.stringify([payload]),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Supabase insert failed with status ${response.status}: ${errorText}`)
  }

  const data = (await response.json()) as SupabaseLeadRow[]
  if (!Array.isArray(data) || data.length === 0 || !data[0]?.id) {
    throw new Error('Supabase insert returned no lead ID')
  }

  return data[0]
}

export async function updateLead(leadId: string, updates: Record<string, unknown>) {
  const response = await fetch(`${getSupabaseRestUrl()}?id=eq.${leadId}`, {
    method: 'PATCH',
    headers: getSupabaseHeaders(),
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    throw new Error(`Supabase update failed with status ${response.status}`)
  }
}
