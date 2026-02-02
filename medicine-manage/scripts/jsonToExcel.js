/**
 * JSON转Excel脚本
 * 将cloud-database-test-data.json转换为Excel文件
 */

const fs = require('fs');
const path = require('path');

/**
 * 转换用户数据为CSV格式
 */
function convertUsersToCSV(users) {
  const headers = [
    '_openid',
    'nickname',
    'avatar',
    'gender',
    'birthday',
    'age',
    'hasDiabetes',
    'hasHypertension',
    'emergencyContact',
    'emergencyPhone',
    'createTime',
    'updateTime',
    'lastLoginTime'
  ];

  const rows = [headers.join(',')];

  users.forEach(user => {
    const row = headers.map(header => {
      const value = user[header];
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      if (typeof value === 'boolean') {
        return value ? '是' : '否';
      }
      return value !== null && value !== undefined ? value : '';
    });
    rows.push(row.join(','));
  });

  return rows.join('\n');
}

/**
 * 转换血糖数据为CSV格式
 */
function convertGlucoseToCSV(glucoseRecords) {
  const headers = [
    '_openid',
    'nickname',
    'measureTime',
    'measureDate',
    'measureType',
    'measureTypeName',
    'value',
    'unit',
    'isAbnormal',
    'abnormalType',
    'abnormalTypeName',
    'abnormalReason',
    'photoUrl',
    'note',
    'createTime'
  ];

  const userMap = new Map();
  // 从文件顶部获取用户信息
  const rawData = fs.readFileSync(
    path.join(__dirname, '../cloud-database-test-data.json'),
    'utf8'
  );
  const data = JSON.parse(rawData);
  data.users.forEach(user => {
    userMap.set(user._openid, user.nickname);
  });

  const abnormalTypeNames = {
    0: '正常',
    1: '高血糖',
    2: '低血糖'
  };

  const rows = [headers.join(',')];

  glucoseRecords.forEach(record => {
    const nickname = userMap.get(record._openid) || '';
    const measureDate = record.measureTime ? record.measureTime.split('T')[0] : '';

    const row = [
      record._openid || '',
      nickname,
      record.measureTime || '',
      measureDate,
      record.measureType || '',
      record.measureTypeName || '',
      record.value || '',
      'mmol/L',
      record.isAbnormal ? '是' : '否',
      record.abnormalType || 0,
      abnormalTypeNames[record.abnormalType] || '',
      record.abnormalReason || '',
      record.photoUrl || '',
      record.note || '',
      record.createTime || ''
    ];

    // 处理包含逗号的字符串
    const processedRow = row.map(cell => {
      if (typeof cell === 'string' && cell.includes(',')) {
        return `"${cell}"`;
      }
      return cell;
    });

    rows.push(processedRow.join(','));
  });

  return rows.join('\n');
}

/**
 * 转换血压数据为CSV格式
 */
function convertPressureToCSV(pressureRecords) {
  const headers = [
    '_openid',
    'nickname',
    'measureTime',
    'measureDate',
    'systolic',
    'diastolic',
    'heartRate',
    'unit',
    'isAbnormal',
    'abnormalType',
    'abnormalTypeName',
    'abnormalReason',
    'photoUrl',
    'note',
    'createTime'
  ];

  const userMap = new Map();
  const rawData = fs.readFileSync(
    path.join(__dirname, '../cloud-database-test-data.json'),
    'utf8'
  );
  const data = JSON.parse(rawData);
  data.users.forEach(user => {
    userMap.set(user._openid, user.nickname);
  });

  const abnormalTypeNames = {
    0: '正常',
    1: '高血压',
    2: '低血压'
  };

  const rows = [headers.join(',')];

  pressureRecords.forEach(record => {
    const nickname = userMap.get(record._openid) || '';
    const measureDate = record.measureTime ? record.measureTime.split('T')[0] : '';

    const row = [
      record._openid || '',
      nickname,
      record.measureTime || '',
      measureDate,
      record.systolic || '',
      record.diastolic || '',
      record.heartRate || '',
      'mmHg',
      record.isAbnormal ? '是' : '否',
      record.abnormalType || 0,
      abnormalTypeNames[record.abnormalType] || '',
      record.abnormalReason || '',
      record.photoUrl || '',
      record.note || '',
      record.createTime || ''
    ];

    const processedRow = row.map(cell => {
      if (typeof cell === 'string' && cell.includes(',')) {
        return `"${cell}"`;
      }
      return cell;
    });

    rows.push(processedRow.join(','));
  });

  return rows.join('\n');
}

/**
 * 主转换函数
 */
function convertJSONToExcel() {
  console.log('========== 开始转换JSON到CSV ==========\n');

  // 读取JSON文件
  const jsonPath = path.join(__dirname, '../cloud-database-test-data.json');

  if (!fs.existsSync(jsonPath)) {
    console.error('错误: JSON文件不存在:', jsonPath);
    return false;
  }

  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(rawData);

  // 输出目录
  const outputDir = 'E:/';
  console.log('输出目录:', outputDir);

  try {
    // 转换用户数据
    console.log('\n转换用户数据...');
    const usersCSV = convertUsersToCSV(data.users);
    const usersPath = path.join(outputDir, 'users.csv');
    fs.writeFileSync(usersPath, '\uFEFF' + usersCSV, 'utf8');
    console.log(`✓ 用户数据已保存: ${usersPath}`);
    console.log(`  记录数: ${data.users.length}`);

    // 转换血糖数据
    console.log('\n转换血糖数据...');
    const glucoseCSV = convertGlucoseToCSV(data.blood_glucose);
    const glucosePath = path.join(outputDir, 'blood_glucose.csv');
    fs.writeFileSync(glucosePath, '\uFEFF' + glucoseCSV, 'utf8');
    console.log(`✓ 血糖数据已保存: ${glucosePath}`);
    console.log(`  记录数: ${data.blood_glucose.length}`);

    // 转换血压数据
    console.log('\n转换血压数据...');
    const pressureCSV = convertPressureToCSV(data.blood_pressure);
    const pressurePath = path.join(outputDir, 'blood_pressure.csv');
    fs.writeFileSync(pressurePath, '\uFEFF' + pressureCSV, 'utf8');
    console.log(`✓ 血压数据已保存: ${pressurePath}`);
    console.log(`  记录数: ${data.blood_pressure.length}`);

    console.log('\n========== 转换完成 ==========');
    console.log('\n生成的文件:');
    console.log(`1. ${usersPath}`);
    console.log(`2. ${glucosePath}`);
    console.log(`3. ${pressurePath}`);
    console.log('\n提示:');
    console.log('- CSV文件可以直接用Excel打开');
    console.log('- 文件使用UTF-8编码,带BOM,支持中文显示');
    console.log('- 每个CSV文件可以在Excel中另存为.xlsx格式');

    return true;

  } catch (error) {
    console.error('\n转换失败:', error.message);
    console.error(error);
    return false;
  }
}

// 运行转换
if (require.main === module) {
  const success = convertJSONToExcel();
  process.exit(success ? 0 : 1);
}

module.exports = {
  convertJSONToExcel,
  convertUsersToCSV,
  convertGlucoseToCSV,
  convertPressureToCSV
};
