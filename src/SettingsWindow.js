import React, { useState, useEffect } from 'react';
import './settings_window.css';
import delete_icon from './Icons/delete.png';
import { APP_ACTIONS, MAXIMUM_TITLE_LENGTH, GetWindowSize } from './App.js';
import IconButton from './IconButton.js';
import ColourPicker, { COLOURS } from './ColourPicker';

export default function SettingsWindow({
    appState = {},
    appDispatch = () => {},
    shown = false,
    name = 'Unknown Folder',
    tasks = [],
    colour = null
}) {
    const [currentTitle, setCurrentTitle] = useState(name);
    const [selectedColour, setSelectedColour] = useState(colour !== null ? COLOURS.map(c => c.split(' ')[0]).indexOf(colour) : 1);
    
    const [settingsWindowStyle, setSettingsWindowStyle] = useState({
        '--width': GetWindowSize() + 'px',
        '--height': GetWindowSize() + 'px'
    });

    useEffect(() => {
        document.body.onresize = (() =>
            setSettingsWindowStyle({
                '--width': GetWindowSize() + 'px',
                '--height': GetWindowSize() + 'px'
            })
        );
    }, []);

    useEffect(() => {
        setCurrentTitle(name);
    }, [name]);
    
    useEffect(() => {
        if (shown) { setSelectedColour(colour !== null ? COLOURS.map(c => c.split(' ')[0]).indexOf(colour) : 1); }
    }, [shown, colour]);

    function UpdateTitle(e) {
        if (e.target.value.length > MAXIMUM_TITLE_LENGTH) { return; }
        setCurrentTitle(e.target.value);
    }

    function Close(applied) {
        appDispatch({ type: APP_ACTIONS.CLOSE_SETTINGS_WINDOW });
        if (!applied) {
            setCurrentTitle(name);
            setSelectedColour(colour !== null ? COLOURS.map(c => c.split(' ')[0]).indexOf(colour) : 1);
        }
    }
    
    function Apply() {
        appDispatch({ type: APP_ACTIONS.UPDATE_FOLDER, payload: { name: currentTitle, colour: COLOURS[selectedColour]?.split(' ')[0], folderId: appState.selectedFolder.id } });
        Close(true);
    }

    function TextValue({ text, value, className }) {
        return (
            <div class={`text_value ${className}`}>
                <div>{text}</div>
                <div>{value}</div>
            </div>
        );
    }

    function HandleKeyDown(e) {
        if (e.key === 'Escape' && shown) { Close(false); }
    }

    return (
        <div class={`settings_window ${shown ? 'shown' : ''}`} style={{
            ...settingsWindowStyle,
            '--colour': COLOURS[selectedColour]?.split(' ')[0] ?? ''
        }} onKeyDown={HandleKeyDown}>
            <div class='header'>
                <input class='title' value={currentTitle} onChange={UpdateTitle} />
                <IconButton iconURL={delete_icon} tabIndex='-1' toolTip='Close the message box.' Function={() => Close(false)} />
            </div>
            <div class='content'>
                <div class='counters'>
                    <TextValue className='tasks_counter' text='Tasks' value={tasks.length} />
                    <TextValue className='complete_tasks_counter' text='Complete Tasks' value={tasks.filter(task => task.complete).length} />
                    <TextValue className='left_tasks_counter' text='Left Tasks' value={tasks.filter(task => !task.complete).length} />
                </div>
                <div class='colour_wheel'>
                    <TextValue className='folder_colour' text={`Folder's Colour`} value={COLOURS[selectedColour]?.split(' ')[1]} />
                    <ColourPicker selectedColour={selectedColour} setSelectedColour={setSelectedColour} />
                </div>
            </div>
            <div class='buttons'>
                <button onClick={e => Apply()}>Done</button>
                <button onClick={e => Close(false)}>Cancel</button>
            </div>
        </div>
    );
}
