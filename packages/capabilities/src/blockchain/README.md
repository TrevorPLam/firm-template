# Blockchain Integration

Production-ready blockchain integration system for content management, rights tracking, and smart contracts.

## Features

### 1. Content Provenance Tracking
Track content creation, modifications, and ownership transfers with immutable blockchain records.

```typescript
import { ProvenanceTracker } from '@repo/capabilities/blockchain'

const tracker = new ProvenanceTracker({
  network: 'ethereum',
  rpcEndpoint: 'https://mainnet.infura.io/v3/YOUR_KEY',
  waitForConfirmation: true,
  confirmations: 3,
})

// Register content
const tx = await tracker.registerContent(
  'content-123',
  'a1b2c3d4...', // SHA-256 hash
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  'ipfs://QmXyz...' // metadata URI
)

// Verify authenticity
const verification = await tracker.verifyContent('content-123', currentHash)
console.log(verification.verified) // true/false
```

### 2. Digital Rights Management
Manage content usage rights, permissions, and royalty distribution.

```typescript
import { RightsManager } from '@repo/capabilities/blockchain'

const rights = new RightsManager(config)

// Register rights
await rights.registerRights('content-123', holderAddress, {
  type: 'exclusive',
  permissions: [
    { type: 'reproduce', granted: true },
    { type: 'distribute', granted: true },
    { type: 'modify', granted: false },
  ],
  royalties: {
    percentage: 10,
    recipient: holderAddress,
    minimumPayout: 100,
  },
})

// Grant permission
await rights.grantPermission(
  'content-123',
  holderAddress,
  'reproduce',
  granteeAddress
)
```

### 3. Digital Watermarking
Embed and verify invisible ownership markers in content.

```typescript
import { DigitalWatermarkManager } from '@repo/capabilities/blockchain'

const watermark = new DigitalWatermarkManager(config)

// Embed watermark
const { watermarkedContent } = await watermark.embedWatermark(
  'content-123',
  originalContent,
  'owner-signature-xyz',
  {
    type: 'invisible',
    algorithm: 'dct', // or 'lsb', 'dwt'
    robustness: 'high',
  }
)

// Verify watermark
const verification = await watermark.verifyWatermark(
  'content-123',
  suspectContent
)
console.log(verification.present) // true/false
console.log(verification.confidence) // 0-1
```

### 4. Blockchain Audit Trails
Immutable logging of system events and actions.

```typescript
import { AuditTrailManager } from '@repo/capabilities/blockchain'

const audit = new AuditTrailManager(config)

// Log event
await audit.logEvent({
  eventType: 'content.modified',
  actor: userAddress,
  resource: 'content-123',
  action: 'update',
  metadata: { fields: ['title', 'description'] },
})

// Query audit trail
const entries = await audit.queryAuditTrail({
  resource: 'content-123',
  startDate: new Date('2024-01-01'),
  limit: 50,
})
```

### 5. Smart Contract Licensing
Automated content licensing with usage tracking and payments.

```typescript
import { LicensingContractManager } from '@repo/capabilities/blockchain'

const licensing = new LicensingContractManager(config)

// Create license
const { licenseId } = await licensing.createLicense({
  licensor: creatorAddress,
  licensee: buyerAddress,
  contentId: 'content-123',
  type: 'standard',
  duration: 365, // days
  price: '1000000000000000000', // 1 ETH in wei
  usageLimits: {
    maxViews: 10000,
    maxDownloads: 100,
  },
  autoRenew: false,
})

// Activate with payment
await licensing.activateLicense(licenseId, paymentTxHash)

// Record usage
const usage = await licensing.recordUsage(licenseId, 'view')
console.log(usage.allowed) // true/false
```

## Configuration

```typescript
interface BlockchainConfig {
  /** Network to connect to */
  network: 'ethereum' | 'polygon' | 'binance' | string
  
  /** RPC endpoint URL */
  rpcEndpoint: string
  
  /** Smart contract addresses */
  contracts?: {
    provenance?: string
    rights?: string
    licensing?: string
  }
  
  /** Gas price strategy */
  gasPriceStrategy?: 'fast' | 'medium' | 'slow'
  
  /** Wait for confirmations */
  waitForConfirmation?: boolean
  
  /** Number of confirmations */
  confirmations?: number
}
```

## Integration with Web3 Libraries

This module is designed to integrate with popular blockchain libraries:

### Ethers.js
```typescript
import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint)
const signer = provider.getSigner()

// Use signer with blockchain capabilities
```

### Web3.js
```typescript
import Web3 from 'web3'

const web3 = new Web3(rpcEndpoint)
const account = web3.eth.accounts.wallet.add(privateKey)

// Use account with blockchain capabilities
```

## Smart Contract Deployment

Deploy the required smart contracts to your blockchain network:

1. **Provenance Contract**: Content registration and tracking
2. **Rights Contract**: Digital rights management
3. **Licensing Contract**: Automated licensing and payments
4. **Audit Contract**: Immutable event logging

Example Solidity contracts are available in the `/contracts` directory.

## Security Best Practices

1. **Private Keys**: Never expose private keys in code. Use environment variables or secure key management systems.
2. **Transaction Verification**: Always verify transaction status before updating local state.
3. **Gas Estimation**: Estimate gas costs before sending transactions to avoid failures.
4. **Rate Limiting**: Implement rate limiting for blockchain operations to prevent abuse.
5. **Access Control**: Validate permissions before allowing blockchain operations.

## Network Support

- **Ethereum Mainnet**: Production deployments
- **Polygon**: Lower gas fees, faster transactions
- **Binance Smart Chain**: Alternative EVM-compatible network
- **Test Networks**: Sepolia, Goerli, Mumbai for development

## Performance Considerations

- **Batching**: Use batch operations when logging multiple events
- **Caching**: Cache blockchain reads to reduce RPC calls
- **Async Operations**: All blockchain operations are async
- **Gas Optimization**: Minimize on-chain data storage

## Error Handling

All methods throw descriptive errors:

```typescript
try {
  await tracker.registerContent(contentId, hash, creator)
} catch (error) {
  if (error.message.includes('already registered')) {
    // Handle duplicate registration
  } else if (error.message.includes('Invalid address')) {
    // Handle validation error
  } else {
    // Handle unexpected error
  }
}
```

## Future Enhancements

- [ ] Multi-chain support (cross-chain transfers)
- [ ] IPFS integration for metadata storage
- [ ] NFT minting capabilities
- [ ] Decentralized storage integration
- [ ] Layer 2 scaling solutions
- [ ] DAO governance integration

## Resources

- [Ethereum Documentation](https://ethereum.org/en/developers/docs/)
- [Ethers.js Docs](https://docs.ethers.io/)
- [Web3.js Docs](https://web3js.readthedocs.io/)
- [Solidity Documentation](https://docs.soliditylang.org/)
