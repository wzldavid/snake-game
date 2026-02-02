// 测试数据生成脚本 - 查看生成的测试数据

const generateMockGlucoseData = (days = 30) => {
  const data = []
  const today = new Date()
  const measureTypes = ['空腹', '早餐后', '午餐前', '午餐后', '晚餐前', '晚餐后', '睡前']
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const recordCount = Math.floor(Math.random() * 3) + 1
    const usedMeasureTypes = [...measureTypes].sort(() => Math.random() - 0.5).slice(0, recordCount)
    
    usedMeasureTypes.forEach(measureType => {
      let baseValue
      switch (measureType) {
        case '空腹': baseValue = 4.5 + Math.random() * 2; break
        case '早餐后': baseValue = 6.0 + Math.random() * 3; break
        case '午餐前': baseValue = 4.0 + Math.random() * 2; break
        case '午餐后': baseValue = 6.5 + Math.random() * 3.5; break
        case '晚餐前': baseValue = 4.5 + Math.random() * 2; break
        case '晚餐后': baseValue = 6.0 + Math.random() * 3; break
        case '睡前': baseValue = 5.0 + Math.random() * 2; break
      }
      
      const isAbnormal = Math.random() < 0.1
      if (isAbnormal) {
        baseValue += Math.random() > 0.5 ? 2 : -1
      }
      
      const value = parseFloat(baseValue.toFixed(1))
      
      data.push({
        date: dateStr,
        type: 1,
        value: value,
        measureType: measureType,
        isAbnormal: isAbnormal
      })
    })
  }
  
  return data.sort((a, b) => new Date(a.date) - new Date(b.date))
}

const generateMockPressureData = (days = 30) => {
  const data = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const recordCount = Math.floor(Math.random() * 2) + 1
    
    for (let j = 0; j < recordCount; j++) {
      const systolic = Math.floor(110 + Math.random() * 50)
      const diastolic = Math.floor(65 + Math.random() * 35)
      const heartRate = Math.floor(65 + Math.random() * 35)
      const isAbnormal = systolic > 140 || systolic < 90 || diastolic > 90 || diastolic < 60
      
      data.push({
        date: dateStr,
        type: 2,
        systolic: systolic,
        diastolic: diastolic,
        heartRate: heartRate,
        isAbnormal: isAbnormal
      })
    }
  }
  
  return data.sort((a, b) => new Date(a.date) - new Date(b.date))
}

// 生成数据
const glucoseData = generateMockGlucoseData(30)
const pressureData = generateMockPressureData(30)

// 血糖统计
const glucoseValues = glucoseData.map(item => item.value)
const glucoseSum = glucoseValues.reduce((a, b) => a + b, 0)
const glucoseAvg = parseFloat((glucoseSum / glucoseValues.length).toFixed(1))
const glucoseMax = Math.max(...glucoseValues)
const glucoseMin = Math.min(...glucoseValues)
const glucoseAbnormalCount = glucoseData.filter(item => item.isAbnormal).length

// 血压统计
const systolicValues = pressureData.map(item => item.systolic)
const diastolicValues = pressureData.map(item => item.diastolic)
const pressureAvgSystolic = Math.round(systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length)
const pressureAvgDiastolic = Math.round(diastolicValues.reduce((a, b) => a + b, 0) / diastolicValues.length)
const pressureMaxSystolic = Math.max(...systolicValues)
const pressureMaxDiastolic = Math.max(...diastolicValues)
const pressureMinSystolic = Math.min(...systolicValues)
const pressureMinDiastolic = Math.min(...diastolicValues)
const pressureAbnormalCount = pressureData.filter(item => item.isAbnormal).length

console.log('\n========================================')
console.log('  血糖测试数据（30天）')
console.log('========================================')
console.log(`总记录数: ${glucoseData.length} 条`)
console.log(`平均值: ${glucoseAvg} mmol/L`)
console.log(`最大值: ${glucoseMax} mmol/L`)
console.log(`最小值: ${glucoseMin} mmol/L`)
console.log(`异常记录: ${glucoseAbnormalCount} 条`)
console.log('\n最近10条记录:')
glucoseData.slice(-10).forEach((item, index) => {
  console.log(`  ${index + 1}. ${item.date} ${item.measureType}: ${item.value} mmol/L${item.isAbnormal ? ' ⚠️异常' : ''}`)
})

console.log('\n========================================')
console.log('  血压测试数据（30天）')
console.log('========================================')
console.log(`总记录数: ${pressureData.length} 条`)
console.log(`收缩压 - 平均: ${pressureAvgSystolic} mmHg, 最大: ${pressureMaxSystolic} mmHg, 最小: ${pressureMinSystolic} mmHg`)
console.log(`舒张压 - 平均: ${pressureAvgDiastolic} mmHg, 最大: ${pressureMaxDiastolic} mmHg, 最小: ${pressureMinDiastolic} mmHg`)
console.log(`异常记录: ${pressureAbnormalCount} 条`)
console.log('\n最近10条记录:')
pressureData.slice(-10).forEach((item, index) => {
  console.log(`  ${index + 1}. ${item.date} 收缩压:${item.systolic} 舒张压:${item.diastolic} 心率:${item.heartRate}${item.isAbnormal ? ' ⚠️异常' : ''}`)
})

console.log('\n========================================')
console.log('  ✓ 测试数据生成完成！')
console.log('  在小程序中可以查看趋势图')
console.log('========================================\n')
