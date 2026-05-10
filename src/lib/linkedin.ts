export interface LinkedInPost {
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
  videos?: Array<{
    url: string;
    thumbnail?: string;
  }>;
}

export interface LinkedInUserPostsResponse {
  posts: LinkedInPost[];
  totalCount: number;
  hasMore: boolean;
  nextPage?: number;
}

export async function fetchLinkedInUserPosts(
  urn: string,
  page: number = 1
): Promise<LinkedInUserPostsResponse> {
  const params = new URLSearchParams({
    urn: urn,
    page: page.toString()
  });

  const response = await fetch(`/api/linkedin?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch LinkedIn user posts');
  }

  return response.json();
}

export async function getAllLinkedInUserPosts(urn: string): Promise<LinkedInPost[]> {
  let allPosts: LinkedInPost[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const response = await fetchLinkedInUserPosts(urn, page);
      allPosts = [...allPosts, ...response.posts];
      hasMore = response.hasMore;
      page++;
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      break;
    }
  }

  return allPosts;
}