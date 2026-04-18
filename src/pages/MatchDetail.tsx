import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Match, Review } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/StarRating';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MapPin, Clock, Users, UserPlus, CheckCircle, Edit, Trash2, X, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function MatchDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ sport: '', location: '', time: '', playersNeeded: 1 });
  const [savingSync, setSavingSync] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [targetUserId, setTargetUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchMatch();
  }, [id]);

  const fetchMatch = async () => {
    try {
      const res = await fetch(`/api/matches/${id}`);
      const data = await res.json();
      if (data.success) {
        setMatch(data.match);
        // Format time for datetime-local input
        const localTime = new Date(data.match.time);
        const tzOffset = localTime.getTimezoneOffset() * 60000;
        const localISOTime = new Date(localTime.getTime() - tzOffset).toISOString().slice(0,16);
        setEditForm({
          sport: data.match.sport,
          location: data.match.location,
          time: localISOTime,
          playersNeeded: data.match.playersNeeded
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSync(true);
    try {
      const res = await fetch(`/api/matches/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Đã cập nhật kèo thành công!');
      setIsEditing(false);
      fetchMatch();
    } catch (err: any) {
      toast.error(err.message || 'Lỗi cập nhật');
    } finally {
      setSavingSync(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/matches/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Đã xóa kèo!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Lỗi xóa kèo');
    }
  };

  const handleJoin = async () => {
    if (!user) return toast.error('Vui lòng đăng nhập để tham gia kèo');
    setJoining(true);
    try {
      const res = await fetch(`/api/matches/${id}/join`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Đã đăng ký tham gia thành công!');
      fetchMatch(); // Refresh
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setJoining(false);
    }
  };

  const submitReview = async () => {
    if (!targetUserId || rating === 0) return toast.error('Vui lòng chọn số sao');
    setSubmittingReview(true);
    
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ matchId: id, targetUserId, rating, comment })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      toast.success('Đã gửi đánh giá uy tín!');
      setTargetUserId(null); // Close form
      setRating(0);
      setComment('');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="space-y-6"><Skeleton className="h-[200px] w-full" /><Skeleton className="h-[300px] w-full" /></div>;
  if (!match) return <div className="text-center py-12">Không tìm thấy trận đấu</div>;

  const isHost = user?.id === match.hostId;
  const hasJoined = match.joinedPlayers.some((p: any) => p._id === user?.id || p === user?.id);

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      <div className="md:col-span-2 space-y-6">
        <Card>
          {isEditing ? (
            <form onSubmit={handleUpdate}>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-xl flex items-center gap-2"><Edit size={20} /> Chỉnh sửa thông tin kèo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label>Môn thể thao</Label>
                  <Input value={editForm.sport} onChange={e => setEditForm({...editForm, sport: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Địa điểm (Tên sân, Quận)</Label>
                  <Input value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Thời gian thi đấu (Ngày & Giờ)</Label>
                    <Input type="datetime-local" value={editForm.time} onChange={e => setEditForm({...editForm, time: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Số người thiếu</Label>
                    <Input type="number" min="1" value={editForm.playersNeeded} onChange={e => setEditForm({...editForm, playersNeeded: parseInt(e.target.value)})} required />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-4">
                <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>Hủy</Button>
                <Button type="submit" disabled={savingSync}><Save size={16} className="mr-2" /> Lưu thay đổi</Button>
              </CardFooter>
            </form>
          ) : (
            <>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl text-primary mb-2">{match.sport}</CardTitle>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1"><MapPin size={18} /> {match.location}</div>
                      <div className="flex items-center gap-1"><Clock size={18} /> {new Date(match.time).toLocaleString('vi-VN')}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className="text-lg py-1 px-3 bg-green-50 text-green-700 dark:bg-green-900 border-green-200">
                      {match.status}
                    </Badge>
                    {isHost && (
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                          <Edit size={14} className="mr-1" /> Sửa
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 size={14} className="mr-1" /> Xóa
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure you want to delete this match?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your match and remove the data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Yes, delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg flex items-center justify-between border">
               <div className="flex items-center gap-4">
                 <Users className="text-primary h-8 w-8" />
                 <div>
                   <p className="font-semibold text-lg">Cần tìm: {match.playersNeeded} người</p>
                   <p className="text-muted-foreground">Đã có {match.joinedPlayers.length} người tham gia</p>
                 </div>
               </div>
               {!isHost && !hasJoined && match.status === 'Open' && (
                 <Button onClick={handleJoin} disabled={joining} size="lg">
                   {joining ? 'Đang xử lý...' : <><UserPlus className="mr-2 h-5 w-5"/> Tham gia</>}
                 </Button>
               )}
               {hasJoined && <Badge className="bg-green-600"><CheckCircle className="mr-1 h-3 w-3"/> Đã tham gia</Badge>}
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">Danh sách thành viên:</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarFallback className="bg-primary/20 text-primary font-bold">{match.hostInfo.displayName.substring(0,2).toUpperCase()}</AvatarFallback></Avatar>
                    <div>
                      <p className="font-medium flex items-center gap-2">{match.hostInfo.displayName} <Badge variant="secondary" className="text-[10px] h-5">Chủ phòng</Badge></p>
                      <div className="flex items-center gap-1 mt-1">
                        <StarRating rating={match.hostInfo.averageRating} readOnly size={14} />
                      </div>
                    </div>
                  </div>
                  {user && user.id !== match.hostId && hasJoined && (
                    <Button variant="outline" size="sm" onClick={() => setTargetUserId(match.hostId)}>
                      Đánh giá uy tín
                    </Button>
                  )}
                </div>

                {match.joinedPlayers.map((p: any) => (
                  <div key={p._id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                    <div className="flex items-center gap-3">
                      <Avatar><AvatarFallback className="bg-slate-200 text-slate-700 font-bold">{p.displayName?.substring(0,2).toUpperCase() || 'U'}</AvatarFallback></Avatar>
                      <div>
                        <Link to={`/profile/${p._id}`} className="font-medium hover:text-primary hover:underline">{p.displayName || 'Người dùng ẩn'}</Link>
                        <p className="text-xs text-muted-foreground">{p.skillLevel} • Đánh giá: {p.averageRating ? p.averageRating.toFixed(1) : 0}⭐</p>
                      </div>
                    </div>
                    {user && user.id !== p._id && (isHost || hasJoined) && (
                      <Button variant="outline" size="sm" onClick={() => setTargetUserId(p._id)}>
                        Đánh giá uy tín
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          </>
        )}
        </Card>
      </div>

      <div>
        {targetUserId && (
          <Card className="sticky top-20 border-primary shadow-md">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">Đánh Giá Sau Trận</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex flex-col items-center justify-center space-y-2 my-2">
                <span className="font-medium">Chấm điểm thái độ & kỹ năng:</span>
                <StarRating size={32} rating={rating} onRatingChange={setRating} />
              </div>
              <Textarea 
                placeholder="Nhận xét văn minh: tới đúng giờ không, đá có fairplay không?..." 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                className="resize-none h-24"
              />
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setTargetUserId(null)}>Hủy</Button>
              <Button className="flex-1" onClick={submitReview} disabled={submittingReview}>Gửi Đánh Giá</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
