import React, { useState } from "react";
import { Dialog, TextField, Button, DialogTitle, DialogContent } from "@material-ui/core";
import axios from "axios";
import "./LoginModal.css";

export function LoginModal({ signedInUser, setSignedInUser }) {

    // Determines whether the modal displays info to login or add (create) a user.
    const [addUserModal, setAddUserModal] = useState(false);
    const [username, setUsername] = useState('');
    const [displayName, setDisplayname] = useState('');
    const [allowClick, setAllowClick] = useState(true);
    const [openErrorModal, setOpenErrorModal] = useState(false);

    async function login() {
        setAllowClick(false);
        await axios.post("http://localhost:3001/user/authenticate", {username: username})
          .then( res => {
            setSignedInUser(res.data.userId);
        }).catch(() => {
            console.log('Login request failed.')
            setOpenErrorModal(true);
        })
        setAllowClick(true);
    }

    async function createUser() {
        const reqBody = { username: username, displayName: displayName }
        await axios.put("http://localhost:3001/user/create", reqBody)
          .then( res => {
            console.log(res)
            setAddUserModal(false)
            setDisplayname('');
          }).catch(() => {

          })
    }

    return (
        <Dialog open={signedInUser === null} >
        {addUserModal ?
            <div className="modal-content">
                <DialogTitle>
                    Add User!
                </DialogTitle>
                <DialogContent>
                    I decided to not make this super secure since it's just a task list app. so only a username will be required to login.
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
                            onClick={async () => {
                                await createUser();
                                //setAddUserModal(false)
                            }}    
                        >
                            Create user
                        </Button>
                    </div>
                </DialogContent>
            </div>


        :  
            <div>
            <DialogTitle>
                Existing User!
            </DialogTitle>
            <DialogContent>
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
                        New User
                    </Button>
                    <Button 
                        variant="contained"
                        disabled={!allowClick}
                        onClick={async () => {
                            await login();
                        }}    
                        >
                        Login
                    </Button>
                </div>
            </DialogContent>
            <Dialog open={openErrorModal}>
                        Username could not be found. Try creating a user!
                        <Button variant="contained" onClick={()=>{ setOpenErrorModal(false) }}>
                            Continue
                        </Button>
            </Dialog>
            </div>
        }</Dialog>

    )
}
