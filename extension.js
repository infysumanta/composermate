const vscode = require("vscode");
const axios = require("axios").default;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log(
    'Congratulations, your extension "packagist-search" is now active!'
  );

  vscode.window.showInformationMessage(
    'Congratulations, your extension "packagist-search" is now active!'
  );

  let disposable = vscode.commands.registerCommand(
    "composermate.searchPackagist",
    async () => {
      try {
        const { data } = await axios.get(
          `https://packagist.org/search.json?q=""`
        );
        const items = data.results.map((result) => {
          return {
            label: result.name,
            description: result.description,
          };
        });
        const quickPick = vscode.window.createQuickPick();
        quickPick.items = items;
        quickPick.show();
        quickPick.onDidChangeValue(async (value) => {
          quickPick.busy = true;
          try {
            const { data } = await axios.get(
              `https://packagist.org/search.json?q=${value}`
            );

            quickPick.items = data.results.map((result) => {
              return {
                label: result.name,
                description: result.description,
              };
            });
          } catch (error) {
            console.error(error);
          } finally {
            quickPick.busy = false;
          }
        });
        quickPick.onDidAccept(() => {
          quickPick.hide();
        });

        quickPick.onDidHide(() => {
          quickPick.dispose();
        });
      } catch (error) {
        console.error(error);
      }
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
