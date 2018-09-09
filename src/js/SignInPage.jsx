import React, {Component} from "react";
import "../css/signup.scss";

import GoogleButton from "./components/GoogleButton.jsx";

const $ = require("jquery");

export default class SignInPage extends Component{
	constructor(props){
		super(props);
		this.state = {
			error: null,
			success: null
		};
		this.signInWithGoogle = this.signInWithGoogle.bind(this);
		this.signIn = this.signIn.bind(this);
	}
	
	signInWithGoogle(){
		this.signIn(new this.props.firebase.auth.GoogleAuthProvider());
	}
	
	signIn(provider){
		this.props.firebase
			.auth()
			.signInWithPopup(provider)
			.then(result => {
				this.props.firebase.auth().currentUser.getIdToken(true).then(idToken => {
					$.post("/add-tally?token=" + idToken, null, data => {
					this.props.adminCheck(data.admin)
						this.setState({
							success: data.message,
						})
					})
					.fail(data => {
					    this.setState({error: data.responseJSON.message})
					})
				}).catch(error => {
					this.setState({error: error.message});
				});
			},
			() => {
				alert("There was an error signing in!");
			}
		);
	}
	
	render(){
		return (
			<div style={{textAlign:'center'}}>
				<div style={{maxWidth:550, margin: "auto"}}>
				    <div className="notify row" style={{opacity: (this.state.error || this.state.success) ? 1 : 0, background: this.state.error ? "red" : "#28a745"}}>
				        <div
				            className="clear-button col-sm-1" 
				            onClick={()=>setTimeout(()=>this.setState({error: null, success: null}),300)}
				            >&times;</div>
				        <span className="col-sm-10">{(this.state.error ? this.state.error : "") + (this.state.success ? this.state.success : "")}</span>
				    </div>
			    </div>
				<div style={{display: 'inline-block', padding: 10}}>
					<GoogleButton onClick={this.signInWithGoogle} />
				</div>
			</div>
		);
	}
}