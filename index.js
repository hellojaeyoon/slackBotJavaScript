const core = require('@actions/core');
const { IncomingWebhook } = require('@slack/webhook');

const url = core.getInput('WEBHOOK_URL');
const webhook = new IncomingWebhook(url);

// Send the notification
(async () => {

	try {
		const token = core.getInput('GIT_TOKEN');
		core.setOutput('token', token);
		console.log(token);
		const pr_title = core.getInput('pr_title');
		console.log(pr_title);
		const githubcontext = core.getInput('GITHUB_CONTEXT');
		console.log(githubcontext);
		const pullRequestUrl = core.getInput('GITHUB_PR_URL');
		console.log(pullRequestUrl);
		const text = pr_title;
		text.href = pullRequestUrl;
	  	await webhook.send({
	    	text: text,
	 	 });
	} catch (error) {
		core.setFailed(error.message);
	}
	
})();


