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
		          "fallback": "요청에 실패했습니다ㅜ",
		          "color": "#2eb886",
		          "pretext": "PR이 당신의 리뷰를 기다리고 있어요!",
		          "author_name": "roseline",
		          "author_link": "https://github.com/roseline124",
		          "author_icon": "https://avatars.githubusercontent.com/u/41788121?s=460&u=ee6a6f6499aa68a23947cfb76d5e9cb6eebfd29c&v=4",
		          "title": pr_title,
		          "title_link": textExample,
		          "text": "피알내용조금?",
		          "fields": [
		              {
		                  "title": "썸띵",
		                  "value": "썸밸류",
		                  "short": false
		              }
		          ]
		      }
		   ]
	 	});
	} catch (error) {
		core.setFailed(error.message);
	}
	
})();


