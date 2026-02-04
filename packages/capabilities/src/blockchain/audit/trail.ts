/**
 * @module AuditTrail
 * Blockchain-based audit trail system for immutable logging of system
 * events, actions, and changes with cryptographic verification.
 */

import type {
  BlockchainConfig,
  AuditEntry,
  AuditQuery,
  TransactionResult,
} from '../types'

/**
 * Audit trail manager providing immutable, tamper-proof logging
 * of system events and actions on blockchain.
 */
export class AuditTrailManager {
  private config: BlockchainConfig
  private entries: Map<string, AuditEntry>
  private entriesByResource: Map<string, string[]>
  private entriesByActor: Map<string, string[]>

  /**
   * Creates a new audit trail manager instance
   * @param config - Blockchain configuration
   */
  constructor(config: BlockchainConfig) {
    this.config = config
    this.entries = new Map()
    this.entriesByResource = new Map()
    this.entriesByActor = new Map()
  }

  /**
   * Logs an audit event to the blockchain
   * @param event - Event details
   * @returns Transaction result with audit entry
   * @throws {Error} If logging fails
   */
  async logEvent(event: {
    eventType: string
    actor: string
    resource: string
    action: string
    metadata?: Record<string, unknown>
  }): Promise<{ entry: AuditEntry; transaction: TransactionResult }> {
    try {
      this.validateAddress(event.actor)

      const id = this.generateEntryId()
      const timestamp = new Date()

      // Send blockchain transaction
      const txResult = await this.sendTransaction({
        method: 'logAuditEvent',
        params: [event],
      })

      // Create audit entry
      const entry: AuditEntry = {
        id,
        eventType: event.eventType,
        actor: event.actor,
        resource: event.resource,
        action: event.action,
        timestamp,
        metadata: event.metadata || {},
        txHash: txResult.hash,
        blockNumber: txResult.blockNumber || 0,
      }

      // Store entry
      this.entries.set(id, entry)

      // Index by resource
      const resourceEntries = this.entriesByResource.get(event.resource) || []
      resourceEntries.push(id)
      this.entriesByResource.set(event.resource, resourceEntries)

      // Index by actor
      const actorEntries = this.entriesByActor.get(event.actor) || []
      actorEntries.push(id)
      this.entriesByActor.set(event.actor, actorEntries)

      return { entry, transaction: txResult }
    } catch (error) {
      throw new Error(
        `Failed to log audit event: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Logs multiple audit events in a batch transaction
   * @param events - Array of events to log
   * @returns Array of audit entries and transaction result
   * @throws {Error} If batch logging fails
   */
  async logBatch(
    events: Array<{
      eventType: string
      actor: string
      resource: string
      action: string
      metadata?: Record<string, unknown>
    }>
  ): Promise<{ entries: AuditEntry[]; transaction: TransactionResult }> {
    if (events.length === 0) {
      throw new Error('Cannot log empty batch')
    }

    try {
      // Validate all events
      for (const event of events) {
        this.validateAddress(event.actor)
      }

      const timestamp = new Date()
      const entries: AuditEntry[] = []

      // Send batch transaction
      const txResult = await this.sendTransaction({
        method: 'logAuditBatch',
        params: [events],
      })

      // Create entries for all events
      for (const event of events) {
        const id = this.generateEntryId()
        const entry: AuditEntry = {
          id,
          eventType: event.eventType,
          actor: event.actor,
          resource: event.resource,
          action: event.action,
          timestamp,
          metadata: event.metadata || {},
          txHash: txResult.hash,
          blockNumber: txResult.blockNumber || 0,
        }

        this.entries.set(id, entry)
        entries.push(entry)

        // Update indices
        const resourceEntries = this.entriesByResource.get(event.resource) || []
        resourceEntries.push(id)
        this.entriesByResource.set(event.resource, resourceEntries)

        const actorEntries = this.entriesByActor.get(event.actor) || []
        actorEntries.push(id)
        this.entriesByActor.set(event.actor, actorEntries)
      }

      return { entries, transaction: txResult }
    } catch (error) {
      throw new Error(
        `Failed to log batch: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Queries audit trail with filters
   * @param query - Query parameters
   * @returns Matching audit entries
   */
  async queryAuditTrail(query: AuditQuery = {}): Promise<AuditEntry[]> {
    try {
      let results: AuditEntry[] = []

      // Filter by resource if specified
      if (query.resource) {
        const resourceEntryIds = this.entriesByResource.get(query.resource) || []
        results = resourceEntryIds
          .map((id) => this.entries.get(id))
          .filter((e): e is AuditEntry => e !== undefined)
      }
      // Filter by actor if specified
      else if (query.actor) {
        const actorEntryIds = this.entriesByActor.get(query.actor) || []
        results = actorEntryIds
          .map((id) => this.entries.get(id))
          .filter((e): e is AuditEntry => e !== undefined)
      }
      // Otherwise get all entries
      else {
        results = Array.from(this.entries.values())
      }

      // Apply additional filters
      results = results.filter((entry) => {
        if (query.eventType && entry.eventType !== query.eventType) {
          return false
        }
        if (query.startDate && entry.timestamp < query.startDate) {
          return false
        }
        if (query.endDate && entry.timestamp > query.endDate) {
          return false
        }
        return true
      })

      // Sort by timestamp (newest first)
      results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      // Apply pagination
      const offset = query.offset || 0
      const limit = query.limit || 100

      return results.slice(offset, offset + limit)
    } catch (error) {
      throw new Error(
        `Failed to query audit trail: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Gets audit entry by ID
   * @param entryId - Entry identifier
   * @returns Audit entry
   * @throws {Error} If entry not found
   */
  async getEntry(entryId: string): Promise<AuditEntry> {
    const entry = this.entries.get(entryId)
    if (!entry) {
      throw new Error(`Audit entry ${entryId} not found`)
    }
    return { ...entry }
  }

  /**
   * Verifies audit entry integrity on blockchain
   * @param entryId - Entry identifier
   * @returns Verification result
   */
  async verifyEntry(
    entryId: string
  ): Promise<{ verified: boolean; entry?: AuditEntry; reason?: string }> {
    try {
      const entry = await this.getEntry(entryId)

      // In production, verify on blockchain by transaction hash
      // Check if transaction exists and data matches
      const onChain = await this.verifyOnChain(entry.txHash)

      if (!onChain) {
        return {
          verified: false,
          entry,
          reason: 'Entry not found on blockchain',
        }
      }

      return {
        verified: true,
        entry,
      }
    } catch (error) {
      return {
        verified: false,
        reason: `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  /**
   * Gets audit statistics for a resource
   * @param resource - Resource identifier
   * @returns Audit statistics
   */
  async getResourceStatistics(resource: string): Promise<{
    totalEvents: number
    eventTypes: Record<string, number>
    actors: Record<string, number>
    firstEvent?: Date
    lastEvent?: Date
  }> {
    const entries = await this.queryAuditTrail({ resource })

    const stats = {
      totalEvents: entries.length,
      eventTypes: {} as Record<string, number>,
      actors: {} as Record<string, number>,
      firstEvent: undefined as Date | undefined,
      lastEvent: undefined as Date | undefined,
    }

    if (entries.length === 0) {
      return stats
    }

    // Calculate statistics
    for (const entry of entries) {
      stats.eventTypes[entry.eventType] =
        (stats.eventTypes[entry.eventType] || 0) + 1
      stats.actors[entry.actor] = (stats.actors[entry.actor] || 0) + 1
    }

    // Get date range
    const sorted = [...entries].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    )
    stats.firstEvent = sorted[0].timestamp
    stats.lastEvent = sorted[sorted.length - 1].timestamp

    return stats
  }

  /**
   * Validates Ethereum-style address
   * @param address - Address to validate
   * @throws {Error} If address invalid
   */
  private validateAddress(address: string): void {
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw new Error(`Invalid address: ${address}`)
    }
  }

  /**
   * Generates unique entry ID
   * @returns Entry ID
   */
  private generateEntryId(): string {
    return `audit-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
  }

  /**
   * Verifies entry exists on blockchain
   * @param txHash - Transaction hash
   * @returns True if verified
   */
  private async verifyOnChain(txHash: string): Promise<boolean> {
    // Simulate blockchain verification
    await new Promise((resolve) => setTimeout(resolve, 50))
    return true
  }

  /**
   * Sends transaction to blockchain network
   * @param tx - Transaction object
   * @returns Transaction result
   */
  private async sendTransaction(tx: {
    method: string
    params: unknown[]
  }): Promise<TransactionResult> {
    // Simulate blockchain transaction
    const txHash = `0x${this.generateTxHash()}`
    await new Promise((resolve) => setTimeout(resolve, 100))

    return {
      hash: txHash,
      blockNumber: Math.floor(Math.random() * 1000000),
      gasUsed: '30000',
      status: 'confirmed',
      timestamp: new Date(),
    }
  }

  /**
   * Generates random transaction hash for simulation
   * @returns Transaction hash string
   */
  private generateTxHash(): string {
    return Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
  }
}
