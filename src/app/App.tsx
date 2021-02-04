import styled from '@emotion/styled';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ColorResult, SketchPicker } from 'react-color';

type ColorData = {
    color: RGB;
    title: string;
};

type ColorView = {
    color: string;
    title: string;
};
const App = ({}) => {
    const [color, setColor] = useState<ColorResult | undefined>();
    const [palette, setPalette] = useState<ColorView[]>([]);

    const handleChange = (color: ColorResult) => {
        setColor(color);
    };
    const handleAddToPalette = () => {
        if (color) {
            const finded = palette.find((item) => item.color === color?.hex);
            if (!finded) {
                setPalette((prev) => [...prev, { color: color.hex, title: '' }]);
                save({ color: color.rgb, title: '' });
            }
        }
    };
    const save = (data: ColorData) => {
        parent.postMessage({ pluginMessage: { colorSave: data } }, '*');
    };

    useEffect(() => {
        if (window) {
            window.onmessage = (
                e: MessageEvent<{ pluginMessage: { data: { color: RGB; title: string }[] } }>
            ) => {
                const datas = e.data.pluginMessage.data.map((item) => ({
                    color: rgbToHex(item.color),
                    title: item.title,
                }));
                setPalette(datas);
            };
            parent.postMessage({ pluginMessage: { type: 'load' } }, '*');
        }
    }, [window]);

    return (
        <Container>
            <SketchPicker
                width=""
                color={color?.rgb}
                onChange={handleChange}
                styles={{
                    default: { picker: { boxShadow: 'none' }, activeColor: { display: 'none' } },
                }}
                presetColors={palette}
            />
            <button onClick={handleAddToPalette}>add to palette</button>
        </Container>
    );
};

export default App;

const Container = styled.div`
    width: 100%;
    height: 100%;
`;

function rgbToHex({ r, g, b }: RGB) {
    const rgb = [r, g, b];

    for (var x = 0; x < 3; x++) {
        if (rgb[x] < 1) rgb[x] = Math.round(rgb[x] * 255);
    }

    const toHex = function (string) {
        string = parseInt(string, 10).toString(16);
        string = string.length === 1 ? '0' + string : string;

        return string;
    };

    return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
}
