/**
 * CloudBase数据库测试数据导入脚本
 * 将生成的测试数据导入到CloudBase数据库
 */

const tcb = require('@cloudbase/node-sdk');
const fs = require('fs');
const path = require('path');

// 初始化CloudBase
const app = tcb.init({
  env: 'wzldavid-4gwhey9fe011d906' // 环境ID,请根据实际情况修改
});

const db = app.database();

/**
 * 导入数据到指定集合
 */
async function importCollection(collectionName, records, batchSize = 100) {
  const collection = db.collection(collectionName);
  let successCount = 0;
  let failCount = 0;
  
  console.log(`\n正在导入 ${collectionName} 数据...`);
  
  // 分批导入
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    
    try {
      await collection.add(batch);
      successCount += batch.length;
      console.log(`✓ 批次 ${Math.floor(i / batchSize) + 1}: 导入 ${batch.length} 条记录`);
    } catch (error) {
      failCount += batch.length;
      console.error(`✗ 批次 ${Math.floor(i / batchSize) + 1}: 导入失败`, error.message);
      
      // 如果批量失败,尝试逐条导入
      for (const record of batch) {
        try {
          await collection.add(record);
          successCount++;
        } catch (singleError) {
          failCount++;
          console.error(`✗ 单条导入失败:`, singleError.message);
        }
      }
    }
  }
  
  console.log(`${collectionName} 导入完成: 成功 ${successCount} 条, 失败 ${failCount} 条`);
  return { successCount, failCount };
}

/**
 * 清空集合数据
 */
async function clearCollection(collectionName) {
  const collection = db.collection(collectionName);
  
  try {
    const result = await collection.remove();
    console.log(`✓ 清空 ${collectionName} 集合, 删除了 ${result.removed} 条记录`);
    return true;
  } catch (error) {
    console.error(`✗ 清空 ${collectionName} 集合失败:`, error.message);
    return false;
  }
}

/**
 * 主导入函数
 */
async function importAllTestData(options = {}) {
  const { clearBeforeImport = true, testDataPath = null } = options;
  
  // 读取测试数据
  const dataPath = testDataPath || path.join(__dirname, '../cloud-database-test-data.json');
  
  if (!fs.existsSync(dataPath)) {
    console.error(`错误: 测试数据文件不存在: ${dataPath}`);
    console.error('请先运行 generateTestData.js 生成测试数据');
    return;
  }
  
  const testData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  console.log('========== 开始导入测试数据 ==========');
  console.log(`测试数据文件: ${dataPath}`);
  console.log(`清空已有数据: ${clearBeforeImport ? '是' : '否'}`);
  
  // 检查连接
  try {
    console.log('\n正在连接CloudBase...');
    const result = await db.collection('users').limit(1).get();
    console.log('✓ CloudBase连接成功');
  } catch (error) {
    console.error('✗ CloudBase连接失败:', error.message);
    console.error('\n请检查:');
    console.error('1. 是否已安装 @cloudbase/node-sdk 依赖');
    console.error('2. 是否已配置正确的环境ID');
    console.error('3. 是否已登录CloudBase (使用 cloudbase login)');
    console.error('\n运行以下命令安装依赖:');
    console.error('npm install @cloudbase/node-sdk');
    return;
  }
  
  try {
    // 清空已有数据
    if (clearBeforeImport) {
      console.log('\n========== 清空已有数据 ==========');
      await clearCollection('blood_glucose');
      await clearCollection('blood_pressure');
      await clearCollection('users');
    }
    
    // 导入用户数据
    console.log('\n========== 导入用户数据 ==========');
    const usersResult = await importCollection('users', testData.users);
    
    // 导入血糖数据
    console.log('\n========== 导入血糖数据 ==========');
    const glucoseResult = await importCollection('blood_glucose', testData.blood_glucose);
    
    // 导入血压数据
    console.log('\n========== 导入血压数据 ==========');
    const pressureResult = await importCollection('blood_pressure', testData.blood_pressure);
    
    // 统计结果
    console.log('\n========== 导入完成 ==========');
    console.log(`用户数据: 成功 ${usersResult.successCount} 条, 失败 ${usersResult.failCount} 条`);
    console.log(`血糖数据: 成功 ${glucoseResult.successCount} 条, 失败 ${glucoseResult.failCount} 条`);
    console.log(`血压数据: 成功 ${pressureResult.successCount} 条, 失败 ${pressureResult.failCount} 条`);
    console.log('================================\n');
    
  } catch (error) {
    console.error('\n导入过程中发生错误:', error.message);
    console.error(error);
  }
}

/**
 * 手动导入单个集合
 */
async function importSingleCollection(collectionName, records) {
  console.log(`\n========== 导入 ${collectionName} ==========`);
  await importCollection(collectionName, records);
}

// 命令行使用
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  
  // 解析命令行参数
  if (args.includes('--no-clear')) {
    options.clearBeforeImport = false;
  }
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('CloudBase测试数据导入脚本');
    console.log('\n用法:');
    console.log('  node importTestData.js [选项]');
    console.log('\n选项:');
    console.log('  --no-clear  不清空已有数据');
    console.log('  --help, -h  显示帮助信息');
    console.log('\n示例:');
    console.log('  node importTestData.js           # 导入并清空已有数据');
    console.log('  node importTestData.js --no-clear # 导入不清空已有数据');
    process.exit(0);
  }
  
  importAllTestData(options);
}

module.exports = {
  importAllTestData,
  importCollection,
  clearCollection,
  importSingleCollection
};
