export default {
  Query: {
    getSubreddit: async (_, { subOrigin }, { dataSources }) => {
      const subreddit = await dataSources.redditAPI.getSubreddit(subOrigin);
      return { subreddit };
    },
    getFrontpage: async (_, __, { dataSources }) => {
      const frontpage = dataSources.redditAPI.getFrontpage();
      return frontpage;
    },
    getUser: async (_, { userId }, { dataSources }) => {
      const user = userId
        ? await dataSources.redditAPI.getMe()
        : await dataSources.redditAPI.getUser(userId);
      return { user };
    },
    getPost: async (_, { postId }, { dataSources }) => {
      const post = await dataSources.redditAPI.getPost(postId);
      return post;
    },
  },
  Mutation: {
    upvote: async (_, { postId }, { dataSources }) => {
      const upPost = await dataSources.redditAPI.upvote({ postId });
      return { upPost };
    },
    downvote: async (_, { postId }, { dataSources }) => {
      const downPost = await dataSources.redditAPI.downvote({ postId });
      return { downPost };
    },
    submitSelfPost: async (_, { subreddit, title, text }, { dataSources }) => {
      const selfPost = await dataSources.redditAPI.createSelfPost({ subreddit, title, text });
      return { selfPost };
    },
    submitLinkPost: async (_, { subreddit, title, url }, { dataSources }) => {
      const linkPost = await dataSources.redditAPI.createLinkPost({ subreddit, title, url });
      return { linkPost };
    },
    submitComment: async (_, { parent, text }, { dataSources }) => {
      const commentPost = await dataSources.redditAPI.replyToPost({ parent, text });
      return { commentPost };
    },
    hidePost: async (_, { postId }, { dataSources }) => {
      const hiddenPost = await dataSources.redditAPI.hide({ postId });
      return { hiddenPost };
    },
    unhidePost: async (_, { postId }, { dataSources }) => {
      const unhiddenPost = await dataSources.redditAPI.unhide({ postId });
      return { unhiddenPost };
    },
  },
  User: {
    id: (user) => user.id,
    name: (user) => user.name,
    creationDate: (user) => user.created_utc,
    commentKarma: (user) => user.comment_karma,
    postKarma: (user) => user.link_karma,
    isFriend: (user) => user.is_friend,
    posts: async (user, {
      sortType, time, limit, count, after,
    }) => {
      const posts = await user.getSubmissions({
        sort: sortType, t: time, after, count, limit,
      });
      return posts;
    },
    source: () => 'REDDIT',
  },
  SubOrigin: {
    id: ({ subreddit }) => subreddit.id,
    name: ({ subreddit }) => subreddit.name,
    isNSFW: ({ subreddit }) => subreddit.over18,
    description: ({ subreddit }) => subreddit.description_html,
    recommendedSubs: async ({ subreddit }) => (await subreddit.getRecommendedSubreddits()) || [],
    posts: async ({ subreddit }, {
      sortType, time, limit, count, after,
    }) => {
      let posts;
      switch (sortType) {
        case 'CONTROVERSIAL':
          posts = await subreddit.getControversial({
            t: time, after, limit, count,
          });
          break;
        case 'TOP':
          posts = await subreddit.getTop({
            t: time, after, limit, count,
          });
          break;
        case 'NEW':
          posts = await subreddit.getNew({ after, limit, count });
          break;
        case 'RISING':
          posts = await subreddit.getRising({ after, limit, count });
          break;
        default:
          posts = await subreddit.getHot({ after, limit, count });
          break;
      }
      return posts;
    },
    // eslint-disable-next-line max-len
    mods: async ({ subreddit }, { limit, count, after }) => (await subreddit.getModerators({ limit, count, after })) || [],
    wiki: async ({ subreddit }) => (await subreddit.getWikiPages()) || [],
    bannerImage: ({ subreddit }) => subreddit.banner_img,
    bannerBackgroundColor: ({ subreddit }) => subreddit.banner_background_color,
    primaryColor: ({ subreddit }) => subreddit.primary_color,
    keyColor: ({ subreddit }) => subreddit.key_color,
  },
  Post: {
    id: (post) => post.id,
    title: (post) => post.title,
    author: async (post) => {
      const author = await post.author.fetch();
      return author;
    },
    upvotes: (post) => post.ups,
    downvotes: (post) => post.downs,
    postType: (post) => {
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
    mediaType: (post) => {
      if (post.secure_media || post.media) {
        return 'VIDEO';
      }
      if (post.domain === 'i.redd.it' || post.domain === 'i.imgur.com') {
        return 'IMAGE';
      }
      return '';
    },
    isNSFW: (post) => post.over_18,
    mediaURL: (post) => post.url,
    postURL: (post) => post.url,
    sticky: (post) => post.stickied,
    // saved: ({ post }, _, { context }) => {
    //   TODO: FIND POST BY ID FOR CONTEXT.USER
    // },
    // cached: ({ post }, _, { context }) => {
    //  TODO: FIND CACHED POST BY SESSION DATA
    // },
    hidden: (post) => post.hidden,
    // clicked: ({ post }, _, { context }) => {
    //   TODO: FIND POST BY ID FOR CONTEXT.USER
    // },
    archived: (post) => post.archived,
    quarantine: (post) => post.quarantine,
    duplicates: async (post, { limit, count, after }) => {
      const posts = await post.getDuplicates({ limit, count, after });
      return posts;
    },
    children: async (post, {
      sortType, limit, count, after,
    }) => {
      const comments = await post.comments.fetchMore({
        sort: sortType, limit, count, after,
      });
      return comments;
    },
    silver: (post) => post.gildings.gid_1,
    gold: (post) => post.gildings.gid_2,
    platinum: (post) => post.gildings.gid_3,
    text: (post) => `${post.link_flair_text} | ${post.author_flair_text}`,
    modNote: (post) => post.mod_note,
    modPost: (post) => post.author.is_mod,
    adminPost: (post) => post.author.is_employee,
  },
};
