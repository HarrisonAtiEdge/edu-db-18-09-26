// require('dotenv').config();
// const dns = require('dns');
// dns.setServers(['8.8.8.8', '1.1.1.1']);
// const express = require('express');
// var bodyParser = require('body-parser');
// const mongoose = require("mongoose");
// const cors = require("cors");
// const userController = require('./controller/user');
// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// app.use(cors());

// //building connection
// mongoose.set('strictQuery', false);
// let dbConnection = null;
// const connctDB = async () => {
//     if (dbConnection) return dbConnection;
//     try {
//         dbConnection = await mongoose.connect(process.env.MONGO_URI);
//         console.log(`Database connected! ${dbConnection.connection.host}`)
//         return dbConnection;
//     }
//     catch (error) {
//         console.log("failed to connect with database", error)
//         dbConnection = null;
//         throw error;
//     }
// }

// app.use(async (req, res, next) => {
//     try {
//         await connctDB();
//         next();
//     } catch (error) {
//         res.status(500).json({ status: "error", message: "Database connection failed" });
//     }
// });

// app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('hi i am new here on web...!');
// })

// const DataModel = require('./models/data');
// const CourseModel = require('./models/courses');
// const BlogModel = require('./models/blog');
// const multer = require("multer");

// // const storage = multer.diskStorage({
// //     destination: function (req, file, cb) {
// //         // cb(null, "./uploads");
// //         cb(null, "../AdminPanel-International-Education/src/images/");
// //     },
// //     filename: function (req, file, cb) {
// //         const uniqueSuffix = Date.now();
// //         cb(null, uniqueSuffix + file.originalname);
// //     },
// // });

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//     public_Id: process.env.PUBLIC_ID,
// });

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "AdminData", // Optional: Specify the folder where the files will be stored in Cloudinary
//     },
// });

// const upload = multer({ storage: storage });

// var multipleUpload = upload.fields([
//     { name: 'courseCategoryLogo' },
//     { name: 'courseByLogo' },
//     { name: 'courseImage' }
// ])

// app.post('/sign-up', userController.signup);
// app.post('/sign-in', userController.signin);
// app.post('/send-otp', userController.sendotp);
// app.post('/submit-otp', userController.submitotp);
// app.post('/storing-data', upload.array("conferenceImages", 10), async (req, res) => {

//     console.log(req.files);
//     console.log(req.body);
//     if (req.files && req.files.length) {
//         console.log("files uploaded")
//         const imageNames = req.files.map((file) => file.path)
//         try {
//             await DataModel.create({
//                 title: req.body.title,
//                 subTitle: req.body.subTitle,
//                 startDate: req.body.startDate,
//                 endDate: req.body.endDate,
//                 country: req.body.country,
//                 venue: req.body.venue,
//                 focus: req.body.focus,
//                 details: req.body.details,
//                 discountHeading: req.body.discountHeading,
//                 discount: req.body.discount,
//                 description_0: req.body.description_0,
//                 description_1: req.body.description_1,
//                 description_2: req.body.description_2,
//                 categoryHeading: req.body.categoryHeading,
//                 category: req.body.category,
//                 category1: req.body.category1,
//                 category2: req.body.category2,
//                 registrationName1: req.body.registrationName1,
//                 registrationName2: req.body.registrationName2,
//                 registrationName3: req.body.registrationName3,
//                 registrationType1: req.body.registrationType1,
//                 registrationType2: req.body.registrationType2,
//                 registrationType3: req.body.registrationType3,
//                 registrationType4: req.body.registrationType4,
//                 registrationType5: req.body.registrationType5,
//                 registrationType6: req.body.registrationType6,
//                 registrationType7: req.body.registrationType7,
//                 registrationType8: req.body.registrationType8,
//                 registrationType9: req.body.registrationType9,
//                 taxDetails: req.body.taxDetails,
//                 note: req.body.note,
//                 conferenceImage: imageNames[0],
//                 conferenceImages: imageNames,
//             })
//             res.json({ status: "ok" })
//         } catch (error) {
//             console.log(error)
//             res.json({ status: error })
//         }
//     }
//     else {
//         console.log("error uploading images")
//         res.status(400).json({ status: "error", message: "At least one conference image is required" })
//     }
// }
// );

