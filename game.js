// 游戏状态
const gameState = {
    level: 1,
    exp: 0,
    expToNextLevel: 100,
    algorithm: 10,
    coding: 10,
    debugging: 8,
    contestExp: 5,
    energy: 100,
    maxEnergy: 100,
    coins: 100,
    day: 1,
    problemsSolved: 0,
    contestsAttended: 0,
    achievements: {
        beginner: false,
        learner: false,
        competitor: false,
        champion: false,
        master: false
    },
    log: [
        { day: 1, text: "欢迎来到OI的世界！你刚刚开始学习编程。" }
    ]
};

// DOM元素
const elements = {
    level: document.getElementById('level'),
    exp: document.getElementById('exp'),
    'exp-bar': document.getElementById('exp-bar'),
    algorithm: document.getElementById('algorithm'),
    coding: document.getElementById('coding'),
    debugging: document.getElementById('debugging'),
    'contest-exp': document.getElementById('contest-exp'),
    energy: document.getElementById('energy'),
    coins: document.getElementById('coins'),
    'log-container': document.getElementById('log-container')
};

// 初始化标签页
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // 移除所有active类
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // 添加active类到当前标签
        tab.classList.add('active');
        document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
    });
});

// 学习按钮事件
document.getElementById('learn-basic').addEventListener('click', () => learn('基础语法', 5, 10));
document.getElementById('learn-array').addEventListener('click', () => learn('数组与字符串', 10, 15));
document.getElementById('learn-sort').addEventListener('click', () => learn('排序算法', 15, 20));
document.getElementById('learn-search').addEventListener('click', () => learn('搜索算法', 20, 25));
document.getElementById('learn-dp').addEventListener('click', () => learn('动态规划', 25, 30));
document.getElementById('learn-graph').addEventListener('click', () => learn('图论', 30, 35));
document.getElementById('learn-math').addEventListener('click', () => learn('数学', 20, 25));
document.getElementById('learn-ds').addEventListener('click', () => learn('数据结构', 25, 30));

// 练习按钮事件
document.getElementById('practice-easy').addEventListener('click', () => showProblems('easy'));
document.getElementById('practice-medium').addEventListener('click', () => showProblems('medium'));
document.getElementById('practice-hard').addEventListener('click', () => showProblems('hard'));
document.getElementById('practice-very-hard').addEventListener('click', () => showProblems('very-hard'));

// 比赛按钮事件
document.getElementById('contest-school').addEventListener('click', () => joinContest('校内赛', 10, 20));
document.getElementById('contest-local').addEventListener('click', () => joinContest('地区赛', 20, 40));
document.getElementById('contest-province').addEventListener('click', () => joinContest('省选', 40, 80));
document.getElementById('contest-noip').addEventListener('click', () => joinContest('NOIP', 60, 120));
document.getElementById('contest-noi').addEventListener('click', () => joinContest('NOI', 100, 200));

// 商店按钮事件
document.getElementById('buy-book').addEventListener('click', () => buyItem('算法书', 30, { algorithm: 5 }));
document.getElementById('buy-ide').addEventListener('click', () => buyItem('更好的IDE', 50, { coding: 5 }));
document.getElementById('buy-pc').addEventListener('click', () => buyItem('高性能电脑', 100, { coding: 10, debugging: 5 }));
document.getElementById('buy-course').addEventListener('click', () => buyItem('在线课程', 40, { algorithm: 8 }));
document.getElementById('rest-energy').addEventListener('click', () => restEnergy());

// 学习函数
function learn(topic, expGain, energyCost) {
    if (gameState.energy < energyCost) {
        addLog(`体力不足，无法学习${topic}！`);
        return;
    }
    
    gameState.exp += expGain;
    gameState.energy -= energyCost;
    gameState.algorithm += Math.floor(Math.random() * 3) + 1;
    gameState.coding += Math.floor(Math.random() * 2) + 1;
    
    addLog(`学习了${topic}，获得${expGain}点经验，算法能力+${Math.floor(Math.random() * 3) + 1}，代码能力+${Math.floor(Math.random() * 2) + 1}`);
    
    checkLevelUp();
    updateUI();
}

// 显示问题
function showProblems(difficulty) {
    const problemList = document.getElementById('problem-list');
    problemList.innerHTML = '';
    
    const difficulties = {
        'easy': { name: '入门', count: 3, exp: 5, energy: 5 },
        'medium': { name: '普及', count: 3, exp: 10, energy: 10 },
        'hard': { name: '提高', count: 3, exp: 20, energy: 15 },
        'very-hard': { name: '省选/NOI', count: 3, exp: 40, energy: 25 }
    };
    
    const diff = difficulties[difficulty];
    const problemNames = {
        'easy': ['A+B问题', '斐波那契数列', '最大公约数'],
        'medium': ['快速排序', '二分查找', '简单动态规划'],
        'hard': ['最短路径', '网络流', '线段树'],
        'very-hard': ['后缀自动机', '计算几何', '多项式']
    };
    
    for (let i = 0; i < diff.count; i++) {
        const problemDiv = document.createElement('div');
        problemDiv.className = 'problem';
        problemDiv.innerHTML = `
            <h4>${problemNames[difficulty][i]}</h4>
            <p>难度: ${diff.name} | 经验: ${diff.exp} | 体力: ${diff.energy}</p>
            <button class="solve-btn" data-difficulty="${difficulty}">尝试解决</button>
        `;
        problemList.appendChild(problemDiv);
    }
    
    // 添加解题事件
    document.querySelectorAll('.solve-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            solveProblem(this.parentNode.querySelector('h4').textContent, difficulties[this.dataset.difficulty]);
        });
    });
}

