// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

contract Insurance{
    struct miners{
        uint lastAproval;
        uint totalPositive;
        uint totalNegative;
        uint dueAmount;
    }
    struct minerReward{
        uint amount;
        address miner;
    }
    mapping(address=>miners) public minerList;
    mapping(address=>bool) public isminer;
    mapping (uint=>minerReward) public minerPayment;
    struct user {  
        uint totalAmount;                
        uint policy;   
        uint lastTimePayment;    
        uint registrationDate;
        uint dueAmount;          
        uint lastTimeClaim;
        uint lastClaimNumber;
        uint blockTimestamp;
       
    }
    mapping(address=>user) public userList;  
    mapping(address=>bool)public userList1;
      
          
    struct claimUserDetail{ 
        address user;       
        uint countminerP;
        uint countminerN;         
        string description;
        address [] array;
        bool []posNeg;
        uint idx;
        uint totalMin;
        string res;    
    }
    mapping(uint=>claimUserDetail) public claimUsers;
    mapping(address=>bool) public CheckBeforeStatus;
    function userLastClaimNumber() public view returns(uint){
        bool isUser=userList1[msg.sender];
        require(isUser,"you are not user of this company");
        user storage usrDetails=userList[msg.sender];
        require(usrDetails.lastClaimNumber>0,"you are not claim yet");
        return usrDetails.lastClaimNumber;
    }
    address public company;           
    uint public totalMiner;            
    uint public minimumCriteria;        
    uint public minimumRequirnmentTime;  
    uint public totalClaimUsers;        
    uint public totalApproveUsers;      
    uint public minerIndexApproved;
    uint public MinerIndexNotApproved;
    constructor(){             
        company=msg.sender;            
        minimumCriteria=5 wei;          
        totalMiner=0;               
        minimumRequirnmentTime=5;         
        totalClaimUsers=0;             
        totalApproveUsers=0;  
        minerIndexApproved=0; 
        MinerIndexNotApproved=0;   
        
    }
    modifier onlyCompany(){  
        require(msg.sender==company,"Only company can call this function");
        _;
    }
    function addUser() public payable{ 
        require(msg.sender!=company,"hey owner can not be user");
        require(msg.value>=minimumCriteria,"you must fullfill minimum cateria");
        bool  checkUsr=userList1[msg.sender];
        require(checkUsr==false,"you are alredy register");
        user storage newUser=userList[msg.sender]; 
        (bool sent, ) = company.call{value: msg.value}("");
        require(sent, "Failed to send Ether Amount");
        newUser.policy=msg.value;
        newUser.totalAmount=msg.value; 
        newUser.lastTimePayment=block.timestamp;
        newUser.registrationDate=block.timestamp;
        newUser.dueAmount=0;
        newUser.lastTimeClaim=block.timestamp;
        newUser.blockTimestamp=block.timestamp;
        newUser.lastClaimNumber=0;
        userList1[msg.sender]=true;
    }
    function subsequentPayment() public payable{
        bool  checkUsr=userList1[msg.sender];
        require(checkUsr,"you are not register yet");
        user storage usr=userList[msg.sender]; 
        uint duetime=(block.timestamp-usr.lastTimePayment)/180;
        require(duetime>=1,"next subsequent payment must be done after 3 min of last payment");
        require(msg.value>=usr.policy*duetime,"hey you have due first check due money");
        (bool send,)=company.call{value:msg.value}("");
        require(send,"Failed to send ether");
        uint temp=msg.value/usr.policy;
        usr.lastTimePayment+=(180*temp);
    }
    function get() public {
        bool  checkUsr=userList1[msg.sender];
        require(checkUsr,"you are not alredy register yet");
        user storage usr=userList[msg.sender]; 
        usr.blockTimestamp= block.timestamp;
    }
    function dueAmountUser() public view returns(uint){
        bool  checkUsr=userList1[msg.sender];
        require(checkUsr,"you are not alredy register yet");
        user storage usr=userList[msg.sender]; 
        uint duetime=(usr.blockTimestamp-usr.lastTimePayment)/180; 
        return duetime;
    }
    function getUserPolicy() public returns(uint){
        bool  checkUsr=userList1[msg.sender];
        require(checkUsr,"you are not alredy register yet");
        user storage usr=userList[msg.sender];
        uint v=usr.policy/1 ether;
        return v;
    }
    function addMiner(address _miner) public onlyCompany { 
            bool check=isminer[_miner];
            require(check==false,"hey this id is already miner");  
            miners storage newminer=minerList[_miner];    
            newminer.lastAproval=totalClaimUsers; 
            newminer.totalNegative=0;
            newminer.totalPositive=0; 
            newminer.dueAmount=0;  
            isminer[_miner]=true;
            totalMiner++;                             
    }
    function removeMiner(address _miner) public onlyCompany{
        bool check=isminer[_miner]; 
        require(check==true,"hey this id is not miner");
        isminer[_miner]=false;
        totalMiner--;                                                                                   
    }
    
    function insuranceClaim(string memory _desc) public { 
       bool check=userList1[msg.sender];
       require(check,"you must have to registration first");
       user storage usrDetail=userList[msg.sender]; 
       uint minTime=(block.timestamp-usrDetail.lastTimeClaim)/180;
       require(minTime>=2,"Company policy does not satisfy");
       require((block.timestamp-usrDetail.lastTimePayment)/180==0,"First Clear Due Amount"); 
       bool checkInitail=CheckBeforeStatus[msg.sender];
       require(checkInitail==false,"You are already claimed");
        claimUserDetail storage newClaim=claimUsers[totalClaimUsers];
        newClaim.user=msg.sender;
        newClaim.countminerP=0;
        newClaim.countminerN=0;
        newClaim.description=_desc;
        newClaim.array=new address[](totalMiner);
        newClaim.posNeg=new bool[](totalMiner);
        newClaim.idx=0;
        newClaim.res="waiting";
        newClaim.totalMin=totalMiner;
        totalClaimUsers++;
        CheckBeforeStatus[msg.sender]=true; 
    }
    
    function minerLastApprovalStatus() public payable{
        bool check=isminer[msg.sender];
        require(check,"you are not miner");
        miners storage mine=minerList[msg.sender];
        require(mine.lastAproval<totalApproveUsers,"Just Approve next claim");
            mine.dueAmount+=1;
            mine.lastAproval=totalApproveUsers;
        }

    function minerCheckUserDetailForApproval()public view returns(string memory){
        bool check=isminer[msg.sender];
        require(check,"you are not miner");
        miners storage mine=minerList[msg.sender];
        require(mine.lastAproval>=totalApproveUsers,"call checkDetaiForApproval");
        claimUserDetail storage usrDetails=claimUsers[mine.lastAproval];
        return usrDetails.description;

        }
    function minerAprroval(bool c)public payable{
        bool check=isminer[msg.sender];
        require(check,"you are not miner");
        miners storage mine=minerList[msg.sender];
        require( mine.lastAproval>=totalApproveUsers,"check Your last Approval status");
        claimUserDetail storage claimusr=claimUsers[mine.lastAproval];
        mine.lastAproval++;
        if(c){
            claimusr.countminerP++;
            claimusr.array[claimusr.idx]=msg.sender;
            claimusr.posNeg[claimusr.idx]=true;
            claimusr.idx++;
        }
        else{
            claimusr.countminerN++;
            claimusr.array[claimusr.idx]=msg.sender;
            claimusr.posNeg[claimusr.idx]=false;
            claimusr.idx++;
        }
    }

    function claimPaymentApproval()public payable onlyCompany{
        require(totalClaimUsers>totalApproveUsers,"all approves");
        claimUserDetail storage u=claimUsers[totalApproveUsers];
        user storage uD=userList[u.user]; 
        require(u.countminerP+u.countminerN>=u.totalMin/2,"Wait for approval");
        if(u.countminerP >u.totalMin/2){
            (bool b,)=u.user.call{value:msg.value}("");
            require(b,"sry error");
            u.res="Approved check you balance";
            uD.lastTimeClaim=block.timestamp;
            CheckBeforeStatus[u.user]=false;
            totalApproveUsers++;
        }
        else {
            uD.lastTimeClaim=block.timestamp;
            u.res="sry we are not satisfy with your description";
            CheckBeforeStatus[u.user]=false;
            totalApproveUsers++;
        }
    }

}