// // app.put('/update/:id', userController.updatedata);
// app.put('/update/:id', upload.single("conferenceImage"), async (req, res) => {
//     if (req.body) {
//         console.log("files uploaded")
//         // console.log(req.file)
//         // console.log(req.body)
//         try {
//             const imageName = req.file.path
//             const updateData = {
//                 ...req.body,
//                 conferenceImage: imageName // Assuming you want to store the filename in the database
//             };
//             await DataModel.findByIdAndUpdate(req.params.id, updateData);
//             res.send("Updated successfully");
//         } catch (err) {
//             console.log(err);
//             res.send({ error: err, msg: "Something went wrong..!" });
//         }
//     }
//     else {
//         console.log("error updating")
//     }
//     // DataModel.findByIdAndUpdate(req.params.id, req.body)
//     //     .then(() => res.send("Updated successfully"))
//     //     .catch((err) => {
//     //         console.log(err);
//     //         res.send({ error: err, msg: "Something went wrong..!" })
//     //     });
// });


// app.get('/show-data', userController.showdata);
// app.get('/show-data/:id', userController.showdatabyid);
// app.post('/delete', userController.deletedata);
// // app.post('/storing-course', multipleUploadforCources, userController.storecourse);
// app.post('/storing-course', multipleUpload, async (req, res) => {
//     console.log(req.files);
//     // console.log(req.body);

//     if (req.files) {
//         console.log("files uploaded")
//         console.log(req.files)
//         console.log(req.body)
//         const imageNames = req.files
//         // console.log("Print", Object.values(imageNames))
//         const DataValues = Object.values(imageNames)
//         // console.log("data", DataValues[0][0].filename)
//         // console.log(req.files.file2.filename)
//         try {
//             await CourseModel.create({
//                 courseCategoryLogo: DataValues[0][0].path,
//                 courseByLogo: DataValues[1][0].path,
//                 courseImage: DataValues[2][0].path,
//                 title: req.body.title,
//                 courseBy: req.body.courseBy,
//                 price: req.body.price,
//                 price1: req.body.price1,
//                 price2: req.body.price2,
//                 price3: req.body.price3,
//                 startDate: req.body.startDate,
//                 startTime: req.body.startTime,
//                 courseDuration: req.body.courseDuration,
//                 focus: req.body.focus,
//                 mode: req.body.mode,
//                 description: req.body.description,
//                 description_0: req.body.description_0,
//                 description_1: req.body.description_1,
//                 description_2: req.body.description_2,
//                 bulitPoint1: req.body.bulitPoint1,
//                 bulitPoint2: req.body.bulitPoint2,
//                 bulitPoint3: req.body.bulitPoint3,
//                 bulitPoint4: req.body.bulitPoint4,
//                 bulitPoint5: req.body.bulitPoint5,
//                 bulitPoint6: req.body.bulitPoint6,
//                 bulitPoint7: req.body.bulitPoint7,
//                 bulitPoint8: req.body.bulitPoint8,
//                 bulitPoint9: req.body.bulitPoint9,
//                 bulitPoint10: req.body.bulitPoint10,
//             })
//             res.json({ status: "ok" })
//         } catch (error) {
//             console.log(error)
//             res.json({ status: error })
//         }
//     }
//     else {
//         console.log("error uploading images")
//     }
// });
// // app.put('/update-course/:id', userController.updateCourse);
// app.put('/update-course/:id', multipleUpload, async (req, res) => {
//     if (req.body) {
//         console.log("files uploaded")
//         // console.log(req.files)
//         // console.log(req.body)
//         try {
//             const imageName = req.files
//             const DataValues = Object.values(imageName)
//             console.log(DataValues)
//             const updateData = {
//                 ...req.body,
//                 courseCategoryLogo: DataValues[0][0].path,
//                 courseByLogo: DataValues[1][0].path,
//                 courseImage: DataValues[2][0].path, // Assuming you want to store the filename in the database
//             };
//             await CourseModel.findByIdAndUpdate(req.params.id, updateData);
//             res.send("Updated successfully");
//         } catch (err) {
//             console.log(err);
//             res.send({ error: err, msg: "Something went wrong..!" });
//         }
//     }
//     else {
//         console.log("error updating")
//     }
// });
// app.post('/delete-course', userController.deleteCourse);
// app.get('/read-course', userController.showCourse);
// app.get('/read-course/:id', userController.showCourseById);

// app.post('/storing-blog', upload.single("blogImage"), async (req, res) => {
//     if (req.file) {
//         console.log("file uploaded")
//         try {
//             await BlogModel.create({
//                 ...req.body,
//                 blogImage: req.file.path,
//             })
//             res.json({ status: "ok" })
//         } catch (error) {
//             console.log(error)
//             res.json({ status: error })
//         }
//     } else {
//         console.log("error uploading image")
//         res.status(400).json({ status: "error", message: "A cover image is required" })
//     }
// });
// app.put('/update-blog/:id', upload.single("blogImage"), async (req, res) => {
//     try {
//         const updateData = { ...req.body };
//         if (req.file) {
//             updateData.blogImage = req.file.path;
//         }
//         await BlogModel.findByIdAndUpdate(req.params.id, updateData);
//         res.send("Updated successfully");
//     } catch (err) {
//         console.log(err);
//         res.send({ error: err, msg: "Something went wrong..!" });
//     }
// });
// app.get('/show-blogs', userController.showBlogs);
// app.get('/show-blogs/:id', userController.showBlogById);
// app.post('/delete-blog', userController.deleteBlog);

