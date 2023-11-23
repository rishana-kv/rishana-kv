import React, { Component } from "react";
import '../index.css';
import { Route, Redirect } from "react-router-dom";
import Axios from "axios";
import { backendUrlItinerary } from "../BackendURL";

export class ItineraryViewer extends Component {

    constructor(props){
        super(props)
        this.state = {
            destination : null,
            highlights:[],
            inclusions: [],
            pace: [],
            bookme: false,
        }
    }

    componentDidMount(){
        //Write logic for fetching data of highlights, packageInclusion and pace from the backend.
        
        
        
        Axios.
        get(backendUrlItinerary+"/"+this.props.destination)
        .then(response=>{
        this.setState({
            destination:this.props.destination,
            highlights:response.data.details.highlights,
            inclusions:response.data.details.packageInclusion,
            pace:response.data.details.pace
        })
    })
}

    book=()=>{
        this.setState({bookme:true});
    }
    
    render(){
        if (this.state.bookme === true)
      return <Redirect to={"/booking"+"/"+this.props.destination} />;
        return (
            <React.Fragment>
                
                <div className="modal" style={{fontSize:"20px", display: (this.props.show===this.props.showingIndex) ? "block" : "none" , overflow: "scroll"}}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className= "modal-header" style={{background:"#DD8EA4",textAlign:"center"}}>
                                <h4>OverView</h4>
                                 <span className="close" onClick={this.props.onHide}>&times;</span>                              
                            </div>
                            <div style ={{"background":" #F2E9EB"}}className="modal-body">
                                <h2>Tour Highlights</h2>
                                <div>{this.state.highlights}</div><br/>
                                                                   
                                <h2>Package Inclusions</h2>
                                <div>{this.state.inclusions}</div><br/>
                               
                                <h2> Tour Pace </h2>
                                <div>{this.state.pace}</div><br/>
                                
                            </div>
                            <div className="modal-footer" style={{background:"#DD8EA4",textAlign:"center"}}>
                                <button className ="btn btn-danger" onClick={this.props.onHide}>Cancel</button>                                
                                <button className ="btn btn-success" onClick={this.book}>Book</button>                              
                            </div>
                        </div>
                    </div>
                </div>
               
               
  
               
            </React.Fragment>

        )
    }


}
export default ItineraryViewer;