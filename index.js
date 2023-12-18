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
		const text = pullRequestUrl;
		text.href = pullRequestUrl;
	  	await webhook.send({
	    	text: "링크 <google.com|hellogoogle>",
		attachments:[
		{
		  fallback:"링크주소: < pullRequestUrl | 구글 >",
		  pretext:"링크주소: < pullRequestUrl | 구글 >",
	      	  color:"#00FFFF",
	          fields:[
	        	{
	          	title:"알림",
	          	value:"해당링크를 클릭하여 검색해 보세요.",
	          	short:false
	        	}
		  ]
	    }
	  ]
	 	 });
	} catch (error) {
		core.setFailed(error.message);
	}
	
})();


