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

  Response: `Status: 200 OK`
  
  ```json
  {
    "product": "71700",
    "page": 0,
    "count": 5,
    "results": [
        {
            "review_id": 1254288,
            "rating": 5,
            "summary": "These pants are great!",
            "recommend": true,
            "response": "",
            "body": "I really like these pants. Best fit ever!",
            "date": "2019-02-18T00:00:00.000Z",
            "reviewer_name": "figuringitout",
            "helpfulness": 6,
            "photos": [
                {
                    "id": 2414651,
                    "url": "https://images.unsplash.com/photo-1542574621-e088a4464f7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3028&q=80"
                }
            ]
        },
        {
            "review_id": 1254289,
            "rating": 2,
            "summary": "These pants are ok!",
            "recommend": false,
            "response": "",
            "body": "A little tight on the waist.",
            "date": "2019-01-05T00:00:00.000Z",
            "reviewer_name": "bigbrother",
            "helpfulness": 6,
            "photos": [
                {
                    "id": 2414654,
                    "url": "https://images.unsplash.com/photo-1560829675-11dec1d78930?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1652&q=80"
                },
                {
                    "id": 2414655,
                    "url": "https://images.unsplash.com/photo-1549812474-c3cbd9a42eb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
                }
            ]
        },
        {
            "review_id": 1254287,
            "rating": 4,
            "summary": "These pants are fine",
            "recommend": true,
            "response": "",
            "body": "I do like these pants",
            "date": "2019-03-21T00:00:00.000Z",
            "reviewer_name": "shopaddict",
            "helpfulness": 2,
            "photos": []
        }
    ]
}
```
  
  ### Get Review Metadata
  Returns review metadata for a given product.
  
  `GET /reviews/meta`
  
  Query Parameters
  
  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | product_id |  integer  | Required ID of the product for which data should be returned |

  Response: `Status: 200 OK`

```json
{
    "product_id": "71700",
    "ratings": {
        "2": "1",
        "4": "1",
        "5": "1"
    },
    "recommended": {
        "false": "1",
        "true": "2"
    },
    "characteristics": {
        "Fit": {
            "id": 240591,
            "value": "3.6666666666666667"
        },
        "Length": {
            "id": 240592,
            "value": "3.6666666666666667"
        },
        "Comfort": {
            "id": 240593,
            "value": "3.6666666666666667"
        },
        "Quality": {
            "id": 240594,
            "value": "3.6666666666666667"
        }
    }
}
```

  ### Add a Review
  Adds a review for the given product.
  
  `POST /reviews`
  
  Body Parameters
| Parameter	| Type |	Description |
| ---------- | :-------: | --------------------------------------------------------- |
|product_id     	| integer	| Required ID of the product to post the review for |
|rating	          | integer	| Integer (1-5) indicating the review rating |
|summary	        |text     |	Summary text of the review|
|body	            |text	    |Continued or full text of the review|
|recommend      	|boolean	|Value indicating if the reviewer recommends the product|
|name             |	text    |	Username for question asker|
|email      	    |text   	|Email address for question asker|
|photos   	      |[text]   |	Array of text urls that link to images to be shown|
|characteristics	|object	  |Object of keys representing characteristic_id and values representing the review value for that characteristic. { "14": 5, "15": 5 //...} |
  
  Response: `Status: 201 CREATED`
  
  ### Mark Review as Helpful
  Updates a review to show it was found helpful.
  
  `PUT /reviews/:review_id/helpful`
  
  Parameters
  
  | Parameter	| Type |	Description |
  | ---------- | :-------: | --------------------------------------------------------- |
  | reveiw_id	| integer	 | Required ID of the review to update |

Response: `Status: 204 NO CONTENT`

  
  ### Report Review
  Updates a review to show it was reported. Note, this action does not delete the review, but the review will not be returned in the above GET request.
  
  `PUT /reviews/:review_id/report`
  
  Parameters
 
| Parameter |	Type |	Description |
| ---------- | :-------: | --------------------------------------------------------- |
| review_id	| integer |	Required ID of the review to update |

Response: `Status: 204 NO CONTENT`

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
