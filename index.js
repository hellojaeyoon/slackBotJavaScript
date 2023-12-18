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
  constructor(name, url) {
    this.name = name;
    this.year = year;
  }
}
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
			  const pullRequest = new PullRequest(object.title, object.html_url); 
			  result.push(pullRequest);
		    }
		    console.log(`data`);
		    console.log(data);
		
		    [page, len, count] = [page + 1, data.length, count + data.length];
		  } while (len === 100 && count < maxCount);
		  console.log(result)
		  return result;
		};
		
		const getPRList = async () => {
		  return fetchAllPages(global.octokit.rest.pulls.list, {
		    owner: github.context.repo.owner,
		    repo: github.context.repo.repo,
		    state: "open",
		  });
		};

		const { listOfPRs } = getPRList();
		console.log(`listOfPRs`);
		console.log(listOfPRs);
		
		const pr_title = core.getInput('pr_title');
		console.log(pr_title);
		const githubcontext = core.getInput('GITHUB_CONTEXT');
		console.log(githubcontext);
		const open_issues_count = core.getInput('OPEN_ISSUES_COUNT');
		console.log(open_issues_count);
		const pullRequestUrl = core.getInput('GITHUB_PR_URL');
		console.log(pullRequestUrl);
		const textExample = `${pullRequestUrl}`;

		const dueDate = pr_title.substr(0, 5);
		console.log(dueDate);
		const color = NOTI_COLORS[`${dueDate}`];
  		console.log(color);
		
	  	await webhook.send({
	    	text: `${open_issues_count}개의 PR이 여러분들의 관심을 기다리고 있어요~`,
	        attachments:[
		      {
		          "fallback": "요청에 실패했습니다ㅜ",
		          "color": color,
		          "pretext": "PR이 당신의 리뷰를 기다리고 있어요!",
		          "author_name": "hellojaeyoon",
		          "author_link": "https://github.com/hellojaeyoon",
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


