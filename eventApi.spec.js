const { test, expect, request } = require('@playwright/test');
const fs = require('fs');

const creds = { email: "luxortest1@gmail.com", password: "Oneplus@0908" };
const cred2 = { email: "", password: "Oneplus@0908" };
const creds1 = { email: "luxortest1@gmail.com", password: "test@0908" };
const url = "https://api.eventhub.rahulshettyacademy.com/api";
const eventcreate = {
    title: "QA Summit Workshop",
    description: "Tranforming the QA Test to AI driven Test",
    category: "Workshop",
    venue: "Pune Tech Centre",
    city: "Pune",
    eventDate: "2026-06-15T09:00:00.000Z",
    price: 1500,
    totalSeats: 500,
    imageUrl: "https://example.com/banner.jpg"
};
const updatevent = {
    title: "QA Summit Workshop Updated",
    description: "Tranforming the QA Test to AI driven Test Automation",
    category: "Workshop And Conference",
    venue: "Pune Tech Centre",
    city: "Pune",
    eventDate: "2026-07-15T09:00:00.000Z",
    price: 1500,
    totalSeats: 500,
    imageUrl: "https://example.com/banner.jpg"
};

let authToken;

test.beforeAll(async ({ request }) => {

    // Try to register, if fails (email exists), try to login
    try {
        // Attempt to register
        const register = await request.post(url + '/auth/register', {
            headers: {
                "Content-Type": "application/json",
            },
            data: creds,
        });

        if (register.status() === 201) {
            console.log('✅ User registered successfully');
            const response = await register.json();
            console.log('Register Response:', response);

            // Extract and store token
            authToken = response.token || response.accessToken || response.authToken || response.access_token;
            expect(response.user.email).toBe(creds.email);

        } else if (register.status() === 400) {
            console.log('⚠️ User already exists, attempting login...');

            //Assert the 400 bad request
            const badrequest = await register.json();
            console.log(badrequest);
            expect(badrequest.error).toBe('Email already registered');
        }

        // If registration fails (user exists), try login
        const login = await request.post(url + '/auth/login', {
            headers: {
                "Content-Type": "application/json",
            },
            data: creds,
        });

        expect(login.ok()).toBeTruthy();
        expect(login.status()).toBe(200);

        const loginResponse = await login.json();
        console.log('Login Response:', loginResponse);

        // Extract and store token
        authToken = loginResponse.token || loginResponse.accessToken || loginResponse.authToken || loginResponse.access_token;

        // Verify email from actual API response structure
        expect(loginResponse.user.email).toBe(creds.email);

        // Store token in JSON file
        const tokenData = {
            token: authToken,
            timestamp: new Date().toISOString()
        };
        fs.writeFileSync('apitoken.json', JSON.stringify(tokenData, null, 2));
        console.log('✅ Token saved to apitoken.json');
        console.log('Token:', authToken);

    } catch (error) {
        console.error('❌ Error in authentication:', error);
        throw error;
    }
});

// test('Verify user can register or login and token is stored', async ({ request }) => {
//     // Verify token was stored
//     expect(authToken).toBeDefined();
//     expect(authToken).not.toBeNull();

//     // Verify token file exists
//     const tokenFileExists = fs.existsSync('apitoken.json');
//     expect(tokenFileExists).toBeTruthy();

//     // Read and verify token from file
//     const tokenData = JSON.parse(fs.readFileSync('apitoken.json', 'utf-8'));
//     expect(tokenData.token).toBe(authToken);
//     expect(tokenData.email).toBe(creds.email);

//     console.log('✅ Token verification successful');
// });

// test('Use stored token for authenticated API request', async ({ request }) => {
//     // Example: Make an authenticated API call using the stored token
//     // Replace with your actual protected endpoint

//     // Read token from file
//     const tokenData = JSON.parse(fs.readFileSync('apitoken.json', 'utf-8'));

//     console.log('Using token for authenticated request:', tokenData.token);

// });

test('Test API status code assertions for auth login api', async ({ request }) => {
    // Example 1: Test successful login - 200 OK
    const loginResponse = await request.post(url + '/auth/login', {
        headers: {
            "Content-Type": "application/json",
        },
        data: creds,
    });

    expect(loginResponse.status()).toBe(200);
    expect(loginResponse.ok()).toBeTruthy();
    console.log('✅ Login status: 200 OK');

    // Example 2: Test bad request - 400
    const badRequest = await request.post(url + '/auth/login', {
        headers: {
            "Content-Type": "application/json",
        },
        data: { email: "", password: "" },
    });

    expect(badRequest.status()).toBe(400);
    expect(badRequest.ok()).toBeFalsy();
    console.log('✅ Bad request status: 400');

    //Assert the response
    const badRequestJson = await badRequest.json();
    console.log(await badRequestJson);
    expect(await badRequestJson.error).toBe("Validation failed");
    expect(await badRequestJson.details[0].message).toBe("A valid email is required");
    expect(await badRequestJson.details[1].message).toBe("Password must be at least 6 characters");

    //Test the 400 error with bad password
    const badRequest2 = await request.post(url + '/auth/login', {
        headers: {
            "Content-Type": "application/json",
        },
        data: creds1,
    });
    expect(badRequest2.status()).toBe(400);
    expect(badRequest2.ok()).toBeFalsy();
    console.log('✅ Bad request status: 400');

    const badpassword = await badRequest2.json();
    expect(await badpassword.error).toBe("Invalid email or password");

    //Test the 400 error with bad email
    const badRequest3 = await request.post(url + '/auth/login', {
        headers: {
            "Content-Type": "application/json",
        },
        data: cred2,
    });
    expect(badRequest3.status()).toBe(400);
    expect(badRequest3.ok()).toBeFalsy();
    console.log('✅ Bad request status: 400');

    const bademail = await badRequest3.json();
    expect(await bademail.details[0].message).toBe("A valid email is required");

});

