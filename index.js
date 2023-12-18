const core = require('@actions/core');
const github = require('@actions/github');
const { IncomingWebhook } = require('@slack/webhook');

const url = core.getInput('WEBHOOK_URL');
const webhook = new IncomingWebhook(url);


const NOTI_COLORS = {
	"[D-0]" : "#FF0000",
	"[D-1]" : "#FF0000",
	"[D-2]" : "#FFA500",
	"[D-3]" : "#FFA500",
	"[D-4]" : "#008000",
	"[D-5]" : "#008000",
};

class PullRequest {
  constructor(name, url, head, base, created_at, updated_at) {
    this.name = name;
    this.url = url;
    this.head = head;
    this.base = base;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

var attachments = [];

// Send the notification
(async () => {

	try {
		const token = core.getInput('GIT_TOKEN');
		core.setOutput('token', token);
		const octokit = github.getOctokit(token);
		global.octokit = octokit;
		const fetchAllPages = async (
		  request,
		  params,
		  maxCount = Number.POSITIVE_INFINITY
		) => {
		  let [page, len, count] = [1, 0, 0];
		  const result = [];
		
		  do {
		    const { data } = await request({ ...params, per_page: 100, page });
		    for (var i = 0; i < data.length; i++) {
			  var object = data[i];
			  const pullRequest = new PullRequest(object.title, object.html_url, object.head.label, object.base.label, object.created_at, object.updated_at); 
			  result.push(pullRequest);
		    }
		    console.log(`data`);
		    console.log(data);
		
		    [page, len, count] = [page + 1, data.length, count + data.length];
		  } while (len === 100 && count < maxCount);
		  console.log(`result`);
		  console.log(result)
		  return result;
		};

		const listOfPRs = await fetchAllPages(global.octokit.rest.pulls.list, {
		    owner: github.context.repo.owner,
		    repo: github.context.repo.repo,
		    state: "open",
		  });

		console.log(`listOfPRs`);
		console.log(listOfPRs);
		console.log(Date());

		for (var i = 0; i < listOfPRs.length; i++) {
		    const pr = listOfPRs[i];
		    const dueDate = pr.name.substr(0, 5);
		    console.log(dueDate);
		    const color = NOTI_COLORS[`${dueDate}`];
  		    console.log(color);
		    const headToBaseContext = `${pr.head}` + "to" + `${pr.base}`
		    const timeContext = `${pr.created_at}` + "to" + `${pr.updated_at}`
		    const slackMessage = {"fallback": "요청에 실패했습니다",
		          "color": color,
		          "title": pr.name,
		          "title_link": pr.url,
			  "text": headToBaseContext + "\n" + timeContext};
		    attachments.push(slackMessage);
		}
		const pr_title = core.getInput('pr_title');
		console.log(pr_title);
		const githubcontext = core.getInput('GITHUB_CONTEXT');
		console.log(githubcontext);
		const open_issues_count = core.getInput('OPEN_ISSUES_COUNT');
		console.log(open_issues_count);
		const pullRequestUrl = core.getInput('GITHUB_PR_URL');
		console.log(pullRequestUrl);
		const textExample = `${pullRequestUrl}`;
			
	  	await webhook.send({
	    	text: `${open_issues_count}개의 PR이 여러분들의 관심을 기다리고 있어요~`,
	        attachments: attachments
	 	});
	} catch (error) {
		core.setFailed(error.message);
	}
	
})();


