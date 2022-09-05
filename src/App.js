import React, { useReducer } from 'react';
import './app.css';
import Header from './Header.js';
import TaskDisplayer from './TaskDisplayer.js';
import FolderDialogue from './FolderDialogue.js';
import AdjustBar from './AdjustBar.js';
import MessageBox from './MessageBox.js';
import SettingsWindow from './SettingsWindow';

const DATA = {
    folders: [
        {
            name: 'Applications',
            tasks: [
                { name: 'Telegram Replica', description: 'I\'m not entirely sure why I put this here.' },
                { name: 'Task List' },
                { name: 'Future App, maybe' }
            ]
        },
        {
            name: 'Songs',
            tasks: [
                { name: 'IDFC' },
                { name: 'Somebody I used to know' },
                { name: 'Anxiety' },
                { name: 'Overwhelmed' }
            ]
        },
        {
            name: 'Games',
            tasks: [
                { name: '2D Minecraft' },
                { name: 'Any Tower Defense' }
            ]
        },
    ]
};

export const MAXIMUM_TITLE_LENGTH = 24;
export const WINDOW_RATIO = 0.7;

export const GetWindowSize = () => Math.min(window.innerWidth, window.innerHeight) * WINDOW_RATIO;

export const APP_ACTIONS = {
    SELECT_FOLDER: 'select_folder',
    DELETE_FOLDER: 'delete_folder',
    ADD_FOLDER: 'add_folder',
    TOGGLE_TASK: 'toggle_task',
    DELETE_TASK: 'delete_task',
    ADD_TASK: 'add_task',
    TOGGLE_COMPLETE_SHOWN: 'toggle_complete_shown',
    TOGGLE_SORT_COMPLETE: 'toggle_sort_complete',
    MESSAGE_BOX_POP_UP: 'message_box_pop_up',
    CLOSE_MESSAGE_BOX: 'close_message_box',
    UPDATE_TASK: 'update_task',
    SORT_ALPHABETICALLY: 'sort_alphabetically',
    SETTINGS_WINDOW_POP_UP: 'settings_window_pop_up',
    CLOSE_SETTINGS_WINDOW: 'close_settings_window',
    UPDATE_FOLDER: 'update_folder'
};

