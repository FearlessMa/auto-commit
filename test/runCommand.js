/**
 * @param {string} command process to run
 * @param {string[]} args commandline arguments
 * @returns {Promise<void>} promise
 */
const runCommand = (command, args) => {
	const cp = require("child_process");
	return new Promise((resolve, reject) => {
		const executedCommand = cp.spawn(command, args, {
			stdio: "inherit",
			// stdio: "pipe",
			shell: true
		});

		executedCommand.on("error", error => {
			reject(error);
    });
    executedCommand.on("data", data => {
      console.log('data: ', data.toString());
    })

		executedCommand.on("exit", code => {
			if (code === 0) {
        console.log('code: ', code);
				resolve();
			} else {
				reject();
			}
		});
	});
};

runCommand('cnpm i  eslint -D')