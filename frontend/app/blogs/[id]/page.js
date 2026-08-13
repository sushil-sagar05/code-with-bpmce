'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { blogsAPI } from '@/lib/api';
import PageLoader from '@/components/ui/PageLoader';
import { ArrowLeft, Clock, User, Eye, Heart, Calendar, Tag, Share2, PenTool, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { useAuth } from '@/context/AuthContext';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    if (params?.id) {
      setLoading(true);
      blogsAPI.getById(params.id)
        .then(({ data }) => {
          const article = data.data;
          if (article) {
            setBlog(article);
            const likesArr = Array.isArray(article.likes) ? article.likes : [];
            setLikesCount(likesArr.length);
            if (user && likesArr.some(id => (id._id || id).toString() === (user._id || user.id).toString())) {
              setLiked(true);
            }
          } else {
            setBlog(null);
          }
        })
        .catch(() => {
          setBlog(null);
        })
        .finally(() => setLoading(false));
    }
  }, [params?.id, user]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like this article!');
      router.push('/login');
      return;
    }
    if (liking) return;

    // Optimistic UI Update
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!prevLiked);
    setLikesCount(prev => (prevLiked ? prev - 1 : prev + 1));
    setLiking(true);

    try {
      const { data } = await blogsAPI.like(params.id);
      if (data.success) {
        setLikesCount(data.likes);
        if (!prevLiked) {
          toast.success('Liked blog post! ❤️');
        }
      } else {
        // Rollback
        setLiked(prevLiked);
        setLikesCount(prevCount);
      }
    } catch (err) {
      // Rollback
      setLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error('Failed to update like. Please try again.');
    } finally {
      setLiking(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: blog?.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard! 📋');
    }
  };

  if (loading) {
    return <PageLoader text="Fetching blog article..." />;
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16 grid-bg">
        <div className="container-custom max-w-3xl mx-auto text-center py-20">
          <PenTool className="w-12 h-12 text-[#444] mx-auto mb-3" />
          <h2 className="text-white font-dosis font-bold text-xl mb-2">Blog Article Not Found</h2>
          <p className="text-[#666] font-dosis text-sm mb-6">This blog article may have been removed or deleted.</p>
          <button onClick={() => router.push('/blogs')} className="btn-primary text-xs py-2.5 px-6">
            Browse All Blogs
          </button>
        </div>
      </div>
    );
  }

  const tagsList = Array.isArray(blog.tags) ? blog.tags : (blog.tags ? blog.tags.split(',') : []);

  const jsonLdBlog = blog
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blog.title,
        description: blog.excerpt || blog.content?.slice(0, 150),
        image: blog.coverImage || 'https://www.devbuddies.in/icon.svg',
        author: {
          '@type': 'Person',
          name: blog.author?.name || 'DevBuddies Contributor',
        },
        publisher: {
          '@type': 'Organization',
          name: 'DevBuddies',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.devbuddies.in/icon.svg',
          },
        },
        datePublished: blog.createdAt || new Date().toISOString(),
        dateModified: blog.updatedAt || blog.createdAt || new Date().toISOString(),
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://www.devbuddies.in/blogs/${blog.slug || blog._id}`,
        },
      }
    : null;

  const jsonLdBreadcrumb = blog
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.devbuddies.in' },
          { '@type': 'ListItem', position: 2, name: 'Blogs', item: 'https://www.devbuddies.in/blogs' },
          { '@type': 'ListItem', position: 3, name: blog.title, item: `https://www.devbuddies.in/blogs/${blog.slug || blog._id}` },
        ],
      }
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 grid-bg">
      {jsonLdBlog && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBlog) }}
        />
      )}
      {jsonLdBreadcrumb && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
        />
      )}
      <div className="container-custom max-w-4xl mx-auto space-y-6">
        
        {/* Navigation & Header Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 font-dosis font-semibold text-sm text-[#888] hover:text-white transition-colors bg-[#111] border border-[#1f1f1f] px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6B00]" /> Back
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 font-mono text-xs text-[#aaa] hover:text-white bg-[#111] border border-[#1f1f1f] px-3.5 py-2 rounded-xl transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-[#FF6B00]" /> Share Post
          </button>
        </div>

        {/* Article Card */}
        <article className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 sm:p-10 space-y-6 shadow-2xl">
          
          {/* Header Metadata */}
          <div className="space-y-3">
            {blog.category && (
              <span className="font-mono text-xs text-green-400 bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-md uppercase tracking-wider font-semibold">
                {blog.category}
              </span>
            )}
            
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight pt-1">
              {blog.title}
            </h1>

            {/* Author & Info bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#888] pt-2 border-b border-[#1f1f1f] pb-5">
              {blog.author && (
                <div className="flex items-center gap-2 text-white font-dosis font-bold">
                  {blog.author.avatar ? (
                    <img src={blog.author.avatar} alt={blog.author.name || blog.author} className="w-7 h-7 rounded-full object-cover border border-[#FF6B00]/30" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] flex items-center justify-center font-bold">
                      {(blog.author.name || blog.author)?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span>{blog.author.name || blog.author}</span>
                </div>
              )}

              {blog.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#555]" />
                  <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              )}

              {blog.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#555]" />
                  <span>{blog.readTime} min read</span>
                </div>
              )}

              <div className="flex items-center gap-1 ml-auto">
                <Eye className="w-3.5 h-3.5 text-[#555]" />
                <span>{blog.views || 1} views</span>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {blog.coverImage && (
            <div className="rounded-xl overflow-hidden border border-[#1f1f1f] bg-[#0d0d0d]">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full max-h-[450px] object-cover"
              />
            </div>
          )}

          {/* Excerpt Summary */}
          {blog.excerpt && (
            <div className="border-l-4 border-[#FF6B00] bg-[#0d0d0d] p-4 rounded-r-xl text-[#aaa] font-dosis text-base italic leading-relaxed">
              "{blog.excerpt}"
            </div>
          )}

          {/* Article Content */}
          <div className="text-[#ddd] font-mono text-sm sm:text-base leading-relaxed whitespace-pre-line bg-[#0d0d0d] p-6 sm:p-8 rounded-xl border border-[#1f1f1f]">
            {blog.content}
          </div>

          {/* Tags List */}
          {tagsList.length > 0 && (
            <div className="pt-2">
              <h4 className="text-[#666] font-mono text-xs uppercase mb-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#FF6B00]" /> Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {tagsList.map((tag, idx) => (
                  <span key={idx} className="bg-[#1a1a1a] text-[#888] font-mono text-xs px-3 py-1 rounded-md border border-[#2a2a2a]">
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Article Action Footer (Like Button) */}
          <div className="pt-6 border-t border-[#1f1f1f] flex items-center justify-between">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-dosis font-bold text-sm border transition-all ${
                liked
                  ? 'bg-red-500/20 border-red-500/40 text-red-400 shadow-lg shadow-red-950/30'
                  : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#FF6B00]/40'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-xs font-mono text-[#888] hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Share Article
            </button>
          </div>

        </article>
      </div>
    </div>
  );
}
