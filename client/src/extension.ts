import * as vscode from 'vscode';
import { sendCodeSubmission } from './api';

let postTimeout: NodeJS.Timeout;
let postTimeoutDelay: number = 1000;

const roomId = "test-room" as const;

export function activate(context: vscode.ExtensionContext) {

	let joinSession = vscode.commands.registerCommand('colabcode.joinSession', () => {
		vscode.window.showInformationMessage('Joining Session!');
	});

	// On activation, any time our text document changes, get the changes and push them to the server
	vscode.workspace.onDidChangeTextDocument((changeEvent) => {
		// TODO: Push to server
		if (postTimeout) {
			clearTimeout(postTimeout);
		}

		postTimeout = setTimeout(() => {
			sendCodeSubmission(roomId, changeEvent.document.getText());
		}, postTimeoutDelay);
	});

	context.subscriptions.push(joinSession);
}

export function deactivate() {}
