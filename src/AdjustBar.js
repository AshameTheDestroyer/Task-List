import React from 'react';
import './adjust_bar.css';
import IconButton from './IconButton.js';
import settings_icon from './Icons/settings.png';
import checked_icon from './Icons/checked.png';
import sort_icon from './Icons/sort.png';
import sort_alphabetically_icon from './Icons/sort_alphabetically.png';
import { APP_ACTIONS } from './App.js';

export default function AdjustBar({
    appDispatch = () => {},
    appState = {},
    isBlurred = false
}) {
    const ToggleCompleteShown = () => appDispatch({ type: APP_ACTIONS.TOGGLE_COMPLETE_SHOWN, payload: { completeShown: !appState.completeShown } });

    const ToggleSortComplete = () => appDispatch({ type: APP_ACTIONS.TOGGLE_SORT_COMPLETE, payload: { sortComplete: !appState.sortComplete } });

    const SortAlphabetically = e => appDispatch({ type: APP_ACTIONS.SORT_ALPHABETICALLY, payload: { reversed: e.ctrlKey } });

    const OpenSettingsWindow = () => appDispatch({ type: APP_ACTIONS.SETTINGS_WINDOW_POP_UP, payload: appState.selectedFolder });

    return (
        <div class='adjust_bar'>
            <IconButton iconURL={checked_icon} tabIndex={isBlurred ? -1 : 0} toolTip={`${appState.completeShown ? 'Hide' : 'Show'} complete tasks.`} Function={ToggleCompleteShown} toggled={appState.completeShown} />
            <IconButton iconURL={sort_icon} tabIndex={isBlurred ? -1 : 0} enabled={!appState.completeShown} toolTip='Toggle sorting complete tasks.' Function={ToggleSortComplete} toggled={appState.sortComplete} />
            <IconButton iconURL={sort_alphabetically_icon} enabled={!!appState.selectedFolder} tabIndex={isBlurred ? -1 : 0} toolTip='Sorts the tasks in this folder alphabetically.' Function={SortAlphabetically} />
            <IconButton iconURL={settings_icon} tabIndex={isBlurred ? -1 : 0} enabled={!!appState.selectedFolder} toolTip={`Change the settings of the folder.`} Function={OpenSettingsWindow} />
        </div>
    );
}
