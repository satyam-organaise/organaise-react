import * as React from 'react';
import {getAllUsersFromCognitoIdp} from "../../api/CognitoApi/CognitoApi";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



export default function ModelAddMemberInChannel({AddMemberModel ,setMemberModel}) {
  //const [open, setOpen] = React.useState(false);
 
  const handleClickOpen = () => {
    setMemberModel(true);
  };

  const handleClose = () => {
    setMemberModel(false);
  };



  return (
    
      <Dialog open={AddMemberModel} onClose={handleClose}>
        <DialogTitle>Search and add member</DialogTitle>
        <DialogContent>
          {/* <DialogContentText></DialogContentText> */}
          <TextField
            autoFocus
            size='small'
            margin="dense"
            id="name"
            label="Search member"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
  );
}