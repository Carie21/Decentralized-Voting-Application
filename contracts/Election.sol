// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract Election {
    struct Candidate {
        address id;
        string name;
        uint votes;
    }
    struct Voter {
        bool permission;
        bool voteStatus;
    }
    address payable public admin;
    mapping(uint => Candidate) public candidates;
    mapping(address => Voter) public voters;

    uint count;

    constructor(address payable _admin) {
        admin = _admin;
        count = 0;
    }

    function addCandidate(string memory name) public {
        candidates[count] = Candidate(msg.sender, name, 0);
        count++;
    }

    function getCandidate(uint _id) public view returns (Candidate memory) {
        return candidates[_id - 1];
    }

    function getCount() public view returns (uint) {
        return count;
    }

    function addVoter(address _voter) public {
        require(msg.sender == admin, "Only the admin can add voters");
        voters[_voter].permission = true;
    }

    function getVotes(uint _id) public view returns (uint) {
        return candidates[_id - 1].votes;
    }

    function addVotes(uint _id) public {
        require(
            voters[msg.sender].permission,
            "You do not have permission to vote"
        );
        require(!voters[msg.sender].voteStatus, "You have already voted");
        voters[msg.sender].voteStatus = true;
        candidates[_id - 1].votes++;
    }

    function voterAddress() public view returns (address) {
        return msg.sender;
    }

    function endVote() public {
        require(
            msg.sender == admin,
            "Only the admin can end the voting session"
        );
        selfdestruct(admin);
    }
}
