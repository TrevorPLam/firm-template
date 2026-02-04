/**
 * @module LicensingContracts
 * Smart contract-based licensing system for automated content licensing,
 * payments, and usage tracking.
 */

import type {
  BlockchainConfig,
  LicenseTerms,
  UsageLimits,
  LicenseEvent,
  TransactionResult,
} from '../types'

/**
 * Licensing contract manager for creating and managing smart contracts
 * that govern content usage rights and automated payments.
 */
export class LicensingContractManager {
  private config: BlockchainConfig
  private licenses: Map<string, LicenseTerms>
  private usageTracking: Map<string, UsageTracking>
  private events: Map<string, LicenseEvent[]>

  /**
   * Creates a new licensing contract manager instance
   * @param config - Blockchain configuration
   */
  constructor(config: BlockchainConfig) {
    this.config = config
    this.licenses = new Map()
    this.usageTracking = new Map()
    this.events = new Map()
  }

  /**
   * Creates a new license smart contract
   * @param terms - License terms
   * @returns Transaction result with license ID
   * @throws {Error} If contract creation fails
   */
  async createLicense(
    terms: Omit<LicenseTerms, 'id' | 'status'>
  ): Promise<{ licenseId: string; transaction: TransactionResult }> {
    try {
      this.validateAddress(terms.licensor)
      this.validateAddress(terms.licensee)
      this.validateLicenseTerms(terms)

      const licenseId = this.generateLicenseId()

      const license: LicenseTerms = {
        id: licenseId,
        ...terms,
        status: 'pending',
      }

      // Deploy smart contract
      const txResult = await this.sendTransaction({
        method: 'createLicense',
        params: [license],
      })

      this.licenses.set(licenseId, license)

      // Initialize usage tracking
      this.usageTracking.set(licenseId, {
        views: 0,
        downloads: 0,
        derivatives: 0,
        lastUsed: undefined,
      })

      // Log event
      await this.logEvent(licenseId, 'created', { terms })

      return { licenseId, transaction: txResult }
    } catch (error) {
      throw new Error(
        `Failed to create license: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Activates a pending license contract
   * @param licenseId - License identifier
   * @param paymentTxHash - Payment transaction hash
   * @returns Transaction result
   * @throws {Error} If activation fails
   */
  async activateLicense(
    licenseId: string,
    paymentTxHash?: string
  ): Promise<TransactionResult> {
    const license = this.getLicense(licenseId)

    if (license.status !== 'pending') {
      throw new Error(`License ${licenseId} is not in pending status`)
    }

    try {
      // Verify payment if required
      if (parseFloat(license.price) > 0) {
        if (!paymentTxHash) {
          throw new Error('Payment transaction hash required')
        }
        await this.verifyPayment(paymentTxHash, license.price)
      }

      // Activate contract
      const txResult = await this.sendTransaction({
        method: 'activateLicense',
        params: [licenseId, paymentTxHash],
      })

      license.status = 'active'
      await this.logEvent(licenseId, 'activated', { paymentTxHash })

      return txResult
    } catch (error) {
      throw new Error(
        `Failed to activate license: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Records content usage under license
   * @param licenseId - License identifier
   * @param usageType - Type of usage (view, download, derivative)
   * @returns Usage allowed status
   * @throws {Error} If usage recording fails
   */
  async recordUsage(
    licenseId: string,
    usageType: 'view' | 'download' | 'derivative'
  ): Promise<{ allowed: boolean; reason?: string }> {
    const license = this.getLicense(licenseId)

    if (license.status !== 'active') {
      return {
        allowed: false,
        reason: `License is ${license.status}`,
      }
    }

    try {
      // Check if license expired
      const now = new Date()
      const activationDate = new Date(license.duration)
      if (now.getTime() > activationDate.getTime()) {
        license.status = 'expired'
        await this.logEvent(licenseId, 'expired', {})
        return {
          allowed: false,
          reason: 'License expired',
        }
      }

      // Check usage limits
      const tracking = this.usageTracking.get(licenseId)!
      const limits = license.usageLimits

      if (limits) {
        if (usageType === 'view' && limits.maxViews) {
          if (tracking.views >= limits.maxViews) {
            return {
              allowed: false,
              reason: 'View limit exceeded',
            }
          }
        }
        if (usageType === 'download' && limits.maxDownloads) {
          if (tracking.downloads >= limits.maxDownloads) {
            return {
              allowed: false,
              reason: 'Download limit exceeded',
            }
          }
        }
        if (usageType === 'derivative' && limits.maxDerivatives) {
          if (tracking.derivatives >= limits.maxDerivatives) {
            return {
              allowed: false,
              reason: 'Derivative limit exceeded',
            }
          }
        }
      }

      // Record usage
      await this.sendTransaction({
        method: 'recordUsage',
        params: [licenseId, usageType],
      })

      // Update tracking
      if (usageType === 'view') tracking.views++
      if (usageType === 'download') tracking.downloads++
      if (usageType === 'derivative') tracking.derivatives++
      tracking.lastUsed = new Date()

      return { allowed: true }
    } catch (error) {
      throw new Error(
        `Failed to record usage: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Renews an active license
   * @param licenseId - License identifier
   * @param paymentTxHash - Payment transaction hash
   * @returns Transaction result
   * @throws {Error} If renewal fails
   */
  async renewLicense(
    licenseId: string,
    paymentTxHash: string
  ): Promise<TransactionResult> {
    const license = this.getLicense(licenseId)

    if (!license.autoRenew && license.status !== 'active') {
      throw new Error('License cannot be renewed')
    }

    try {
      // Verify payment
      await this.verifyPayment(paymentTxHash, license.price)

      // Renew contract
      const txResult = await this.sendTransaction({
        method: 'renewLicense',
        params: [licenseId, paymentTxHash],
      })

      license.status = 'active'
      await this.logEvent(licenseId, 'renewed', { paymentTxHash })

      return txResult
    } catch (error) {
      throw new Error(
        `Failed to renew license: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Revokes an active license
   * @param licenseId - License identifier
   * @param revokedBy - Address revoking the license
   * @param reason - Revocation reason
   * @returns Transaction result
   * @throws {Error} If revocation fails
   */
  async revokeLicense(
    licenseId: string,
    revokedBy: string,
    reason: string
  ): Promise<TransactionResult> {
    const license = this.getLicense(licenseId)

    try {
      this.validateAddress(revokedBy)

      // Verify authority to revoke
      if (revokedBy !== license.licensor && revokedBy !== license.licensee) {
        throw new Error('Not authorized to revoke license')
      }

      // Revoke contract
      const txResult = await this.sendTransaction({
        method: 'revokeLicense',
        params: [licenseId, revokedBy, reason],
      })

      license.status = 'revoked'
      await this.logEvent(licenseId, 'revoked', { revokedBy, reason })

      return txResult
    } catch (error) {
      throw new Error(
        `Failed to revoke license: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Gets license by ID
   * @param licenseId - License identifier
   * @returns License terms
   * @throws {Error} If license not found
   */
  getLicense(licenseId: string): LicenseTerms {
    const license = this.licenses.get(licenseId)
    if (!license) {
      throw new Error(`License ${licenseId} not found`)
    }
    return license
  }

  /**
   * Gets usage statistics for license
   * @param licenseId - License identifier
   * @returns Usage tracking data
   */
  getUsageStats(licenseId: string): UsageTracking {
    const tracking = this.usageTracking.get(licenseId)
    if (!tracking) {
      throw new Error(`License ${licenseId} not found`)
    }
    return { ...tracking }
  }

  /**
   * Gets license events
   * @param licenseId - License identifier
   * @returns Array of license events
   */
  getLicenseEvents(licenseId: string): LicenseEvent[] {
    return this.events.get(licenseId) || []
  }

  /**
   * Gets active licenses for licensee
   * @param licensee - Licensee address
   * @returns Array of active licenses
   */
  getActiveLicenses(licensee: string): LicenseTerms[] {
    return Array.from(this.licenses.values()).filter(
      (l) => l.licensee === licensee && l.status === 'active'
    )
  }

  /**
   * Logs license event
   * @param licenseId - License identifier
   * @param type - Event type
   * @param data - Event data
   */
  private async logEvent(
    licenseId: string,
    type: LicenseEvent['type'],
    data: Record<string, unknown>
  ): Promise<void> {
    const event: LicenseEvent = {
      type,
      licenseId,
      timestamp: new Date(),
      txHash: `0x${this.generateTxHash()}`,
      data,
    }

    const events = this.events.get(licenseId) || []
    events.push(event)
    this.events.set(licenseId, events)
  }

  /**
   * Validates license terms
   * @param terms - Terms to validate
   * @throws {Error} If validation fails
   */
  private validateLicenseTerms(
    terms: Omit<LicenseTerms, 'id' | 'status'>
  ): void {
    if (terms.duration <= 0) {
      throw new Error('License duration must be positive')
    }

    if (parseFloat(terms.price) < 0) {
      throw new Error('License price cannot be negative')
    }

    if (terms.usageLimits) {
      const limits = terms.usageLimits
      if (limits.maxViews !== undefined && limits.maxViews < 0) {
        throw new Error('Max views cannot be negative')
      }
      if (limits.maxDownloads !== undefined && limits.maxDownloads < 0) {
        throw new Error('Max downloads cannot be negative')
      }
      if (limits.maxDerivatives !== undefined && limits.maxDerivatives < 0) {
        throw new Error('Max derivatives cannot be negative')
      }
    }
  }

  /**
   * Verifies payment transaction
   * @param txHash - Transaction hash
   * @param expectedAmount - Expected payment amount
   * @returns True if verified
   */
  private async verifyPayment(
    txHash: string,
    expectedAmount: string
  ): Promise<boolean> {
    // Simulate payment verification
    await new Promise((resolve) => setTimeout(resolve, 50))
    return true
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
   * Generates unique license ID
   * @returns License ID
   */
  private generateLicenseId(): string {
    return `lic-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
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
    const txHash = `0x${this.generateTxHash()}`
    await new Promise((resolve) => setTimeout(resolve, 100))

    return {
      hash: txHash,
      blockNumber: Math.floor(Math.random() * 1000000),
      gasUsed: '75000',
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
 * Usage tracking data
 */
interface UsageTracking {
  views: number
  downloads: number
  derivatives: number
  lastUsed?: Date
}
