import "./App.css";
import { SmsClient } from "@azure/communication-sms";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatController, MuiChat } from "chat-ui-react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Grid,
  Typography,
} from "@mui/material";

const baseURL ="https://e47d-2402-e280-3e07-401-15f9-8880-3ec2-b3f8.in.ngrok.io";

function App() {
  const connectionString = `endpoint=https://salesforce-acs.communication.azure.com/;accesskey=xirxA5/+txUsus6AKMaErJMzR2yRtYRhxa+iIkKj3/xOwp9o1VmcvH+Ru8YWWh0Mr8dUoDLBbfG6iIG6DxszSA==`;
  const client = new SmsClient(connectionString);
  const [messageFromUser, setMessageFromUser] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const [chatCtl] = React.useState(new ChatController());
  const [chatAccepted, setChatAccepted] = useState(false);
  const [showIncomingMessage, setshowIncomingMessage] = useState(false);

  useEffect(() => {
    const startIcon = document.getElementsByClassName("MuiButton-startIcon");
    if (startIcon[0]) {
      startIcon[0].style.display = "none";
    }

    setInterval(() => {
      axios.post(baseURL).then((res) => {
        if (res.data.message && !res.data.message.message.includes("Sent from your Twilio trial account - Thanks for the message. Configure your number's SMS URL")) {
          console.log(res.data.message.from);
          setMessageFromUser(res.data.message.message);
          setUserNumber(res.data.message.from);
          setshowIncomingMessage(true);
        }
      }).catch(err => {
        console.log(err);
      });
    }, 1000);

    chatCtl.setActionRequest({ type: "text", always: true }, (response) => {
      sendSMS(response.value);
    });
  });

  const displayUserMessage = async () => {
    await chatCtl.addMessage({
      type: "text",
      content: messageFromUser,
      self: false,
    });
  };

  
  useEffect(() => {
    if (chatAccepted) {
      chatCtl.clearMessages();
    }
  }, [chatAccepted]);

  useEffect(() => {
    if (chatAccepted) {
      displayUserMessage();
    }
  }, [chatAccepted, messageFromUser]);

  const sendSMS = async (message) => {
    const sendResults = await client.send(
      {
        from: "+18662297810", // Your E.164 formatted phone number used to send SMS
        to: [userNumber], // The list of E.164 formatted phone numbers to which message is being sent
        message: message, // The message being sent
      },
      {
        enableDeliveryReport: true,
        tag: "testing-sugma",
      }
    );

    for (const sendResult of sendResults) {
      if (sendResult.successful) {
        console.log("Success: ", sendResult);
      } else {
        console.error(
          "Something went wrong when trying to send this message: ",
          sendResult
        );
      }
    }
  };

  const onEndChat = () => {
    setChatAccepted(false);
    setshowIncomingMessage(false);
    sendSMS("Agent ended the chat")
  }

  return (
    <React.Fragment>
      {chatAccepted ? (
           <Grid container style={{height:"100%" , width:'94%'}}>
            <Grid item xs={12} sx={{height:"90%"}}>
            <MuiChat chatController={chatCtl} />
            </Grid>
            <Grid item xs={12} sx={{height:"10%",  marginTop:"17px"}}>
            <Button variant="contained" style={{width:"100%", marginLeft:"7px", height:"auto"}} onClick= {onEndChat}>End Chat</Button>
            </Grid>
           </Grid>      
      ) : (
        <Grid container>
          { showIncomingMessage ? <Grid item>
            
              <Box sx={{ width: '260px', margin: '10px', marginTop: '125px', marginLeft: "35px"}}>
                <Card variant="outlined" sx={{padding:'10px', background: 'rgb(2, 136, 209)' , color: 'white'}} raised>
                  <Typography variant="p">
                    You have got incoming message from {userNumber}
                  </Typography>
                  <ButtonGroup
                  sx={{marginTop: 2}}
                    disableElevation
                    variant="contained"
                    aria-label="Disabled elevation buttons"
                  >
                    <Button onClick={() => setChatAccepted(true)} color="success">
                      Accept
                    </Button>
                    <Button color="error" sx={{ marginLeft: 2 }} onClick={() => setshowIncomingMessage(false)}>
                      Reject
                    </Button>
                  </ButtonGroup>
                </Card>
              </Box>
              </Grid>
             : 
             <Typography variant="subtitle2" sx={{margin:10, marginTop: '201px'}}>
             Team Sigma Chat Window
         </Typography>
            }
        
        </Grid>
      )}
   </React.Fragment>
  );
}

export default App;
