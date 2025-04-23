import type { UpdatePRCommentOptions } from './types.js';
import type { UVI } from './schemas.js';

export async function updatePRComment(options: UpdatePRCommentOptions): Promise<void> {
  const { octokit, owner, repo, pullNumber, uvis, header } = options;

  // Find existing comment
  const comments = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number: pullNumber
  });

  const existingComment = comments.data.find(
    (comment: { body?: string }) => comment.body?.startsWith(header)
  );

  // Format the comment body
  const body = formatComment(header, uvis);

  if (existingComment) {
    // Update existing comment
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existingComment.id,
      body
    });
  } else {
    // Create new comment
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: pullNumber,
      body
    });
  }
}

function formatComment(header: string, uvis: UVI[]): string {
  const timestamp = new Date().toISOString();
  
  if (uvis.length === 0) {
    return `${header}

No user-visible improvements were identified in this PR.

Last updated: ${timestamp}`;
  }

  const improvements = uvis
    .map((uvi, index) => {
      let text = `${index + 1}. ${uvi.description}`;
      if (uvi.impact) {
        text += ` (${uvi.impact})`;
      }
      return text;
    })
    .join('\n');

  return `${header}

This PR contains ${uvis.length} user-visible improvement${uvis.length === 1 ? '' : 's'}:

${improvements}

Last updated: ${timestamp}`;
}