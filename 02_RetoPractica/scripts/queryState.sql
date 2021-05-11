create database MindCommerce;
use MindCommerce;
create table Core_State (
Id int primary key,
ShortName varchar (50),
LongName varchar (100),
CountryId int,
GeoId int
)