export default function useFormat() {
  const formatTimestamp = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const getCategoryByValue = (value) => {
    const categories = {
      100: "游戏",
      200: "生活",
      300: "知识",
      400: "科技",
      500: "音乐",
      600: "鬼畜",
      700: "动画",
      800: "时尚",
      900: "舞蹈",
      1000: "娱乐",
      1100: "美食",
      1200: "动物"
    };

    return categories[value] || "未知分区"; // 如果数字不在列表中，则返回"未知分区"
  }

  return { formatTimestamp, getCategoryByValue };
}
