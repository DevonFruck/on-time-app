import React, { useState } from "react";
import { Dialog, TextField, Button, DialogTitle, DialogContent } from "@material-ui/core";
import axios from "axios";
import "./LoginModal.css";

function LoginModal({ signedInUser, setSignedInUser }) {

    // Determines whether the modal displays info to login or add (create) a user.
    const [addUserModal, setAddUserModal] = useState(false);
    const [username, setUsername] = useState('');
    const [displayName, setDisplayname] = useState('');
    const [allowClick, setAllowClick] = useState(true);

    async function login() {
        setAllowClick(false);
        await axios.post("http://localhost:3001/user/authenticate", {username: username})
          .then( res => {
            setSignedInUser(res.data.userId);
        }).catch(() => {
            console.log('Login request failed.')
        })
        setAllowClick(true);
    }

    return (
        <Dialog open={signedInUser === null}>
        {addUserModal ?
            <div className="modal-content">
                <DialogTitle>
                    Add User!
                </DialogTitle>
                <DialogContent>
                    I decided to not make this super secure since its just a task list app. so only a username will be required to login.
                    <div className="text-fields">
                        <TextField 
                            value={username}
                            placeholder="Username"
                            variant="filled"
                            helperText="You will use this to login (no password)"
                            onChange={(event) => {setUsername(event.target.value)}}
                        />

                        <TextField
                            value={displayName}
                            placeholder="Display name"
                            variant="filled"
                            helperText="This is the name everyone will see"
                            onChange={(event) => {setDisplayname(event.target.value)}}    
                        />
                    </div>
                    <div className="btn-row">
                        <Button
                            variant="contained"
                            disabled={!allowClick}
                            onClick={() => {
                                setAddUserModal(false)
                            }}    
                        >
                            Back to login
                        </Button>
                        <Button 
                            variant="contained"
                            disabled={!allowClick}
                            onClick={() => {
                                setAddUserModal(false)
                            }}    
                        >
                            Create userData
                        </Button>
                    </div>
                </DialogContent>
            </div>


        :  
            <div>
            <DialogTitle>
                Add User!
            </DialogTitle>
            <DialogContent>
                Existing user!
                <TextField 
                    value={username}
                    placeholder="Username"
                    variant="filled"
                    helperText="You will use this to login (no password)"
                    onChange={(event) => {setUsername(event.target.value)}}
                />
                <div className="btn-row">
                    <Button 
                        variant="contained"
                        disabled={!allowClick}
                        onClick={() => {
                            setAddUserModal(true)
                        }}    
                        >
                        Create an account
                    </Button>
                    <Button 
                        variant="contained"
                        disabled={!allowClick}
                        onClick={async () => {
                            await login();
                        }}    
                        >
                        Submit
                    </Button>
                </div>
            </DialogContent>
            </div>
        }</Dialog>
    )
}

export default LoginModal;
