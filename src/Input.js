import React, { useRef, useState } from 'react';
import './input.css';
import { IsEmpty } from './App.js';
import IconButton from './IconButton.js';
import search_icon from './Icons/search.png';
import delete_icon from './Icons/delete.png';

export default function Input({
    isBlurred = false,
    text = '',
    setText = text => {},
    searchable = false,
    placeholder = 'Text...'
}) {
    const [isInputFocus, setInputFocus] = useState(false);
    const inputRef = useRef();

    const SetValidSearchedText = (e) => setText(IsEmpty(e.target.value) ? '' : e.target.value);

    function HandleKeyDown(e) {
        if (e.key === 'Delete') { 
            if (e.ctrlKey) { setText(''); }
            else { setText(text => text.slice(0, -1)); }
        }
    }

    return (
        <div class='custom_input' onKeyDown={HandleKeyDown}>
        <input ref={inputRef} value={text} tabIndex={isBlurred ? -1 : 0} onChange={e => setText(e.target.value)} onFocus={() => setInputFocus(true)} onBlur={e => { setInputFocus(false); SetValidSearchedText(e); }} />
        <div class='placeholder' style={{
            transform: isInputFocus || !IsEmpty(text) ? 'translate(100%, -50%)' : 'translate(0, -50%)',
            opacity: isInputFocus || !IsEmpty(text) ? 0 : '',
            visibility: isInputFocus || !IsEmpty(text) ? 'hidden' : ''
        }} onClick={() => inputRef.current.focus()}>{placeholder}</div>
        { searchable && <IconButton className={IsEmpty(text) ? 'shown' : ''} iconURL={search_icon} toolTip='Write to search for a folder.' tabIndex='-1' /> }
        <IconButton className={IsEmpty(text) ? '' : 'shown'} tabIndex='-1' iconURL={delete_icon} toolTip='Delete written text.' Function={() => setText('')} />
    </div>
    );
}
