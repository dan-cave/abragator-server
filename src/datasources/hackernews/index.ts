import { DataSource } from 'apollo-datasource';
import fetch from 'isomorphic-fetch';

class HackerNewsAPI extends DataSource {
  readonly ITEM_URL: string =
  'https://hacker-news.firebaseio.com/v0/item/ITEM_ID.json';

  readonly TOP_STORIES_URL: string =
  'https://hacker-news.firebaseio.com/v0/topstories.json';

  readonly BEST_STORIES_URL: string =
  'https://hacker-news.firebaseio.com/v0/beststories.json';

  readonly NEW_STORIES_URL: string =
  'https://hacker-news.firebaseio.com/v0/newstories.json';

  readonly ASK_STORIES_URL: string =
  'https://hacker-news.firebaseio.com/v0/askstories.json';

  readonly SHOW_STORIES_URL: string =
  'https://hacker-news.firebaseio.com/v0/showstories.json';

  readonly JOB_STORIES_URL: string =
  'https://hacker-news.firebaseio.com/v0/jobstories.json';

  readonly USER_URL: string =
  'https://hacker-news.firebaseio.com/v0/user/USER_ID.json';

  readonly defaultNumberOfStories: number = 10;

  getItemUrl(itemId: string) {
    return this.ITEM_URL.replace('ITEM_ID', itemId);
  }

  getUserUrl(userId: string) {
    return this.USER_URL.replace('USER_ID', userId);
  }

  static async fetchJSON(URL: string): Promise<any> {
    const res = await fetch(URL);
    return res.json();
  }

  fetchItem(itemId: string) {
    return HackerNewsAPI.fetchJSON(this.getItemUrl(itemId));
  }

  fetchItems(itemIds: string[]): Promise<any> {
    return Promise.all(itemIds.map((itemId) => this.fetchItem(itemId)));
  }

  async fetchStories(storiesURL: string, numberOfStories = this.defaultNumberOfStories) {
    const res = await HackerNewsAPI.fetchJSON(storiesURL);
    return this.fetchItems(res.slice(0, numberOfStories));
  }

  fetchTopStories(numberOfStories: number) {
    return this.fetchStories(this.TOP_STORIES_URL, numberOfStories);
  }

  fetchNewStories(numberOfStories: number) {
    return this.fetchStories(this.NEW_STORIES_URL, numberOfStories);
  }

  fetchBestStories(numberOfStories: number) {
    return this.fetchStories(this.BEST_STORIES_URL, numberOfStories);
  }

  fetchAskStories(numberOfStories: number) {
    return this.fetchStories(this.ASK_STORIES_URL, numberOfStories);
  }

  fetchShowStories(numberOfStories: number) {
    return this.fetchStories(this.SHOW_STORIES_URL, numberOfStories);
  }

  fetchUser(userId: string) {
    return HackerNewsAPI.fetchJSON(this.getUserUrl(userId));
  }
}

export default HackerNewsAPI;
