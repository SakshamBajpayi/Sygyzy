// blockchain-service.js
import Web3 from 'web3';
import crypto from 'crypto';

class SpaceSecurityBlockchain {
    constructor() {
        // Initialize Web3 connection to Ganache
        this.web3 = new Web3('http://127.0.0.1:7545'); // Ganache default
        this.contract = null;
        this.contractAddress = null;
        this.account = null;
        
        // Contract ABI (you'll get this after compiling)
        this.contractABI = [
            // Add your compiled contract ABI here
            // This is a simplified version for demonstration
            {
                "inputs": [
                    {"internalType": "string", "name": "_satelliteId", "type": "string"},
                    {"internalType": "string", "name": "_eventType", "type": "string"},
                    {"internalType": "string", "name": "_severity", "type": "string"},
                    {"internalType": "string", "name": "_description", "type": "string"},
                    {"internalType": "bytes32", "name": "_dataHash", "type": "bytes32"}
                ],
                "name": "logSecurityEvent",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "type": "function"
            },
            {
                "inputs": [
                    {"internalType": "string", "name": "_satelliteId", "type": "string"},
                    {"internalType": "string", "name": "_anomalyType", "type": "string"},
                    {"internalType": "uint256", "name": "_confidenceScore", "type": "uint256"},
                    {"internalType": "string", "name": "_telemetryData", "type": "string"},
                    {"internalType": "bytes32", "name": "_dataHash", "type": "bytes32"}
                ],
                "name": "logAnomaly",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "type": "function"
            },
            {
                "inputs": [{"internalType": "uint256", "name": "_count", "type": "uint256"}],
                "name": "getRecentSecurityEvents",
                "outputs": [],
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {"indexed": true, "internalType": "uint256", "name": "eventId", "type": "uint256"},
                    {"indexed": true, "internalType": "string", "name": "satelliteId", "type": "string"},
                    {"indexed": false, "internalType": "string", "name": "eventType", "type": "string"},
                    {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
                ],
                "name": "SecurityEventLogged",
                "type": "event"
            }
        ];
    }

    // Initialize blockchain connection
    async initialize(contractAddress) {
        try {
            this.contractAddress = contractAddress;
            
            // Get accounts from Ganache
            const accounts = await this.web3.eth.getAccounts();
            this.account = accounts[0];
            
            // Initialize contract instance
            this.contract = new this.web3.eth.Contract(
                this.contractABI,
                this.contractAddress
            );
            
            console.log('Blockchain service initialized');
            console.log('Account:', this.account);
            console.log('Contract:', this.contractAddress);
            
            return true;
        } catch (error) {
            console.error('Failed to initialize blockchain service:', error);
            return false;
        }
    }

    // Create hash for data integrity
    createDataHash(data) {
        const dataString = JSON.stringify(data);
        return '0x' + crypto.createHash('sha256').update(dataString).digest('hex');
    }

    // Log security events to blockchain
    async logSecurityEvent(satelliteId, eventType, severity, description, additionalData = {}) {
        try {
            const eventData = {
                satelliteId,
                eventType,
                severity,
                description,
                timestamp: new Date().toISOString(),
                ...additionalData
            };
            
            const dataHash = this.createDataHash(eventData);
            
            const result = await this.contract.methods.logSecurityEvent(
                satelliteId,
                eventType,
                severity,
                description,
                dataHash
            ).send({
                from: this.account,
                gas: 300000
            });
            
            console.log('Security event logged:', result.transactionHash);
            return {
                success: true,
                transactionHash: result.transactionHash,
                eventId: result.events.SecurityEventLogged?.returnValues?.eventId
            };
            
        } catch (error) {
            console.error('Failed to log security event:', error);
            return { success: false, error: error.message };
        }
    }

    // Log AI anomaly detection results
    async logAnomaly(satelliteId, anomalyType, confidenceScore, telemetryData) {
        try {
            const anomalyData = {
                satelliteId,
                anomalyType,
                confidenceScore,
                telemetryData,
                timestamp: new Date().toISOString()
            };
            
            const dataHash = this.createDataHash(anomalyData);
            
            const result = await this.contract.methods.logAnomaly(
                satelliteId,
                anomalyType,
                Math.round(confidenceScore * 100), // Convert to percentage
                JSON.stringify(telemetryData),
                dataHash
            ).send({
                from: this.account,
                gas: 300000
            });
            
            console.log('Anomaly logged:', result.transactionHash);
            return {
                success: true,
                transactionHash: result.transactionHash,
                anomalyId: result.events.AnomalyDetected?.returnValues?.anomalyId
            };
            
        } catch (error) {
            console.error('Failed to log anomaly:', error);
            return { success: false, error: error.message };
        }
    }

