// 云函数入口文件
const cloud = require('wx-server-sdk')
const aiModel = require('@cloudbase/node-sdk').aiModel

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { photoUrl, type } = event

  // 参数验证
  if (!photoUrl || !type) {
    return {
      success: false,
      message: '参数不完整'
    }
  }

  try {
    // 下载图片文件
    const fileRes = await cloud.downloadFile({
      fileID: photoUrl
    })

    if (!fileRes.fileContent) {
      return {
        success: false,
        message: '图片下载失败'
      }
    }

    const imageBase64 = fileRes.fileContent.toString('base64')

    // 使用AI模型识别
    const prompt = type === 1
      ? '请识别这张血压计或血糖计显示屏上的血糖数值，只返回一个数字，单位是mmol/L。'
      : '请识别这张血压计显示屏上的血压数值，返回JSON格式:{"systolic":收缩压,"diastolic":舒张压,"heartRate":心率(如果显示)}。'

    // 调用混元AI模型
    const model = aiModel.createModel('hunyuan-2.0-instruct-20251111')
    const result = await model.generateText({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image',
              image: {
                url: imageBase64
              }
            }
          ]
        }
      ],
      maxTokens: 100
    })

    // 解析识别结果
    let parsedResult
    const generatedText = result.text || result.message || result

    if (type === 1) {
      // 血糖识别
      const glucoseValue = parseFloat(generatedText.trim())
      if (isNaN(glucoseValue) || glucoseValue <= 0 || glucoseValue > 50) {
        return {
          success: false,
          message: '血糖值识别失败，请手动输入'
        }
      }
      parsedResult = {
        glucoseValue
      }
    } else {
      // 血压识别
      try {
        parsedResult = JSON.parse(generatedText.replace(/```json/g, '').replace(/```/g, '').trim())

        // 验证血压值
        if (!parsedResult.systolic || !parsedResult.diastolic) {
          return {
            success: false,
            message: '血压值识别失败，请手动输入'
          }
        }

        if (parsedResult.systolic < 50 || parsedResult.systolic > 300 ||
            parsedResult.diastolic < 30 || parsedResult.diastolic > 200) {
          return {
            success: false,
            message: '血压值超出合理范围，请手动输入'
          }
        }

        // 心率可选验证
        if (parsedResult.heartRate && (parsedResult.heartRate < 30 || parsedResult.heartRate > 200)) {
          delete parsedResult.heartRate
        }
      } catch (error) {
        return {
          success: false,
          message: '血压值识别失败，请手动输入'
        }
      }
    }

    return {
      success: true,
      result: parsedResult,
      confidence: 0.85 // 默认置信度
    }

  } catch (error) {
    console.error('照片识别失败:', error)
    return {
      success: false,
      message: '识别失败，请手动输入',
      error: error.message
    }
  }
}
