<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import sourceMapJs from 'source-map-js'
import PreView from './PreView.vue'
const js_error = ref<any>(null)
const isError = ref(false)
const activeName = ref<string[]>(['1'])
let stackFramesObj = {
  line: 0,
  column: 0,
  index: 0,
}

onMounted(() => {
  try {
    const jsErrorList = localStorage.getItem('jsErrorList')
    if (jsErrorList) {
      isError.value = true
      js_error.value = JSON.parse(jsErrorList)
    }
  } catch (error) {
    console.log('捕获到异常:', error)
  }
})

const dialogVisible = ref(false)

const openDialog = (item: any, index: number) => {
  dialogVisible.value = true
  stackFramesObj = {
    line: item.lineNumber,
    column: item.columnNumber,
    index,
  }
}

const tabActiveName = ref('local')

const sourceMapUpload = async (file: File) => {
  if (file.name.substring(file.name.lastIndexOf('.') + 1) !== 'map') {
    ElMessage.error('请上传正确的sourceMap文件')
    return
  }

  const reader = new FileReader()
  reader.readAsText(file, 'UTF-8')
  reader.onload = async (e) => {
    const code = await getSource(
      e.target?.result as string,
      stackFramesObj.line,
      stackFramesObj.column,
    )

    js_error.value.stack_frames[stackFramesObj.index].origin = code
  }
  dialogVisible.value = false
}

const getSource = async (sourceMap: string, line: number, column: number) => {
  try {
    const consumer = await new sourceMapJs.SourceMapConsumer(JSON.parse(sourceMap))

    //通过报错的位置，查找对应原文件的名称和行数

    const originalPosition = consumer.originalPositionFor({
      line: line || 0, //报错行数
      column: column || 0, //报错列数
    })

    const source = consumer.sourceContentFor(originalPosition.source || '', true)

    return {
      source,
      column: originalPosition.column,
      line: originalPosition.line,
    }
  } catch (e) {
    ElMessage.error('sourceMap文件解析失败')
  }
}
</script>

<template>
  <div v-if="isError">
    <pre>{{ js_error.stack }}</pre>
    <el-collapse accordion>
      <el-collapse-item
        v-for="(item, index) in js_error.stack_frames"
        :key="index"
        :name="index.toString()"
        :title="item.source"
      >
        <el-row :gutter="20">
          <el-col :span="20">
            <div>{{ item.fileName }}</div>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" size="small" @click="openDialog(item, index)">
              映射源码
            </el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <template v-if="item.origin">
            <PreView :origin="item.origin" />
          </template>
          <template v-else>
            <div>{{ item.fileName }}</div>
          </template>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>

  <el-dialog v-model="dialogVisible" width="500" title="sourceMap源码映射">
    <el-tabs v-model="tabActiveName" class="demo-tabs">
      <el-tab-pane label="本地上传" name="local">
        <el-upload drag :before-upload="sourceMapUpload">
          <i classs="el-icon-upload"></i>
          <div>将文件拖到此处，或者<a>点击上传</a></div>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="远程加载" name="request">Config</el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