    // Get recent security events from blockchain
    async getRecentSecurityEvents(count = 10) {
        try {
            const events = await this.contract.methods.getRecentSecurityEvents(count).call();
            return {
                success: true,
                events: events
            };
        } catch (error) {
            console.error('Failed to get recent events:', error);
            return { success: false, error: error.message };
        }
    }

    // Listen for real-time events
    subscribeToEvents(callback) {
        // Listen for SecurityEventLogged events
        this.contract.events.SecurityEventLogged({
            fromBlock: 'latest'
        })
        .on('data', (event) => {
            callback({
                type: 'security_event',
                data: event.returnValues,
                blockHash: event.blockHash,
                transactionHash: event.transactionHash
            });
        })
        .on('error', console.error);

        // Listen for AnomalyDetected events
        this.contract.events.AnomalyDetected({
            fromBlock: 'latest'
        })
        .on('data', (event) => {
            callback({
                type: 'anomaly_detected',
                data: event.returnValues,
                blockHash: event.blockHash,
                transactionHash: event.transactionHash
            });
        })
        .on('error', console.error);
    }

    // Verify event integrity
    async verifyEventIntegrity(eventData, dataHash) {
        const computedHash = this.createDataHash(eventData);
        return computedHash === dataHash;
    }

    // Get blockchain network status
    async getNetworkStatus() {
        try {
            const blockNumber = await this.web3.eth.getBlockNumber();
            const networkId = await this.web3.eth.net.getId();
            const accounts = await this.web3.eth.getAccounts();
            
            return {
                blockNumber,
                networkId,
                accountCount: accounts.length,
                connected: true
            };
        } catch (error) {
            return { connected: false, error: error.message };
        }
    }
}

// Integration with your ML anomaly detection
class MLBlockchainBridge {
    constructor(blockchainService) {
        this.blockchain = blockchainService;
    }

    // Process ML results and log to blockchain
    async processAnomalyDetection(mlResults) {
        const { satelliteId, anomalyType, confidence, telemetryData } = mlResults;
        
        // Only log high-confidence anomalies to reduce blockchain bloat
        if (confidence > 0.7) {
            return await this.blockchain.logAnomaly(
                satelliteId,
                anomalyType,
                confidence,
                telemetryData
            );
        }
        
        return { success: false, reason: 'Low confidence score' };
    }

    // Process security incidents
    async processSecurityIncident(incidentData) {
        const { satelliteId, attackType, severity, details } = incidentData;
        
        return await this.blockchain.logSecurityEvent(
            satelliteId,
            attackType,
            severity,
            details,
            { source: 'automated_detection' }
        );
    }
}

// Usage example for your React dashboard
class DashboardBlockchainIntegration {
    constructor() {
        this.blockchain = new SpaceSecurityBlockchain();
        this.mlBridge = new MLBlockchainBridge(this.blockchain);
        this.eventCallbacks = [];
    }

    async initialize() {
        // Replace with your deployed contract address
        const contractAddress = '0x...'; // You'll get this after deployment
        return await this.blockchain.initialize(contractAddress);
    }

    // Subscribe to blockchain events for real-time dashboard updates
    subscribeToBlockchainEvents(callback) {
        this.eventCallbacks.push(callback);
        
        this.blockchain.subscribeToEvents((event) => {
            // Notify all registered callbacks
            this.eventCallbacks.forEach(cb => cb(event));
        });
    }

    // Simulate red team attack logging
    async simulateRedTeamAttack(attackData) {
        return await this.blockchain.logSecurityEvent(
            attackData.targetSatellite,
            attackData.attackType,
            'HIGH',
            `Red team simulation: ${attackData.description}`,
            { simulation: true, redTeam: true }
        );
    }

    // Get trust score based on blockchain events
    async calculateTrustScore(satelliteId) {
        try {
            const events = await this.blockchain.getRecentSecurityEvents(50);
            // Implement trust scoring logic based on event history
            // This is a simplified example
            let trustScore = 100;
            
            events.events?.forEach(event => {
                if (event.satelliteId === satelliteId) {
                    if (event.severity === 'HIGH') trustScore -= 10;
                    else if (event.severity === 'MEDIUM') trustScore -= 5;
                    else if (event.severity === 'LOW') trustScore -= 2;
                }
            });
            
            return Math.max(0, trustScore);
        } catch (error) {
            console.error('Failed to calculate trust score:', error);
            return 0;
        }
    }
}

export { SpaceSecurityBlockchain, MLBlockchainBridge, DashboardBlockchainIntegration };