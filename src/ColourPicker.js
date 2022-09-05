import React, { useState } from 'react';
import './colour_picker.css';

export const COLOURS = [
    '#d30000 Red', 'var(--main-colour) Default\t(Green)',
    '#0097d3 Cyan', '#fceb00 Yellow',
    '#ff8c00 Orange', "#f7438e Pink",
    "#2d30dd Blue", '#ab2ddd Purple',
    "#252525 Black", "#b3b3b3 White"
];

export default function ColourPicker({
    selectedColour = 1,
    setSelectedColour = () => {}
}) {

    return (
        <div class='colour_picker'>
            { COLOURS.map((colour, index) => <ColourField key={colour} colour={colour.split(' ')[0]} index={index} selectedColour={selectedColour} setSelectedColour={setSelectedColour} />) }
        </div>
    );
}

function ColourField({ colour, index, selectedColour, setSelectedColour }) {
    return <button class={`colour_field ${index === selectedColour ? 'selected' : ''}`} style={{
        '--colour': colour,
        '--rotation': (Math.random() * 2 > 1 ? 1 : -1) * 90 + 'deg'
    }} onClick={e => setSelectedColour(index)} />;
}