// 解决问题
function solveProblem(problemName, difficulty) {
    if (gameState.energy < difficulty.energy) {
        addLog(`体力不足，无法解决${problemName}！`);
        return;
    }
    
    // 计算解决概率
    const successRate = Math.min(0.9, 0.3 + (gameState.algorithm + gameState.coding + gameState.debugging) / 300);
    const isSuccess = Math.random() < successRate;
    
    gameState.energy -= difficulty.energy;
    
    if (isSuccess) {
        gameState.exp += difficulty.exp;
        gameState.problemsSolved++;
        gameState.coding += Math.floor(Math.random() * 2) + 1;
        gameState.debugging += Math.floor(Math.random() * 2);
        
        addLog(`成功解决了${problemName}，获得${difficulty.exp}点经验，代码能力+${Math.floor(Math.random() * 2) + 1}，调试能力+${Math.floor(Math.random() * 2)}`);
        
        // 检查成就
        if (gameState.problemsSolved >= 10 && !gameState.achievements.learner) {
            gameState.achievements.learner = true;
            document.getElementById('ach-2').classList.add('unlocked');
            addLog(`成就解锁：📚 学习者 - 解决了10道题目`);
        }
    } else {
        addLog(`解决${problemName}失败，但从中吸取了教训，调试能力+1`);
        gameState.debugging += 1;
    }
    
    checkLevelUp();
    updateUI();
}

// 参加比赛
function joinContest(contestName, minExp, maxExp) {
    if (gameState.energy < 30) {
        addLog(`体力不足，无法参加${contestName}！`);
        return;
    }
    
    const expGain = Math.floor(Math.random() * (maxExp - minExp + 1)) + minExp;
    const rank = Math.floor(Math.random() * 100) + 1;
    
    gameState.energy -= 30;
    gameState.exp += expGain;
    gameState.contestExp += Math.floor(Math.random() * 5) + 3;
    gameState.contestsAttended++;
    
    let resultText = `参加了${contestName}，获得第${rank}名，获得${expGain}点经验，比赛经验+${Math.floor(Math.random() * 5) + 3}`;
    
    if (rank <= 10) {
        const coinReward = Math.floor(Math.random() * 50) + 30;
        gameState.coins += coinReward;
        resultText += `，获得${coinReward}金币`;
        
        if (contestName === 'NOI' && rank === 1 && !gameState.achievements.champion) {
            gameState.achievements.champion = true;
            document.getElementById('ach-4').classList.add('unlocked');
            addLog(`成就解锁：🏆 冠军 - 在NOI中获得第一名`);
        }
    }
    
    addLog(resultText);
    
    // 检查成就
    if (gameState.contestsAttended >= 5 && !gameState.achievements.competitor) {
        gameState.achievements.competitor = true;
        document.getElementById('ach-3').classList.add('unlocked');
        addLog(`成就解锁：⚔️ 竞争者 - 参加了5场比赛`);
    }
    
    checkLevelUp();
    updateUI();
}

// 购买物品
function buyItem(itemName, cost, stats) {
    if (gameState.coins < cost) {
        addLog(`金币不足，无法购买${itemName}！`);
        return;
    }
    
    gameState.coins -= cost;
    let statText = '';
    
    for (const stat in stats) {
        gameState[stat] += stats[stat];
        statText += `${stat} +${stats[stat]} `;
    }
    
    addLog(`购买了${itemName}，${statText.trim()}`);
    updateUI();
}

// 恢复体力
function restEnergy() {
    if (gameState.coins < 20) {
        addLog(`金币不足，无法恢复体力！`);
        return;
    }
    
    gameState.coins -= 20;
    gameState.energy = gameState.maxEnergy;
    gameState.day++;
    
    addLog(`休息了一天，体力完全恢复！当前是第${gameState.day}天`);
    updateUI();
}

// 检查升级
function checkLevelUp() {
    if (gameState.exp >= gameState.expToNextLevel) {
        gameState.level++;
        gameState.exp -= gameState.expToNextLevel;
        gameState.expToNextLevel = Math.floor(gameState.expToNextLevel * 1.5);
        gameState.maxEnergy += 10;
        gameState.energy = gameState.maxEnergy;
        
        addLog(`升级了！当前等级：${gameState.level}，最大体力增加10点`);
        
        // 检查成就
        if (gameState.level >= 5 && !gameState.achievements.beginner) {
            gameState.achievements.beginner = true;
            document.getElementById('ach-1').classList.add('unlocked');
            addLog(`成就解锁：🌱 初学者 - 达到5级`);
        }
        
        if (gameState.level >= 20 && !gameState.achievements.master) {
            gameState.achievements.master = true;
            document.getElementById('ach-5').classList.add('unlocked');
            addLog(`成就解锁：🌟 大师 - 达到20级`);
        }
    }
}

// 添加日志
function addLog(text) {
    gameState.log.push({
        day: gameState.day,
        text: text
    });
    
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
        <div class="log-time">Day ${gameState.day}</div>
        <div>${text}</div>
    `;
    
    elements['log-container'].appendChild(logEntry);
    elements['log-container'].scrollTop = elements['log-container'].scrollHeight;
}

// 更新UI
function updateUI() {
    elements.level.textContent = gameState.level;
    elements.exp.textContent = `${gameState.exp}/${gameState.expToNextLevel}`;
    elements['exp-bar'].style.width = `${(gameState.exp / gameState.expToNextLevel) * 100}%`;
    elements.algorithm.textContent = gameState.algorithm;
    elements.coding.textContent = gameState.coding;
    elements.debugging.textContent = gameState.debugging;
    elements['contest-exp'].textContent = gameState.contestExp;
    elements.energy.textContent = `${gameState.energy}/${gameState.maxEnergy}`;
    elements.coins.textContent = gameState.coins;
}

// 初始化游戏
updateUI();
