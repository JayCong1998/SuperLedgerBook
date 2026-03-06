const Footer = ({ className }: { className?: string }) => {
  return (
    <footer className={`bg-gray-800 text-white py-4 ${className}`}>
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">© 2026 记账本 - 简单易用的个人财务管理工具</p>
      </div>
    </footer>
  )
}

export default Footer