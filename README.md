# Reviews API Service
Project Atelier's Reviews API Service is responsible for CRUD operations pertaining to data for Ratings and Reviews.

## Table of Contents
  - <a href='#usage'>Usage</a>
  - <a href='#installation'>Installation</a>
  - <a href='#other-services'>Other Services</a>

---
## Usage
  ### List Reviews
  Returns a list of reviews for a particular product. This list does not include any reported reviews.
  
  `GET /reviews/`
  
  Query Parameters
  
| Parameter	 | Type      | Description                                               |
| ---------- | :-------: | --------------------------------------------------------- |
| page       |  integer  | Selects the page of results to return. Default 1.         |
| count      |  integer  | Specifies how many results per page to return. Default 5. |
| sort	     |  text  	 | Changes the sort order of reviews to be based on "newest", "helpful", or "relevant" |
| product_id |  integer  | Specifies the product for which to retrieve reviews. |


  
  ### Get Review Metadata
  ### Add a Review
  ### Mark Review as Helpful
  ### Report Review

---
## Installation
  <!-- TODO: Flesh Out Installation -->
  To access the service:
  1. clone the repository
  2. run  `npm install` to install all dependencies
  3. run `npm start` to start the server

---
## Other Services
Please reference the Products and Questions & Answers API Services that make up the Project Atelier API:
  - <a href='https://github.com/rpp33-sdc-violet/Overview'>Products</a> by Neen Aroonrerk
  - <a href='https://github.com/rpp33-sdc-violet/questions-answers'>Questions & Answers</a> by Thao Nguyen
