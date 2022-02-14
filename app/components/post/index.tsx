import { useMemo } from 'react';
import ImageGalleryPost from './gallery.js';
import ImagePost from './image.js';
import LinkPost from './link.js';
import TextPost from './text.js';
import VideoPost from './video.js';
import PostWrapper from './wrapper.js';

export default function Post({ post, expanded }) {
  const type = useMemo(() => {
    // handle cross-posts
    const actualPost = post.crosspost_parent_list?.[0] ?? post;

    // detect type
    if (actualPost.post_hint === 'self' || actualPost.is_self) {
      return 'text';
    }
    if (actualPost.post_hint === 'image') {
      return 'image';
    }
    if (
      actualPost.post_hint?.includes?.('video') ||
      actualPost.media?.reddit_video !== undefined
    ) {
      return 'video';
    }
    if (actualPost.gallery_data?.items?.length > 0) {
      return 'gallery';
    }
    if (actualPost.post_hint === 'link') {
      // handle links to youtube as video posts
      if (actualPost?.url_overridden_by_dest.includes('youtube.com')) {
        return 'video';
      }
      if (actualPost?.url_overridden_by_dest.includes('gfycat.com')) {
        return 'video';
      }
      // otherwise - treat as link
      return 'link';
    }
    // TODO: handle poll
    // if (post.is_poll) {
    // return 'poll';
    // }
    return 'link';
  }, [post]);

  return (
    <PostWrapper post={post} expanded={expanded}>
      {type === 'text' && <TextPost post={post} expanded={expanded} />}
      {type === 'image' && <ImagePost post={post} />}
      {type === 'gallery' && (
        <ImageGalleryPost post={post} expanded={expanded} />
      )}
      {type === 'video' && <VideoPost post={post} />}
      {type === 'link' && <LinkPost post={post} />}
    </PostWrapper>
  );
}
