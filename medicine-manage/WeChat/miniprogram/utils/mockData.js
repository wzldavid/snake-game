// 测试数据生成器 - 生成30天的血糖和血压数据

function generateMockGlucoseData(days = 30) {
  const data = []
  const today = new Date()
  const measureTypes = ['空腹', '早餐后', '午餐前', '午餐后', '晚餐前', '晚餐后', '睡前']
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    // 每天生成1-3条血糖记录
    const recordCount = Math.floor(Math.random() * 3) + 1
    const usedMeasureTypes = [...measureTypes].sort(() => Math.random() - 0.5).slice(0, recordCount)
    
    usedMeasureTypes.forEach(measureType => {
      let baseValue
      switch (measureType) {
        case '空腹':
          baseValue = 4.5 + Math.random() * 2 // 4.5-6.5
          break
        case '早餐后':
          baseValue = 6.0 + Math.random() * 3 // 6.0-9.0
          break
        case '午餐前':
          baseValue = 4.0 + Math.random() * 2 // 4.0-6.0
          break
        case '午餐后':
          baseValue = 6.5 + Math.random() * 3.5 // 6.5-10.0
          break
        case '晚餐前':
          baseValue = 4.5 + Math.random() * 2 // 4.5-6.5
          break
        case '晚餐后':
          baseValue = 6.0 + Math.random() * 3 // 6.0-9.0
          break
        case '睡前':
          baseValue = 5.0 + Math.random() * 2 // 5.0-7.0
          break
      }
      
      // 偶尔生成异常值
      const isAbnormal = Math.random() < 0.1
      if (isAbnormal) {
        baseValue += Math.random() > 0.5 ? 2 : -1
      }
      
      const value = parseFloat(baseValue.toFixed(1))
      
      data.push({
        id: `glucose_${dateStr}_${measureType}`,
        date: dateStr,
        type: 1, // 1=血糖
        value: value,
        measureType: measureType,
        isAbnormal: isAbnormal,
        createdAt: new Date(dateStr + 'T' + String(Math.floor(Math.random() * 24)).padStart(2, '0') + ':' + String(Math.floor(Math.random() * 60)).padStart(2, '0') + ':00').toISOString()
      })
    })
  }
  
  // 按日期排序
  return data.sort((a, b) => new Date(a.date) - new Date(b.date))
}

function generateMockPressureData(days = 30) {
  const data = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    // 每天生成1-2条血压记录
    const recordCount = Math.floor(Math.random() * 2) + 1
    
    for (let j = 0; j < recordCount; j++) {
      // 收缩压 100-160
      const systolic = Math.floor(110 + Math.random() * 50)
      // 舒张压 60-100
      const diastolic = Math.floor(65 + Math.random() * 35)
      // 心率 60-100
      const heartRate = Math.floor(65 + Math.random() * 35)
      
      // 判断是否异常
      const isAbnormal = systolic > 140 || systolic < 90 || diastolic > 90 || diastolic < 60
      
      data.push({
        id: `pressure_${dateStr}_${j}`,
        date: dateStr,
        type: 2, // 2=血压
        systolic: systolic,
        diastolic: diastolic,
        heartRate: heartRate,
        isAbnormal: isAbnormal,
        createdAt: new Date(dateStr + 'T' + String(Math.floor(Math.random() * 24)).padStart(2, '0') + ':' + String(Math.floor(Math.random() * 60)).padStart(2, '0') + ':00').toISOString()
      })
    }
  }
  
  // 按日期排序
  return data.sort((a, b) => new Date(a.date) - new Date(b.date))
}

function calculateStatistics(type, data) {
  if (type === 1) {
    // 血糖统计
    const values = data.map(item => item.value)
    const sum = values.reduce((a, b) => a + b, 0)
    const avg = parseFloat((sum / values.length).toFixed(1))
    const max = Math.max(...values)
    const min = Math.min(...values)
    const abnormalCount = data.filter(item => item.isAbnormal).length
    
    return {
      avg,
      max,
      min,
      abnormalCount,
      totalCount: data.length
    }
  } else {
    // 血压统计
    const systolicValues = data.map(item => item.systolic)
    const diastolicValues = data.map(item => item.diastolic)
    
    const avgSystolic = Math.round(systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length)
    const avgDiastolic = Math.round(diastolicValues.reduce((a, b) => a + b, 0) / diastolicValues.length)
    const maxSystolic = Math.max(...systolicValues)
    const maxDiastolic = Math.max(...diastolicValues)
    const minSystolic = Math.min(...systolicValues)
    const minDiastolic = Math.min(...diastolicValues)
    const abnormalCount = data.filter(item => item.isAbnormal).length
    
    return {
      avgSystolic,
      avgDiastolic,
      maxSystolic,
      maxDiastolic,
      minSystolic,
      minDiastolic,
      abnormalCount,
      totalCount: data.length
    }
  }
}

// 生成测试数据
const glucoseData = generateMockGlucoseData(30)
const pressureData = generateMockPressureData(30)

// 计算统计信息
const glucoseStats = calculateStatistics(1, glucoseData)
const pressureStats = calculateStatistics(2, pressureData)

// 输出到控制台
console.log('=== 血糖测试数据（30天）===')
console.log(`总共 ${glucoseData.length} 条记录`)
console.log('统计信息:', glucoseStats)
console.log('前10条记录:')
glucoseData.slice(0, 10).forEach((item, index) => {
  console.log(`${index + 1}. ${item.date} ${item.measureType}: ${item.value}${item.isAbnormal ? ' ⚠️' : ''}`)
})

console.log('\n=== 血压测试数据（30天）===')
console.log(`总共 ${pressureData.length} 条记录`)
console.log('统计信息:', pressureStats)
console.log('前10条记录:')
pressureData.slice(0, 10).forEach((item, index) => {
  console.log(`${index + 1}. ${item.date} 收缩压:${item.systolic} 舒张压:${item.diastolic} 心率:${item.heartRate}${item.isAbnormal ? ' ⚠️' : ''}`)
})

// 导出数据供页面使用
module.exports = {
  glucoseData,
  pressureData,
  glucoseStats,
  pressureStats,
  generateMockGlucoseData,
  generateMockPressureData,
  calculateStatistics
}
