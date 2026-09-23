# Admin-Education — Backend API

Node.js / Express / MongoDB backend for an education admin panel. It manages three resources — admin users, "conferences" (referred to in code/routes as `data`), and `courses` — and stores uploaded images on Cloudinary.

This document is intended to give a frontend integrator (human or AI) everything needed to call this API correctly, including quirks in the current implementation that are easy to miss by reading route names alone.

## Tech Stack

- **Runtime:** Node.js, Express 4
- **Database:** MongoDB via Mongoose 7
- **File storage:** Cloudinary (via `multer` + `multer-storage-cloudinary`)
- **Email:** Nodemailer (Gmail transport) — used for OTP emails
- **Dev server:** `nodemon`
- **Deployment:** Vercel (see `vercel.json`)
- **CORS:** fully open — `cors()` is used with no options, so all origins are allowed and no credentials/cookie config is in place.

## Project Structure

```
index.js              # App entry point: express setup, cloudinary/multer config, ALL routes are defined here
controller/
  user.js             # Route handler logic for every route (despite the filename, it covers users, conferences, and courses)
models/
  user.js             # Mongoose model "Admins" (collection: admins)
  data.js             # Mongoose model "Conferences" (collection: conferences) — this is the "data"/conference resource
  courses.js          # Mongoose model "Courses" (collection: courses)
vercel.json           # Vercel deployment config (routes all traffic to index.js)
.env                  # Environment variables (not committed with real values — see below)
```

There is no router-level separation — every endpoint is registered directly on the `app` object in [index.js](index.js), and most handlers live in [controller/user.js](controller/user.js). A few upload-handling routes (`/storing-data`, `/update/:id`, `/storing-course`, `/update-course/:id`) are defined inline in `index.js` instead of the controller.

## Environment Variables

