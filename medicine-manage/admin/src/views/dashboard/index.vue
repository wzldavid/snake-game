<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="总用户数" :value="stats.totalUsers">
            <template #prefix>
              <el-icon color="#409EFF" :size="20"><User /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="今日测量" :value="stats.todayRecords">
            <template #prefix>
              <el-icon color="#67C23A" :size="20"><DataLine /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="异常预警" :value="stats.abnormalCount">
            <template #prefix>
              <el-icon color="#F56C6C" :size="20"><Warning /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="总记录数" :value="stats.totalRecords">
            <template #prefix>
              <el-icon color="#E6A23C" :size="20"><Document /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最新注册用户</span>
            </div>
          </template>
          <el-table :data="recentUsers" stripe>
            <el-table-column prop="nickname" label="昵称" />
            <el-table-column prop="createTime" label="注册时间">
              <template #default="{ row }">
                {{ formatDate(row.createTime) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>异常预警</span>
            </div>
          </template>
          <el-table :data="abnormalAlerts" stripe>
            <el-table-column prop="nickname" label="用户" />
            <el-table-column prop="alertType" label="预警类型">
              <template #default="{ row }">
                <el-tag :type="getAlertTagType(row.alertType)">
                  {{ getAlertTypeText(row.alertType) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="alertTime" label="时间">
              <template #default="{ row }">
                {{ formatDate(row.alertTime) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'

const stats = ref({
  totalUsers: 0,
  todayRecords: 0,
  abnormalCount: 0,
  totalRecords: 0
})

const recentUsers = ref([])
const abnormalAlerts = ref([])

const loadDashboardData = async () => {
  // TODO: 从后端API获取数据
  // 暂时使用模拟数据
  stats.value = {
    totalUsers: 156,
    todayRecords: 89,
    abnormalCount: 23,
    totalRecords: 3456
  }

  recentUsers.value = [
    { nickname: '张大爷', createTime: new Date() },
    { nickname: '李奶奶', createTime: new Date(Date.now() - 3600000) },
    { nickname: '王叔叔', createTime: new Date(Date.now() - 7200000) },
    { nickname: '赵阿姨', createTime: new Date(Date.now() - 10800000) }
  ]

  abnormalAlerts.value = [
    { nickname: '张大爷', alertType: 1, alertTime: new Date() },
    { nickname: '李奶奶', alertType: 3, alertTime: new Date(Date.now() - 1800000) },
    { nickname: '王叔叔', alertType: 2, alertTime: new Date(Date.now() - 3600000) }
  ]
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

const getAlertTypeText = (type) => {
  const types = {
    1: '高血糖',
    2: '低血糖',
    3: '高血压',
    4: '低血压'
  }
  return types[type] || '未知'
}

const getAlertTagType = (type) => {
  return type === 1 || type === 3 ? 'danger' : 'warning'
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stat-card {
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
