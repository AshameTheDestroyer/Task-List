import React, { useEffect, useState } from 'react';
import './message_box.css';
import IconButton from './IconButton.js';
import delete_icon from './Icons/delete.png';
import { APP_ACTIONS, MAXIMUM_TITLE_LENGTH, GetWindowSize } from './App.js';

export const MESSAGE_TYPE = {
    INFORMATIVE: 'informative',
    ASSURANCE: 'assurance'
};

export default function MessageBox({
    appDispatch = () => {},
    appState = {},
    messageType = MESSAGE_TYPE.INFORMATIVE,
    editable = false,
    title = 'Message',
    message = 'Description goes here...',
    Function = () => {},
    EditFunction = () => {},
    shown = false,
    colour = null
}) {
    const [currentTitle, setCurrentTitle] = useState(title);
    const [currentMessage, setCurrentMessage] = useState(message);

    const [messageBoxStyle, setMessageBoxStyle] = useState({
        '--width': GetWindowSize() + 'px',
        '--height': GetWindowSize() + 'px'
    });

    useEffect(() => {
        document.body.onresize = (() =>
            setMessageBoxStyle({
                '--width': GetWindowSize() + 'px',
                '--height': GetWindowSize() + 'px'
            })
        );
    }, []);

    useEffect(() => {
        setCurrentTitle(title);
    }, [title]);
    
    useEffect(() => {
        setCurrentMessage(message);
    }, [message]);

    function Buttons() {
        switch (messageType) {
            case MESSAGE_TYPE.INFORMATIVE:
                return [
                    <Button key='0' name='OK' Function={Apply} />
                ];
            case MESSAGE_TYPE.ASSURANCE:
                return [
                    <Button key='0' name='Yes' Function={Apply} />,
                    <Button key='1' name='No' Function={() => Close(false)} />
                ];
            default:
                return [];
        }
    }

    function Button({ name, Function = () => {} }) {
        return <button onClick={Function}>{name}</button>;
    }

    function Close(applied) {
        appDispatch({ type: APP_ACTIONS.CLOSE_MESSAGE_BOX });
        if (!applied) {
            setCurrentTitle(title);
            setCurrentMessage(message);
        }
    }
    
    function Apply() {
        EditFunction(currentTitle, currentMessage);
        Function();
        Close(true);
    }

    function TextAreaHandleKeyDown(e) {
        if (e.key === 'Enter') {
            if (!e.ctrlKey) {
                e.preventDefault();
                e.target.nextElementSibling.firstChild.focus();
                return;
            }
            e.target.value += '\n';
        }
    }

    function HandleKeyDown(e) {
        if (e.key === 'Escape' && shown) { Close(false); }
    }

    function UpdateTitle(e) {
        if (e.target.value.length > MAXIMUM_TITLE_LENGTH) { return; }
        setCurrentTitle(e.target.value);
    }

    return (
        <div class={`message_box ${shown ? 'shown' : ''}`} style={{
            ...messageBoxStyle,
            '--colour' : colour ?? ''
        }} onKeyDown={HandleKeyDown}>
            <div class='header'>
                <input class='title' readOnly={!editable} tabIndex={editable ? 0 : -1} value={currentTitle} onChange={UpdateTitle} style={{
                    cursor: editable ? '' : 'default'
                }} />
                <IconButton iconURL={delete_icon} tabIndex='-1' toolTip='Close the message box.' Function={() => Close(false)} />
            </div>
            <textarea class='message' readOnly={!editable} tabIndex={editable ? 0 : -1} value={currentMessage} onChange={e => setCurrentMessage(e.target.value)} onKeyDown={TextAreaHandleKeyDown} style={{
                cursor: editable ? '' : 'default'
            }} />
            <div class='buttons'>{Buttons()}</div>
        </div>
    );
}
