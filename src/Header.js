import React from 'react';
import './header.css';

export default function Header() {
    const APP_NAME = "Task List";
    const MAX_ROTATION = 20;

    function Label() {
        let list = [];
        Array.from(APP_NAME).forEach(letter => {
            list.push(<div style={{ '--rotation': (Math.random() * MAX_ROTATION * 2 - MAX_ROTATION) + 'deg' }}>{letter}</div>);
        });
        return list;
    }

    return (
        <div class='header'>
            <h1> <Label /> </h1>
        </div>
    );
}
