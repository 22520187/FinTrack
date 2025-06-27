import { Link } from 'react-router-dom';
import { Mail, Phone, Users, Code } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-primary-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-blue-600 ml-30 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">FinTrack</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Ứng dụng quản lý tài chính cá nhân thông minh, giúp bạn theo dõi chi tiêu, 
              lập kế hoạch ngân sách và đạt được mục tiêu tài chính.
            </p>
            <div className="flex gap-3 ml-20">
              <Link
                to="/privacy"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors hover:underline"
              >
                Chính sách bảo mật
              </Link>
              <Link
                to="/terms"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors hover:underline"
              >
                Điều khoản sử dụng
              </Link>
            </div>
          </div>

          {/* Team Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-green-600 ml-35 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">Nhóm Phát Triển</h3>
            </div>
            <div className="space-y-2 text-center text-gray-600">
              <p><span className="font-medium">Nhóm:</span> SE334 - FinTrack Team</p>
              <p><span className="font-medium">Thành viên:</span></p>
              <ul className="ml-4 space-y-1">
                <li>• Bùi Khánh Đang</li>
                <li>• Nguyễn Lưu Minh Đăng</li>
                <li>• Nguyễn Văn Duy Bảo</li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
           <div className="space-y-4 ml-20">
             <h3 className="text-lg font-bold text-gray-900">Thông Tin Liên Hệ</h3>
             <div className="space-y-3 mt-7">
               <div className="flex items-center gap-3">
                 <Mail className="h-5 w-5 text-blue-600" />
                 <div>
                   <a 
                     href="mailto:fintrack.team@gmail.com"
                     className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                   >
                     fintrack.team@gmail.com
                   </a>
                 </div>
               </div>
               
               <div className="flex items-center gap-3">
                 <Phone className="h-5 w-5 text-green-600" />
                 <div>
                   <a 
                     href="tel:+84123456789"
                     className="text-sm text-green-600 hover:text-green-800 transition-colors"
                   >
                     (+84) 123 456 789
                   </a>
                 </div>
               </div>

               <div className="pt-2">
                 <p className="text-xs text-gray-500">
                   Thời gian hỗ trợ: Thứ 2 - Thứ 6 (8:00 - 17:00)
                 </p>
               </div>
             </div>
           </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {currentYear} FinTrack - SE334 Project. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex gap-4 text-sm">
              <span className="text-gray-500">Version 1.0.0</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">Made with ❤️ in Vietnam</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;