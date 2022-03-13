/* eslint-disable */

(function () {
    var __vscode_scripting_listener__ = true;

    function print(str) {
        var file = new File(__output_file__);
        file.open('a');
        file.encoding = 'UTF-8';
        file.write(str);
        file.close();
    }

    function println(str) {
        print(str + '\n');
    }

    // ${args}

    // ${executeScriptCode}
})();
