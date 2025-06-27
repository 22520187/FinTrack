import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, XCircle, AlertTriangle, Scale, Users } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Về trang chủ
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Điều Khoản Sử Dụng</h1>
          </div>
          <p className="text-gray-600">
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Chấp Nhận Điều Khoản</h2>
            <p className="text-gray-700 leading-relaxed">
              Bằng việc truy cập và sử dụng ứng dụng FinTrack, bạn đồng ý tuân thủ 
              các điều khoản và điều kiện được nêu trong tài liệu này. Nếu bạn không 
              đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng dịch vụ.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-semibold text-gray-900">2. Mô Tả Dịch Vụ</h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>FinTrack là ứng dụng quản lý tài chính cá nhân cung cấp:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Theo dõi thu chi và quản lý ngân sách</li>
                <li>Phân loại giao dịch theo danh mục</li>
                <li>Báo cáo và phân tích chi tiêu</li>
                <li>Đặt và theo dõi mục tiêu tài chính</li>
                <li>Lưu trữ dữ liệu tài chính cá nhân</li>
              </ul>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">3. Trách Nhiệm Người Dùng</h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">3.1 Thông tin tài khoản:</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Cung cấp thông tin chính xác và cập nhật</li>
                <li>Bảo mật thông tin đăng nhập cá nhân</li>
                <li>Thông báo ngay lập tức nếu phát hiện truy cập trái phép</li>
                <li>Chịu trách nhiệm cho mọi hoạt động diễn ra trên tài khoản</li>
              </ul>
              
              <h3 className="text-lg font-medium text-gray-900">3.2 Sử dụng hợp pháp:</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Sử dụng dịch vụ cho mục đích quản lý tài chính cá nhân</li>
                <li>Tuân thủ pháp luật hiện hành của Việt Nam</li>
                <li>Không sử dụng để rửa tiền hay hoạt động bất hợp pháp</li>
                <li>Không can thiệp vào hệ thống hay cố gắng hack</li>
              </ul>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-semibold text-gray-900">4. Hoạt Động Bị Cấm</h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>Bạn không được phép:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Sao chép, phân phối hoặc bán lại ứng dụng</li>
                <li>Cố gắng truy cập trái phép vào hệ thống</li>
                <li>Tải lên dữ liệu có chứa virus hoặc mã độc</li>
                <li>Spam hoặc gửi nội dung không mong muốn</li>
                <li>Giả mạo danh tính hoặc thông tin</li>
                <li>Sử dụng bot hoặc công cụ tự động</li>
                <li>Can thiệp vào hoạt động bình thường của dịch vụ</li>
              </ul>
            </div>
          </section>

          {/* Data & Privacy */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-900">5. Dữ Liệu và Quyền Riêng Tư</h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                Việc xử lý dữ liệu cá nhân của bạn được quy định trong 
                <Link to="/privacy" className="text-blue-600 hover:underline ml-1">
                  Chính sách Bảo mật
                </Link> 
                . Bạn đồng ý cho phép chúng tôi:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Thu thập và xử lý dữ liệu để cung cấp dịch vụ</li>
                <li>Lưu trữ thông tin tài chính trên máy chủ bảo mật</li>
                <li>Sử dụng dữ liệu để cải thiện chất lượng dịch vụ</li>
                <li>Gửi thông báo quan trọng về tài khoản</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Scale className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-semibold text-gray-900">6. Giới Hạn Trách Nhiệm</h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>FinTrack không chịu trách nhiệm cho:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Mất mát dữ liệu do lỗi người dùng</li>
                <li>Quyết định tài chính dựa trên dữ liệu từ ứng dụng</li>
                <li>Gián đoạn dịch vụ do bảo trì hoặc lỗi kỹ thuật</li>
                <li>Thiệt hại gián tiếp hoặc hậu quả</li>
                <li>Việc sử dụng không đúng mục đích</li>
              </ul>
              <div className="bg-orange-50 p-4 rounded-lg mt-4">
                <p className="text-orange-800 font-medium">
                  <strong>Lưu ý:</strong> FinTrack là công cụ hỗ trợ quản lý tài chính. 
                  Mọi quyết định đầu tư hay tài chính quan trọng nên được tham khảo 
                  ý kiến chuyên gia.
                </p>
              </div>
            </div>
          </section>

          {/* Service Availability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Tình Trạng Dịch Vụ</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Chúng tôi cố gắng duy trì dịch vụ hoạt động 24/7, tuy nhiên có thể 
                tạm ngưng để bảo trì, nâng cấp hoặc do sự cố kỹ thuật. Chúng tôi sẽ 
                thông báo trước khi bảo trì định kỳ.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Chấm Dứt Dịch Vụ</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Bạn có thể chấm dứt sử dụng dịch vụ bất cứ lúc nào bằng cách xóa tài khoản. 
                Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản nếu vi phạm điều khoản 
                sử dụng.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Thay Đổi Điều Khoản</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Chúng tôi có quyền cập nhật điều khoản sử dụng này. Những thay đổi quan trọng 
                sẽ được thông báo qua email hoặc thông báo trong ứng dụng ít nhất 30 ngày trước 
                khi có hiệu lực.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Liên Hệ</h2>
            <div className="text-gray-700 space-y-2">
              <p>
                Nếu bạn có câu hỏi về điều khoản sử dụng này, vui lòng liên hệ:
              </p>
              <p><strong>Email:</strong> fintrack.team@gmail.com</p>
              <p><strong>Điện thoại:</strong> (+84) 123 456 789</p>
              <p><strong>Địa chỉ:</strong> SE334 - FinTrack Team, Vietnam</p>
              <p><strong>Thời gian hỗ trợ:</strong> Thứ 2 - Thứ 6 (8:00 - 17:00)</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms; 