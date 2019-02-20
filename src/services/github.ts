import Octokit from '@octokit/rest';

import { Comment, Notification } from '../types';

class GitHubApi {
  private octokit: Octokit;

  constructor(apiToken?: string) {
    // TODO: Initialization without token
    this.octokit = new Octokit({
      auth: `token ${apiToken}`,
    });
  }

  public async getUnreadNotifications(): Promise<Notification[]> {
    const notifications = await this.octokit.activity.listNotifications({ per_page: 100 });
    return notifications.data;
  }

  public async markNotificationAsRead(threadId: string): Promise<{}> {
    const response = await this.octokit.activity.markThreadAsRead({ thread_id: Number(threadId) });
    return response.data;
  }

  public async loadComments(owner: string, repo: string, issue: number, since?: string): Promise<Comment[]> {
    const params: Octokit.IssuesListCommentsParams = {
      owner, repo, number: issue,
    };
    if (since) {
      params.since = since;
    }
    const comments = await this.octokit.issues.listComments(params);
    // TODO: load only most recent comment if no comment has been returned
    return comments.data;
  }

  public get api() {
    return this.octokit;
  }
}

export { GitHubApi };