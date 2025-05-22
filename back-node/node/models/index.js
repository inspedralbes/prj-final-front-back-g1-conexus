import sequelize from "../config/database.js";
import User from "./User.js";
import Room from "./Room.js";
import LostObject from "./LostObjects.js";
import Grade from "./Grade.js";
import Assistance from "./Assistence.js";
import RoomReservation from "./RoomReservation.js";
import TypeUser from "./TypeUser.js";
import Response from "./Response.js";
import Department from "./Department.js";
import Report from "./Reports.js";
import Course from "./Course.js";
import UserCourse from "./UserCourse.js";
import Task from "./Task.js";
import CateenItem from "./CanteenItem.js";

User.belongsTo(TypeUser, { as: 'typeusers', foreignKey: 'typeUsers_id' });
TypeUser.hasMany(User, { as: 'typeusers', foreignKey: 'typeUsers_id' });

User.belongsTo(Department, { foreignKey: 'department_id' });
Department.hasMany(User, { foreignKey: 'department_id' });

Course.belongsTo(User, { foreignKey: 'course_teacher_id', as: 'teacher' });
User.hasMany(Course, { foreignKey: 'course_teacher_id', as: 'coursesTeaching' });

Course.belongsTo(Department, { foreignKey: 'course_department_id' });
Department.hasMany(Course, { foreignKey: 'course_department_id' });

UserCourse.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(UserCourse, { foreignKey: 'user_id' });

UserCourse.belongsTo(Course, { foreignKey: 'course_id' });
Course.hasMany(UserCourse, { foreignKey: 'course_id' });

Grade.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Grade, { foreignKey: 'user_id' });

Task.belongsTo(Course, { foreignKey: 'course_id' });
Course.hasMany(Task, { foreignKey: 'course_id' });

Grade.belongsTo(Task, { foreignKey: 'task_id' });
Task.hasMany(Grade, { foreignKey: 'task_id' });

Assistance.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Assistance, { foreignKey: 'user_id' });

Assistance.belongsTo(Course, { foreignKey: 'course_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Course.hasMany(Assistance, { foreignKey: 'course_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

LostObject.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(LostObject, { foreignKey: 'user_id' });

Response.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Response, { foreignKey: 'user_id' });

Response.belongsTo(LostObject, { foreignKey: 'lostAndFound_id' });
LostObject.hasMany(Response, { foreignKey: 'lostAndFound_id' });

RoomReservation.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(RoomReservation, { foreignKey: 'user_id' });

RoomReservation.belongsTo(Room, { foreignKey: 'room_id' });
Room.hasMany(RoomReservation, { foreignKey: 'room_id' });

Report.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Report, { foreignKey: 'user_id' });

Report.belongsTo(Room, { foreignKey: 'room_id' });
Room.hasMany(Report, { foreignKey: 'room_id' });

await sequelize.sync();

export {
    sequelize,
    User,
    Room,
    LostObject,
    Grade,
    Assistance,
    RoomReservation,
    TypeUser,
    Response,
    Department,
    Report,
    Course,
    UserCourse,
    CateenItem
};