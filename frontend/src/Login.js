import React from "react";
import { Link } from "react-router-dom";
import axios from 'axios';


export default class Login extends React.Component{

    constructor(props){
        super(props);
        this.emailref = React.createRef();
        this.passwordref = React.createRef();
        this.state={ isResponse:true, error:"" };
        this.loading = <><span className="spinner-grow spinner-grow-sm mr-1" role="status" aria-hidden="true"></span><span>&nbsp;&nbsp;Loading...</span> </>;
    }

    

    loginuser = async () =>{
        this.setState({isResponse: false, error:""})
        var details = {
            email : this.emailref.current.value,
            password : this.passwordref.current.value
        }
        var response = await axios.post("http://localhost:4200/login",details);
        
        if(response.data.token){
            localStorage.setItem('token', response.data.token );
            localStorage.setItem('email',response.data.email);
            this.props.history.push('/home');
        }
        else{
            this.setState({isResponse:true});
            this.setState({error:response.data.message});
        }
        
    }

    render(){  
        return(
            <>
                
                <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",minHeight:"100vh",backgroundColor:"black"}}>
                    <div className="card p-2" style={{width:"22rem"}}>
                        <div className="card-body">
                            <h4 className="card-title" style={{textAlign:"center",color:"#00154f"}}><b>Login</b></h4>
                            <input type="email" className="form-control mt-3" id="email" ref={this.emailref} placeholder="Enter Email" ></input>
                            <input type="password" className="form-control mt-4" id="password" ref={this.passwordref} placeholder="Enter password"></input>
                            <p className="mt-3" style={{color:"#00154f"}}><b>Don't have an account ? <Link to="/signup" style={{color:"#950740"}}> Signup</Link></b></p>
                            <div style={{textAlign:"right"}}>
                                <button type="button" className="btn btn-block px-4 mt-2" style={{backgroundColor:"#00154f",color:"white"}} onClick={this.loginuser} disabled={this.state.isResponse?false:true}>
                                    {this.state.isResponse ? <span>Login</span> : this.loading}
                                </button>
                            </div>
                            <div className="alert alert-danger mt-3" role="alert" style={{display:this.state.error.length===0?"none":"flex", flexDirection:"row", justifyContent:"space-between"}} >
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
