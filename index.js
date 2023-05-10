const express = require("express")
const body_parser = require("body-parser")
const app = express();
app.use(body_parser.json())

let patients = new Object();
patients["123A"] = ["Alice", "Tan", "9111 1111"]
patients["456B"] = ["Bob", "Lee", "9222 2222"]

let records = new Object();
records["123A"] = "Status: Healthy"
records["456B"] = "Status: Sick"

function patient_exists(nric) {
    return patients[nric] !== undefined;
}

function name_matches_nric(nric, first_name, last_name) {
 return first_name === patients[nric][0] && last_name === patients[nric][1];
}

app.get("/records", (req, res) => {

    const nric = req.headers.nric;
    const first_name = req.headers.first_name;
    const last_name = req.headers.last_name;
    const visit_purpose = req.body.visit_purpose;

    if (!patient_exists(nric)) {
        res.status(404).send({"message": "No patient with NRIC: " + nric});
        return;
    }

    if (!name_matches_nric(nric, first_name, last_name)) {
        res.status(403).send({"message": "First or last name does not match NRIC."});
        return;
    }

    if (visit_purpose !== "check_record") {
        res.status(501).send({"message": "Unable to serve: " + visit_purpose});
        return;
    }

    res.status(200).send({"message": records[nric]});
});

app.post("/records", (req, res) => {

    const nric = req.headers.nric;
    const first_name = req.headers.first_name;
    const last_name = req.headers.last_name;
    const phone = req.headers.phone;

    if (patient_exists(nric)) {
        res.status(400).send({"message": "This patient already exists!"});
        return;
    }

    patients[nric] = [first_name, last_name, phone];
    res.status(200).send({"message": "New patient added to records."});
    console.log(patients);
});

app.put("/records", (req, res) => {

    const nric = req.headers.nric;
    const first_name = req.headers.first_name;
    const last_name = req.headers.last_name;
    const phone = req.headers.phone;

    if (!patient_exists(nric)) {
        res.status(404).send({"message": "No patient with NRIC: " + nric});
        return;
    }

    if (!name_matches_nric(nric, first_name, last_name)) {
        res.status(403).send({"message": "First or last name does not match NRIC."});
        return;
    }

    patients[nric][2] = phone;
    res.status(200).send({"message": "Updated phone number of patient: " + first_name + " " + last_name});
    console.log(patients);
});

app.delete("/records", (req, res) => {

    const nric = req.headers.nric;
    const first_name = req.headers.first_name;
    const last_name = req.headers.last_name;

    if (!patient_exists(nric)) {
        res.status(404).send({"message": "No patient with NRIC: " + nric});
        return;
    }

    if (!name_matches_nric(nric, first_name, last_name)) {
        res.status(403).send({"message": "First or last name does not match NRIC."});
        return;
    }

    delete patients[nric];
    res.status(200).send({"message": "Deleted patient: " + first_name + " " + last_name});
    console.log(patients);
});

// https://localhost:3000
app.listen(3000);