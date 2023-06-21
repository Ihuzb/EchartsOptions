// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { EntryList, examplesEntryList } = require('./src/Provider');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {


	//注册侧边栏面板的实现
	vscode.window.registerTreeDataProvider("general", new EntryList());
	vscode.window.registerTreeDataProvider("examples", new examplesEntryList());
	//注册命令 
	vscode.commands.registerCommand("beautifulGirl1.openChild", args => {
		console.log(args, 77777);
		// vscode.window.showInformationMessage(args);
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		let snippet = new vscode.SnippetString(args);
		editor.insertSnippet(snippet);
	});
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "EchartsOptions" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('echartsoptions.helloWorld', showWebview);

	context.subscriptions.push(disposable);
}

function showWebview() {
	// 创建webview
	const panel = vscode.window.createWebviewPanel(
		'testWebview', // viewType
		'WebView演示', // 视图标题
		vscode.ViewColumn.One, // 显示在编辑器的哪个部位
		{
			enableScripts: true, // 启用JS，默认禁用
			retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
		}
	);
	panel.webview.html = `<html><body>你好，我是Webview</body></html>`;
}
// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
