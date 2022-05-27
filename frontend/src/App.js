import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { TextField, Button } from '@material-ui/core';

function App() {

    let data =[
        {
            name: 'Devon',
            id: 12,
            tasks: [
                {
                    taskName: "mow the grass",
                    isComplete: false,
                    order: 1
                },
                {
                    taskName: "eat some tea",
                    isComplete: true,
                    order: 3
                },
                {
                    taskName: "cry",
                    isComplete: false,
                    order: 2
                }
            ]
        },
        {
            name: "Johnny",
            id: 52,
            tasks: [
                {
                    taskName: "woohoo ur dad",
                    isComplete: false
                },
                {
                    taskName: "sleep",
                    isComplete: true
                },
                {
                    taskName: "snore",
                    isComplete: false
                }
            ]
        }
    ]

    const [personalTasks, setPersonalTasks] = useState({});
    const [myTasks, setMyTasks] = useState([]);
    const [signedInUser, setSignedInUser] = useState(12);
    const [forceRefresh, setForceRefresh] = useState({});

    useEffect(() => {
        console.log('refreshing...')
        console.log(myTasks)
    }, [forceRefresh])

    useEffect(() => {
        setMyTasks(data);
    }, [])


    return (
        <div className="App">
            {
                myTasks.map((user, index) => {
                    return (
                        <div>
                            <p>
                                {user.name}
                            </p>
                            {          
                            Array.isArray(user.tasks) ?
                            user.tasks.map( (task) => {
                                    return (
                                        <p>
                                            {task.taskName}
                                        </p>
                                    );
                            }) : null }
                            {
                             user.id === signedInUser &&
                                <span>
                                    <TextField id="filled-basic" label="Filled" variant="filled" />
                                        <Button onClick={() => {
                                            const newState = myTasks.map( (user) => {
                                                if(user.id === 12) {
                                                    user.tasks.push( {taskName: 'Wahoo', isComplete: false, order: 4})
                                                }
                                                return user
                                            })
                                            setMyTasks(newState)
                                        }}>
                                            Send
                                        </Button>
                                </span>
                            }
                        </div>
                    )
                    
                })
            }
            
        </div>
    );
}

export default App;
