const core = require('@actions/core');

try {
	const token = core.getInput('GIT_TOKEN');
	core.setOutput('token', token);
	console.log(token);
	const pr_title = core.getInput('pr_title');
	console.log(pr_title);

} catch (error) {
	core.setFailed(error.message);
}

