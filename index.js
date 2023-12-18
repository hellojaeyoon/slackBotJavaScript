const core = require('@actions/core');

try {
	const token = core.getInput('GIT_TOKEN');
	core.setOutput('token', token);

} catch (error) {
	core.setFailed(error.message);
}

