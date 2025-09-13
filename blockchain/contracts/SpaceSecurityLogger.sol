// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SpaceSecurityLogger {
    // Event structure for logging security events
    struct SecurityEvent {
        uint256 timestamp;
        string satelliteId;
        string eventType;
        string severity;
        string description;
        bytes32 dataHash;
        address reporter;
        bool verified;
    }
    
    // Event structure for anomaly detection results
    struct AnomalyEvent {
        uint256 timestamp;
        string satelliteId;
        string anomalyType;
        uint256 confidenceScore;
        string telemetryData;
        bytes32 dataHash;
        address detector;
    }
    
    // Storage
    SecurityEvent[] public securityEvents;
    AnomalyEvent[] public anomalyEvents;
    
    // Mappings for quick access
    mapping(string => uint256[]) public eventsBySatellite;
    mapping(address => bool) public authorizedReporters;
    mapping(bytes32 => bool) public eventHashes;
    
    // Access control
    address public owner;
    
    // Events for frontend listening
    event SecurityEventLogged(
        uint256 indexed eventId,
        string indexed satelliteId,
        string eventType,
        uint256 timestamp
    );
    
    event AnomalyDetected(
        uint256 indexed anomalyId,
        string indexed satelliteId,
        string anomalyType,
        uint256 confidenceScore,
        uint256 timestamp
    );
    
    event ReporterAuthorized(address indexed reporter);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAuthorized() {
        require(
            authorizedReporters[msg.sender] || msg.sender == owner,
            "Not authorized to log events"
        );
        _;
    }
    
    constructor() {
        owner = msg.sender;
        authorizedReporters[msg.sender] = true;
    }
    
    // Authorize new reporters (AI systems, ground stations, etc.)
    function authorizeReporter(address _reporter) public onlyOwner {
        authorizedReporters[_reporter] = true;
        emit ReporterAuthorized(_reporter);
    }
    
    // Log security events (attacks, breaches, etc.)
    function logSecurityEvent(
        string memory _satelliteId,
        string memory _eventType,
        string memory _severity,
        string memory _description,
        bytes32 _dataHash
    ) public onlyAuthorized returns (uint256) {
        // Prevent duplicate events
        require(!eventHashes[_dataHash], "Event already logged");
        
        SecurityEvent memory newEvent = SecurityEvent({
            timestamp: block.timestamp,
            satelliteId: _satelliteId,
            eventType: _eventType,
            severity: _severity,
            description: _description,
            dataHash: _dataHash,
            reporter: msg.sender,
            verified: false
        });
        
        securityEvents.push(newEvent);
        uint256 eventId = securityEvents.length - 1;
        
        eventsBySatellite[_satelliteId].push(eventId);
        eventHashes[_dataHash] = true;
        
        emit SecurityEventLogged(eventId, _satelliteId, _eventType, block.timestamp);
        
        return eventId;
    }
    
    // Log anomaly detection results
    function logAnomaly(
        string memory _satelliteId,
        string memory _anomalyType,
        uint256 _confidenceScore,
        string memory _telemetryData,
        bytes32 _dataHash
    ) public onlyAuthorized returns (uint256) {
        require(!eventHashes[_dataHash], "Anomaly already logged");
        require(_confidenceScore <= 100, "Confidence score must be <= 100");
        
        AnomalyEvent memory newAnomaly = AnomalyEvent({
            timestamp: block.timestamp,
            satelliteId: _satelliteId,
            anomalyType: _anomalyType,
            confidenceScore: _confidenceScore,
            telemetryData: _telemetryData,
            dataHash: _dataHash,
            detector: msg.sender
        });
        
        anomalyEvents.push(newAnomaly);
        uint256 anomalyId = anomalyEvents.length - 1;
        
        eventHashes[_dataHash] = true;
        
        emit AnomalyDetected(
            anomalyId,
            _satelliteId,
            _anomalyType,
            _confidenceScore,
            block.timestamp
        );
        
        return anomalyId;
    }
    
    // Verify security events (for trust scoring)
    function verifyEvent(uint256 _eventId) public onlyOwner {
        require(_eventId < securityEvents.length, "Event does not exist");
        securityEvents[_eventId].verified = true;
    }
    
    // Get events for a specific satellite
    function getEventsBySatellite(string memory _satelliteId) 
        public view returns (uint256[] memory) {
        return eventsBySatellite[_satelliteId];
    }
    
    // Get recent security events
    function getRecentSecurityEvents(uint256 _count) 
        public view returns (SecurityEvent[] memory) {
        uint256 totalEvents = securityEvents.length;
        uint256 returnCount = _count > totalEvents ? totalEvents : _count;
        
        SecurityEvent[] memory recentEvents = new SecurityEvent[](returnCount);
        
        for (uint256 i = 0; i < returnCount; i++) {
            recentEvents[i] = securityEvents[totalEvents - 1 - i];
        }
        
        return recentEvents;
    }
    
    // Get recent anomalies
    function getRecentAnomalies(uint256 _count) 
        public view returns (AnomalyEvent[] memory) {
        uint256 totalAnomalies = anomalyEvents.length;
        uint256 returnCount = _count > totalAnomalies ? totalAnomalies : _count;
        
        AnomalyEvent[] memory recentAnomalies = new AnomalyEvent[](returnCount);
        
        for (uint256 i = 0; i < returnCount; i++) {
            recentAnomalies[i] = anomalyEvents[totalAnomalies - 1 - i];
        }
        
        return recentAnomalies;
    }
    
    // Get total counts
    function getTotalSecurityEvents() public view returns (uint256) {
        return securityEvents.length;
    }
    
    function getTotalAnomalies() public view returns (uint256) {
        return anomalyEvents.length;
    }
    
    // Emergency functions
    function pauseContract() public onlyOwner {
        // Implementation for emergency pause
    }
}