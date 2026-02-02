/**
 * 数据验证脚本
 * 验证生成的测试数据是否符合规范
 */

const fs = require('fs');
const path = require('path');

/**
 * 验证血糖记录
 */
function validateGlucoseRecords(records) {
  console.log('\n========== 验证血糖记录 ==========');
  
  const issues = [];
  let validCount = 0;
  let abnormalCount = 0;
  
  const typeNames = ['未知', '空腹', '早餐后', '午餐后', '晚餐后', '睡前'];
  
  records.forEach((record, index) => {
    const errors = [];
    
    // 验证必填字段
    if (!record._openid) errors.push('缺少_openid');
    if (!record.measureTime) errors.push('缺少measureTime');
    if (!record.measureType) errors.push('缺少measureType');
    if (typeof record.value !== 'number') errors.push('value不是数字');
    
    // 验证测量类型
    if (record.measureType < 1 || record.measureType > 5) {
      errors.push(`measureType无效: ${record.measureType}`);
    }
    
    // 验证测量类型名称
    if (record.measureTypeName !== typeNames[record.measureType]) {
      errors.push(`measureTypeName不匹配: ${record.measureTypeName}`);
    }
    
    // 验证血糖值范围
    if (record.value < 2 || record.value > 30) {
      errors.push(`血糖值异常: ${record.value}`);
    }
    
    // 验证isAbnormal
    if (record.isAbnormal && !record.abnormalReason) {
      errors.push('isAbnormal=true但缺少abnormalReason');
    }
    
    if (errors.length > 0) {
      issues.push({
        index,
        record,
        errors
      });
    } else {
      validCount++;
    }
    
    if (record.isAbnormal) {
      abnormalCount++;
    }
  });
  
  console.log(`总记录数: ${records.length}`);
  console.log(`有效记录: ${validCount}`);
  console.log(`异常记录: ${abnormalCount}`);
  console.log(`问题记录: ${issues.length}`);
  
  if (issues.length > 0) {
    console.log('\n发现的问题:');
    issues.slice(0, 10).forEach((issue, i) => {
      console.log(`\n问题 ${i + 1}:`);
      console.log(`  记录索引: ${issue.index}`);
      console.log(`  问题: ${issue.errors.join(', ')}`);
      console.log(`  数据:`, JSON.stringify(issue.record, null, 2).split('\n').slice(0, 10).join('\n  '));
    });
    
    if (issues.length > 10) {
      console.log(`\n... 还有 ${issues.length - 10} 个问题`);
    }
  }
  
  return {
    total: records.length,
    valid: validCount,
    abnormal: abnormalCount,
    issues: issues.length,
    success: issues.length === 0
  };
}

/**
 * 验证血压记录
 */
function validatePressureRecords(records) {
  console.log('\n========== 验证血压记录 ==========');
  
  const issues = [];
  let validCount = 0;
  let abnormalCount = 0;
  
  records.forEach((record, index) => {
    const errors = [];
    
    // 验证必填字段
    if (!record._openid) errors.push('缺少_openid');
    if (!record.measureTime) errors.push('缺少measureTime');
    if (typeof record.systolic !== 'number') errors.push('systolic不是数字');
    if (typeof record.diastolic !== 'number') errors.push('diastolic不是数字');
    
    // 验证血压值范围
    if (record.systolic < 50 || record.systolic > 250) {
      errors.push(`收缩压异常: ${record.systolic}`);
    }
    if (record.diastolic < 30 || record.diastolic > 150) {
      errors.push(`舒张压异常: ${record.diastolic}`);
    }
    
    // 验证收缩压必须大于舒张压
    if (record.systolic <= record.diastolic) {
      errors.push(`收缩压(${record.systolic})不大于舒张压(${record.diastolic})`);
    }
    
    // 验证心率
    if (record.heartRate && (record.heartRate < 40 || record.heartRate > 200)) {
      errors.push(`心率异常: ${record.heartRate}`);
    }
    
    // 验证isAbnormal
    if (record.isAbnormal && !record.abnormalReason) {
      errors.push('isAbnormal=true但缺少abnormalReason');
    }
    
    if (errors.length > 0) {
      issues.push({
        index,
        record,
        errors
      });
    } else {
      validCount++;
    }
    
    if (record.isAbnormal) {
      abnormalCount++;
    }
  });
  
  console.log(`总记录数: ${records.length}`);
  console.log(`有效记录: ${validCount}`);
  console.log(`异常记录: ${abnormalCount}`);
  console.log(`问题记录: ${issues.length}`);
  
  if (issues.length > 0) {
    console.log('\n发现的问题:');
    issues.slice(0, 10).forEach((issue, i) => {
      console.log(`\n问题 ${i + 1}:`);
      console.log(`  记录索引: ${issue.index}`);
      console.log(`  问题: ${issue.errors.join(', ')}`);
      console.log(`  数据:`, JSON.stringify(issue.record, null, 2).split('\n').slice(0, 10).join('\n  '));
    });
    
    if (issues.length > 10) {
      console.log(`\n... 还有 ${issues.length - 10} 个问题`);
    }
  }
  
  return {
    total: records.length,
    valid: validCount,
    abnormal: abnormalCount,
    issues: issues.length,
    success: issues.length === 0
  };
}

