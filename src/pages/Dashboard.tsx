import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Match } from '../types';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/StarRating';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MapPin, Clock, Trophy, Users, Filter } from 'lucide-react';

export default function Dashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ sport: '', location: '', date: '', playersNeeded: '', skillLevel: 'All' });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.sport) queryParams.append('sport', filters.sport);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.date) queryParams.append('date', filters.date);
      if (filters.playersNeeded) queryParams.append('playersNeeded', filters.playersNeeded);
      if (filters.skillLevel && filters.skillLevel !== 'All') queryParams.append('skillLevel', filters.skillLevel);
      
      const res = await fetch(`/api/matches?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMatches();
  };

  return (
    <div className="space-y-8">
      <div className="bg-card p-6 rounded-xl border shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Tìm Kèo Mới</h2>
          <Button variant="ghost" type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm">
            <Filter className="mr-2 h-4 w-4" />
            {showAdvanced ? 'Ẩn bộ lọc phụ' : 'Bộ lọc chi tiết'}
          </Button>
        </div>
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-muted-foreground">Môn thể thao</Label>
              <Input 
                placeholder="VD: Cầu lông, Bóng đá..." 
                value={filters.sport} 
                onChange={e => setFilters({...filters, sport: e.target.value})} 
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-muted-foreground">Khu vực / Địa điểm</Label>
              <Input 
                placeholder="VD: Quận 7, Tân Bình..." 
                value={filters.location} 
                onChange={e => setFilters({...filters, location: e.target.value})} 
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full sm:w-auto">Tìm Kiếm</Button>
            </div>
          </div>
          
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t mt-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Ngày thi đấu</Label>
                <Input 
                  type="date"
                  value={filters.date} 
                  onChange={e => setFilters({...filters, date: e.target.value})} 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Cần ít nhất (số người)</Label>
                <Input 
                  type="number"
                  min="1"
                  placeholder="VD: 2"
                  value={filters.playersNeeded} 
                  onChange={e => setFilters({...filters, playersNeeded: e.target.value})} 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Trình độ chủ phòng</Label>
                <Select value={filters.skillLevel} onValueChange={(v) => setFilters({...filters, skillLevel: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả trình độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Tất cả trình độ</SelectItem>
                    <SelectItem value="Beginner">Mới bắt đầu (Phong trào)</SelectItem>
                    <SelectItem value="Intermediate">Trung bình (Khá)</SelectItem>
                    <SelectItem value="Advanced">Nâng cao (Bán chuyên)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </form>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Các kèo đang mở</h3>
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
              </Card>
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
            Không tìm thấy kèo nào phù hợp. Bấm <Link to="/create-match" className="text-primary hover:underline">tạo kèo mới</Link> ngay!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map(match => (
              <Card key={match._id} className="flex flex-col hover:border-primary/50 transition-colors">
                <CardHeader className="flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl truncate text-primary">{match.sport}</CardTitle>
                  <Badge variant="outline" className="ml-2 shrink-0 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200">Đang nhận</Badge>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="flex items-start gap-3">
                    <AvatarFallback className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                      {match.hostInfo.displayName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                    <div>
                      <p className="font-medium leading-none">{match.hostInfo.displayName}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <StarRating rating={match.hostInfo.averageRating} readOnly size={14} className="gap-0.5" />
                        <span className="text-xs text-muted-foreground">({match.hostInfo.totalReviews})</span>
                        <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">{match.hostInfo.skillLevel || 'Beginner'}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2"><MapPin size={16} /> {match.location}</div>
                    <div className="flex items-center gap-2"><Clock size={16} /> {new Date(match.time).toLocaleString('vi-VN')}</div>
                    <div className="flex items-center gap-2"><Users size={16} /> Cần {match.playersNeeded} người (Đã join: {match.joinedPlayers.length})</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/matches/${match._id}`} className={buttonVariants({ className: "w-full" })}>
                    Xem chi tiết
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AvatarFallback({ children, className }: any) {
  return <div className={className}>{children}</div>;
}
