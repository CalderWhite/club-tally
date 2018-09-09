import React from "react";
import ReactDOM from "react-dom";

const $ = require("jquery/dist/jquery.slim.js");
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserCog } from '@fortawesome/free-solid-svg-icons';

import HelpPage from "./HelpPage.jsx";
import SignInPage from "./SignInPage.jsx";
import AdminPage from "./AdminPage.jsx";

import "../css/normalize.css";
import "../css/demo.css";
import "../css/component.css";

const firebase = require("firebase/app");
require("firebase/auth");

// Initialize Firebase
var config = {
	apiKey: "AIzaSyDyTLeYSabOdtgh28GMNIBJTy1vxvL8WNQ",
	authDomain: "club-tally.firebaseapp.com",
	databaseURL: "https://club-tally.firebaseio.com",
	projectId: "club-tally",
	storageBucket: "club-tally.appspot.com",
	messagingSenderId: "681988526740"
};
firebase.initializeApp(config);
// use the device's default language for all proceeding operations
firebase.auth().useDeviceLanguage();

class App extends React.Component {
	constructor(props){
		super(props);
		this.changeContent = this.changeContent.bind(this);
		this.checkAdmin = this.checkAdmin.bind(this)

		this.state = {
		    content: <SignInPage firebase={firebase} adminCheck={this.checkAdmin} />
		};
	}
	
	componentDidMount() {
		new gnMenu( document.getElementById( 'gn-menu' ) );
	}
	
	changeContent(content) {
		this.setState({
			content: content
		});
	}
	
	checkAdmin(admin) {
	    if(admin) {
	        this.setState({
	            admin: admin,
	            content: <AdminPage firebase={firebase} />
	        })
	    }
	}
	
	render() {
		return (
			<div className="container">
				<div style={{height: 70, width: "100%", display: "block"}}>
				</div>
				<div>
					{this.state.content}
				</div>
				<ul id="gn-menu" className="gn-menu-main">
					<li className="gn-trigger">
						<a className="gn-icon gn-icon-menu"><span>Menu</span></a>
						<nav className="gn-menu-wrapper">
							<div className="gn-scroller">
								<ul className="gn-menu">
									<li onClick={()=>this.changeContent(<SignInPage firebase={firebase} adminCheck={this.checkAdmin}/>)}>
										<span className="gn-icon">
											<div className="menu-icon">
												<FontAwesomeIcon icon={faHome} />
											</div>
											Home
										</span>
									</li>
									<li onClick={()=>this.changeContent(<HelpPage />)}><a className="gn-icon gn-icon-help">Help</a></li>
									<li style={{display: this.state.admin ? "inherit" : "none"}} onClick={()=>this.changeContent(<AdminPage firebase={firebase} />)}>
										<span className="gn-icon">
											<div className="menu-icon">
												<FontAwesomeIcon icon={faUserCog} />
											</div>
											Admin
										</span>
									</li>
								</ul>
								
							</div>
						</nav>
					</li>
					<li><a href="/">Club Tally: {this.props.clubName}</a></li>
				</ul>
			</div>
		);
	}
}

$(document).ready(()=>{
  const app = $("#app")[0];
  ReactDOM.render(<App clubName="mathletes"/>, app);
})