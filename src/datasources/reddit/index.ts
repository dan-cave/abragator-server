/* eslint-disable import/prefer-default-export */
import { DataSource } from 'apollo-datasource';
import Snoowrap from 'snoowrap';

class RedditAPI extends DataSource {
  reddit: Snoowrap;

  constructor() {
    super();
    this.reddit = new Snoowrap({
      userAgent: <string> process.env.REDDIT_USER_AGENT,
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      refreshToken: process.env.REDDIT_REFRESH_TOKEN,
    });
  }

  getMe(): Snoowrap.RedditUser {
    return this.reddit.getMe();
  }

  getUser(userName: string): Snoowrap.RedditUser {
    return this.reddit.getUser(userName);
  }

  getPost(postId: string): Promise<Snoowrap.Submission> {
    const post = this.reddit.getSubmission(postId).fetch();
    return post;
  }

  getMoreReplies(parent: string): Promise<Snoowrap.Comment> {
    return this.reddit.getComment(parent).expandReplies({ limit: 10, depth: 10 });
  }

  getSubreddit(subreddit: string): Snoowrap.Subreddit {
    return this.reddit.getSubreddit(subreddit);
  }

  async getFrontpage() {
    const frontpage = await this.reddit.getHot();
    return frontpage.toJSON();
  }

  createLinkPost({ subreddit, url }: {subreddit: string, url: string}) {
    return this.reddit.getSubreddit(subreddit).submitLink({ url, resubmit: false });
  }

  createSelfPost({ subreddit, title, text }: {subreddit: string, title: string, text: string}) {
    return this.reddit.getSubreddit(subreddit)
      .submitSelfPost({ title, text, subredditName: subreddit });
  }

  replyToPost({ parent, text }: { parent: string, text: string }) {
    return this.reddit.getSubmission(parent).reply(text);
  }

  upvote({ post }: { post: string }) {
    return this.reddit.getSubmission(post).upvote();
  }

  downvote({ post }: { post: string }) {
    return this.reddit.getSubmission(post).downvote();
  }

  hide({ post }: { post: string }) {
    return this.reddit.getSubmission(post).hide();
  }

  unhide({ post }: { post: string }) {
    return this.reddit.getSubmission(post).unhide();
  }
}

export default RedditAPI;
