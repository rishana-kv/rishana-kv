/* eslint-disable default-case */
import React from "react";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import axios from "axios";
import { backendUrlRegister } from "../BackendURL";
import { Redirect,Link } from "react-router-dom";

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValue: {
        userName: "",
       emailId: "",
        password: "",
        contactNumber: "", //change cfp
        confirmPassword: ""
      },
      formErrorMessage: {
        userName: "",
        emailId: "",
        password: "",
        contactNumber: "",
        confirmPassword:""
      },
      formSuccessMessage: {
        userName: "",
        emailId: "",
        password: "",
        contactNumber: "",
        confirmPassword:""
      },
      formValid: {
        userName: false,
        emailId: false,
        password: false,
        contactNumber: false,
        confirmPassword: false, //change cfp
        buttonActive: false
      },
      successMessage: "",
      errorMessage: ""
    }
  }

  handleChange = (event) => {
    var name = event.target.name
    var value = event.target.value
    var formVal2 = this.state.formValue
    this.setState({ formValue: { ...formVal2, [name]: value } })
    this.validate(name, value)
  }

  validate = (fieldName, value) => {   

     //Implement this function to validate the form fields
     let fieldValidationErrors = this.state.formErrorMessage;
    let formValid = this.state.formValid;
    let fieldSuccess = this.state.formSuccessMessage;
     switch (fieldName) {
      case "contactNumber":
        var errorMessage = "";
        if (value) {

          var regex = new RegExp(/^[6-9][0-9]{9}$/);
          regex.test(value)
            ? (errorMessage = "")
            : (errorMessage += " Should be a valid indian number");
        }
        else {
          errorMessage = "field required";
          fieldSuccess.contactNumber = ""
        }
        if (errorMessage != "") {
            fieldValidationErrors.contactNumber= errorMessage;
            fieldSuccess.contactNumber = "";
            formValid.contactNumber= false
      
        }
        else {
          
            fieldValidationErrors.contactNumber= "";
            formValid.contactNumber = true;
            fieldSuccess.contactNumber = "Valid"

          
        }

        this.setState({
          contactNumber: value
        });

        break;
      case "password":
        var errorMessage = "";
        if (value) {
          var regexCAp = new RegExp(/^.*[A-Z].*$/);
          var regexLow = new RegExp(/^.*[a-z].*$/);
          var regexNum = new RegExp(/^.*[0-9].*$/);
          var regexSpecialChar = new RegExp(/^.*[!@#$%^&*].*$/);

          errorMessage = !regexCAp.test(value)
            ? errorMessage + "Should contain atleast 1 upper case letter," : errorMessage;
          errorMessage = !regexLow.test(value) ?
            errorMessage + "Should contain atleast 1 lower case letter," : errorMessage;
          errorMessage = !regexNum.test(value)
            ? errorMessage + "Should contain atleast 1 number," : errorMessage;
          errorMessage = !regexSpecialChar.test(value)
            ? errorMessage + "Should contain atleast 1 special character," : errorMessage;
        }
        else {
          errorMessage = "field required";
          fieldSuccess.password = ""

        }
        if (errorMessage != "") {
          fieldValidationErrors.password= errorMessage;
          fieldSuccess.password = "" 
        } else {
  
            fieldValidationErrors.password= "";
            formValid.password= true;
            fieldSuccess.password = "Valid"
            
        
        }

        this.setState({
          password: value
        });

        break;

        case "confirmPassword":
          let pswd=this.state.formValue.password;
          if(value.trim() !== pswd){
            
            fieldValidationErrors.confirmPassword = "The passwords doesn't match";
            fieldSuccess.confirmPassword = "";
            formValid.confirmPassword = false;
          }else{
            formValid.confirmPassword = true;
            fieldSuccess.confirmPassword = "Password Matches";
            fieldValidationErrors.confirmPassword = ""
          }
        break;

        case "userName":
          var errorMessage = "";
          if (value) {
  
            var regex = new RegExp(/^[A-Z][a-z]{1,} [A-Z][a-z]{1,}( [A-Z][a-z]{1,}){0,1}$/);
            regex.test(value)
              ? (errorMessage = "")
              : (errorMessage += " Please enter a Valid name");
          }
          else {
            errorMessage = "field required";
            fieldSuccess.userName = ""
          }
          if (errorMessage != "") {
              fieldValidationErrors.userName= errorMessage;
              formValid.userName= false;
              fieldSuccess.userName = ""
        
          }
          else {
            
              fieldValidationErrors.userName= "";
              formValid.userName= true;
              fieldSuccess.userName = "Valid"
            
          }
  
          this.setState({
            userName: value
          });
  
          break;
          case "emailId":
          var errorMessage = "";
          if (value) {
  
            var regex = new RegExp(/^[A-z]+@[A-z]{3,7}(.com)$/);
            regex.test(value)
              ? (errorMessage = "")
              : (errorMessage += " Please enter a Valid emailId");
          }
          else {
            errorMessage = "field required";
            fieldSuccess.emailId = ""
          }
          if (errorMessage != "") {
              fieldValidationErrors.emailId= errorMessage;
              formValid.emailId= false
              fieldSuccess.emailId = ""
        
          }
          else {
            
              fieldValidationErrors.emailId= "";
              formValid.emailId= true;
              fieldSuccess.emailId = "Valid"
            
          }
  
          this.setState({
            emailId: value
          });
  
          break;
        }
        formValid.buttonActive = formValid.userName && formValid.emailId && formValid.contactNumber && formValid.password && formValid.confirmPassword;
        this.setState({ formErrorMessage: fieldValidationErrors, formValid: formValid, successMessage: "" });
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.register()
  }

  register = () => {
    //Implement this function to send the form data to the backend
    const{formValue} = this.state;
    this.setState({errorMessage: "", successMessage: ""})
    axios.post(backendUrlRegister, formValue)
      .then(response =>{
        this.setState({successMessage: response.data, errorMessage: ""});
        console.log(this.state.successMessage);
      }).catch(error =>{
        if(error.response)
        {this.setState({errorMessage: error.response.data.message, successMessage: "" });        
      }else{
        this.setState({errorMessage: "Please run the backend", successMessage: ""});
      }
  });
  }
  goToLogin = event => {
    this.setState({goToLogin : true})
}
  render() {
    if(this.state.goToLogin === true) {
      return <Redirect to={"/login"}/>;
  } else if (!(sessionStorage.getItem("userId") === null)) {
      return <Redirect to = {"/"}/>
  }
    
    //Implement this function to create a registration form
    return(
      <div className = "container-fluid registerBg" style = {{"padding": "40px 10px 10px 10px" }}>
      <h3 className = "display-5 text-center text-white  styleh1 font-weight-bold">Welcome to WanderLust</h3>
      <h3 className = "display-5 text-center styleh1 text-white font-weight-bold">Join Us!</h3>
      <br/>
      <form className="form form-horizontal shadow-lg p-3 mb-5 bg-white rounded" onSubmit={this.handleSubmit} style = {{"opacity":"0.9","padding": "20px 20px 20px 20px", "textAlign":"left", "width":"500px","marginLeft":"auto","marginRight":"auto"}}>
         <h3 className="text-info text-center border-bottom border-black rounded p-2 ">Registration form</h3>
          <div className="form-group" style = {{"paddingTop":"20px"}}>
              <label htmlFor="userName" className = "control-label font-weight-bold">Name:<span className="text-danger">*</span></label>
              <input
                  type="text"
                  name="userName"
                  id="userName"
                  value={this.state.formValue.userName}
                  onChange={this.handleChange}
                  className="form-control"
                  placeholder="Enter your name"
              />
              <span name="userNameError" className="text-danger  font-weight-bold">
                  {this.state.formErrorMessage.userName} 
              </span>
              <span name="userNameSuccess" className="text-success  font-weight-bold">
                  {this.state.formSuccessMessage.userName} 
              </span>
          </div>
          <div className="form-group">
              <label htmlFor="emailId" className = "control-label font-weight-bold">Email ID:<span className="text-danger">*</span></label>
              <input
                  type="email"
                  name="emailId"
                  id="emailId"
                  value={this.state.formValue.emailId}
                  onChange={this.handleChange}
                  className="form-control"
                  placeholder="Enter your email id"

              />
              <span name="emailIdError" className="text-danger  font-weight-bold">
                  {this.state.formErrorMessage.emailId}
              </span>
              <span name="emailIdSuccess" className="text-success  font-weight-bold">
                  {this.state.formSuccessMessage.emailId} 
              </span>
              
          </div>
          <div className="form-group">
              <label htmlFor="contactNumber" className = "control-label font-weight-bold">Contact Number:<span className="text-danger">*</span></label>
              <input
                  type="number"
                  name="contactNumber"
                  id="contactNumber"
                  value={this.state.formValue.contactNumber}
                  onChange={this.handleChange}
                  className="form-control"
                  placeholder="Enter your contact no"

              />
              <span name="contactNumberError" className="text-danger  font-weight-bold">
                  {this.state.formErrorMessage.contactNumber}
              </span>
              <span name="contactSuccess" className="text-success  font-weight-bold">
                  {this.state.formSuccessMessage.contactNumber} 
              </span>
          </div>
          <div className="form-group">
              <label htmlFor="password" className = "control-label font-weight-bold">Password:<span className="text-danger">*</span></label>
              <input
                  type="password"
                  name="password"
                  value={this.state.formValue.password}
                  onChange={this.handleChange}
                  className="form-control"
                  placeholder="Enter your password"

              />
              <span name="passwordError" className="text-danger  font-weight-bold">
                  {this.state.formErrorMessage.password}
              </span>
              <span name="passwordSuccess" className="text-success  font-weight-bold">
                  {this.state.formSuccessMessage.password} 
              </span>
          </div>

          <div className="form-group">
              <label htmlFor="confirm password" className = "control-label font-weight-bold">Confirm Password:<span className="text-danger">*</span></label>
              <input
                  type="password"
                  name="confirmPassword"
                  value={this.state.formValue.confirmPassword}
                  onChange={this.handleChange}
                  className="form-control"
                  placeholder="Enter password again"

              />
              <span name="confirmPasswordError" className="text-danger  font-weight-bold">
                  {this.state.formErrorMessage.confirmPassword}
              </span>
              <span name="confirmPasswordSuccess" className="text-success  font-weight-bold">
                  {this.state.formSuccessMessage.confirmPassword} 
              </span>
          </div>
          <span className="text-muted  font-weight-bold " >Fields marked <span className="text-danger">*</span> are mandatory</span><br/>
          <button type="submit" className="btn btn-primary btn-block" data-toggle="modal" data-target="#myModal" style={{"margin-top":"14px"}}
              disabled={!this.state.formValid.buttonActive}
          >Register</button>
          <br/>
          <p className="forgot-password text-right">
            Already registered?<Link  to="/login">
             Log in
          </Link>
          </p>
          
      </form>
      <br/>

              <div class="modal shadow" id="myModal">
              <div class="modal-dialog">
                  <div class="modal-content">

              {this.state.successMessage?(
              <>
                  <div class="modal-header text-center">
                      <h4 className="modal-title text-center">Registraion Completed<span className="text-success pi pi-check"></span></h4>
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                  </div>

                  <div class="modal-body text-justify">
                      <h5 className="text-success text-justify text-center">{this.state.successMessage}</h5>
                  </div>

                  <div class="modal-footer">
                      <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                      <span><button className = "btn btn-primary btn-block" data-dismiss="modal" onClick = {this.goToLogin}>LOGIN</button></span>
                  </div>
              </>

              ):

              <>
              <div class="modal-header text-center">
                      <h4 className="modal-title text-center">Registration failed<span className="text-danger pi pi-times"></span></h4>
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                  </div>
                  
                  <div class="modal-body text-justify">
                      <h6 className="text-danger text-justify text-center">{this.state.errorMessage}</h6>
                  </div>

                  <div class="modal-footer">
                      <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                  </div>
             </> 
          }
  </div>
</div>
</div>
      <div className = "container bg-white">
          <div name="successMessage" className="font-weight-bold text-success text-bold text-center">
              <span className = "h5 ">{this.state.successMessage}</span>
              {this.state.successMessage?(<div>
                  <button className = "btn btn-primary btn-block" onClick = {this.goToLogin}>GO TO LOGIN</button>
              </div>):null}
          </div>
          <span name="errorMessage" className="text-danger font-weight-bold">
          <span className = "h4 ">{this.state.errorMessage}</span>
          </span>
      </div>


</div>
    );
    //return null
  }
}




