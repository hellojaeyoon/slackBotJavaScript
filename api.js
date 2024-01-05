export class PullRequest {
  constructor(name, url, head, base, created_at, updated_at) {
    this.name = name;
    this.url = url;
    this.head = head;
    this.base = base;
    this.created_at = created_at;
    this.updated_at = updated_at;
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
			  const pullRequest = new PullRequest(object.title, object.html_url, object.head.ref, object.base.ref, object.created_at, object.updated_at); 
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

// export const getPRList = async () => {
//   return fetchAllPages(global.octokit.rest.pulls.list, {
//     owner: global.owner,
//     repo: global.repo,
//     state: "open",
//   });
// };

export const listOfPRs = async () => {
	return fetchAllPages(global.octokit.rest.pulls.list, {
    owner: global.owner,
    repo: global.repo,
    state: "open",
  });
};
