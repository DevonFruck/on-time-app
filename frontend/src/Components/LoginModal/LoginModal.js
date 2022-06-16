import React, { useEffect, useState } from "react";
import { Dialog, TextField, Button, DialogTitle, DialogContent } from "@material-ui/core";
import styled, { css } from 'styled-components'
import "./LoginModal.css";

function LoginModal() {

    // Determines whether the modal displays info to login or add (create) a user.
    const [addUserModal, setAddUserModal] = useState(true);
    const [username, setUsername] = useState('');
    const [displayName, setDisplayname] = useState('');

    return (
        <Dialog open>
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
                    <div className="submit-btn">
                        <Button 
                            variant="contained"
                            onClick={() => {
                                setAddUserModal(false)
                            }}    
                        >
                            Submit
                        </Button>
                    </div>
                </DialogContent>
            </div>


        :   
            <ModalContent>
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
                        onClick={() => {
                            setAddUserModal(true)
                        }}    
                        >
                        Create an account
                    </Button>
                    <Button 
                        variant="contained"
                        onClick={() => {
                            setAddUserModal(false)
                        }}    
                        >
                        Submit
                    </Button>
                </div>
            </ModalContent>
        }</Dialog>
    )
}

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 5rem;
`



export default LoginModal;
