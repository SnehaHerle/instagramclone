import React, {useState, useEffect} from 'react'
import M from 'materialize-css'
import {Link, useHistory} from 'react-router-dom'

const CreatePost = () => {

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const history = useHistory()

    useEffect( ()=>{
        if(url){
        fetch("/createpost", {
            method: "post",
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title:title,
                body:body,
                pic:url
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error,
                classes: "#f44336 red"})
            }
            else{
                M.toast({html: "Created a post successfully!",
                classes: "#4caf50 green"})
                history.push('./')
            }
        }).catch(err=>{
            console.log(err)
        })
        }
    },[url]) 

    const postDetails = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset","instagram-clone")
        data.append("cloud_name","cloud29sep20")

        fetch("https://api.cloudinary.com/v1_1/cloud29sep20/image/upload", {
            method: "post",
            body: data 
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
    }

return(
    <div className = "card imput-field" style= {{
        margin: "200px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center"
    }}>
        <input type="text" 
        placeholder = "Title"
        value = {title}
        onChange= {(e)=>{setTitle(e.target.value)}}
        />

        <input type="text" 
        placeholder = "Body"
        value = {body}
        onChange= {(e)=>{setBody(e.target.value)}}
        />

        <div className="file-field input-field">
            <div className="btn">
                <span>Upload Image</span>
                <input type="file"
                onChange = {(e) => setImage(e.target.files[0])}
                />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
        </div>
        <button className="btn waves-effect waves-light"
        onClick = { ()=> postDetails() }
        >
            Submit Post
        </button>
    </div>
)
}

export default CreatePost