function Reducer(state, { type, payload }) {
    switch (type) {
        case APP_ACTIONS.SELECT_FOLDER:
            return {
                ...state,
                selectedFolder: payload.id === -1 ? null : state.data.folders.find(folder => folder.id === payload.id)
            };
        case APP_ACTIONS.DELETE_FOLDER:
            return {
                ...state,
                data: {
                    ...state.data,
                    folders: state.data.folders.filter(folder => folder.id !== payload.id)
                }
            };
        case APP_ACTIONS.ADD_FOLDER:
            return {
                ...state,
                data: {
                    ...state.data,
                    folders: [...state.data.folders, { ...payload.folder, id: Math.random() }]
                }
            };
        case APP_ACTIONS.TOGGLE_TASK:
            var selectedFolder = state.data.folders.find(folder => folder.id === payload.folderId);
            let tasks = selectedFolder.tasks.map(task => {
                if (task.id !== payload.id) { return task; }
                return {
                    ...task,
                    complete: payload.complete
                };
            });
            selectedFolder.tasks = tasks;
            return {
                ...state,
                selectedFolder: selectedFolder
            };
        case APP_ACTIONS.DELETE_TASK:
            return {
                ...state,
                selectedFolder: {
                    ...state.selectedFolder,
                    tasks: state.selectedFolder.tasks.filter(task => task.id !== payload.id)
                },
                data: {
                    ...state.data,
                    folders: state.data.folders.map(folder => {
                        if (folder.id !== payload.folderId) { return folder; }
                        return {
                            ...folder,
                            tasks: folder.tasks.filter(task => task.id !== payload.id)
                        };
                    })
                }
            };
        case APP_ACTIONS.ADD_TASK:
            return {
                ...state,
                selectedFolder: {
                    ...state.selectedFolder,
                    tasks: [...state.selectedFolder.tasks, { ...payload.task, id: Math.random() }]
                },
                data: {
                    ...state.data,
                    folders: state.data.folders.map(folder => {
                        if (folder.id !== payload.folderId) { return folder; }
                        return {
                            ...folder,
                            tasks: [...folder.tasks, { ...payload.task, id: Math.random() }]
                        };
                    })
                }
            };
        case APP_ACTIONS.TOGGLE_COMPLETE_SHOWN:
            return {
                ...state,
                completeShown: payload.completeShown
            };
        case APP_ACTIONS.TOGGLE_SORT_COMPLETE:
            return {
                ...state,
                sortComplete: payload.sortComplete
            };
        case APP_ACTIONS.MESSAGE_BOX_POP_UP:
            setTimeout(() => document.querySelector('.message_box .message').focus(), 100);
            return {
                ...state,
                messageBoxProperties: {
                    title: payload.title,
                    message: payload.message,
                    messageType: payload.messageType,
                    editable: payload.editable,
                    Function: payload.Function,
                    EditFunction: payload.EditFunction,
                    colour: payload.colour,
                    shown: true
                }
            };
        case APP_ACTIONS.CLOSE_MESSAGE_BOX:
            return {
                ...state,
                messageBoxProperties: { ...state.messageBoxProperties, shown: false }
            };
        case APP_ACTIONS.UPDATE_TASK:
            return {
                ...state,
                selectedFolder: {
                    ...state.selectedFolder,
                    tasks: state.selectedFolder.tasks.map(task => {
                        if (task.id !== payload.id) { return task; }
                        return {
                            ...task,
                            name: payload.name,
                            description: payload.description
                        };
                    })
                },
                data: {
                    ...state.data,
                    folders: state.data.folders.map(folder => {
                        if (folder.id !== payload.folderId) { return folder; }
                        return {
                            ...folder,
                            tasks: folder.tasks.map(task => {
                                if (task.id !== payload.id) { return task; }
                                return {
                                    ...task,
                                    name: payload.name,
                                    description: payload.description
                                };
                            })
                        };
                    })
                }
            };
        case APP_ACTIONS.SORT_ALPHABETICALLY:
            let sortedTasks = [...state.selectedFolder.tasks];
            sortedTasks.forEach((task, i) => {
                sortedTasks.forEach((task_, j) => {
                    if ((!payload.reversed && (task.name.toLowerCase() < task_.name.toLowerCase()))
                    || (payload.reversed && (task.name.toLowerCase() > task_.name.toLowerCase()))) {
                        let temp = sortedTasks[i];
                        sortedTasks[i] = sortedTasks[j];
                        sortedTasks[j] = temp;
                    }
                });
            });

            return {
                ...state,
                selectedFolder: {
                    ...state.selectedFolder,
                    tasks: sortedTasks
                },
                data: {
                    ...state.data,
                    folders: state.data.folders.map(folder => {
                        if (folder.id !== state.selectedFolder.id) { return folder; }
                        return {
                            ...folder,
                            tasks: sortedTasks
                        };
                    })
                }
            };
        case APP_ACTIONS.SETTINGS_WINDOW_POP_UP:
            setTimeout(() => document.querySelector('.settings_window .title').focus(), 100);
            return {
                ...state,
                settingsWindowProperties: {
                    name: payload.name,
                    colour: payload.colour,
                    tasks: payload.tasks,
                    shown: true
                }
            };
        case APP_ACTIONS.CLOSE_SETTINGS_WINDOW:
            return {
                ...state,
                settingsWindowProperties: {
                    ...state.settingsWindowProperties,
                    shown: false
                }
            };
        case APP_ACTIONS.UPDATE_FOLDER:
            return {
                ...state,
                selectedFolder: {
                    ...state.selectedFolder,
                    name: payload.name,
                    colour: payload.colour
                },
                data: {
                    ...state.data,
                    folders: state.data.folders.map(folder => {
                        if (folder.id !== payload.folderId) { return folder; }
                        return {
                            ...folder,
                            name: payload.name,
                            colour: payload.colour
                        };
                    })
                }
            };
        default:
            return state;
    }
}

export const IsEmpty = text => [...text].every(c => c === ' ');

export default function App() {
    const [state, dispatch] = useReducer(Reducer, { data: DATA, sortComplete: true });

    state.data.folders.forEach(folder => {
        folder.id ??= Math.random();
        folder.tasks ??= [];
        folder.tasks.forEach(task => {
            task.id ??= Math.random();
            task.complete ??= false;
            task.description ??= '';
        });
    });

    const IsBlurred = () => state.messageBoxProperties?.shown || state.settingsWindowProperties?.shown;
    
    return (
        <>
            <div id='page'>
                <Header />
                <div id='main'>
                    <FolderDialogue appState={state} appDispatch={dispatch} data={state.data} isBlurred={IsBlurred()} />
                    <TaskDisplayer appState={state} appDispatch={dispatch} isBlurred={IsBlurred()} />
                    <AdjustBar appState={state} appDispatch={dispatch} isBlurred={IsBlurred()} />
                </div>
            </div>
            <MessageBox appState={state} appDispatch={dispatch} {...state.messageBoxProperties} />
            <SettingsWindow appState={state} appDispatch={dispatch} {...state.settingsWindowProperties} />
        </>
    );
}
