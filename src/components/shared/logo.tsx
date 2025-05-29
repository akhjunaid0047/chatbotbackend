// import React from 'react'
import Link from "next/link"// import  Typography  from "@mui/material/Typography";

const logo = () => {
  return (
    <div style={{display:"flex", marginRight:"auto",alignItems:"center",gap:"15px"}}>
      <Link href="/">
        <img src="openai.png" alt="Assembly coders" width={"50px"} height={"50px"}/>
       
      </Link>
      {/* <Typography sx={{display:{md:"block",sm:"none",xs:"none", mr:"auto", fontWeight:"800", textShadow:"2px 2px 20px #000"}}}>
           <span style={{fontSize:"20px"}}>Assembly</span>-Coders
        </Typography> */}
    </div>
  )
}

export default logo
