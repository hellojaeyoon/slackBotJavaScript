import * as core from "@actions/core";
import * as github from "@actions/github";
import { initialize } from "./initialize.js";
import { listOfPRs } from "./api.js";

const NOTI_COLORS = {
	"[D-0]" : "#FF0000",
	"[D-1]" : "#FF0000",
	"[D-2]" : "#FFA500",
	"[D-3]" : "#FFA500",
	"[D-4]" : "#008000",
	"[D-5]" : "#008000",
};

function time_ago(time) {

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
		initialize();
		const test = await listOfPRs();
		console.log(`test`);
		console.log(test);
		console.log(Date());

		for (var i = 0; i < test.length; i++) {
		    const pr = test[i];
		    const dueDate = pr.name.substr(0, 5);
		    console.log(dueDate);
		    const color = NOTI_COLORS[`${dueDate}`];
  		    console.log(color);
		    const headToBaseContext = `${pr.head}` + " -> " + `${pr.base}`;
			const timewhenCreate = time_ago(new Date(pr.created_at));
			const timewhenUpdate = time_ago(new Date(pr.updated_at));
			console.log(timewhenCreate);
			console.log(timewhenCreate);
		    const timeContext = "(" + "created " + timewhenCreate + ", and " + "updated " + timewhenUpdate + ")";
		    const slackMessage = {
			  "fallback": "요청에 실패했습니다",
		          "color": color,
		          "title": pr.name,
		          "title_link": pr.url,
			  "text": headToBaseContext + "\n" + timeContext  
		    };
		    attachments.push(slackMessage);
		    const slackBlock = {
			    blocks : [
					{
				          type: "section",
				          text: {
				            type: "mrkdwn",
				            text: "<@" + "C069ZBB35L4" + ">" + "여러분",
				          },
				        },
				    	{
				          type: "section",
				          text: {
				            type: "mrkdwn",
				            text: "<@" + "U05DYM3MNSU" + ">" + "님",
				          },
				        },
				    	{
					"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": "<" + pr.url + "|" + pr.name + ">"
						}
					},
				    	{
				          type: "section",
				          text: {
				            type: "mrkdwn",
				            text: headToBaseContext,
				          },
				        },
				    ]
		    }
		    attachments.push(slackBlock);
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
			
	  	await global.webhook.send({
	    	text: `${open_issues_count}개의 PR이 여러분들의 관심을 기다리고 있어요~`,
	        attachments: attachments
	 	});
	} catch (error) {
		core.setFailed(error.message);
	}
	
})();


