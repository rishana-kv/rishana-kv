import React, { Component } from 'react';
import axios from 'axios';
import { backendUrlDeleteBook, backendUrlViewBook } from '../BackendURL';
import { Redirect } from 'react-router-dom';
import { ENTERED } from 'react-transition-group/Transition';

export class ViewAllBooks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            successMessage: "",
            errorMessage: "",
            bookings: {},
            bookLogged: true,
            bookDelete: false,
            bookingId:0
        }
        this.res = []
    }

    delete=(id)=>{
        
       
        //Implement this function to delete the booking.
      // console.log(backendUrlDeleteBook +id)
       axios.delete(backendUrlDeleteBook +id).then(response =>{
        console.log(response);
        console.log(response.data);
       }).catch((e)=>{
        console.log(e)
       })
      this.setState({
        bookDelete:true
      })

    }

    componentDidMount() {
        if (sessionStorage.getItem("userId") == null) {
            return this.setState({ bookLogged: false })
        }
        let url = backendUrlViewBook + sessionStorage.getItem("userId")
        console.log(sessionStorage.getItem("userId"))
        axios.get(url).then(response => {
            this.setState({ bookings: response.data })
        })
            .catch(error => {
                if (error.response) {
                    this.setState({ errorMessage: error.response.data.errorMessage });
                    console.log(error.response.data)
                } else {
                    this.setState({ errorMessage: "Please run the backend" })
                }
            })
            console.log(this.state.bookings)
    }

    cardMaker = (book) => {
        return(
           
            <div className="card-body border-primary" style={{width:"650px"}}>
                 <div className="card border-primary">
                <div className="card-body">
                    <p><span className="font-weight-bold">{"Booking Id :"} </span>{ book.bookingId}</p>
                    <h5 className="card-title">{ book.destination.destinationName}</h5>
                    <p><span className="font-weight-bold">{"Continent :"} </span>{  book.destination.continent}</p>
                    <p><span className="font-weight-bold">{"Check in :"} </span>{ book.checkIn}</p>
                    <p><span className="font-weight-bold">{"Check Out :"} </span>{ book.checkOut}</p>
                    <p><span className="font-weight-bold">{"No Of People:"} </span>{ book.noOfPeople}</p>
                    <h1 class="text-success">${ book.totalCost}</h1>

                    <button className='btn btn-danger' onClick={()=>{
                        const res=window.confirm("Do you want to delete booking "+book.bookingId)
                        if(res){
                            this.delete(book.bookingId);
                            window.location.reload();}}
                        }
                        >Cancel</button>
                    <div style={{display:this.state.bookDelete?"block":"none"}}>Your booking has been cancelled</div>
                </div>
            </div></div>
        )
        
        //Implement the logic to create a card with booking details and cancel booking button
        
        }

    render() {
        
        if (this.state.bookLogged === false) {
            alert("Please Login to view your plans")
            return <Redirect to={"/login"}></Redirect>
        } if (this.state.errorMessage !== "") {
            return <h3>{this.state.errorMessage}</h3>
        }
        return(
          
    <div className="card-deck">
        {
            
            
        Object.values(this.state.bookings).map(b=>{
            return(
            this.cardMaker(b))
        })
    }
    
    </div>

            
        )}

            
          
            
        
            
    }