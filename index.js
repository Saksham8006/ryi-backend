const dotenv = require('dotenv')
dotenv.config({ path: './.env' })
const express = require('express')
const app = express();
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')

var sib = require('sib-api-v3-sdk');

var client = sib.ApiClient.instance;
const Form = require("./models/Form")
const ContactInfo = require("./models/ContactInfo")
const db = require("./config/db");

app.use(cors())


const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

const User = require("./models/User");



const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const axios = require('axios')

app.use(express.json())
app.use(express.static('dist'));


mongoose.connect(process.env.DATABASE_URI,
	{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then(() => console.log('MongoDB Atlas connected'))
	.catch((error) => console.error('MongoDB Atlas connection error:', error.message));

var sib = require("sib-api-v3-sdk");

var client = sib.ApiClient.instance;

var apiKey = client.authentications['api-key'];
apiKey.apiKey = "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"


const tranEmailApi = new sib.TransactionalEmailsApi();

const sender = {
// <<<<<<< HEAD
	email: 'info@rateyourinstitute.com',
	name: 'RateYourInstitute',
// =======
	email: 'ratemyinstitute@gmail.com',
	name: 'RateMyInstitute'
// >>>>>>> origin/main
}




async function sendApprovalLetter(recipientEmail) {
	const templateId = 1;

	const requestPayload = {
// <<<<<<< HEAD
		sender: { name: 'RateYourInstitute', email: 'info@rateyourinstitute.com' },
// =======
		sender: { name: 'RateMyInstitute', email: 'ratemyinstitute@gmail.com' },
// >>>>>>> origin/main
		to: [{ email: recipientEmail }],
		templateId: templateId,
	};


	try {
		console.log(apiKey.apiKey)
		const response = await axios.post('https://api.sendinblue.com/v3/smtp/email', requestPayload, {
			headers: { 'api-key': apiKey.apiKey }
		});
		console.log('Email sent successfully:', response.data);
	} catch (error) {
		console.error('Error sending email:', error.response.data);
	}
}


app.post('/send-approval-email', async (req, res) => {
	// const { recipientEmail } = req.body;

	// if (!recipientEmail) {
	//   return res.status(400).json({ error: 'Recipient email is required.' });
	// }

	const requestPayload = {

		sender: { name: 'RateYourInstitute', email: 'info@rateyourinstitute.com' },

		sender: { name: 'RateYourInstitute', email: 'ratemyinstitute@gmail.com' },

		to: [{ email: recipientEmail }],
		templateId: templateId,
	};

	try {
		const response = await axios.post('https://api.sendinblue.com/v3/smtp/email', requestPayload, {
			headers: { 'api-key': apiKey },
		});
		console.log('Email sent successfully:', response.data);
		res.json({ success: true, message: 'Approval email sent successfully.' });
	} catch (error) {
		console.error('Error sending email:', error.response.data);
		res.status(500).json({ error: 'Error sending approval email.' });
	}
});


//  Reviews Add
app.post('/api/review/add', async (req, res) => {
	console.log("req", req.body.otherEntranceExamValue)
	try {

		await Form.create({
			educationRatings: req.body.education,
			infrastructureRatings: req.body.infrastructure,
			facultyRatings: req.body.faculty,
			locationRatings: req.body.location,
			email: req.body.email,
			joiningYear: req.body.joiningYear,
			instiName: req.body.instiName,
			instiLocation: req.body.instiLocation,
			paragraph: req.body.message,
			course: req.body.course,
			otherEntranceExamValue: req.body.otherEntranceExamValue,
			experience: req.body.experience,
			createdOn: new Date(),
			status: "unresolved"

		})

		res.status(200).json({ status: 'ok', text: 'Stored successfully' })
	} catch (err) {
		res.status(500).json({ status: 'error', error: err })
	}
})

// contact information
// app.post('/api/contactInfo', async (req, res) => {
// 	console.log(req.body)
// 	try {
// 		await ContactInfo.create({
// 			name: req.body.name,
// 			email: req.body.email,
// 			phone: req.body.phone,
// 			message: req.body.message,
// 		})
// 		const receivers = [{
// 			email: "saksham555sharma@gmail.com"
// 		}]
// 		tranEmailApi.sendTransacEmail({
// 			sender,
// 			to: receivers,
// 			subject: "Congrats",
// 			htmlContent: "<p style='font-size:14px; padding:20px;color:#333'>{{params.name}} {{params.email}} {{params.phone}}   {{params.message}}  </p>",
// 			params: {
// 				"name": req.body.name, "phone": req.body.phone, "email": req.body.email, "message": req.body.message
// 			}

// 		}).then(console.log("/"))

// 		res.json({ status: 'ok', text: 'Send successfully' })
// 	} catch (err) {
// 		res.json({ status: 'error', error: err })
// 	}
// })

app.post('/api/contactInfo', async (req, res) => {
	console.log(req.body);
	try {
		await ContactInfo.create({
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			message: req.body.message,
		});

		// Determine the recipient's email address dynamically based on your logic
		const recipientEmail = determineRecipientEmail(req.body);

		const receivers = [{
			email: recipientEmail
		}];

		tranEmailApi.sendTransacEmail({
			sender,
			to: receivers,
			subject: "Congrats",
			htmlContent: "<p style='font-size:14px; padding:20px;color:#333'>{{params.name}} {{params.email}} {{params.phone}} {{params.message}}</p>",
			params: {
				"name": req.body.name,
				"phone": req.body.phone,
				"email": req.body.email,
				"message": req.body.message
			}
		}).then(() => {
			console.log("/");
			res.json({ status: 'ok', text: 'Send successfully' });
		});
	} catch (err) {
		res.json({ status: 'error', error: err });
	}
});

function determineRecipientEmail(requestData) {
	// Implement your logic to determine the recipient's email address here.
	// You can access the requestData object to make this determination.
	// For example, you might check the type of request or user role to decide the recipient.
	// Return the recipient's email address as a string.
	// Example:
	if (requestData.type === 'admin') {
		return 'admin@example.com';
	} else {
		return 'user@example.com';
	}
}


app.delete('/reviews/delete/:id', async (req, res) => {
	const id = req.params.id;

	try {
		// Delete the document with the given ID using Mongoose
		await Form.findByIdAndRemove(id);
		console.log('Document deleted successfully');
		res.json({ message: 'Document deleted successfully' });
	} catch (error) {
		console.error('Error deleting document:', error);
		res.status(500).json({ error: 'Failed to delete document' });
	}
});

app.delete('/queries/delete/:id', async (req, res) => {
	const id = req.params.id;

	try {
		// Delete the document with the given ID using Mongoose
		await ContactInfo.findByIdAndRemove(id);
		console.log('Document deleted successfully');
		res.json({ message: 'Document deleted successfully' });
	} catch (error) {
		console.error('Error deleting document:', error);
		res.status(500).json({ error: 'Failed to delete document' });
	}
});

app.get("/api/reviews/read", (req, res) => {
	Form.find({ status: "unresolved" })
		.then((reviews) => {
			res.status(200).json({ status: "unresolved", reviews: reviews });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ status: "error", error: err });
		});
});

