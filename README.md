# salus-backend

The salus app backend for an application managing the sale of DNA kits products, including user, partner and admin role, as well as earning, chat, news, blogs, recipe, podcast and for admin dashboard functionality.

## Key Features:

### User can

- signup
- login
- update profile details like - avatar, name etc.
- buy DNA testing product
- chat with partner for order
- watch, like, comment on news, blogs, recipe, podcast

### Partner can

- register
- login
- update profile details like - avatar, name etc.
- create, read, update and delete DNA testing product
- Handle order status - pending, approve, shipped, delivered.
- Check the total earnings past 1 month, 6 month, 1 year or all time.
- chat with partner and admin for order
- create news, blogs, recipe, podcast for promotion of product
- much more features

### Admin can

- register
- login
- update profile details like - avatar, name etc.
- accept or reject, if accept then update and delete DNA testing product of partner
- Analytics dashboard has all information
- Check the total transaction earning past 1 month, 6 month, 1 year or all time.
- chat with partner for product
- accept or reject the news, blogs, recipe, podcast for promotion of parter product
- much more features

Project made by using the standard practice like JWT, bcrypt, access tokens, refresh tokens, and much more.

## Schema

[Model Link](https://www.dbdiagram.io/d/Nutrigenomics-66697a22a179551be6b0757f)

## Tech Stack

Server: node.js, express.js, jwt, bcrypt

Database: mongodb, mongoose
