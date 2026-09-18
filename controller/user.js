const UserModel = require('../models/user');
const DataModel = require('../models/data');
const CourseModel = require('../models/courses');
const BlogModel = require('../models/blog');
const nodemailer = require('nodemailer')

module.exports.signup = async (req, res) => {
    // console.log("hi i am signing up here...! in console");
    console.log(req.body);
    const { name, email, password } = req.body;
    try {
        const olduser = await UserModel.findOne({ email });
        if (olduser) {
            return res.json({ code: 500, status: "error", error: "User Exists!" })
        }
        await UserModel.create({
            name,
            email,
            password,
        });
        res.send({ code: 200, message: 'successfully sign up' })

        // res.status({ code: 500, message: err })

        // res.send('hi i am signing up here on web...!');
    } catch (error) {
        res.status({ code: 500, status: "error", message: error })
    }
}

module.exports.storedata = async(req, res) => {

    console.log(req.files);
    if (req.files) {
        console.log("files uploaded")
        console.log(req.files)
        console.log(req.body)
        const imageNames = req.files
        // console.log("Print", Object.values(imageNames))
        const DataValues = Object.values(imageNames)
        // console.log("data", DataValues[0][0].filename)
        // console.log(req.files.file2.filename)
        // try {
        //     await ImageModel.create({
        //         file1: DataValues[0][0].filename,
        //         file2: DataValues[1][0].filename,
        //         file3: DataValues[2][0].filename,
        //         title: req.body.title,
        //         courseBy: req.body.courseBy
        //     })
        //     res.json({ status: "ok" })
        // } catch (error) {
        //     console.log(error)
        //     res.json({ status: error })
        // }
    }
    else {
        console.log("error uploading images")
    }



    // const newData = new DataModel({
    //     title: req.body.title,
    //     subTitle: req.body.subTitle,
    //     startDate: req.body.startDate,
    //     endDate: req.body.endDate,
    //     country: req.body.country,
    //     venue: req.body.venue,
    //     focus: req.body.focus,
    //     details: req.body.details,
    //     discount: req.body.discount,
    //     description_0: req.body.description_0,
    //     description_1: req.body.description_1,
    //     description_2: req.body.description_2,
    //     category: req.body.category,
    //     category1: req.body.category1,
    //     category2: req.body.category2,
    //     registrationName1: req.body.registrationName1,
    //     registrationName2: req.body.registrationName2,
    //     registrationName3: req.body.registrationName3,
    //     registrationType1: req.body.registrationType1,
    //     registrationType2: req.body.registrationType2,
    //     registrationType3: req.body.registrationType3,
    //     registrationType4: req.body.registrationType4,
    //     registrationType5: req.body.registrationType5,
    //     registrationType6: req.body.registrationType6,
    //     registrationType7: req.body.registrationType7,
    //     registrationType8: req.body.registrationType8,
    //     registrationType9: req.body.registrationType9,
    //     taxDetails: req.body.taxDetails,
    //     conferenceImage: req.body.conferenceImage,
    // });
    // newData.save().then(() => {
    //     return (
    //         res.send({ code: 200, message: 'successfully stored data' }),
    //         console.log(newData)
    //     )
    // }).catch((err) => {
    //     // return res.send({ code: 500, message: 'storing data failed' })
    //     return res.status({ code: 500, message: err })
    // });
    // // return res.send('hi i am storing data from here on web...!');
}

