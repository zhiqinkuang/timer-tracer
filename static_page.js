function displayTodayRecords() {
    const today = new Date().toISOString().split('T')[0]; // 获取今天的日期
    const activities = loadActivitiesByDate(today); // 加载今天的记录

    const recordsContainer = document.getElementById('records'); // 假设有一个元素用于显示记录
    recordsContainer.innerHTML = ''; // 清空现有记录

    activities.forEach(activity => {
        const recordElement = document.createElement('div');
        recordElement.textContent = `${activity.time}: ${activity.description}`; // 假设活动对象有 time 和 description 属性
        recordsContainer.appendChild(recordElement);
    });
}

// 每分钟更新记录显示
setInterval(displayTodayRecords, 60 * 1000);

// 页面加载时显示记录
displayTodayRecords(); 