Create a `.env` file in the project root with:

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `PORT` | Port to run the server on (optional, defaults to `5000`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `PUBLIC_ID` | Passed to Cloudinary config as `public_Id` (not a standard Cloudinary SDK option, currently unused effectively) |

All uploaded images are stored under the Cloudinary folder `AdminData`, regardless of resource type (conference image vs. course images).

## Running Locally

```bash
npm install
npm start        # runs `nodemon index.js`
```

The server logs `The server is runing on PORT <PORT>` once the DB connects. There is no build step — it's plain CommonJS Node.

## Deployment

Deployed via Vercel using `@vercel/node`, with all routes proxied to `index.js` (see [vercel.json](vercel.json)). Environment variables must be configured in the Vercel project settings for production.

---

## Data Models

### Admins (`models/user.js`) — collection `admins`

```js
{
  name: String,      // required
  email: String,     // required
  password: String,  // required — stored in PLAIN TEXT, no hashing
  otp: Number
}
```

### Conferences (`models/data.js`) — collection `conferences`

Referred to as "data" throughout the routes and controller (`/storing-data`, `/show-data`, `DataModel`).

```js
{
  title: String,
  subTitle: String,
  startDate: String,
  endDate: String,
  country: String,
  venue: String,
  focus: String,
  details: String,
  discountHeading: String,
  discount: String,
  description_0: String,
  description_1: String,
  description_2: String,
  categoryHeading: String,
  category: String,
  category1: String,
  category2: String,
  registrationName1: String,
  registrationName2: String,
  registrationName3: String,
  registrationType1: String,
  registrationType2: String,
  registrationType3: String,
  registrationType4: String,
  registrationType5: String,
  registrationType6: String,
  registrationType7: String,
  registrationType8: String,
  registrationType9: String,
  taxDetails: String,
  note: String,
  conferenceImage: String   // Cloudinary URL, set by the server from the uploaded file
}
```

All fields are plain `String` — dates are stored as strings, not `Date` objects, and there is no schema validation (`required`) on any field except in the Admins model.

### Courses (`models/courses.js`) — collection `courses`

```js
{
  title: String,
  courseBy: String,
  courseCategoryLogo: String,   // Cloudinary URL, set by the server
  courseByLogo: String,         // Cloudinary URL, set by the server
  price: String,
  price1: String,
  price2: String,
  price3: String,
  startDate: String,
  startTime: String,
  courseDuration: String,
  focus: String,
  mode: String,
  description: String,
  description_0: String,
  description_1: String,
  description_2: String,
  bulitPoint1: String,   // NOTE: typo is intentional/existing — "bulit" not "bullet"
  bulitPoint2: String,
  bulitPoint3: String,
  bulitPoint4: String,
  bulitPoint5: String,
  bulitPoint6: String,
  bulitPoint7: String,
  bulitPoint8: String,
  bulitPoint9: String,
  bulitPoint10: String,
  courseImage: String    // Cloudinary URL, set by the server
}
```

**Important:** the field name is `bulitPoint1..10` (typo preserved from the original code), not `bulletPoint`. The frontend must match this exactly.

---

## API Reference

Base URL: whatever host the server is deployed to (e.g. `http://localhost:5000` locally). No route is prefixed with `/api` — all endpoints hang directly off `/`.

**Authentication:** none. There is no middleware checking tokens/sessions on any route. `/sign-in` returns a `token` field but it is a hardcoded literal string (`"Its a token"`), not a real JWT — it carries no meaning and nothing else validates it.

**Response status codes — read carefully:** many handlers (all of `/sign-up`, `/sign-in`, `/send-otp`, `/submit-otp`, `/storing-data`, `/storing-course`, `/delete`, `/delete-course`) use `res.send()`/`res.json()` without ever calling `.status()`, so they always return **HTTP 200** even when the payload represents a business-logic failure. The frontend must check the `code`/`status` field inside the JSON body, not the HTTP status code, to detect these failures. Only the `show-data`, `show-data/:id`, `read-course`, `read-course/:id` handlers set real HTTP status codes (200/404/500).

### Auth

#### `POST /sign-up`
Content-Type: `application/json`

Request body:
```json
{ "name": "string", "email": "string", "password": "string" }
```

Responses (HTTP 200 in all cases):
- Success: `{ "code": 200, "message": "successfully sign up" }`
- Email already registered: `{ "code": 500, "status": "error", "error": "User Exists!" }`
- Unexpected error: response shape is malformed — `res.status({ code: 500, ... })` is called instead of `res.status(500).json(...)`, so this path is likely to throw/behave unexpectedly server-side. Don't rely on a clean error body here; treat any non-2xx-looking body or a network failure the same way.

Password is stored **in plain text**, with no hashing.

#### `POST /sign-in`
Content-Type: `application/json`

Request body:
```json
{ "email": "string", "password": "string" }
```

Responses (HTTP 200 in all cases):
- Success: `{ "email": "...", "name": "...", "code": 200, "message": "successfully found user", "token": "Its a token" }`
- Wrong password: `{ "code": 404, "message": "sign in failed password is wrong" }`
- User not found (email doesn't exist — the `.findOne` resolves to `null`, and accessing `result.password` will throw, which is caught): `{ "code": 500, "message": "sign in failed user not found" }`

`token` is a static placeholder, not usable for authorization on any other route.

#### `POST /send-otp`
Content-Type: `application/json`

Request body:
```json
{ "email": "string" }
```

**Known bug:** OTP is generated via `Math.floor(Math.random * 100000)` (missing the `()` on `Math.random`), which evaluates to `NaN`. The email sent to the user will contain `NaN` as the OTP, and `NaN` is what's stored on the user's `otp` field. This endpoint is effectively broken for producing a usable OTP — do not build a frontend flow that depends on receiving a real numeric OTP by email without fixing this server-side first.

Also note: SMTP credentials are currently **hardcoded in the controller source** (`controller/user.js`), not read from environment variables — a security issue worth flagging if you're maintaining this codebase.

#### `POST /submit-otp`
Content-Type: `application/json`

Request body:
```json
{ "otp": "value" }
```

**Known bug:** this handler does not actually compare the submitted OTP against a stored value in any meaningful way — it looks up a user `where otp == req.body.otp` and, if found, unconditionally responds success. It never updates the password despite the message saying so. Response:
- Found a user with matching `otp`: `{ "code": 200, "message": "Password Updated successfully" }`
- No match: `{ "code": 500, "message": "something went wrong" }`

There is no actual "reset password" logic implemented anywhere in this codebase — treat the OTP flow as non-functional/placeholder.

### Conferences ("Data")

#### `POST /storing-data`
Content-Type: `multipart/form-data`

Form fields:
- `conferenceImage` — **file**, single, required (the handler branches on `req.file` and does nothing/logs an error with no response sent if it's missing — the request will hang/timeout on the client if no file is attached)
- All other Conferences fields as plain text form fields: `title`, `subTitle`, `startDate`, `endDate`, `country`, `venue`, `focus`, `details`, `discountHeading`, `discount`, `description_0`, `description_1`, `description_2`, `categoryHeading`, `category`, `category1`, `category2`, `registrationName1..3`, `registrationType1..9`, `taxDetails`, `note`

Response: `{ "status": "ok" }` on success, or `{ "status": <mongoose error object> }` on failure (HTTP 200 either way).

#### `PUT /update/:id`
Content-Type: `multipart/form-data`

Same fields as above. **A new `conferenceImage` file is required on every update** — the handler does `req.file.path` unconditionally, so calling this without attaching a file will throw a server error (caught, returns `{ error, msg: "Something went wrong..!" }`, HTTP 200). There is no way to update a conference's other fields without re-uploading an image.

Response: plain text `"Updated successfully"` on success.

#### `GET /show-data`
Returns all conferences.

Response (HTTP 200):
```json
{ "success": true, "allTasks": [ /* array of Conference documents */ ] }
```
On error: HTTP 404 or 500 with `{ "success": false, "message": "...", "error": ... }`.

#### `GET /show-data/:id`
Returns a single conference by Mongo `_id`.

Response shape is identical to `/show-data` but `allTasks` is a single object (not an array), and will be `null` inside a 200 response if the id doesn't exist (Mongoose `findById` resolving to `null` is not treated as an error by this handler).

#### `POST /delete`
Content-Type: `application/json`

Request body:
```json
{ "newsid": "conference _id" }
```

Response: `{ "status": "ok", "data": "Deleted!" }` — note this is returned even if no document matched that id (Mongoose `deleteOne` doesn't error on zero matches).

### Courses

#### `POST /storing-course`
Content-Type: `multipart/form-data`

Form fields:
- `courseCategoryLogo` — file, required
- `courseByLogo` — file, required
- `courseImage` — file, required
- All other Courses fields as plain text: `title`, `courseBy`, `price`, `price1`, `price2`, `price3`, `startDate`, `startTime`, `courseDuration`, `focus`, `mode`, `description`, `description_0`, `description_1`, `description_2`, `bulitPoint1..10`

**Important implementation detail:** the server maps uploaded files to model fields by **positional index**, not by field name (`Object.values(req.files)[0]`, `[1]`, `[2]`), relying on the fixed declaration order in `multer.fields([...])`:
1. `courseCategoryLogo` → index 0
2. `courseByLogo` → index 1
3. `courseImage` → index 2

All three files are required on every request — if any is missing the handler logs an error and sends no response (client-side request will hang).

Response: `{ "status": "ok" }` on success.

#### `PUT /update-course/:id`
Content-Type: `multipart/form-data`

Same fields/positional-index behavior as `/storing-course`. **All three files must be re-uploaded on every update** — there's no partial-update path for images.

Response: plain text `"Updated successfully"`.

#### `POST /delete-course`
Content-Type: `application/json`

Request body:
```json
{ "newsid": "course _id" }
```

Response: `{ "status": "ok", "data": "Deleted!" }`.

#### `GET /read-course`
Returns all courses. Response shape identical to `/show-data`: `{ "success": true, "allTasks": [ /* Course documents */ ] }`.

#### `GET /read-course/:id`
Returns a single course by id. Same shape, `allTasks` is a single object (or `null` in a 200 if not found).

---

## Known Issues / Gotchas Worth Knowing Before Integrating

- **No authentication/authorization** on any route — anyone with the base URL can read/write/delete all data.
- **Passwords stored in plain text**, no hashing (bcrypt etc. not used).
- **HTTP status codes are unreliable** for most write endpoints — always check the JSON body's `code`/`status` field instead (see "Response status codes" above).
- **OTP / password-reset flow is non-functional** (`Math.random` bug, no real comparison, no password update logic).
- **File uploads are required on every update**, not just create, for both conferences and courses — there's no way to PATCH text fields alone.
- **Course file-to-field mapping is positional**, tied to the exact order of fields passed to `multer.fields()` in [index.js](index.js) — if that array's order ever changes, uploaded images will silently attach to the wrong field.
- **`bulitPoint1..10`** on the Courses model is a typo kept as-is; don't "fix" it to `bulletPoint` on the frontend without also changing it server-side.
- **CORS is wide open** (`cors()` with no config) — fine for a trusted internal admin tool, but means there is no origin restriction at all.
- Mongoose schemas have essentially **no validation** beyond the Admins model's `required: true` — most string fields can be omitted or malformed with no error.
