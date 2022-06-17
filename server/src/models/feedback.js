const dbConn = require("../Common/Common");
const Feedback = function (feedback) {
    this.imageFeedback = feedback.imageFeedback;
    this.description = feedback.description;
};

const find_by_name_row_feedback = function (nameRow, value) {
    return new Promise((resolve, reject) => {
        dbConn.query(
            `SELECT * FROM feedback WHERE ${nameRow} = '${value}'`,
            (err, elements) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(elements);
                }
            }
        );
    });
};

const find_all_Feedback = () => {
    return new Promise((resolve, reject) => {
        dbConn.query(
            `SELECT * FROM feedback `,
            (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            }
        );
    });
};

const find_by_Id = (id) => {
    return new Promise((resolve, reject) => {
        dbConn.query(
            `SELECT * FROM feedback where id = '${id}'`,
            (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements[0]);
            }
        );
    });
};

const delete_By_Id = (id) => {
    return new Promise((resolve, reject) => {
        dbConn.query(
            `DELETE FROM feedback WHERE (id = '${id}');`,
            (error, elements) => {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(elements.affectedRows);
                }
            }
        );
    });
};

const InsertFeedback = function (feedbackNew) {
    return new Promise((resolve, reject) => {
        dbConn.query("Insert Into feedback SET ?", feedbackNew, (err, elements) => {
            if (err) {
                return reject(err);
            } else {
                return resolve({ id: elements.insertId, ...elements });
            }
        });
    });
};

const UpdateFeedback = function (feedbackUpdate, id) {
    return new Promise((resolve, reject) => {
        dbConn.query(
            `Update feedback SET imageFeedback = '${feedbackUpdate.imageFeedback}', description = '${feedbackUpdate.description}' WHERE (id = '${id}')`,
            (err, element) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve({ id: element.affectedRows, ...element });
                }
            }
        );
    });
};

module.exports = {
    find_by_name_row_feedback,
    find_all_Feedback,
    find_by_Id,
    delete_By_Id,
    InsertFeedback,
    UpdateFeedback,
    Feedback,
};
