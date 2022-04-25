import * as vscode from 'vscode';
import { sendCodeSubmission, joinRoom } from './api';

let postTimeout: NodeJS.Timeout;
let postTimeoutDelay: number = 1000;

let roomCode: string | null = null;
let userId: string | null = null;

export function activate(context: vscode.ExtensionContext) {

	let joinSession = vscode.commands.registerCommand('colabcode.joinSession', () => {
		const inputBoxOptions: vscode.InputBoxOptions = {
			prompt: "Room Code: ",
			value: "test-room",
		};

		vscode.window.showInputBox(inputBoxOptions).then(async (value) => {
			if (!value) {
				vscode.window.showErrorMessage("You must provide a room code to join");
				return;
			}

			roomCode = value;
			userId = await joinRoom(roomCode);

			vscode.window.showInformationMessage(`Room Code "${roomCode}" has been set!`);
		});
	});

	// On activation, any time our text document changes, get the changes and push them to the server
	vscode.workspace.onDidChangeTextDocument((changeEvent) => {
		if (!roomCode) {
			throw Error("Room code not set");
		}

		if (!userId) {
			throw Error("User id not set");
		}

		if (postTimeout) {
			clearTimeout(postTimeout);
		}

		postTimeout = setTimeout(() => {
			const textToPost = changeEvent.document.getText();
			sendCodeSubmission(roomCode!, textToPost, userId!);
		}, postTimeoutDelay);
	});

	context.subscriptions.push(joinSession);
}

export function deactivate() {}
