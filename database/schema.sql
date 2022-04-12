DROP DATABASE IF EXISTS reviews;
CREATE DATABASE reviews;

\c reviews;

CREATE TABLE review (
  review_id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  product_id INT,
  rating SMALLINT,
  summary VARCHAR,
  recommend BOOLEAN,
  response VARCHAR,
  body VARCHAR,
  date VARCHAR,
  reviewer_name VARCHAR,
  helpfulness INT,
  email VARCHAR,
  reported BOOLEAN
);

CREATE TABLE photo (
  photo_id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  url VARCHAR,
  review_id INT,
  FOREIGN KEY (review_id) 
    REFERENCES review (review_id)
    ON DELETE CASCADE
);

CREATE TABLE characteristic (
  characteristic_id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  product_id INT,
  category VARCHAR
);

CREATE TABLE reviews_characteristics (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  characteristic_id INT,
  review_id INT,
  value SMALLINT,
  FOREIGN KEY (review_id) 
    REFERENCES review (review_id)
    ON DELETE CASCADE,   
  FOREIGN KEY (characteristic_id) 
    REFERENCES characteristic (characteristic_id)
    ON DELETE CASCADE
);

CREATE INDEX idx_review_product_id ON review(product_id);
CREATE INDEX idx_photo_review_id ON photo(review_id);
CREATE INDEX idx_characteristic_product_id ON characteristic(product_id);
CREATE INDEX idx_RC_review_id ON reviews_characteristics(review_id);
CREATE INDEX idx_RC_characteristic_id ON reviews_characteristics(characteristic_id);

SELECT setval('review_review_id_seq', (SELECT MAX(review_id) FROM review));
SELECT setval('photo_photo_id_seq', (SELECT MAX(photo_id) FROM photo));
SELECT setval('reviews_characteristics_id_seq', (SELECT MAX(id) FROM reviews_characteristics));

/*  Execute this file from the command line by typing:
 *    psql -d postgres -U sdc < database/schema.sql
 *  to create the database and the tables.*/