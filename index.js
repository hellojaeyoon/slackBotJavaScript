import * as core from "@actions/core";
import * as github from "@actions/github";
import { initialize } from "./initialize.js";
import { listOfPRs } from "./api.js";
import { time_ago, NOTI_COLORS } from "./SlackMessage.js";

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
      const labels = pr.labels;
      console.log("labels");
      for (var j = 0; j < labels.length; i++) {
        console.log(labels[j]);
      }
      
      const dueDate = pr.name.substr(0, 5);
      console.log(dueDate);
      const color = NOTI_COLORS[`${dueDate}`];
      console.log(color);
      const headToBaseContext = `${pr.head}` + " -> " + `${pr.base}`;
      const timewhenCreate = time_ago(new Date(pr.created_at));
      const timewhenUpdate = time_ago(new Date(pr.updated_at));
      console.log(timewhenCreate);
      console.log(timewhenCreate);
      const timeContext =
        "(" + "created " + timewhenCreate + ", and " + "updated " + timewhenUpdate + ")";
      const slackMessage = {
        fallback: "요청에 실패했습니다",
        color: color,
        title: pr.name,
        title_link: pr.url,
        text: headToBaseContext + "\n" + timeContext,
      };
      attachments.push(slackMessage);
      const slackBlock = {
        blocks: [
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
            type: "section",
            text: {
              type: "mrkdwn",
              text: "<" + pr.url + "|" + pr.name + ">",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: headToBaseContext,
            },
          },
        ],
      };
      attachments.push(slackBlock);
    }
    const pr_title = core.getInput("pr_title");
    console.log(pr_title);
    const githubcontext = core.getInput("GITHUB_CONTEXT");
    console.log(githubcontext);
    const open_issues_count = core.getInput("OPEN_ISSUES_COUNT");
    console.log(open_issues_count);
    const pullRequestUrl = core.getInput("GITHUB_PR_URL");
    console.log(pullRequestUrl);
    const textExample = `${pullRequestUrl}`;

    await global.webhook.send({
      text: `${open_issues_count}개의 PR이 여러분들의 관심을 기다리고 있어요~`,
      attachments: attachments,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
})();
