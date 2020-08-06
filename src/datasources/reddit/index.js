/* eslint-disable import/prefer-default-export */
import { DataSource } from 'apollo-datasource';
import Snoowrap from 'snoowrap';

class RedditAPI extends DataSource {
  constructor() {
    super();
    this.initialize();
  }

  async initialize() {
    this.reddit = new Snoowrap({
      userAgent: process.env.REDDIT_USER_AGENT,
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      refreshToken: process.env.REDDIT_REFRESH_TOKEN,
    });
    // if (context.user.redditCode) {
    //   this.reddit = await Snoowrap.fromAuthCode({
    //     userAgent: process.env.REDDIT_USER_AGENT,
    //     clientId: process.env.REDDIT_CLIENT_ID,
    //     clientSecret: process.env.REDDIT_CLIENT_SECRET,
    //     code: context.user.redditCode,
    //     redirectUri: process.env.REDDIT_REDIRECT_URI
    //   });
    // }
  }

  async getMe() {
    return this.reddit.getMe();
  }

  async getUser(userName) {
    return this.reddit.getUser(userName);
  }

  async getPost(postId) {
    const post = await this.reddit.getSubmission(postId).fetch();
    return post;
  }

  async getMoreReplies(parent) {
    return this.reddit.getComment(parent).expandReplies({ limit: 10, depth: 10 });
  }

  async getSubreddit(subreddit) {
    return this.reddit.getSubreddit(subreddit);
  }

  async getFrontpage() {
    const frontpage = await this.reddit.getHot();
    return frontpage.toJSON();
  }

  async createLinkPost({ subreddit, title, url }) {
    return this.reddit.getSubreddit(subreddit).submitLink({ title, url });
  }

  async createSelfPost({ subreddit, title, text }) {
    return this.reddit.getSubreddit(subreddit).submitSelfPost({ title, text });
  }

  async replyToPost({ parent, text }) {
    return this.reddit.getSubmission(parent).reply(text);
  }

  async upvote({ post }) {
    return this.reddit.getSubmission(post).upvote();
  }

  async downvote({ post }) {
    return this.reddit.getSubmission(post).downvote();
  }

  async hide({ post }) {
    return this.reddit.getSubmission(post).hide();
  }

  async unhide({ post }) {
    return this.reddit.getSubmission(post).unhide();
  }
}

export default RedditAPI;
