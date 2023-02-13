import "./App.css";
import { SmsClient } from "@azure/communication-sms";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  AcceptIcon,
  Avatar,
  Box,
  Button,
  Card,
  Chat,
  ChatOffIcon,
  Flex,
  Grid,
  Header,
  Input,
  SendIcon,
  Text
} from '@fluentui/react-northstar'
import LCC from 'lightning-container';

const baseURL ="https://cb69-2402-e280-3e07-401-5836-598d-f841-e33c.in.ngrok.io";

function App() {
  const connectionString = `endpoint=https://salesforce-acs.communication.azure.com/;accesskey=xirxA5/+txUsus6AKMaErJMzR2yRtYRhxa+iIkKj3/xOwp9o1VmcvH+Ru8YWWh0Mr8dUoDLBbfG6iIG6DxszSA==`;
  const client = new SmsClient(connectionString);
  const [messageFromUser, setMessageFromUser] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [chatAccepted, setChatAccepted] = useState(false);
  const [showIncomingMessage, setshowIncomingMessage] = useState(false);

  useEffect(() => {
    setInterval(() => {
      axios.post(baseURL).then((res) => {
        if (res.data.message && !res.data.message.message.includes("Sent from your Twilio trial account - Thanks for the message. Configure your number's SMS URL")) {
          console.log(res.data.message.from);
          setMessageFromUser(res.data.message.message);
          setUserNumber(res.data.message.from);
          LCC.sendMessage({
            name: 'getContactNameFromPhoneNumber',
            value: res.data.message.from
          })
          setshowIncomingMessage(true);
        }
      }).catch(err => {
        console.log(err);
      });
    }, 1000);
    LCC.addMessageHandler(messageRecievedHandler);
    return () => LCC.removeMessageHandler(messageRecievedHandler)
  },[]);

  const messageRecievedHandler = ({ name, value}) => {
    console.log("Messaged received.");
    console.log(`Message name: ${name}`);
    console.log(`Message value: ${value}`);
    setUserName(value);
  }

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

  //Fluent UI Chat Componet
  const ChatComponent = ({ sendSMS, receivedText }) => {
    const [message, setMessage] = useState('');
    const [items, setItems] = useState([]);
      
    const __sendMessage = () => {
        setItems((currentItems) => [...currentItems, {
            gutter: <Avatar {...robinAvatar} />,
            message: <Chat.Message content={message} author="Chat Agent" mine style={{width: '200px'}}/>,
            attached: 'top',
            contentPosition: 'end',
            key: items.length,
          }]);
        sendSMS(message);
        setMessage('');
    };

    useEffect(() => {
        setItems((currentItems) => [...currentItems, {
            gutter: <Avatar {...timAvatar}/>,
            message: <Chat.Message content={receivedText} density={'compact'} author="Salesforce User" />,
            attached: 'top',
            key: items.length,
          }]);
    }, [receivedText]);

    const [robinAvatar, timAvatar] = [
        'Chat Agent',
        'Salesforce User',
      ].map(user => ({
        name: user,
        status: {
          color: 'green',
          icon: <AcceptIcon />,
        },
      }))

    return (
        <div style={{padding: '10px'}}>
        {/* <Header as="h5" content="Team Sigma Chat Window"  style={{textAlign: 'center'}} /> */}
        
        <Chat items={items} style={{minHeight: '306px' , padding: '10px'}}/>
        <Input
            fluid
            icon={<SendIcon onClick={(e)=> {
                if (message !=="") {
                    __sendMessage();
                    e.target.value = '';
                }
                }}
            />}
            placeholder="Type here..."
            styles={{marginTop: '2px'}}
            onChange={event => { 
                setMessage(event.target.value); 
            }}
            value={message}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && message !=="") {
                    __sendMessage(e);
                    e.target.value = '';
                }
              }
            }
        />
        </div>
    );
  }

  const ActionsCard = ({setOnChatAccept, setOnReject}) => (
    <Card aria-roledescription="card with action buttons" style={{alignItems: 'center', height: '130px'}}>
      <Flex column>
        <Text content={` You have got incoming message from ${userName}`} weight="bold" styles={{fontSize: '10px'}}/>
      </Flex>
      <Flex style={{columnGap: '30px', margin: '12%'}}>
        <Button content="Accept" primary onClick={() => setOnChatAccept(true) } />
        <Button content="Reject" secondary onClick={() => setOnReject(false)}  styles={{backgroundColor: '#f44336', color: 'white'}} />
      </Flex>
    </Card>
  );

  return (
    <React.Fragment>
      {chatAccepted ? (
          <>
            <ChatComponent sendSMS={sendSMS} receivedText={messageFromUser} />
            <Button icon={<ChatOffIcon />} iconPosition="before" content="Leave" primary styles={{margin: '33%', marginTop: '10px', backgroundColor: '#f44336', color: 'white'}} onClick={onEndChat} /> 
          </>   
      ) : (
        <Grid style={{margin: '25% 25%'}} >
          { showIncomingMessage && <Grid>
            <Box>
              <ActionsCard setOnChatAccept={setChatAccepted} setOnReject={setshowIncomingMessage} />
            </Box>
            </Grid>
          }
        </Grid>
      )}
      {!chatAccepted && !showIncomingMessage && <Header as="h2" content="On this page chat window will apear"  style={{textAlign: 'center'}} />}
   </React.Fragment>
  );
}

export default App;
