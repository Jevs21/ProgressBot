INSERT INTO user (user_id, username) VALUES (1, "Clyde");
INSERT INTO user (user_id, username) VALUES (2, "Bonnie");

INSERT INTO work_log (user_id, work_done, created_at)
VALUES (1, "Added a small feature", date('now', '-1 day'));
INSERT INTO work_log (user_id, work_done, created_at)
VALUES (2, "Tested some things", date('now', '-1 day'));
INSERT INTO work_log (user_id, work_done, created_at)
VALUES (1, "Refactored code", date('now', '-1 day'));
INSERT INTO work_log (user_id, work_done, created_at)
VALUES (2, "Pushed to master", date('now', '-1 day'));
