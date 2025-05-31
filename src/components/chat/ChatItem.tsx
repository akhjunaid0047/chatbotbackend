import { Box, Avatar, Typography } from "@mui/material";
// import { useAuth } from '../../context/AuthContext';
import Markdown from 'react-markdown'
import Image from "next/image";

const ChatItem = ({content,role,}:{content: string; role:"user"|"assistant"}) => {
    // const auth = useAuth();
  return (
    role === "assistant" ?(
         <Box sx={{display:"flex", p:2, bgcolor:"#004d5612", my:2 , gap:2}}>
            <Avatar sx={{ml:0}}>
                <Image src="openai.png" alt="OpenAI" width={"50"} />
            </Avatar>
            <Box>
                <Typography fontSize={"20px"}><Markdown>{content}</Markdown></Typography>
            </Box>
         </Box>
  ):(
    <Box sx={{display:"flex", p:2, bgcolor:"#004d56", my:2 , gap:2}}>
    <Avatar sx={{ml:"0", bgcolor:"black", color:"white"}}>
        {/* {auth?.user?.name[0]} */}
        {/* {auth?.user?.name.split(" ")[1][0]} */}
    </Avatar>
    <Box>
        <Typography fontSize={"20px"}>{content}</Typography>
    </Box>
 </Box>
));
};

export default ChatItem

