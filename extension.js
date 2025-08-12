// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const posix = require('path').posix;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

// some helper function
var getWebviewContent = (chartConfig) => `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bar Chart</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
        <canvas id="ARBar"></canvas>
        <script>
            const ctx = document.getElementById('ARBar');
            new Chart(ctx, ${JSON.stringify(chartConfig)}
            );
        </script>
    </body>
    </html>`

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Yur extension "ext-learn1" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
    let acceptCnt = 0;
    let rejectCnt = 0;
	const disposable = vscode.commands.registerCommand('devDataDash.RenderDashboard', function () {
		// Read the dev_data file using vscode.workspace.fs
        const HOME = process.env.HOME || process.env.USERPROFILE; // For cross-platform compatibility
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
						console.error('Error parsing JSON:', error);
					}
				}
			});
			// testing this confirms the file is read correctly with multiple lines...
            // Create a new panel
            const panel = vscode.window.createWebviewPanel(
                'barChartPanel',
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
            console.log('Auto-completes:', autoCompletes.length);
			console.log('Accepted/Rejected counts-TAKE0:', acceptCnt, rejectCnt);
            panel.webview.html = getWebviewContent(config);
        }).catch(err => {console.error('Error reading file:', err)});
    // Display a message box to the user
	vscode.window.showInformationMessage('Rendering Dev Data Dashboard!');
    });
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

