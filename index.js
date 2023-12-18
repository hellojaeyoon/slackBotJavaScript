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
		console.log(pullRequestUrl.type);
		const textExample = `${pullRequestUrl}`;
	  	await webhook.send({
	    	text: pr_title,
	        attachments:[
		      {
			 "fallback":"PR을 확인해주세요~: <https://github.com/hellojaeyoon/javascriptAction/pull/14|PR>",
			 "pretext":"PR을 확인해주세요~: <https://github.com/hellojaeyoon/javascriptAction/pull/14|PR>",
			 "color":"#D00000",
			 "fields":[
			    {
			       "title":"Notes",
			       "value":"This is much easier than I thought it would be.",
			       "short":false
			    }
			 ]
			}
		   ]
	 	});
	} catch (error) {
		core.setFailed(error.message);
	}
	
})();


