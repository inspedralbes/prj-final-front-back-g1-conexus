import sequelize from "../config/database.js";
import User from "./User.js";
import Room from "./Room.js";
import LostObject from "./LostObjects.js";
// import Incident from "./Incident.js";
import Grade from "./Grade.js";
import Assistance from "./Assistence.js";
// import Canteen from "./Canteen.js";
import RoomReservation from "./RoomReservation.js";
import TypeUser from "./TypeUser.js";
import Response from "./Response.js";
import Department from "./Department.js";
import Report from "./Reports.js";
import Course from "./Course.js";
import UserCourse from "./UserCourse.js";

// Define relationships

// User - TypeUser relationship (Many-to-One)
User.belongsTo(TypeUser, { foreignKey: 'typesUsers_id' });
TypeUser.hasMany(User, { foreignKey: 'typesUsers_id' });

// User - Department relationship (Many-to-One)
User.belongsTo(Department, { foreignKey: 'department_id' });
Department.hasMany(User, { foreignKey: 'department_id' });

// Course - User relationship (Many-to-One) - Teacher
Course.belongsTo(User, { foreignKey: 'course_teacher_id', as: 'teacher' });
User.hasMany(Course, { foreignKey: 'course_teacher_id', as: 'coursesTeaching' });

// Course - Department relationship (Many-to-One)
Course.belongsTo(Department, { foreignKey: 'course_department_id' });
Department.hasMany(Course, { foreignKey: 'course_department_id' });

// UserCourse - User relationship (Many-to-One)
UserCourse.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(UserCourse, { foreignKey: 'user_id' });

// UserCourse - Course relationship (Many-to-One)
UserCourse.belongsTo(Course, { foreignKey: 'course_id' });
Course.hasMany(UserCourse, { foreignKey: 'course_id' });

// Grade - User relationship (Many-to-One)
Grade.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Grade, { foreignKey: 'user_id' });

// Grade - Course relationship (Many-to-One)
Grade.belongsTo(Course, { foreignKey: 'course_id' });
Course.hasMany(Grade, { foreignKey: 'course_id' });

// Assistance - User relationship (Many-to-One)
Assistance.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Assistance, { foreignKey: 'user_id' });

// Assistance - Course relationship (Many-to-One)
Assistance.belongsTo(Course, { foreignKey: 'course_id' });
Course.hasMany(Assistance, { foreignKey: 'course_id' });

// LostObject - User relationship (Many-to-One)
LostObject.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(LostObject, { foreignKey: 'user_id' });

// Response - User relationship (Many-to-One)
Response.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Response, { foreignKey: 'user_id' });

// Response - LostObject relationship (Many-to-One)
Response.belongsTo(LostObject, { foreignKey: 'lostAndFound_id' });
LostObject.hasMany(Response, { foreignKey: 'lostAndFound_id' });

// RoomReservation - User relationship (Many-to-One)
RoomReservation.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(RoomReservation, { foreignKey: 'user_id' });

// RoomReservation - Room relationship (Many-to-One)
RoomReservation.belongsTo(Room, { foreignKey: 'room_id' });
Room.hasMany(RoomReservation, { foreignKey: 'room_id' });

// Report - User relationship (Many-to-One)
Report.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Report, { foreignKey: 'user_id' });

// Report - Room relationship (Many-to-One)
Report.belongsTo(Room, { foreignKey: 'room_id' });
Room.hasMany(Report, { foreignKey: 'room_id' });

// Sync database in correct order
// await TypeUser.sync();
// await Department.sync();
// await User.sync();
// await Room.sync();
// await Course.sync();
// await UserCourse.sync();
// await Grade.sync();
// await Assistance.sync();
// await LostObject.sync();
// await Response.sync();
// await RoomReservation.sync();
// await Report.sync();

await sequelize.sync();

export {
    sequelize,
    User,
    Room,
    LostObject,
    // Incident,
    Grade,
    Assistance,
    // Canteen,
    RoomReservation,
    TypeUser,
    Response,
    Department,
    Report,
    Course,
    UserCourse
};
