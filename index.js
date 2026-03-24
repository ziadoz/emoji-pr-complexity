'use strict';

const core   = require('@actions/core');
const github = require('@actions/github');

const GRADES = [
  { min: 0,   max: 15,       emoji: '😊' },
  { min: 16,  max: 50,       emoji: '🙂' },
  { min: 51,  max: 120,      emoji: '😐' },
  { min: 121, max: 250,      emoji: '😠' },
  { min: 251, max: 500,      emoji: '😡' },
  { min: 501, max: Infinity, emoji: '💀' },
];

function score(files) {
  const changes    = files.reduce((sum, f) => sum + f.changes, 0);
  const exts       = new Set(files.map(f => f.filename.split('.').at(-1))).size;
  return Math.round((changes / 20) + (files.length * 2) + (exts * 4));
}

function emoji(score) {
  return GRADES.find(g => score >= g.min && score <= g.max).emoji;
}

function stripEmoji(title) {
  const pattern = GRADES.map(g => g.emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  return title.replace(new RegExp(`^(${pattern})\\s*`), '').trim();
}

module.exports = { score, emoji, stripEmoji };

async function run() {
  try {
    const octokit = github.getOctokit(core.getInput('token', { required: true }));
    const { owner, repo } = github.context.repo;

    const pr = github.context.payload.pull_request
      ?? (await octokit.rest.pulls.get({
           owner,
           repo,
           pull_number: github.context.payload.number,
         })).data;

    if (!pr) {
      core.warning('Could not resolve a pull request from this event. Skipping.');
      return;
    }

    const files = await octokit.paginate(
      octokit.rest.pulls.listFiles,
      { owner, repo, pull_number: pr.number, per_page: 100 }
    );

    const grade = emoji(score(files));
    const clean = stripEmoji(pr.title);
    const title = `${grade} ${clean}`;

    if (pr.title === title) {
      core.info('Title already up to date.');
      return;
    }

    await octokit.rest.pulls.update({ owner, repo, pull_number: pr.number, title });
    core.info(`Updated: "${title}"`);

  } catch (err) {
    core.setFailed(err.message);
  }
}

if (require.main === module) run();
