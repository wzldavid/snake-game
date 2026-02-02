<template>
  <div class="health-data">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>健康数据</span>
          <el-button type="primary" @click="goBack">返回</el-button>
        </div>
      </template>

      <el-empty description="功能开发中..." />
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
