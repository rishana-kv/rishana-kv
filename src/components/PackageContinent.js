
import React,{Component} from 'react';
import Axios from 'axios';
import { backendUrlHotDeal, backendUrlPackageSearch } from '../BackendURL';
import { ItineraryViewer } from './ItineraryViewer';
import { Redirect } from 'react-router-dom';
import {Book} from './Book';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

export class PackageContinent extends Component {
    constructor(props){
        super(props);
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
    getByContinent = ()=>{
        Axios.get(backendUrlPackageSearch + "/"+ this.props.match.params.continent)
        .then((response)=>{
           this.setState({destinations:response.data,
            itinerary:response.data.details,
            errorMessage: null});
     })
         .catch(error=>{
             if(error.response){
                 this.setState({destinations:null, errorMessage:error.response.data.message})
             }
             else{
                 this.setState({destinations:null,errorMessage:"Sorry we don't operate in this Destination"});
              }
          })
    }
    componentDidMount(){
        //Implement this function to fetch package details by continent from the backend
        this.getByContinent();
    }
    render()
     {
        if(this.state.bookme==true){
            return<Redirect to={"/booking/"+this.state.destForPackage}/>
        }
        //Write logic to display package details
        return<React.Fragment>
           <div className='container' style={{"marginTop":"30*px","":""}}>
            {this.state.destinations.map(destination=>
                {
                    return(
                        <div className="card mb-3" style={{"maxWidth":"1100px"}}>
                            <div className="row g-0" >
                                <div className="col-md-4">
                                    <img src={destination.imageUrl} style={{height:300, width:500}} className="img-fluid rounded-start" alt="..."></img>
                                
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">{destination.destinationName}</h5>
                                        <p className="card-text"><small className="text-muted">Number Of Nights:{destination.noOfNights}</small></p>
                                        <p className="card-text">{destination.details.about}</p>
                                        <button className='btn btn-primary' onClick={()=>this.setState({bookme:true,destForPackage:destination.destinationId})}>Book</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                
                )}
            </div>

        </React.Fragment>

     }

}
