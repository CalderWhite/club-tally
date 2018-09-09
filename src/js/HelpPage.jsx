import React, {Component} from "react";

export default class SignUpPage extends Component{
	constructor(props){
		super(props);
		this.state = {};
	}
	render(){
		return (
			<div style={{width: "80%", minWidth: 350, maxWidth: 740}}>
				<h1>Welcome to Club Tally!</h1>
				<p>
					Club Tally is a secure online platform for clubs or organizations to keep track of their member's attendance. 
					The process is simple and easy. During the sign in window, open the "Add Tally" tab and click "Add Tally with Google".
					Remember to sign in with your WRDSB email!
				</p>
			</div>
		);
	}
}