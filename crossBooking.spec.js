const { test, expect, request } = require('@playwright/test');
const fs = require('fs');

// Credentials for different email domains
const creds = { email: "luxortest1@gmail.com", password: "Oneplus@0908" };
const yahoo = { email: "luxor@yahoo.com", password: "Oneplus@0908" };
const cred2 = { email: "", password: "Oneplus@0908" };
const creds1 = { email: "luxortest1@gmail.com", password: "test@0908" };
const url = "https://api.eventhub.rahulshettyacademy.com/api";
const uiurl = "https://eventhub.rahulshettyacademy.com";

let authToken;
let yahooToken;
let yahooid;

/**
 * Helper function to authenticate user with register/login flow
 * @param {Object} request - Playwright request context
 * @param {Object} credentials - User credentials {email, password}
 * @param {string} baseUrl - API base URL
 * @param {string} tokenFileName - Optional token file name
 * @returns {Promise<string>} Authentication token
 */
async function authenticateUser(request, credentials, baseUrl, tokenFileName = 'apitoken.json') {
    let authToken;
    
    try {
        console.log(`🔐 Authenticating user: ${credentials.email}`);
        
        // Attempt to register
        const register = await request.post(`${baseUrl}/auth/register`, {
            headers: {
                "Content-Type": "application/json",
            },
            data: credentials,
        });

        if (register.status() === 201) {
            console.log('✅ User registered successfully');
            const response = await register.json();
            console.log('Register Response:', response);

            // Extract token from various possible field names
            authToken = response.token || response.accessToken || response.authToken || response.access_token;
            expect(response.user.email).toBe(credentials.email);
            
        } else if (register.status() === 400) {
            console.log('⚠️ User already exists, attempting login...');
            
            const badrequest = await register.json();
            console.log(badrequest);
            expect(badrequest.error).toBe('Email already registered');
        }

        // If registration didn't succeed or user exists, try login
        if (!authToken) {
            const login = await request.post(`${baseUrl}/auth/login`, {
                headers: {
                    "Content-Type": "application/json",
                },
                data: credentials,
            });

            expect(login.ok()).toBeTruthy();
            expect(login.status()).toBe(200);

            const loginResponse = await login.json();
            console.log('Login Response:', loginResponse);

            // Extract token from various possible field names
            authToken = loginResponse.token || loginResponse.accessToken || loginResponse.authToken || loginResponse.access_token;
            
            // Verify email from actual API response structure
            expect(loginResponse.user.email).toBe(credentials.email);
        }

        // Store token in JSON file
        const tokenData = {
            email: credentials.email,
            token: authToken,
            timestamp: new Date().toISOString()
        };
        
        fs.writeFileSync(tokenFileName, JSON.stringify(tokenData, null, 2));
        console.log(`✅ Token saved to ${tokenFileName}`);
        console.log(`Token: ${authToken.substring(0, 20)}...`);

        return authToken;

    } catch (error) {
        console.error(`❌ Error in authentication for ${credentials.email}:`, error.message);
        throw error;
    }
}
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

//Helper function of login and go to Bookings page
async function loginAndGoToBookings(page) {
    await page.goto(`${uiurl}/login`);
    await page.getByLabel('Email').fill(creds.email);
    await page.getByLabel('Password').fill(creds.password);
    await page.locator('#login-btn').click();
    await expect(page.getByTestId('nav-bookings')).toBeVisible();
}

test.beforeAll(async ({ request }) => {
    // Authenticate Gmail user
    authToken = await authenticateUser(request, creds, url, 'apitoken_gmail.json');
    
    // Authenticate Yahoo user
    yahooToken = await authenticateUser(request, yahoo, url, 'apitoken_yahoo.json');
    
    console.log('✅ All users authenticated successfully');
});

test('Test API status code assertions for auth login api for yahoo', async ({ request }) => {
    // Verify Yahoo user authentication
    console.log('✅ Yahoo user already authenticated in beforeAll');
    console.log('Yahoo Token:', yahooToken.substring(0, 20) + '...');
    
    // Verify the token works by getting current user
    const getCurrentUser = await request.get(url + '/auth/me', {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + yahooToken,
        }
    });

    expect(getCurrentUser.status()).toBe(200);
    expect(getCurrentUser.ok()).toBeTruthy();
    console.log('✅ Yahoo token verified successfully');
    
    const currentUser = await getCurrentUser.json();
    console.log('Yahoo User:', currentUser);
    expect(currentUser.user.email).toBe(yahoo.email);
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

test('Fetch the Events api by yahoo user and verify the response', async ({ request,page }) => {

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
            "Authorization": "Bearer " + yahooToken,
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
    console.log('Pavan Event ID:', Eventid);

    //Get the Event by Eventid
    const eventid = await request.get(url + '/events', {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + yahooToken,
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
            "Authorization": "Bearer " + yahooToken,
        }
    });

    expect(invalidevent.status()).toBe(404);
    expect(invalidevent.ok()).toBeFalsy();
    console.log('404 Event Not Found');

    const invalid = await invalidevent.json();
    expect(invalid.error).toBe("Event with id 12222222222 not found");
    console.log(invalid.error);

    const booking ={
  eventId: Eventid,
  customerName: "Luxor Test",
  customerEmail: "tester@yahoo.com",
  customerPhone: "+91-9876543210",
  quantity: 1
};

    //Create a new Booking
    console.log('booking',booking);
    const createBooking = await request.post(url + '/bookings', {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + yahooToken,
        },
        data: booking,
    });

    expect(createBooking.status()).toBe(201);
    expect(createBooking.ok()).toBeTruthy();
    console.log('201 Booking confirmed');

    const bookingdetails = await createBooking.json();
    console.log(bookingdetails);
    expect(bookingdetails.message).toBe("Booking confirmed!");
    expect(bookingdetails.data.customerName).toBe("Luxor Test");
    yahooid = bookingdetails.data.id;
    console.log('Yahoo ID:', yahooid);

    //Login as gmail user 
    await loginAndGoToBookings(page);

    //Navigate directly to specified url
    await page.goto(`${url}/bookings/${yahooid}`);
    await page.waitForLoadState('networkidle');
    await page.pause();

    //Verify Validation access is denied
    await expect(page.getByText('{"success":false,"error":"Unauthorized"}')).toBeVisible();
    console.log('✅ Validation access is denied');
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