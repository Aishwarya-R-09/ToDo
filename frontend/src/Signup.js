import React from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';
import validator from 'validator';


export default class Signup extends React.Component{
    constructor(props){
        super(props);
        this.fullnameref = React.createRef();
        this.emailref = React.createRef();
        this.passwordref = React.createRef();
        this.state={isResponse:true,error:"", errorStyle: "alert alert-danger mt-3"}
        this.loading = <><span className="spinner-grow spinner-grow-sm mr-1" role="status" aria-hidden="true"></span><span>&nbsp;&nbsp;Loading...</span> </>;

    }
    adduser = async () =>{
        this.setState({errorStyle: "alert alert-danger mt-3"});
        var details = {
            fullname : this.fullnameref.current.value,
            email : this.emailref.current.value,
            password : this.passwordref.current.value
        }
        if (validator.isEmail(this.emailref.current.value)) {
            
        } else {
        
            this.setState({ error: "Enter valid email"});
            return;
        }

        if(validator.isStrongPassword(this.passwordref.current.value)){
        }
        else{
           

            this.setState({error: "Password must contain minimum of 8 characters with atleast 1 lowecase, 1 uppercase, 1 number and 1 symbol."})
            return;
        }

        this.setState({isResponse: false, error:""});
        let res = await axios.post("http://localhost:4200/signup",details);
        this.setState({isResponse: true});
        if(res.data.message === "User registered"){
            this.setState({errorStyle: "alert alert-success mt-3"});
            this.setState({error:"Registration successfull"});
            
            setTimeout(()=>{
                this.props.history.push('/login');
            }, 2000);
            

        }
        else{
            
            this.setState({error: res.data.message});
        }
    }

    render(){
        return(
            <>
                <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",minHeight:"100vh",backgroundColor:"black"}}>
                    <div className="card p-2" style={{width:"22rem"}}>
                        <div className="card-body">
                            <h4 className="card-title" style={{textAlign:"center",color:"#00154f"}}><b>Sign Up</b></h4>
                            <input type="text" className="form-control mt-4" id="name" ref={this.fullnameref} placeholder="Full Name"></input>
                            <input type="email" className="form-control mt-4" id="email" ref={this.emailref} placeholder="Email"></input>
                            <input type="password" className="form-control mt-4" id="password" ref={this.passwordref} placeholder="Password"></input>
                            <p className="mt-3" style={{color:"#00154f"}}><b>Already have an account ? <Link to="/login" style={{color:"#950740"}}>Login</Link></b></p>
                            <div style={{textAlign:"right"}}>
                                <button type="button" className="btn btn-block px-4 mt-2" style={{backgroundColor:"#00154f",color:"white"}} disabled={this.state.isResponse?false:true} onClick={this.adduser}>
                                    {this.state.isResponse ? <span>Sign Up</span> : this.loading}
                                </button>
                            </div>
                            <div className={this.state.errorStyle} role="alert" style={{display:this.state.error.length===0?"none":"flex", flexDirection:"row", justifyContent:"space-between"}} >
                                {this.state.error}
                                <button onClick={()=> {this.setState({error:""}) }} type="button" className="btn-close" style={{marginRight:"10px",marginLeft:"auto"}}></button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}