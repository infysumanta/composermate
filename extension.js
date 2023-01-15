const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  vscode.window.showInformationMessage(
    'Congratulations, your extension "composerMate" is now active!'
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("composermate.helloWorld", function () {
      vscode.window.showInformationMessage("Hello World from composerMate!");
    })
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
