import { Link } from 'react-router';
import { buttonVariants } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { Activity, ShieldCheck, Search, Users } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center space-y-16 py-12">
      <div className="text-center space-y-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Chơi Thể Thao Không Lo <span className="text-primary">"Bùng Kèo"</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Nền tảng ghép phòng thể thao giúp bạn tìm đúng người, đúng trình độ với hệ thống đánh giá uy tín minh bạch.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          {user ? (
            <Link to="/dashboard" className={buttonVariants({ size: "lg" })}>Bắt đầu tìm kèo</Link>
          ) : (
            <>
              <Link to="/register" className={buttonVariants({ size: "lg" })}>Đăng ký tham gia</Link>
              <Link to="/login" className={buttonVariants({ size: "lg", variant: "outline" })}>Đăng nhập</Link>
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="flex flex-col items-center text-center space-y-4 p-6 bg-card rounded-xl shadow-sm border">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Search size={24} />
          </div>
          <h3 className="text-xl font-bold">Tìm kèo chuẩn xác</h3>
          <p className="text-muted-foreground">
            Lọc theo môn thể thao, thời gian, địa điểm và trình độ để tìm những đối thủ xứng tầm nhất.
          </p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4 p-6 bg-card rounded-xl shadow-sm border">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-bold">Hồ sơ uy tín</h3>
          <p className="text-muted-foreground">
            Hệ thống đánh giá sau mỗi trận đấu giúp xây dựng cộng đồng có trách nhiệm, hạn chế tối đa "lệch pha" và "bùng kèo".
          </p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4 p-6 bg-card rounded-xl shadow-sm border">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold">Kết nối đam mê</h3>
          <p className="text-muted-foreground">
            Giao lưu, làm quen và mở rộng mạng lưới bạn bè chung sở thích thể thao khắp mọi nơi.
          </p>
        </div>
      </div>
    </div>
  );
}
