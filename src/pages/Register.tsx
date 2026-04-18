import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function Register() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    preferredArea: '',
    skillLevel: 'Beginner',
    favoriteSport: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          favoriteSports: [formData.favoriteSport]
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng ký thất bại');
      
      localStorage.setItem('token', data.token);
      
      // Fetch user profile to log in
      const meRes = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${data.token}` }
      });
      const meData = await meRes.json();
      
      if (meData.success) {
        login(meData.user);
        toast.success('Đăng ký thành công!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Đăng ký tài khoản</CardTitle>
          <CardDescription>Tham gia cộng đồng thể thao minh bạch lớn nhất!</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Tên hiển thị</Label>
              <Input id="displayName" required value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="favoriteSport">Môn thể thao yêu thích</Label>
              <Input id="favoriteSport" placeholder="VD: Bóng đá, Cầu lông" required value={formData.favoriteSport} onChange={e => setFormData({...formData, favoriteSport: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredArea">Khu vực thường chơi</Label>
              <Input id="preferredArea" placeholder="VD: Quận 7, TP.HCM" value={formData.preferredArea} onChange={e => setFormData({...formData, preferredArea: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skillLevel">Trình độ tự đánh giá</Label>
              <Select value={formData.skillLevel} onValueChange={(v) => setFormData({...formData, skillLevel: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trình độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Mới bắt đầu (Phong trào)</SelectItem>
                  <SelectItem value="Intermediate">Trung bình (Khá)</SelectItem>
                  <SelectItem value="Advanced">Nâng cao (Bán chuyên)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </Button>
            <div className="text-sm text-center text-muted-foreground flex gap-1">
              Đã có tài khoản? <Link to="/login" className="text-primary hover:underline">Đăng nhập ngay</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
