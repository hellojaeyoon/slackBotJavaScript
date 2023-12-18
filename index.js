const core = require('@actions/core');
const { IncomingWebhook } = require('@slack/webhook');

const url = core.getInput('WEBHOOK_URL');
const webhook = new IncomingWebhook(url);

// Send the notification
(async () => {
  await webhook.send({
    text: 'hellojaeyoon...',
  });
})();

try {
	const token = core.getInput('GIT_TOKEN');
	core.setOutput('token', token);
	console.log(token);
	const pr_title = core.getInput('pr_title');
	console.log(pr_title);
	const githubcontext = core.getInput('GITHUB_CONTEXT');
	console.log(githubcontext);
	const pullRequestUrl = githubcontext["event"]["pull_request"]["html_url"];
	console.log(pullRequestUrl);

} catch (error) {
	core.setFailed(error.message);
}

