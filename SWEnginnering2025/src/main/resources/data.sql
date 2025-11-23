-- ---- USER DATA ---------------------------------------------------------

-- 기본 사용자 한 명(로그인용)
INSERT INTO usertbl (birth, email, name, password, user_id)
VALUES ('2000-01-01', 'user1@example.com', 'User One', 'password1', 'user123');

-- H2의 IDENTITY 는 기본값이 1부터라서, 위 유저의 id = 1 이 됩니다.


-- ---- GOAL DATA ---------------------------------------------------------

-- 2025-11-05 : 영어 공부 30분 (완료)
INSERT INTO goals (description, status, target_date, title, user_id)
VALUES ('Duolingo + English news', 'DONE', DATE '2025-11-05', 'English study 30min', 1);

-- 2025-11-05 : 운동 1시간 (부분완료)
INSERT INTO goals (description, status, target_date, title, user_id)
VALUES ('Jogging or gym', 'PARTIAL', DATE '2025-11-05', 'Workout 1 hour', 1);

-- 2025-11-06 : 독서 20분 (아직 시작 안 함)
INSERT INTO goals (description, status, target_date, title, user_id)
VALUES ('Read development book', 'NOT_STARTED', DATE '2025-11-06', 'Reading 20min', 1);

-- 2025-11-07 : 개발 공부 1시간 (실패)
INSERT INTO goals (description, status, target_date, title, user_id)
VALUES ('Spring Boot practice', 'FAILED', DATE '2025-11-07', 'Dev study 1 hour', 1);
