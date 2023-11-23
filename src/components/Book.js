import { Component } from 'react';
import axios from 'axios';
import { backendUrlItinerary, backendUrlBook } from '../BackendURL';
import "../custom.css";
import { Redirect } from 'react-router-dom';
import {event} from 'jquery';

export class Book extends Component {

    constructor(props) {
        super(props);
        this.state = {
            booking: [],
            destination: [],
            highlights: [],
            details: [],
            itinerary: [],
            formValue: {
                noOfPeople: "",
                checkIn: "",
                totalCost: "",
                user: {
                    "userId": sessionStorage.getItem("userId"),
                    "userName": sessionStorage.getItem("userName")

                }
            },
            postValue:{
                noOfPeople: "",
                checkIn: "",
                checkOut: "",
                totalCost: "",
                timeOfBooking: ""
            },
            formErrorMessages: {
                noOfPeople: "",
                checkIn: ""
            },
            formValid: {
                noOfPeople: false,
                checkIn: false,
                buttonActive: false
            },
            errorMessage: "",
            successMessage: "",
            totalCost: "",
            tripEnd: "",
            displayDate: "",
            displayTime:"",
            flightCharge: "",
            back: false,
            accords: {
                accordButton1: false,
                accordButton2: false,
                accordButton3: false
            }
        }
       
    }

    componentDidMount() {
       //Write logic for fetching itinerary details from the backend.
       axios.get(backendUrlItinerary+"/"+this.props.match.params.destId)
       .then(response=>{this.setState({
        destination:response.data,
        flightCharge:response.data.flightCharge,
        highlights:response.data.details.highlights,
        itinerary:response.data.details.itinerary,
        details:response.data.details
       })
       })
    }

    setTripEnd = (date) => {
      //Implement this function to calculate the trip end date with the help of No. of nights
 
      var newDate = new Date(date); 
      newDate.setDate(newDate.getDate()+this.state.destination.noOfNights);
      var newDateStr = newDate.toLocaleDateString('en-CA');
    //   var newTimeStr = newDate.toLocaleTimeString('it-IT');
    //   var postTime = newDateStr+"T"+newTimeStr;
      this.setState({
          tripEnd:newDateStr,
        //   displayTime:postTime
        //   postValue:{
        //       ...this.state.postValue,
        //       checkOut:newDateStr
        //   }
      })
    
        
    }

    totalAmount = (name, value) => {
       //Implement this function the total amount for the booking
       var cost = ((500 * value)+(this.state.destination.chargePerPerson * value))*((1-this.state.destination.discount/100.0));
      this.setState({
        totalCost: cost,
        // postValue:{
        //     ...this.state.postValue,
        //     totalCost: amount
        // }
      })

    }

    handleChange = (event) => {
        var name = event.target.name;
        var value = event.target.value;
        var formVal = this.state.formValue;
        this.setState({ 
            formValue: { ...formVal, [name]: value },
            // postValue: { ...this.state.postValue, [name]: value }
         });

         if(name=="checkIn"){
            this.setTripEnd(value);
        };
        if(name=="noOfPeople"){this.totalAmount(name,value)};
        this.validateField(name, value)
        
    }

    validateField = (fieldName, value) => {
     //Implement this function to validate the booking fields
     let fieldValidationErrors = this.state.formErrorMessages;
    let formValid = this.state.formValid;
    switch(fieldName) {
       case "noOfPeople":
        var noPeople=/^[1-5]$/;
        if(value===""){
            fieldValidationErrors.noOfPeople="Field required";
            formValid.noOfPeople=false;
        }
        else if(!value.match(noPeople)){
            fieldValidationErrors.noOfPeople="Number of travelers should be between 1 and 5 ";
            formValid.noOfPeople = false;
        } else {
            fieldValidationErrors.noOfPeople="";
            formValid.noOfPeople = true;

        }
    
      break;
      case "checkIn":
        var checkIndate=new Date(value);
        var today=new Date();
        today.setHours(0,0,0);
        
        checkIndate.setHours(0,0,0,0);
        if(value==="") {
            fieldValidationErrors.checkIn="Field required";
            formValid.checkIn=false;
        }
        else{
            
            if(checkIndate<=today){
                fieldValidationErrors.checkIn="The check-in date should be later than today";
                formValid.checkIn=false;
              }
              else{
                fieldValidationErrors.checkIn="";
                formValid.checkIn=true;
              }
            }
              break;
        }
        formValid.buttonActive=formValid.checkIn && formValid.noOfPeople
        this.setState({formErrorMessage:fieldValidationErrors, formValid:formValid, successMessage:"", errorMessage:""})
    }

        
    

