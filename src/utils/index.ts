/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import sourceMapJs from 'source-map-js'

const getSourceMapUrl = async (scriptUrl: string) => {
  const res = await axios.get(scriptUrl)
  return res
}

export const findCodeBySourceMap = async (stackName: any) => {
  const sourceMap = await getSourceMapUrl(stackName?.fileName || '')
  const fileContent = sourceMap.data as string
  console.log('fileContent', fileContent)

  //解析map文件
  const consumer = await new sourceMapJs.SourceMapConsumer(fileContent as any)

  //通过报错的位置，查找对应原文件的名称和行数

  const originalPosition = consumer.originalPositionFor({
    line: stackName?.lineNumber || 0, //报错行数
    column: stackName?.columnNumber || 0, //报错列数
  })

  const code = consumer.sourceContentFor(originalPosition.source || '', true)

  console.log('源文件', code)
}