module.exports.signin = (req, res) => {
    console.log(req.body.email);
    // email check..
    UserModel.findOne({ email: req.body.email }).then(result => {
        console.log(result, 'check');
        // and password match check
        if (result.password !== req.body.password) {
            res.send({ code: 404, message: 'sign in failed password is wrong' })
        } else {
            res.send({ email: result.email, name: result.name, code: 200, message: 'successfully found user', token: 'Its a token' })
            return;//add on
        }
        res.send({ code: 200, message: 'successfully found user' })
    }).catch((err) => {
        res.send({ code: 500, message: 'sign in failed user not found' })
    });
}
module.exports.sendotp = (req, res) => {
    console.log(req.body);
    const _otp = Math.floor(Math.random * 100000);
    // const otp = '48789';
    //send to user mail
    UserModel.findOne({ email: req.body.email }).then(result => {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'wasayiedge@gmail.com',
                pass: 'a*wmongoa*wnn'
            }
        })
        let info = transporter.sendMail({
            from: 'wasayiedge@gmail.com', // sender address
            to: req.body.email,
            subject: "OTP", // Subject line
            text: _otp, // plain text body
        })
        if (info.messageId) {
            UserModel.updateOne({ email: result.email }, { otp: _otp })
                .then(result => {
                    res.send({ code: 200, message: 'successfully found user OTP SENT' });
                }).catch((err) => {
                    res.send({ code: 500, message: 'sever error' })
                });

        } else {
            res.send({ code: 500, message: 'something went wrong' });
        }
        //save in db
    }).catch((err) => {
        res.send({ code: 500, message: 'User not found' })
    });

}
module.exports.submitotp = (req, res) => {
    // console.log(req.body);
    // const otp = Math.floor(Math.random);
    const otp = '48789';
    //  update password
    UserModel.findOne({ otp: req.body.otp }).then(result => {
        res.send({ code: 200, message: 'Password Updated successfully' })
    }).catch((err) => {
        res.send({ code: 500, message: 'something went wrong' })
    });
}
module.exports.showdata = async (req, res) => {
    try {
        await DataModel.find()
            .then((allTasks) => {
                // res.header("Access-Control-Allow-Origin", "*")
                res.status(200)
                    .json({
                        success: true,
                        allTasks
                    })
            })
            .catch((error) => {
                res.status(404)
                    .json({
                        success: false,
                        message: "Cant fined ",
                        error
                    })
            })
    } catch (error) {
        res.status(500)
            .json({
                success: false,
                message: "Internal server error",
                error: error.message
            })
    }
}
// module.exports.showdata = async (req, res) => {
//     const users = await DataModel.find({});
//     try {
//         response.send(users);
//     } catch (error) {
//         response.status(500).send(error);
//     }
//     //     .then((allTasks) => {
//     //     // res.header("Access-Control-Allow-Origin", "*")
//     //     res.status(200)
//     //         .json({
//     //             success: true,
//     //             allTasks
//     //         })
//     // })
//     //     .catch((error) => {
//     //         res.status(404)
//     //             .json({
//     //                 success: false,
//     //                 message: "Cant fined ",
//     //                 error
//     //             })
//     //     })
//     // } catch (error) {
//     //     res.status(500)
//     //         .json({
//     //             success: false,
//     //             message: "Internal server error",
//     //             error: error.message
//     //         })
//     // }
// }
module.exports.showdatabyid = async (req, res) => {
    try {
        await DataModel.findById(req.params.id)
            .then((allTasks) => {
                res.status(200)
                    .json({
                        success: true,
                        allTasks
                    })
            })
            .catch((error) => {
                res.status(404)
                    .json({
                        success: false,
                        message: "Cant fined ",
                        error
                    })
            })
    } catch (error) {
        res.status(500)
            .json({
                success: false,
                message: "Internal server error",
                error: error.message
            })
    }
}

// module.exports.updatedata = async (req, res) => {

//     DataModel.findByIdAndUpdate(req.params.id, req.body)
//         .then(() => res.send("Updated successfully"))
//         .catch((err) => {
//             console.log(err);
//             res.send({ error: err, msg: "Something went wrong..!" })
//         });
// };

module.exports.deletedata = async (req, res) => {
    const { newsid } = req.body;
    try {
        await DataModel.deleteOne({ _id: `${newsid}` }).then(() => res.send({ status: "ok", data: "Deleted!" }))
    } catch (error) {
        console.log("error deleting:", error);
    }
}