test('Verify the APi of Currently authenticated user', async ({ request }) => {

    const getcurrentuser = await request.get(url + '/auth/me', {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken,
        }
    });

    expect(getcurrentuser.status()).toBe(200);
    expect(getcurrentuser.ok()).toBeTruthy();
    console.log('✅ Login status: 200 OK');

    const currentuser = await getcurrentuser.json();
    console.log('Current User Response:', currentuser);
    expect(currentuser.user.email).toBe(creds.email);

    // Example 2: Test Bad request 401
    const unauthorized = await request.get(url + '/auth/me', {
        headers: {
            "Content-Type": "application/json",
        }
    });

    expect(unauthorized.status()).toBe(401);
    expect(unauthorized.ok()).toBeFalsy();
    console.log('Login status: 401 unauthorized');

    //Assert the response
    const badcode = await unauthorized.json();
    console.log('Unauthorized Response:', badcode);
    expect(badcode.error).toBe("Unauthorized");
});

test('Verify the List of Users Get Event, Create a New Event, get the event created, update and Delete the Event', async ({ request }) => {

    //Unautorized 401 event of get call
    const getEventsunauthored = await request.get(url + '/events', {
        params: {
            category: "Festival",
            city: "Pune",
            search: "QA",
            page: 1,
            limit: "10"
        },
        headers: {
            "Content-Type": "application/json",
            //"Authorization": "Bearer " + authToken,
        }
    });

    expect(getEventsunauthored.status()).toBe(401);
    expect(getEventsunauthored.ok()).toBeFalsy();
    console.log('Error:  401 ');

    const unauthored = await getEventsunauthored.json();
    console.log('Current Event Lists:', unauthored);
    expect(unauthored.error).toBe("Unauthorized");

    //Create a new Event
    const createEvent = await request.post(url + '/events', {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken,
        },
        data: eventcreate,
    });

    expect(createEvent.status()).toBe(201);
    expect(createEvent.ok()).toBeTruthy();
    console.log('201 Event Created');

    const eventdetails = await createEvent.json();
    console.log(eventdetails);
    expect(eventdetails.message).toBe("Event created successfully");
    expect(eventdetails.data.description).toBe("Tranforming the QA Test to AI driven Test");
    expect(eventdetails.data.city).toBe("Pune");
    const Eventid = eventdetails.data.id;
    console.log('Event ID:', Eventid);


    //Get the Event by Eventid
    const eventid = await request.get(url + '/events', {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken,
        },
        params: {
            id: Eventid,
        }
    });

    expect(eventid.status()).toBe(200);
    expect(eventid.ok()).toBeTruthy();
    console.log('200 Event Found');

    const geteventid = await eventid.json();
    console.log(geteventid);

    //Test the Invalid EventId
    const invalidevent = await request.get(url + '/events/12222222222', {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken,
        }
    });

    expect(invalidevent.status()).toBe(404);
    expect(invalidevent.ok()).toBeFalsy();
    console.log('404 Event Not Found');

    const invalid = await invalidevent.json();
    expect(invalid.error).toBe("Event with id 12222222222 not found");
    console.log(invalid.error);

    //update the event using event Id
    const updatedEvent = await request.put(url + '/events/' + Eventid, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken,
        },
        data: updatevent,
    });

    expect(updatedEvent.status()).toBe(200);
    expect(updatedEvent.ok()).toBeTruthy();
    console.log('200 Event Updated Successfully');

    const updateddata = await updatedEvent.json();
    console.log(updateddata);
    expect(updateddata.message).toBe("Event updated successfully");
    expect(updateddata.data.description).toBe("Tranforming the QA Test to AI driven Test Automation");
    expect(updateddata.data.city).toBe("Pune");

    //Test 400 Request using without data
    const withoutdataEvent = await request.put(url + '/events/' + Eventid, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken,
        }
    });

    expect(withoutdataEvent.status()).toBe(400);
    expect(withoutdataEvent.ok()).toBeFalsy();
    console.log('Update Failed the Event not found');

    const invalidjson = await withoutdataEvent.json();
    console.log(invalidjson);
    expect(invalidjson.error).toBe("Validation failed");
    expect(invalidjson.details[0].message).toBe("Title is required");
    expect(invalidjson.details[1].message).toBe("Category is required");
    expect(invalidjson.details[2].message).toBe("Venue is required");
    expect(invalidjson.details[3].message).toBe("City is required");

    //Test 404 with invalid event id
    const putinvalid = await request.put(url + '/events/1222222222222', {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken,
        },
        data: updatevent,
    });

    expect(putinvalid.status()).toBe(404);
    expect(putinvalid.ok()).toBeFalsy();
    console.log('Event not Found');

    const invalidput = await putinvalid.json();
    console.log(invalidput);
    expect(invalidjson.error).toBe("Validation failed");

    //Delet the Event in the end
    const deletevent = await request.delete(url + '/events/' + Eventid, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken,
        }
    });

    expect(deletevent.status()).toBe(200);
    expect(deletevent.ok()).toBeTruthy();
    console.log('Event Deleted Successfully');

    const eventdeleted = await deletevent.json();
    expect(eventdeleted.message).toBe("Event deleted successfully");
    console.log(eventdeleted);

    //Search for Deleted Event
    const deleted = await request.delete(url + '/events/' + Eventid, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken,
        }
    });

    expect(deleted.status()).toBe(404);
    expect(deleted.ok()).toBeFalsy();
    console.log('No Event to be Deleted');

    const deletedjson = await deleted.json();
    expect(deletedjson.error).toBe('Event with id ' + Eventid + ' not found');
    console.log(deletedjson);
});

