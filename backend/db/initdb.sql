CREATE TABLE IF NOT EXISTS public.tasks
(
    task_name text COLLATE pg_catalog."default",
    task_id integer NOT NULL,
    user_id numeric,
    task_order numeric,
    is_complete boolean NOT NULL DEFAULT false,
    CONSTRAINT tasks_pkey PRIMARY KEY (task_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tasks
    OWNER to postgres;


CREATE TABLE IF NOT EXISTS public.users
(
    user_id numeric NOT NULL,
    display_name text COLLATE pg_catalog."default",
    username text COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (user_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;
