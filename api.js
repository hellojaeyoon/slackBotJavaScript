import { NOTI_COLORS } from "./SlackMessage.js";

class PullRequest {
  constructor(name, url, head, base, created_at, updated_at, D_Day, noti_color) {
    this.name = name;
    this.url = url;
    this.head = head;
    this.base = base;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.D_Day = D_Day;
    this.noti_color = noti_color;
  }
}

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
      const labels = object.labels;
      console.log(object.labels);
	var D_Day = "D_100";
	    var noti_color = "000000";
      for (var j = 0; j < labels.length; j++) {
	const label = labels[j];
	if (label.name in NOTI_COLORS) {
		D_Day = "[" + label.name + "]";
		noti_color = NOTI_COLORS[label.name];
	}
      }
      const pullRequest = new PullRequest(
        object.title,
        object.html_url,
        object.head.ref,
        object.base.ref,
        object.created_at,
        object.updated_at,
	    D_Day,
	      noti_color
      );
      result.push(pullRequest);
    }
    console.log(`data`);
    console.log(data);

    [page, len, count] = [page + 1, data.length, count + data.length];
  } while (len === 100 && count < maxCount);

  return result;
};

export const listOfPRs = async () => {
	return fetchAllPages(global.octokit.rest.pulls.list, {
    owner: global.owner,
    repo: global.repo,
    state: "open",
  });
};
