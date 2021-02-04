figma.showUI(__html__, { width: 300, height: 450 });

const savedId = figma.root.findOne((node) => node.name === 'better-color');

figma.ui.onmessage = (msg: { type: string; colorSave?: { color: RGB; title: string } }) => {
    if (savedId) {
        if (msg.type === 'colorSave' && msg.colorSave) {
            const savedColor = figma.getNodeById(savedId.id) as PageNode;
            const colorBlock = figma.createRectangle();
            colorBlock.name = msg.colorSave.title || Math.random().toString(36).substr(2, 11);
            colorBlock.fills = [{ type: 'SOLID', color: convertColor(msg.colorSave.color) }];
            savedColor.appendChild(colorBlock);
        } else {
            const savedColor = figma.getNodeById(savedId.id) as PageNode;
            const data = savedColor.children.map((item) => {
                if (item.type === 'RECTANGLE') {
                    return {
                        title: item.name,
                        color: item.fills[0].color,
                    };
                }
            });
            figma.ui.postMessage({ data });
        }
    } else {
        const savedColor = figma.createPage();
        savedColor.name = 'better-color';
        figma.root.appendChild(savedColor);
        if (msg.type === 'colorSave' && msg.colorSave) {
            const colorBlock = figma.createRectangle();
            colorBlock.name = msg.colorSave.title || Math.random().toString(36).substr(2, 11);
            colorBlock.fills = [{ type: 'SOLID', color: convertColor(msg.colorSave.color) }];
            savedColor.appendChild(colorBlock);
        }
    }
};

function convertColor(color: RGB) {
    return { r: color.r / 255, g: color.g / 255, b: color.b / 255 };
}
