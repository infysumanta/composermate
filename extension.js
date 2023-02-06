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
            name: result.name,
            description: `Download: ${result.downloads} | Fav: ${result.favers}`,
            detail: result.description,
            url: result.url,
            repository: result.repository,
          };
        });
        const quickPick = vscode.window.createQuickPick();
        quickPick.items = items;

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

        quickPick.onDidChangeSelection((selection) => {
          if (selection[0]) {
            const { name, url, repository } = selection[0];
            quickPick.hide();
            const repoQuickPick = vscode.window.createQuickPick();
            const data = [
              {
                label: "Install Package",
                value: "install",
                flag: 0,
              },
              {
                label: "Open Repository",
                value: "repo",
                flag: 1,
              },
              {
                label: "Open Project Url",
                value: "url",
                flag: 2,
              },
            ];

            repoQuickPick.items = data;
            repoQuickPick.onDidChangeSelection((selection) => {
              if (selection[0]) {
                const { value, flag } = selection[0];
                repoQuickPick.hide();
                switch (flag) {
                  case 0:
                    //  execute the console command to install the package
                    vscode.window.showInformationMessage(
                      `Installing ${name} package`
                    );

                    break;
                  case 1:
                    vscode.env.openExternal(vscode.Uri.parse(repository));
                    break;
                  case 2:
                    vscode.env.openExternal(vscode.Uri.parse(url));
                    break;
                  default:
                    break;
                }
              }
            });
            repoQuickPick.show();
          }
        });

        quickPick.onDidHide(() => {
          quickPick.dispose();
        });
        quickPick.show();
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
