import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, UserCheck, Database, Smartphone } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Về trang chủ
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Chính Sách Bảo Mật</h1>
          </div>
          <p className="text-gray-600">
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Giới Thiệu</h2>
            <p className="text-gray-700 leading-relaxed">
              FinTrack cam kết bảo vệ quyền riêng tư và thông tin cá nhân của người dùng. 
              Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và 
              bảo vệ thông tin của bạn khi sử dụng ứng dụng quản lý tài chính FinTrack.
            </p>
          </section>

          {/* Data Collection */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-semibold text-gray-900">2. Thu Thập Thông Tin</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <h3 className="text-lg font-medium text-gray-900">2.1 Thông tin cá nhân:</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Họ tên, email, số điện thoại</li>
                <li>Thông tin đăng nhập (username, mật khẩu được mã hóa)</li>
                <li>Địa chỉ và thông tin liên hệ</li>
              </ul>
              
              <h3 className="text-lg font-medium text-gray-900">2.2 Thông tin tài chính:</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Chi tiết giao dịch và lịch sử chi tiêu</li>
                <li>Thông tin ngân sách và mục tiêu tài chính</li>
                <li>Danh mục chi tiêu và báo cáo</li>
              </ul>
            </div>
          </section>

          {/* Data Usage */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">3. Sử Dụng Thông Tin</h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>Chúng tôi sử dụng thông tin của bạn để:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Cung cấp và cải thiện dịch vụ quản lý tài chính</li>
                <li>Tạo báo cáo và phân tích chi tiêu cá nhân</li>
                <li>Gửi thông báo về tài khoản và cập nhật quan trọng</li>
                <li>Hỗ trợ khách hàng và giải đáp thắc mắc</li>
                <li>Bảo mật tài khoản và ngăn chặn gian lận</li>
              </ul>
            </div>
          </section>

          {/* Data Protection */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-semibold text-gray-900">4. Bảo Mật Thông Tin</h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>Chúng tôi áp dụng các biện pháp bảo mật nghiêm ngặt:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Mã hóa dữ liệu với các thuật toán bảo mật tiên tiến</li>
                <li>Xác thực đa yếu tố (2FA) cho tài khoản</li>
                <li>Giám sát và kiểm tra bảo mật thường xuyên</li>
                <li>Lưu trữ dữ liệu trên máy chủ được bảo mật cao</li>
                <li>Hạn chế quyền truy cập chỉ cho nhân viên được ủy quyền</li>
              </ul>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-semibold text-gray-900">5. Chia Sẻ Thông Tin</h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                Chúng tôi <strong>KHÔNG</strong> bán, trao đổi hay chia sẻ thông tin cá nhân 
                của bạn với bên thứ ba, trừ khi:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Có sự đồng ý rõ ràng từ người dùng</li>
                <li>Yêu cầu pháp lý từ cơ quan có thẩm quyền</li>
                <li>Cần thiết để bảo vệ quyền lợi hợp pháp của chúng tôi</li>
              </ul>
            </div>
          </section>

          {/* User Rights */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-900">6. Quyền Của Người Dùng</h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>Bạn có quyền:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Truy cập và xem thông tin cá nhân đã cung cấp</li>
                <li>Yêu cầu chỉnh sửa thông tin không chính xác</li>
                <li>Xóa tài khoản và dữ liệu cá nhân</li>
                <li>Từ chối nhận email marketing (không bắt buộc)</li>
                <li>Khiếu nại về việc xử lý dữ liệu cá nhân</li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Liên Hệ</h2>
            <div className="text-gray-700 space-y-2">
              <p>
                Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ:
              </p>
              <p><strong>Email:</strong> fintrack.team@gmail.com</p>
              <p><strong>Điện thoại:</strong> (+84) 123 456 789</p>
              <p><strong>Thời gian hỗ trợ:</strong> Thứ 2 - Thứ 6 (8:00 - 17:00)</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 