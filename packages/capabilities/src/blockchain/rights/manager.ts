// AI-META-BEGIN
// 
// AI-META: Shared package module
// OWNERSHIP: packages/capabilities
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

/**
 * @module RightsManager
 * Digital rights management system for managing content usage rights,
 * licensing, and royalty distribution on blockchain.
 */

import type {
  BlockchainConfig,
  DigitalRights,
  RightsPermission,
  RoyaltyConfig,
  TransactionResult,
} from '../types'

/**
 * Rights manager for controlling digital content usage rights and
 * enforcing licensing terms through blockchain smart contracts.
 */
export class RightsManager {
  private config: BlockchainConfig
  private rights: Map<string, DigitalRights>
  private royaltyPayments: Map<string, RoyaltyPayment[]>

  /**
   * Creates a new rights manager instance
   * @param config - Blockchain configuration
   */
  constructor(config: BlockchainConfig) {
    this.config = config
    this.rights = new Map()
    this.royaltyPayments = new Map()
  }

  /**
   * Registers digital rights for content on blockchain
   * @param contentId - Content identifier
   * @param holder - Rights holder address
   * @param rightsConfig - Rights configuration
   * @returns Transaction result
   * @throws {Error} If rights already registered or transaction fails
   */
  async registerRights(
    contentId: string,
    holder: string,
    rightsConfig: Omit<DigitalRights, 'contentId' | 'holder'>
  ): Promise<TransactionResult> {
    const rightsKey = `${contentId}-${holder}`
    if (this.rights.has(rightsKey)) {
      throw new Error(`Rights already registered for content ${contentId}`)
    }

    try {
      this.validateAddress(holder)

      const rights: DigitalRights = {
        contentId,
        holder,
        ...rightsConfig,
      }

      // Validate rights configuration
      this.validateRights(rights)

      // Send blockchain transaction
      const txResult = await this.sendTransaction({
        method: 'registerRights',
        params: [contentId, holder, rightsConfig],
      })

      this.rights.set(rightsKey, rights)

      return txResult
    } catch (error) {
      throw new Error(
        `Failed to register rights: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Grants specific permission for content usage
   * @param contentId - Content identifier
   * @param holder - Rights holder address
   * @param permissionType - Type of permission to grant
   * @param grantee - Address receiving permission
   * @param conditions - Optional conditions for permission
   * @returns Transaction result
   * @throws {Error} If rights not found or grant fails
   */
  async grantPermission(
    contentId: string,
    holder: string,
    permissionType: RightsPermission['type'],
    grantee: string,
    conditions?: string[]
  ): Promise<TransactionResult> {
    const rights = this.getRights(contentId, holder)

    try {
      this.validateAddress(grantee)

      // Verify holder has authority to grant
      const permission = rights.permissions.find((p) => p.type === permissionType)
      if (!permission || !permission.granted) {
        throw new Error(
          `Rights holder does not have ${permissionType} permission to grant`
        )
      }

      // Send blockchain transaction
      const txResult = await this.sendTransaction({
        method: 'grantPermission',
        params: [contentId, holder, permissionType, grantee, conditions],
      })

      return txResult
    } catch (error) {
      throw new Error(
        `Failed to grant permission: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Revokes previously granted permission
   * @param contentId - Content identifier
   * @param holder - Rights holder address
   * @param permissionType - Type of permission to revoke
   * @param grantee - Address to revoke permission from
   * @returns Transaction result
   * @throws {Error} If revocation fails
   */
  async revokePermission(
    contentId: string,
    holder: string,
    permissionType: RightsPermission['type'],
    grantee: string
  ): Promise<TransactionResult> {
    const rights = this.getRights(contentId, holder)

    try {
      this.validateAddress(grantee)

      // Send blockchain transaction
      const txResult = await this.sendTransaction({
        method: 'revokePermission',
        params: [contentId, holder, permissionType, grantee],
      })

      return txResult
    } catch (error) {
      throw new Error(
        `Failed to revoke permission: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Verifies if an address has specific permission for content
   * @param contentId - Content identifier
   * @param address - Address to check
   * @param permissionType - Type of permission
   * @returns Verification result
   */
  async verifyPermission(
    contentId: string,
    address: string,
    permissionType: RightsPermission['type']
  ): Promise<{
    hasPermission: boolean
    rights?: DigitalRights
    expired: boolean
    reason?: string
  }> {
    try {
      // Find rights for content
      const contentRights = Array.from(this.rights.values()).filter(
        (r) => r.contentId === contentId
      )

      if (contentRights.length === 0) {
        return {
          hasPermission: false,
          expired: false,
          reason: 'No rights registered for content',
        }
      }

      // Check if address is rights holder
      const holderRights = contentRights.find((r) => r.holder === address)
      if (holderRights) {
        const expired = this.isExpired(holderRights)
        const permission = holderRights.permissions.find(
          (p) => p.type === permissionType
        )

        return {
          hasPermission: !expired && !!permission?.granted,
          rights: holderRights,
          expired,
          reason: expired
            ? 'Rights expired'
            : !permission?.granted
              ? 'Permission not granted'
              : undefined,
        }
      }

      // In production, check blockchain for granted permissions to address
      return {
        hasPermission: false,
        expired: false,
        reason: 'Address not authorized',
      }
    } catch (error) {
      return {
        hasPermission: false,
        expired: false,
        reason: `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  /**
   * Processes royalty payment for content usage
   * @param contentId - Content identifier
   * @param amount - Payment amount (in wei or token units)
   * @param payer - Address making payment
   * @returns Transaction result
   * @throws {Error} If payment processing fails
   */
  async processRoyaltyPayment(
    contentId: string,
    amount: string,
    payer: string
  ): Promise<TransactionResult> {
    try {
      this.validateAddress(payer)

      // Find rights with royalty configuration
      const contentRights = Array.from(this.rights.values()).find(
        (r) => r.contentId === contentId && r.royalties
      )

      if (!contentRights || !contentRights.royalties) {
        throw new Error(`No royalty configuration for content ${contentId}`)
      }

      const royalties = contentRights.royalties
      const amountNum = parseFloat(amount)

      // Check minimum payout
      if (royalties.minimumPayout && amountNum < royalties.minimumPayout) {
        throw new Error(
          `Amount ${amount} below minimum payout ${royalties.minimumPayout}`
        )
      }

      // Calculate royalty amount
      const royaltyAmount = (amountNum * royalties.percentage) / 100

      // Send blockchain transaction
      const txResult = await this.sendTransaction({
        method: 'processRoyalty',
        params: [contentId, payer, royalties.recipient, royaltyAmount.toString()],
      })

      // Record payment
      const payment: RoyaltyPayment = {
        contentId,
        payer,
        recipient: royalties.recipient,
        amount: royaltyAmount.toString(),
        percentage: royalties.percentage,
        timestamp: new Date(),
        txHash: txResult.hash,
      }

      const payments = this.royaltyPayments.get(contentId) || []
      payments.push(payment)
      this.royaltyPayments.set(contentId, payments)

      return txResult
    } catch (error) {
      throw new Error(
        `Failed to process royalty: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Gets digital rights for content and holder
   * @param contentId - Content identifier
   * @param holder - Rights holder address
   * @returns Digital rights
   * @throws {Error} If rights not found
   */
  getRights(contentId: string, holder: string): DigitalRights {
    const rightsKey = `${contentId}-${holder}`
    const rights = this.rights.get(rightsKey)
    if (!rights) {
      throw new Error(`Rights not found for content ${contentId}`)
    }
    return rights
  }

  /**
   * Gets royalty payment history for content
   * @param contentId - Content identifier
   * @returns Array of royalty payments
   */
  getRoyaltyHistory(contentId: string): RoyaltyPayment[] {
    return this.royaltyPayments.get(contentId) || []
  }

  /**
   * Checks if rights have expired
   * @param rights - Digital rights to check
   * @returns True if expired
   */
  private isExpired(rights: DigitalRights): boolean {
    if (!rights.expiresAt) {
      return false
    }
    return new Date() > rights.expiresAt
  }

  /**
   * Validates digital rights configuration
   * @param rights - Rights to validate
   * @throws {Error} If validation fails
   */
  private validateRights(rights: DigitalRights): void {
    if (rights.permissions.length === 0) {
      throw new Error('Rights must have at least one permission')
    }

    if (rights.royalties) {
      if (
        rights.royalties.percentage < 0 ||
        rights.royalties.percentage > 100
      ) {
        throw new Error('Royalty percentage must be between 0 and 100')
      }
      this.validateAddress(rights.royalties.recipient)
    }
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
      gasUsed: '50000',
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

/**
 * Royalty payment record
 */
interface RoyaltyPayment {
  contentId: string
  payer: string
  recipient: string
  amount: string
  percentage: number
  timestamp: Date
  txHash: string
}
