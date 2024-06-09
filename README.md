# FinTrack

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Features](#features)
* [Setup](#setup)

## General info

This project is a web application that allows users to effectively manage their personal finances. The key feature of this application is the use of PWA technology, enabling users to access it offline thanks to its content caching capabilities.

![](demo-fin-track.gif)

## Technologies
Project is created with:
* Next.js: 13.5.4
* SAAS: 1.69.5
* PWA: 5.6.0
* Nest.js: 10.0.0
* MySQL: 3.6.5
* Sequelize: 6.35.1

## Features

The web application provides the following features:
- [x] User registration and authorization (personal data and Google); 
- [x] Adding/deleting/editing income and expense categories; 
- [x] Adding/deleting/editing income and expense transactions; 
- [x] Adding/deleting financial events; 
- [x] Reviewing income and expense statistics; 
- [x] Viewing the history of income and expense transactions; 
- [x] Reviewing added financial events; 
- [x] Receiving notifications (reminders) about financial events.

## Setup

To run this project, install it locally using npm:

```
$ npm install
$ cd backend
$ npm start
$ cd ../frontend
$ npm start
```
