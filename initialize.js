import * as core from "@actions/core";
import * as github from "@actions/github";
import * as incomingWebhook from "@slack/webhook";

export const initialize = () => {
  global.owner = github.context.repo.owner;
  global.repo = github.context.repo.repo;

  const githubToken = core.getInput("GH_TOKEN", { required: true });
  if (!githubToken) {
    throw new Error("Missing GH_TOKEN environment variable");
  }
  const octokit = github.getOctokit(githubToken);
  global.octokit = octokit;
  
  const url = core.getInput('WEBHOOK_URL');
  const webhook = new IncomingWebhook(url);
  global.webhook = webhook;

  console.log(`Successfully initialized.`);
};
