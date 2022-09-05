import React, { useEffect, useState } from 'react';
import { APP_ACTIONS } from './App';
import './folder.css';
import delete_icon from './Icons/delete.png';
import IconButton from './IconButton.js';
import { MESSAGE_TYPE } from './MessageBox.js';

export default function Folder({
    appDispatch = () => {},
    appState = {},
    isBlurred = false,
    name = 'folder',
    selected = false,
    colour = null,
    id = 0
}) {
    const [tasksCount, setTasksCount] = useState(0);
    const MAX_ROTATION = 20;

    useEffect(() => {
        setTasksCount(() =>
            appState.data.folders.find(folder => folder.id === id).tasks.length
        );
    }, [appState.data.folders, id]);

    function Select(e) {
        if (e.target.className === 'icon_button') { return; }
        appDispatch({ type: APP_ACTIONS.SELECT_FOLDER, payload: { id: id } });
    }

    const DeleteAssurance = () => appDispatch({ type: APP_ACTIONS.MESSAGE_BOX_POP_UP, payload: { messageType: MESSAGE_TYPE.ASSURANCE, editable: false, title: 'Delete Task', message: `Are you sure you want to delete the "${name}" folder?\n\nYour entire tasks within this folder will be gone forever if you do so, (A very long time, unrecommended).`, Function: Delete } });
    
    function Delete() {
        if (selected) { appDispatch({ type: APP_ACTIONS.SELECT_FOLDER, payload: { id: -1 } }); }
        appDispatch({ type: APP_ACTIONS.DELETE_FOLDER, payload: { id: id } });
    }

    function HandleDeletion(e) {
        if (e.ctrlKey) { Delete(); }
        else { DeleteAssurance(); }
    }

    function HandleKeyDown(e) {
        if (isBlurred) { e.target.blur(); return; }

        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                document.querySelector('.task')?.focus();
                break;
            case 'Delete':
                if (e.ctrlKey) { Delete(); }
                else { DeleteAssurance(); }
                break;
            default:
                break;
        }
    }

    return (
        <div class={'folder' + (selected ? ' selected' : '')} tabIndex={isBlurred ? -1 : 0} onClick={Select} onFocus={Select} onKeyDown={HandleKeyDown} style={{
            '--rotation': (Math.random() * MAX_ROTATION * 2 - MAX_ROTATION) + 'deg',
            '--colour' : colour ?? 'var(--main-colour)'
        }}>
            <svg viewBox="0 0 24 24">
                <path d="M20,6h-8l-2-2H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8C22,6.9,21.1,6,20,6z"/>
            </svg>
            <abbr class='name' title={tasksCount === 0 ? 'This folder\'s empty.' : `Contains ${tasksCount} task${ tasksCount > 1 ? 's' : '' }.`}>{`${name} ${selected ? '>' : ''}`}</abbr>
            <IconButton iconURL={delete_icon} tabIndex='-1' toolTip='Delete this folder.' Function={HandleDeletion} shown={false} />
            <div class='underline' />
        </div>
    );
}