// module.exports.storecourse = (req, res) => {
//     // console.log("hi i am storing data from  here...! in console");
//     // console.log(req.body);
//     const newCourse = new CourseModel({
//         title: req.body.title,
//         courseBy: req.body.courseBy,
//         courseCategoryLogo: req.body.courseCategoryLogo,
//         courseByLogo: req.body.courseByLogo,
//         price: req.body.price,
//         price1: req.body.price1,
//         price2: req.body.price2,
//         price3: req.body.price3,
//         startDate: req.body.startDate,
//         courseDuration: req.body.courseDuration,
//         focus: req.body.focus,
//         mode: req.body.mode,
//         description: req.body.description,
//         description_0: req.body.description_0,
//         description_1: req.body.description_1,
//         description_2: req.body.description_2,
//         bulitPoint1: req.body.bulitPoint1,
//         bulitPoint2: req.body.bulitPoint2,
//         bulitPoint3: req.body.bulitPoint3,
//         bulitPoint4: req.body.bulitPoint4,
//         bulitPoint5: req.body.bulitPoint5,
//         bulitPoint6: req.body.bulitPoint6,
//         bulitPoint7: req.body.bulitPoint7,
//         bulitPoint8: req.body.bulitPoint8,
//         bulitPoint9: req.body.bulitPoint9,
//         bulitPoint10: req.body.bulitPoint10,
//         courseImage: req.body.courseImage,
//     });
//     newCourse.save().then(() => {
//         return (
//             res.send({ code: 200, message: 'successfully stored Course' }),
//             console.log(newCourse)
//         )
//     }).catch((err) => {
//         // return res.send({ code: 500, message: 'storing data failed' })
//         return res.status({ code: 500, message: err })
//     });
//     return res.send('storing data...!');
// }

module.exports.updateCourse = async (req, res) => {

    CourseModel.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.send("Updated successfully"))
        .catch((err) => {
            console.log(err);
            res.send({ error: err, msg: "Something went wrong..!" })
        });
};

module.exports.deleteCourse = async (req, res) => {
    const { newsid } = req.body;
    try {
        await CourseModel.deleteOne({ _id: `${newsid}` }).then(() => res.send({ status: "ok", data: "Deleted!" }))
    } catch (error) {
        console.log("error deleting:", error);
    }
}


module.exports.showCourse = async (req, res) => {
    try {
        await CourseModel.find()
            .then((allTasks) => {
                res.status(200)
                    .json({
                        success: true,
                        allTasks
                    })
            })
            .catch((error) => {
                res.status(404)
                    .json({
                        success: false,
                        message: "Cant fined ",
                        error
                    })
            })
    } catch (error) {
        res.status(500)
            .json({
                success: false,
                message: "Internal server error",
                error: error.message
            })
    }
}
module.exports.showCourseById = async (req, res) => {
    try {
        await CourseModel.findById(req.params.id)
            .then((allTasks) => {
                res.status(200)
                    .json({
                        success: true,
                        allTasks
                    })
            })
            .catch((error) => {
                res.status(404)
                    .json({
                        success: false,
                        message: "Cant fined ",
                        error
                    })
            })
    } catch (error) {
        res.status(500)
            .json({
                success: false,
                message: "Internal server error",
                error: error.message
            })
    }
}

module.exports.deleteBlog = async (req, res) => {
    const { newsid } = req.body;
    try {
        await BlogModel.deleteOne({ _id: `${newsid}` }).then(() => res.send({ status: "ok", data: "Deleted!" }))
    } catch (error) {
        console.log("error deleting:", error);
    }
}

module.exports.showBlogs = async (req, res) => {
    try {
        await BlogModel.find()
            .then((allTasks) => {
                res.status(200)
                    .json({
                        success: true,
                        allTasks
                    })
            })
            .catch((error) => {
                res.status(404)
                    .json({
                        success: false,
                        message: "Cant fined ",
                        error
                    })
            })
    } catch (error) {
        res.status(500)
            .json({
                success: false,
                message: "Internal server error",
                error: error.message
            })
    }
}
module.exports.showBlogById = async (req, res) => {
    try {
        await BlogModel.findById(req.params.id)
            .then((allTasks) => {
                res.status(200)
                    .json({
                        success: true,
                        allTasks
                    })
            })
            .catch((error) => {
                res.status(404)
                    .json({
                        success: false,
                        message: "Cant fined ",
                        error
                    })
            })
    } catch (error) {
        res.status(500)
            .json({
                success: false,
                message: "Internal server error",
                error: error.message
            })
    }
}