app.put("/api/reviews/approve", (req, res) => {

	const reviewId = req.body.id;
	const email = req.body.email;



	// Find the review by ID
	Form.findByIdAndUpdate(
		reviewId,
		{ status: "resolved" },
		{ new: true },

	)
		.then((updatedReview) => {
			if (!updatedReview) {
				return res.status(404).json({ error: "Review not found" });
			}
			sendApprovalLetter(email)

			res.status(200).json({ message: "Review status updated", review: updatedReview });
		})
		.catch((error) => {
			console.error("Error updating review status:", error);
			res.status(500).json({ error: "Failed to update review status" });
		});
});

app.get("/api/reviews/resolved", (req, res) => {
	Form.find({ status: "resolved" })
		.then((reviews) => {
			res.status(200).json({ status: "resolved", reviews: reviews });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ status: "error", error: err });
		});
});

app.get("/api/reviews/:id", (req, res) => {
	const { id } = req.params;

	Form.findById(id)
		.then((review) => {
			if (review) {
				res.status(200).json({ status: "success", review: review });
			} else {
				res.status(404).json({ status: "not found", error: "Review not found" });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ status: "error", error: err });
		});
});





app.get("/api/queries/read", (req, res) => {
	ContactInfo.find({})
		.then((queries) => {
			//  console.log(reviews)
			res.status(200).json({ status: "resolved", queries: queries });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ status: "error", error: err });
		});
});



