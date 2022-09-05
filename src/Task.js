import React from 'react';
import { APP_ACTIONS } from './App.js';
import { MESSAGE_TYPE } from './MessageBox.js';
import './task.css';
import delete_icon from './Icons/delete.png';
import IconButton from './IconButton.js';

export default function Task({
    appDispatch = () => {},
    appState = {},
    isBlurred = false,
    name = 'task',
    description = null,
    complete = false,
    folderId = 0,
    id = 0,
    transparent = false,
    colour = null
}) {
    const Toggle = () => appDispatch({ type: APP_ACTIONS.TOGGLE_TASK, payload: { folderId, id, complete: !complete } });

    const DeleteAssurance = () => appDispatch({ type: APP_ACTIONS.MESSAGE_BOX_POP_UP, payload: { messageType: MESSAGE_TYPE.ASSURANCE, editable: false, title: 'Delete Task', message: `Are you sure you want to delete the "${name}" task?`, Function: Delete } });

    const Delete = () => appDispatch({ type: APP_ACTIONS.DELETE_TASK, payload: { folderId, id } });

    function ShowDescription(e) {
        if (['mark', 'mark checked', 'icon_button'].includes(e.target.className)) { return; }
        appDispatch({ type: APP_ACTIONS.MESSAGE_BOX_POP_UP, payload: { messageType: MESSAGE_TYPE.INFORMATIVE, editable: true, title: name, message: description, EditFunction: UpdateTask, colour: colour } });
    }
    
    const UpdateTask = (name, description) => appDispatch({ type: APP_ACTIONS.UPDATE_TASK, payload: { folderId, id, name, description } });

    function HandleKeyDown(e) {
        if (isBlurred) { e.target.blur(); return; }

        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                Toggle();
                break;
            case 'Delete':
                if (e.ctrlKey) { Delete(); }
                else { DeleteAssurance(); }
                break;
            case 'Escape':
                document.querySelector('.folder').focus();
                break;
            default:
                break;
        }
    }

    function HandleDeletion(e) {
        if (e.ctrlKey) { Delete(); }
        else { DeleteAssurance(); }
    }

    return (
        <button class={`task ${complete ? 'checked' : ''} ${transparent ? 'transparent' : ''}`} tabIndex={isBlurred ? -1 : 0} onClick={ShowDescription} onKeyDown={HandleKeyDown} style={{
            '--colour' : colour ?? 'var(--main-colour)'
        }}>
            <div class='complete' onClick={Toggle}>
                <div class={'mark' + (complete ? ' checked' : '')} />
            </div>
            <abbr class='name' title={description !== '' ? description : 'Undescritped.'}>{name}</abbr>
            <IconButton iconURL={delete_icon} tabIndex='-1' toolTip='Delete this task.' shown={!!appState.deletionState} Function={HandleDeletion} />
            <div class='underline' />
        </button>
    );
}
