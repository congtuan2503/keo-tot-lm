import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export default function CreateMatch() {
  const [formData, setFormData] = useState({
    sport: '',
    location: '',
    time: '',
    playersNeeded: 1
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Lỗi khi tạo kèo');
      
      toast.success('Lên kèo thành công!');
      navigate(`/matches/${data.match._id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Đăng Kèo Nhanh</CardTitle>
          <CardDescription>Nhập thông tin sân bãi và thời gian để tìm đồng đội.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="sport">Môn thể thao</Label>
              <Input id="sport" placeholder="VD: Bóng đá sân 7, Cầu lông..." required value={formData.sport} onChange={e => setFormData({...formData, sport: e.target.value})} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Địa điểm (Tên sân, Quận)</Label>
              <Input id="location" placeholder="VD: Sân Chảo Lửa, Tân Bình" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Thời gian thi đấu (Ngày & Giờ)</Label>
                <Input id="time" type="datetime-local" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="playersNeeded">Số người thiếu</Label>
                <Input id="playersNeeded" type="number" min="1" required value={formData.playersNeeded} onChange={e => setFormData({...formData, playersNeeded: parseInt(e.target.value)})} />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Lên Kèo Ngay'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
