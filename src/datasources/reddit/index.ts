/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { DataSource } from 'apollo-datasource';
import Snoowrap from 'snoowrap';
import { Timespan } from 'snoowrap/dist/objects/Subreddit';

class RedditAPI extends DataSource {
  reddit: Snoowrap;

  constructor() {
    super();
    // this.reddit = new Snoowrap({
    //   userAgent: <string> process.env.REDDIT_USER_AGENT,
    //   clientId: process.env.REDDIT_CLIENT_ID,
    //   clientSecret: process.env.REDDIT_CLIENT_SECRET,
    //   refreshToken: process.env.REDDIT_REFRESH_TOKEN,
    // });
    this.reddit = new Snoowrap({
      userAgent: 'DO NOT TRACK',
      clientId: 'GNaNMnqvW8_MMQ',
      clientSecret: 'o0Hh7qMhDfWPmqu1TBuO1TbJReU',
      refreshToken: '8709747214-_O89TgZrMdY5wsuY8BwmapCg5no',
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

  async getWiki(subreddit: Snoowrap.Subreddit) {
    const pages = await subreddit.getWikiPages();
    return pages;
  }

  getMoreReplies(parent: string): Promise<Snoowrap.Comment> {
    return this.reddit.getComment(parent).expandReplies({ limit: 10, depth: 10 });
  }

  getSubreddit(subreddit: string): Snoowrap.Subreddit {
    return this.reddit.getSubreddit(subreddit);
  }

  async getListing(subreddit: Snoowrap.Subreddit, ranking: string,
    time: string, limit: number,
    count: number, after: string, before: string):
    Promise<Snoowrap.Listing<Snoowrap.Submission>> {
    if (subreddit) {
      let listing: Snoowrap.Listing<Snoowrap.Submission>;

      switch (ranking) {
        case 'top':
          listing = await subreddit.getTop({
            time: time as Timespan, limit, count, after, before,
          });
          break;
        case 'new':
          listing = await subreddit.getNew({
            limit, count, after, before,
          });
          break;
        case 'controversial':
          listing = await subreddit.getControversial({
            time: time as Timespan, limit, count, after, before,
          });
          break;
        default:
          listing = await subreddit.getHot({
            limit, count, after, before,
          });
      }
      return listing;
    }
    return null;
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