/**
 * 验证用户记录
 */
function validateUsers(users) {
  console.log('\n========== 验证用户记录 ==========');
  
  const issues = [];
  let validCount = 0;
  const openids = new Set();
  
  users.forEach((user, index) => {
    const errors = [];
    
    // 验证必填字段
    if (!user._openid) errors.push('缺少_openid');
    if (!user.nickname) errors.push('缺少nickname');
    if (typeof user.gender !== 'number') errors.push('gender不是数字');
    if (typeof user.age !== 'number') errors.push('age不是数字');
    
    // 验证openid唯一性
    if (openids.has(user._openid)) {
      errors.push(`_openid重复: ${user._openid}`);
    } else {
      openids.add(user._openid);
    }
    
    // 验证性别值
    if (user.gender < 0 || user.gender > 2) {
      errors.push(`gender无效: ${user.gender}`);
    }
    
    // 验证年龄范围
    if (user.age < 0 || user.age > 150) {
      errors.push(`年龄异常: ${user.age}`);
    }
    
    // 验证布尔字段
    if (typeof user.hasDiabetes !== 'boolean') errors.push('hasDiabetes不是布尔值');
    if (typeof user.hasHypertension !== 'boolean') errors.push('hasHypertension不是布尔值');
    
    if (errors.length > 0) {
      issues.push({
        index,
        user,
        errors
      });
    } else {
      validCount++;
    }
  });
  
  console.log(`总用户数: ${users.length}`);
  console.log(`有效用户: ${validCount}`);
  console.log(`问题用户: ${issues.length}`);
  
  if (issues.length > 0) {
    console.log('\n发现的问题:');
    issues.forEach((issue, i) => {
      console.log(`\n问题 ${i + 1}:`);
      console.log(`  用户索引: ${issue.index}`);
      console.log(`  问题: ${issue.errors.join(', ')}`);
      console.log(`  用户:`, JSON.stringify(issue.user, null, 2));
    });
  }
  
  return {
    total: users.length,
    valid: validCount,
    issues: issues.length,
    success: issues.length === 0
  };
}

/**
 * 统计分析
 */
