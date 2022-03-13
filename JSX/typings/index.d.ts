declare function print(str: string);
declare function println(str: string);

const activeDocument: typeof app.activeDocument;

const executeAction: typeof app.executeAction;
const executeActionGet: typeof app.executeActionGet;

const charIDToTypeID: typeof app.charIDToTypeID;
const stringIDToTypeID: typeof app.stringIDToTypeID;
const typeIDToStringID: typeof app.typeIDToStringID;
const typeIDToCharID: typeof app.typeIDToCharID;

interface Document {
    layers: Array<LayerSet | ArtLayer>;
}

interface LayerSet {
    layers: Array<LayerSet | ArtLayer>;
}
