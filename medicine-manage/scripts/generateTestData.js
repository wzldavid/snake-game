/**
 * 测试数据生成脚本
 * 创建两个用户(张大爷、刘大妈)30天的血糖和血压数据
 */

const fs = require('fs');
const path = require('path');

// 模拟的openid
const USERS = {
  张大爷: {
    openid: 'test_openid_zhang_001',
    nickname: '张大爷',
    gender: 1,
    birthday: '1955-03-15',
    age: 70,
    hasDiabetes: true,
    hasHypertension: true,
    emergencyContact: '张三',
    emergencyPhone: '13812348888'
  },
  刘大妈: {
    openid: 'test_openid_liu_001',
    nickname: '刘大妈',
    gender: 2,
    birthday: '1958-06-20',
    age: 67,
    hasDiabetes: true,
    hasHypertension: false,
    emergencyContact: '李四',
    emergencyPhone: '13987654321'
  }
};

// 血糖测量类型
const GLUCOSE_TYPES = [
  { value: 1, name: '空腹' },
  { value: 2, name: '早餐后' },
  { value: 3, name: '午餐后' },
  { value: 4, name: '晚餐后' },
  { value: 5, name: '睡前' }
];

// 血糖正常范围(空腹 mmol/L)
const GLUCOSE_NORMAL = { min: 3.9, max: 6.1 };
const GLUCOSE_DIABETES_NORMAL = { min: 4.4, max: 7.0 };

// 血压正常范围(mmHg)
const PRESSURE_NORMAL = { sysMin: 90, sysMax: 140, diaMin: 60, diaMax: 90 };
const PRESSURE_HYPERTENSION = { sysMin: 90, sysMax: 140, diaMin: 60, diaMax: 90 };

/**
 * 生成随机数
 */
function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * 生成随机整数
 */
function randomInt(min, max) {
  return Math.floor(randomRange(min, max + 1));
}

/**
 * 格式化日期
 */
function formatDate(date) {
  return date.toISOString();
}

/**
 * 生成血糖记录
 */
function generateGlucoseRecords(openid, startDate, hasDiabetes, days = 30) {
  const records = [];
  const normalRange = hasDiabetes ? GLUCOSE_DIABETES_NORMAL : GLUCOSE_NORMAL;
  
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() - i);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // 每天生成2-3条记录
    const recordCount = randomInt(2, 3);
    const usedTypes = new Set();
    
    for (let j = 0; j < recordCount; j++) {
      let typeIndex;
      do {
        typeIndex = randomInt(0, GLUCOSE_TYPES.length - 1);
      } while (usedTypes.has(typeIndex));
      usedTypes.add(typeIndex);
      
      const type = GLUCOSE_TYPES[typeIndex];
      
      // 生成血糖值(有一定波动)
      const baseValue = randomRange(normalRange.min, normalRange.max);
      const variation = randomRange(-0.5, 0.5);
      const value = Math.round((baseValue + variation) * 10) / 10;
      
      // 判断是否异常
      let isAbnormal = false;
      let abnormalType = 0;
      let abnormalReason = '';
      
      if (value > normalRange.max) {
        isAbnormal = true;
        abnormalType = 1;
        abnormalReason = hasDiabetes 
          ? `${type.name}血糖超过${normalRange.max} mmol/L(糖尿病标准)`
          : `${type.name}血糖超过${normalRange.max} mmol/L(正常标准)`;
      } else if (value < normalRange.min) {
        isAbnormal = true;
        abnormalType = 2;
        abnormalReason = `${type.name}血糖低于${normalRange.min} mmol/L`;
      }
      
      // 随机生成时间
      const hour = type.value === 1 ? randomInt(6, 8) :
                   type.value === 2 ? randomInt(9, 11) :
                   type.value === 3 ? randomInt(13, 15) :
                   type.value === 4 ? randomInt(18, 20) : randomInt(21, 23);
      
      const measureTime = new Date(currentDate);
      measureTime.setHours(hour, randomInt(0, 59), 0, 0);
      
      records.push({
        _openid: openid,
        measureTime: formatDate(measureTime),
        measureType: type.value,
        measureTypeName: type.name,
        value: value,
        isAbnormal: isAbnormal,
        abnormalType: abnormalType,
        abnormalReason: abnormalReason,
        photoUrl: '',
        note: isAbnormal ? '测试数据' : '',
        createTime: formatDate(measureTime)
      });
    }
  }
  
  return records.sort((a, b) => new Date(b.measureTime) - new Date(a.measureTime));
}

/**
 * 生成血压记录
 */
