import * as path from 'path'

import { workspace, Disposable, ExtensionContext } from 'vscode'
import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions } from 'vscode-languageclient'

export function activate(context: ExtensionContext) {
  // The server is implemented in node
  let serverModule = path.resolve(__dirname, 'server/index.js')

  // The debug options for the server
  let debugOptions = { execArgv: ["--nolazy", "--debug=6004"] }

  // If the extension is launch in debug mode the debug server options are use
  // Otherwise the run options are used
  let serverOptions: ServerOptions = {
    run : { module: serverModule },
    debug: { module: serverModule, options: debugOptions }
  }

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector: ['schema'],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contain in the workspace
      fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
    }
  }

  // Create the language client and start the client.
  let disposable = new LanguageClient('Schema Language Server', serverOptions, clientOptions).start()

  // Push the disposable to the context's subscriptions so that the
  // client can be deactivated on extension deactivation
  context.subscriptions.push(disposable)
}
