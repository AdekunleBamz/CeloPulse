// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CeloPulse
 * @notice Advanced on-chain activity tracker with auto-rewards and event monitoring
 * @dev Designed for maximum transaction generation with multiple action types
 */
contract CeloPulse {
    struct User {
        uint256 activityScore;
        uint256 totalActions;
        uint256 currentStreak;
        uint256 longestStreak;
        uint256 lastActionTime;
        uint256 stakedScore;
        uint256 lastClaimTime;
        uint256 lastCompoundTime;
        uint256 achievements;
        uint256 dailyActions;
        uint256 lastDailyReset;
        mapping(uint256 => bool) completedQuests;
    }
    
    struct Action {
        address user;
        uint256 actionType;
        uint256 timestamp;
        uint256 scoreEarned;
    }
    
    mapping(address => User) public users;
    address[] public userList;
    mapping(address => bool) public isRegistered;
    
    Action[] public actionHistory;
    
    uint256 public totalUsers;
    uint256 public totalActions;
    uint256 public totalScore;
    
    // Action types
    uint256 public constant ACTION_CHECK_IN = 1;
    uint256 public constant ACTION_COMPLETE_TASK = 2;
    uint256 public constant ACTION_CLAIM_REWARD = 3;
    uint256 public constant ACTION_COMPOUND = 4;
    uint256 public constant ACTION_STAKE = 5;
    uint256 public constant ACTION_UNSTAKE = 6;
    uint256 public constant ACTION_BOOST = 7;
    uint256 public constant ACTION_QUEST = 8;
    
    // Timing constants
    uint256 public constant CLAIM_INTERVAL = 3 minutes;
    uint256 public constant COMPOUND_INTERVAL = 3 minutes;
    uint256 public constant STREAK_WINDOW = 24 hours;
    uint256 public constant DAILY_RESET = 1 days;
    
    // Reward rates
    uint256 public constant BASE_REWARD = 10;
    uint256 public constant STREAK_MULTIPLIER = 2;
    uint256 public constant STAKE_APY = 100; // 100% daily for testing
    
    // Events for Chainhooks-style monitoring
    event UserRegistered(address indexed user, uint256 timestamp);
    event ActionPerformed(address indexed user, uint256 actionType, uint256 scoreEarned, uint256 timestamp);
    event StreakUpdated(address indexed user, uint256 newStreak, uint256 timestamp);
    event RewardClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event ScoreCompounded(address indexed user, uint256 amount, uint256 timestamp);
    event ScoreStaked(address indexed user, uint256 amount, uint256 totalStaked, uint256 timestamp);
    event ScoreUnstaked(address indexed user, uint256 amount, uint256 timestamp);
    event AchievementUnlocked(address indexed user, uint256 achievementId, uint256 timestamp);
    event QuestCompleted(address indexed user, uint256 questId, uint256 reward, uint256 timestamp);
    event DailyResetOccurred(address indexed user, uint256 actions, uint256 timestamp);
    
    /**
     * @notice Register new user
     */
    function register() external {
        require(!isRegistered[msg.sender], "Already registered");
        
        isRegistered[msg.sender] = true;
        userList.push(msg.sender);
        totalUsers++;
        
        User storage user = users[msg.sender];
        user.lastActionTime = block.timestamp;
        user.lastClaimTime = block.timestamp;
        user.lastCompoundTime = block.timestamp;
        user.lastDailyReset = block.timestamp;
        
        emit UserRegistered(msg.sender, block.timestamp);
    }
    
    /**
     * @notice Daily check-in action
     */
    function checkIn() external {
        require(isRegistered[msg.sender], "Not registered");
        
        User storage user = users[msg.sender];
        _resetDailyIfNeeded(user);
        _updateStreak(user);
        
        uint256 reward = BASE_REWARD * (1 + user.currentStreak / 7);
        user.activityScore += reward;
        user.totalActions++;
        user.dailyActions++;
        totalActions++;
        totalScore += reward;
        
        _recordAction(ACTION_CHECK_IN, reward);
        _checkAchievements(user);
        
        emit ActionPerformed(msg.sender, ACTION_CHECK_IN, reward, block.timestamp);
    }
    
    /**
     * @notice Complete a task
     */
    function completeTask() external {
        require(isRegistered[msg.sender], "Not registered");
        
        User storage user = users[msg.sender];
        _resetDailyIfNeeded(user);
        
        uint256 reward = BASE_REWARD * 2;
        user.activityScore += reward;
        user.totalActions++;
        user.dailyActions++;
        totalActions++;
        totalScore += reward;
        
        _recordAction(ACTION_COMPLETE_TASK, reward);
        _checkAchievements(user);
        
        emit ActionPerformed(msg.sender, ACTION_COMPLETE_TASK, reward, block.timestamp);
    }
    
    /**
     * @notice Claim accumulated staking rewards
     */
    function claimRewards() external {
        require(isRegistered[msg.sender], "Not registered");
        
        User storage user = users[msg.sender];
        require(user.stakedScore > 0, "No staked score");
        require(block.timestamp >= user.lastClaimTime + CLAIM_INTERVAL, "Too soon");
        
        uint256 timeStaked = block.timestamp - user.lastClaimTime;
        uint256 reward = (user.stakedScore * STAKE_APY * timeStaked) / (100 * 1 days);
        
        user.activityScore += reward;
        user.lastClaimTime = block.timestamp;
        user.totalActions++;
        totalActions++;
        totalScore += reward;
        
        _recordAction(ACTION_CLAIM_REWARD, reward);
        
        emit RewardClaimed(msg.sender, reward, block.timestamp);
    }
    
    /**
     * @notice Compound rewards back into stake
     */
    function compoundRewards() external {
        require(isRegistered[msg.sender], "Not registered");
        
        User storage user = users[msg.sender];
        require(user.stakedScore > 0, "No staked score");
        require(block.timestamp >= user.lastCompoundTime + COMPOUND_INTERVAL, "Too soon");
        
        uint256 timeStaked = block.timestamp - user.lastClaimTime;
        uint256 reward = (user.stakedScore * STAKE_APY * timeStaked) / (100 * 1 days);
        
        user.stakedScore += reward;
        user.lastClaimTime = block.timestamp;
        user.lastCompoundTime = block.timestamp;
        user.totalActions++;
        totalActions++;
        
        _recordAction(ACTION_COMPOUND, reward);
        
        emit ScoreCompounded(msg.sender, reward, block.timestamp);
    }
    
    /**
     * @notice Stake activity score
     */
    function stakeScore(uint256 amount) external {
        require(isRegistered[msg.sender], "Not registered");
        
        User storage user = users[msg.sender];
        require(user.activityScore >= amount, "Insufficient score");
        require(amount > 0, "Amount must be positive");
        
        user.activityScore -= amount;
        user.stakedScore += amount;
        user.lastClaimTime = block.timestamp;
        user.totalActions++;
        totalActions++;
        
        _recordAction(ACTION_STAKE, amount);
        
        emit ScoreStaked(msg.sender, amount, user.stakedScore, block.timestamp);
    }
    
    /**
     * @notice Unstake activity score
     */
    function unstakeScore(uint256 amount) external {
        require(isRegistered[msg.sender], "Not registered");
        
        User storage user = users[msg.sender];
        require(user.stakedScore >= amount, "Insufficient staked");
        require(amount > 0, "Amount must be positive");
        
        user.stakedScore -= amount;
        user.activityScore += amount;
        user.totalActions++;
        totalActions++;
        
        _recordAction(ACTION_UNSTAKE, amount);
        
        emit ScoreUnstaked(msg.sender, amount, block.timestamp);
    }
    
    /**
     * @notice Boost action for temporary multiplier
     */
    function activateBoost() external {
        require(isRegistered[msg.sender], "Not registered");
        
        User storage user = users[msg.sender];
        require(user.activityScore >= 50, "Need 50 score");
        
        user.activityScore -= 50;
        user.activityScore += 150; // Net gain of 100
        user.totalActions++;
        totalActions++;
        
        _recordAction(ACTION_BOOST, 100);
        
        emit ActionPerformed(msg.sender, ACTION_BOOST, 100, block.timestamp);
    }
    
    /**
     * @notice Complete a quest
     */
    function completeQuest(uint256 questId) external {
        require(isRegistered[msg.sender], "Not registered");
        require(questId < 10, "Invalid quest");
        
        User storage user = users[msg.sender];
        require(!user.completedQuests[questId], "Quest already completed");
        
        user.completedQuests[questId] = true;
        uint256 reward = BASE_REWARD * (5 + questId);
        user.activityScore += reward;
        user.totalActions++;
        totalActions++;
        totalScore += reward;
        
        _recordAction(ACTION_QUEST, reward);
        
        emit QuestCompleted(msg.sender, questId, reward, block.timestamp);
    }
    
    /**
     * @notice Internal: Update streak
     */
    function _updateStreak(User storage user) internal {
        if (block.timestamp - user.lastActionTime <= STREAK_WINDOW) {
            user.currentStreak++;
            if (user.currentStreak > user.longestStreak) {
                user.longestStreak = user.currentStreak;
            }
        } else {
            user.currentStreak = 1;
        }
        
        user.lastActionTime = block.timestamp;
        emit StreakUpdated(msg.sender, user.currentStreak, block.timestamp);
    }
    
    /**
     * @notice Internal: Reset daily actions if needed
     */
    function _resetDailyIfNeeded(User storage user) internal {
        if (block.timestamp - user.lastDailyReset >= DAILY_RESET) {
            emit DailyResetOccurred(msg.sender, user.dailyActions, block.timestamp);
            user.dailyActions = 0;
            user.lastDailyReset = block.timestamp;
        }
    }
    
    /**
     * @notice Internal: Record action in history
     */
    function _recordAction(uint256 actionType, uint256 scoreEarned) internal {
        actionHistory.push(Action({
            user: msg.sender,
            actionType: actionType,
            timestamp: block.timestamp,
            scoreEarned: scoreEarned
        }));
    }
    
    /**
     * @notice Internal: Check and unlock achievements
     */
    function _checkAchievements(User storage user) internal {
        // Achievement 1: First action
        if (user.totalActions == 1 && (user.achievements & 1) == 0) {
            user.achievements |= 1;
            emit AchievementUnlocked(msg.sender, 1, block.timestamp);
        }
        
        // Achievement 2: 10 actions
        if (user.totalActions >= 10 && (user.achievements & 2) == 0) {
            user.achievements |= 2;
            emit AchievementUnlocked(msg.sender, 2, block.timestamp);
        }
        
        // Achievement 3: 50 actions
        if (user.totalActions >= 50 && (user.achievements & 4) == 0) {
            user.achievements |= 4;
            emit AchievementUnlocked(msg.sender, 3, block.timestamp);
        }
        
        // Achievement 4: 7-day streak
        if (user.currentStreak >= 7 && (user.achievements & 8) == 0) {
            user.achievements |= 8;
            emit AchievementUnlocked(msg.sender, 4, block.timestamp);
        }
    }
    
    /**
     * @notice Get user data
     */
    function getUser(address userAddress) external view returns (
        uint256 activityScore,
        uint256 totalActions,
        uint256 currentStreak,
        uint256 longestStreak,
        uint256 stakedScore,
        uint256 dailyActions,
        uint256 achievements
    ) {
        User storage user = users[userAddress];
        return (
            user.activityScore,
            user.totalActions,
            user.currentStreak,
            user.longestStreak,
            user.stakedScore,
            user.dailyActions,
            user.achievements
        );
    }
    
    /**
     * @notice Get pending rewards
     */
    function getPendingRewards(address userAddress) external view returns (uint256) {
        User storage user = users[userAddress];
        if (user.stakedScore == 0) return 0;
        
        uint256 timeStaked = block.timestamp - user.lastClaimTime;
        return (user.stakedScore * STAKE_APY * timeStaked) / (100 * 1 days);
    }
    
    /**
     * @notice Check if can claim
     */
    function canClaim(address userAddress) external view returns (bool) {
        User storage user = users[userAddress];
        return user.stakedScore > 0 && block.timestamp >= user.lastClaimTime + CLAIM_INTERVAL;
    }
    
    /**
     * @notice Check if can compound
     */
    function canCompound(address userAddress) external view returns (bool) {
        User storage user = users[userAddress];
        return user.stakedScore > 0 && block.timestamp >= user.lastCompoundTime + COMPOUND_INTERVAL;
    }
    
    /**
     * @notice Get leaderboard
     */
    function getLeaderboard() external view returns (
        address[10] memory addresses,
        uint256[10] memory scores
    ) {
        uint256 len = userList.length < 10 ? userList.length : 10;
        
        address[] memory tempAddrs = new address[](userList.length);
        uint256[] memory tempScores = new uint256[](userList.length);
        
        for (uint256 i = 0; i < userList.length; i++) {
            tempAddrs[i] = userList[i];
            User storage user = users[userList[i]];
            tempScores[i] = user.activityScore + user.stakedScore;
        }
        
        // Bubble sort
        for (uint256 i = 0; i < len; i++) {
            for (uint256 j = i + 1; j < userList.length; j++) {
                if (tempScores[j] > tempScores[i]) {
                    uint256 tempScore = tempScores[i];
                    tempScores[i] = tempScores[j];
                    tempScores[j] = tempScore;
                    
                    address tempAddr = tempAddrs[i];
                    tempAddrs[i] = tempAddrs[j];
                    tempAddrs[j] = tempAddr;
                }
            }
        }
        
        for (uint256 i = 0; i < len; i++) {
            addresses[i] = tempAddrs[i];
            scores[i] = tempScores[i];
        }
    }
    
    /**
     * @notice Get recent actions (last 50)
     */
    function getRecentActions(uint256 count) external view returns (
        address[] memory userAddresses,
        uint256[] memory actionTypes,
        uint256[] memory timestamps,
        uint256[] memory scoresEarned
    ) {
        uint256 total = actionHistory.length;
        uint256 returnCount = count > total ? total : count;
        uint256 startIdx = total > count ? total - count : 0;
        
        userAddresses = new address[](returnCount);
        actionTypes = new uint256[](returnCount);
        timestamps = new uint256[](returnCount);
        scoresEarned = new uint256[](returnCount);
        
        for (uint256 i = 0; i < returnCount; i++) {
            Action storage action = actionHistory[startIdx + i];
            userAddresses[i] = action.user;
            actionTypes[i] = action.actionType;
            timestamps[i] = action.timestamp;
            scoresEarned[i] = action.scoreEarned;
        }
    }
    
    /**
     * @notice Get global stats
     */
    function getGlobalStats() external view returns (
        uint256 _totalUsers,
        uint256 _totalActions,
        uint256 _totalScore,
        uint256 _totalActionHistory
    ) {
        return (totalUsers, totalActions, totalScore, actionHistory.length);
    }
}
