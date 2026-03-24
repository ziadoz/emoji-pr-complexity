import * as core from '@actions/core';
import * as github from '@actions/github';
import { emoji, score, stripEmoji } from './grading.js';

async function run() {
  try {
    const octokit = github.getOctokit(core.getInput('token', { required: true }));
    const { owner, repo } = github.context.repo;

    const pr =
      github.context.payload.pull_request ??
      (
        await octokit.rest.pulls.get({
          owner,
          repo,
          pull_number: github.context.payload.number,
        })
      ).data;

    if (!pr) {
      core.warning('Could not resolve a pull request from this event. Skipping.');
      return;
    }

    const files = await octokit.paginate(octokit.rest.pulls.listFiles, {
      owner,
      repo,
      pull_number: pr.number,
      per_page: 100,
    });

    const grade = emoji(score(files));
    const clean = stripEmoji(pr.title);
    const title = `${grade} ${clean}`;

    if (pr.title === title) {
      core.info('Title already up to date.');
      return;
    }

    await octokit.rest.pulls.update({
      owner,
      repo,
      pull_number: pr.number,
      title,
    });
    core.info(`Updated: "${title}"`);
  } catch (err) {
    core.setFailed(err.message);
  }
}

run();
