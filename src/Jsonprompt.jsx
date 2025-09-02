import { GoogleGenerativeAI } from '@google/generative-ai';
import { useState,useRef } from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
function Jsonprompt() {
  const [userprompt,setuserprompt] = useState('')
  const [loading,setloading] = useState(false)
  const [chat,setchat] = useState([])
  const [chatid,setchatid] = useState(0)
  const [history,sethistory] = useState('')
  const ai = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
  const targetRef = useRef(null);
  function handleScroll(){
    targetRef.current?.scrollIntoView({ behavior: "smooth",block: "end"});
  }
  async function run() {
    const model = ai.getGenerativeModel({model: "gemini-2.5-flash"})
    const prompt = `you are an AI model , you are responsible for converting the normal
     prompt to the structured json prompt to get the best output from the any model, start with some text what you will do , 
    then give the json prompt , you are used only for the converting the normal prompt to json prompt not for any other purpose .
    response slightly based on previous conversation ${history}
     the user current query is ${userprompt}`
    const tempuserprompt = userprompt
    setuserprompt('')
    const result = await model.generateContent(prompt)   
    const response = await result.response;
    const text = response.text()
    setloading(false)
    const newentry = {id:chatid,userrequest:tempuserprompt,airesponse : text}
    sethistory(prev=>prev+(` userquery->${chatid} is ${tempuserprompt} and AIresponse->${chatid} is ${text}`))
    setchat(prev=>[...prev,newentry])
    handleScroll()
    setchatid(prev=>prev+1)
  }
  function Handlesetprompt(e){
    setuserprompt(e.target.value)
  }
  function Handleenter(e){
    if(e.key==="Enter"){
      Handlesendreq()
    }
  }
  function Handlesendreq(){
    setloading(true)
    run()
  }
  
  return (
    <div>
      <br />
      <div className='text-center'>
        <span className='text-primary fs-3 fw-bold'>JSON PROMPT GENERATOR </span>
      </div>
      <div className='chat-input-container'>
        <input type="text" value={userprompt} onChange={Handlesetprompt} onKeyDown={Handleenter} placeholder='Ask Anything' /> 
        {(!loading)?(!userprompt.length?<i className="bi bi-arrow-up-circle ms-2" ></i>:<i className="bi bi-arrow-up-circle-fill ms-2" onClick={()=>Handlesendreq()}></i>):
        <div className="spinner-grow spinner-grow-md" role="status" style={{backgroundColor:"#6A1B9A"}}>
          <span className="visually-hidden">Loading...</span>
        </div>}
      </div>
      {chat&&chat.map((eachchat)=><div key={eachchat.id} className='container-fluid'>
        <div className='d-flex justify-content-end'>
          <div className=' my-3 p-3 rounded' style={{backgroundColor:"#FFFF",maxWidth:'50vw',width:'fit-content'}}>
            <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            >{eachchat.userrequest}</ReactMarkdown>
          </div>
        </div>
        <div className='my-3 py-5 px-2 w-100 rounded markdown' style={{backgroundColor:"#FFFF"}}>
          <ReactMarkdown
          remarkPlugins={[remarkGfm]}
           components={{
              code(props) {
                const { node, className, children, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    {...rest}
                    PreTag="div"
                    children={String(children)}
                    language={match[1]}
                    style={atomDark}
                  >
                    
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...rest}>
                    {children}
                  </code>
                );
              },
            }}
           >{eachchat.airesponse}</ReactMarkdown>
        </div>
      </div>)}
      {!history && <div className='text-center mt-5 text-secondary'>Your chat is not saved and will disappear if you reload or leave the page. <br />
This is a temporary session – no data is stored.</div>}
      <div  className='text-center text-secondary caution'> AI may make mistakes. Check important info. </div>
      <div ref={targetRef}></div>
    </div>
  )
}
export default Jsonprompt
