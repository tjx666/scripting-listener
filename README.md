# Scripting Listener

Switch and Log Viewer for Adobe Photoshop Scripting Listener Plugin.

> Only for MacOS users now!!!

## Features

- enable/disable scripting listener log
- scripting listener log viewer
- open scripting listener log file

## Usage

### Enable/Disable Scripting Listener Log

Open VSCode command plate by shortcut <kbd>⌘</kbd>+<kbd>⇧</kbd>+<kbd>P</kbd>, then search and call command `Enable Scripting Listener Log` or `Disable Scripting Listener Log`

### Scripting Listener Log Viewer

> Make sure you had installed the Scripting Listener plugin successfully. There should be a log file named `ScriptingListenerJS.log` in you desktop.

Open log viewer by calling command `Open Scripting Listener Log Viewer`. The Log Viewer contents will be automatically updated when the log file changed.

The buttons on top of log viewer:

- `Enable Logging`: enable Scripting Listener
- `Disable Logging`: disable Scripting Listener
- `Refresh`: get the latest contents
- `Clear`: empty Scripting Listener log file

By default, the log viewer only show 10 code blocks, and every code block will only be parsed 100 lines.
You can custom the behavior by settings:

- ScriptingListener.codeBlockCount
- ScriptingListener.parsedLinesCountPerCodeBlock

The code will be clean and pretty:

Source:

```javascript
var idhistoryStateChanged = stringIDToTypeID( "historyStateChanged" );
    var desc592 = new ActionDescriptor();
    var iddocumentID = stringIDToTypeID( "documentID" );
    desc592.putInteger( iddocumentID, 219 );
    var idID = stringIDToTypeID( "ID" );
    desc592.putInteger( idID, 229 );
    var idname = stringIDToTypeID( "name" );
    desc592.putString( idname, """Delete Layer""" );
    var idhasEnglish = stringIDToTypeID( "hasEnglish" );
    desc592.putBoolean( idhasEnglish, true );
    var iditemIndex = stringIDToTypeID( "itemIndex" );
    desc592.putInteger( iditemIndex, 5 );
executeAction( idhistoryStateChanged, desc592, DialogModes.NO );
```

Parsed:

```javascript
var desc = new ActionDescriptor();
desc.putInteger(stringIDToTypeID('documentID'), 219);
desc.putInteger(stringIDToTypeID('ID'), 229);
desc.putString(stringIDToTypeID('name'), 'Delete Layer');
desc.putBoolean(stringIDToTypeID('hasEnglish'), true);
desc.putInteger(stringIDToTypeID('itemIndex'), 5);
executeAction(stringIDToTypeID('historyStateChanged'), desc, DialogModes.NO);
```

![LogViewer](https://github.com/tjx666/scripting-listener/blob/master/images/LogViewer.gif?raw=true)

### Open Scripting Listener Log File

Calling command `Open Scripting Listener Log File` will open the log file using `javascript` language mode and apply the encoding what you set. You can define the encoding with setting: `ScriptingListener.logFileEncoding`, default is `utf-8`. For Chinese users, you may need to set encoding to `gbk` if your Photoshop is Chinese locale.