// Update Review Content
app.put("/updateReview/:id", async (req, res) => {


	try {
		const id = req.params.id;
		const updateForm = await Form.findByIdAndUpdate(id, req.body, {
			new: true
		});
		res.send(updateForm);
	} catch (error) {
		res.status(400).json({ error: 'Failed to update document' });
	}
})




//  for Signup
app.post('/register', async (req, res) => {
	try {
		const { name, email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ status: 'error', error: 'Duplicate email' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			name,
			email,
			password: hashedPassword,
		});

		await newUser.save();

		res.status(200).json({ status: 'ok' });
	} catch (err) {
		res.status(500).json({ status: 'error', error: 'Internal server error' });
	}
});



app.post('/login', async (req, res) => {

	const { email, password } = req.body

	try {
		const user = await User.findOne({ email: email })
		console.log(user)
		if (user) {
			const isPasswordValid = await bcrypt.compare(password, user.password)

			if (isPasswordValid) {
				const token = jwt.sign(
					{
						name: user.name,
						email: user.email,
					},
					'secret123'
				)

				return res.status(200).json({ status: 'ok', user: token })
			} else {
				return res.status(401).json({ status: 'error', user: false, remarks: "Email or Password is not valid" })
			}
		}
		else {
			return res.status(401).json({ status: 'error', user: false, remarks: "Email or Password is not valid" })

		}

	}
	catch (error) {
		console.log(error.message)
		res.status(500).json({ error: "Server error" })

	}







})


app.get("/api/reviews/read/:id", async (req, res) => {
	console.log("Id: ", req.params.id)
	try {
		const result = await Form.findOne({ _id: req.params.id })
		console.log(result)
		res.status(200).send(result);
	}
	catch (err) {
		console.log(err.message)
		res.status(500).json({ success: false, message: err.message })
	}
})

// for read contact information

app.get("/api/queries/read/:id", async (req, res) => {
	console.log(req.params.id)
	const result = await ContactInfo.findOne({ _id: req.params.id })
	console.log(result)
	res.send(result);

})


app.put("/updateReview/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const updateForm = await Form.findByIdAndUpdate(id, req.body, { new: true });
		if (!updateForm) {
			return res.status(404).json({ error: 'Review not found', status: 'error' });
		}
		res.status(200).json({ status: "ok", review: updateForm });
	} catch (error) {
		console.error('Failed to update review:', error);
		res.status(500).json({ error: 'Failed to update review', status: 'error' });
	}
});


app.put("/updateQuery/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const updateContactInfo = await ContactInfo.findByIdAndUpdate(id, req.body, {
			new: true
		});
		res.status(200).json({ status: "ok" });
		res.send(updateContactInfo)
	} catch (error) {
		res.status(400).json({ error: 'Failed to update document', status: "error" });
	}
})


//  Delete Table data
app.delete("/formData/:id", async (req, res) => {
	const result = await Form.deleteOne({ _id: req.params.id })
	res.send(result);
	// res.send(req.params.id);
})


app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});





const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
	console.log(`Sever running on port ${PORT}`)
);


process.on("unhandledRejection", (err, promise) => {
	console.log(`Logged Error: ${err.message}`);

	server.close(() => process.exit(1));
});
