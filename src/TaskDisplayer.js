import React, { useEffect, useState } from 'react';
import './task_displayer.css';
import Input from './Input.js';
import Task from './Task.js';
import IconButton from './IconButton.js';
import plus_icon from './Icons/plus.png';
import { APP_ACTIONS, IsEmpty } from './App.js';

export default function TaskDisplayer({
    appDispatch = () => {},
    appState = {},
    isBlurred = false
}) {
    const [searchedText, setSearchedText] = useState('');
    const [folderColour, setFolderColour] = useState(null);

    useEffect(() => {
        setSearchedText('');
        setFolderColour(appState.selectedFolder?.colour);
    }, [appState.selectedFolder]);

    function AddTask() {
        appDispatch({ type: APP_ACTIONS.ADD_TASK, payload: { folderId: appState.selectedFolder.id, task: { name: searchedText, description: '', complete: false } } });
        setSearchedText('');
    }

    return (
        <div class='task_displayer' style={{
            '--colour': folderColour ?? ''
        }}>
            {
                (!appState.selectedFolder
                || appState.selectedFolder.tasks.length === 0
                || (appState.completeShown && appState.selectedFolder.tasks.filter(task => !appState.completeShown || !task.complete).length === 0)) &&
                <div class='empty_message'>
                    {
                        !appState.selectedFolder ? 'Select a folder from the menu.'
                        : appState.selectedFolder.tasks.length === 0 ? `The folder "${appState.selectedFolder.name}" is currently empty, click the plus icon to add new task.`
                        : `All the tasks in the folder "${appState.selectedFolder.name}" are complete!`
                    }
                </div>
            }
            <div class='tasks_container'>
                {
                    appState.selectedFolder &&
                    appState.selectedFolder.tasks.filter(task => (!appState.sortComplete && !appState.completeShown) || !task.complete)
                    .filter(task => task.name.toLowerCase().includes(searchedText.toLowerCase())
                        || task.description?.toLowerCase().includes(searchedText.toLowerCase()))
                        .map(task => <Task key={task.id} {...task} isBlurred={isBlurred} folderId={appState.selectedFolder.id} colour={folderColour} appState={appState} appDispatch={appDispatch} />)
                }
                { !appState.completeShown && appState.selectedFolder && appState.selectedFolder.tasks.length > 0 && appState.sortComplete && <div class='break_line' /> }
                {
                    !appState.completeShown && appState.sortComplete && appState.selectedFolder &&
                    appState.selectedFolder.tasks.filter(task => task.complete)
                    .filter(task => task.name.toLowerCase().includes(searchedText.toLowerCase())
                        || task.description?.toLowerCase().includes(searchedText.toLowerCase()))
                        .map(task => <Task key={task.id} {...task} isBlurred={isBlurred} transparent folderId={appState.selectedFolder.id} colour={folderColour} appState={appState} appDispatch={appDispatch} /> )
                }
            </div>
                {
                    appState.selectedFolder &&
                    <div class='tasks_field'>
                        <Input text={searchedText} isBlurred={isBlurred} setText={setSearchedText} searchable='true' placeholder='Search...' />
                        <IconButton shown={!IsEmpty(searchedText)} tabIndex={isBlurred ? -1 : 0} iconURL={plus_icon} toolTip='Add new task.' Function={AddTask} />
                    </div>
                }
        </div>
    );
}
