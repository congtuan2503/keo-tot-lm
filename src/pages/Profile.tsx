import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { User, Review } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/StarRating';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Target, Quote } from 'lucide-react';

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileRes, reviewsRes] = await Promise.all([
          fetch(`/api/users/${id}`),
          fetch(`/api/reviews/target/${id}`)
        ]);
        
        const profileData = await profileRes.json();
        const reviewsData = await reviewsRes.json();
        
        if (profileData.success) setProfile(profileData.user);
        if (reviewsData.success) setReviews(reviewsData.reviews);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchProfileData();
  }, [id]);

  if (loading) return <div className="space-y-6 max-w-4xl mx-auto"><Skeleton className="h-64 w-full" /></div>;
  if (!profile) return <div className="text-center py-12">Không tìm thấy người dùng</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="h-32 bg-gradient-to-r from-primary/80 to-primary w-full"></div>
        <CardContent className="relative pt-0 sm:pt-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-12 mb-6">
            <Avatar className="w-32 h-32 border-4 border-background shadow-sm">
              <AvatarFallback className="text-4xl bg-slate-100 text-slate-800 font-bold">{profile.displayName.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1 pb-2">
              <h1 className="text-3xl font-extrabold">{profile.displayName}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1"><MapPin size={16}/> {profile.preferredArea || 'Chưa cập nhật'}</div>
                <div className="flex items-center gap-1"><Target size={16}/> {profile.skillLevel}</div>
              </div>
            </div>
            
            <div className="bg-card border rounded-xl p-4 flex flex-col items-center shadow-sm w-40">
              <div className="text-3xl font-black text-yellow-500 mb-1">{profile.averageRating > 0 ? profile.averageRating.toFixed(1) : '-'}</div>
              <StarRating rating={profile.averageRating} readOnly size={16} />
              <div className="text-xs text-muted-foreground mt-2">{profile.totalReviews} lượt đánh giá</div>
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-lg">Môn thể thao yêu thích:</h3>
            <div className="flex flex-wrap gap-2">
              {profile.favoriteSports.map(s => (
                <Badge key={s} variant="secondary" className="text-sm py-1 px-3">{s}</Badge>
              ))}
              {profile.favoriteSports.length === 0 && <span className="text-muted-foreground italic">Chưa có thông tin</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Lịch Sử Đánh Giá Uy Tín</h2>
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-dashed text-muted-foreground">
            Chưa có đánh giá nào cho người chơi này.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map(review => (
              <Card key={review._id} className="bg-slate-50/50 dark:bg-slate-900/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-sm flex items-center gap-2">
                      <span className="text-primary">{(review.reviewerId as any).displayName}</span> 
                      <span className="text-muted-foreground font-normal text-xs">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <StarRating rating={review.rating} readOnly size={14} />
                  </div>
                  {review.comment && (
                    <div className="bg-background p-3 rounded-lg text-sm flex items-start gap-2 border">
                      <Quote className="text-muted-foreground shrink-0 h-4 w-4 mt-0.5" />
                      <p className="italic">{review.comment}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
