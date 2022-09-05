import React from 'react';
import './icon_button.css';

export default function IconButton({
    className = '',
    iconURL = '',
    toolTip = '',
    Function = () => {},
    tabIndex = 0,
    shown = null,
    toggled = false,
    enabled = true
}) {
    function HandleKeyDown(e) {
        if (tabIndex === 0 && enabled) { return; }
        e.preventDefault();
        e.target.blur();
    }

    return (
        <abbr class={`icon_button_container ${toggled ? 'toggled' : ''} ${className} ${enabled ? '' : 'disabled'} ${shown === null ? '' : shown ? 'shown' : 'hidden'}`} title={toolTip} onKeyDown={HandleKeyDown}>
            <button class='icon_button' style={{
                backgroundImage: `url(${iconURL})`,
                backgroundColor: iconURL ? '' : 'red',
                color: iconURL ? '' : 'white'
            }} disabled={!enabled} onClick={Function} tabIndex={tabIndex}>
                {!iconURL && 'X'}
            </button>
        </abbr>
    );
}
