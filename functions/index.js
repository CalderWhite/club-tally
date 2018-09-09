const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const querystring = require('querystring');

const app = express();

// aquire the credentials from firebase config
admin.initializeApp(functions.config().firebase);

var db = admin.firestore();
let DB_SETTINGS = {
    timestampsInSnapshots: true
};
db.settings(DB_SETTINGS);

var windowClosedTime = 0;
const DAY = 60*60*24;
const MAX_WINDOW_DURATION = 30;
const GOOD_DOMAINS = ["wrdsb.ca"];

function checkAdmin(uid, callback) {
	// return uid == "Ua63WGDUSxRQh1v58SA8d140LUs1";
	let ref = db.collection("admins")
		.where("uid","==",uid);
	ref.get().then(data=>{
		callback(data.size > 0);
	});
}

function getTime() {
	return Math.floor(new Date() / 1000);
}

// endpoint for skills sorted by amount of companies using it
app.get('/test',(request,response) => {
    response
        .status(200)
        .json({"status": 200, "message": "OK"});
});

app.post('/set-window', (request, response) => {
    admin.auth().verifyIdToken(request.query.token)
        .then(decodedToken => {
        	checkAdmin(decodedToken.uid,isAdmin=>{
	            if (isAdmin) {
	                let windowOpen = request.query.status == 'true';
	                if (windowOpen) {
		                let openMinutes = Math.min(MAX_WINDOW_DURATION, Number(request.query.windowDuration));
		                windowClosedTime = getTime() + openMinutes*60*1000;
	                } else {
	                	windowClosedTime = 0;
	                }
	                
	                response
	                    .status(200)
	                    .json({status: 200, message: "Successfully set window status."});
	            } else {
	                response
	                    .status(400)
	                    .json({status: 400, message: "You are not authorized to modify the tally window."});
	            }
        	});
    }).catch(function(error) {
        response
            .status(400)
            .json({status: 400, message: "Could not verify the given token as a signed in user. \nError:\n" + error.message});
    });
});

app.post('/add-tally',(request,response) => {
    admin.auth().verifyIdToken(request.query.token)
        .then(decodedToken => {
        	let isAdmin = checkAdmin(decodedToken.uid,isAdmin=>{
        		let currentTime = getTime();
	        	if (isAdmin) {
	        		response
	        			.status(200)
	        			.json({status: 200, message: "Admin Signed in.", admin: isAdmin});
	        	} else if (GOOD_DOMAINS.includes(decodedToken.email.split("@")[1])) {
	            	if (currentTime <= windowClosedTime) {
	    				let doc = db.collection('users')
	    				    .doc(decodedToken.uid);
	    				
	    				doc.get()
	    				    .then(snapshot => {
	    						let lastUpdate = snapshot.get('lastUpdate');
	    						if (!lastUpdate || currentTime - lastUpdate >= DAY) {
	    						    let tally = snapshot.get('tally');
	    						    doc.set({
	    						        lastUpdate: currentTime,
	    						        tally: (tally ? tally : 0) + 1
	    						    });
	    						    response
	    						        .status(200)
	    						        .json({status: 200, message: "Tally addition successful!", admin: isAdmin});
	    						} else {
	    							response.status(400)
	            					.json({status: 400, message: "You tried to add a tally twice in one day :(."});
	    				        }
	    				    }, errorObject => {
	    				        response
	    				            .status(500)
	    				            .json({status: 500, message: errorObject.message});
	    					});
	            	 } else {
	    				response.status(400)
	    				    .json({status: 400, message: "You tried to add a tally when the window was not open :(."});
	    		    }
	        	} else {
	        	    response.status(400)
	        	        .json({status: 400, message: "The email's domain is not allowed. It must be one of the following: " + GOOD_DOMAINS.toString()});
	        	}
        	});
    }).catch(function(error) {
        response
            .status(400)
            .json({status: 400, message: "Could not verify the given token as a signed in user. \nError:\n" + error.message});
    });
});

exports.app = functions.https.onRequest(app);