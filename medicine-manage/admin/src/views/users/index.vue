<template>
  <div class="users">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索昵称"
            clearable
            style="width: 200px"
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </template>

      <el-table :data="userList" stripe v-loading="loading">
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="{ row }">
            {{ row.gender === 1 ? '男' : row.gender === 2 ? '女' : '未知' }}
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="hasDiabetes" label="糖尿病" width="80">
          <template #default="{ row }">
            <el-tag :type="row.hasDiabetes ? 'danger' : 'success'">
              {{ row.hasDiabetes ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="hasHypertension" label="高血压" width="80">
          <template #default="{ row }">
            <el-tag :type="row.hasHypertension ? 'danger' : 'success'">
              {{ row.hasHypertension ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="lastRecordTime" label="最后记录" width="180" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              link
              @click="viewHealthData(row)"
            >
              查看数据
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end;"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getUserList } from '@/api/users'
import dayjs from 'dayjs'

const router = useRouter()

const loading = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const userList = ref([])

const loadUserList = async () => {
  loading.value = true

  try {
    const res = await getUserList({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    })

    if (res.success) {
      userList.value = res.data
      total.value = res.total
    } else {
      ElMessage.error(res.message || '获取用户列表失败')
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadUserList()
}

const handlePageChange = () => {
  loadUserList()
}

const handleSizeChange = () => {
  currentPage.value = 1
  loadUserList()
}

const viewHealthData = (user) => {
  router.push(`/health-data?openid=${user._openid}`)
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

onMounted(() => {
  loadUserList()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
