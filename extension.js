// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const posix = require('path').posix;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

// some helper function
var getWebviewContent = function(barChartConfig, tsAcceptChartConfig, tsRejectChartConfig) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bar Chart</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
        <h1>Dev Data Dashboard</h1>
        <div>
            <p>Bar Chart</p>
            <canvas id="barchart"></canvas>
        </div>
        <div>
            <canvas id="accepted-timeplot"></canvas>
        </div>
        <div>
            <canvas id="rejected-timeplot"></canvas>
        </div>
        <script>
            // Bar Chart
            const barChart = new Chart(
                document.getElementById('barchart').getContext('2d'),
                ${JSON.stringify(barChartConfig)}
            );
            // Time Plots
            let AcceptedTimeChart = new Chart(
                document.getElementById('accepted-timeplot'),
                ${JSON.stringify(tsAcceptChartConfig)}
            );
            const RejectedTimeChart = new Chart(
                document.getElementById('rejected-timeplot'),
                ${JSON.stringify(tsRejectChartConfig)}
            );
        </script>
    </body>
    </html>`
};


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    /* */
    let acceptCnt = 0;
    let rejectCnt = 0;
	const disposable = vscode.commands.registerCommand('devdatadash.dashboard', function () {
		// Read the dev_data file using vscode.workspace.fs
        const HOME = process.env.HOME || process.env.USERPROFILE; // For cross-platform compatibility
        // get the last touch time of the config file
        const configYamlFilePath = posix.join(HOME, '.continue', 'config.yaml');
        vscode.workspace.fs.stat(vscode.Uri.file(configYamlFilePath)).then(stat => {
            const dateObject = new Date(stat.mtime);
            console.log('Config file mtime:', dateObject);
            console.log('Config file last modified at:', stat.mtime);
            console.log('Config file size:', stat.size, 'bytes');
            console.log('Config file ctime:', stat.ctime);
        }).catch(err => {
            console.error('Error accessing config file:', err);
        });
        // Construct the path to the file
        const uri = vscode.Uri.file(`${HOME}/.continue/dev_data/0.2.0/autocomplete.jsonl`); // Absolute path to the file
        console.log('Reading file at:', uri.fsPath);
        // this part seems to only read the last line of the file
		let autoCompletes = []
		vscode.workspace.fs.readFile(uri).then(content => {
			const myBuffer = Buffer.from(content);
			const lines = myBuffer.toString('utf8').split('\n');
			lines.forEach(line => {
				if (line.trim()) { // Check if the line is not empty
					try {
						let json = JSON.parse(line);
						autoCompletes.push(json);
						if(json.accepted){
							acceptCnt++;
						} else {
							rejectCnt++;
						}
					} catch (error) {
						console.error(`Error parsing entry JSON: ${error}`);
					}
				}
			});
			// testing this confirms the file is read correctly with multiple lines...
            // Create a new panel
            const panel = vscode.window.createWebviewPanel(
                'DashBoardPanel',
                'Dev Data Dashboard',
                vscode.ViewColumn.One,
                {
                    enableScripts: true // Allow scripts in the webview, not allowed by default ...
                }
            );
            const config = {
                type: 'bar',
                data: {
                    labels: ['Accepted', 'Rejected'],
                    datasets: [{
                        label: '# Auto-completes',
                        data: [acceptCnt, rejectCnt], // Initialize with zero counts
                        backgroundColor: [
                            'rgba(99, 255, 120, 0.2)',
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }],
                },
                options: {
                    indexAxis: 'y', // This makes it a horizontal bar chart
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Horizontal Bar Chart with Raw Counts'
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Count' // Label for the x-axis
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Category' // Label for the y-axis
                            }
                        }
                    }
                }
            };
            // Create a custom plugin to draw a vertical line at the 5th data point
            // Plugin to add a line to the chart area
            const logNote = {
                id: 'logNote',
                beforeDatasetsDraw: (chart, args, plugins ) => {
                    console.log('beforeDatasetsDraw called');
                    console.log('chart', chart);
                    console.log('args', args);
                    console.log('plugins', plugins);
                    console.log('chart');
                    console.info('chart');
                    console.debug('chart');
                    console.warn('chart');
                    console.error('chart');
                }
            };
            // Time series plot of accepted auto-completes over time
            let acceptedCompletes = autoCompletes.filter(ac => ac.accepted);
            let acceptedPlotData = acceptedCompletes.map(ac => ({x: ac.timestamp, y: ac.completion.length}));
            // Time series data of rejected auto-completes over time
            let rejectedCompletes = autoCompletes.filter(ac => !ac.accepted);
            let rejectedPlotData = rejectedCompletes.map(ac => ({x: ac.timestamp, y : ac.completion.length}));
            const tsAcceptData = {
                datasets: [{
                    label: 'Accepted Auto-complete length',
                    // TODO: replace with real data
                    data: [...acceptedPlotData],
                    borderColor: 'blue',
                    backgroundColor: 'yellow'
                }]
            };
            const tsRejectData = {
                datasets: [{
                    label: 'Rejected Auto-complete length',
                    data: [...rejectedPlotData],
                    borderColor: 'red',
                    backgroundColor: 'orange'
                }]
            };
            const tsAConfig = {
              type: 'line',
              data: tsAcceptData,
              plugins: [logNote],
              options: {
                responsive: true,
                plugins: 
                {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Time Series'
                  },
                  logNote: {
                    message: 'This is a custom plugin to log the chart object',
                  },
                },
              }
            };
            const tsRConfig = {
              type: 'line',
              data: tsRejectData,
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Time Series'
                  }
                }
              },
            };
            console.log('Auto-completes:', autoCompletes.length);
			console.log(`Accepted/Rejected counts, ${acceptCnt} / ${rejectCnt}`);
            panel.webview.html = getWebviewContent(config, tsAConfig, tsRConfig);
        }).catch(err => {console.error('Error reading file:', err)});
    // Display a message box to the user
	vscode.window.showInformationMessage('Rendering Dev Data Dashboard!');
    });
    // Add to the context subscriptions
    context.subscriptions.push(disposable);
}
// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}