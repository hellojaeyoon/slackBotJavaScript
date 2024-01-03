import * as core from "@actions/core";
import * as github from "@actions/github";
import { IncomingWebhook } from "@slack/webhook";

export const initialize = () => {
  global.owner = github.context.repo.owner;
  global.repo = github.context.repo.repo;

  const githubToken = core.getInput("GIT_TOKEN", { required: true });
  if (!githubToken) {
    throw new Error("Missing GIT_TOKEN environment variable");
  }
  const octokit = github.getOctokit(githubToken);
  global.octokit = octokit;
  
  const url = core.getInput('WEBHOOK_URL');
  const webhook = IncomingWebhook(url);
  global.webhook = webhook;

  console.log(`Successfully initialized.`);
};
