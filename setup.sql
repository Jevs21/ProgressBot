create table if not exists user(
    id integer primary key,
    user_id text not null,
    username text
);

create table if not exists work_log(
    id integer primary key,
    user_id text not null,
    work_done text,
    created_at datetime default CURRENT_TIMESTAMP,
    foreign key(user_id) references 'user'(user_id)
);