function analyzeData(data) {
  console.log('\n========== 数据统计分析 ==========');
  
  // 按用户统计
  const usersByOpenid = {};
  data.users.forEach(user => {
    usersByOpenid[user._openid] = user;
  });
  
  // 统计每个用户的血糖和血压记录数
  const userStats = {};
  
  data.blood_glucose.forEach(record => {
    if (!userStats[record._openid]) {
      userStats[record._openid] = { glucose: 0, pressure: 0 };
    }
    userStats[record._openid].glucose++;
  });
  
  data.blood_pressure.forEach(record => {
    if (!userStats[record._openid]) {
      userStats[record._openid] = { glucose: 0, pressure: 0 };
    }
    userStats[record._openid].pressure++;
  });
  
  console.log('\n用户数据统计:');
  Object.entries(userStats).forEach(([openid, stats]) => {
    const user = usersByOpenid[openid];
    console.log(`\n${user ? user.nickname : openid}:`);
    console.log(`  血糖记录: ${stats.glucose}条`);
    console.log(`  血压记录: ${stats.pressure}条`);
  });
  
  // 时间范围统计
  const glucoseTimes = data.blood_glucose.map(r => new Date(r.measureTime));
  const pressureTimes = data.blood_pressure.map(r => new Date(r.measureTime));
  
  console.log('\n时间范围:');
  console.log(`血糖记录: ${new Date(Math.min(...glucoseTimes)).toISOString().split('T')[0]} ~ ${new Date(Math.max(...glucoseTimes)).toISOString().split('T')[0]}`);
  console.log(`血压记录: ${new Date(Math.min(...pressureTimes)).toISOString().split('T')[0]} ~ ${new Date(Math.max(...pressureTimes)).toISOString().split('T')[0]}`);
  
  // 异常数据统计
  const abnormalGlucose = data.blood_glucose.filter(r => r.isAbnormal);
  const abnormalPressure = data.blood_pressure.filter(r => r.isAbnormal);
  
  console.log('\n异常数据统计:');
  console.log(`血糖异常: ${abnormalGlucose.length}条 (${Math.round(abnormalGlucose.length / data.blood_glucose.length * 100)}%)`);
  console.log(`血压异常: ${abnormalPressure.length}条 (${Math.round(abnormalPressure.length / data.blood_pressure.length * 100)}%)`);
  
  // 血糖测量类型分布
  const glucoseTypes = {};
  data.blood_glucose.forEach(r => {
    glucoseTypes[r.measureTypeName] = (glucoseTypes[r.measureTypeName] || 0) + 1;
  });
  
  console.log('\n血糖测量类型分布:');
  Object.entries(glucoseTypes).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}条`);
  });
}

/**
 * 主验证函数
 */
function validateTestData() {
  console.log('========== 开始验证测试数据 ==========');
  
  // 读取测试数据
  const dataPath = path.join(__dirname, '../cloud-database-test-data.json');
  
  if (!fs.existsSync(dataPath)) {
    console.error('错误: 测试数据文件不存在:', dataPath);
    console.error('请先运行 generateTestData.js 生成测试数据');
    return false;
  }
  
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  console.log('测试数据文件:', dataPath);
  console.log('用户数:', data.users?.length || 0);
  console.log('血糖记录数:', data.blood_glucose?.length || 0);
  console.log('血压记录数:', data.blood_pressure?.length || 0);
  
  // 验证各集合数据
  const userResult = validateUsers(data.users || []);
  const glucoseResult = validateGlucoseRecords(data.blood_glucose || []);
  const pressureResult = validatePressureRecords(data.blood_pressure || []);
  
  // 统计分析
  analyzeData(data);
  
  // 输出最终结果
  console.log('\n========== 验证结果 ==========');
  console.log(`用户验证: ${userResult.success ? '✓ 通过' : '✗ 失败'}`);
  console.log(`血糖验证: ${glucoseResult.success ? '✓ 通过' : '✗ 失败'}`);
  console.log(`血压验证: ${pressureResult.success ? '✓ 通过' : '✗ 失败'}`);
  
  if (userResult.success && glucoseResult.success && pressureResult.success) {
    console.log('\n✓ 所有验证通过,数据可以导入!');
  } else {
    console.log('\n✗ 验证失败,请检查并修复问题');
  }
  
  return userResult.success && glucoseResult.success && pressureResult.success;
}

// 命令行使用
if (require.main === module) {
  const success = validateTestData();
  process.exit(success ? 0 : 1);
}

module.exports = {
  validateTestData,
  validateUsers,
  validateGlucoseRecords,
  validatePressureRecords,
  analyzeData
};