    handleSubmit = (event) => {
        event.preventDefault()
        this.setState({
            postValue:{
                ...this.state.postValue,
                checkOut:this.state.tripEnd ,
                totalCost:this.state.totalCost,
                checkIn:this.state.formValue.checkIn,
                noOfPeople: this.state.formValue.noOfPeople,
                timeOfBooking: this.state.displayTime
            }
        });
        console.log(this.state.postValue);
        this.submitBooking();

    }
    submitBooking = () => {
       //IAdd the logic to submit the booking to backend
       this.setState({successMessage:"",errorMessage:""})
       axios.post(backendUrlBook+"/"+sessionStorage.userId+"/"+this.props.match.params.destId,this.state.postValue)
       .then(response=>{
        this.setState({successMessage:"Booking Confirmed:"+response.data});
       })
       .catch(error=>{
        this.setState({errorMessage:"Number of travelers should be between 1 and 5 should be displayed",successMessage:""});
       })
    }

    

    closeAccord = (event) => {
        Object.keys(this.state.accords).map(k => {
            if (this.state.accords[k] === true) {
                let accordKey = this.state.accords;
                accordKey[k] = false;
                this.setState({ accords: accordKey })
            } else if (event.target.id === k) {
                let accordKey = this.state.accords;
                accordKey[k] = true;
                this.setState({ accords: accordKey })
            } else {
                let accordKey = this.state.accords;
                accordKey[k] = false;
                this.setState({ accords: accordKey })
            }
        })
    }
    render() {
       
        if(this.state.back){
            return <Redirect to={"/packages"}/>;
           }
        //Add the missing logic to complete the view
        return (
            <>
                <span className="text-success font-weight-bold">{this.state.successMessage}</span>
                <div className="row px- 2 py-3">
                    <div className="col-lg-6 col-md-5 col-sm-12">
                        <h3>{this.state.destination.destinationName}</h3>
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex justify-content-between">
                                    <span id="accord">Overview</span>
                                    <span id="accordButton1" className="close" style={{ transform: this.state.accords.accordButton1 ? "rotate(135deg)" : "rotate(90deg)" }} onClick={this.closeAccord}>+</span>
                                </div>
                            </div>
                        </div>
                        <div className="hiddenBox" style={{ display: this.state.accords.accordButton1 ? "block" : "none" }}>
                            <p className="font-weight-bold" style={{color:"black"}}>{this.state.details.about}</p>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex justify-content-between">
                                    <span id="accord">Highlights</span>
                                    <span id="accordButton2" className="close" style={{ transform: this.state.accords.accordButton2 ? "rotate(135deg)" : "rotate(90deg)" }} onClick={this.closeAccord}>+</span>
                                </div>
                            </div>
                        </div>
                        <div className="hiddenBox" style={{ display: this.state.accords.accordButton2 ? "block" : "none" }}>
                            <p className="font-weight-bold" style={{color:"black"}}>{this.state.highlights.toString().split(",").map(h => <li key={h}>{h}</li>)}</p>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex justify-content-between">
                                    <span id="accord">Tour Pace</span>
                                    <span id="accordButton3" className="close" style={{ transform: this.state.accords.accordButton3 ? "rotate(135deg)" : "rotate(90deg)" }} onClick={this.closeAccord}>+</span>
                                </div>
                            </div>
                        </div>
                        <div className="hiddenBox font-weight-bold" style={{ display: this.state.accords.accordButton3 ? "block" : "none", color:"black" }}>
                            <span>1: {this.state.itinerary.firstDay}</span><br /><br />
                            <span>2: {this.state.itinerary.restOfDays}</span><br /><br />
                            <span>3: {this.state.itinerary.lastDay}</span><br /><br />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-7 col-sm-12">
                        <div className="card">
                            <div className="card-header" style={{background:"#DD8EA4"}}>
                                <h4 className="text-center font-weight-bold text warning">Book Your Trip</h4>
                            </div>
                            <div className="card-body" style={{background:"#F2E9EB"}}>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group" style={{"paddingTop":"20px"}}>
                                        <label for="noOfPeople"className="font-weight-bold d-flex justify-content-start">Number of Travellers</label>
                                        <input type="number" min="1" max="5" className="form-control" name="noOfPeople" id="noOfPeople" value={this.state.formValue.noOfPeople} onChange={this.handleChange}/>
                                        <span className="text-danger font-weight-bold">{this.state.formErrorMessages.noOfPeople}</span>
                                    </div><br/>
                                    <div className="form-group">
                                        <label className="font-weight-bold d-flex justify-content-start">Trip Start Date</label>
                                        <input type="date" name="checkIn" className="form-control" onChange={this.handleChange}></input>
                                        <span className="text-danger font-weight-bold">{this.state.formErrorMessages.checkIn}</span>
                                    </div>
                                   
                                </form>
                                <span className="font-weight-bold">Your Trip Ends on: {this.state.tripEnd}</span><br /><br />
                                <h5>You Pay: ${this.state.totalCost}</h5>
                            </div>
                            <div className="card-footer d-flex justify-content-between"style={{background:"#DD8EA4"}}>
                                <button className='btn btn-success' type="submit" name="book" onClick={(event)=>this.handleSubmit(event)} disabled={!this.state.formValid.buttonActive}>CONFIRM BOOKING</button>
                                <button className='btn btn-danger' name="goBack" onClick={()=>{this.setState({
                                    back:true
                                })}} >GO BACK</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    
}