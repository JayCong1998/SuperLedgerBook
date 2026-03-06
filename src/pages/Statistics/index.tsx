const Statistics = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">统计</h2>
      
      {/* 日期选择 */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <input
            type="month"
            className="py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            查看
          </button>
        </div>
      </div>
      
      {/* 统计图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 收支趋势图 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">收支趋势</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">图表区域</p>
          </div>
        </div>
        
        {/* 分类占比图 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">分类占比</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">图表区域</p>
          </div>
        </div>
      </div>
      
      {/* 收支明细 */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">收支明细</h3>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-center text-gray-500 py-8">暂无数据</p>
        </div>
      </div>
    </div>
  )
}

export default Statistics