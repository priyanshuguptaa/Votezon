// SPDX-License-Identifier: priyanshu

pragma solidity ^0.8.4;

contract ManageElection {
    
    address[] public elections;
    
     function createElections(string memory _electionName) public{
        address newElection = address(new Election(_electionName, msg.sender));
        elections.push(newElection);
    }
    
    function getDeployedElections() public view returns (address[] memory){
        return elections;
    }
    
}

contract Election{
    
    struct Voters{
        string name;
        string voterId;
        string imageHash;
        bool voted;
        
        
    }
    
    struct Candidates{
        string name;
        string candidateImageHash;
        uint voteCount;
        
    }
    
    
    mapping(address => Voters ) public voters;
    mapping(uint => Candidates) public candidates;
    uint public voterCount;
    uint public candidatesCount;
    string public electionName;
    address public ownerOfElection;
    bool public electionCompleted;
    address[] public votedCandidates;
    
    constructor(string memory _electionName, address  _sender) {
        ownerOfElection = _sender;
        electionName = _electionName;
    }
    
    modifier ownerOnly(){
        require(msg.sender == ownerOfElection);
        require(!electionCompleted);
        _;
    }
    
    
    function addCandidates(string memory _candidateName, string memory _candidateImageHash) ownerOnly public {
        
        candidatesCount++;
        candidates[candidatesCount] = Candidates({name: _candidateName, voteCount: 0, candidateImageHash: _candidateImageHash });
        
        
    }
    
    function giveVote(uint _candidateIndexNumber) public {
        require(!electionCompleted);
        string memory empty = "";
        require(!(keccak256(bytes(voters[msg.sender].name)) == keccak256(bytes(empty))));
       
        require(voters[msg.sender].voted == false);
        
        candidates[_candidateIndexNumber].voteCount++;
        
        voters[msg.sender].voted = true;
        
        votedCandidates.push(msg.sender);
        
    }
    
    
    function addVoter(string memory _name, string memory _voterId, string memory _imageHash) public {
       string memory empty = "";
        require(keccak256(bytes(voters[msg.sender].voterId)) == keccak256(bytes(empty)));
        voters[msg.sender] = Voters({name: _name, voterId: _voterId, imageHash: _imageHash, voted: false});
        voterCount++;
    }
    
    function finalizeVoting() public {
        electionCompleted = !electionCompleted;
    }
    
    
    function votedCandidatesAddress()  public view returns (address[] memory){
        return votedCandidates;
    }


    function getSummary() public view returns ( string memory, address, uint, uint, bool){
        return (electionName, ownerOfElection, candidatesCount, voterCount, electionCompleted);
    }
    
    
    
    
    
    
}