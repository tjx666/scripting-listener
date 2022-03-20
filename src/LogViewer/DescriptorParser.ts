export default class DescriptorParser {
    /*
     * Remove unnecessary charID and stringID variables for a shorter code
     */
    cleanJSX(data: string) {
        const lines = data.split('\n');
        const variables: Record<string, string> = {};
        const actionLines: string[] = [];
        // Identify lines with charIDs or stringIDs
        lines.forEach((line) => {
            if (
                line.match('var') &&
                (line.match('charIDToTypeID') || line.match('stringIDToTypeID'))
            ) {
                const variableName = line.replace(/[\s+]*var /, '').replace(/ =.+/, '');
                const id = line.replace(/[\s+]*.+= /, '').replace(';', '');
                variables[variableName] = id;
            } else if (line !== '') {
                const cleanLine =
                    line[0] === ' ' || line[0] === '    ' ? line.replace(/\s+/, '') : line;
                actionLines.push(cleanLine);
            }
        });

        // Cleanup lines
        const parsedLines: string[] = [];
        actionLines.forEach((actionLine) => {
            const idNames = actionLine.match(/id\w+/g);
            let parsedLine = actionLine;
            if (idNames && idNames.length > 0) {
                idNames.forEach(function (idName) {
                    parsedLine = parsedLine.replace(idName, variables[idName]);
                });
            }
            parsedLines.push(parsedLine);
        });

        return parsedLines.join('\n');
    }

    /*
     * Clean variables to start count from 1
     */
    cleanVariables(data: string) {
        const lines = data.split('\n');
        const variables: Record<string, string> = {};
        const actionLines: string[] = [];
        let descCount = 1;
        let refCount = 1;
        let listCount = 1;
        // Identify lines with variables
        lines.forEach((line) => {
            if (
                line.match('var') &&
                (line.match('ActionDescriptor') ||
                    line.match('ActionReference') ||
                    line.match('ActionList'))
            ) {
                actionLines.push(line);
                const variableName = line.replace(/[\s+]*var /, '').replace(/ =.+/, '');
                let newVariableName;
                if (line.match('ActionDescriptor')) {
                    newVariableName = 'desc' + descCount;
                    descCount = descCount + 1;
                } else if (line.match('ActionReference')) {
                    newVariableName = 'ref' + refCount;
                    refCount = refCount + 1;
                } else if (line.match('ActionList')) {
                    newVariableName = 'list' + listCount;
                    listCount = listCount + 1;
                }
                variables[variableName] = newVariableName;
            } else {
                let cleanLine = line;
                if (cleanLine[0] === ' ') {
                    cleanLine = cleanLine.replace(/\s+/, '');
                }
                actionLines.push(cleanLine);
            }
        });

        // Cleanup variable names
        const parsedLines: string[] = [];
        actionLines.forEach((actionLine) => {
            let parsedLine = actionLine;

            const descVars = actionLine.match(/desc\w+/g);
            if (descVars && descVars.length > 0) {
                descVars.forEach(function (descVar) {
                    parsedLine = parsedLine.replace(descVar, variables[descVar]);
                });
            }

            const refVars = actionLine.match(/ref\w+/g);
            if (refVars && refVars.length > 0) {
                refVars.forEach(function (refVar) {
                    parsedLine = parsedLine.replace(refVar, variables[refVar]);
                });
            }

            const listVars = actionLine.match(/list\w+/g);
            if (listVars && listVars.length > 0) {
                listVars.forEach(function (listVar) {
                    parsedLine = parsedLine.replace(listVar, variables[listVar]);
                });
            }

            parsedLines.push(parsedLine);
        });

        return parsedLines.join('\n');
    }
}
