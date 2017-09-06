'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

/* TODO | - Multiple entities in a single selection
 *        - Unicode data
 *        - Extensible, options
 *        - Key map
 */
const lookup = {
    alpha:   'α',
    beta:    'β',
    gamma:   'γ',
    delta:   'δ',
    epsilon: 'ε',
    zeta:    'ζ',
    eta:     'η',
    Theta:   'θ',
    iota:    'ι',
    kappa:   'κ',
    lambda:  'λ',
    mu:      'μ',
    nu:      'ν',
    xi:      'ξ',
    omicron: 'ο',
    pi:      'π',
    rho:     'ρ',
    sigma:   'σ', // TODO: how to deal with 'ς'
    tau:     'τ',
    upsilon: 'υ',
    phi:     'φ',
    chi:     'χ',
    psi:     'ψ',
    omega:   'ω'
};


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('insert-special-symbol is been activated!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    const commandName = 'insert-special-symbol.replaceSelection';
 
    
    function isUnicodeEscape(s: string) {
        return /\\u[0-9a-fA-F]{4}/.test(s);
    }

    function sameCase(paragon: string, s: string) {
        // TODO: Make more robust
        // Like 'copySign', but for letter cases.
        // Assumes it's either uppercase or lowercase (which may not be the case)
        return (paragon.toUpperCase() === paragon) ? s.toUpperCase() : s.toLowerCase();
    }

    function tryReplaceNameWithCharacter(name: string, range, edit) {
        const character = lookup[name.toLowerCase()];
        if (character !== undefined) {
            edit.replace(range, sameCase(name, character));
            return true;
        } else {
            console.log(`[${commandName}] No replacement available for name ${name}.`)
            return false;
        }
    }

    function tryReplaceCodeWithCharacter(code: string, range, edit) {
        if (isUnicodeEscape(code)) {
            const character = String.fromCharCode(parseInt(code.slice(2), 16));
            edit.replace(range, character);
            return true;
        } else {
            console.log(`[${commandName}] String '${code}' is not a Unicode escape sequence.`)
            return false
        }
    }
    
    let disposable = vscode.commands.registerTextEditorCommand(commandName, (editor, edit, args) => {
        // The code you place here will be executed every time your command is executed
        // const editor = vscode.window.activeTextEditor;
        editor.selections.forEach(sel => {
            //console.log(sel, editor, edit, args);
            const selected  = editor.document.getText(sel);
            tryReplaceNameWithCharacter(selected, sel, edit) || tryReplaceCodeWithCharacter(selected, sel, edit);
        });
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}