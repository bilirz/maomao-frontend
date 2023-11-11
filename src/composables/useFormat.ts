type Categories = {
  [key: number]: string
}

// 将时间戳改为 2023-01-01 12:00:00 格式
export default function useFormat() {
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  // 将分区ID展示成分区
  const getCategoryByValue = (value: number): string => {
    const categories: Categories = {
      100: '游戏',
      200: '生活',
      300: '知识',
      400: '科技',
      500: '音乐',
      600: '鬼畜',
      700: '动画',
      800: '时尚',
      900: '舞蹈',
      1000: '娱乐',
      1100: '美食',
      1200: '动物',
    }

    return categories[value] || '未知'
  }

  return { formatTimestamp, getCategoryByValue }
}
