'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ThumbsUp, Share2, Clock, ExternalLink, User } from 'lucide-react';

interface LinkedInPost {
  id: string;
  urn: string;
  text: string;
  author: {
    id: string;
    name: string;
    headline?: string;
    url: string;
    avatar?: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
  created_at: string;
  reaction_counts: Array<{
    type: string;
    count: number;
  }>;
  comment_count: number;
  repost_count: number;
  images?: Array<{
    url: string;
    alt?: string;
  }>;
}

interface LinkedInPostsProps {
  userUrn: string;
  maxPosts?: number;
}

export default function LinkedInPosts({ 
  userUrn, 
  maxPosts = 5 
}: LinkedInPostsProps) {
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/linkedin?urn=${userUrn}&page=1`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch LinkedIn posts');
        }
        
        const data = await response.json();
        setPosts(data.data?.slice(0, maxPosts) || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userUrn, maxPosts]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTotalReactions = (reactions: Array<{type: string; count: number}>) => {
    return reactions.reduce((total, reaction) => total + reaction.count, 0);
  };

  const getAvatarUrl = (avatar?: Array<{url: string; width: number; height: number}>) => {
    if (!avatar || avatar.length === 0) return null;
    return avatar.sort((a, b) => a.width - b.width)[0]?.url;
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-4">LinkedIn gönderileri yüklenirken hata oluştu</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Henüz gönderi bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
        </svg>
        <h3 className="text-xl font-semibold text-white">LinkedIn Gönderileri</h3>
        <span className="text-sm text-gray-400">({posts.length})</span>
      </div>

      <div className="grid gap-6">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group"
          >
            <div className="flex gap-4">
              {getAvatarUrl(post.author.avatar) && (
                <img
                  src={getAvatarUrl(post.author.avatar)!}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
              )}
              {!getAvatarUrl(post.author.avatar) && (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <a
                      href={post.author.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-white hover:text-blue-400 transition-colors flex items-center gap-2 group/link"
                    >
                      {post.author.name}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                    {post.author.headline && (
                      <p className="text-sm text-gray-400 line-clamp-1">
                        {post.author.headline}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {formatDate(post.created_at)}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {truncateText(post.text)}
                  </p>
                </div>

                {post.images && post.images.length > 0 && (
                  <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2 rounded-lg overflow-hidden">
                    {post.images.slice(0, 4).map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={image.url}
                        alt={image.alt || `Post image ${imgIndex + 1}`}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <div className="flex items-center gap-6">
                    {getTotalReactions(post.reaction_counts) > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{getTotalReactions(post.reaction_counts)}</span>
                      </div>
                    )}
                    
                    {post.comment_count > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comment_count}</span>
                      </div>
                    )}
                    
                    {post.repost_count > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span>{post.repost_count}</span>
                      </div>
                    )}
                  </div>

                  <a
                    href={`https://www.linkedin.com/feed/update/${post.urn}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                  >
                    LinkedIn'de Gör
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}