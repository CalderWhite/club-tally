import React, {Component} from "react";

const $ = require("jquery");

export default class SignInPage extends Component{
	constructor(props){
		super(props);
		this.state = {
			error: null,
			success: null,
			windowDuration: 30
		};
		
		this.setWindowStatus = this.setWindowStatus.bind(this);
		this.openWindow = this.openWindow.bind(this);
		this.closeWindow = this.closeWindow.bind(this);
		this.changeWindowDuration = this.changeWindowDuration.bind(this);
	}
	
	openWindow() {
		this.setWindowStatus(true);
	}
	
	closeWindow() {
		this.setWindowStatus(false);
	}
	
	setWindowStatus(status){
		this.props.firebase.auth().currentUser.getIdToken(true).then(idToken => {
			$.post("/set-window?token=" + idToken + "&status=" + status.toString() + "&windowDuration=" + this.state.windowDuration, null, data => {
				// SUCCESS
				this.setState({success: data.message});
			})
			.fail(data => {
			    this.setState({error: data.responseJSON.message});
			});
		}).catch(error => {
			this.setState({error: error.message});
		});
	}
	
	changeWindowDuration(event) {
		this.setState({windowDuration: event.target.value});
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
					<div className="btn btn-success" onClick={this.openWindow} style={{margin:5}}>Open Window</div>
					<div className="btn btn-danger" onClick={this.closeWindow} style={{margin:5}}>Close Window</div>
					
					<input
						type="text"
						class="form-control"
						placeholder="Window Duration"
						aria-label="Window Duration" 
						value={this.state.windowDuration}
						onChange={this.changeWindowDuration}
						style={{margin:5}}
						/>
				</div>
			</div>
		);
	}
}