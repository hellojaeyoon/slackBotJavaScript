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

function time_ago(time) {

  switch (typeof time) {
    case 'number':
      break;
    case 'string':
      time = +new Date(time);
      break;
    case 'object':
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  var time_formats = [
    [60, 'seconds', 1], // 60
    [120, '1 minute ago', '1 minute from now'], // 60*2
    [3600, 'minutes', 60], // 60*60, 60
    [7200, '1 hour ago', '1 hour from now'], // 60*60*2
    [86400, 'hours', 3600], // 60*60*24, 60*60
    [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
    [604800, 'days', 86400], // 60*60*24*7, 60*60*24
    [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
    [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
    [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
    [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
    [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  var seconds = (+new Date() - time) / 1000,
    token = 'ago',
    list_choice = 1;

  if (seconds == 0) {
    return 'Just now'
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = 'from now';
    list_choice = 2;
  }
  var i = 0,
    format;
  while (format = time_formats[i++])
    if (seconds < format[0]) {
      if (typeof format[2] == 'string')
        return format[list_choice];
      else
        return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
    }
  return time;
}

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
		    const headToBaseContext = `${pr.head}` + " > " + `${pr.base}`;
			const timewhenCreate = time_ago(created_at);
			const timewhenUpdate = time_ago(updated_at);
			console.log(timewhenCreate);
			console.log(timewhenCreate);
		    const timeContext = `${pr.created_at}` + "to" + `${pr.updated_at}`;
		    const slackMessage = {
			  "fallback": "요청에 실패했습니다",
		          "color": color,
		          "title": pr.name,
		          "title_link": pr.url,
			  "text": headToBaseContext + "\n" + timeContext
		    };
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


