import React from 'react';
import './Home.css';
import todo from './assests/todo.png';
import axios from 'axios';


export default class Home extends React.Component{

    constructor(props){
        super(props);
        if(localStorage.getItem('token') === null){
            props.history.push('/login');
        }
        this.taskref = React.createRef();
        this.dateref = React.createRef();
        this.typeref = React.createRef();

        this.state={
            todolist:[],
            isListEmpty:false,
            type: "All Tasks",
            isResponse : false,
            addTask: false
        }
    }

    
    addtask = async () => {
        var taskdetails = {
             task : this.taskref.current.value,
             date : this.dateref.current.value,
             type : this.typeref.current.value
        }

        

        if(this.taskref.current.value === ""){
            alert("Fill all fields");
            return ;
        }
        


        let taskres = await axios.put("http://localhost:4200/addtask",taskdetails,
            {   headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });

            if(taskres.data === "Task added"){
                this.setState({addTask: true});
                this.getTask();
                setTimeout(()=>{this.setState({addTask: false})},4000);
               
            }

            this.taskref.current.value = "";
            this.dateref.current.value="";
            this.typeref.current.value ="Personal";

    }

    getTask = async ()=>{
        this.setState({isResponse:false});
        let taskdata = await axios.get("http://localhost:4200/gettask/"+this.state.type,
                {   headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
            
        
        this.setState({todolist:taskdata.data}, ()=>{  
            if(this.state.todolist.length === 0){
                this.setState({isResponse:true});
                this.setState({isListEmpty:true});
            }
            else{
                this.setState({isResponse:true});
                this.setState({isListEmpty:false});
            }
            
        });
    }


    logout = () =>{
        localStorage.removeItem('token');
        this.props.history.push("/login");
    }


    taskCompleted = async(i) =>{
        
        await axios.put("http://localhost:4200/deletetask/"+i,{},
                    {   headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                    });
        

        this.getTask();
        
    }

    
    componentDidMount = async () =>{
        this.getTask();
        
    }

    
    render(){
        return(
            <>
            
            <nav class="navbar" style={{backgroundColor: "#950740"}}>
            <div class="container-fluid" style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                <div style={{display:"flex",flexDirection:"row", alignItems:"center"}}>
                    <h4  style={{color:"#FFFFFF"}}><b>ToDo</b></h4>
                    <div className="nav-item dropdown" style={{marginLeft:"20px"}}>
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{color:"white"}}>
                            <b>{this.state.type}</b> 
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><a className="dropdown-item" href="#" value="All" onClick={()=>{ this.setState({type: "All Tasks"},()=>{this.getTask();})}}>All Tasks</a></li>
                            <li><a className="dropdown-item" href="#" value="Personal" onClick={()=>{ this.setState({type: "Personal"},()=>{this.getTask();})}}>Personal</a></li>
                            <li><a className="dropdown-item" href="#" value="Shopping" onClick={()=>{ this.setState({type: "Shopping"},()=>{this.getTask();})}}>Shopping</a></li>
                            <li><a className="dropdown-item" href="#" value="Work" onClick={()=>{ this.setState({type: "Work"},()=>{this.getTask();})}}>Work</a></li>
                        </ul>
                    </div>
                </div>
                <div className="nav-item dropdown">
                               
                    <a className="nav-link dropdown-toggle text-white dropstart" style={{cursor:"pointer"}} id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i id="col" className="fa fa-user" style={{color:"white"}}></i>
                    </a>
                    
                    <div className="dropdown-menu dropdown-menu-end px-3" aria-labelledby="navbarDropdown"  >
                        <span><b>{localStorage.getItem('email')}</b></span>
                        <div className="dropdown-divider" ></div>
                        <button className="dropdown-item " onClick={this.logout} style={{backgroundColor:"#00154f",color:"white",textAlign:"center"}}>Log out</button>  
                    </div>
                </div>
            </div>
            </nav>
            
                {/* <nav className="navbar navbar-expand-lg navbar-light fixed-top" style={{backgroundColor: "#950740"}} >
                    <div className="container-fluid ">
                        
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="navbar-collapse" id="navbarSupportedContent">
                            <div className="navbar-nav me-auto" style={{marginLeft:"20px"}}>
                            <div className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{color:"white"}}>
                                   <b>{this.state.type}</b> 
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a className="dropdown-item" href="#" value="All" onClick={()=>{ this.setState({type: "All Tasks"},()=>{this.getTask();})}}>All Tasks</a></li>
                                    <li><a className="dropdown-item" href="#" value="Personal" onClick={()=>{ this.setState({type: "Personal"},()=>{this.getTask();})}}>Personal</a></li>
                                    <li><a className="dropdown-item" href="#" value="Shopping" onClick={()=>{ this.setState({type: "Shopping"},()=>{this.getTask();})}}>Shopping</a></li>
                                    <li><a className="dropdown-item" href="#" value="Work" onClick={()=>{ this.setState({type: "Work"},()=>{this.getTask();})}}>Work</a></li>
                                </ul>
                            </div>
                            </div>

                            <div className="navbar-nav " style={{paddingRight:"25px"}}>
                                <div className="nav-item dropdown">
                               
                                    <a className="nav-link dropdown-toggle text-white dropstart" style={{cursor:"pointer"}} id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i id="col" className="fa fa-user" style={{color:"white"}}></i>
                                    </a>
                                   
                                    <div className="dropdown-menu dropdown-menu-end px-3" aria-labelledby="navbarDropdown"  >
                                        <span><b>{localStorage.getItem('email')}</b></span>
                                        <div className="dropdown-divider" ></div>
                                        <button className="dropdown-item " onClick={this.logout} style={{backgroundColor:"#00154f",color:"white",textAlign:"center"}}>Log out</button>  
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </nav> */}


                <div className="container-fluid" style={{backgroundColor:"#ADADAD",minHeight:"100vh",paddingTop:"12vh"}}>
                    {!this.state.isResponse && 
                        <div className="container" style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",minHeight:"88vh"}}>
                            <div className="spinner-border" style={{width: "3rem", height: "3rem"}} role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    }
                    {this.state.isResponse && this.state.isListEmpty &&

                        <div className="container" style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",minHeight:"88vh"}}>
                            
                            <img src={todo} alt="nothing" ></img>
                            <h5 style={{color:"#00154f",marginTop:"15px"}} ><b>Nothing To Do</b></h5>
                        </div>
                    }
                    {this.state.isResponse && !this.state.isListEmpty &&

                        <div className="container-lg item-container ">
                            <h4 style={{color:"#00154f",marginBottom:"20px"}} ><b>{this.state.type}</b></h4>                            
                            {this.state.todolist.map((ele,index)=>{
                                let date = new Date(ele.date);
                                let year = date.getFullYear();
                                let month = date.getMonth();
                                let day = date.getDate();
                                let str = day+"/"+month+"/"+year;
                                return(
                                
                                    <div key={index} style={{ marginBottom:"28px",backgroundColor:"#f8f8f8",borderRadius:"10px"}} className="px-4 py-3 taskcard">
                                        <div style={{display:"flex",flexDirection:"colunm",}}>
                                            <div>
                                                <input type="checkbox" id="done" style={{marginRight:"25px"}} onClick={()=>{this.taskCompleted(ele.createdAt)}}/>
                                            </div>
                                            <div>
                                                <h5 style={{color:"#00154f"}}><b>{ele.task}</b></h5>
                                                <p style={{color:"#950740"}}>{str}</p>
                                                <p style={{lineHeight:"0.3",color:"#00154f"}}><b>{ele.type}</b></p>
                                            </div>
                                            
                                        </div>
                                       
                                    </div>
                                
                                );  
                              
                            })}
                            
                            

                        </div>

                    }
                    
                    
                    <div className="py-2 px-4 bg-dark" style={{ position:"fixed", bottom:"30px", left:"20px", width:"20%", display: this.state.addTask ? "flex":"none", flexDirection:"row", justifyContent:"space-between"}}>
                        <span className="text-white"><b>Task Added</b></span>
                        <button type="button" onClick={ ()=>{this.setState({addTask:false})}} className="btn-close btn-close-white"></button>
                    </div>
                    <button className="btn btn-circle mb-2" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" style={{backgroundColor:"#00154f",position:"fixed",bottom:"20px",right:"40px",height:"50px",width:"50px"}}>
                        <i className="fa fa-plus" style={{color:"white",fontSize:"25px"}}></i>
                    </button> 
                        
                </div>


                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel" style={{color:"#00154f"}}><b>New Task</b></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <label htmlFor="task" className="form-label"><b>What is to be done?</b></label>
                                <input type="text" ref={this.taskref} className="form-control" id="task" placeholder="Enter Task Here"/>

                                <label htmlFor="datepicker" className="form-label mt-2"><b>Due date</b></label>
                                <input type="date" ref={this.dateref} id="datepicker" className="form-control" ></input>
                                <span style={{fontSize:"12px"}}>No notifications if date not set</span><br/><br/>

                                <label htmlFor="list" className="form-label"><b>Add to List &nbsp;&nbsp;</b></label>
                                    <select name="list" ref={this.typeref} className="p-1" id="list">
                                        <option value="Personal">Personal</option>
                                        <option value="Shopping">Shopping</option>
                                        <option value="Work">Work</option>
                                    </select>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn" style={{backgroundColor:"#00154f",color:"white"}} onClick={this.addtask} data-bs-dismiss="modal" aria-label="Close">Add Task</button>
                        </div>
                        </div>
                    </div>
                </div>
                
            
            </>
        )
    }
}

// db.people.update({"name":"dannie"}, {'$pull': {"interests": "guitar"}})