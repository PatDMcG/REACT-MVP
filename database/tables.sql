
drop table if exists MainGoals CASCADE;
drop table if exists SubGoals;

create table MainGoals(
    Title varchar, 
    id serial Primary KEY
);

create table SubGoals(
    Title varchar, 
    id serial Primary KEY,
    Complete boolean,
    Parent int,
     FOREIGN KEY(Parent) 
   REFERENCES MainGoals(id)
   ON DELETE CASCADE



);
