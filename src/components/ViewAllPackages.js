import React, { Component } from "react";
import axios from "axios";
// import { backendUrlHotDeal } from "react";
import { Redirect, Route } from "react-router-dom";
import { backendUrlHotDeal } from "../BackendURL";
import ItineraryViewer from "./ItineraryViewer";
import Axios from "axios";
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";


export class ViewAllPackages extends Component {

    constructor(props) {
        super(props)
        this.state = {
            destinations: [],
            itineraryButton: false,
            bookButton: false,
            errorMessage: "",
            itinerary: [],
            destForPackage: "",
            destForBook: "",
            bookme: false,
        }
    }
    componentDidMount() {
        Axios.get(backendUrlHotDeal)
        .then(response=>{
            this.setState({
                destinations:response.data,
             
                
            })}
            )
            .catch(error=>{this.setState({
                errorMessage:error
            })})
            this.state.destinations.map(iti=>{
                this.setState({
                    itinerary:iti.details.itinerary
                })
            })
            
            
            
        

        //Write logic to fetch the hotdeal data from the backend
    }
    setItineraryButton(key)
    {
    this.setState({
        itineraryButton:key
    })
}
    setItineraryTab(key)
    {
        this.setState({
            bookme:key
        })
    }
    setBookTab(key)
    {
        this.setState({
            bookButton:key
        })
    }
   
 

    render() {
       
      
       
       return(
        <React.Fragment>
           
         
             <div style={{fontSize:"35px"}}>The Packages Available<br/>
             <div className="card-deck">
            
             {   
            this.state.destinations.map((item,key)=>{
           
                    return(
                <>
                <div className="card-body border-dark" style={{width:"650px",borderRadius:"50px"}}>
                 <div className="card shadow-lg" style={{borderRadius:"20px"}}>
                    <div className="card-header text-justify" style={{fontSize:"20px",color:"white",backgroundColor:"#000000",borderTopLeftRadius:"20px",borderTopRightRadius:"20px"}}>{item.destinationName}</div>
                <div className="card-body" style={{backgroundColor:"#A0AECD", borderBottomLeftRadius:"20px", borderBottomRightRadius:"20px"}}>
                <div className="row">
                 <div className="column">
                 <nav className="navbar navbar-dark bg-dark" style={{flexDirection:"column"}}>   
                 
                  
                   

                   
               
                 <button 
                    
                    className="navbar-toggler"  
                    type="button"  
                    data-toggle="collapse"  
                    data-target={`#navbarCollapse_${item.destinationId}`}
                    aria-controls={`navbarCollapse_${item.destinationId}`}  
                    aria-expanded="false"  
                    aria-label="Toggle navigation">  
                    <span className="navbar-toggler-icon"> </span>  
                </button>  
             
                <div className="collapse navbar-collapse" id={`navbarCollapse_${item.destinationId}`}>  
                    <ul className="navbar-nav mr-auto sidenav" id="navAccordion">  
                    <li className="nav-item">  
                        <a className="nav-link" 
                        style={{fontSize:"25px"}} onClick={()=>
                            {this.setItineraryButton(key)}}>Overview</a>
                     {/* <p style={{color:"black"}}  >{this.state.itineraryButton?<ItineraryViewer destination={item.destinationId} show={this.state.itineraryButton} onHide={()=>this.setState({itineraryButton:false})}/>:null}</p>OverView</a>   */}
                    </li>  
                    <li className="nav-item">  
                        <a className="nav-link"  style={{fontSize:"25px"}} onClick={()=>this.setItineraryTab(key)}>
                            Itinerary</a> 
                            
                       
                            
                    </li>  
                    <li className="nav-item">
                        <a className="nav-link" style={{fontSize:"25px"}} onClick={()=>this.setBookTab(key)}>Book</a>
                    </li>
                    </ul>
                    </div>
                </nav>
                <ItineraryViewer destination={item.destinationId} showingIndex={key} show={this.state.itineraryButton} onHide={()=>this.setState({itineraryButton:false})}/>
                <ItineraryTab itineraryValues={item.details.itinerary} check={this.state.destForBook} showingIndex={key} show={this.state.bookme} onHide={()=>this.setState({bookme:false})}/>
                <BookingTab bookingValues={item} check={this.state.destForPackage} showingIndex={key} show={this.state.bookButton} onHide={()=>this.setState({bookButton:false})}></BookingTab>
                 
            </div>
            <div className="column">
                <div className="card-text">
                <center><img src={item.imageUrl} className="img-thumbnail" style={{width:"400px",height:"200px"}}></img></center>
                <div style={{fontSize:"30px"}}>Continent:{item.continent}</div>
                <div style={{fontSize:"25px"}}>Destination ID:{item.destinationId}</div>
              
                </div>
                </div>
                </div>
                </div>
                </div>
                
            </div> 
            
                </>
    
         )})
                        }
        </div>
        

            </div>
         
        </React.Fragment>
       )
    }

}
class ItineraryTab extends Component{
    render()
    {
        
        return(
            
            <div className="modal" style={{ display: (this.props.show===this.props.showingIndex) ? "block" : "none" , overflow: "scroll"}}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content" >
                    <div className= "modal-header" style={{"background":"#DD8EA4"}} >
                        <h4 className="font-size-bold" ><b>Day Wise Plan</b> </h4>
                        <span className="close" onClick={this.props.onHide}>&times;</span>
                        
                    </div>
                    <div className="modal-body" style={{"background":"F2E9EB"}} >
                        <h3 className="font-size-bold" style={{fontSize:"25px"}}>First Day</h3>
                        <div style={{fontSize:"20px"}} >{this.props.itineraryValues.firstDay}</div>
                        
                    
                        <h3  className="font-size-bold" style={{fontSize:"25px"}}>Rest Of Days</h3>
                        <div style={{fontSize:"20px"}}>{this.props.itineraryValues.restOfDays}</div>
                       
                        <h3 className="font-size-bold" style={{fontSize:"25px"}}> Last Of Days </h3>
                        <div style={{fontSize:"20px"}} >{this.props.itineraryValues.lastDay}</div>
                        
                        <button  className="btn btn-primary" onClick={this.props.onHide}>Go Back</button>
                    </div>
                   
                </div>
            </div>
        </div>
        )
        }
    }

class BookingTab extends Component{

    constructor(props){
        super(props)
        this.state = {
            bookme: false,
        }
    }
    render()
    {
        if (this.state.bookme === true)
        return <Redirect to={"/booking"+"/"+this.props.bookingValues.destinationId} />;
        return(
            <div className="modal" style={{ display: (this.props.show===this.props.showingIndex) ? "block" : "none" , overflow: "scroll"}}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content" >
                    <div className= "modal-header" style ={{"background":"#DD8EA4"}}>
                        <h4><b>Booking Details </b> </h4>
                        <span className="close" onClick={()=>{this.props.onHide()}}>&times;</span>
                    </div>
                    <div className="modal-body" style ={{"background":" F2E9EB","fontSize":"20px"}} >
                        <p>No of Nights:
                        {this.props.bookingValues.noOfNights}</p>
                        
                    
                        <p>Flight Charge:
                        500.0</p>
                       
                        <p>Charge Per Person:
                        {this.props.bookingValues.chargePerPerson}.0</p>

                        <p>Discount:
                            {this.props.bookingValues.discount}.0
                        </p>

                        <p>Availability:
                            {this.props.bookingValues.availability}
                        </p>
                        <button className="btn btn-success" onClick={()=>{this.setState({bookme:true})}}>Book</button>
                        
                    </div>
                   
                </div>
            </div>
        </div>

        )
    }
    
        
}


export default ViewAllPackages;