// if (require.main === module) {
//     connctDB().then(() => {
//         app.listen(PORT, () => {
//             console.log(`The server is runing on PORT ${PORT}`);
//         })
//     })
// }

// module.exports = app;






require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express');
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require("cors");
const userController = require('./controller/user');
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

//building connection
mongoose.set('strictQuery', false);
let dbConnection = null;
const connctDB = async () => {
    if (dbConnection) return dbConnection;
    try {
        dbConnection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected! ${dbConnection.connection.host}`)
        return dbConnection;
    }
    catch (error) {
        console.log("failed to connect with database", error)
        dbConnection = null;
        throw error;
    }
}

app.use(async (req, res, next) => {
    try {
        await connctDB();
        next();
    } catch (error) {
        res.status(500).json({ status: "error", message: "Database connection failed" });
    }
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('hi i am new here on web...!');
})

const DataModel = require('./models/data');
const CourseModel = require('./models/courses');
const BlogModel = require('./models/blog');
const multer = require("multer");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         // cb(null, "./uploads");
//         cb(null, "../AdminPanel-International-Education/src/images/");
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now();
//         cb(null, uniqueSuffix + file.originalname);
//     },
// });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    public_Id: process.env.PUBLIC_ID,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "AdminData", // Optional: Specify the folder where the files will be stored in Cloudinary
    },
});

const upload = multer({ storage: storage });

var multipleUpload = upload.fields([
    { name: 'courseCategoryLogo' },
    { name: 'courseByLogo' },
    { name: 'courseImage' }
])

app.post('/sign-up', userController.signup);
app.post('/sign-in', userController.signin);
app.post('/send-otp', userController.sendotp);
app.post('/submit-otp', userController.submitotp);
app.post('/storing-data', upload.array("conferenceImages", 10), async (req, res) => {

    console.log(req.files);
    console.log(req.body);
    if (req.files && req.files.length) {
        console.log("files uploaded")
        const imageNames = req.files.map((file) => file.path)
        try {
            await DataModel.create({
                title: req.body.title,
                subTitle: req.body.subTitle,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                country: req.body.country,
                venue: req.body.venue,
                focus: req.body.focus,
                details: req.body.details,
                discountHeading: req.body.discountHeading,
                discount: req.body.discount,
                description_0: req.body.description_0,
                description_1: req.body.description_1,
                description_2: req.body.description_2,
                categoryHeading: req.body.categoryHeading,
                category: req.body.category,
                category1: req.body.category1,
                category2: req.body.category2,
                registrationName1: req.body.registrationName1,
                registrationName2: req.body.registrationName2,
                registrationName3: req.body.registrationName3,
                registrationType1: req.body.registrationType1,
                registrationType2: req.body.registrationType2,
                registrationType3: req.body.registrationType3,
                registrationType4: req.body.registrationType4,
                registrationType5: req.body.registrationType5,
                registrationType6: req.body.registrationType6,
                registrationType7: req.body.registrationType7,
                registrationType8: req.body.registrationType8,
                registrationType9: req.body.registrationType9,
                taxDetails: req.body.taxDetails,
                note: req.body.note,
                conferenceImage: imageNames[0],
                conferenceImages: imageNames,
            })
            res.json({ status: "ok" })
        } catch (error) {
            console.log(error)
            res.json({ status: error })
        }
    }
    else {
        console.log("error uploading images")
        res.status(400).json({ status: "error", message: "At least one conference image is required" })
    }
}
);

// app.put('/update/:id', userController.updatedata);
app.put('/update/:id', upload.single("conferenceImage"), async (req, res) => {
    if (req.body) {
        console.log("files uploaded")
        // console.log(req.file)
        // console.log(req.body)
        try {
            const imageName = req.file.path
            const updateData = {
                ...req.body,
                conferenceImage: imageName // Assuming you want to store the filename in the database
            };
            await DataModel.findByIdAndUpdate(req.params.id, updateData);
            res.send("Updated successfully");
        } catch (err) {
            console.log(err);
            res.send({ error: err, msg: "Something went wrong..!" });
        }
    }
    else {
        console.log("error updating")
    }
    // DataModel.findByIdAndUpdate(req.params.id, req.body)
    //     .then(() => res.send("Updated successfully"))
    //     .catch((err) => {
    //         console.log(err);
    //         res.send({ error: err, msg: "Something went wrong..!" })
    //     });
});


app.get('/show-data', userController.showdata);
app.get('/show-data/:id', userController.showdatabyid);
app.post('/delete', userController.deletedata);
// app.post('/storing-course', multipleUploadforCources, userController.storecourse);
app.post('/storing-course', multipleUpload, async (req, res) => {
    console.log(req.files);
    // console.log(req.body);

    if (req.files) {
        console.log("files uploaded")
        console.log(req.files)
        console.log(req.body)
        const imageNames = req.files
        // console.log("Print", Object.values(imageNames))
        const DataValues = Object.values(imageNames)
        // console.log("data", DataValues[0][0].filename)
        // console.log(req.files.file2.filename)
        try {
            await CourseModel.create({
                courseCategoryLogo: DataValues[0][0].path,
                courseByLogo: DataValues[1][0].path,
                courseImage: DataValues[2][0].path,
                title: req.body.title,
                courseBy: req.body.courseBy,
                price: req.body.price,
                price1: req.body.price1,
                price2: req.body.price2,
                price3: req.body.price3,
                startDate: req.body.startDate,
                startTime: req.body.startTime,
                courseDuration: req.body.courseDuration,
                focus: req.body.focus,
                mode: req.body.mode,
                description: req.body.description,
                description_0: req.body.description_0,
                description_1: req.body.description_1,
                description_2: req.body.description_2,
                bulitPoint1: req.body.bulitPoint1,
                bulitPoint2: req.body.bulitPoint2,
                bulitPoint3: req.body.bulitPoint3,
                bulitPoint4: req.body.bulitPoint4,
                bulitPoint5: req.body.bulitPoint5,
                bulitPoint6: req.body.bulitPoint6,
                bulitPoint7: req.body.bulitPoint7,
                bulitPoint8: req.body.bulitPoint8,
                bulitPoint9: req.body.bulitPoint9,
                bulitPoint10: req.body.bulitPoint10,
            })
            res.json({ status: "ok" })
        } catch (error) {
            console.log(error)
            res.json({ status: error })
        }
    }
    else {
        console.log("error uploading images")
    }
});
// app.put('/update-course/:id', userController.updateCourse);
app.put('/update-course/:id', multipleUpload, async (req, res) => {
    if (req.body) {
        console.log("files uploaded")
        // console.log(req.files)
        // console.log(req.body)
        try {
            const imageName = req.files
            const DataValues = Object.values(imageName)
            console.log(DataValues)
            const updateData = {
                ...req.body,
                courseCategoryLogo: DataValues[0][0].path,
                courseByLogo: DataValues[1][0].path,
                courseImage: DataValues[2][0].path, // Assuming you want to store the filename in the database
            };
            await CourseModel.findByIdAndUpdate(req.params.id, updateData);
            res.send("Updated successfully");
        } catch (err) {
            console.log(err);
            res.send({ error: err, msg: "Something went wrong..!" });
        }
    }
    else {
        console.log("error updating")
    }
});
app.post('/delete-course', userController.deleteCourse);
app.get('/read-course', userController.showCourse);
app.get('/read-course/:id', userController.showCourseById);

// Images are uploaded directly from the browser to Cloudinary (unsigned preset) and
// only the resulting secure URLs are sent here as plain strings. This avoids routing
// image bytes through the serverless function, which has a hard ~4.5MB request body
// limit on Vercel regardless of the bodyParser limit configured above.
app.post('/storing-blog', async (req, res) => {
    if (req.body && req.body.blogImage) {
        try {
            await BlogModel.create({ ...req.body })
            res.json({ status: "ok" })
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: "error", message: error.message })
        }
    } else {
        console.log("error uploading image")
        res.status(400).json({ status: "error", message: "A cover image is required" })
    }
});
app.put('/update-blog/:id', async (req, res) => {
    try {
        await BlogModel.findByIdAndUpdate(req.params.id, { ...req.body });
        res.send("Updated successfully");
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, msg: "Something went wrong..!" });
    }
});
app.get('/show-blogs', userController.showBlogs);
app.get('/show-blogs/:id', userController.showBlogById);
app.post('/delete-blog', userController.deleteBlog);

if (require.main === module) {
    connctDB().then(() => {
        app.listen(PORT, () => {
            console.log(`The server is runing on PORT ${PORT}`);
        })
    })
}

module.exports = app;
