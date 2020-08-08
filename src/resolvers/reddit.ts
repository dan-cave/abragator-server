import Snoowrap from 'snoowrap';
import { DataSources } from '../types';

export default {
  Query: {
    getSubreddit: (_: any, { subreddit }: { subreddit: string },
      { dataSources }: { dataSources: DataSources }) => {
      const sub = dataSources.redditAPI.getSubreddit(subreddit);
      return sub;
    },
    getFrontpage: async (_: any, __: any, { dataSources }: { dataSources: DataSources }) => {
      const frontpage = dataSources.redditAPI.getFrontpage();
      return frontpage;
    },
    getUser: async (_: any, { userId }: { userId: string },
      { dataSources }: { dataSources: DataSources }) => {
      const user = userId
        ? dataSources.redditAPI.getMe()
        : dataSources.redditAPI.getUser(userId);
      return { user };
    },
    getPost: async (_: any, { postId }: { postId: string },
      { dataSources }: { dataSources: DataSources }) => {
      const post = dataSources.redditAPI.getPost(postId);
      return { post };
    },
  },
  Mutation: {
    upvote: async (_: any, { post }: { post: string },
      { dataSources }: { dataSources: DataSources }) => {
      const upPost = dataSources.redditAPI.upvote({ post });
      return { upPost };
    },
    downvote: async (_: any, { post }: { post: string },
      { dataSources }: { dataSources: DataSources }) => {
      const downPost = dataSources.redditAPI.downvote({ post });
      return { downPost };
    },
    submitSelfPost: async (_: any,
      { subreddit, title, text }: { subreddit: string, title: string, text: string },
      { dataSources }: { dataSources: DataSources }) => {
      const selfPost = dataSources.redditAPI.createSelfPost({ subreddit, title, text });
      return { selfPost };
    },
    submitLinkPost: async (_: any,
      { subreddit, url }: { subreddit: string, url: string },
      { dataSources }: { dataSources: DataSources }) => {
      const linkPost = dataSources.redditAPI.createLinkPost({ subreddit, url });
      return { linkPost };
    },
    submitComment: async (_: any, { parent, text }: { parent: string, text: string },
      { dataSources }: { dataSources: DataSources }) => {
      const commentPost = dataSources.redditAPI.replyToPost({ parent, text });
      return { commentPost };
    },
    hidePost: async (_: any, { post }: { post: string },
      { dataSources }: { dataSources: DataSources }) => {
      const hiddenPost = dataSources.redditAPI.hide({ post });
      return { hiddenPost };
    },
    unhidePost: async (_: any, { post }: { post: string },
      { dataSources }: { dataSources: DataSources }) => {
      const unhiddenPost = dataSources.redditAPI.unhide({ post });
      return { unhiddenPost };
    },
  },
  User: {
    id: (user: Snoowrap.RedditUser) => user.id,
    name: (user: Snoowrap.RedditUser) => user.name,
    creationDate: (user: Snoowrap.RedditUser) => user.created_utc,
    commentKarma: (user: Snoowrap.RedditUser) => user.comment_karma,
    postKarma: (user: Snoowrap.RedditUser) => user.link_karma,
    isFriend: (user: Snoowrap.RedditUser) => user.is_friend,
    posts: async (user: Snoowrap.RedditUser, {
      sortType, time, limit, count, after,
    }: {sortType: string, time: string, limit: number, count: number, after: number}) => {
      const posts = await user.getSubmissions({
        sort: sortType, t: time, after, count, limit,
      });
      return posts;
    },
    source: () => 'REDDIT',
  },
  SubOrigin: {
    id: (subreddit:Snoowrap.Subreddit) => subreddit.id,
    name: (subreddit: Snoowrap.Subreddit) => subreddit.name,
    isNSFW: (subreddit: Snoowrap.Subreddit) => subreddit.over18,
    description: (subreddit: Snoowrap.Subreddit) => subreddit.description_html,
    // recommendedSubs: async ({ subreddit }: {subreddit: Snoowrap.Subreddit }) => (await
    // subreddit.getRecommendedSubreddits()) || [],
    posts: async (subreddit: Snoowrap.Subreddit, {
      ranking, time, limit, count, after, before,
    }: {ranking: string, limit: number, time: string,
      count: number, after: string, before: string },
      { dataSources }: { dataSources: DataSources }) => dataSources
      .redditAPI.getListing(subreddit, time, ranking, limit, count, after, before),
    // // eslint-disable-next-line max-len
    mods: async (subreddit: Snoowrap.Subreddit,
      { limit, count, after }:
      { limit: number, count:number, after: string }) => (await
    subreddit.getModerators({ limit, count, after })) || [],
    // TODO: GET WIKI WORKING
    // wiki: async (subreddit: Snoowrap.Subreddit, __: any,
    //   { dataSources }: { dataSources: DataSources }) => dataSources
    //   .redditAPI.getWiki(subreddit),
    bannerImage: (subreddit: Snoowrap.Subreddit) => subreddit.banner_img,
    bannerBackgroundColor: (subreddit: Snoowrap.Subreddit) => subreddit.banner_background_color,
    primaryColor: (subreddit: Snoowrap.Subreddit) => subreddit.primary_color,
    keyColor: (subreddit: Snoowrap.Subreddit) => subreddit.key_color,
  },
  Post: {
    id: (post: Snoowrap.Submission) => post.id,
    title: (post: Snoowrap.Submission) => post.title,
    author: (post: Snoowrap.Submission) => {
      const author = post.author.fetch();
      return author;
    },
    upvotes: (post: Snoowrap.Submission) => post.ups,
    downvotes: (post: Snoowrap.Submission) => post.downs,
    postType: (post: Snoowrap.Submission) => {
      const postType = post.name.substr(0, 2);
      switch (postType) {
        case 't1':
          return 'COMMENT';
        case 't3':
          if (post.url) return 'LINK';
          return 'SELF';
        case 't4':
          return 'MESSAGE';
        default:
          return 'LINK';
      }
    },
    mediaType: (post: Snoowrap.Submission) => {
      if (post.secure_media || post.media) {
        return 'VIDEO';
      }
      if (post.domain === 'i.redd.it' || post.domain === 'i.imgur.com') {
        return 'IMAGE';
      }
      return '';
    },
    isNSFW: (post: Snoowrap.Submission) => post.over_18,
    mediaURL: (post: Snoowrap.Submission) => post.url,
    postURL: (post: Snoowrap.Submission) => post.url,
    sticky: (post: Snoowrap.Submission) => post.stickied,
    // saved: ({ post }, _, { context }) => {
    //   TODO: FIND POST BY ID FOR CONTEXT.USER
    // },
    // cached: ({ post }, _, { context }) => {
    //  TODO: FIND CACHED POST BY SESSION DATA
    // },
    hidden: (post: Snoowrap.Submission) => post.hidden,
    // clicked: ({ post }, _, { context }) => {
    //   TODO: FIND POST BY ID FOR CONTEXT.USER
    // },
    archived: (post: Snoowrap.Submission) => post.archived,
    quarantine: (post: Snoowrap.Submission) => post.quarantine,
    duplicates: async (post: Snoowrap.Submission,
      { limit, count, after }: { limit: number, count: number, after: string }) => {
      const posts = await post.getDuplicates({ limit, count, after });
      return posts;
    },
    children: async (post: Snoowrap.Submission, { count }: { count: number }) => {
      const comments = await post.comments.fetchMore({ amount: count });
      return comments;
    },
    silver: (post: Snoowrap.Submission) => post.gildings.gid_1,
    gold: (post: Snoowrap.Submission) => post.gildings.gid_2,
    platinum: (post: Snoowrap.Submission) => post.gildings.gid_3,
    text: (post: Snoowrap.Submission) => `${post.link_flair_text} | ${post.author_flair_text}`,
    modNote: (post: Snoowrap.Submission) => post.mod_note,
    modPost: (post: Snoowrap.Submission) => post.author.is_mod,
    adminPost: (post: Snoowrap.Submission) => post.author.is_employee,
  },
};
