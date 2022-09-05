import React, { useState } from 'react';
import './folder_dialogue.css';
import Folder from './Folder.js';
import Input from './Input.js';
import IconButton from './IconButton.js';
import plus_icon from './Icons/plus.png';
import { APP_ACTIONS, IsEmpty } from './App.js';

export default function FolderDialogue({
    appDispatch = () => {},
    appState = {},
    isBlurred = false,
    data = {}
}) {
    const [searchedText, setSearchedText] = useState('');

    function AddFolder() {
        appDispatch({ type: APP_ACTIONS.ADD_FOLDER, payload: { folder: { name: searchedText, tasks: [] } } });
        setSearchedText('');
    }

    function HandleKeyDown(e) {
        if (e.key === 'Escape') {
            appDispatch({ type: APP_ACTIONS.SELECT_FOLDER, payload: { id: -1 } });
            e.target.blur();
        }
    }

    return (
        <div class='folder_dialogue' onKeyDown={HandleKeyDown}>
            <div class='folders_container'>
                {
                    data.folders.filter(folder => folder.name.toLowerCase().includes(searchedText.toLowerCase()))
                        .map(folder => <Folder key={folder.id} {...folder} isBlurred={isBlurred} selected={appState.selectedFolder?.id === folder.id} appState={appState} appDispatch={appDispatch} />)
                }
            </div>
            <div class='folders_field'>
                <Input text={searchedText} setText={setSearchedText} isBlurred={isBlurred} searchable='true' placeholder='Search...' />
                <IconButton shown={!IsEmpty(searchedText)} iconURL={plus_icon} toolTip='Add new folder.' Function={AddFolder} />
            </div>
        </div>
    );
}
