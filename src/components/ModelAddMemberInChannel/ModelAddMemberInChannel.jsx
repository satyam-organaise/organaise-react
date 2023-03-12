import * as React from 'react';
import { getAllUsersFromCognitoIdp } from "../../api/CognitoApi/CognitoApi";
import appConfig from "../../Config";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify';
import { createChannelMembership } from "../../api/ChimeApi/ChimeApi"



export default function ModelAddMemberInChannel({ AddMemberModel, setMemberModel, AddAllUsers, ActiveChannel, user_id }) {

  ////////// Select User Store Here /////////
  const [AddChannelUserSelect, setAddingChannelUser] = React.useState({});

  const handleClickOpen = () => {
    setMemberModel(true);
  };

  const handleClose = () => {
    setMemberModel(false);
  };

  /////////// When click on the select user then this function run here
  const selectUserFun = async (user) => {
    //const confermation =  window.confirm(`Are you sure do you want to adding ${user.lable} in the channel?`);
    const confrmation = window.confirm(`Are you sure do you want to select ${user.label} for the channel?`);
    if (!confrmation) {
      return;
    }
    setAddingChannelUser(user);
    toast.info("User select successfully please click on the subscribe button.");
  }


  ///////// when click on the subscribe button
  const AddMemberButton = async (selectChannel, selectUser, user_id) => {
    try {
      const membership = await createChannelMembership(
        selectChannel.ChannelArn,
        `${appConfig.appInstanceArn}/user/${selectUser.value}`,
        user_id,
        undefined //activeChannel.SubChannelId
      );
      const memberships = []  ///activeChannelMemberships;
      memberships.push({ Member: membership });
      handleClose();
      return { status: true, data: memberships }
    } catch (err) {
      toast.error("Something is wrong please try after some time");
      console.log("error in adding member in channel", err);
      return { status: false, error: err };
    }
  }


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
        {AddAllUsers.length !== 0 &&
          AddAllUsers.map((users) =>
            <Typography variant="subtitle2" color="#333" onClick={() => selectUserFun(users)}>{users.label}</Typography>
          )

        }
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => AddMemberButton(ActiveChannel, AddChannelUserSelect, user_id)}>Subscribe</Button>
      </DialogActions>
    </Dialog >
  );
}