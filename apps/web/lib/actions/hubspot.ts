// AI-META-BEGIN
// 
// AI-META: Utility functions and helpers
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Imported by application code
// DEPENDENCIES: Supabase (database), HubSpot (CRM)
// DANGER: Database operations - ensure proper error handling
// CHANGE-SAFETY: Add functions: safe. Modify existing: check all call sites first
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

import { logError, logInfo } from '../logger'
import { validatedEnv } from '../env'
import { hashEmail } from './rate-limit'
import { updateLead } from './supabase'

const HUBSPOT_API_BASE_URL = 'https://api.hubapi.com'

type HubSpotSearchResponse = {
  total: number
  results: Array<{ id: string }>
}

type HubSpotContactResponse = {
  id: string
}

export type HubSpotPropertiesInput = {
  name: string
  email: string
  phone: string
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  const firstName = parts.shift() || fullName
  const lastName = parts.join(' ')

  return {
    firstName,
    lastName: lastName || undefined,
  }
}

export function buildHubSpotProperties(data: HubSpotPropertiesInput) {
  const { firstName, lastName } = splitName(data.name)
  const properties: Record<string, string> = {
    email: data.email,
    firstname: firstName,
  }

  if (lastName) {
    properties.lastname = lastName
  }

  if (data.phone) {
    properties.phone = data.phone
  }

  return properties
}

export async function syncHubSpotContact(
  leadId: string,
  properties: Record<string, string>,
  email: string
) {
  const syncAttemptedAt = new Date().toISOString()
  try {
    const contact = await upsertHubSpotContact(properties)
    await updateLead(leadId, {
      hubspot_contact_id: contact.id,
      hubspot_sync_status: 'synced',
      hubspot_last_sync_attempt: syncAttemptedAt,
    })
    logInfo('HubSpot contact synced', { leadId, emailHash: hashEmail(email) })
  } catch (syncError) {
    logError('HubSpot sync failed', syncError)
    try {
      await updateLead(leadId, {
        hubspot_sync_status: 'needs_sync',
        hubspot_last_sync_attempt: syncAttemptedAt,
      })
    } catch (updateError) {
      logError('Failed to update HubSpot sync status', updateError)
    }
  }
}

async function upsertHubSpotContact(properties: Record<string, string>) {
  const searchResponse = await fetch(`${HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts/search`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${validatedEnv.HUBSPOT_PRIVATE_APP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'email',
              operator: 'EQ',
              value: properties.email,
            },
          ],
        },
      ],
      properties: ['email'],
      limit: 1,
    }),
  })

  if (!searchResponse.ok) {
    throw new Error(`HubSpot search failed with status ${searchResponse.status}`)
  }

  const searchData = (await searchResponse.json()) as HubSpotSearchResponse
  const existingId = searchData.results[0]?.id
  const url = existingId
    ? `${HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts/${existingId}`
    : `${HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts`
  const method = existingId ? 'PATCH' : 'POST'

  const contactResponse = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${validatedEnv.HUBSPOT_PRIVATE_APP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ properties }),
  })

  if (!contactResponse.ok) {
    const errorText = await contactResponse.text()
    throw new Error(`HubSpot upsert failed with status ${contactResponse.status}: ${errorText}`)
  }

  return (await contactResponse.json()) as HubSpotContactResponse
}
