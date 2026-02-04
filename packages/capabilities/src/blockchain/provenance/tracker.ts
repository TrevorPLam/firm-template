/**
 * @module ProvenanceTracker
 * Content provenance tracking system using blockchain for immutable record-keeping
 * of content creation, modifications, and ownership transfers.
 */

import type {
  BlockchainConfig,
  ProvenanceRecord,
  CustodyRecord,
  TransactionResult,
} from '../types'

/**
 * Provenance tracker for recording and verifying content origin and history
 * on blockchain networks. Provides immutable audit trail for content lifecycle.
 */
export class ProvenanceTracker {
  private config: BlockchainConfig
  private records: Map<string, ProvenanceRecord>

  /**
   * Creates a new provenance tracker instance
   * @param config - Blockchain configuration
   */
  constructor(config: BlockchainConfig) {
    this.config = config
    this.records = new Map()
  }

  /**
   * Registers new content on the blockchain with provenance record
   * @param contentId - Unique content identifier
   * @param contentHash - Content hash (SHA-256)
   * @param creator - Creator wallet address
   * @param metadataUri - Optional metadata URI (IPFS, etc)
   * @returns Transaction result with provenance record
   * @throws {Error} If content already registered or blockchain transaction fails
   */
  async registerContent(
    contentId: string,
    contentHash: string,
    creator: string,
    metadataUri?: string
  ): Promise<TransactionResult> {
    if (this.records.has(contentId)) {
      throw new Error(`Content ${contentId} already registered`)
    }

    try {
      // Validate inputs
      this.validateAddress(creator)
      this.validateContentHash(contentHash)

      // Create provenance record
      const record: ProvenanceRecord = {
        contentId,
        contentHash,
        creator,
        timestamp: new Date(),
        txHash: '', // Will be set after blockchain transaction
        metadataUri,
        custody: [],
      }

      // Simulate blockchain transaction
      const txResult = await this.sendTransaction({
        method: 'registerContent',
        params: [contentId, contentHash, creator, metadataUri],
      })

      record.txHash = txResult.hash
      this.records.set(contentId, record)

      return txResult
    } catch (error) {
      throw new Error(
        `Failed to register content: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Records content ownership transfer on blockchain
   * @param contentId - Content identifier
   * @param from - Current owner address
   * @param to - New owner address
   * @param transferType - Type of transfer (transfer, license, derivative)
   * @returns Transaction result
   * @throws {Error} If content not found or transfer fails
   */
  async recordTransfer(
    contentId: string,
    from: string,
    to: string,
    transferType: CustodyRecord['type'] = 'transfer'
  ): Promise<TransactionResult> {
    const record = this.records.get(contentId)
    if (!record) {
      throw new Error(`Content ${contentId} not found`)
    }

    try {
      this.validateAddress(from)
      this.validateAddress(to)

      // Verify current ownership
      const currentOwner = this.getCurrentOwner(contentId)
      if (currentOwner !== from) {
        throw new Error(`Invalid transfer: ${from} is not the current owner`)
      }

      // Create custody record
      const custody: CustodyRecord = {
        from,
        to,
        timestamp: new Date(),
        type: transferType,
        txHash: '', // Will be set after blockchain transaction
      }

      // Send blockchain transaction
      const txResult = await this.sendTransaction({
        method: 'transferOwnership',
        params: [contentId, from, to, transferType],
      })

      custody.txHash = txResult.hash
      record.custody.push(custody)

      return txResult
    } catch (error) {
      throw new Error(
        `Failed to record transfer: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Verifies content authenticity and integrity
   * @param contentId - Content identifier
   * @param contentHash - Current content hash to verify
   * @returns Verification result with provenance details
   */
  async verifyContent(
    contentId: string,
    contentHash: string
  ): Promise<{
    verified: boolean
    record?: ProvenanceRecord
    tampered: boolean
    reason?: string
  }> {
    try {
      const record = await this.getProvenanceRecord(contentId)

      if (!record) {
        return {
          verified: false,
          tampered: false,
          reason: 'Content not registered',
        }
      }

      // Verify content hash matches original
      const tampered = record.contentHash !== contentHash

      return {
        verified: !tampered,
        record,
        tampered,
        reason: tampered ? 'Content hash mismatch - content modified' : undefined,
      }
    } catch (error) {
      return {
        verified: false,
        tampered: false,
        reason: `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  /**
   * Retrieves complete provenance record for content
   * @param contentId - Content identifier
   * @returns Provenance record with full custody chain
   * @throws {Error} If content not found
   */
  async getProvenanceRecord(contentId: string): Promise<ProvenanceRecord> {
    const record = this.records.get(contentId)
    if (!record) {
      throw new Error(`Content ${contentId} not found`)
    }

    // In production, fetch from blockchain for verification
    return { ...record, custody: [...record.custody] }
  }

  /**
   * Gets custody history for content
   * @param contentId - Content identifier
   * @returns Array of custody records in chronological order
   */
  async getCustodyChain(contentId: string): Promise<CustodyRecord[]> {
    const record = await this.getProvenanceRecord(contentId)
    return [...record.custody].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    )
  }

  /**
   * Gets current owner of content
   * @param contentId - Content identifier
   * @returns Current owner address
   */
  private getCurrentOwner(contentId: string): string {
    const record = this.records.get(contentId)
    if (!record) {
      throw new Error(`Content ${contentId} not found`)
    }

    // If no transfers, creator is owner
    if (record.custody.length === 0) {
      return record.creator
    }

    // Get most recent transfer
    const latestTransfer = record.custody[record.custody.length - 1]
    return latestTransfer.to
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
   * Validates content hash format (SHA-256)
   * @param hash - Hash to validate
   * @throws {Error} If hash invalid
   */
  private validateContentHash(hash: string): void {
    if (!hash || !/^[a-fA-F0-9]{64}$/.test(hash)) {
      throw new Error(`Invalid content hash: ${hash}`)
    }
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
    // In production, use web3.js, ethers.js, or similar library
    const txHash = `0x${this.generateTxHash()}`
    const timestamp = new Date()

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    const result: TransactionResult = {
      hash: txHash,
      blockNumber: Math.floor(Math.random() * 1000000),
      gasUsed: '21000',
      status: 'confirmed',
      timestamp,
    }

    // Wait for confirmations if configured
    if (this.config.waitForConfirmation) {
      await this.waitForConfirmations(txHash, this.config.confirmations || 1)
    }

    return result
  }

  /**
   * Waits for transaction confirmations
   * @param txHash - Transaction hash
   * @param confirmations - Number of confirmations to wait for
   */
  private async waitForConfirmations(
    txHash: string,
    confirmations: number
  ): Promise<void> {
    // Simulate confirmation waiting
    await new Promise((resolve) => setTimeout(resolve, confirmations * 100))
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
