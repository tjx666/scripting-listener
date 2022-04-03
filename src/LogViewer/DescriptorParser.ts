export default class DescriptorParser {
    private static CODE_BLOCK_SEPARATOR =
        '// =======================================================';
    private static LINE_SEPARATOR = /\n/;

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
        const descVarMapper = new Map<string, string>();
        const refVarMapper = new Map<string, string>();
        const listVarMapper = new Map<string, string>();
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
                if (line.match('ActionDescriptor')) {
                    descVarMapper.set(variableName, `desc${descCount}`);
                    descCount++;
                } else if (line.match('ActionReference')) {
                    refVarMapper.set(variableName, `ref${refCount}`);
                    refCount++;
                } else if (line.match('ActionList')) {
                    listVarMapper.set(variableName, `list${listCount}`);
                    listCount++;
                }
            } else {
                let cleanLine = line;
                if (cleanLine[0] === ' ') {
                    cleanLine = cleanLine.replace(/\s+/, '');
                }
                actionLines.push(cleanLine);
            }
        });

        // turn desc1 => desc when only one desc var
        [descVarMapper, refVarMapper, listVarMapper].forEach((mapper) => {
            if (mapper.size === 1) {
                const onlyEntry = [...mapper.entries()][0];
                mapper.set(onlyEntry[0], onlyEntry[1].slice(0, -1));
            }
        });

        // Cleanup variable names
        const parsedLines: string[] = [];
        actionLines.forEach((actionLine) => {
            let parsedLine = actionLine;

            const descVars = actionLine.match(/desc\w+/g);
            if (descVars && descVars.length > 0) {
                descVars.forEach(function (descVar) {
                    parsedLine = parsedLine.replace(descVar, descVarMapper.get(descVar));
                });
            }

            const refVars = actionLine.match(/ref\w+/g);
            if (refVars && refVars.length > 0) {
                refVars.forEach(function (refVar) {
                    parsedLine = parsedLine.replace(refVar, refVarMapper.get(refVar));
                });
            }

            const listVars = actionLine.match(/list\w+/g);
            if (listVars && listVars.length > 0) {
                listVars.forEach(function (listVar) {
                    parsedLine = parsedLine.replace(listVar, listVarMapper.get(listVar));
                });
            }

            parsedLines.push(parsedLine);
        });

        return parsedLines.join('\n');
    }

    cleanTripleQuotes(codeBlock: string) {
        return codeBlock.replaceAll(/"""(.*?)"""/g, `"$1"`);
    }

    removeBracketSpace(codeBlock: string) {
        return codeBlock.replaceAll(/\( /g, '(').replaceAll(/ \)/g, ')');
    }

    parse(code: string, parseCount: number) {
        const codeBlocks = code.split(DescriptorParser.CODE_BLOCK_SEPARATOR);
        const maxLineCount = 100;
        const parsedCodeBlocks: string[] = [];
        let parsedCount = 0;
        for (let i = codeBlocks.length - 1; i >= 0; i--) {
            const codeBlock = codeBlocks[i];
            if (codeBlock.trim() === '') continue;

            let paredCodeBlock = codeBlock;
            const lines = codeBlock.split(DescriptorParser.LINE_SEPARATOR);
            if (lines.length > maxLineCount) {
                paredCodeBlock = lines.slice(0, maxLineCount).join('\n');
                paredCodeBlock += `\n// ${lines.length - maxLineCount} lines is omitted...`;
            }

            paredCodeBlock = this.cleanVariables(paredCodeBlock);
            paredCodeBlock = this.cleanJSX(paredCodeBlock);
            paredCodeBlock = this.cleanTripleQuotes(paredCodeBlock);
            paredCodeBlock = this.removeBracketSpace(paredCodeBlock);
            parsedCodeBlocks.push(paredCodeBlock);
            parsedCount++;
            if (parsedCount === parseCount) break;
        }
        return parsedCodeBlocks;
    }
}