function generatePressureRecords(openid, startDate, hasHypertension, days = 30) {
  const records = [];
  
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() - i);
    
    // 每天生成1-2条记录
    const recordCount = randomInt(1, 2);
    
    for (let j = 0; j < recordCount; j++) {
      // 生成血压值(有一定波动)
      let baseSys = randomRange(110, 130);
      let baseDia = randomRange(70, 85);
      
      // 如果有高血压,偶尔生成高血压数据
      if (hasHypertension && Math.random() > 0.7) {
        baseSys = randomRange(140, 160);
        baseDia = randomRange(90, 100);
      }
      
      // 偶尔生成正常范围的波动
      const sysVariation = randomRange(-10, 10);
      const diaVariation = randomRange(-5, 5);
      
      const systolic = Math.round(baseSys + sysVariation);
      const diastolic = Math.round(baseDia + diaVariation);
      const heartRate = randomInt(60, 90);
      
      // 判断是否异常
      let isAbnormal = false;
      let abnormalType = 0;
      let abnormalReason = '';
      
      if (systolic > 140 || diastolic > 90) {
        isAbnormal = true;
        abnormalType = 1;
        abnormalReason = `收缩压${systolic}mmHg${systolic > 140 ? '(>140)' : ''},舒张压${diastolic}mmHg${diastolic > 90 ? '(>90)' : ''}`;
      } else if (systolic < 90 || diastolic < 60) {
        isAbnormal = true;
        abnormalType = 2;
        abnormalReason = `收缩压${systolic}mmHg(<90),舒张压${diastolic}mmHg(<60)`;
      }
      
      // 随机生成时间
      const hour = j === 0 ? randomInt(7, 9) : randomInt(18, 20);
      const measureTime = new Date(currentDate);
      measureTime.setHours(hour, randomInt(0, 59), 0, 0);
      
      records.push({
        _openid: openid,
        measureTime: formatDate(measureTime),
        systolic: systolic,
        diastolic: diastolic,
        heartRate: heartRate,
        isAbnormal: isAbnormal,
        abnormalType: abnormalType,
        abnormalReason: abnormalReason,
        photoUrl: '',
        note: isAbnormal ? '测试数据' : '',
        createTime: formatDate(measureTime)
      });
    }
  }
  
  return records.sort((a, b) => new Date(b.measureTime) - new Date(a.measureTime));
}

/**
 * 生成用户数据
 */
function generateUsers() {
  const users = [];
  const now = new Date();
  
  for (const [name, user] of Object.entries(USERS)) {
    users.push({
      _openid: user.openid,
      nickname: user.nickname,
      avatar: '',
      gender: user.gender,
      birthday: user.birthday,
      age: user.age,
      hasDiabetes: user.hasDiabetes,
      hasHypertension: user.hasHypertension,
      emergencyContact: user.emergencyContact,
      emergencyPhone: user.emergencyPhone,
      createTime: formatDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)),
      updateTime: formatDate(now),
      lastLoginTime: formatDate(now)
    });
  }
  
  return users;
}

/**
 * 生成所有测试数据
 */
function generateAllTestData() {
  const now = new Date();
  
  console.log('正在生成测试数据...');
  
  // 生成用户数据
  const users = generateUsers();
  console.log(`✓ 生成 ${users.length} 条用户记录`);
  
  // 生成血糖数据
  const glucoseRecords = [];
  const pressureRecords = [];
  
  for (const user of Object.values(USERS)) {
    const userGlucose = generateGlucoseRecords(
      user.openid,
      now,
      user.hasDiabetes,
      30
    );
    glucoseRecords.push(...userGlucose);
    console.log(`✓ 生成用户 ${user.nickname} 的 ${userGlucose.length} 条血糖记录`);
    
    const userPressure = generatePressureRecords(
      user.openid,
      now,
      user.hasHypertension,
      30
    );
    pressureRecords.push(...userPressure);
    console.log(`✓ 生成用户 ${user.nickname} 的 ${userPressure.length} 条血压记录`);
  }
  
  // 保存到文件
  const testData = {
    users: users,
    blood_glucose: glucoseRecords,
    blood_pressure: pressureRecords
  };
  
  const outputPath = path.join(__dirname, '../cloud-database-test-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(testData, null, 2), 'utf8');
  console.log(`\n✓ 测试数据已保存到: ${outputPath}`);
  
  // 打印统计信息
  console.log('\n========== 数据统计 ==========');
  console.log(`用户数: ${users.length}`);
  console.log(`血糖记录数: ${glucoseRecords.length}`);
  console.log(`血压记录数: ${pressureRecords.length}`);
  console.log('================================');
  
  // 打印异常数据统计
  const abnormalGlucose = glucoseRecords.filter(r => r.isAbnormal).length;
  const abnormalPressure = pressureRecords.filter(r => r.isAbnormal).length;
  console.log(`\n异常血糖记录: ${abnormalGlucose} 条 (${Math.round(abnormalGlucose / glucoseRecords.length * 100)}%)`);
  console.log(`异常血压记录: ${abnormalPressure} 条 (${Math.round(abnormalPressure / pressureRecords.length * 100)}%)`);
  
  // 打印示例数据
  console.log('\n========== 示例数据 ==========');
  console.log('\n用户示例:');
  console.log(JSON.stringify(users[0], null, 2));
  
  console.log('\n血糖记录示例:');
  console.log(JSON.stringify(glucoseRecords[0], null, 2));
  
  console.log('\n血压记录示例:');
  console.log(JSON.stringify(pressureRecords[0], null, 2));
  console.log('================================\n');
  
  return testData;
}

// 运行生成脚本
if (require.main === module) {
  generateAllTestData();
}

module.exports = {
  generateAllTestData,
  generateGlucoseRecords,
  generatePressureRecords,
  generateUsers,
  USERS
};
